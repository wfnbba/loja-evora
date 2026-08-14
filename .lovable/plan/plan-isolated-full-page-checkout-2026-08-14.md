# Plan: Isolated Full-Page Checkout

The checkout page will be refactored into a completely isolated, full-page experience (no global header/footer) at `/checkout`. The UI will be consolidated into a single scrolling view that includes contact info, shipping details, order summary, and PIX generation, eliminating the nested overlay behavior.

## User Review Required

> [!IMPORTANT]
> The current checkout uses an overlay component (`CheckoutOverlay`) that was previously intended to be accessible from multiple places. By making it a standalone page at `/checkout`, it will become the exclusive path for finalizing orders.

## Proposed Changes

### 1. Route Isolation
- **Refactor `src/routes/__root.tsx`**: Add route-based conditional logic to suppress the global `Header` and `Footer` when the user is on the `/checkout` or `/obrigado` routes. This ensures these pages are "clean" and don't conflict with the checkout's own layout.

### 2. Page Structure
- **Refactor `src/routes/checkout.tsx`**: 
    - Remove the redundant internal `<header>` and the wrapper that constrained the height.
    - Transform the page into a standard Shopify-style two-column layout on desktop:
        - **Left Column**: Contact information, CPF, and Address fields.
        - **Right Column**: Interactive Order Summary (items, prices, gift, totals).
    - Ensure a single, natural scroll flow for the entire document.

### 3. Component Refactoring
- **Update `src/components/cart/checkout-overlay.tsx`**:
    - Remove all "overlay" specific styles (`fixed`, `inset-0`, `z-index`).
    - Convert it into a standard block-level component (`CheckoutContent`).
    - Adjust mobile layout to show a collapsable order summary at the top, keeping the main form as the primary scrollable content.
    - Remove "close" buttons that redirect back, replacing them with a simple "Return to store" link in the footer of the checkout form.

### 4. Visual Cleanup
- Ensure the Order Summary is `sticky` on desktop so it stays visible while filling out the long address form on the left.
- Fix any potential background leakage by ensuring the `/checkout` page has a solid, opaque background and occupies the full viewport.

## Technical Details

- Use TanStack Router's `useLocation` hook in `__root.tsx` to toggle layout elements.
- Simplify `CheckoutOverlay` into a layout-neutral component that can be used directly as the route's main content.
- Update CSS to ensure `h-screen` or `min-h-screen` correctly fills the space without creating nested scrollbars.

