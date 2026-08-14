# Checkout Optimization and Bug Fixes

This plan aims to refine the checkout experience by fixing the PIX payment functionality, ensuring the order summary remains visible, cleaning up layout inconsistencies, and relaxing data validation for CPF and Phone.

## User Interface Refinements

- **PIX Logo as Final Element**: Ensure no product landing pages or extra content appear below the PIX logo at the end of the checkout process.
- **Permanent Order Summary**: Remove the toggle functionality for the order summary on mobile, making it always visible to provide a consistent reference for the user.
- **Enhanced Form Fields**: 
    - Adjust CPF and Phone inputs to accept data even if incomplete or incorrectly formatted, prioritizing user conversion over strict validation.
- **Layout Consistency**: Remove any redundant sections (like product descriptions) that might be leaking into the checkout page.

## Technical Details

- **PIX Functional Fix**: 
    - Investigate and fix the "Gerar PIX QR Code" button. 
    - Ensure `payerName` and `payerDocument` are correctly passed to the VexoPay API.
    - Check server logs and network responses for authentication or payload errors.
- **Component Refactoring**: 
    - Edit `src/components/cart/checkout-overlay.tsx` to remove the collapsible summary logic.
    - Update `src/routes/checkout.tsx` to ensure the layout terminates exactly at the PIX logo.
- **Validation Relaxing**:
    - Update `src/components/cart/checkout-overlay.tsx` and `src/lib/vexopay.functions.ts` (Zod schema) to allow flexible Phone and CPF strings.
    - Implement a "cleanup" utility to strip non-numeric characters before sending to the API, but without failing the frontend validation.

## Verification Plan

- **Automated Tests**:
    - Run a Playwright script to fill the checkout form with varying degrees of "incorrect" data (partial DDD, formatted CPF) and verify the PIX generation trigger.
- **Manual Verification**:
    - Open the preview, navigate to `/checkout`, and confirm the Order Summary is visible immediately.
    - Generate a PIX QR code and verify that no content appears below the PIX logo.
    - Check the browser console for any failed network requests to the VexoPay endpoint.
