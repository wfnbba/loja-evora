import { useCartStore } from "@/store/cart-store";

export function useCart() {
  const store = useCartStore();
  
  return {
    items: store.items,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    totalItems: store.totalItems(),
    totalPrice: store.totalPrice(),
  };
}
