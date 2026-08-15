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
  const [timeLeft, setTimeLeft] = useState(15 * 60);
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

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    setFormData((prev) => ({ ...prev, cep: cleanCep }));
    
    if (cleanCep.length === 8) {
      try {
        const address = await getAddress({ cep: cleanCep });
        if (address) {
          setFormData((prev) => ({
            ...prev,
            street: address.logradouro || prev.street,
            neighborhood: address.bairro || prev.neighborhood,
            city: address.localidade || prev.city,
            state: address.uf || prev.state,
          }));
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  useEffect(() => {
    if (formData.street && formData.street.length > 3) {
      setIsAddressFilled(true);
    }
  }, [formData.street]);

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.document || !formData.phone) {
      toast.error("Por favor, preencha seus dados de contato.");
      return;
    }
    if (!formData.street || !formData.number || !formData.city) {
      toast.error("Por favor, preencha seus dados de entrega.");
      return;
    }

    setLoading(true);
    try {
      const utms = getPersistedUtms();
      
      const response = await createPix({
        customer: {
          name: formData.name,
          email: formData.email,
          document: formData.document,
          phone: formData.phone,
        },
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          color: item.color,
          size: item.size
        })),
        address: {
          zipCode: formData.cep,
          street: formData.street,
          number: formData.number,
          complement: formData.complement,
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
        },
        utms
      });

      if (response.success && response.data) {
        setPixData(response.data);
        setStep("payment");
        toast.success("PIX gerado com sucesso!");
        
        try {
          await sendToUtmify({
            email: formData.email,
            phone: formData.phone,
            name: formData.name,
            value: totalPrice(),
            items: items.map(i => i.name).join(", "),
            utms
          });
        } catch (err) {
          console.warn("Utmify skip:", err);
        }
      } else {
        toast.error(response.error || "Erro ao gerar PIX");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Ocorreu um erro no processamento.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === "payment" && pixData?.transactionId) {
      interval = setInterval(async () => {
        try {
          const status = await checkStatus({ transactionId: pixData.transactionId });
          if (status.paid) {
            setStep("success");
            clearInterval(interval);
          }
        } catch (err) {
          console.error("Status check error:", err);
        }
      }, 5000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [step, pixData]);

  const copyPixCode = () => {
    if (pixData?.qrCodeText) {
      navigator.clipboard.writeText(pixData.qrCodeText);
      toast.success("Código PIX copiado!");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (step === "success") {
    window.location.href = "/obrigado";
    return null;
  }

  return (
    <div className="w-full">
      <div className="bg-[#1a1512] text-white py-4 px-6 text-center rounded-none mb-8">
        <p className="text-xs md:text-sm font-bold uppercase tracking-widest animate-pulse">
          Preço garantido por apenas <span className="text-[#d4af37] mx-1">{formatTime(timeLeft)}</span> devido a alta demanda.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen relative z-10 bg-white">
        <div className="lg:hidden border-b border-border/50 bg-[#faf8f6]">
          <div className="w-full p-6 flex items-center justify-between text-xs font-bold uppercase tracking-widest border-b border-border/10">
            <div className="flex items-center gap-3 text-foreground">
              <ShoppingBag className="size-5" />
              <span>Resumo do Pedido</span>
            </div>
            <span className="text-base text-foreground font-bold">
              R$ {totalPrice().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className="p-6 space-y-8 bg-white/50">
            <div className="space-y-6">
              {items.map((item) => (
                <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-4">
                  <div className="relative size-20 flex-shrink-0 bg-muted rounded-none overflow-hidden border border-border/10">
                    <OptimizedImage src={item.image} alt={item.name} className="object-cover w-full h-full" />
                    <span className="absolute -top-2 -right-2 size-6 bg-foreground text-background text-[10px] flex items-center justify-center rounded-full font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 py-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-widest leading-tight truncate">{item.name}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                        {item.color} / {item.size}
                      </p>
                    </div>
                    <span className="text-xs font-bold tracking-tight">
                      R$ {(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              ))}
              
              {isAddressFilled && (
                <div className="flex gap-4 animate-in fade-in slide-in-from-left-2">
                  <div className="size-20 flex-shrink-0 bg-green-50 flex items-center justify-center border border-green-100">
                    <Truck className="size-8 text-green-600" />
                  </div>
                  <div className="flex-1 py-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-widest text-green-700">Frete Premium Évora</h4>
                      <p className="text-[10px] text-green-600/70 uppercase tracking-wider mt-1">Entrega em 5 dias úteis</p>
                    </div>
                    <span className="text-xs font-bold text-green-700 uppercase">Grátis</span>
                  </div>
                </div>
              )}
            </div>

            <Separator className="bg-foreground/5" />

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Subtotal</span>
                <span className="text-xs font-bold">R$ {totalPrice().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Frete</span>
                <span className="text-xs font-bold text-green-600">{isAddressFilled ? "GRÁTIS" : "Calculando..."}</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total</span>
                <span className="text-xl font-bold tracking-tight">
                  R$ {totalPrice().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 order-2 lg:order-1 p-6 md:p-10 lg:p-16 bg-white min-h-screen">
          <div className="bg-white">
            {step === "form" ? (
              <form onSubmit={handleCreatePayment} className="max-w-xl mx-auto space-y-10 mb-20">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                    <span className="flex size-7 md:size-8 items-center justify-center rounded-full bg-foreground text-background text-xs md:text-sm font-bold">1</span>
                    <h3 className="text-sm md:text-base font-bold uppercase tracking-widest">Contato</h3>
                  </div>
                  <div className="grid gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[10px] uppercase tracking-widest font-bold">E-mail</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="h-14 md:h-16 text-base md:text-lg border-foreground/10 focus:border-foreground rounded-none bg-muted/5" placeholder="exemplo@email.com" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-[10px] uppercase tracking-widest font-bold">Nome Completo</Label>
                        <Input id="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="h-14 md:h-16 text-base md:text-lg border-foreground/10 focus:border-foreground rounded-none bg-muted/5" placeholder="Nome Sobrenome" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="document" className="text-[10px] uppercase tracking-widest font-bold">CPF</Label>
                        <Input id="document" value={formData.document} onChange={(e) => setFormData(prev => ({ ...prev, document: e.target.value }))} className="h-14 md:h-16 text-base md:text-lg border-foreground/10 focus:border-foreground rounded-none bg-muted/5" placeholder="000.000.000-00" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest font-bold">Celular / WhatsApp</Label>
                      <Input id="phone" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="h-14 md:h-16 text-base md:text-lg border-foreground/10 focus:border-foreground rounded-none bg-muted/5" placeholder="(00) 00000-0000" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                    <span className="flex size-7 md:size-8 items-center justify-center rounded-full bg-foreground text-background text-xs md:text-sm font-bold">2</span>
                    <h3 className="text-sm md:text-base font-bold uppercase tracking-widest">Entrega</h3>
                  </div>
                  <div className="grid gap-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2 col-span-1">
                        <Label htmlFor="cep" className="text-[10px] uppercase tracking-widest font-bold">CEP</Label>
                        <Input id="cep" value={formData.cep} onChange={(e) => handleCepChange(e.target.value)} className="h-14 md:h-16 text-base md:text-lg border-foreground/10 focus:border-foreground rounded-none bg-muted/5" placeholder="00000-000" />
                      </div>
                      <div className="space-y-2 col-span-1 md:col-span-2">
                        <Label htmlFor="street" className="text-[10px] uppercase tracking-widest font-bold">Endereço / Rua</Label>
                        <Input id="street" value={formData.street} onChange={(e) => setFormData(prev => ({ ...prev, street: e.target.value }))} className="h-14 md:h-16 text-base md:text-lg border-foreground/10 focus:border-foreground rounded-none bg-muted/5" placeholder="Rua, Avenida..." />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="number" className="text-[10px] uppercase tracking-widest font-bold">Número</Label>
                        <Input id="number" value={formData.number} onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))} className="h-14 md:h-16 text-base md:text-lg border-foreground/10 focus:border-foreground rounded-none bg-muted/5" placeholder="123" />
                      </div>
                      <div className="space-y-2 col-span-1 md:col-span-3">
                        <Label htmlFor="complement" className="text-[10px] uppercase tracking-widest font-bold">Complemento (Opcional)</Label>
                        <Input id="complement" value={formData.complement} onChange={(e) => setFormData(prev => ({ ...prev, complement: e.target.value }))} className="h-14 md:h-16 text-base md:text-lg border-foreground/10 focus:border-foreground rounded-none bg-muted/5" placeholder="Apto, Bloco..." />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="neighborhood" className="text-[10px] uppercase tracking-widest font-bold">Bairro</Label>
                        <Input id="neighborhood" value={formData.neighborhood} onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))} className="h-14 md:h-16 text-base md:text-lg border-foreground/10 focus:border-foreground rounded-none bg-muted/5" placeholder="Nome do Bairro" />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="city" className="text-[10px] uppercase tracking-widest font-bold">Cidade</Label>
                          <Input id="city" value={formData.city} onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))} className="h-14 md:h-16 text-base md:text-lg border-foreground/10 focus:border-foreground rounded-none bg-muted/5" placeholder="Cidade" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="state" className="text-[10px] uppercase tracking-widest font-bold">UF</Label>
                          <Input id="state" value={formData.state} onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))} className="h-14 md:h-16 text-base md:text-lg border-foreground/10 focus:border-foreground rounded-none bg-muted/5" placeholder="UF" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-border/50 pb-4">
                    <span className="flex size-7 md:size-8 items-center justify-center rounded-full bg-foreground text-background text-xs md:text-sm font-bold">3</span>
                    <h3 className="text-sm md:text-base font-bold uppercase tracking-widest">Pagamento</h3>
                  </div>
                  <div className="bg-[#faf8f6] p-6 border border-foreground/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="size-10 bg-foreground text-background flex items-center justify-center rounded-none">
                          <img src={pixLogoAsset.url} alt="PIX" className="size-6 brightness-0 invert" />
                        </div>
                        <div>
                          <p className="text-xs font-bold uppercase tracking-widest">PIX Dinâmico</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Aprovação Imediata</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle2 className="size-4" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Ativo</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full h-16 md:h-20 bg-foreground text-background hover:bg-foreground/90 rounded-none text-sm md:text-base font-bold uppercase tracking-[0.2em] transition-all duration-500 shadow-2xl hover:scale-[1.01]"
                >
                  {loading ? (
                    <Loader2 className="mr-3 size-5 animate-spin" />
                  ) : (
                    <QrCode className="mr-3 size-5" />
                  )}
                  Gerar QR Code PIX
                </Button>

                <div className="flex flex-col items-center gap-6 pt-4">
                  <div className="flex items-center gap-4 opacity-40 grayscale transition-all duration-500 hover:opacity-100 hover:grayscale-0">
                    <img src={pixLogoAsset.url} alt="PIX" className="h-6 w-auto" />
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ShieldCheck className="size-4" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.1em]">Pagamento Seguro & Criptografado</span>
                  </div>
                </div>
              </form>
            ) : (
              <div className="max-w-xl mx-auto space-y-10 py-10 md:py-20 animate-in fade-in slide-in-from-bottom-10 duration-700">
                <div className="text-center space-y-4">
                  <div className="inline-flex size-20 items-center justify-center rounded-full bg-green-50 text-green-600 mb-4 animate-bounce">
                    <QrCode className="size-10" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-light uppercase tracking-[0.3em]">PIX Gerado</h2>
                  <p className="text-xs md:text-sm text-muted-foreground uppercase tracking-widest">Escaneie o QR Code ou copie a chave abaixo</p>
                </div>

                <div className="bg-white p-6 md:p-10 shadow-2xl border border-border/50 space-y-8 text-center flex flex-col items-center">
                  {pixData?.qrCodeImage && (
                    <div className="p-4 bg-white border-4 border-foreground/5 shadow-inner">
                      <img src={pixData.qrCodeImage} alt="QR Code PIX" className="size-56 md:size-72" />
                    </div>
                  )}

                  <Button 
                    variant="outline"
                    onClick={copyPixCode}
                    className="w-full h-14 border-foreground/20 hover:bg-foreground hover:text-background rounded-none text-xs font-bold uppercase tracking-widest transition-all duration-500"
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
                </div>

                <Button 
                  variant="ghost" 
                  onClick={() => setStep("form")} 
                  className="w-full text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  Alterar dados de entrega
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:flex lg:w-[450px] bg-[#faf8f6] p-12 lg:p-16 flex-col gap-10 border-l border-border/30 min-h-screen">
          <div className="space-y-10">
            <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 border-foreground pb-6 flex items-center gap-3">
              <ShoppingBag className="size-4" />
              Resumo do Pedido
            </h3>
            
            <div className="space-y-8">
              {items.map((item) => (
                <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-6 group">
                  <div className="relative size-24 flex-shrink-0 bg-white rounded-none overflow-hidden border border-border/10 shadow-sm transition-transform duration-500 group-hover:scale-105">
                    <OptimizedImage src={item.image} alt={item.name} className="object-cover w-full h-full" />
                    <span className="absolute -top-2 -right-2 size-7 bg-foreground text-background text-[10px] flex items-center justify-center rounded-full font-bold shadow-lg">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 py-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-[0.15em] leading-relaxed line-clamp-2">{item.name}</h4>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-[0.1em] font-medium">
                        {item.color} / {item.size}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-border/50">
                        <button onClick={() => decrementQuantity(item.id)} className="p-1 hover:bg-muted"><Minus className="size-3" /></button>
                        <span className="px-2 text-[10px] font-bold">{item.quantity}</span>
                        <button onClick={() => incrementQuantity(item.id)} className="p-1 hover:bg-muted"><Plus className="size-3" /></button>
                      </div>
                      <span className="text-sm font-bold tracking-tight">
                        R$ {(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {isAddressFilled && (
                <div className="flex gap-6 animate-in fade-in slide-in-from-left-4 duration-700">
                  <div className="size-24 flex-shrink-0 bg-green-50 flex items-center justify-center border border-green-100/50 shadow-sm">
                    <Truck className="size-10 text-green-600" />
                  </div>
                  <div className="flex-1 py-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="text-xs font-bold uppercase tracking-[0.15em] text-green-700">Frete Premium Évora</h4>
                      <p className="text-[10px] text-green-600/70 uppercase tracking-[0.1em] font-medium">Envio prioritário em 5 dias</p>
                    </div>
                    <span className="text-sm font-bold text-green-700 uppercase tracking-widest">Grátis</span>
                  </div>
                </div>
              )}
            </div>

            <Separator className="bg-foreground/5" />

            <div className="space-y-6 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Subtotal</span>
                <span className="text-base font-bold tracking-tight">R$ {totalPrice().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Frete</span>
                <div className="text-right">
                  <span className={cn("text-xs font-bold tracking-widest uppercase", isAddressFilled ? "text-green-600" : "text-muted-foreground opacity-50")}>
                    {isAddressFilled ? "GRÁTIS" : "Calculado no checkout"}
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
    </div>
  );
}
