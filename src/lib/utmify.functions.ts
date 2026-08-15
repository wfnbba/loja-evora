import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const UTMIFY_API_URL = "https://api.utmify.com.br/api-credentials/orders";

export const sendUtmifySale = createServerFn({ method: "POST" })
  .validator((data: any) => data)
  .handler(async ({ data }) => {
    const apiToken = process.env['UTMIFY_API_TOKEN'];
    if (!apiToken) {
      console.warn("UTMIFY_API_TOKEN not configured. Skipping UTMify notification.");
      return { success: false, message: "Token not configured" };
    }

    try {
      const response = await fetch(UTMIFY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": apiToken
        },
        body: JSON.stringify({
          orderId: data.orderId,
          platform: "Loja Évora",
          paymentMethod: data.paymentMethod || "pix",
          status: data.status,
          createdAt: data.createdAt,
          approvedDate: data.approvedDate,
          refundedAt: data.refundedAt || null,
          customer: data.customer,
          products: data.products,
          trackingParameters: data.trackingParameters,
          commission: data.commission,
          isTest: false
        })
      });

      const result = await response.json();
      console.log("UTMify notification result:", result);
      return { success: response.ok, data: result };
    } catch (error) {
      console.error("Error notifying UTMify:", error);
      return { success: false, error: String(error) };
    }
  });
