import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Copy, CheckCircle2, Loader2, QrCode, ShoppingBag, ShieldCheck, Truck, Plus, Minus } from "lucide-react";
import { createPixPayment, checkPixStatus } from "@/lib/vexopay.functions";
import { getAddressByCep } from "@/lib/cep.functions";
import { useServerFn } from "@tanstack/react-start";
import { getPersistedUtms } from "@/hooks/use-utm-tracking";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/ui/optimized-image";
import pixLogoAsset from "@/assets/logo-pix.png.asset.json";

interface CheckoutOverlayProps {
  onClose: () => void;
}

export function CheckoutOverlay({ onClose }: CheckoutOverlayProps) {
  const { items, totalPrice, incrementQuantity, decrementQuantity } = useCartStore();
  const [step, setStep] = useState<"form" | "payment" | "success">("form");
  const [loading, setLoading] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [isAddressFilled, setIsAddressFilled] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    document: "",
    email: "",
    phone: "",
    cep: "",
    street: "",
    number: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const createPix = useServerFn(createPixPayment);
  const checkStatus = useServerFn(checkPixStatus);
  const getAddress = useServerFn(getAddressByCep);

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCepChange = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "");
    setFormData(prev => ({ ...prev, cep: cleanCep }));
    if (cleanCep.length === 8) {
      const address = await getAddress({ data: cleanCep });
      if (address.success && address.data) {
        setFormData(p => ({
          ...p,
          street: address.data!.street,
          neighborhood: address.data!.neighborhood,
          city: address.data!.city,
          state: address.data!.state,
        }));
        setIsAddressFilled(true);
      }
    }
  };

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await createPix({
        data: {
          items: items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price, size: i.size })),
          payerName: formData.name,
          payerDocument: formData.document,
          email: formData.email,
          phone: formData.phone,
          address: {
            zipCode: formData.cep,
            street: formData.street,
            number: formData.number,
            neighborhood: formData.neighborhood,
            city: formData.city,
            state: formData.state,
          }
        }
      });
      if (response.success) {
        setPixData(response.data);
        setStep("payment");
      }
    } catch (err) {
      toast.error("Erro ao processar");
    } finally {
      setLoading(false);
    }
  };

  if (step === "success") { window.location.href = "/obrigado"; return null; }

  return (
    <div className="w-full bg-white pb-20">
      <div className="bg-[#1a1512] text-white py-3 text-center mb-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">Preço garantido por {Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</p>
      </div>

      <div className="container mx-auto max-w-6xl px-4 flex flex-col lg:flex-row gap-12">
        <div className="flex-1 space-y-12">
          {step === "form" ? (
            <form onSubmit={handleCreatePayment} className="space-y-12">
              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] border-b pb-4">1. Dados Pessoais</h3>
                <div className="grid gap-4">
                  <Input placeholder="E-mail" value={formData.email} onChange={e => setFormData(p=>({...p,email:e.target.value}))} className="h-14 rounded-none" />
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Nome Completo" value={formData.name} onChange={e => setFormData(p=>({...p,name:e.target.value}))} className="h-14 rounded-none" />
                    <Input placeholder="CPF" value={formData.document} onChange={e => setFormData(p=>({...p,document:e.target.value}))} className="h-14 rounded-none" />
                  </div>
                  <Input placeholder="WhatsApp" value={formData.phone} onChange={e => setFormData(p=>({...p,phone:e.target.value}))} className="h-14 rounded-none" />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xs font-bold uppercase tracking-[0.2em] border-b pb-4">2. Entrega</h3>
                <div className="grid gap-4">
                  <div className="grid grid-cols-3 gap-4">
                    <Input placeholder="CEP" value={formData.cep} onChange={e => handleCepChange(e.target.value)} className="h-14 rounded-none" />
                    <Input placeholder="Rua" value={formData.street} onChange={e => setFormData(p=>({...p,street:e.target.value}))} className="h-14 rounded-none col-span-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="Número" value={formData.number} onChange={e => setFormData(p=>({...p,number:e.target.value}))} className="h-14 rounded-none" />
                    <Input placeholder="Bairro" value={formData.neighborhood} onChange={e => setFormData(p=>({...p,neighborhood:e.target.value}))} className="h-14 rounded-none" />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-16 bg-foreground text-background font-bold uppercase tracking-[0.2em] rounded-none">
                {loading ? <Loader2 className="animate-spin" /> : "Gerar QR Code PIX"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-8 py-10">
              <h2 className="text-xl font-bold uppercase tracking-widest">Aguardando Pagamento</h2>
              {pixData?.qrCodeBase64 && <img src={pixData.qrCodeBase64} alt="QR Code" className="mx-auto size-64 border-4 border-muted" />}
              <Button onClick={() => {navigator.clipboard.writeText(pixData?.copyPaste); toast.success("Copiado!")}} className="w-full h-14 bg-muted text-foreground border border-foreground/10 font-bold uppercase tracking-widest rounded-none">Copiar Código PIX</Button>
            </div>
          )}
        </div>

        <div className="lg:w-[450px] space-y-8 bg-[#faf8f6] p-8 h-fit border border-border/30">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] border-b pb-4 flex items-center gap-2">
            <ShoppingBag className="size-4" /> Resumo do Pedido
          </h3>
          <div className="space-y-6">
            {items.map(item => (
              <div key={`${item.id}-${item.color}`} className="flex gap-4">
                <div className="size-20 bg-white border border-border/10 overflow-hidden relative flex-shrink-0">
                  <OptimizedImage src={item.image} alt={item.name} className="object-cover w-full h-full" />
                  <span className="absolute -top-1 -right-1 size-5 bg-foreground text-background text-[10px] flex items-center justify-center rounded-full font-bold">{item.quantity}</span>
                </div>
                <div className="flex-1 py-1">
                  <p className="text-[11px] font-bold uppercase tracking-widest line-clamp-1">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground uppercase mt-1">{item.color} / {item.size}</p>
                  <div className="flex justify-between items-end mt-2">
                    <div className="flex items-center gap-2">
                      <button onClick={() => decrementQuantity(item.id)} className="p-1 border border-border/20" type="button"><Minus className="size-3" /></button>
                      <span className="text-[10px] font-bold">{item.quantity}</span>
                      <button onClick={() => incrementQuantity(item.id)} className="p-1 border border-border/20" type="button"><Plus className="size-3" /></button>
                    </div>

                    <span className="text-xs font-bold">R$ {(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>
            ))}
            
            {isAddressFilled && (
              <div className="flex gap-4 p-4 bg-green-50/50 border border-green-100/50">
                <Truck className="size-8 text-green-600" />
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase text-green-700">Frete Premium Évora</p>
                  <span className="text-[10px] font-bold uppercase text-green-600">Grátis</span>
                </div>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <span>Subtotal</span>
              <span>R$ {totalPrice().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between items-end border-t border-foreground/10 pt-4">
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest">Total</span>
                <p className="text-[10px] text-green-600 font-bold uppercase">Desconto VIP Aplicado</p>
              </div>
              <span className="text-2xl font-light tracking-widest">R$ {totalPrice().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            </div>
            
            <div className="bg-foreground text-background p-6 space-y-2">
              <div className="flex items-center gap-2 text-green-400">
                <ShieldCheck className="size-4" />
                <span className="text-[10px] font-bold uppercase">Garantia Évora Luxury</span>
              </div>
              <p className="text-[10px] text-background/60 uppercase leading-loose">Sua compra está protegida. Receba em 5 dias ou seu dinheiro de volta.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
