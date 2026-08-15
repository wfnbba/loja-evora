import { useState, useEffect, useMemo } from "react";
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
import { sendUtmifyOrder } from "@/lib/utmify.functions";
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
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  const createPix = useServerFn(createPixPayment);
  const checkStatus = useServerFn(checkPixStatus);
  const sendToUtmify = useServerFn(sendUtmifyOrder);
  const getAddress = useServerFn(getAddressByCep);

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
      const address = await getAddress(cleanCep);
      if (address.success && address.data) {
        setFormData((prev) => ({
          ...prev,
          street: address.data.street || prev.street,
          neighborhood: address.data.neighborhood || prev.neighborhood,
          city: address.data.city || prev.city,
          state: address.data.state || prev.state,
        }));
      }
    }
  };

  useEffect(() => {
    if (formData.street && formData.street.length > 3) setIsAddressFilled(true);
  }, [formData.street]);

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const utms = getPersistedUtms();
      const response = await createPix({
        items: items.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price, size: item.size })),
        payerName: formData.name,
        payerDocument: formData.document,
        email: formData.email,
        phone: formData.phone,
        address: {
          zipCode: formData.cep,
          street: formData.street,
          number: formData.number,
          complement: formData.complement || "",
          neighborhood: formData.neighborhood,
          city: formData.city,
          state: formData.state,
        }
      });

      if (response.success && response.data) {
        setPixData(response.data);
        setStep("payment");
        toast.success("PIX gerado!");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (step === "success") { window.location.href = "/obrigado"; return null; }

  return (
    <div className="w-full bg-white">
      <div className="bg-[#1a1512] text-white py-4 px-6 text-center mb-8">
        <p className="text-xs font-bold uppercase tracking-widest animate-pulse">
          Preço garantido por <span className="text-[#d4af37]">{formatTime(timeLeft)}</span>
        </p>
      </div>

      <div className="flex flex-col lg:flex-row min-h-screen container mx-auto gap-12 p-6">
        <div className="flex-1">
          <form onSubmit={handleCreatePayment} className="space-y-10">
            <div className="space-y-4">
              <h3 className="text-base font-bold uppercase tracking-widest border-b pb-4">1. Contato</h3>
              <div className="grid gap-4">
                <Input placeholder="E-mail" value={formData.email} onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))} className="h-14 rounded-none" />
                <div className="grid grid-cols-2 gap-4">
                  <Input placeholder="Nome Completo" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} className="h-14 rounded-none" />
                  <Input placeholder="CPF" value={formData.document} onChange={(e) => setFormData(p => ({ ...p, document: e.target.value }))} className="h-14 rounded-none" />
                </div>
              </div>
            </div>
            
            <Button type="submit" className="w-full h-16 rounded-none bg-foreground text-background font-bold uppercase tracking-widest">
              {loading ? <Loader2 className="animate-spin" /> : "Gerar QR Code PIX"}
            </Button>
          </form>
        </div>

        <div className="lg:w-[400px] bg-[#faf8f6] p-8 h-fit space-y-6">
          <h3 className="font-bold uppercase tracking-widest border-b pb-4">Resumo do Pedido</h3>
          {items.map(item => (
            <div key={item.id} className="flex gap-4">
              <OptimizedImage src={item.image} className="size-16 object-cover" />
              <div className="flex-1 text-xs">
                <p className="font-bold uppercase">{item.name}</p>
                <p className="text-muted-foreground">{item.color} / {item.size}</p>
              </div>
              <span className="font-bold">R$ {(item.price * item.quantity).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>R$ {totalPrice().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
