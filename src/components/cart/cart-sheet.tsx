import { useCartStore } from "@/store/cart-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, removeItem, updateQuantity, totalPrice } = useCartStore();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-md border-l border-border/50 bg-background p-0">
        <SheetHeader className="border-b border-border/50 p-6">
          <SheetTitle className="text-xs font-medium uppercase tracking-[0.2em]">Seu Carrinho</SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
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
            <div className="space-y-8">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                  <div className="relative aspect-[3/4] w-20 shrink-0 overflow-hidden bg-muted">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-[10px] font-medium uppercase tracking-[0.2em]">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id, item.size, item.color)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        Tamanho: {item.size} {item.color && `| Cor: ${item.color}`}
                      </p>
                      <p className="text-xs font-light">
                        R$ {item.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-border/50">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1), item.color)}
                          className="flex size-6 items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="size-2" />
                        </button>
                        <span className="w-8 text-center text-[10px] tabular-nums font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.quantity + 1, item.color)}
                          className="flex size-6 items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Plus className="size-2" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <SheetFooter className="border-t border-border/50 p-6 flex-col sm:flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Total</span>
              <span className="text-sm font-medium tracking-widest">
                R$ {totalPrice().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <Separator className="bg-border/50" />
            <Button className="w-full rounded-none py-6 uppercase tracking-[0.2em] font-medium cursor-pointer">
              Finalizar Compra
            </Button>
            <p className="text-[10px] text-center text-muted-foreground tracking-wide">
              Taxas e frete calculados no checkout.
            </p>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
