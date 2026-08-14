# Plano: Correção do Vídeo Calça Alfaiataria Off-White

O usuário relatou que o vídeo do produto "Calça Évora Alfaiataria Off-White" está offline. Analisando o código, o componente `ProductPage` injeta o player Wistia via `dangerouslySetInnerHTML`. Para garantir 100% de disponibilidade e estabilidade, vou ajustar a implementação do embed e verificar os IDs de mídia fornecidos.

## Alterações

### 1. Ajuste no Componente de Produto
- Refinar a lógica de renderização do vídeo em `src/routes/produtos.$productId.tsx` para garantir que os scripts da Wistia sejam carregados corretamente e que o componente `<wistia-player>` seja reconhecido pelo navegador como um Web Component.
- Utilizar a nova versão do embed fornecida pelo usuário que inclui o player v2 (Web Component).

### 2. Validação dos Dados
- Confirmar que o ID `z4i9e4fgkn` está associado corretamente ao produto no arquivo de dados `src/lib/products-data.ts`.

## Detalhes Técnicos
- O embed da Wistia v2 usa Web Components (`wistia-player`). Como o React pode ter problemas com atributos de Web Components ou com o carregamento assíncrono de scripts injetados via `innerHTML`, vou garantir que o script `player.js` seja tratado de forma robusta.
- Vou encapsular o vídeo em um container que respeite o aspect ratio (0.5625 ou 9:16) para manter o visual premium da loja.

## Verificação
- Acessar a página da "Calça Évora Alfaiataria Off-White" no preview.
- Confirmar visualmente se o player carrega e o vídeo é reproduzido.
