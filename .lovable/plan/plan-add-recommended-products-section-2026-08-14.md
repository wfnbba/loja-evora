# Plan: Add Recommended Products Section

Add a "Recommended Products" section to the bottom of the individual product pages to increase engagement and cross-selling.

## User Review Required

> [!IMPORTANT]
> I will use the same visual style as the homepage grid for these recommendations. I'll show 4 random or next products from the catalog. Does that work for you?

- **Section Title:** "Você também pode gostar" (You may also like).
- **Placement:** Below the product details and reviews on the product page.
- **Content:** A grid of 4 other products from the collection.

## Technical Details

- Modify `src/routes/produtos.$productId.tsx` to include a new section at the bottom of the `main` container.
- Filter the `products` array to exclude the current product.
- Implement a simple slice or random selection of 4 products to display.
- Reuse the `Card` and `Link` logic from `src/routes/index.tsx` for consistent styling.
- Ensure `loading="lazy"` is applied to recommendation images for performance.
