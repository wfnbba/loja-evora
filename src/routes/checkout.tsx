import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
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
    <div className="min-h-screen bg-[#fcfaf7]">
      <header className="w-full border-b border-border/50 bg-background">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <Link to="/">
            <img src={logoAsset.url} alt="Évora Logo" className="h-10 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-2 text-muted-foreground">
            <span className="text-[10px] font-bold uppercase tracking-widest">Ambiente Seguro</span>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 lg:py-12">
        <CheckoutOverlay onClose={() => navigate({ to: "/" })} />
      </main>
      <footer className="py-8 text-center border-t border-border/50 mt-12">
        <p className="text-[10px] tracking-[0.2em] font-light text-muted-foreground uppercase">
          © 2026 ÉVORA. TODOS OS DIREITOS RESERVADOS.
        </p>
      </footer>
    </div>
  );
}