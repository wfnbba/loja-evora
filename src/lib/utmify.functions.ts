import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const UTMIFY_API_URL = "https://api.utmify.com.br/api-credentials/orders";

const utmifyOrderSchema = z.object({
  orderId: z.string(),
  platform: z.string(),
  paymentMethod: z.enum(['credit_card', 'boleto', 'pix', 'paypal', 'free_price']),
  status: z.enum(['waiting_payment', 'paid', 'refused', 'refunded', 'chargedback']),
  createdAt: z.string(),
  approvedDate: z.string().nullable(),
  customer: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string().nullable(),
    document: z.string().nullable(),
    country: z.string().optional(),
    ip: z.string().optional(),
    address: z.object({
      street: z.string(),
      number: z.string(),
      complement: z.string().optional(),
      neighborhood: z.string(),
      city: z.string(),
      state: z.string(),
      zipCode: z.string(),
    }).optional(),
  }),
  products: z.array(z.object({
    id: z.string(),
    name: z.string(),
    quantity: z.number(),
    priceInCents: z.number(),
  })),
  trackingParameters: z.object({
    src: z.string().nullable(),
    sck: z.string().nullable(),
    utm_source: z.string().nullable(),
    utm_campaign: z.string().nullable(),
    utm_medium: z.string().nullable(),
    utm_content: z.string().nullable(),
    utm_term: z.string().nullable(),
  }),
  commission: z.object({
    totalPriceInCents: z.number(),
    gatewayFeeInCents: z.number(),
    userCommissionInCents: z.number(),
  }),
});

export const sendUtmifyOrder = createServerFn({ method: "POST" })
  .validator((data) => utmifyOrderSchema.parse(data))
  .handler(async ({ data }) => {
    const apiToken = process.env['UTMIFY_API_TOKEN'];
    
    if (!apiToken) {
      console.warn("UTMIFY_API_TOKEN is not configured.");
      return { success: false, message: "API Token missing" };
    }

    try {
      const response = await fetch(UTMIFY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": apiToken
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      return { success: response.ok, data: result };
    } catch (error) {
      console.error("Error sending order to UTMify:", error);
      return { success: false, message: "Internal server error" };
    }
  });
