import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, CheckCircle2, Loader2, QrCode, ShoppingBag, ShieldCheck, Truck } from "lucide-react";
import { createPixPayment, checkPixStatus } from "@/lib/vexopay.functions";
import { getAddressByCep } from "@/lib/cep.functions";
import { useServerFn } from "@tanstack/react-start";
import { getPersistedUtms } from "@/hooks/use-utm-tracking";
import { sendUtmifyOrder } from "@/lib/utmify.functions";
import { Separator } from "@/components/ui/separator";

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
          // Focus on number input after address is filled
          const numberInput = document.getElementById('number');
          if (numberInput) numberInput.focus();
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

  useEffect(() => {
    let interval: any;
    if (step === "payment" && pixData?.transactionId) {
      interval = setInterval(async () => {
        try {
          const result = await checkStatus({ 
            data: { transactionId: pixData.transactionId } 
          });
          if (result.success && result.data.status === "paid") {
            const utms = getPersistedUtms();
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
                gatewayFeeInCents: Math.round(totalPrice() * 0.03 * 100),
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
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Header Mobile Simplificado */}
      <div className="lg:hidden border-b border-border/50 p-4 sticky top-0 bg-background z-20 flex items-center justify-between">
         <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Checkout Seguro</span>
         <span className="text-[10px] text-muted-foreground tracking-widest">
            Total: R$ {totalPrice().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
         </span>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row h-full">
        {/* Coluna Esquerda: Formulário (ou QR Code) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 lg:border-r lg:border-border/50">
          {step === "form" ? (
            <form onSubmit={handleCreatePayment} className="max-w-xl mx-auto space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-medium">1</span>
                  <h3 className="text-[10px] font-medium uppercase tracking-[0.2em]">Informações de Contato</h3>
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-muted-foreground">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      className="rounded-none border-border/50 focus-visible:ring-foreground bg-muted/5"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-muted-foreground">Telefone</Label>
                    <Input
                      id="phone"
                      required
                      className="rounded-none border-border/50 focus-visible:ring-foreground bg-muted/5"
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-medium">2</span>
                  <h3 className="text-[10px] font-medium uppercase tracking-[0.2em]">Dados de Entrega</h3>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-[10px] uppercase tracking-widest text-muted-foreground">Nome Completo</Label>
                    <Input
                      id="name"
                      required
                      className="rounded-none border-border/50 focus-visible:ring-foreground bg-muted/5"
                      placeholder="Nome impresso no documento"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="cpf" className="text-[10px] uppercase tracking-widest text-muted-foreground">CPF</Label>
                      <Input
                        id="cpf"
                        required
                        maxLength={11}
                        className="rounded-none border-border/50 focus-visible:ring-foreground bg-muted/5"
                        placeholder="000.000.000-00"
                        value={formData.document}
                        onChange={(e) => setFormData({ ...formData, document: e.target.value.replace(/\D/g, "") })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cep" className="text-[10px] uppercase tracking-widest text-muted-foreground">CEP</Label>
                      <Input
                        id="cep"
                        required
                        maxLength={8}
                        className="rounded-none border-border/50 focus-visible:ring-foreground bg-muted/5"
                        placeholder="00000-000"
                        value={formData.cep}
                        onChange={(e) => handleCepChange(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2 space-y-2">
                      <Label htmlFor="street" className="text-[10px] uppercase tracking-widest text-muted-foreground">Rua / Avenida</Label>
                      <Input
                        id="street"
                        required
                        className="rounded-none border-border/50 focus-visible:ring-foreground bg-muted/5"
                        placeholder="Endereço principal"
                        value={formData.street}
                        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      />
                    </div>
                    <div className="col-span-1 space-y-2">
                      <Label htmlFor="number" className="text-[10px] uppercase tracking-widest text-muted-foreground">Número</Label>
                      <Input
                        id="number"
                        required
                        className="rounded-none border-border/50 focus-visible:ring-foreground bg-muted/5"
                        placeholder="123"
                        value={formData.number}
                        onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="complement" className="text-[10px] uppercase tracking-widest text-muted-foreground">Complemento (opcional)</Label>
                      <Input
                        id="complement"
                        className="rounded-none border-border/50 focus-visible:ring-foreground bg-muted/5"
                        placeholder="Apto, Bloco, Casa..."
                        value={formData.complement}
                        onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="neighborhood" className="text-[10px] uppercase tracking-widest text-muted-foreground">Bairro</Label>
                      <Input
                        id="neighborhood"
                        required
                        className="rounded-none border-border/50 focus-visible:ring-foreground bg-muted/5"
                        placeholder="Seu bairro"
                        value={formData.neighborhood}
                        onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="col-span-3 space-y-2">
                      <Label htmlFor="city" className="text-[10px] uppercase tracking-widest text-muted-foreground">Cidade</Label>
                      <Input
                        id="city"
                        required
                        className="rounded-none border-border/50 focus-visible:ring-foreground bg-muted/5"
                        placeholder="Cidade"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      />
                    </div>
                    <div className="col-span-1 space-y-2">
                      <Label htmlFor="state" className="text-[10px] uppercase tracking-widest text-muted-foreground">UF</Label>
                      <Input
                        id="state"
                        required
                        maxLength={2}
                        className="rounded-none border-border/50 focus-visible:ring-foreground bg-muted/5 uppercase"
                        placeholder="UF"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value.toUpperCase() })}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="flex size-5 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-medium">3</span>
                  <h3 className="text-[10px] font-medium uppercase tracking-[0.2em]">Forma de Pagamento</h3>
                </div>
                <div className="border border-foreground p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-foreground text-background p-2">
                      <QrCode className="size-4" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-medium uppercase tracking-widest">PIX Dinâmico</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Liberação imediata</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-medium uppercase tracking-widest text-green-600">Frete Grátis</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col gap-4">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full rounded-none py-8 uppercase tracking-[0.2em] font-medium bg-foreground text-background hover:bg-foreground/90 transition-all utmify"
                >
                  {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : "Gerar PIX QR Code"}
                </Button>
                <div className="flex items-center justify-center gap-4 opacity-50">
                  <ShieldCheck className="size-3" />
                  <span className="text-[8px] uppercase tracking-[0.2em]">Pagamento 100% Seguro</span>
                  <span className="text-[8px] uppercase tracking-[0.2em]">•</span>
                  <span className="text-[8px] uppercase tracking-[0.2em]">Processado por VexoPay</span>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 py-10">
              <div className="text-center space-y-2">
                <h3 className="text-xl font-light uppercase tracking-[0.2em]">Pedido Reservado</h3>
                <p className="text-xs text-muted-foreground uppercase tracking-widest">Finalize o pagamento abaixo para confirmar seu pedido.</p>
              </div>

              <div className="relative aspect-square w-full max-w-[280px] border border-border/50 p-6 bg-white shadow-sm">
                {pixData?.qrCodeBase64 ? (
                  <img src={pixData.qrCodeBase64} alt="QR Code PIX" className="h-full w-full" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
                    <QrCode className="size-20" />
                  </div>
                )}
              </div>
              
              <div className="w-full max-w-sm space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em]">Escaneie com o app do seu banco</p>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest">Ou utilize o código copia e cola abaixo:</p>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={copyToClipboard}
                  className="w-full rounded-none py-7 border-foreground uppercase tracking-widest group bg-foreground text-background hover:bg-foreground/90 transition-all"
                >
                  <Copy className="mr-3 size-4" />
                  Copiar Código PIX
                </Button>

                <div className="flex items-center justify-center gap-3 text-muted-foreground">
                  <Loader2 className="size-3 animate-spin" />
                  <span className="text-[9px] uppercase tracking-[0.2em]">Aguardando confirmação...</span>
                </div>

                <Button 
                  variant="ghost" 
                  onClick={() => setStep("form")} 
                  className="w-full text-[9px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
                >
                  Voltar e alterar dados
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Coluna Direita: Resumo do Pedido (Desktop) ou Drawer (Mobile) */}
        <div className="lg:w-[400px] bg-muted/20 p-6 lg:p-10 flex flex-col gap-8 overflow-y-auto">
          <div className="space-y-6">
            <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] border-b border-border/50 pb-4 flex items-center gap-2">
              <ShoppingBag className="size-3" />
              Resumo do Pedido
            </h3>
            
            <div className="space-y-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-4">
                  <div className="relative aspect-[3/4] w-16 shrink-0 overflow-hidden bg-muted border border-border/30">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-foreground text-background text-[9px] font-medium">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-between py-0.5">
                    <div className="space-y-1">
                      <h4 className="text-[9px] font-medium uppercase tracking-widest leading-relaxed line-clamp-2">{item.name}</h4>
                      <p className="text-[8px] text-muted-foreground uppercase tracking-widest">Tamanho: {item.size}</p>
                    </div>
                    <p className="text-[10px] font-medium tracking-wider">
                      R$ {(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-4 mt-auto">
            <Separator className="bg-border/50" />
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>Subtotal</span>
                <span>R$ {totalPrice().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-widest text-muted-foreground">
                <div className="flex items-center gap-2">
                   <span>Frete</span>
                   <Truck className="size-3" />
                </div>
                <span className="text-green-600 font-medium">GRÁTIS</span>
              </div>
            </div>
            <Separator className="bg-border/50" />
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-medium uppercase tracking-[0.2em]">Total a Pagar</span>
              <span className="text-lg font-light tracking-widest">
                R$ {totalPrice().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="bg-green-600/5 p-3 flex items-center gap-3 border border-green-600/20">
              <ShieldCheck className="size-4 text-green-600" />
              <p className="text-[9px] text-green-800 uppercase tracking-widest font-medium">Você está economizando R$ {(totalPrice() * 0.1).toLocaleString("pt-BR", { minimumFractionDigits: 2 })} hoje!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
