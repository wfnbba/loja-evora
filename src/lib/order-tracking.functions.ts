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
    const { supabase } = await import("@/integrations/supabase/client");
    const { data: order, error } = await supabase
      .rpc("lookup_order_tracking", { p_tracking_code: data.trackingCode })
      .maybeSingle();

    if (error) throw new Error(`Não foi possível consultar o pedido: ${error.message}`);
    if (!order?.tracking_code || !order.purchased_at || !order.checked_at) return null;

    return {
      trackingCode: order.tracking_code,
      purchasedAt: order.purchased_at,
      checkedAt: order.checked_at,
    };
  });

export const recoverTrackingByCpf = createServerFn({ method: "POST" })
  .validator((data) => z.object({ cpf: cpfSchema }).parse(data))
  .handler(async ({ data }): Promise<OrderTrackingResult[]> => {
    const { supabase } = await import("@/integrations/supabase/client");
    const { data: orders, error: orderError } = await supabase
      .rpc("recover_order_tracking_by_cpf", { p_cpf: data.cpf });

    if (orderError) {
      throw new Error(`Não foi possível recuperar o rastreamento: ${orderError.message}`);
    }

    return (orders ?? []).flatMap((order) =>
      order.tracking_code && order.purchased_at && order.checked_at
        ? [
            {
              trackingCode: order.tracking_code,
              purchasedAt: order.purchased_at,
              checkedAt: order.checked_at,
            },
          ]
        : [],
    );
  });
