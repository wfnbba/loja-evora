
import { useEffect } from 'react';
import { useShopifyCartStore } from '@/store/shopify-cart-store';

export function useCartSync() {
  const syncCart = useShopifyCartStore(state => state.syncCart);

  useEffect(() => {
    syncCart();
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') syncCart();
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [syncCart]);
}
