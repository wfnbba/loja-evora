# Plano: Destaque Premium para Política de Troca

Este plano visa destacar a mensagem de "Primeira troca gratuita" nas páginas de produto da Évora, utilizando um design premium que proporcione contraste e impacto visual, seguindo a estética minimalista da marca.

## Alterações Visuais

### Componente de Produto (`src/routes/produtos.$productId.tsx`)
- Refatorar o elemento de política de troca (linhas 187-190) para um layout estilo "banner" ou "badge" premium.
- **Design proposto:**
  - Fundo com contraste suave (ex: um tom pastel muito claro da marca ou um cinza quase branco).
  - Borda fina e minimalista.
  - Ícone elegante (como o `RefreshCw` ou `Truck`) para reforçar a ideia de serviço.
  - Tipografia em caixa alta (uppercase) com espaçamento entre letras (letter-spacing) para manter a linguagem visual da loja.
  - Uso de cores semânticas (como o verde suave para sucesso/confiança) sem quebrar o minimalismo.

## Detalhes Técnicos
- Utilizar componentes do Tailwind CSS e ícones da biblioteca Lucide React.
- Garantir que o componente seja responsivo e mantenha o alinhamento centralizado ou à esquerda conforme o layout atual.

## Validação
- Abrir a página de produto no preview.
- Verificar o contraste e a legibilidade da nova seção em dispositivos móveis e desktop.
