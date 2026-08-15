# Plano: Ajustar classe UTMify

## Objetivo
Garantir que a classe CSS `utmify` esteja presente **apenas** no botão "Finalizar Compra" do carrinho lateral, que é o único botão que leva o cliente para o checkout.

## Alterações
1. **src/components/cart/cart-sheet.tsx**
   - Adicionar a classe `utmify` ao botão "Finalizar Compra" (linha 121).

2. **src/components/cart/checkout-overlay.tsx**
   - Remover a classe `utmify` do botão "Gerar QR Code PIX" (linha 231), pois ele não deve mais carregar essa classe.

## Validação
- Verificar no preview se apenas o botão "Finalizar Compra" do carrinho lateral possui a classe `utmify`.
- Confirmar que nenhum outro botão do fluxo de compra possui a classe.
