---
name: Integração UTMify e Checkout Premium
description: Implementação do rastreamento UTMify, scripts de rastreamento e automação do carrinho com botões padronizados.
type: feature
---

## Objetivos
- Integrar os scripts de rastreamento da UTMify no `<head>`.
- Padronizar todos os botões de "Adicionar ao Carrinho".
- Automatizar a abertura do carrinho após a adição de um produto.
- Capturar e persistir parâmetros UTM na navegação.
- Disparar evento de venda concluída para a UTMify após confirmação do PIX.
- Adicionar classe CSS `utmify` ao botão de checkout para rastreamento de Initiate Checkout.

## Detalhes Técnicos
- **Scripts UTMify:** Injeção no `src/routes/__root.tsx` dentro do componente `HeadContent` ou via tag `script` direta no `RootShell`.
- **Persistência de UTM:** Hook customizado `useUtmTracking` para capturar parâmetros da URL e armazenar em `sessionStorage` ou `localStorage`.
- **Interface:** Atualização de `src/routes/index.tsx` e `src/routes/produtos.$productId.tsx` para padronizar o texto "ADICIONAR AO CARRINHO" e acionar a abertura automática do `CartSheet`.
- **Checkout:** Adição da classe `utmify` no botão "Finalizar Compra" em `src/components/cart/cart-sheet.tsx`.
- **Evento de Conversão:** Integração na `CheckoutOverlay` (quando o status do PIX muda para 'paid') para chamar a API da UTMify via server function.
- **Segurança:** Armazenamento da chave `UTMIFY_API_TOKEN` no Lovable Cloud.
