import { z } from "zod";
import { supabaseAdmin as supabase } from "@/integrations/supabase/client.server";
import type { Json } from "@/integrations/supabase/types";

const UTMIFY_API_URL = "https://api.utmify.com.br/api-credentials/orders";

const trackingParametersSchema = z.object({
  src: z.string().nullable(),
  sck: z.string().nullable(),
  utm_source: z.string().nullable(),
  utm_campaign: z.string().nullable(),
  utm_medium: z.string().nullable(),
  utm_content: z.string().nullable(),
  utm_term: z.string().nullable(),
});

const utmifyPurchaseSchema = z.object({
  orderId: z.string().min(1),
  platform: z.string().min(1),
  paymentMethod: z.literal("pix"),
  status: z.literal("paid"),
  createdAt: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/),
  approvedDate: z.string().regex(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/),
  refundedAt: z.null(),
  customer: z.object({
    name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().nullable(),
    document: z.string().nullable(),
    country: z.literal("BR"),
    ip: z.string().optional(),
  }),
  products: z
    .array(
      z.object({
        id: z.string().min(1),
        name: z.string().min(1),
        planId: z.null(),
        planName: z.null(),
        quantity: z.number().int().positive(),
        priceInCents: z.number().int().nonnegative(),
      }),
    )
    .min(1),
  trackingParameters: trackingParametersSchema,
  commission: z.object({
    totalPriceInCents: z.number().int().nonnegative(),
    gatewayFeeInCents: z.number().int().nonnegative(),
    userCommissionInCents: z.number().int().nonnegative(),
    currency: z.literal("BRL"),
  }),
  isTest: z.literal(false),
});

type DeliveryResult = {
  success: boolean;
  skipped?: "already_sent" | "in_progress";
};

function toCents(value: unknown): number {
  const amount = Number(value);
  return Number.isFinite(amount) ? Math.max(0, Math.round(amount * 100)) : 0;
}

function toUtmifyDate(value: unknown): string {
  const date = new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    throw new Error("Invalid purchase date for UTMify");
  }
  return date.toISOString().slice(0, 19).replace("T", " ");
}

function nullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function trackingParameters(metadata: unknown) {
  const values =
    metadata && typeof metadata === "object" ? (metadata as Record<string, unknown>) : {};

  return trackingParametersSchema.parse({
    src: nullableString(values["src"]),
    sck: nullableString(values["sck"]),
    utm_source: nullableString(values["utm_source"]),
    utm_campaign: nullableString(values["utm_campaign"]),
    utm_medium: nullableString(values["utm_medium"]),
    utm_content: nullableString(values["utm_content"]),
    utm_term: nullableString(values["utm_term"]),
  });
}

function responsePayload(text: string): Json {
  if (!text) return {};

  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? (parsed as Json) : { value: parsed };
  } catch {
    return { body: text.slice(0, 2000) };
  }
}

async function finishDelivery(
  transactionId: string,
  success: boolean,
  response: Json,
  error: string | null,
) {
  const { error: finishError } = await supabase.rpc("finish_utmify_purchase", {
    p_transaction_id: transactionId,
    p_success: success,
    p_response: response,
    p_error: error,
  });

  if (finishError) {
    console.error("[UTMify] Failed to persist delivery result:", finishError.message);
  }
}

export async function deliverUtmifyPurchase(transactionId: string): Promise<DeliveryResult> {
  const apiToken = process.env["UTMIFY_API_TOKEN"];
  if (!apiToken) {
    throw new Error("UTMIFY_API_TOKEN is not configured");
  }

  const { data: claimed, error: claimError } = await supabase.rpc("claim_utmify_purchase", {
    p_transaction_id: transactionId,
  });

  if (claimError) throw new Error(`Could not claim UTMify purchase: ${claimError.message}`);

  if (!claimed) {
    const { data: existing } = await supabase
      .from("orders")
      .select("utmify_status")
      .eq("transaction_id", transactionId)
      .maybeSingle();

    return {
      success: existing?.utmify_status === "sent",
      skipped: existing?.utmify_status === "sent" ? "already_sent" : "in_progress",
    };
  }

  let resultForPersistence: Json = {};

  try {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        `
        id, transaction_id, total_amount, created_at, gateway_created_at,
        approved_at, gateway_fee, net_amount, payment_method, metadata, customer_ip,
        customers(name, email, phone, document),
        order_items(product_id, product_name, quantity, price, size)
      `,
      )
      .eq("transaction_id", transactionId)
      .single();

    if (orderError || !order) {
      throw new Error(`Purchase data not found: ${orderError?.message || transactionId}`);
    }

    const customer = Array.isArray(order.customers) ? order.customers[0] : order.customers;
    const items = Array.isArray(order.order_items) ? order.order_items : [];

    if (!customer || !order.approved_at || items.length === 0) {
      throw new Error("Purchase data is incomplete for UTMify");
    }

    const totalInCents = toCents(order.total_amount);
    const feeInCents =
      order.gateway_fee == null
        ? Math.max(0, totalInCents - toCents(order.net_amount))
        : toCents(order.gateway_fee);
    const commissionInCents =
      order.net_amount == null ? Math.max(0, totalInCents - feeInCents) : toCents(order.net_amount);

    const purchase = utmifyPurchaseSchema.parse({
      orderId: order.transaction_id,
      platform: "LojaEvora",
      paymentMethod: "pix",
      status: "paid",
      createdAt: toUtmifyDate(order.gateway_created_at || order.created_at),
      approvedDate: toUtmifyDate(order.approved_at),
      refundedAt: null,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: nullableString(customer.phone)?.replace(/\D/g, "") || null,
        document: nullableString(customer.document)?.replace(/\D/g, "") || null,
        country: "BR",
        ...(nullableString(order.customer_ip) ? { ip: nullableString(order.customer_ip) } : {}),
      },
      products: items.map((item) => ({
        id: String(item.product_id),
        name: String(item.product_name),
        planId: null,
        planName: null,
        quantity: Number(item.quantity),
        priceInCents: toCents(item.price),
      })),
      trackingParameters: trackingParameters(order.metadata),
      commission: {
        totalPriceInCents: totalInCents,
        gatewayFeeInCents: feeInCents,
        userCommissionInCents: commissionInCents,
        currency: "BRL",
      },
      isTest: false,
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    let response: Response;

    try {
      response = await fetch(UTMIFY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": apiToken,
        },
        body: JSON.stringify(purchase),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const result = responsePayload(await response.text());
    resultForPersistence = result;

    if (!response.ok) {
      const message = `UTMify rejected purchase with HTTP ${response.status}`;
      throw new Error(message);
    }

    await finishDelivery(transactionId, true, result, null);
    console.info(`[UTMify] Purchase delivered for transaction ${transactionId}`);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await finishDelivery(transactionId, false, resultForPersistence, message);
    throw error;
  }
}
