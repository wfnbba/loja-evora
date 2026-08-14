# Plano de Refatoração do Checkout - Loja Évora

O objetivo é transformar a experiência de checkout em uma interface de alto nível, eliminando qualquer vestígio da landing page e focando em um resumo de pedido profissional e minimalista.

## Alterações Visuais e Estruturais

### 1. Refatoração do Resumo do Pedido (`CheckoutOverlay`)
- **Lista de Itens**: Implementar uma lista limpa onde cada item ocupa uma linha discreta.
- **Miniatura**: Foto quadrada pequena (aprox. 64px a 80px) com bordas finas.
- **Informações**: Nome do produto e preço alinhados horizontalmente.
- **Preços e Descontos**: Exibição clara de "De/Por" com o valor do desconto aplicado em destaque (estilo verde discreto ou badge minimalista).
- **Totalizadores**: Subtotal, Frete (Grátis após preenchimento) e Total destacados com tipografia premium.

### 2. Fluxo e Layout
- **Mobile-First**: Garantir que o resumo seja a primeira ou última coisa clara para o usuário, sem distrações de marketing da landing page.
- **Desktop**: Manter o layout de duas colunas (Formulário à esquerda, Resumo à direita) com fundo contrastante suave para o resumo.
- **Estética**: Uso de espaços em branco (whitespace), fontes com tracking espaçado e elementos de confiança (ShieldCheck, Safe Payment).

## Detalhes Técnicos
- Atualizar o componente `CheckoutOverlay` para garantir que o resumo seja renderizado de forma independente e fixa.
- Remover quaisquer componentes da landing page que possam estar sendo injetados ou renderizados por engano na rota `/checkout`.
- Assegurar que os preços `originalPrice` e `price` sejam extraídos corretamente do estado do carrinho para o cálculo do "antes e depois".

## Validação
- Testar o fluxo completo de adição ao carrinho até a visualização do resumo no checkout.
- Verificar a responsividade em dispositivos mobile (simulando iPhone/Android).
- Confirmar se a hierarquia visual prioriza o preenchimento dos dados e a conferência dos itens.
