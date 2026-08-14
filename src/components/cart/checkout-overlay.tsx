import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, CheckCircle2, Loader2, QrCode } from "lucide-react";
import { createPixPayment, checkPixStatus } from "@/lib/vexopay.functions";
import { useServerFn } from "@tanstack/react-start";
import { getPersistedUtms } from "@/hooks/use-utm-tracking";
import { sendUtmifyOrder } from "@/lib/utmify.functions";

interface CheckoutOverlayProps {
  onClose: () => void;
}

export function CheckoutOverlay({ onClose }: CheckoutOverlayProps) {
  const { items, totalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    document: "",
  });

  const createPix = useServerFn(createPixPayment);
  const checkStatus = useServerFn(checkPixStatus);
  const sendToUtmify = useServerFn(sendUtmifyOrder);


  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const doc = formData.document.replace(/\D/g, "");
    if (doc.length !== 11) {
      toast.error("CPF deve ter 11 dígitos");
      return;
    }

    setLoading(true);
    try {
      const result = await createPix({
        data: {
          items: items.map(i => ({ id: i.id, quantity: i.quantity })),
          payerName: formData.name,
          payerDocument: doc
        }
      });

      if (result.success) {
        setPixData(result.data);
        setStep("payment");
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao gerar PIX");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (pixData?.copyPaste) {
      navigator.clipboard.writeText(pixData.copyPaste);
      toast.success("Código PIX copiado!");
    }
  };

  // Poll for status
  useEffect(() => {
    let interval: any;
    if (step === "payment" && pixData?.transactionId) {
      interval = setInterval(async () => {
        try {
          const result = await checkStatus({ 
            data: { transactionId: pixData.transactionId } 
          });
          if (result.success && result.data.status === "paid") {
            // Send order to UTMify
            const utms = getPersistedUtms();
            
            // Format order for UTMify
            const orderData = {
              orderId: pixData.transactionId,
              platform: "Évora Store",
              paymentMethod: "pix" as const,
              status: "paid" as const,
              createdAt: new Date().toISOString().replace('T', ' ').split('.')[0],
              approvedDate: new Date().toISOString().replace('T', ' ').split('.')[0],
              customer: {
                name: formData.name,
                email: "customer@evora.com.br", // We could collect email, but using a placeholder if not present
                phone: null,
                document: formData.document,
                country: "BR",
              },
              products: items.map(item => ({
                id: item.id,
                name: item.name,
                quantity: item.quantity,
                priceInCents: Math.round(item.price * 100)
              })),
              trackingParameters: {
                src: utms.src || null,
                sck: utms.sck || null,
                utm_source: utms.utm_source || null,
                utm_campaign: utms.utm_campaign || null,
                utm_medium: utms.utm_medium || null,
                utm_content: utms.utm_content || null,
                utm_term: utms.utm_term || null,
              },
              commission: {
                totalPriceInCents: Math.round(totalPrice() * 100),
                gatewayFeeInCents: Math.round(totalPrice() * 0.03 * 100), // Estimating 3%
                userCommissionInCents: Math.round(totalPrice() * 0.97 * 100)
              }
            };

            sendToUtmify({ data: orderData }).catch(err => console.error("UTMify error:", err));

            setStep("success");
            clearCart();
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Error checking status:", error);
        }
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [step, pixData, checkStatus, clearCart]);

  if (step === "success") {
    return (
      <div className="flex h-full flex-col items-center justify-center space-y-6 p-8 text-center animate-in fade-in zoom-in duration-500">
        <div className="flex size-20 items-center justify-center rounded-full bg-green-50 text-green-600">
          <CheckCircle2 className="size-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-medium uppercase tracking-[0.2em]">Pagamento Confirmado</h2>
          <p className="text-sm font-light text-muted-foreground">
            Obrigada por escolher a Évora. Seu pedido já está sendo processado e você receberá atualizações em breve.
          </p>
        </div>
        <Button onClick={onClose} className="w-full rounded-none uppercase tracking-widest py-6">
          Voltar para a Loja
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-8">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xs font-medium uppercase tracking-[0.2em]">
          {step === "form" ? "Dados do Pagador" : "Pagamento PIX"}
        </h2>
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
          Total: R$ {totalPrice().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {step === "form" ? (
        <form onSubmit={handleCreatePayment} className="flex flex-1 flex-col justify-between">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-muted-foreground">Nome Completo</Label>
              <Input
                id="name"
                required
                className="rounded-none border-border/50 focus-visible:ring-foreground"
                placeholder="Ex: Maria Oliveira"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-[10px] uppercase tracking-widest text-muted-foreground">CPF (Somente números)</Label>
              <Input
                id="cpf"
                required
                maxLength={11}
                className="rounded-none border-border/50 focus-visible:ring-foreground"
                placeholder="000.000.000-00"
                value={formData.document}
                onChange={(e) => setFormData({ ...formData, document: e.target.value.replace(/\D/g, "") })}
              />
            </div>
            <p className="text-[9px] text-muted-foreground leading-relaxed uppercase tracking-wider">
              Seus dados são usados apenas para a geração da cobrança PIX segura via VexoPay.
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full rounded-none py-8 uppercase tracking-[0.2em] font-medium mt-8"
          >
            {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : "Gerar QR Code PIX"}
          </Button>
        </form>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="relative aspect-square w-full max-w-[240px] border border-border/50 p-4 bg-white">
            {pixData?.qrCodeBase64 ? (
              <img src={pixData.qrCodeBase64} alt="QR Code PIX" className="h-full w-full" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
                <QrCode className="size-20" />
              </div>
            )}
          </div>
          
          <div className="w-full space-y-4">
            <div className="text-center space-y-1">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em]">Escaneie o QR Code</p>
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Ou copie o código abaixo para pagar no seu banco</p>
            </div>
            
            <Button 
              variant="outline" 
              onClick={copyToClipboard}
              className="w-full rounded-none py-6 border-border/50 uppercase tracking-widest group"
            >
              <Copy className="mr-2 size-3 text-muted-foreground group-hover:text-foreground transition-colors" />
              Copiar Código PIX
            </Button>
          </div>

          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="size-3 animate-spin" />
            <span className="text-[9px] uppercase tracking-[0.2em]">Aguardando pagamento...</span>
          </div>

          <Button 
            variant="ghost" 
            onClick={() => setStep("form")} 
            className="text-[9px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
          >
            Alterar dados do pagador
          </Button>
        </div>
      )}
    </div>
  );
}
