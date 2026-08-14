import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, CheckCircle2, Loader2, QrCode, ShoppingBag, ShieldCheck, Truck, ChevronDown, ChevronUp } from "lucide-react";
import { createPixPayment, checkPixStatus } from "@/lib/vexopay.functions";
import { getAddressByCep } from "@/lib/cep.functions";
import { useServerFn } from "@tanstack/react-start";
import { getPersistedUtms } from "@/hooks/use-utm-tracking";
import { sendUtmifyOrder } from "@/lib/utmify.functions";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/optimized-image";

interface CheckoutOverlayProps {
  onClose: () => void;
}

export function CheckoutOverlay({ onClose }: CheckoutOverlayProps) {
  const { items, totalPrice, clearCart } = useCartStore();
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const [isAddressFilled, setIsAddressFilled] = useState(false);
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
          setIsAddressFilled(true);
          // Focus on number input after address is filled
          setTimeout(() => {
            const numberInput = document.getElementById('number');
            if (numberInput) numberInput.focus();
          }, 100);
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
    // Redirecionamento automático para a página de obrigado após o sucesso
    window.location.href = "/obrigado";
    return null;
  }


  return (
    <div className="flex h-full flex-col overflow-hidden bg-background">
      {/* Header Mobile / Tablet */}
      <div className="lg:hidden border-b border-border/50 sticky top-0 bg-background z-30">
        <div className="p-5 flex items-center justify-between">
           <div className="flex flex-col">
             <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-foreground">Checkout Seguro</span>
             <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Évora Luxury Store</span>
           </div>
           <button 
             onClick={() => setShowOrderSummary(!showOrderSummary)}
             className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-widest text-foreground bg-muted/30 px-3 py-2 border border-border/50"
           >
             <ShoppingBag className="size-4" />
             {showOrderSummary ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
             R$ {totalPrice().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
           </button>
        </div>
        
        {/* Resumo Mobile Expandível */}
        <div className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out bg-muted/10 border-t border-border/30",
          showOrderSummary ? "max-height-[500px] opacity-100" : "max-height-0 opacity-0 hidden"
        )}>
          <div className="p-5 space-y-4">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4">
                <div className="relative aspect-[3/4] w-14 shrink-0 overflow-hidden bg-muted border border-border/30">
                  <OptimizedImage src={item.image} alt={item.name} className="h-full w-full object-cover" width={56} height={75} />
                  <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-foreground text-background text-[10px] font-medium">
                    {item.quantity}
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-1">
                  <h4 className="text-[11px] font-bold uppercase tracking-widest leading-tight">{item.name}</h4>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Tamanho: {item.size}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] font-medium mt-1">
                      R$ {(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                    {item.originalPrice && (
                      <p className="text-[9px] text-muted-foreground/50 line-through mt-1">
                        R$ {(item.originalPrice * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <Separator className="bg-border/30" />
            <div className="space-y-2 pb-2">
              <div className="flex justify-between text-[11px] uppercase tracking-widest text-muted-foreground">
                <span>Itens</span>
                <span>R$ {items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-[11px] uppercase tracking-widest text-muted-foreground">
                <span>Desconto</span>
                <span className="text-green-600">- R$ {items.reduce((acc, item) => acc + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0), 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-[11px] uppercase tracking-widest text-green-600 font-bold">
                <span>Frete</span>
                <span>GRÁTIS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col lg:flex-row h-full overflow-hidden">
        {/* Coluna Esquerda: Formulário (ou QR Code) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 lg:p-16 lg:border-r lg:border-border/50">
          {step === "form" ? (
            <form onSubmit={handleCreatePayment} className="max-w-xl mx-auto space-y-12">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 md:size-8 items-center justify-center rounded-full bg-foreground text-background text-xs md:text-sm font-bold">1</span>
                  <h3 className="text-sm md:text-base font-bold uppercase tracking-[0.25em]">Informações de Contato</h3>
                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-foreground">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      className="h-12 md:h-14 rounded-none border-border/80 focus-visible:ring-foreground bg-muted/5 text-sm md:text-base"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-foreground">WhatsApp / Telefone</Label>
                    <Input
                      id="phone"
                      required
                      className="h-12 md:h-14 rounded-none border-border/80 focus-visible:ring-foreground bg-muted/5 text-sm md:text-base"
                      placeholder="(00) 00000-0000"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 md:size-8 items-center justify-center rounded-full bg-foreground text-background text-xs md:text-sm font-bold">2</span>
                  <h3 className="text-sm md:text-base font-bold uppercase tracking-[0.25em]">Endereço de Entrega</h3>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-foreground">Nome Completo</Label>
                    <Input
                      id="name"
                      required
                      className="h-12 md:h-14 rounded-none border-border/80 focus-visible:ring-foreground bg-muted/5 text-sm md:text-base"
                      placeholder="Nome completo para entrega"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-3">
                      <Label htmlFor="cpf" className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-foreground">CPF</Label>
                      <Input
                        id="cpf"
                        required
                        maxLength={11}
                        className="h-12 md:h-14 rounded-none border-border/80 focus-visible:ring-foreground bg-muted/5 text-sm md:text-base"
                        placeholder="000.000.000-00"
                        value={formData.document}
                        onChange={(e) => setFormData({ ...formData, document: e.target.value.replace(/\D/g, "") })}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="cep" className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-foreground">CEP</Label>
                      <Input
                        id="cep"
                        required
                        maxLength={8}
                        className="h-12 md:h-14 rounded-none border-border/80 focus-visible:ring-foreground bg-muted/5 text-sm md:text-base"
                        placeholder="00000-000"
                        value={formData.cep}
                        onChange={(e) => handleCepChange(e.target.value)}
                      />
                    </div>
                  </div>

                  {isAddressFilled && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 space-y-3">
                          <Label htmlFor="street" className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-foreground">Rua / Avenida</Label>
                          <Input
                            id="street"
                            required
                            className="h-12 md:h-14 rounded-none border-border/80 focus-visible:ring-foreground bg-muted/5 text-sm md:text-base"
                            placeholder="Endereço"
                            value={formData.street}
                            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                          />
                        </div>
                        <div className="col-span-1 space-y-3">
                          <Label htmlFor="number" className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-foreground">Número</Label>
                          <Input
                            id="number"
                            required
                            className="h-12 md:h-14 rounded-none border-border/80 focus-visible:ring-foreground bg-muted/5 text-sm md:text-base"
                            placeholder="123"
                            value={formData.number}
                            onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <div className="space-y-3">
                          <Label htmlFor="complement" className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-foreground">Complemento (opcional)</Label>
                          <Input
                            id="complement"
                            className="h-12 md:h-14 rounded-none border-border/80 focus-visible:ring-foreground bg-muted/5 text-sm md:text-base"
                            placeholder="Apto, Casa..."
                            value={formData.complement}
                            onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="neighborhood" className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-foreground">Bairro</Label>
                          <Input
                            id="neighborhood"
                            required
                            className="h-12 md:h-14 rounded-none border-border/80 focus-visible:ring-foreground bg-muted/5 text-sm md:text-base"
                            placeholder="Bairro"
                            value={formData.neighborhood}
                            onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-6">
                        <div className="col-span-3 space-y-3">
                          <Label htmlFor="city" className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-foreground">Cidade</Label>
                          <Input
                            id="city"
                            required
                            readOnly
                            className="h-12 md:h-14 rounded-none border-border/80 bg-muted/20 text-sm md:text-base"
                            value={formData.city}
                          />
                        </div>
                        <div className="col-span-1 space-y-3">
                          <Label htmlFor="state" className="text-[11px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-foreground">UF</Label>
                          <Input
                            id="state"
                            required
                            readOnly
                            className="h-12 md:h-14 rounded-none border-border/80 bg-muted/20 text-sm md:text-base text-center"
                            value={formData.state}
                          />
                        </div>
                      </div>

                      {/* Info de Frete e Prazo - Só aparece quando CEP está OK */}
                      <div className="bg-foreground text-background p-6 space-y-3 animate-in fade-in zoom-in duration-500">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Truck className="size-5" />
                            <span className="text-[12px] font-bold uppercase tracking-widest">Entrega Padrão</span>
                          </div>
                          <span className="text-[12px] font-bold uppercase tracking-widest text-green-400">Grátis</span>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-background/70">
                          Previsão de entrega: <strong className="text-background">5 dias úteis</strong>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <span className="flex size-7 md:size-8 items-center justify-center rounded-full bg-foreground text-background text-xs md:text-sm font-bold">3</span>
                  <h3 className="text-sm md:text-base font-bold uppercase tracking-[0.25em]">Pagamento Seguro</h3>
                </div>
                <div className="border-2 border-foreground p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-foreground text-background p-3">
                      <QrCode className="size-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[12px] font-bold uppercase tracking-[0.2em]">PIX Dinâmico</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Aprovação instantânea</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-600">Frete Grátis</span>
                    <span className="text-[9px] uppercase tracking-widest text-muted-foreground">Promoção Évora</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 flex flex-col gap-6">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full rounded-none py-10 md:py-12 text-sm md:text-base uppercase tracking-[0.3em] font-bold bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl utmify"
                >
                  {loading ? <Loader2 className="mr-2 size-5 animate-spin" /> : "Finalizar Compra"}
                </Button>
                <div className="flex flex-col items-center gap-4 py-4 border-t border-border/50">
                  <div className="flex items-center gap-4 opacity-70">
                    <ShieldCheck className="size-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Pagamento 100% Criptografado</span>
                  </div>
                  <div className="flex items-center gap-6 opacity-40 grayscale scale-75 md:scale-90">
                    <img src="https://logodownload.org/wp-content/uploads/2020/02/pix-bc-logo.png" alt="PIX" className="h-4" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png" alt="Visa" className="h-3" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Mastercard-logo.svg/1280px-Mastercard-logo.svg.png" alt="Mastercard" className="h-4" />
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 py-12 lg:py-20">
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold uppercase tracking-[0.3em]">Pedido Reservado</h3>
                <p className="text-[11px] text-muted-foreground uppercase tracking-[0.2em]">Escaneie o código abaixo para finalizar seu pedido na Évora.</p>
              </div>

              <div className="relative aspect-square w-full max-w-[320px] border-4 border-foreground p-8 bg-white shadow-2xl">
                {pixData?.qrCodeBase64 ? (
                  <img src={pixData.qrCodeBase64} alt="QR Code PIX" className="h-full w-full" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground/30">
                    <QrCode className="size-24" />
                  </div>
                )}
              </div>
              
              <div className="w-full max-w-sm space-y-8">
                <div className="text-center space-y-3">
                  <p className="text-[12px] font-bold uppercase tracking-[0.2em]">Copie o código abaixo se preferir:</p>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={copyToClipboard}
                  className="w-full rounded-none py-8 border-2 border-foreground uppercase tracking-[0.2em] font-bold group bg-foreground text-background hover:bg-foreground/90 transition-all"
                >
                  <Copy className="mr-3 size-5" />
                  Copiar Código PIX
                </Button>

                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3 text-foreground font-bold">
                    <Loader2 className="size-4 animate-spin" />
                    <span className="text-[11px] uppercase tracking-[0.2em]">Aguardando Pagamento...</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest text-center">
                    Não feche esta página até a confirmação automática.
                  </p>
                </div>

                <Button 
                  variant="ghost" 
                  onClick={() => setStep("form")} 
                  className="w-full text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  Alterar dados de entrega
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Coluna Direita: Resumo do Pedido (Desktop) */}
        <div className="hidden lg:flex lg:w-[450px] bg-muted/30 p-12 lg:p-16 flex-col gap-10 overflow-y-auto border-l border-border/30">
          <div className="space-y-10">
            <h3 className="text-[12px] font-bold uppercase tracking-[0.3em] border-b-2 border-foreground pb-6 flex items-center gap-3">
              <ShoppingBag className="size-4" />
              Itens Selecionados
            </h3>
            
            <div className="space-y-8">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}`} className="flex gap-6 group">
                  <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden bg-white border border-border/50 group-hover:border-foreground/30 transition-colors">
                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                    <span className="absolute -right-3 -top-3 flex size-7 items-center justify-center rounded-full bg-foreground text-background text-[11px] font-bold shadow-lg">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col justify-center gap-2">
                    <h4 className="text-[12px] font-bold uppercase tracking-[0.2em] leading-relaxed">{item.name}</h4>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Variante: {item.size}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-[13px] font-medium mt-1 tracking-wider">
                        R$ {(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </p>
                      {item.originalPrice && (
                        <p className="text-[10px] text-muted-foreground/50 line-through mt-1">
                          R$ {(item.originalPrice * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8 pt-8 mt-auto border-t border-border/50">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
                <span>Subtotal</span>
                <span>R$ {items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-[12px] uppercase tracking-[0.2em] text-muted-foreground">
                <span>Descontos</span>
                <span className="text-green-600">- R$ {items.reduce((acc, item) => acc + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0), 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-[12px] uppercase tracking-[0.2em] text-green-600 font-bold">
                <div className="flex items-center gap-3">
                   <span>Frete Évora</span>
                   <Truck className="size-4" />
                </div>
                <span>GRÁTIS</span>
              </div>
            </div>
            
            <Separator className="bg-foreground/10 h-0.5" />
            
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-muted-foreground">Total do Pedido</span>
                <p className="text-[9px] text-green-600 uppercase tracking-widest font-bold">Desconto VIP Aplicado</p>
              </div>
              <span className="text-2xl font-light tracking-[0.2em]">
                R$ {totalPrice().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="bg-foreground text-background p-6 space-y-3 shadow-xl">
              <div className="flex items-center gap-3 text-green-400">
                <ShieldCheck className="size-5" />
                <p className="text-[11px] uppercase tracking-[0.2em] font-bold">Garantia Évora Luxury</p>
              </div>
              <p className="text-[10px] text-background/70 uppercase tracking-widest leading-loose">
                Sua compra está protegida. Receba em 5 dias ou seu dinheiro de volta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
