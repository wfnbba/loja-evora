import { useState, useEffect, useMemo } from "react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, CheckCircle2, Loader2, QrCode, ShoppingBag, ShieldCheck, Truck, ChevronDown, ChevronUp, Plus, Minus, X } from "lucide-react";
import { createPixPayment, checkPixStatus, updateTransactionStatus } from "@/lib/vexopay.functions";
import { getAddressByCep } from "@/lib/cep.functions";
import { useServerFn } from "@tanstack/react-start";
import { getPersistedUtms } from "@/hooks/use-utm-tracking";
import { sendUtmifyOrder } from "@/lib/utmify.functions";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/optimized-image";
import pixLogoAsset from "@/assets/logo-pix.png.asset.json";

interface CheckoutOverlayProps {
  onClose: () => void;
}

export function CheckoutOverlay({ onClose }: CheckoutOverlayProps) {
  const { items, totalPrice, clearCart, incrementQuantity, decrementQuantity, removeItem } = useCartStore();
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutos em segundos
  const [isAddressFilled, setIsAddressFilled] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);

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
  const updateStatus = useServerFn(updateTransactionStatus);

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
    
    // Permite qualquer valor ou vazio para documento e telefone, conforme pedido do usuário
    // Apenas validamos que o e-mail tem um formato mínimo e que o CEP tem 8 dígitos
    
    if (!formData.email.includes("@")) {
      toast.error("E-mail inválido");
      return;
    }

    if (!formData.email.includes("@")) {
      toast.error("E-mail inválido");
      return;
    }

    if (formData.cep && formData.cep.length > 0 && formData.cep.length !== 8) {
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
          items: [...items, ...(formData.street.length > 3 ? [{
            id: 'shipping-premium',
            name: 'Frete Premium Évora',
            price: 0,
            quantity: 1,
            size: 'Express',
            color: 'Logística'
          }] : [])].map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price, size: i.size, color: i.color })),
          payerName: formData.name || "Cliente",
          payerDocument: formData.document || "00000000000",
          email: formData.email,
          phone: formData.phone || "00000000000",
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
              orderId: pixData.transactionId || `order_${Date.now()}`,
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
            updateStatus({ data: { transactionId: pixData.transactionId, status: 'paid' } }).catch(err => console.error("Tracking update error:", err));
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

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (step === "success") {
    // Redirecionamento automático para a página de obrigado após o sucesso
    window.location.href = "/obrigado";
    return null;
  }


  return (
    <div className="w-full">
      {/* Banner de Urgência */}
      <div className="bg-[#1a1512] text-white py-4 px-6 text-center rounded-none mb-8">
        <p className="text-xs md:text-sm font-bold uppercase tracking-widest animate-pulse">
          Preço garantido por apenas <span className="text-[#d4af37] mx-1">{formatTime(timeLeft)}</span> devido a alta demanda.
        </p>
      </div>


      <div className="flex flex-col lg:flex-row min-h-screen relative z-10 bg-white">
        {/* Mobile Order Summary (Always Visible) */}
        <div className="lg:hidden border-b border-border/50 bg-[#faf8f6]">
          <div 
            className="w-full p-6 flex items-center justify-between text-xs font-bold uppercase tracking-widest border-b border-border/10"
          >
            <div className="flex items-center gap-3 text-foreground">
              <ShoppingBag className="size-5" />
              <span>Resumo do Pedido</span>
            </div>
            <span className="text-base text-foreground font-bold">
              R$ {totalPrice().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="p-4 space-y-4">
              {[...items, ...(formData.street.length > 3 ? [{
                id: 'shipping-premium',
                name: 'Frete Premium Évora',
                price: 0,
                quantity: 1,
                image: 'https://cdn-icons-png.flaticon.com/512/709/709790.png',
                size: 'Express',
                color: 'Logística'
              }] : [])].map((item) => {
                const originalPriceTotal = (item.originalPrice || item.price) * item.quantity;
                const currentPriceTotal = item.price * item.quantity;
                const discountPercentage = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;
                
                return (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4 py-4 border-b border-border/10 last:border-0 relative">
                    <div className="relative size-20 shrink-0 overflow-hidden bg-white border border-border/30 rounded-sm">
                      <OptimizedImage src={item.image} alt={item.name} className="h-full w-full object-cover" width={80} height={80} />
                    </div>
                    <div className="flex flex-1 flex-col justify-center gap-2">
                      <div className="flex justify-between items-start">
                        <h4 className="text-xs font-bold uppercase tracking-widest leading-tight w-2/3">
                          {item.id.includes('-brinde') ? 'BRINDE: ' : ''}{item.name}
                        </h4>
                        <div className="flex flex-col items-end">
                          <p className={cn("text-xs font-bold", item.price === 0 && "text-green-600")}>
                            {item.price === 0 ? "GRÁTIS" : `R$ ${currentPriceTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                          </p>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <p className="text-[10px] text-muted-foreground/50 line-through">R$ {originalPriceTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest shrink-0">Tam: {item.size}</p>
                            {item.color && (
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest truncate">Cor: {item.color}</p>
                            )}
                          </div>
                          {!item.id.includes('shipping-premium') && (
                            <div className="flex items-center border border-border/50 rounded-none bg-background w-fit">
                              <button onClick={(e) => { e.stopPropagation(); decrementQuantity(item.id, item.size, item.color); }} className="p-2 hover:bg-muted"><Minus className="size-3" /></button>
                              <span className="text-xs px-3 font-bold">{item.quantity}</span>
                              <button onClick={(e) => { e.stopPropagation(); incrementQuantity(item.id, item.size, item.color); }} className="p-2 hover:bg-muted"><Plus className="size-3" /></button>
                            </div>
                          )}
                        </div>
                        {discountPercentage > 0 && (
                          <span className="text-[10px] text-green-600 font-bold uppercase tracking-widest">-{discountPercentage}% OFF</span>
                        )}

                      </div>
                    </div>
                    {!item.id.includes('shipping-premium') && (
                      <button onClick={(e) => { e.stopPropagation(); removeItem(item.id, item.size, item.color); }} className="absolute -right-1 top-2 p-1 text-muted-foreground/40"><X className="size-3" /></button>
                    )}
                  </div>
                );
              })}
              
              <div className="pt-4 space-y-3 border-t-2 border-foreground/10">
                <div className="flex justify-between text-xs uppercase tracking-widest text-foreground font-bold">
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">Frete</span>
                    <Truck className="size-4 text-muted-foreground" />
                  </div>
                  <span className={formData.street.length > 3 ? "text-green-600 font-bold" : "text-muted-foreground/60 italic"}>
                    {formData.street.length > 3 ? "GRÁTIS" : "A calcular"}
                  </span>
                </div>
                
                <Separator className="bg-foreground/5" />
                
                <div className="flex justify-between items-end pt-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total</span>
                  <span className="text-xl font-bold tracking-tight">
                    R$ {totalPrice().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>



        {/* Form and Desktop Content */}
        <div className="flex-1 order-2 lg:order-1 p-6 md:p-10 lg:p-16 bg-white min-h-screen">
          <div className="bg-white">

            {step === "form" ? (
              <form onSubmit={handleCreatePayment} className="max-w-xl mx-auto space-y-10 mb-20">
              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                  <span className="flex size-7 md:size-8 items-center justify-center rounded-full bg-foreground text-background text-xs md:text-sm font-bold">1</span>
                  <h3 className="text-sm md:text-base font-bold uppercase tracking-widest">Contato</h3>

                </div>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-xs md:text-sm font-bold uppercase tracking-widest text-foreground">E-mail</Label>
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
                    <Label htmlFor="phone" className="text-xs md:text-sm font-bold uppercase tracking-widest text-foreground">WhatsApp / Telefone</Label>
                    <Input
                      id="phone"
                      required
                      className="h-12 md:h-14 rounded-none border-border/80 focus-visible:ring-foreground bg-muted/5 text-sm md:text-base"
                      placeholder="Telefone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                  <span className="flex size-7 md:size-8 items-center justify-center rounded-full bg-foreground text-background text-xs md:text-sm font-bold">2</span>
                  <h3 className="text-sm md:text-base font-bold uppercase tracking-widest">Entrega</h3>

                </div>
                <div className="grid grid-cols-1 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-xs md:text-sm font-bold uppercase tracking-widest text-foreground">Nome Completo</Label>
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
                      <Label htmlFor="cpf" className="text-xs md:text-sm font-bold uppercase tracking-widest text-foreground">CPF</Label>
                      <Input
                        id="cpf"
                        required
                        maxLength={20}
                        className="h-12 md:h-14 rounded-none border-border/80 focus-visible:ring-foreground bg-muted/5 text-sm md:text-base"
                        placeholder="000.000.000-00"
                        value={formData.document}
                        onChange={(e) => setFormData({ ...formData, document: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="cep" className="text-xs md:text-sm font-bold uppercase tracking-widest text-foreground">CEP</Label>
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

                  {true && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-3 gap-6">
                        <div className="col-span-2 space-y-3">
                          <Label htmlFor="street" className="text-xs md:text-sm font-bold uppercase tracking-widest text-foreground">Rua / Avenida</Label>
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
                          <Label htmlFor="number" className="text-xs md:text-sm font-bold uppercase tracking-widest text-foreground">Número</Label>
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
                          <Label htmlFor="complement" className="text-xs md:text-sm font-bold uppercase tracking-widest text-foreground">Complemento (opcional)</Label>
                          <Input
                            id="complement"
                            className="h-12 md:h-14 rounded-none border-border/80 focus-visible:ring-foreground bg-muted/5 text-sm md:text-base"
                            placeholder="Apto, Casa..."
                            value={formData.complement}
                            onChange={(e) => setFormData({ ...formData, complement: e.target.value })}
                          />
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="neighborhood" className="text-xs md:text-sm font-bold uppercase tracking-widest text-foreground">Bairro</Label>
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
                          <Label htmlFor="city" className="text-xs md:text-sm font-bold uppercase tracking-widest text-foreground">Cidade</Label>
                          <Input
                            id="city"
                            required
                            className="h-12 md:h-14 rounded-none border-border/80 focus-visible:ring-foreground bg-muted/5 text-sm md:text-base"
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            value={formData.city}
                          />
                        </div>
                        <div className="col-span-1 space-y-3">
                          <Label htmlFor="state" className="text-xs md:text-sm font-bold uppercase tracking-widest text-foreground">UF</Label>
                          <Input
                            id="state"
                            required
                            className="h-12 md:h-14 rounded-none border-border/80 focus-visible:ring-foreground bg-muted/5 text-sm md:text-base text-center"
                            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                            value={formData.state}
                          />
                        </div>
                      </div>

                      {/* Info de Frete e Prazo - Só aparece quando CEP está OK */}
                      {formData.street.length > 3 && (
                        <div className="bg-foreground text-background p-6 space-y-3 animate-in fade-in zoom-in duration-500">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Truck className="size-5" />
                              <span className="text-sm font-bold uppercase tracking-widest">Entrega Padrão</span>
                            </div>
                            <span className="text-sm font-bold uppercase tracking-widest text-green-400">Grátis</span>
                          </div>
                          <p className="text-xs uppercase tracking-widest text-background/70">
                            Previsão de entrega: <strong className="text-background">5 dias úteis</strong>

                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                  <span className="flex size-7 md:size-8 items-center justify-center rounded-full bg-foreground text-background text-xs md:text-sm font-bold">3</span>
                  <h3 className="text-sm md:text-base font-bold uppercase tracking-widest">Pagamento</h3>

                </div>
                <div className="border border-border/50 p-6 flex items-center justify-between bg-white shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="bg-foreground text-background p-3 rounded-sm">
                      <QrCode className="size-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold uppercase tracking-widest">PIX Dinâmico</p>
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">Aprovação instantânea</p>

                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {isAddressFilled && (
                      <span className="text-xs font-bold uppercase tracking-widest text-green-600 animate-in fade-in duration-300">Frete Grátis</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-6 flex flex-col gap-6">
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full rounded-none py-10 md:py-12 text-sm md:text-base uppercase tracking-widest font-bold bg-foreground text-background hover:bg-foreground/90 transition-all shadow-xl utmify"
                >
                  {loading ? <Loader2 className="mr-2 size-5 animate-spin" /> : "Gerar PIX QR Code"}
                </Button>
                <div className="flex flex-col items-center gap-4 py-8 border-t border-border/50 bg-muted/5">
                  <div className="flex items-center gap-6 opacity-60 scale-75 md:scale-90">
                    <img src={pixLogoAsset.url} alt="PIX" className="h-8 w-auto" />
                  </div>
                  <div className="flex items-center gap-4 text-foreground/80">
                    <ShieldCheck className="size-5 text-green-600" />
                    <span className="text-xs font-bold uppercase tracking-widest">Pagamento Seguro & Criptografado</span>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center space-y-10 animate-in fade-in slide-in-from-right-4 duration-500 py-12 lg:py-20">
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold uppercase tracking-widest">Pedido Reservado</h3>
                <p className="text-sm text-muted-foreground uppercase tracking-widest">Escaneie o código abaixo para finalizar seu pedido na Évora.</p>

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
                  <p className="text-sm font-bold uppercase tracking-widest">Copie o código abaixo se preferir:</p>
                </div>
                
                <Button 
                  variant="outline" 
                  onClick={copyToClipboard}
                  className="w-full rounded-none py-10 border-2 border-foreground uppercase tracking-widest font-bold group bg-foreground text-background hover:bg-foreground/90 transition-all"
                >
                  <Copy className="mr-3 size-5" />
                  Copiar Código PIX
                </Button>

                <div className="flex flex-col items-center gap-4">
                  <div className="flex items-center gap-3 text-foreground font-bold">
                    <Loader2 className="size-4 animate-spin" />
                    <span className="text-sm uppercase tracking-widest font-bold">Aguardando Pagamento...</span>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest text-center">
                    Não feche esta página até a confirmação automática.
                  </p>
                  
                  <div className="flex flex-col items-center gap-4 py-8 border-t border-border/50 bg-muted/5 w-full mt-4">
                    <div className="flex items-center gap-6 opacity-60 scale-75 md:scale-90">
                      <img src={pixLogoAsset.url} alt="PIX" className="h-8 w-auto" />
                    </div>
                  </div>
                </div>

                <Button 
                  variant="ghost" 
                  onClick={() => setStep("form")} 
                  className="w-full text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  Alterar dados de entrega
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Coluna Direita: Resumo do Pedido (Desktop) */}
        <div className="hidden lg:flex lg:w-[450px] bg-[#faf8f6] p-12 lg:p-16 flex-col gap-10 border-l border-border/30 min-h-screen">
          <div className="space-y-10">

            <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-foreground pb-6 flex items-center gap-3">
              <ShoppingBag className="size-4" />
              Itens Selecionados
            </h3>
            
            <div className="space-y-8">
              {[...items, ...(formData.street.length > 3 ? [{
                id: 'shipping-premium',
                name: 'Frete Premium Évora',
                price: 0,
                quantity: 1,
                image: 'https://cdn-icons-png.flaticon.com/512/709/709790.png',
                size: 'Express',
                color: 'Logística'
              }] : [])].map((item) => {
                const originalPriceTotal = (item.originalPrice || item.price) * item.quantity;
                const currentPriceTotal = item.price * item.quantity;
                const discountAmount = originalPriceTotal - currentPriceTotal;
                const discountPercentage = item.originalPrice ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100) : 0;

                return (
                  <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-5 py-4 border-b border-border/10 last:border-0 relative group">
                    <div className="relative size-20 shrink-0 overflow-hidden bg-white border border-border/50 rounded-sm">
                      <OptimizedImage src={item.image} alt={item.name} className="h-full w-full object-cover" width={80} height={80} />
                    </div>
                    <div className="flex flex-1 flex-col justify-center">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="text-sm font-bold uppercase tracking-widest leading-relaxed line-clamp-2">
                          {item.id.includes('-brinde') ? 'BRINDE: ' : ''}{item.name}
                        </h4>
                        <div className="flex flex-col items-end shrink-0">
                          <p className={cn("text-base font-bold tracking-wider", item.price === 0 && "text-green-600")}>
                            {item.price === 0 ? "GRÁTIS" : `R$ ${currentPriceTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`}
                          </p>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <p className="text-xs text-muted-foreground/50 line-through tracking-tighter">

                              R$ {originalPriceTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-4">
                            <p className="text-xs text-muted-foreground uppercase tracking-widest shrink-0">Tamanho: {item.size}</p>
                            {item.color && (
                              <p className="text-xs text-muted-foreground uppercase tracking-widest truncate">Cor: {item.color}</p>

                            )}
                          </div>
                          {!item.id.includes('shipping-premium') && (
                            <div className="flex items-center border border-border/50 rounded-none bg-background w-fit">
                              <button onClick={() => decrementQuantity(item.id, item.size, item.color)} className="p-1 hover:bg-muted"><Minus className="size-3" /></button>
                              <span className="text-sm px-3 font-bold">{item.quantity}</span>
                              <button onClick={() => incrementQuantity(item.id, item.size, item.color)} className="p-1 hover:bg-muted"><Plus className="size-3" /></button>
                            </div>
                          )}
                        </div>
                        {discountAmount > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 font-bold uppercase tracking-widest">
                            {discountPercentage}% OFF
                          </span>
                        )}
                      </div>
                    </div>
                    {!item.id.includes('shipping-premium') && (
                      <button 
                        onClick={() => removeItem(item.id, item.size, item.color)} 
                        className="absolute -right-2 top-0 p-2 text-muted-foreground/40 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="size-4" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-8 pt-8 mt-auto border-t border-border/50">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs uppercase tracking-widest text-muted-foreground">
                <span>Subtotal</span>
                <span>R$ {items.reduce((acc, item) => acc + ((item.originalPrice || item.price) * item.quantity), 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-xs uppercase tracking-widest text-muted-foreground">

                <span>Descontos</span>
                <span className="text-green-600">- R$ {items.reduce((acc, item) => acc + (item.originalPrice ? (item.originalPrice - item.price) * item.quantity : 0), 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-xs uppercase tracking-widest font-bold">
                <div className="flex items-center gap-3">
                   <span className="text-muted-foreground">Frete</span>
                   <Truck className="size-4 text-muted-foreground" />
                </div>
                <span className={isAddressFilled ? "text-green-600 font-bold" : "text-muted-foreground font-normal italic"}>
                  {isAddressFilled ? "GRÁTIS" : "A calcular"}
                </span>
              </div>
            </div>
            
            <Separator className="bg-foreground/10 h-0.5" />
            
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total do Pedido</span>
                <p className="text-[10px] text-green-600 uppercase tracking-widest font-bold">Desconto VIP Aplicado</p>

              </div>
              <span className="text-2xl font-light tracking-[0.2em]">
                R$ {items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="bg-foreground text-background p-6 space-y-3 shadow-xl">
              <div className="flex items-center gap-3 text-green-400">
                <ShieldCheck className="size-5" />
                <p className="text-xs uppercase tracking-widest font-bold">Garantia Évora Luxury</p>
              </div>
              <p className="text-xs text-background/70 uppercase tracking-widest leading-loose">
                Sua compra está protegida. Receba em 5 dias ou seu dinheiro de volta.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
