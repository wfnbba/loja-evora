# Plano de Correção e Validação da Integração Shopify

A migração para a infraestrutura da Shopify Storefront API foi realizada, mas os produtos não estão aparecendo na vitrine. Este plano visa diagnosticar a conexão, restaurar a visibilidade dos produtos e validar os fluxos de checkout e trackeamento.

## Diagnóstico e Correção da Vitrine

1. **Verificar Conexão Shopify**:
    - Validar as credenciais (`SHOPIFY_STOREFRONT_TOKEN`, `SHOPIFY_STORE_PERMANENT_DOMAIN`) em `src/lib/shopify.ts`.
    - Executar um teste manual de query GraphQL para garantir que a API está retornando produtos.
    - Se a API retornar sucesso mas a lista for vazia, verificar na Shopify se os produtos estão marcados como disponíveis para o canal de vendas "Storefront" (ou o canal que gerou o token).

2. **Ajuste na Query de Produtos**:
    - Em `src/hooks/use-shopify-products.ts`, garantir que a query não esteja falhando silenciosamente.
    - Adicionar logs temporários para inspecionar a resposta da Shopify.

3. **Fallback Estrutural**:
    - Se a Shopify ainda não tiver produtos cadastrados pelo usuário, re-implementar um fallback inteligente que use os dados locais de `src/lib/products-data.ts` enquanto a sincronização não é concluída.

## Validação de Funcionalidades

1. **Contabilização e Trackeamento Shopify**:
    - O `useShopifyCartStore` gera o `checkoutUrl` oficial da Shopify. A contabilização de vendas é nativa da Shopify assim que o pagamento é concluído no checkout deles.
    - Validar se o `checkoutUrl` está sendo gerado corretamente com o parâmetro de canal.

2. **UTMify**:
    - Verificar se os scripts de tracking injetados no `src/routes/__root.tsx` estão carregando sem erros.
    - Garantir que a classe CSS `utmify` (ou os IDs necessários) esteja presente nos botões de checkout.

3. **VexoPay**:
    - Note: Ao migrar para o checkout nativo da Shopify, o VexoPay deve ser configurado dentro do painel da Shopify como um provedor de pagamento (Gateway). A implementação customizada via Server Functions (`src/lib/vexopay.functions.ts`) era para o checkout próprio.
    - Clarificar com o usuário se ele deseja usar o Checkout Nativo da Shopify (onde VexoPay deve ser configurado lá) ou se mantemos o checkout customizado que construímos.

## Detalhes Técnicos

- **Ferramentas**: `fetch` para debug de API, logs no navegador para verificação de scripts UTMify.
- **Segurança**: Manter chaves em variáveis de ambiente.
- **Performance**: Manter otimização de imagens e carregamento sob demanda.

### Ações Imediatas
1. Rodar script de diagnóstico da API Shopify via shell.
2. Corrigir a exibição na `index.tsx` se a API estiver vazia.
3. Inspecionar o console em busca de erros UTMify.
