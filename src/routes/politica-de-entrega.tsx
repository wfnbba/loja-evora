import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/legal-page";

export const Route = createFileRoute("/politica-de-entrega")({
  head: () => ({
    meta: [
      { title: "Política de Entrega | Loja Évora" },
      {
        name: "description",
        content: "Prazos, frete grátis e acompanhamento das entregas da Loja Évora em todo o Brasil.",
      },
      { property: "og:title", content: "Política de Entrega | Loja Évora" },
      {
        property: "og:description",
        content: "Prazos, frete grátis e rastreio das entregas Évora.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <LegalPage
      title="Política de Entrega"
      intro="Enviamos para todo o Brasil com frete grátis e embalagem Évora, cuidadosamente preparada para chegar impecável até você."
    >
      <Section title="Prazo de postagem">
        <p>
          Após a confirmação do pagamento via PIX, o pedido é separado e postado em até 1 dia útil.
          Pedidos realizados aos finais de semana e feriados são processados no próximo dia útil.
        </p>
      </Section>
      <Section title="Prazo de entrega">
        <p>
          O prazo médio é de 5 dias úteis após a postagem. Regiões Norte e Nordeste, além de
          localidades de difícil acesso, podem levar alguns dias adicionais.
        </p>
      </Section>
      <Section title="Frete grátis">
        <p>
          O frete é gratuito para todos os pedidos, sem valor mínimo. O valor aparece como “Grátis”
          no resumo do pedido assim que o endereço é preenchido no checkout.
        </p>
      </Section>
      <Section title="Rastreamento">
        <p>
          Assim que o pedido é postado, enviamos o código de rastreio por e-mail e WhatsApp. Você
          também pode acompanhar tudo pela página Rastrear Pedido.
        </p>
      </Section>
      <Section title="Endereço incorreto ou ausência">
        <p>
          Confira os dados de entrega antes de finalizar a compra. Em caso de endereço incorreto ou
          três tentativas de entrega sem sucesso, a encomenda retorna ao nosso centro de distribuição
          e entramos em contato para reenvio.
        </p>
      </Section>
    </LegalPage>
  );
}
