import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, PackageSearch } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";

const searchSchema = z.object({
  codigo: z.string().trim().optional().catch(undefined),
});

export const Route = createFileRoute("/obrigado")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Obrigado | Loja Évora" },
      { name: "description", content: "Seu pedido foi recebido com sucesso." },
    ],
  }),
  component: ThankYouPage,
});

function ThankYouPage() {
  const { codigo } = Route.useSearch();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-16 text-center animate-in fade-in zoom-in duration-500">
      <div className="mb-8 flex size-24 items-center justify-center rounded-full bg-green-50 text-green-600">
        <CheckCircle2 className="size-12" />
      </div>
      <div className="w-full max-w-md space-y-4">
        <h1 className="text-3xl font-light uppercase tracking-[0.2em]">Pedido confirmado</h1>
        <p className="text-sm font-light leading-relaxed text-muted-foreground">
          Obrigada por escolher a Loja Évora. Seu pagamento foi aprovado e seu pedido já está sendo
          processado.
        </p>

        {codigo ? (
          <div className="mt-7 border border-[#d8cbbf] bg-white p-6 text-left shadow-[0_16px_40px_-28px_rgba(74,63,53,0.5)]">
            <div className="flex items-start gap-3">
              <PackageSearch className="mt-0.5 size-5 shrink-0 text-[#765f4e]" />
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#765f4e]">
                  Seu número de rastreamento
                </p>
                <p className="mt-2 break-all text-lg font-medium tracking-wider text-[#3b3029]">
                  {codigo}
                </p>
                <p className="mt-2 text-xs font-light leading-relaxed text-[#837468]">
                  Guarde este número para acompanhar todas as atualizações da entrega.
                </p>
              </div>
            </div>
            <Button
              asChild
              className="mt-5 h-12 w-full bg-[#4a3f35] text-xs uppercase tracking-[0.18em]"
            >
              <Link to="/rastrear-pedido" search={{ codigo }}>
                Acompanhar pedido
              </Link>
            </Button>
          </div>
        ) : (
          <p className="pt-2 text-xs font-light text-muted-foreground">
            Você pode recuperar o número de rastreamento pelo CPF na página de acompanhamento.
          </p>
        )}

        <div className="pt-6">
          <Button asChild variant="outline" className="h-12 w-full uppercase tracking-widest">
            <Link to="/">Voltar para o início</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
