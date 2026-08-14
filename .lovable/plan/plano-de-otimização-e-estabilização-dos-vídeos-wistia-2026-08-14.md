# Plano de Otimização e Estabilização dos Vídeos Wistia

O usuário relatou que os vídeos (Vestido Aurora Café e Calça Alfaiataria Off-White) estão demorando muito para carregar, aparecendo borrados e sem possibilidade de interação. Isso ocorre porque o componente `wistia-player` depende de scripts externos que estão sendo injetados via `dangerouslySetInnerHTML` dentro de cada página de produto, o que pode causar atrasos e problemas de inicialização durante a navegação entre rotas do TanStack Start.

## Alterações Propostas

### 1. Centralização dos Scripts no Root
Mover os scripts base da Wistia para a rota raiz (`src/routes/__root.tsx`) para garantir que a biblioteca esteja carregada globalmente antes mesmo do usuário acessar as páginas de produtos.

### 2. Refatoração da Injeção de Vídeo
Em vez de injetar scripts e estilos repetidamente em cada página de produto, usaremos o componente `wistia-player` de forma mais limpa, aproveitando o carregamento global da biblioteca.

### 3. Otimização de Performance
Adicionar o atributo `priority` ou garantir o carregamento antecipado (preload) dos scripts da Wistia no cabeçalho da aplicação.

## Detalhes Técnicos

### src/routes/__root.tsx
- Adicionar `<script src="https://fast.wistia.com/player.js" async />`
- Adicionar `<script src="https://fast.wistia.com/embed/wt5hy23zyr.js" async type="module" />` (ID Aurora Café)
- Adicionar `<script src="https://fast.wistia.com/embed/z4i9e4fgkn.js" async type="module" />` (ID Calça Off-White)

### src/routes/produtos.$productId.tsx
- Limpar o `dangerouslySetInnerHTML` para remover a injeção repetitiva de scripts.
- Manter apenas o componente `<wistia-player>` e o CSS de placeholder (blur) necessário para o layout.
- Garantir que o player seja inicializado corretamente após a navegação.
