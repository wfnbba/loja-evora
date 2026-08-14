# Plano de Melhoria da Navegação e Galeria de Produtos

O usuário solicitou melhorias no topo do site (Header) com novos menus e uma reformulação da galeria de imagens na página do produto para ser horizontal e contínua (carrossel), otimizando o espaço na primeira dobra.

## Ações Necessárias

1.  **Header (src/routes/__root.tsx):**
    *   Adicionar novos links de navegação: "Vestidos", "Conjuntos", "Alfaiataria", "Acessórios".
    *   Implementar um menu mobile (Sheet/Drawer) para comportar esses links de forma organizada.
    *   Garantir que a logo e o carrinho permaneçam visíveis e acessíveis.

2.  **Galeria de Produtos (src/routes/produtos.$productId.tsx):**
    *   Refatorar a seção de imagens para um carrossel horizontal contínuo.
    *   Remover o grid de 4 colunas no mobile que prejudica a visualização.
    *   Implementar a lógica de "próximo/anterior" com loop automático (da última para a primeira e vice-versa).
    *   Adicionar suporte a gestos de "swipe" (deslizar) no mobile para uma experiência nativa.
    *   Otimizar a "primeira dobra" para que o conteúdo (título, preço, CTA) suba e fique mais visível sem ser empurrado por uma lista longa de fotos.

3.  **Estilização (src/styles.css):**
    *   Adicionar utilitários para ocultar barras de rolagem e suportar animações suaves de transição no carrossel.

## Detalhes Técnicos

*   Utilizar `framer-motion` (se disponível) ou `CSS Scroll Snap` para o carrossel horizontal de baixo custo computacional.
*   O menu mobile será implementado usando o componente `Sheet` do shadcn/ui.
*   A navegação do carrossel será controlada por estado local (`selectedImage`) com funções de incremento/decremento que aplicam o operador módulo para o loop.
