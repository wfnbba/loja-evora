import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { trackCustomerAndOrder, updateOrderStatus } from "./tracking.server";

const VEXOPAY_API_URL = "https://www.vexopay.com.br/api";

const createPixInput = z.object({
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number(),
    price: z.number().optional(),
    size: z.string().optional(),
  })),
  payerName: z.string().min(3, "Nome muito curto"),
  payerDocument: z.string().length(11, "CPF deve ter 11 dígitos"),
  email: z.string().email("E-mail inválido"),
  phone: z.string(),
  address: z.object({
    street: z.string(),
    number: z.string(),
    complement: z.string().optional(),
    neighborhood: z.string(),
    city: z.string(),
    state: z.string(),
    zipCode: z.string(),
  }),
});

export const createPixPayment = createServerFn({ method: "POST" })
  .validator((data) => createPixInput.parse(data))
  .handler(async ({ data }) => {

    const ci = process.env['VEXOPAY_CI'];
    const cs = process.env['VEXOPAY_CS'];

    let total = 0;
    for (const item of data.items) {
      const itemPrice = (item as any).price || 0;
      total += itemPrice * item.quantity;
    }

    if (total < 2.00) {
      throw new Error("O valor mínimo para pagamento PIX é R$ 2,00.");
    }

    let transactionResult;

    if (!ci || !cs) {
      if (process.env['NODE_ENV'] === 'development') {
        console.warn("VexoPay API keys missing. Returning mock data.");
        transactionResult = {
          success: true,
          data: {
            transactionId: "vxp_mock_" + Math.random().toString(36).substring(7),
            amount: total,
            status: "pending",
            qrCodeBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
            copyPaste: "00020101021226850014br.gov.bcb.pix0163pix-qr-mock-123456789",
            paymentLink: "https://example.com/pix",
            expiresAt: new Date(Date.now() + 3600000).toISOString()
          }
        };
      } else {
        throw new Error("VexoPay API keys are not configured.");
      }
    } else {
      const response = await fetch(`${VEXOPAY_API_URL}/gateway/pix-create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ci": ci,
          "cs": cs
        },
        body: JSON.stringify({
          amount: total,
          payerName: data.payerName,
          payerDocument: data.payerDocument,
          payerEmail: data.email,
          payerPhone: data.phone,
          payerAddress: data.address,
          description: `Compra na Loja Évora - ${data.items.length} itens`
        })
      });

      transactionResult = await response.json();
      
      if (!response.ok || !transactionResult.success) {
        throw new Error(transactionResult.message || "Erro ao criar cobrança PIX.");
      }
    }

    if (transactionResult.success) {
      await trackCustomerAndOrder({
        customer: {
          email: data.email,
          name: data.payerName,
          phone: data.phone ?? null,
          document: data.payerDocument ?? null,
          address: {
            zipCode: data.address.zipCode,
            street: data.address.street,
            number: data.address.number,
            complement: data.address.complement ?? null,
            neighborhood: data.address.neighborhood,
            city: data.address.city,
            state: data.address.state
          }
        },
        transactionId: transactionResult.data.transactionId,
        items: data.items.map(i => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price || 0,
          size: i.size ?? null
        })),
        totalAmount: total
      }).catch(err => console.error("Tracking error during PIX creation:", err));
    }

    return transactionResult;
  });

export const updateTransactionStatus = createServerFn({ method: "POST" })
  .validator((data: { transactionId: string; status: 'paid' | 'cancelled' }) => data)
  .handler(async ({ data }) => {
    const result = await updateOrderStatus(data.transactionId, data.status);
    return result;
  });

export const checkPixStatus = createServerFn({ method: "GET" })
  .validator((data) => z.object({ transactionId: z.string() }).parse(data))
  .handler(async ({ data }) => {

    const ci = process.env['VEXOPAY_CI'];
    const cs = process.env['VEXOPAY_CS'];

    if (!ci || !cs) {
      if (process.env['NODE_ENV'] === 'development') {
        return { success: true, data: { status: "pending" } };
      }
      throw new Error("VexoPay API keys are not configured.");
    }

    const response = await fetch(`${VEXOPAY_API_URL}/gateway/pix-status?transactionId=${data.transactionId}`, {
      method: "GET",
      headers: {
        "ci": ci,
        "cs": cs
      }
    });

    const result = await response.json();
    return result;
  });
