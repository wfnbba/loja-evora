# Plano: Correção do Vídeo Vestido Évora Aurora Café

O usuário relatou que o vídeo do produto "Vestido Évora Aurora Café" está offline. Analisando o código atual, ele utiliza um embed antigo baseado em `iframe`. Vou atualizar para o novo padrão `wistia-player` (Web Component) fornecido pelo usuário para garantir estabilidade e disponibilidade.

## Alterações

### 1. Atualização do Componente de Produto
- Modificar o trecho de código em `src/routes/produtos.$productId.tsx` que renderiza o vídeo para o `product.id === "vestido-aurora-cafe"`.
- Substituir o `iframe` e o script `E-v1.js` pelo novo código que utiliza `player.js`, o script de embed específico da mídia (`wt5hy23zyr.js`) e o componente `<wistia-player>`.
- Manter o container com `aspect-[9/16]` para consistência visual.

## Verificação
- Acessar a página do "Vestido Évora Aurora Café" no preview.
- Validar se o vídeo é carregado corretamente via Web Component.
- Verificar se o layout permanece responsivo e alinhado.
