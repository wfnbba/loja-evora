import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Check, ChevronRight, Loader2, PackageCheck, Search, ShieldCheck } from "lucide-react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  lookupOrderTracking,
  recoverTrackingByCpf,
  type OrderTrackingResult,
} from "@/lib/order-tracking.functions";

const searchSchema = z.object({
  codigo: z.string().trim().optional().catch(undefined),
});

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

const TRACKING_STEPS = [
  {
    after: 0,
    title: "Pedido confirmado",
    description: "Pagamento aprovado e pedido recebido pela loja.",
  },
  {
    after: 2 * HOUR,
    title: "Aguardando processamento",
    description: "Seu pedido entrou na fila de separação.",
  },
  {
    after: 8 * HOUR,
    title: "Pedido em processamento",
    description: "Estamos separando e preparando os itens do pedido.",
  },
  {
    after: DAY,
    title: "Aguardando emissão da Nota Fiscal",
    description: "Pedido separado e aguardando faturamento.",
  },
  {
    after: 2 * DAY,
    title: "Nota Fiscal emitida",
    description: "Nota Fiscal emitida e pedido liberado para expedição.",
  },
  {
    after: 4 * DAY,
    title: "Preparando para envio",
    description: "Pedido embalado e identificado para transporte.",
  },
  {
    after: 6 * DAY,
    title: "Aguardando coleta da transportadora",
    description: "Volume pronto para ser retirado pela transportadora.",
  },
  {
    after: 7 * DAY,
    title: "Coletado pela transportadora",
    description: "Pedido coletado e encaminhado para a operação logística.",
  },
  {
    after: 9 * DAY,
    title: "Recebido no Centro Logístico — Florianópolis/SC",
    description: "Pedido recebido no centro de distribuição de origem.",
  },
  {
    after: 11 * DAY,
    title: "Em processamento no Centro Logístico — Florianópolis/SC",
    description: "Volume sendo triado e direcionado para a próxima unidade.",
  },
  {
    after: 13 * DAY,
    title: "Saiu do Centro Logístico — Florianópolis/SC",
    description: "Pedido em transferência para o próximo centro logístico.",
  },
  {
    after: 15 * DAY,
    title: "Em transferência",
    description: "Seu pedido está a caminho do Centro Logístico de Itajaí/SC.",
  },
  {
    after: 18 * DAY,
    title: "Chegou ao Centro Logístico — Itajaí/SC",
    description: "Pedido recebido na unidade responsável pela próxima etapa da entrega.",
  },
  {
    after: 20 * DAY,
    title: "Em processamento no Centro Logístico — Itajaí/SC",
    description: "Pedido sendo separado para encaminhamento à unidade de entrega.",
  },
  {
    after: 22 * DAY,
    title: "Saiu do Centro Logístico — Itajaí/SC",
    description: "Seu pedido está seguindo para a unidade responsável pela sua região.",
  },
  {
    after: 25 * DAY,
    title: "A caminho da sua região",
    description:
      "O pedido está em trânsito para a unidade de distribuição mais próxima do endereço de entrega.",
  },
  {
    after: 27 * DAY,
    title: "Chegou à unidade de distribuição",
    description: "Seu pedido chegou à unidade responsável pela entrega final.",
  },
  {
    after: 29 * DAY,
    title: "Preparando para entrega",
    description: "Pedido separado e encaminhado para a rota de entrega.",
  },
  {
    after: 30 * DAY,
    title: "Saiu para entrega 🚚",
    description: "Seu pedido está com o entregador e a entrega está prevista para hoje.",
  },
] as const;

export const Route = createFileRoute("/rastrear-pedido")({
  validateSearch: (search) => searchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Rastrear Pedido | Loja Évora" },
      {
        name: "description",
        content: "Consulte seu pedido Évora pelo número de rastreamento ou recupere-o pelo CPF.",
      },
      { property: "og:title", content: "Rastrear Pedido | Loja Évora" },
      {
        property: "og:description",
        content: "Acompanhe cada etapa do seu pedido Évora.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: TrackOrderPage,
});

function normalizeTrackingCode(value: string) {
  return value.trim().toUpperCase();
}

function formatCpf(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(value));
}

function friendlyError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  if (message.toLowerCase().includes("cpf inválido")) return "Digite um CPF válido.";
  if (message.toLowerCase().includes("rastreamento inválido")) {
    return "Confira o número de rastreamento e tente novamente.";
  }
  return "Não foi possível concluir a consulta agora. Tente novamente em alguns instantes.";
}

function TrackOrderPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/rastrear-pedido" });
  const lookupTracking = useServerFn(lookupOrderTracking);
  const recoverTracking = useServerFn(recoverTrackingByCpf);
  const [trackingInput, setTrackingInput] = useState(search.codigo ?? "");
  const [tracking, setTracking] = useState<OrderTrackingResult | null>(null);
  const [trackingError, setTrackingError] = useState("");
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [cpf, setCpf] = useState("");
  const [recoveredOrders, setRecoveredOrders] = useState<OrderTrackingResult[]>([]);
  const [recoveryError, setRecoveryError] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [clientClockAnchor, setClientClockAnchor] = useState(() => Date.now());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const code = search.codigo ? normalizeTrackingCode(search.codigo) : "";
    if (!code) return;

    let active = true;
    setTrackingInput(code);
    setIsLookingUp(true);
    setTrackingError("");

    lookupTracking({ data: { trackingCode: code } })
      .then((result) => {
        if (!active) return;
        setTracking(result);
        if (result) setClientClockAnchor(Date.now());
        if (!result) setTrackingError("Pedido não encontrado. Confira o número informado.");
      })
      .catch((error) => {
        if (!active) return;
        setTracking(null);
        setTrackingError(friendlyError(error));
      })
      .finally(() => {
        if (active) setIsLookingUp(false);
      });

    return () => {
      active = false;
    };
  }, [lookupTracking, search.codigo]);

  const visibleSteps = useMemo(() => {
    if (!tracking) return [];
    const estimatedServerNow = new Date(tracking.checkedAt).getTime() + (now - clientClockAnchor);
    const elapsed = Math.max(0, estimatedServerNow - new Date(tracking.purchasedAt).getTime());
    return TRACKING_STEPS.filter((step) => elapsed >= step.after);
  }, [clientClockAnchor, now, tracking]);

  const submitTracking = async (event: FormEvent) => {
    event.preventDefault();
    const code = normalizeTrackingCode(trackingInput);
    if (!code) {
      setTrackingError("Digite seu número de rastreamento.");
      return;
    }

    if (code === search.codigo) {
      setIsLookingUp(true);
      setTrackingError("");
      try {
        const result = await lookupTracking({ data: { trackingCode: code } });
        setTracking(result);
        if (result) setClientClockAnchor(Date.now());
        if (!result) setTrackingError("Pedido não encontrado. Confira o número informado.");
      } catch (error) {
        setTracking(null);
        setTrackingError(friendlyError(error));
      } finally {
        setIsLookingUp(false);
      }
      return;
    }

    await navigate({ search: { codigo: code } });
  };

  const submitCpf = async (event: FormEvent) => {
    event.preventDefault();
    setIsRecovering(true);
    setRecoveryError("");
    setRecoveredOrders([]);
    try {
      const orders = await recoverTracking({ data: { cpf } });
      setRecoveredOrders(orders);
      if (orders.length === 0) {
        setRecoveryError("Nenhuma compra confirmada foi encontrada para este CPF.");
      }
    } catch (error) {
      setRecoveryError(friendlyError(error));
    } finally {
      setIsRecovering(false);
    }
  };

  const openRecoveredOrder = async (order: OrderTrackingResult) => {
    setTrackingInput(order.trackingCode);
    setShowRecovery(false);
    await navigate({ search: { codigo: order.trackingCode } });
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
      <header className="mx-auto max-w-2xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#92745f]">
          Acompanhe sua compra
        </p>
        <h1 className="mt-4 text-3xl font-light uppercase tracking-[0.16em] text-[#3b3029] sm:text-4xl">
          Rastrear pedido
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base font-light leading-relaxed text-[#76665a]">
          Digite o número recebido após a confirmação do pagamento para visualizar somente as etapas
          já concluídas do seu pedido.
        </p>
      </header>

      <section className="mx-auto mt-10 max-w-2xl border border-[#d8cbbf] bg-white p-5 shadow-[0_18px_50px_-30px_rgba(74,63,53,0.45)] sm:p-8">
        <form onSubmit={submitTracking} className="space-y-4">
          <label
            htmlFor="tracking-code"
            className="block text-xs font-medium uppercase tracking-[0.18em] text-[#4a3f35]"
          >
            Número de rastreamento
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              id="tracking-code"
              value={trackingInput}
              onChange={(event) => setTrackingInput(event.target.value.toUpperCase())}
              placeholder="EVR-000000-0000000000"
              autoComplete="off"
              spellCheck={false}
              className="min-h-12 flex-1 border-[#cdbfb3] bg-[#fdfbf7] px-4 text-base uppercase tracking-wider sm:text-sm"
            />
            <Button
              type="submit"
              disabled={isLookingUp}
              className="h-12 min-w-36 bg-[#4a3f35] px-6 text-xs uppercase tracking-[0.18em] text-white hover:bg-[#352c26]"
            >
              {isLookingUp ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Search className="size-4" />
              )}
              Consultar
            </Button>
          </div>
        </form>

        {trackingError ? (
          <p role="alert" className="mt-4 text-sm text-[#9b3f35]">
            {trackingError}
          </p>
        ) : null}

        <div className="mt-6 border-t border-[#ece5de] pt-5 text-center">
          <button
            type="button"
            onClick={() => {
              setShowRecovery((current) => !current);
              setRecoveryError("");
            }}
            className="inline-flex min-h-11 items-center justify-center px-3 py-2 text-sm font-medium text-[#6b5545] underline decoration-[#b9a796] underline-offset-4 transition-colors hover:text-[#3b3029]"
          >
            Perdi meu número de rastreamento
          </button>
        </div>

        {showRecovery ? (
          <div className="mt-6 bg-[#f7f1eb] p-5 sm:p-6">
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 size-5 shrink-0 text-[#765f4e]" />
              <div>
                <h2 className="text-sm font-medium text-[#3b3029]">Recupere pelo CPF</h2>
                <p className="mt-1 text-sm font-light leading-relaxed text-[#76665a]">
                  Use o mesmo CPF informado no checkout para localizar suas compras confirmadas.
                </p>
              </div>
            </div>
            <form onSubmit={submitCpf} className="mt-5 flex flex-col gap-3 sm:flex-row">
              <Input
                value={cpf}
                onChange={(event) => setCpf(formatCpf(event.target.value))}
                placeholder="000.000.000-00"
                inputMode="numeric"
                autoComplete="off"
                aria-label="CPF utilizado na compra"
                className="min-h-12 flex-1 border-[#cdbfb3] bg-white px-4 text-base sm:text-sm"
              />
              <Button
                type="submit"
                variant="outline"
                disabled={isRecovering}
                className="h-12 border-[#4a3f35] px-6 text-xs uppercase tracking-[0.16em] text-[#4a3f35] hover:bg-[#4a3f35] hover:text-white"
              >
                {isRecovering ? <Loader2 className="size-4 animate-spin" /> : "Recuperar"}
              </Button>
            </form>

            {recoveryError ? (
              <p role="alert" className="mt-4 text-sm text-[#9b3f35]">
                {recoveryError}
              </p>
            ) : null}

            {recoveredOrders.length > 0 ? (
              <div className="mt-5 space-y-2" aria-live="polite">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#6b5545]">
                  {recoveredOrders.length === 1 ? "Compra encontrada" : "Compras encontradas"}
                </p>
                {recoveredOrders.map((order) => (
                  <button
                    key={order.trackingCode}
                    type="button"
                    onClick={() => openRecoveredOrder(order)}
                    className="flex w-full items-center justify-between gap-4 border border-[#ddd0c5] bg-white p-4 text-left transition-colors hover:border-[#92745f]"
                  >
                    <span>
                      <span className="block text-sm font-medium tracking-wide text-[#3b3029]">
                        {order.trackingCode}
                      </span>
                      <span className="mt-1 block text-xs text-[#837468]">
                        Compra confirmada em {formatDate(order.purchasedAt)}
                      </span>
                    </span>
                    <ChevronRight className="size-5 shrink-0 text-[#92745f]" />
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      {tracking ? (
        <section className="mx-auto mt-12 max-w-3xl" aria-live="polite">
          <div className="flex flex-col justify-between gap-4 border-b border-[#d8cbbf] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#92745f]">
                Pedido {tracking.trackingCode}
              </p>
              <h2 className="mt-2 text-2xl font-light text-[#3b3029]">Histórico do pedido</h2>
            </div>
            <p className="text-sm font-light text-[#76665a]">
              Compra confirmada em {formatDate(tracking.purchasedAt)}
            </p>
          </div>

          <ol className="mt-8">
            {visibleSteps.map((step, index) => {
              const isCurrent = index === visibleSteps.length - 1;
              const reachedAt = new Date(new Date(tracking.purchasedAt).getTime() + step.after);
              return (
                <li key={step.title} className="relative flex gap-4 pb-9 last:pb-0 sm:gap-6">
                  {index < visibleSteps.length - 1 ? (
                    <span
                      aria-hidden="true"
                      className="absolute left-[17px] top-9 h-[calc(100%-1.25rem)] w-px bg-[#b89f8b]"
                    />
                  ) : null}
                  <span
                    className={`relative z-10 flex size-9 shrink-0 items-center justify-center rounded-full border ${
                      isCurrent
                        ? "border-[#4a3f35] bg-[#4a3f35] text-white shadow-[0_0_0_5px_#eee5dd]"
                        : "border-[#b89f8b] bg-[#fdfbf7] text-[#765f4e]"
                    }`}
                  >
                    {isCurrent ? <PackageCheck className="size-4" /> : <Check className="size-4" />}
                  </span>
                  <div className={`min-w-0 pt-1 ${isCurrent ? "opacity-100" : "opacity-75"}`}>
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                      <h3 className="text-base font-medium text-[#3b3029] sm:text-lg">
                        {step.title}
                      </h3>
                      <time className="shrink-0 text-xs text-[#8a796c]">
                        {formatDate(reachedAt.toISOString())}
                      </time>
                    </div>
                    <p className="mt-2 text-sm font-light leading-relaxed text-[#76665a] sm:text-base">
                      {step.description}
                    </p>
                    {isCurrent ? (
                      <span className="mt-3 inline-flex bg-[#eee5dd] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-[#604c3e]">
                        Status atual
                      </span>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      ) : null}
    </div>
  );
}
