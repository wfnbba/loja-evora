# Plano de Refatoração de Checkout Premium - Loja Évora

O objetivo é transformar o checkout em uma experiência de alta conversão, mobile-first, inspirada em grandes ecommerces (Amazon, Stripe, Mercado Livre), focada exclusivamente em PIX e corrigindo a exibição dos itens.

## Alterações Visuais e UX
- **Foco Exclusivo em PIX**: Remover logotipos de cartões de crédito (Visa, Mastercard). Utilizar apenas o ícone oficial do PIX (já otimizado).
- **Resumo de Itens Realista**: Corrigir a exibição dos itens no resumo do pedido para mostrar uma lista clara (Miniatura, Nome, Tamanho, Preço Original Riscado, Preço Atual e Desconto) em vez de um layout de "landing page".
- **Design de Alto Nível**: Refinar o layout de duas colunas em desktop e colapsável em mobile, com tipografia premium e clareza no "Total a Pagar".
- **Fluxo de Pagamento**: Garantir que o botão "Gerar PIX" gere o QR Code e o código "Copia e Cola" com o valor exato do carrinho.

## Alterações Técnicas
- **Asset do PIX**: O ícone `logo-pix.png` já foi criado via `lovable-assets` e será utilizado no rodapé e nos métodos de pagamento.
- **Componente `CheckoutOverlay`**:
    - Substituir a renderização dos itens no resumo (mobile e desktop) por um layout de lista simplificado.
    - Limpar a seção de selos de pagamento para exibir apenas PIX.
    - Otimizar o uso de imagens com `OptimizedImage` para as miniaturas do carrinho.
- **Integração VexoPay**: Manter a lógica de geração de PIX dinâmica vinculada ao valor total real do carrinho.

## Validação
- Testar o fluxo mobile (2 colunas/colapsável).
- Verificar se o resumo do pedido reflete fielmente o conteúdo do carrinho.
- Confirmar se o valor total gerado no PIX corresponde ao valor exibido no checkout.
