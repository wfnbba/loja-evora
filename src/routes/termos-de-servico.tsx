import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/legal-page";

export const Route = createFileRoute("/termos-de-servico")({
  head: () => ({
    meta: [
      { title: "Termos de Serviço | Loja Évora" },
      {
        name: "description",
        content: "Condições gerais de uso do site e de compra na Loja Évora.",
      },
      { property: "og:title", content: "Termos de Serviço | Loja Évora" },
      {
        property: "og:description",
        content: "Condições gerais de uso e de compra na Loja Évora.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage
      title="Termos de Serviço"
      intro="Ao navegar e comprar em nosso site, você concorda com as condições descritas abaixo."
    >
      <Section title="Sobre a loja">
        <p>
          A Loja Évora é uma marca registrada de moda e alfaiataria feminina, com atendimento
          exclusivamente online e sede administrativa na Av. Trompowsky, 354 - 5º andar - Centro,
          Florianópolis - SC, 88015-300.
        </p>
      </Section>
      <Section title="Pedidos e pagamento">
        <p>
          Os pedidos são finalizados exclusivamente via PIX. O pedido é confirmado somente após a
          compensação do pagamento. Reservamo-nos o direito de cancelar pedidos com indícios de
          fraude ou com dados cadastrais inconsistentes.
        </p>
      </Section>
      <Section title="Preços e disponibilidade">
        <p>
          Preços, promoções e estoques podem ser alterados sem aviso prévio. Em caso de erro
          evidente de precificação, entraremos em contato antes do envio e você poderá manter a
          compra pelo valor correto ou receber o reembolso integral.
        </p>
      </Section>
      <Section title="Imagens e descrições">
        <p>
          Trabalhamos para que fotos e descrições sejam fiéis. Pequenas variações de tonalidade podem
          ocorrer conforme a calibração da tela do seu dispositivo.
        </p>
      </Section>
      <Section title="Propriedade intelectual">
        <p>
          Todo o conteúdo do site — marca, logotipo, textos, fotos e vídeos — pertence à Loja Évora e
          não pode ser reproduzido sem autorização por escrito.
        </p>
      </Section>
      <Section title="Atendimento e foro">
        <p>
          Dúvidas podem ser encaminhadas para atendimento@lojaevora.shop, das 09:00 às 18:00. Fica
          eleito o foro da comarca de Florianópolis - SC para dirimir eventuais controvérsias.
        </p>
      </Section>
    </LegalPage>
  );
}
