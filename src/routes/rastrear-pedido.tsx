import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/legal-page";

export const Route = createFileRoute("/rastrear-pedido")({
  head: () => ({
    meta: [
      { title: "Rastrear Pedido | Loja Évora" },
      {
        name: "description",
        content: "Acompanhe o status da sua entrega Évora e saiba como obter o código de rastreio.",
      },
      { property: "og:title", content: "Rastrear Pedido | Loja Évora" },
      {
        property: "og:description",
        content: "Acompanhe o status da sua entrega Évora.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TrackOrderPage,
});

function TrackOrderPage() {
  return (
    <LegalPage
      title="Rastrear Pedido"
      intro="Acompanhe cada etapa do seu pedido, do pagamento confirmado até a entrega na sua porta."
    >
      <Section title="Como receber o código de rastreio">
        <p>
          Assim que o pedido é postado — em até 1 dia útil após a confirmação do PIX — enviamos o
          código de rastreio para o e-mail e o WhatsApp informados no checkout.
        </p>
      </Section>
      <Section title="Consultar a entrega">
        <p>
          Com o código em mãos, a consulta pode ser feita diretamente no site dos Correios ou da
          transportadora indicada na mensagem que você recebeu.
        </p>
      </Section>
      <Section title="Não recebeu o código?">
        <p>
          Verifique a caixa de spam e a aba de promoções do seu e-mail. Se ainda assim não encontrar,
          escreva para atendimento@lojaevora.shop informando o número do pedido e o CPF utilizado na
          compra — respondemos em até 24 horas úteis, das 09:00 às 18:00.
        </p>
      </Section>
      <Section title="Prazos">
        <p>
          O prazo médio de entrega é de 5 dias úteis após a postagem. Atrasos pontuais podem ocorrer
          em períodos de alta demanda e em regiões de difícil acesso.
        </p>
      </Section>
    </LegalPage>
  );
}
