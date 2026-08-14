# Plan - Dynamic Sales Counter Formatting

Adjust the sales counter display on the home page to show the nearest multiple of 100 based on actual total sales data, instead of a static "+100 vendas".

## User Review Required

> [!IMPORTANT]
> The current display is "+100 vendas" or "Novo". This change will make it dynamic (e.g., "+1800 vendas" for 1842 sales).

## Technical Details

- Modify `src/routes/index.tsx` to calculate the nearest multiple of 100 using `Math.floor(product.salesCount / 100) * 100`.
- Update the conditional rendering to show the formatted number (e.g., `+${roundedSales} vendas`) when sales are 100 or more.
- Keep the "Novo" label for products with fewer than 100 sales.

## Maintenance

- The logic will automatically update as the `salesCount` values in `src/lib/products-data.ts` or the database change.
