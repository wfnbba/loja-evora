
import { useQuery } from "@tanstack/react-query";
import { storefrontApiRequest, GET_PRODUCTS_QUERY, ShopifyProduct } from "@/lib/shopify";

export function useShopifyProducts(query?: string) {
  return useQuery({
    queryKey: ["shopify-products", query],
    queryFn: async () => {
      const data = await storefrontApiRequest(GET_PRODUCTS_QUERY, { 
        first: 20,
        query 
      });
      return data?.data?.products?.edges as ShopifyProduct[];
    },
  });
}
