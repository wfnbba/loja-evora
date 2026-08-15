import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const trackingCodeSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^EVR-\d{6}-[A-F0-9]{10}$/, "Número de rastreamento inválido");

function isValidCpf(value: string) {
  const cpf = value.replace(/\D/g, "");
  if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

  const calculateDigit = (length: number) => {
    let sum = 0;
    for (let index = 0; index < length; index += 1) {
      sum += Number(cpf[index]) * (length + 1 - index);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return calculateDigit(9) === Number(cpf[9]) && calculateDigit(10) === Number(cpf[10]);
}

const cpfSchema = z
  .string()
  .transform((value) => value.replace(/\D/g, ""))
  .refine(isValidCpf, "CPF inválido");

export type OrderTrackingResult = {
  trackingCode: string;
  purchasedAt: string;
  checkedAt: string;
};

export const lookupOrderTracking = createServerFn({ method: "GET" })
  .validator((data) => z.object({ trackingCode: trackingCodeSchema }).parse(data))
  .handler(async ({ data }): Promise<OrderTrackingResult | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: order, error } = await supabaseAdmin
      .from("orders")
      .select("tracking_code, purchased_at")
      .eq("tracking_code", data.trackingCode)
      .eq("status", "paid")
      .maybeSingle();

    if (error) throw new Error(`Não foi possível consultar o pedido: ${error.message}`);
    if (!order?.tracking_code || !order.purchased_at) return null;

    return {
      trackingCode: order.tracking_code,
      purchasedAt: order.purchased_at,
      checkedAt: new Date().toISOString(),
    };
  });

export const recoverTrackingByCpf = createServerFn({ method: "POST" })
  .validator((data) => z.object({ cpf: cpfSchema }).parse(data))
  .handler(async ({ data }): Promise<OrderTrackingResult[]> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: customers, error: customerError } = await supabaseAdmin
      .from("customers")
      .select("email")
      .eq("document_normalized", data.cpf);

    if (customerError) {
      throw new Error(`Não foi possível recuperar o rastreamento: ${customerError.message}`);
    }

    const emails = [...new Set((customers ?? []).map((customer) => customer.email))];
    if (emails.length === 0) return [];

    const { data: orders, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("tracking_code, purchased_at")
      .in("customer_email", emails)
      .eq("status", "paid")
      .not("tracking_code", "is", null)
      .not("purchased_at", "is", null)
      .order("purchased_at", { ascending: false });

    if (orderError) {
      throw new Error(`Não foi possível recuperar o rastreamento: ${orderError.message}`);
    }

    const checkedAt = new Date().toISOString();
    return (orders ?? []).flatMap((order) =>
      order.tracking_code && order.purchased_at
        ? [{ trackingCode: order.tracking_code, purchasedAt: order.purchased_at, checkedAt }]
        : [],
    );
  });
