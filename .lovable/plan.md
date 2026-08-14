# Checkout Optimization and UI Refinement

Finalize the checkout experience for Loja Évora by ensuring conversion-friendly validations, permanent order summary visibility on mobile, and fixing the PIX generation logic.

## User Review Required

> [!IMPORTANT]
> The checkout is now restricted to PIX only, with relaxed validation for CPF and Phone to maximize conversion as requested.

## Proposed Changes

### UI & Layout
- Make the Order Summary permanent on mobile (removing the collapsible toggle) to ensure transparency.
- Ensure the checkout flow ends immediately at the PIX logo/QR code, removing any leakage from product landing pages.
- Increase visibility of the "Free Shipping" benefit once the address is filled.

### Validation & Conversion
- Relax CPF validation to accept partial or incorrectly formatted inputs (minimum length check only).
- Relax Phone validation to accept any numeric input (minimum length check only).
- Ensure auto-fill via CEP works reliably for all Brazilian addresses.

### PIX Payment Logic
- Verify and fix the VexoPay integration to ensure the "Gerar PIX QR Code" button correctly initiates the payment flow.
- Ensure the PIX copy-paste code and QR code are displayed clearly after generation.
- Implement automatic redirection to the `/obrigado` page once payment is confirmed.

## Technical Details

### Frontend Changes
- **src/components/cart/checkout-overlay.tsx**:
  - Remove `isSummaryOpen` state and related collapsible logic.
  - Simplify `handleCreatePayment` validation logic.
  - Update `payerDocument` and `phone` inputs to be less restrictive.
  - Ensure the main container has a clean end after the PIX section.

### Backend Changes
- **src/lib/vexopay.functions.ts**:
  - Update Zod schema to allow minimal character counts for `payerDocument` and `phone`.
  - Log PIX creation attempts for easier debugging.
