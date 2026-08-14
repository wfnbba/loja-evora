# Plano para Aumento Global de Fontes e Otimização Mobile-First

O objetivo é tornar o site mais legível e impactante em dispositivos móveis, removendo fontes minúsculas (9px-10px) e ajustando espaçamentos excessivos para uma experiência "mobile-first" de luxo.

## Mudanças Propostas

### 1. Tipografia Global e Componentes
- **Substituição de fontes minúsculas:**
  - Alterar `text-[8px]` e `text-[9px]` para `text-[12px]` ou `text-xs`.
  - Alterar `text-[10px]` para `text-sm` (14px).
  - Elevar `text-xs` (12px) para `text-sm` (14px) em elementos de leitura principal.
  - Elevar `text-sm` (14px) para `text-base` (16px) em descrições e formulários.
- **Títulos e Preços:**
  - Aumentar títulos de produtos e seções para serem mais imponentes no mobile.
  - Garantir que preços tenham destaque visual claro.

### 2. Ajuste de Espaçamentos (Gaps)
- **Redução de lacunas verticais:**
  - Ajustar seções com `py-20` para `py-10` no mobile, mantendo `md:py-20`.
  - Reduzir `gap-12` e `gap-20` em grids de produtos e páginas de detalhes para `gap-6` ou `gap-8` no mobile.
- **Otimização de Container:**
  - Garantir que o conteúdo preencha melhor a largura da tela em dispositivos pequenos sem margens laterais exageradas.

### 3. Página Inicial (`src/routes/index.tsx`)
- Aumentar o tamanho do texto nos cards de produto (nome e preço).
- Aumentar o botão "Ver Detalhes" para facilitar o toque (touch target).
- Ajustar o banner Hero para ter um CTA (botão) mais visível.

### 4. Página de Produto (`src/routes/produtos.$productId.tsx`)
- Aumentar fontes da descrição, seletor de tamanhos e cores.
- Tornar os banners de "Troca Garantida" e "Brinde" mais compactos mas com textos maiores.
- Aumentar o botão "ADICIONAR AO CARRINHO".

### 5. Checkout (`src/components/cart/checkout-overlay.tsx`)
- Aumentar fontes dos labels de formulário e inputs.
- Tornar o resumo do pedido no mobile mais legível.
- Ajustar o banner de urgência para usar fontes maiores.

## Detalhes Técnicos
- Utilizar classes utilitárias do Tailwind para manter a consistência.
- Priorizar `text-sm` e `text-base` como novos padrões mínimos de leitura.
- Revisar `tracking-[0.2em]` em fontes pequenas, pois o espaçamento entre letras excessivo dificulta a leitura quando a fonte é pequena.

## Validação
- Verificar visualmente no preview mobile se todos os textos são legíveis sem esforço.
- Garantir que não existam sobreposições de elementos devido ao aumento das fontes.
