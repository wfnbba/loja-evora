import { supabaseAdmin as supabase } from "@/integrations/supabase/client.server";
import type { Json } from "@/integrations/supabase/types";

type PaymentStatus = "paid" | "cancelled";

export type VexoPayEventData = {
  eventType: string;
  transactionId: string;
  status: PaymentStatus;
  fee?: number | null;
  netAmount?: number | null;
  paidAt?: string | null;
  payload: Json;
};

export async function trackCustomerAndOrder(data: {
  customer: {
    email: string;
    name: string;
    phone?: string | null;
    document?: string | null;
    address: {
      zipCode: string;
      street: string;
      number: string;
      complement?: string | null;
      neighborhood: string;
      city: string;
      state: string;
    };
  };
  transactionId: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    size?: string | null;
  }>;
  totalAmount: number;
  trackingParameters?: { [key: string]: Json | undefined } | undefined;
  gatewayFee?: number | null;
  netAmount?: number | null;
  gatewayCreatedAt?: string | null;
  customerIp?: string | null;
}) {
  const { data: orderId, error } = await supabase.rpc("save_checkout_order", {
    p_customer: {
      email: data.customer.email,
      name: data.customer.name,
      phone: data.customer.phone ?? null,
      document: data.customer.document ?? null,
      zip_code: data.customer.address.zipCode,
      street: data.customer.address.street,
      number: data.customer.address.number,
      complement: data.customer.address.complement ?? null,
      neighborhood: data.customer.address.neighborhood,
      city: data.customer.address.city,
      state: data.customer.address.state,
    },
    p_order: {
      transaction_id: data.transactionId,
      total_amount: data.totalAmount,
      tracking_parameters: data.trackingParameters ?? {},
      payment_method: "pix",
      gateway_fee: data.gatewayFee ?? null,
      net_amount: data.netAmount ?? null,
      gateway_created_at: data.gatewayCreatedAt ?? null,
      customer_ip: data.customerIp ?? null,
    },
    p_items: data.items,
  });

  if (error) throw new Error(`Could not persist checkout order: ${error.message}`);
  return { success: true, orderId: String(orderId) };
}

export async function processVexoPayEvent(data: VexoPayEventData) {
  const paidAt =
    data.paidAt && !Number.isNaN(new Date(data.paidAt).getTime())
      ? new Date(data.paidAt).toISOString()
      : null;

  const { data: result, error } = await supabase.rpc("process_vexopay_event", {
    p_event_type: data.eventType,
    p_transaction_id: data.transactionId,
    p_status: data.status,
    p_fee: data.fee ?? null,
    p_net_amount: data.netAmount ?? null,
    p_paid_at: paidAt,
    p_payload: data.payload,
  });

  if (error) throw new Error(`Could not process VexoPay event: ${error.message}`);

  const parsed =
    result && typeof result === "object"
      ? (result as { found?: boolean; firstPaid?: boolean; utmifySent?: boolean })
      : {};

  if (!parsed.found) throw new Error(`Order not found for transaction ${data.transactionId}`);
  return parsed;
}

export async function updateOrderStatus(transactionId: string, status: PaymentStatus) {
  return processVexoPayEvent({
    eventType: `polling.payment.${status}`,
    transactionId,
    status,
    paidAt: status === "paid" ? new Date().toISOString() : null,
    payload: {
      source: "checkout_polling",
      transactionId,
      status,
    },
  });
}
