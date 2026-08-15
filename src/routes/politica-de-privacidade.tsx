import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, Section } from "@/components/legal-page";

export const Route = createFileRoute("/politica-de-privacidade")({
  head: () => ({
    meta: [
      { title: "Política de Privacidade | Loja Évora" },
      {
        name: "description",
        content:
          "Saiba como a Loja Évora coleta, utiliza e protege os seus dados pessoais durante a compra.",
      },
      { property: "og:title", content: "Política de Privacidade | Loja Évora" },
      {
        property: "og:description",
        content: "Como a Loja Évora coleta, utiliza e protege os seus dados pessoais.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      intro="A Loja Évora respeita a sua privacidade. Esta política explica quais dados coletamos, como usamos essas informações e quais são os seus direitos, em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018)."
    >
      <Section title="Dados que coletamos">
        <p>
          Coletamos apenas os dados necessários para processar o seu pedido: nome completo, e-mail,
          telefone, CPF e endereço de entrega. Também registramos informações de navegação, como
          páginas visitadas e parâmetros de campanha (UTMs), para melhorar a sua experiência.
        </p>
      </Section>
      <Section title="Como utilizamos seus dados">
        <p>
          Utilizamos os dados para identificar você como cliente, processar pagamentos via PIX,
          emitir a nota fiscal, realizar a entrega, oferecer suporte e enviar comunicações sobre o
          status do pedido. Com o seu consentimento, também enviamos novidades e ofertas.
        </p>
      </Section>
      <Section title="Compartilhamento">
        <p>
          Compartilhamos dados apenas com parceiros essenciais à operação: processador de pagamentos,
          transportadoras e ferramentas de análise. Nunca vendemos os seus dados a terceiros.
        </p>
      </Section>
      <Section title="Segurança">
        <p>
          Todo o tráfego do site é protegido por certificado SSL. Os dados são armazenados em
          ambiente com acesso restrito e criptografia em repouso.
        </p>
      </Section>
      <Section title="Seus direitos">
        <p>
          Você pode solicitar a qualquer momento o acesso, a correção, a portabilidade ou a exclusão
          dos seus dados enviando um e-mail para atendimento@lojaevora.shop. Respondemos em até 5
          dias úteis.
        </p>
      </Section>
      <Section title="Cookies">
        <p>
          Utilizamos cookies para manter o carrinho ativo, lembrar preferências e mensurar campanhas.
          Você pode desativá-los no seu navegador, ciente de que algumas funções podem deixar de
          funcionar corretamente.
        </p>
      </Section>
    </LegalPage>
  );
}
