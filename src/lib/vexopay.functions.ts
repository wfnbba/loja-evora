import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
// Removida dependência do products-data local, pois usamos dados do carrinho

const VEXOPAY_API_URL = "https://www.vexopay.com.br/api";

const createPixInput = z.object({
  items: z.array(z.object({
    id: z.string(),
    quantity: z.number(),
    price: z.number().optional(), // Preço enviado pelo cliente para cálculo (opcional se validado no server)
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

    if (!ci || !cs) {
      // In development, if keys are missing, we might return a mock for testing UI
      // but in production this should be a real error
      if (process.env['NODE_ENV'] === 'development') {

        console.warn("VexoPay API keys missing. Returning mock data.");
        return {
          success: true,
          data: {
            transactionId: "vxp_mock_" + Math.random().toString(36).substring(7),
            amount: 0, // calculated below
            status: "pending",
            qrCodeBase64: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==",
            copyPaste: "00020101021226850014br.gov.bcb.pix0163pix-qr-mock-123456789",
            paymentLink: "https://example.com/pix",
            expiresAt: new Date(Date.now() + 3600000).toISOString()
          }
        };
      }
      throw new Error("VexoPay API keys are not configured.");
    }

    // Calculate amount on server. In a production environment with Shopify,
    // you would ideally fetch the price from Shopify API here to verify.
    // For now, we use the price passed or a safe default if available.
    let total = 0;
    for (const item of data.items) {
      // Usamos o preço enviado no payload (confiando no client para este exemplo,
      // mas recomendaria validação via Shopify API em prod)
      const itemPrice = (item as any).price || 0;
      total += itemPrice * item.quantity;
    }

    if (total < 2.00) {
      throw new Error("O valor mínimo para pagamento PIX é R$ 2,00.");
    }

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

    const result = await response.json();
    
    if (!response.ok || !result.success) {
      throw new Error(result.message || "Erro ao criar cobrança PIX.");
    }

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
