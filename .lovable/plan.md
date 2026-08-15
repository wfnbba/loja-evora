# Plan: Update product price

The user wants to change the price of "Vestido Évora Aurora Marfim" to 10 reais. Currently, it is set to 89 in `src/lib/products-data.ts`.

## Changes

### Product Data
- Update `price` to `10` for the product with id `vestido-aurora-marfim` in `src/lib/products-data.ts`.

## Technical Details
- Modify line 249 of `src/lib/products-data.ts`.
- No database changes are strictly required if the frontend uses this static data, but I should check if there's a corresponding entry in the Supabase database that needs updating to stay in sync.

## Verification
- Check the product page for "Vestido Évora Aurora Marfim" in the preview to ensure the price is updated to R$ 10,00.
