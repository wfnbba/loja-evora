export const PRODUCT_PRICES = {
  "vestido-aurora-marfim": 89,
  "vestido-aurora-cafe": 89,
  "vestido-monument-noir": 109.9,
  "colete-alvorada": 89,
  "vestido-satin-espresso": 119,
  "saia-chiffon-fluida": 89,
  "saia-renda-romantique": 89,
  "conjunto-espresso-alfaiataria": 79,
  "conjunto-rose": 69,
  "vestido-aurora-rose": 59,
  "calca-alfaiataria-off-white": 99,
  "conjunto-espresso-alfaiataria-brinde": 0,
  "calca-alfaiataria-off-white-brinde": 0,
} as const satisfies Record<string, number>;

export function getProductPrice(productId: string): number | undefined {
  return PRODUCT_PRICES[productId as keyof typeof PRODUCT_PRICES];
}

export function requireProductPrice(productId: string): number {
  const price = getProductPrice(productId);
  if (price === undefined) throw new Error(`Produto inválido: ${productId}`);
  return price;
}
