import { createFileRoute } from "@tanstack/react-router";
import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import type { Json } from "@/integrations/supabase/types";

const webhookSchema = z.object({
  event: z.enum(["payment.completed", "payment.paid", "payment.failed", "payment.expired"]),
  data: z
    .object({
      transactionId: z.string().min(1),
      amount: z.coerce.number().nonnegative().optional(),
      fee: z.coerce.number().nonnegative().optional(),
      netAmount: z.coerce.number().nonnegative().optional(),
      status: z.string().min(1),
      payerName: z.string().optional(),
      paidAt: z.string().optional(),
    })
    .passthrough(),
});

function parseSignature(header: string) {
  const values = Object.fromEntries(
    header.split(",").map((part) => {
      const [key, ...rest] = part.trim().split("=");
      return [key, rest.join("=")];
    }),
  );

  return { timestamp: values.t, hash: values.v1 };
}

function verifySignature(rawBody: string, signature: string, secret: string) {
  const { timestamp, hash } = parseSignature(signature);
  if (!timestamp || !/^\d+$/.test(timestamp) || !hash || !/^[a-fA-F0-9]{64}$/.test(hash)) {
    return false;
  }

  const ageInSeconds = Math.abs(Math.floor(Date.now() / 1000) - Number(timestamp));
  if (!Number.isFinite(ageInSeconds) || ageInSeconds > 300) return false;

  const expected = createHmac("sha256", secret).update(`${timestamp}.${rawBody}`).digest("hex");

  return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(expected, "hex"));
}

function response(message: string, status: number) {
  return new Response(message, {
    status,
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}

export const Route = createFileRoute("/api/public/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["VEXOPAY_WEBHOOK_SECRET"];
        if (!secret) {
          console.error("[VexoPay] VEXOPAY_WEBHOOK_SECRET is not configured");
          return response("Configuration error", 500);
        }

        const rawBody = await request.text();
        const signature = request.headers.get("x-vexopay-signature");

        if (!signature || !verifySignature(rawBody, signature, secret)) {
          return response("Invalid signature", 401);
        }

        let payload: z.infer<typeof webhookSchema>;
        try {
          payload = webhookSchema.parse(JSON.parse(rawBody));
        } catch {
          return response("Invalid payload", 400);
        }

        const headerEvent = request.headers.get("x-vexopay-event");
        if (headerEvent && headerEvent !== payload.event) {
          return response("Event mismatch", 400);
        }

        const isPaidEvent =
          payload.event === "payment.completed" || payload.event === "payment.paid";

        if (isPaidEvent && payload.data.status !== "paid") {
          return response("Invalid payment status", 400);
        }

        const status = isPaidEvent ? "paid" : "cancelled";

        try {
          const [{ processVexoPayEvent }, { deliverUtmifyPurchase }] = await Promise.all([
            import("@/lib/tracking.server"),
            import("@/lib/utmify.server"),
          ]);

          await processVexoPayEvent({
            eventType: payload.event,
            transactionId: payload.data.transactionId,
            status,
            fee: payload.data.fee ?? null,
            netAmount: payload.data.netAmount ?? null,
            paidAt: payload.data.paidAt ?? null,
            payload: payload as unknown as Json,
          });

          if (status === "paid") {
            const delivery = await deliverUtmifyPurchase(payload.data.transactionId);
            if (!delivery.success && delivery.skipped !== "in_progress") {
              throw new Error("UTMify delivery did not complete");
            }
          }

          return response("ok", 200);
        } catch (error) {
          console.error(
            `[VexoPay] Processing failed for ${payload.data.transactionId}:`,
            error instanceof Error ? error.message : String(error),
          );
          // VexoPay retries non-2xx deliveries. The database functions make this safe.
          return response("Processing failed", 502);
        }
      },
    },
  },
});
