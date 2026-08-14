# Plano de Ajuste de Tamanhos, Cores e Brindes (Cinto)

Ajustar a seleção de tamanhos para todos os produtos, configurar o brinde "Cinto" como tamanho único na cor "Marrom Escuro" com visual de contraste (preço riscado + grátis) e garantir que a seleção do brinde seja explícita.

## Alterações Técnicas

### 1. Dados dos Produtos (`src/lib/products-data.ts`)
- Garantir que todos os produtos tenham `sizes: ["P", "M", "G", "GG"]`.
- Atualizar `includedGift` nos produtos que possuem cinto (Calça Off-White e Conjunto Espresso):
    - Nome: "Cinto Premium Évora"
    - Cor: "Marrom Escuro"
    - Preço Original: 49,90
    - Preço Atual: "Grátis"

### 2. Página do Produto (`src/routes/produtos.$productId.tsx`)
- Modificar a renderização da seção `includedGift`:
    - Adicionar um seletor visual (tipo botão) para o brinde, similar à seleção de cor, para mostrar que é um item à parte.
    - Exibir "Tamanho: Único" e "Cor: Marrom Escuro".
    - Estilizar o preço com `line-through` para o valor original (49,90) e destaque para o "Grátis".
- Garantir que a lógica de `addToCart` continue funcionando corretamente.

### 3. Checkout (`src/components/cart/checkout-overlay.tsx`)
- Verificar se a cor do brinde e o status de "Grátis" são refletidos corretamente no resumo do pedido caso o brinde seja tratado como item (atualmente é metadado do produto, mas a UI precisa deixar claro).

## Validação
- Acessar a página da "Calça Évora Alfaiataria Off-White".
- Verificar se os tamanhos P, M, G, GG estão disponíveis.
- Verificar se o brinde "Cinto" aparece com cor "Marrom Escuro" e preço 49,90 riscado ao lado de "Grátis".
- Validar se o visual do brinde tem contraste suficiente.
