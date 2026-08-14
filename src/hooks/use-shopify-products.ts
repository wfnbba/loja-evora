
import { useQuery } from "@tanstack/react-query";
import { storefrontApiRequest, GET_PRODUCTS_QUERY, ShopifyProduct } from "@/lib/shopify";
import { products as localProducts, Product as LocalProduct } from "@/lib/products-data";

export function useShopifyProducts(query?: string) {
  return useQuery({
    queryKey: ["shopify-products", query],
    queryFn: async () => {
      try {
        const data = await storefrontApiRequest(GET_PRODUCTS_QUERY, { 
          first: 20,
          query 
        });
        
        const shopifyProducts = data?.data?.products?.edges as ShopifyProduct[];
        
        // Se a Shopify retornar produtos, usamos eles
        if (shopifyProducts && shopifyProducts.length > 0) {
          return shopifyProducts;
        }

        // Caso contrário, usamos o fallback dos dados locais formatados como ShopifyProduct
        console.warn("Shopify API returned no products. Using local fallback.");
        return localProducts.map(lp => ({
          node: {
            id: `local-${lp.id}`,
            title: lp.name,
            description: lp.description,
            handle: lp.id,
            priceRange: {
              minVariantPrice: {
                amount: lp.price.toString(),
                currencyCode: "BRL"
              }
            },
            images: {
              edges: lp.images.map(img => ({
                node: {
                  url: img,
                  altText: lp.name
                }
              }))
            },
            variants: {
              edges: lp.sizes.map(size => ({
                node: {
                  id: `local-variant-${lp.id}-${size}`,
                  title: size,
                  price: {
                    amount: lp.price.toString(),
                    currencyCode: "BRL"
                  },
                  availableForSale: true,
                  selectedOptions: [{ name: "Tamanho", value: size }]
                }
              }))
            },
            options: [
              { name: "Tamanho", values: lp.sizes },
              ...(lp.colors ? [{ name: "Cor", values: lp.colors.map(c => c.name) }] : [])
            ]
          }
        })) as ShopifyProduct[];
      } catch (error) {
        console.error("Shopify API Error, using fallback:", error);
        // Fallback em caso de erro de rede ou API
        return localProducts.map(lp => ({
          node: {
            id: `local-${lp.id}`,
            title: lp.name,
            description: lp.description,
            handle: lp.id,
            priceRange: {
              minVariantPrice: {
                amount: lp.price.toString(),
                currencyCode: "BRL"
              }
            },
            images: {
              edges: lp.images.map(img => ({
                node: {
                  url: img,
                  altText: lp.name
                }
              }))
            },
            variants: {
              edges: lp.sizes.map(size => ({
                node: {
                  id: `local-variant-${lp.id}-${size}`,
                  title: size,
                  price: {
                    amount: lp.price.toString(),
                    currencyCode: "BRL"
                  },
                  availableForSale: true,
                  selectedOptions: [{ name: "Tamanho", value: size }]
                }
              }))
            },
            options: [
              { name: "Tamanho", values: lp.sizes },
              ...(lp.colors ? [{ name: "Cor", values: lp.colors.map(c => c.name) }] : [])
            ]
          }
        })) as ShopifyProduct[];
      }
    },
  });
}
