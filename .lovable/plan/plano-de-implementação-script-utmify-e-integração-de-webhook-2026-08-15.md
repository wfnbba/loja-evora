# Plano de Implementação: Script UTMify e Integração de Webhook

Implementação dos scripts UTMify no head da aplicação e configuração do envio de dados de vendas para a API da UTMify via webhook, garantindo o rastreamento completo das conversões.

## Alterações Propostas

### Frontend e Scripts
- Injetar os dois scripts dinâmicos da UTMify no `<head>` em `src/routes/__root.tsx`.
- Garantir que os scripts sejam carregados de forma assíncrona e segura.

### Integração UTMify (Backend)
- Criar `src/lib/utmify.functions.ts` com a função `sendUtmifySale` para realizar o POST para `https://api.utmify.com.br/api-credentials/orders`.
- A função deve extrair os parâmetros UTM persistidos no `sessionStorage` (via `getPersistedUtms`) e enviá-los no payload.
- Mapear os status da VexoPay (`paid`, `pending`, `failed`, `expired`, `refunded`) para os status esperados pela UTMify (`paid`, `waiting_payment`, `refused`, `refused`, `refunded`).

### Webhook VexoPay
- Atualizar `src/routes/api/public/webhook.ts` para invocar a integração com a UTMify sempre que um evento `payment.completed` for recebido.
- Adicionar suporte para outros eventos da VexoPay (como cancelamento ou reembolso) para manter a UTMify sincronizada.

## Detalhes Técnicos
- **Endpoint UTMify:** `https://api.utmify.com.br/api-credentials/orders`
- **Headers UTMify:** `x-api-token` (deve ser configurado via segredo `UTMIFY_API_TOKEN`).
- **Persistência de UTM:** Utilizar os dados salvos em `sessionStorage` sob a chave `utmify_params`.
- **Segurança:** O processamento no webhook continuará validando a assinatura da VexoPay antes de qualquer ação.

## Próximos Passos
1. Adicionar scripts ao `RootShell` em `src/routes/__root.tsx`.
2. Implementar `src/lib/utmify.functions.ts`.
3. Atualizar `src/routes/api/public/webhook.ts` para processar eventos e notificar a UTMify.
4. Testar o fluxo completo de venda.
