# Plano de Implementação - Loja Évora

Este plano descreve a criação de uma loja e-commerce padrão Shopify para a marca **Évora** (anteriormente Pitaya), incluindo a migração de produtos do Instagram.

## Objetivos
- Configurar a estrutura base de e-commerce (Home, Produtos, Carrinho).
- Importar e adaptar 15 produtos do Instagram @pitaya.dress.
- Renomear a marca de "Pitaya" para "Évora" em todas as mídias.
- Implementar páginas de produtos detalhadas com feedback real.

## Etapas Técnicas

### 1. Estrutura Base (Frontend)
- **Componentes UI**: Header (Logo Évora, Nav, Busca, Carrinho), Footer, Hero Section.
- **Páginas**:
    - `index.tsx`: Vitrine com categorias e destaques.
    - `products/$productId.tsx`: Detalhes do produto, galeria de imagens, seleção de tamanho (P, M, G, GG), descrição e feedbacks.
    - `cart.tsx`: Gerenciamento de itens e checkout simplificado.

### 2. Dados e Imagens
- **Catálogo**: Criar um arquivo de dados (`src/lib/products-data.ts`) com os 15 produtos extraídos.
- **Processamento de Imagens**: 
    - Substituir "Pitaya" por "Évora" nas imagens via IA (usando prompts para manter originalidade).
    - Garantir mínimo de 4 fotos por produto (usando IA para gerar variações se necessário).
- **Feedbacks**: Integrar comentários reais extraídos do Instagram para cada produto.

### 3. Funcionalidades de E-commerce
- Estado global para o carrinho de compras.
- Simulador de cálculo de preços adequado ao mercado.
- Filtros básicos e navegação por categorias.

## Detalhes Técnicos
- **Framework**: TanStack Start (React 19).
- **Estilização**: Tailwind CSS v4.
- **Gerenciamento de Estado**: TanStack Store ou Context API para o carrinho.
- **Imagens**: Otimização via NextGen formats (WebP/AVIF).

## Checklist de Requisitos do Usuário
- [ ] Nome da loja: Évora.
- [ ] 15 produtos adicionados.
- [ ] Imagens editadas (Pitaya -> Évora).
- [ ] Mínimo 4 fotos por produto.
- [ ] Tamanhos P, M, G, GG.
- [ ] Feedbacks realistas com fotos.
- [ ] Estilo Shopify.
