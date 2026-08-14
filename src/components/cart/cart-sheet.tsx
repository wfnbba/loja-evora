import { useState } from "react";
import { useShopifyCartStore } from "@/store/shopify-cart-store";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CartSheet({ open, onOpenChange }: CartSheetProps) {
  const { items, removeItem, updateQuantity, isLoading, checkoutUrl } = useShopifyCartStore();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col sm:max-w-4xl border-l border-border/50 bg-background p-0 overflow-hidden">
        <SheetHeader className="border-b border-border/50 p-6 flex-row items-center justify-between space-y-0 shrink-0">
          <SheetTitle className="text-xs font-medium uppercase tracking-[0.2em]">
            Seu Carrinho
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto relative custom-scrollbar">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
              <ShoppingBag className="size-12 text-muted-foreground/30" />
              <p className="text-sm font-light tracking-wide text-muted-foreground">Seu carrinho está vazio.</p>
              <Button 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="rounded-none border-border/50 uppercase tracking-widest"
              >
                Continuar Comprando
              </Button>
            </div>
          ) : (
            <div className="space-y-8 p-6 lg:p-10">
              {items.map((item) => (
                <div key={item.variantId} className="flex gap-6 lg:gap-8">
                  <div className="relative aspect-[3/4] w-24 lg:w-32 shrink-0 overflow-hidden bg-muted border border-border/20">
                    <OptimizedImage 
                      src={item.product.node.images.edges[0]?.node?.url || ""} 
                      alt={item.product.node.title} 
                      className="h-full w-full object-cover" 
                      width={128} 
                      height={170} 
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-2">
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <h3 className="text-[11px] lg:text-xs font-medium uppercase tracking-[0.2em] leading-relaxed line-clamp-2">{item.product.node.title}</h3>
                        <button 
                          onClick={() => removeItem(item.variantId)}
                          disabled={isLoading}
                          className="text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        {item.variantTitle !== "Default Title" ? item.variantTitle : "Tamanho Único"}
                      </p>
                      <p className="text-sm font-light tracking-widest">
                        {item.price.currencyCode} {parseFloat(item.price.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center border border-border/50">
                        <button
                          onClick={() => updateQuantity(item.variantId, Math.max(1, item.quantity - 1))}
                          disabled={isLoading}
                          className="flex size-8 items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-10 text-center text-[10px] tabular-nums font-medium">
                          {isLoading ? <Loader2 className="mx-auto size-3 animate-spin" /> : item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          disabled={isLoading}
                          className="flex size-8 items-center justify-center hover:bg-muted transition-colors disabled:opacity-50"
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

        {items.length > 0 && (
          <SheetFooter className="border-t border-border/50 p-6 lg:p-10 flex-col sm:flex-col space-y-4 shrink-0 bg-background">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Total Estimado</span>
              <span className="text-xl font-light tracking-[0.2em]">
                {items[0]?.price.currencyCode || 'BRL'} {items.reduce((acc, item) => acc + (parseFloat(item.price.amount) * item.quantity), 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <Separator className="bg-border/50" />
            <Button 
              id="checkout-button"
              asChild
              disabled={isLoading || !checkoutUrl}
              className="w-full rounded-none py-8 uppercase tracking-[0.2em] font-medium cursor-pointer bg-foreground text-background hover:bg-foreground/90 transition-all disabled:opacity-50"
            >
              <a href={checkoutUrl || "#"}>{isLoading ? "PROCESSANDO..." : "Finalizar Compra"}</a>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
