# Plan - Correct Belt Color for Off-White Pants

Update the belt color from "Marrom Escuro" to "Preto" specifically for the "Calça Évora Alfaiataria Off-White" product, ensuring both the data and the visual representation in the product page are consistent.

## User Review Required

> [!IMPORTANT]
> The belt color for the Off-White pants will be changed to Black (#000000). Other products with belts (like the Espresso Set) will remain with the Dark Brown belt if that was their original configuration.

## Technical Details

- Modify `src/lib/products-data.ts`: Locate the product with id `calca-alfaiataria-off-white` and change its `includedGift.color` to "Preto".
- Modify `src/routes/produtos.$productId.tsx`: Update the visual "gift" section to dynamically use the color value from the product data (if we add a color value to the `includedGift` object) or handle the specific color based on the `includedGift.color` name.
- **Alternative for UI Consistency**: I will update the `includedGift` interface in `src/lib/products-data.ts` to include a `hex` color value so the UI doesn't hardcode `#3d2b1f`.

## Maintenance

- This makes the gift selection system more flexible for future products with different gift colors.
