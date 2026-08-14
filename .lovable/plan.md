# Plano de Restauração do Checkout VexoPay Customizado

O usuário deseja manter o checkout customizado com VexoPay, integrando-o com os produtos que agora vêm da Shopify Storefront API. Atualmente, o projeto está usando o checkout nativo da Shopify.

## Alterações Propostas

### 1. Sincronização de Dados
- Garantir que o `useCartStore` (checkout customizado) seja o estado principal utilizado pelos botões "Adicionar ao Carrinho" e no Header.
- Manter o `useShopifyCartStore` apenas como ponte técnica para a API da Shopify se necessário, ou remover a dependência do checkout nativo.

### 2. Fluxo de Adição ao Carrinho
- Atualizar `src/routes/produtos.$productId.tsx` para usar o `addItem` do `useCartStore`.
- Mapear os dados do produto Shopify (`ShopifyProduct`) para o formato esperado pelo `CartItem` do VexoPay.

### 3. Interface do Carrinho
- Modificar o `src/components/cart/cart-sheet.tsx` para exibir os itens do `useCartStore`.
- Substituir o link de checkout da Shopify pelo gatilho do `CheckoutOverlay` (VexoPay).

### 4. Integração VexoPay
- Ajustar `src/components/cart/checkout-overlay.tsx` para processar corretamente os produtos vindos da Shopify (usando IDs da Shopify mas processando o pagamento via VexoPay).
- Garantir que o cálculo de preços e frete grátis continue funcionando no checkout customizado.

## Detalhes Técnicos

- **Estado**: Priorizar `evora-cart-storage` (Zustand) para persistência do checkout local.
- **Segurança**: As chaves VexoPay continuam sendo gerenciadas via Server Functions.
- **Tracking**: Manter a classe `utmify` nos botões do checkout customizado.

## Ações Imediatas
1. Reverter a lógica de "Finalizar Compra" no Carrinho para abrir o modal do VexoPay em vez de redirecionar para a Shopify.
2. Atualizar a página de produto para injetar itens no checkout local.
