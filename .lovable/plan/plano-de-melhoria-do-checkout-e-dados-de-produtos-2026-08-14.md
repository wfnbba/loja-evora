# Plano de Melhoria do Checkout e Dados de Produtos

Este plano detalha a implementação de um checkout "limpo" estilo Stripe, correções no sistema de pagamento PIX e atualização dos dados dos produtos com preços promocionais.

## 1. Atualização de Dados dos Produtos
- **Preços Riscados**: Adicionar campo `originalPrice` no modelo de dados para exibir descontos.
- **Caso Específico**: Atualizar o "Vestido Évora Aurora Café" para: Original: R$ 379,00 | Atual: R$ 129,90.
- **Ajuste Geral**: Aplicar lógica de preços promocionais em outros produtos para consistência visual.

## 2. Refatoração do Checkout (Estilo Stripe)
- **Layout de Duas Colunas**:
  - Coluna Esquerda: Formulário de dados simplificado e limpo.
  - Coluna Direita: Resumo do pedido com imagens dos itens, preços, descontos e total.
- **Experiência de Endereço**:
  - Refinar o preenchimento automático via CEP para ser instantâneo.
  - Melhorar as máscaras de entrada para CPF e Telefone.
- **Resumo Visual**: Mostrar miniatura do produto, nome, variantes (tamanho/cor) e o valor economizado.

## 3. Correção e Fluxo do PIX
- **Geração de QR Code**: Garantir que o botão "Gerar PIX" execute a função `createPixPayment` e apresente o QR Code e o código "Copia e Cola" imediatamente.
- **Feedback Visual**: Adicionar estados de carregamento (skeletons ou spinners) durante a comunicação com a VexoPay.
- **Webhook e Status**: Garantir que a transição para a tela de sucesso ocorra assim que o pagamento for detectado.

## Detalhes Técnicos
- Modificação de `src/lib/products-data.ts` para incluir `originalPrice`.
- Refatoração completa de `src/components/cart/checkout-overlay.tsx`.
- Ajustes na interface `Product` e nos componentes de exibição de preço em `src/routes/produtos.$productId.tsx` e `src/routes/index.tsx`.
- Uso de `@tanstack/react-start` server functions para chamadas de API seguras.
