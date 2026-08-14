# Plano de Otimização Mobile-First e Experiência de Checkout Évora

O objetivo deste plano é transformar o website em uma experiência premium focada em dispositivos móveis, com um fluxo de compra fluido, botões fixos estratégicos e um checkout exclusivo e completo.

## Alterações Sugeridas

### 1. Interface Mobile-First
- **Botão de Adicionar ao Carrinho Fixo:** Na página do produto (mobile), o botão de adicionar ao carrinho ficará fixo na parte inferior da tela após o scroll, facilitando a conversão.
- **Botão de Checkout Fixo no Footer:** Dentro do carrinho, o botão de finalização terá destaque total e ficará fixo na base da tela.

### 2. Fluxo de Checkout Premium (Single Page)
- **Migração do Overlay para Rota Exclusiva:** O checkout deixará de ser um "overlay" dentro do carrinho para se tornar uma página dedicada (`/checkout`), eliminando distrações e aumentando a confiança.
- **Estrutura de Duas Colunas (Desktop) / Fluxo Único (Mobile):** Resumo do pedido sempre visível ou colapsável no topo (mobile).
- **Cálculo Dinâmico:**
    - O frete será exibido como "Grátis" imediatamente após o preenchimento do CEP.
    - O prazo de entrega (5 dias úteis) será exibido dinamicamente.
    - Exibição clara de descontos (Preço De/Por).

### 3. Conclusão e Fidelização
- **Página de Obrigado Personalizada:** Após a confirmação do pagamento PIX (ou geração do código), o usuário será redirecionado para a nova página `/obrigado`.
- **Feedback Visual:** Uso de animações sutis de sucesso e confirmação de dados.

## Detalhes Técnicos
- **Novas Rotas:** Criação de `src/routes/checkout.tsx` e `src/routes/obrigado.tsx`.
- **Gerenciamento de Estado:** Utilização do `cart-store` (Zustand) para persistir os dados durante a transição para a página de checkout.
- **Integração VexoPay:** Manutenção da lógica de geração de PIX, mas adaptada para o fluxo de redirecionamento.
- **Responsividade:** Uso intensivo de classes Tailwind `sticky`, `bottom-0` e `flex-col-reverse` para otimização mobile.
