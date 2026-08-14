# Plano de Reformulação da Seção de Feedbacks

O objetivo é transformar a seção de feedbacks simples em um sistema robusto com resumo de notas, paginação, ordenação inteligente e filtros por tipo de avaliação.

## Alterações de Dados (`src/lib/products-data.ts`)

- Adicionar um campo `ratingBreakdown` ao objeto `Product` para armazenar a contagem de cada estrela (5, 4, 3, 2, 1).
- Expandir a lista de `reviews` para cada produto, garantindo que tenhamos uma mistura de:
    - Avaliações com comentário + imagem.
    - Avaliações apenas com comentário.
    - Avaliações apenas com estrelas (sem texto/imagem).
- Garantir que o volume total de avaliações condiga com o `salesCount` e o `ratingBreakdown`.

## Alterações de Interface (`src/routes/produtos.$productId.tsx`)

### 1. Resumo de Avaliações
- Criar um componente de cabeçalho para a seção de feedback que mostre:
    - A nota média (ex: 4.8/5).
    - O número total de avaliações.
    - Barras de progresso para cada nível de estrela (5 a 1), mostrando a quantidade de votos em cada uma.

### 2. Lógica de Ordenação e Filtragem
- Implementar a regra de prioridade solicitada:
    1. Comentário + Imagem (topo).
    2. Apenas comentário.
    3. Apenas estrelas.
- Adicionar estado local para controlar a página atual da paginação.

### 3. Paginação e Listagem
- Exibir exatamente 10 avaliações por página.
- Adicionar controles de paginação (Anterior/Próximo e números de página).
- Refinar o layout dos cards de avaliação para acomodar os diferentes tipos (especialmente as "apenas estrelas", que serão mais compactas).

## Detalhes Técnicos

- **Interface:** O `Product` terá `ratingBreakdown: { 5: number; 4: number; 3: number; 2: number; 1: number; }`.
- **Performance:** As imagens de feedback continuarão usando `loading="lazy"`.
- **UX:** A transição entre páginas de feedback deve ser suave.

---
**Nota:** Vou gerar dados fictícios adicionais para preencher as páginas de feedback (apenas estrelas e comentários curtos) para que a paginação seja visível conforme solicitado.
