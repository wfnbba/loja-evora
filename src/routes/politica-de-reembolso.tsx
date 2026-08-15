import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/legal-page";

export const Route = createFileRoute("/politica-de-reembolso")({
  head: () => ({
    meta: [
      { title: "Política de Reembolso | Loja Évora" },
      {
        name: "description",
        content:
          "Prazos, condições e etapas para solicitar o reembolso da sua compra na Loja Évora.",
      },
      { property: "og:title", content: "Política de Reembolso | Loja Évora" },
      {
        property: "og:description",
        content: "Prazos e condições para solicitar reembolso na Loja Évora.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <LegalPage
      title="Política de Reembolso"
      intro="Queremos que você fique satisfeita com cada peça Évora. Se algo não sair como esperado, o reembolso é simples e sem burocracia."
    >
      <Section title="Direito de arrependimento">
        <p>
          Conforme o artigo 49 do Código de Defesa do Consumidor, você pode desistir da compra em até
          7 dias corridos após o recebimento do pedido, sem necessidade de justificativa, com
          devolução integral do valor pago.
        </p>
      </Section>
      <Section title="Garantia de 90 dias">
        <p>
          Além do prazo legal, oferecemos garantia de 90 dias contra defeitos de fabricação. Nesses
          casos, você escolhe entre a troca da peça ou o reembolso total.
        </p>
      </Section>
      <Section title="Como solicitar">
        <p>
          Envie um e-mail para atendimento@lojaevora.shop informando o número do pedido, o CPF do
          comprador e o motivo da solicitação. Nossa equipe responde em até 24 horas úteis com a
          etiqueta de postagem — a devolução é gratuita.
        </p>
      </Section>
      <Section title="Condições da peça">
        <p>
          A peça deve retornar sem sinais de uso, sem odores, sem lavagem e com as etiquetas
          originais preservadas, dentro da embalagem Évora.
        </p>
      </Section>
      <Section title="Prazo de estorno">
        <p>
          Após recebermos e conferirmos a peça (até 3 dias úteis), o reembolso é processado em até 5
          dias úteis. Pagamentos via PIX são devolvidos na mesma chave ou em conta indicada pela
          titular do CPF da compra.
        </p>
      </Section>
    </LegalPage>
  );
}
