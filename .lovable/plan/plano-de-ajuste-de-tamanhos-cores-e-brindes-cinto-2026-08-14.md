# Plano de Ajuste de Tamanhos, Cores e Brindes (Cinto)

Ajustar a seleção de tamanhos, implementar o seletor de cores premium (bolinhas) e configurar o brinde "Cinto" como um item selecionável com visual de contraste.

## Alterações Técnicas

### 1. Dados dos Produtos (`src/lib/products-data.ts`)
- Garantir que todos os produtos tenham `sizes: ["P", "M", "G", "GG"]` (exceto Calça Off-White e Conjunto Espresso que são Tamanho Único para o produto, mas o brinde cinto segue a regra do usuário).
- Atualizar `includedGift` para refletir o pedido:
    - Cor: "Marrom Escuro"
    - Preço Original: 49,90
    - Preço Atual: "Grátis"

### 2. Página do Produto (`src/routes/produtos.$productId.tsx`)
- **Seletor de Cores Premium**:
    - Substituir os botões de texto por círculos coloridos (bolinhas).
    - Adicionar borda de destaque na cor selecionada.
    - Manter o nome da cor exibido como label acima das bolinhas.
- **Seção de Brinde (Cinto)**:
    - Transformar a exibição do brinde em um "seletor" visual que mostre contraste.
    - Exibir uma bolinha na cor "Marrom Escuro".
    - Mostrar o preço original (49,90) riscado ao lado do texto "Grátis".
    - Adicionar um indicativo visual de que o item foi "ganho de graça".

### 3. Checkout (`src/components/cart/checkout-overlay.tsx`)
- Garantir que a cor do brinde e o valor R$ 0,00 apareçam claramente no resumo.

## Validação
- Verificar se as cores aparecem como bolinhas na página do produto.
- Validar se o cinto de brinde aparece com o preço 49,90 riscado e a cor marrom escuro selecionada.
- Testar o fluxo de adicionar ao carrinho e ver o resumo no checkout.

