# Plan: Checkout PIX Premium Integration (VexoPay)

Integrate the VexoPay API to provide a high-end, dynamic PIX payment experience. The flow will handle cart totals, generate QR codes, and monitor payment status in real-time.

## User Review Required

> [!IMPORTANT]
> To proceed with the live integration, I will need the following API keys from your VexoPay dashboard:
> 1. **Client ID (ci)**: `vxp_ci_...`
> 2. **Client Secret (cs)**: `vxp_cs_...`
> 
> Please provide these when you are ready to test the real connection. For now, I will implement the structure using placeholders or environment variable references.

## Proposed Changes

### 1. Backend Integration (Server Functions)
- **PIX Creation Function**: A server function to call `POST /gateway/pix-create`. It will receive the cart data, calculate the total on the server (for security), and return the PIX data (Base64 QR Code, Copy/Paste code).
- **Status Check Function**: A server function to call `GET /gateway/pix-status` to verify if a payment has been confirmed.
- **Webhook Endpoint**: Create `src/routes/api/public/webhook.ts` to receive notifications from VexoPay when status changes to `paid`.

### 2. Frontend: Premium Checkout Experience
- **Checkout Modal/Page**: A refined UI that appears after clicking "Finalizar Compra".
- **Dynamic Payer Form**: Collect Name and CPF (required by API) in an elegant, minimalist form.
- **Real-time Payment Feedback**: A dedicated view showing the QR Code, a "Copiar Código" button, and a countdown timer.
- **Success State**: Automatic redirect or visual confirmation once the webhook or polling detects the payment.

### 3. State Management
- Update `CartStore` to handle the checkout process state (loading, payment pending, success).
- Clear the cart only after successful payment confirmation.

## Technical Details
- **Security**: Price calculation will be validated server-side by fetching the latest product prices from `products-data.ts` to prevent client-side manipulation.
- **Environment Variables**: Use `VEXOPAY_CI` and `VEXOPAY_CS` stored securely.
- **Polling + Webhooks**: Use a combination of short-polling (frontend) and webhooks (backend) for 100% reliability.

## Next Steps
1. Create the `vexopay.functions.ts` for server-side API calls.
2. Develop the `CheckoutOverlay` component.
3. Integrate the new flow into `CartSheet`.
4. Set up the Public API route for webhooks.
