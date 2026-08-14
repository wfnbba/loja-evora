# Checkout Premium - Redesign e Funcionalidades

Redesenho completo do checkout para um estilo Shopify/Stripe mobile-first, com foco em fluidez, experiência premium e automação de endereço/frete.

## Alterações Técnicas

### 1. Interface (Mobile-First & Premium)
- **Layout Shopify-style**: Reorganização do layout para que o resumo do pedido (itens) fique no topo ou em um colapsável elegante no mobile, evitando que o usuário precise rolar excessivamente.
- **Fontes e Tipografia**: Aumento de fontes para melhor leitura em dispositivos móveis, seguindo um padrão visual limpo e minimalista.
- **Scroll Independente**: Garantir que as colunas de formulário e resumo funcionem de forma harmoniosa, com elementos fixos quando apropriado (sticky totals).
- **Remoção de Branding Externo**: Retirada de menções à "VexoPay" para manter o white-label da Évora.

### 2. Fluxo de Entrega e Frete
- **Lógica de Frete Dinâmico**: O frete só será exibido após o preenchimento dos dados de entrega (CEP/Endereço).
- **Frete Grátis Universal**: Independentemente da região, o frete será sempre exibido como "Grátis" para incentivar a conversão.
- **Prazo de Entrega**: Exibição automática de um prazo de "5 dias úteis" após o preenchimento do endereço.
- **Autopreenchimento Inteligente**: Melhoria na integração com ViaCEP para preenchimento instantâneo e fluido.

### 3. Componentes e Estado
- Refatoração do `src/components/cart/checkout-overlay.tsx` para acomodar o novo design.
- Ajuste nas classes Tailwind para otimização mobile (maior padding, alvos de toque maiores).

## Validação Visual
- Testes via Playwright focados em dispositivos móveis.
- Verificação do fluxo: Preenchimento de CEP -> Aparecimento do Frete Grátis e Prazo -> Botão de Pagamento.
