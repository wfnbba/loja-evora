# Plano de Refatoração do Checkout Évora

O usuário solicitou uma reformulação completa da experiência de checkout para torná-la mais "premium", estilo grandes ecommerces brasileiros, com as seguintes regras:
1.  **Frete:** Não exibir "Frete Grátis" antes do preenchimento do endereço.
2.  **Itens do Pedido:** Exibir apenas 1 foto principal por produto, tamanho selecionado, preço original riscado (se houver), preço promocional, % de desconto e total de desconto.
3.  **Estrutura:** O checkout deve ser uma página real (`/checkout`), não um iframe dentro de um componente, com layout premium de alto nível.

## Alterações Propostas

### 1. Rota de Checkout (`src/routes/checkout.tsx`)
- Transformar o componente `CheckoutPage` em uma experiência completa, removendo a dependência do `CheckoutOverlay` como um "modal/overlay" e integrando o conteúdo diretamente na página.
- Implementar um layout de duas colunas (ou fluxo mobile-first otimizado) que se comporte como uma SPA de checkout de alta conversão.

### 2. Componente de Checkout (`src/components/cart/checkout-overlay.tsx`)
- Renomear ou refatorar para ser um componente de conteúdo do checkout (`CheckoutContent`).
- **Remover** menções prematuras a "Frete Grátis" nos blocos de pagamento e resumo antes do CEP ser validado.
- **Resumo de Produtos:** Atualizar a exibição para incluir:
    - Foto principal (capa).
    - Tamanho.
    - Preço original (riscado).
    - Preço atual.
    - Tag de `% de desconto`.
    - Total de economia/desconto por item.

### 3. Lógica de Frete
- Garantir que as informações de frete e prazos só apareçam no estado `isAddressFilled`.

### 4. Estética Premium
- Ajustar espaçamentos, tipografia e elementos visuais para alinhar com o padrão de luxo da Loja Évora.
- Garantir que a página seja independente e não pareça um componente flutuante.

## Verificação
- Testar o fluxo de preenchimento de CEP.
- Validar a exibição dos preços e descontos no resumo.
- Verificar se a página `/checkout` carrega corretamente como uma rota independente.
