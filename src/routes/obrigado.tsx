import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/obrigado")({
  head: () => ({
    meta: [
      { title: "Obrigado | Évora" },
      { name: "description", content: "Seu pedido foi recebido com sucesso." },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 pt-20 text-center animate-in fade-in zoom-in duration-500">
      <div className="flex size-24 items-center justify-center rounded-full bg-green-50 text-green-600 mb-8">
        <CheckCircle2 className="size-12" />
      </div>
      <div className="max-w-md space-y-4">
        <h1 className="text-3xl font-light uppercase tracking-[0.2em]">Pedido Recebido</h1>
        <p className="text-sm font-light text-muted-foreground leading-relaxed">
          Obrigada por escolher a Évora. Seu pagamento foi confirmado e seu pedido já está sendo processado.
        </p>
        <p className="text-xs font-light text-muted-foreground">
          Você receberá as atualizações de rastreio em seu e-mail e WhatsApp em breve.
        </p>
        <div className="pt-8">
          <Button asChild className="w-full rounded-none uppercase tracking-widest py-6">
            <Link to="/">Voltar para a Início</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
