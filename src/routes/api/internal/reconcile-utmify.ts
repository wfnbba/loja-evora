import { createFileRoute } from "@tanstack/react-router";
import { createHash, timingSafeEqual } from "node:crypto";

const REPAIR_TOKEN_HASH = "0936b823e83c1084ce44badd1f25b0ee30abab3b7aa8a02b7544ac88eb86a13a";
const TRANSACTION_ID = "vxp_62e518f029fc3a8c3803951a";

function isAuthorized(token: string | null) {
  if (!token) return false;
  const received = createHash("sha256").update(token).digest();
  const expected = Buffer.from(REPAIR_TOKEN_HASH, "hex");
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export const Route = createFileRoute("/api/internal/reconcile-utmify")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        if (!isAuthorized(request.headers.get("x-repair-token"))) {
          return new Response("Not found", { status: 404 });
        }

        try {
          const [{ processVexoPayEvent }, { deliverUtmifyPurchase }] = await Promise.all([
            import("@/lib/tracking.server"),
            import("@/lib/utmify.server"),
          ]);

          await processVexoPayEvent({
            eventType: "manual-repair.payment.completed",
            transactionId: TRANSACTION_ID,
            status: "paid",
            fee: 2,
            netAmount: 8,
            paidAt: "2026-08-15T02:58:38.000Z",
            payload: {
              source: "verified_vexopay_statement",
              transactionId: TRANSACTION_ID,
              status: "paid",
              amount: 10,
              fee: 2,
              netAmount: 8,
            },
          });

          const result = await deliverUtmifyPurchase(TRANSACTION_ID);
          return Response.json(result, { status: result.success ? 200 : 409 });
        } catch (error) {
          console.error(
            `[UTMify repair] Failed for ${TRANSACTION_ID}:`,
            error instanceof Error ? error.message : String(error),
          );
          return new Response("Repair failed", { status: 502 });
        }
      },
    },
  },
});
