import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/legal-page";

export const Route = createFileRoute("/contato")({
  head: () => ({
    meta: [
      { title: "Fale Conosco | Loja Évora" },
      {
        name: "description",
        content:
          "Atendimento 100% humanizado da Loja Évora: e-mail, horário de funcionamento e endereço.",
      },
      { property: "og:title", content: "Fale Conosco | Loja Évora" },
      {
        property: "og:description",
        content: "Atendimento humanizado da Loja Évora, das 09:00 às 18:00.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <LegalPage
      title="Fale Conosco"
      intro="Atendimento 100% humanizado. Nada de robôs: quem responde é o nosso time, de segunda a sexta, das 09:00 às 18:00."
    >
      <Section title="E-mail">
        <p>
          <a
            href="mailto:atendimento@lojaevora.shop"
            className="underline underline-offset-4 hover:text-[#4a3f35]"
          >
            atendimento@lojaevora.shop
          </a>
          <br />
          Respondemos em até 24 horas úteis.
        </p>
      </Section>
      <Section title="Horário de atendimento">
        <p>Segunda a sexta-feira, das 09:00 às 18:00 (horário de Brasília).</p>
      </Section>
      <Section title="Endereço">
        <p>
          Av. Trompowsky, 354 - 5º andar - Centro
          <br />
          Florianópolis - SC, 88015-300
        </p>
        <p className="text-sm">
          Endereço administrativo — não realizamos atendimento presencial nem retirada de pedidos.
        </p>
      </Section>
      <Section title="Para agilizar seu atendimento">
        <p>
          Informe o número do pedido e o CPF utilizado na compra. Assim conseguimos localizar tudo na
          primeira resposta.
        </p>
      </Section>
    </LegalPage>
  );
}
