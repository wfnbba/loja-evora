# Plan: Fix Checkout Header Overlap on Mobile

The user reported that the checkout header (logo and cart info) is overlapping/hiding parts of the form on mobile. I will make the header sticky with proper z-index and add top padding to the main content to ensure visibility.

## User Review Required

> [!IMPORTANT]
> I am moving the "Urgência" (countdown) banner to the top of the page and ensuring the header doesn't block the form fields.

## Proposed Changes

### Checkout Layout
- Update `src/routes/checkout.tsx`:
    - Make the header sticky or ensure it doesn't overlap.
    - Add `pt-20` (or appropriate spacing) to the main container if the header is fixed.
    - Currently, the header is static but the `CheckoutOverlay` has a top-level banner.

### Checkout Component
- Update `src/components/cart/checkout-overlay.tsx`:
    - Ensure the countdown banner is fixed/sticky if desired, or simply ensure it has enough margin.
    - Add `scroll-mt-24` to form sections so when they are focused, they aren't hidden by a sticky header.

## Technical Details
- Use Tailwind classes: `sticky top-0 z-50` for the header.
- Add `pt-[header_height]` to the content container.
- Use `scroll-margin-top` for better accessibility when clicking labels/inputs.

---
*Created by Lovable Agent*
