# Plan - Flexible Address Entry and Free Shipping UI

## User Request
- Allow manual editing of all address fields, not just ZIP code.
- ZIP code should still trigger auto-completion but not block manual entry.
- Use a Brazilian address API (ViaCEP is already used via `getAddressByCep`).
- After filling in the "Street" field, show "Free Shipping" in the order summary as a product with an image.

## Proposed Changes

### 1. Checkout Component (`src/components/cart/checkout-overlay.tsx`)
- Modify `handleCepChange` to update state but not block other inputs.
- Ensure all address fields (`street`, `neighborhood`, `city`, `state`) are always editable (remove `readOnly` if present).
- Implement logic to detect if the "Street" field is filled to trigger shipping UI.
- Update the Order Summary (both mobile and desktop) to include a "Free Shipping" item when the street is filled.
- The "Free Shipping" item should have:
    - Name: "Frete Premium Évora"
    - Image: A standard shipping/truck icon image.
    - Price: "GRÁTIS" (R$ 0,00).

### 2. UI/UX Refinements
- Ensure the "Free Shipping" product looks like other products in the summary.
- Maintain the "5 days delivery" disclaimer.
- Keep PIX as the only payment method.

## Technical Details
- **State management**: Use `formData.street` to toggle `isAddressFilled` or a similar flag.
- **Components**: Update `items.map` in the summary to also include a virtual "shipping item" when applicable.
- **Validation**: Keep basic validation but allow manual flow.

## Approval
Please confirm if I should proceed with these changes.
