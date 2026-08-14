# Checkout Optimization and VexoPay Fix

Finalize the checkout experience by optimizing the PIX flow, relaxing data validation for conversion, and ensuring the UI is clean and functional.

## UI/UX Refinement
- Ensure Order Summary is permanently visible on mobile.
- Clean up checkout layout to end at the PIX logo, removing any accidental product content leakages below the payment section.
- Standardize fonts and spacing for a premium mobile-first experience.

## Validation & Conversion
- Relax CPF/Document validation to accept entries with at least 3 characters.
- Relax Phone validation to accept any input length (removing strict DDD/formatting requirements).
- Ensure input fields allow for direct text entry (formatted or unformatted) without aggressive stripping.

## PIX Integration (VexoPay)
- Fix "Gerar PIX QR Code" button functionality by ensuring correct payload structure and error handling.
- Verify API response handling to transition from form to QR code display seamlessly.

## Technical Details
- Modify `src/lib/vexopay.functions.ts` to relax Zod schema constraints.
- Update `src/components/cart/checkout-overlay.tsx` to handle relaxed validation, input changes, and UI cleanup.
- Refactor `src/routes/checkout.tsx` to ensure a sealed layout without footer or extra component interference.
