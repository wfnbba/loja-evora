import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/legal-page";

export const Route = createFileRoute("/politica-de-trocas")({
  head: () => ({
    meta: [
      { title: "Política de Trocas | Loja Évora" },
      {
        name: "description",
        content:
          "Primeira troca grátis por produto na Loja Évora: entenda prazos, condições e como solicitar.",
      },
      { property: "og:title", content: "Política de Trocas | Loja Évora" },
      {
        property: "og:description",
        content: "Primeira troca grátis por produto. Veja as condições.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ExchangePage,
});

function ExchangePage() {
  return (
    <LegalPage
      title="Política de Trocas"
      intro="Errou o tamanho? Sem problema. A primeira troca é gratuita, 1 vez por produto — e o mesmo CPF pode repetir esse benefício em produtos diferentes."
    >
      <Section title="Primeira troca gratuita">
        <p>
          Cada produto comprado tem direito a 1 (uma) troca gratuita por tamanho ou cor. O benefício é
          contado por produto, e não por cliente: o mesmo CPF pode utilizar a troca gratuita
          novamente ao comprar outro produto.
        </p>
        <p>
          Trocas adicionais do mesmo produto ficam sujeitas ao custo de postagem, informado
          previamente por e-mail.
        </p>
      </Section>
      <Section title="Prazo para solicitar">
        <p>
          A solicitação deve ser feita em até 30 dias corridos após o recebimento do pedido, pelo
          e-mail atendimento@lojaevora.shop, informando número do pedido e CPF.
        </p>
      </Section>
      <Section title="Condições da peça">
        <p>
          A peça precisa estar sem uso, sem lavagem, sem odores, com etiquetas originais e na
          embalagem Évora.
        </p>
      </Section>
      <Section title="Como funciona">
        <p>
          Enviamos a etiqueta de postagem por e-mail. Basta postar a peça em qualquer agência dos
          Correios. Ao recebermos e conferirmos o item (até 3 dias úteis), despachamos o novo tamanho
          ou cor imediatamente, com prazo de entrega padrão de 5 dias úteis.
        </p>
      </Section>
      <Section title="Indisponibilidade">
        <p>
          Se o tamanho ou a cor desejada estiver esgotada, você pode escolher outra peça de valor
          equivalente, receber um vale-compras ou o reembolso integral.
        </p>
      </Section>
    </LegalPage>
  );
}
