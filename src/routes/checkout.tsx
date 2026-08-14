import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckoutOverlay } from "@/components/cart/checkout-overlay";
import { useCartStore } from "@/store/cart-store";
import { useEffect } from "react";
import logoAsset from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout Seguro | Évora" },
      { name: "description", content: "Finalize sua compra com segurança na Évora." },
    ],
  }),
  component: CheckoutPage,
});

function CheckoutPage() {
  const { items } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (items.length === 0) {
      navigate({ to: "/" });
    }
  }, [items, navigate]);

  if (items.length === 0) return null;

  return (
    <div className="min-h-screen bg-background pt-20">
      <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-md">
        <div className="container mx-auto flex h-20 items-center justify-center px-4">
          <img src={logoAsset.url} alt="Évora Logo" className="h-10 w-auto" />
        </div>
      </header>
      <div className="h-[calc(100vh-80px)]">
        <CheckoutOverlay onClose={() => navigate({ to: "/" })} />
      </div>
    </div>
  );
}
