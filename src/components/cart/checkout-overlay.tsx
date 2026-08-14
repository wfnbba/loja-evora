import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, CheckCircle2, Loader2, QrCode } from "lucide-react";
import { createPixPayment, checkPixStatus } from "@/lib/vexopay.functions";
import { getAddressByCep } from "@/lib/cep.functions";
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
    email: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const createPix = useServerFn(createPixPayment);
  const checkStatus = useServerFn(checkPixStatus);
  const sendToUtmify = useServerFn(sendUtmifyOrder);
  const getAddress = useServerFn(getAddressByCep);

  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    setFormData(prev => ({ ...prev, cep: cleanCep }));
    
    if (cleanCep.length === 8) {
      try {
        const result = await getAddress({ data: cleanCep });
        if (result.success && result.data) {
          setFormData(prev => ({
            ...prev,
            street: result.data.street || prev.street,
            neighborhood: result.data.neighborhood || prev.neighborhood,
            city: result.data.city || prev.city,
            state: result.data.state || prev.state,
          }));
        }
      } catch (error) {
        console.error("CEP fetch error:", error);
      }
    }
  };


  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const doc = formData.document.replace(/\D/g, "");
    if (doc.length !== 11) {
      toast.error("CPF deve ter 11 dígitos");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("E-mail inválido");
      return;
    }

    if (formData.cep.length !== 8) {
      toast.error("CEP inválido");
      return;
    }

    if (!formData.street || !formData.number || !formData.neighborhood || !formData.city || !formData.state) {
      toast.error("Preencha todos os campos de endereço");
      return;
    }

    setLoading(true);
    try {
      const result = await createPix({
        data: {
          items: items.map(i => ({ id: i.id, quantity: i.quantity })),
          payerName: formData.name,
          payerDocument: doc,
          email: formData.email,
          phone: formData.phone,
          address: {
            street: formData.street,
            number: formData.number,
            complement: formData.complement,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
            zipCode: formData.cep
          }
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
                email: formData.email,
                phone: formData.phone,
                document: formData.document,
                country: "BR",
                address: {
                  street: formData.street,
                  number: formData.number,
                  complement: formData.complement,
                  neighborhood: formData.neighborhood,
                  city: formData.city,
                  state: formData.state,
                  zipCode: formData.cep
                }
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
          {step === "form" ? "Dados de Entrega e Pagamento" : "Pagamento PIX"}
        </h2>
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
          Total: R$ {totalPrice().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
        </span>
      </div>

      {step === "form" ? (
        <form onSubmit={handleCreatePayment} className="flex flex-1 flex-col justify-between">
          <div className="space-y-6 pb-20">
            <div className="space-y-4">
              <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] border-b border-border/50 pb-2">Informações Pessoais</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-muted-foreground">Nome Completo</Label>
                  <Input
                    id="name"
                    required
                    className="rounded-none border-border/50 focus-visible:ring-foreground"
                    placeholder="Maria Oliveira"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cpf" className="text-[10px] uppercase tracking-widest text-muted-foreground">CPF</Label>
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
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-muted-foreground">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    className="rounded-none border-border/50 focus-visible:ring-foreground"
                    placeholder="maria@exemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-muted-foreground">Celular / WhatsApp</Label>
                  <Input
                    id="phone"
                    required
                    className="rounded-none border-border/50 focus-visible:ring-foreground"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] border-b border-border/50 pb-2">Endereço de Entrega</h3>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="cep" className="text-[10px] uppercase tracking-widest text-muted-foreground">CEP</Label>
                  <Input
                    id="cep"
                    required
                    maxLength={8}
                    className="rounded-none border-border/50 focus-visible:ring-foreground"
                    placeholder="00000-000"
                    value={formData.cep}
                    onChange={(e) => handleCepChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="street" className="text-[10px] uppercase tracking-widest text-muted-foreground">Endereço / Rua</Label>
                  <Input
                    id="street"
                    required
                    className="rounded-none border-border/50 focus-visible:ring-foreground"
                    placeholder="Nome da rua"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="number" className="text-[10px] uppercase tracking-widest text-muted-foreground">Número</Label>
                  <Input
                    id="number"
                    required
                    className="rounded-none border-border/50 focus-visible:ring-foreground"
                    placeholder="123"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="complement" className="text-[10px] uppercase tracking-widest text-muted-foreground">Complemento (opcional)</Label>
                  <Input
                    id="complement"
                    className="rounded-none border-border/50 focus-visible:ring-foreground"
                    placeholder="Apto, Bloco..."
                    value={formData.complement}
                    onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="neighborhood" className="text-[10px] uppercase tracking-widest text-muted-foreground">Bairro</Label>
                  <Input
                    id="neighborhood"
                    required
                    className="rounded-none border-border/50 focus-visible:ring-foreground"
                    placeholder="Nome do bairro"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  />
                </div>
                <div className="space-y-2 flex gap-4 sm:flex-row flex-col">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="city" className="text-[10px] uppercase tracking-widest text-muted-foreground">Cidade</Label>
                    <Input
                      id="city"
                      required
                      className="rounded-none border-border/50 focus-visible:ring-foreground"
                      placeholder="Sua cidade"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                  </div>
                  <div className="w-20 space-y-2">
                    <Label htmlFor="state" className="text-[10px] uppercase tracking-widest text-muted-foreground">UF</Label>
                    <Input
                      id="state"
                      required
                      maxLength={2}
                      className="rounded-none border-border/50 focus-visible:ring-foreground uppercase"
                      placeholder="SP"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                    />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-muted-foreground leading-relaxed uppercase tracking-wider">
              Seus dados são protegidos e usados apenas para a entrega e geração do pagamento seguro via VexoPay.
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="w-full rounded-none py-8 uppercase tracking-[0.2em] font-medium sticky bottom-0 z-10 bg-background border-t border-border/20"
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
