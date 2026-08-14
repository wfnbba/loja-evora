# Plano de Replicação: Layout DoramaFLIX para Évora

O objetivo é replicar a estrutura visual e de vendas do site `doramatvflix.netlify.app` na loja **Évora**, adaptando a estética de "streaming de doramas" para uma "loja de moda de alto padrão", mantendo a eficiência de conversão do layout original (foco em planos/ofertas e provas sociais).

## Alterações Visuais e Estruturais

- **Header**: Adaptar o botão "Assinar Agora" para "Ver Coleção" ou "Explorar Loja", mantendo o estilo minimalista com fundo translúcido.
- **Hero Section**: Substituir a seção atual por uma que utilize a tipografia e o impacto visual do site de referência, mas com as imagens da Évora.
- **Seção de Planos (Ofertas)**: Transformar a estrutura de "Pacote Básico/Premium" em "Combos" ou "Ofertas Especiais" da Évora (ex: "Look Completo", "Seleção VIP"), mantendo o design de cards com gradientes e badges de desconto.
- **Destaques**: Adaptar o carrossel/grade de posters de doramas para uma exibição de "Peças de Destaque" da Évora com o mesmo estilo de bordas arredondadas e sombras.
- **Provas Sociais**: Replicar a seção "O que nossos clientes dizem" usando os feedbacks reais extraídos do Instagram da Évora.
- **Seção de Garantia/Pagamento**: Adaptar a iconografia para métodos de pagamento de e-commerce (PIX, Cartão) e selos de segurança.
- **Paleta de Cores**: Manter o fundo escuro/sofisticado do DoramaFLIX (roxo profundo/preto) mas ajustado para os tons de marrom/dourado/creme da Évora para manter a identidade de luxo.

## Detalhes Técnicos

- **Componentes UI**: Utilizar `Carousel` do shadcn para os destaques e `Card` para as ofertas.
- **Estilização**: Implementar gradientes e efeitos de vidro (glassmorphism) conforme o site de referência.
- **Responsividade**: Garantir que o layout "mobile-first" do DoramaFLIX seja preservado, especialmente a posição dos botões de ação (CTA).
- **Tipografia**: Integrar a fonte 'Great Vibes' (ou similar) para detalhes elegantes e 'Inter' para o corpo, conforme o site original.

## Próximos Passos

1. Criar novos componentes de seção na `index.tsx` baseados na estrutura do DoramaFLIX.
2. Atualizar a `products-data.ts` se necessário para incluir metadados de "destaque" ou "combos".
3. Ajustar o CSS global para incluir os gradientes e animações detectados no site de referência.
