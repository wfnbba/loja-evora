import { useState } from "react";
import { useCartStore } from "@/store/cart-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, ChevronLeft } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { CheckoutOverlay } from "./checkout-overlay";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();
  const [showCheckout, setShowCheckout] = useState(false);

  const handleOpenChange = (val: boolean) => {
    onOpenChange(val);
    if (!val) {
      setTimeout(() => setShowCheckout(false), 300);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-4xl border-l border-border/50 bg-background p-0 overflow-hidden">
        <SheetHeader className="border-b border-border/50 p-6 flex-row items-center justify-between space-y-0 shrink-0">
          <div className="flex items-center gap-4">
            {showCheckout && (
              <button 
                onClick={() => setShowCheckout(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="size-4" />
              </button>
            )}
            <SheetTitle className="text-xs font-medium uppercase tracking-[0.2em]">
              {showCheckout ? "Checkout Seguro" : "Seu Carrinho"}
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto relative custom-scrollbar">
          {showCheckout ? (
            <CheckoutOverlay onClose={() => handleOpenChange(false)} />
          ) : items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
              <ShoppingBag className="size-12 text-muted-foreground/30" />
              <p className="text-sm font-light tracking-wide text-muted-foreground">Seu carrinho está vazio.</p>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="rounded-none border-border/50 uppercase tracking-widest cursor-pointer"
              >
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <div className="space-y-8 p-6 lg:p-10">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-6 lg:gap-8">
                  <div className="relative aspect-[3/4] w-24 lg:w-32 shrink-0 overflow-hidden bg-muted border border-border/20">
                    <OptimizedImage src={item.image} alt={item.name} className="h-full w-full object-cover" width={128} height={170} />
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-2">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-[11px] lg:text-xs font-medium uppercase tracking-[0.2em] leading-relaxed line-clamp-2">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id, item.size, item.color)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        Tamanho: {item.size} {item.color && `| Cor: ${item.color}`}
                      </p>
                      <p className="text-sm font-light tracking-widest">
                        R$ {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-border/50">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1), item.color)}
                          className="flex size-8 items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-10 text-center text-[10px] tabular-nums font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1, item.color)}
                          className="flex size-8 items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && !showCheckout && (
          <SheetFooter className="border-t border-border/50 p-6 lg:p-10 flex-col sm:flex-col space-y-4 shrink-0 bg-background">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Total Estimado</span>
              <span className="text-xl font-light tracking-[0.2em]">
                R$ {totalPrice().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <Separator className="bg-border/50" />
            <Button 
              id="checkout-button"
              onClick={() => setShowCheckout(true)}
              className="w-full rounded-none py-8 uppercase tracking-[0.2em] font-medium cursor-pointer utmify bg-foreground text-background hover:bg-foreground/90 transition-all"
            >
              Finalizar Compra
            </Button>
            <p className="text-[10px] text-center text-muted-foreground tracking-widest uppercase">
              Frete grátis aplicado automaticamente.
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
