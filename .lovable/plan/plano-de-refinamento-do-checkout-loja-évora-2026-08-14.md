# Plano de Refinamento do Checkout - Loja Évora

Este plano detalha as alterações para tornar o checkout mais robusto, interativo e visualmente alinhado com um padrão premium, incluindo o resumo sempre visível, controles de quantidade, banner de urgência e frete dinâmico.

## Alterações Visuais e Funcionais

### 1. Banner de Urgência (Countdown)
- Implementar um banner fixo no topo (Announcement Bar) com cronômetro regressivo de 15 minutos.
- Mensagem: "Preço garantido por apenas **14:59** Devido a alta demanda."
- Estética premium: Fundo contrastante (ex: tom escuro da paleta Évora), centralizado, mobile-first.

### 2. Resumo do Pedido Explicito e Interativo
- **Mobile**: Remover o comportamento "minimizado". O resumo deve estar aberto por padrão ou ser parte integrante do fluxo sem precisar de clique extra para ver os itens.
- **Controle de Quantidade**: Adicionar botões `+` e `-` para cada item no resumo do checkout, permitindo que a cliente ajuste a quantidade diretamente na finalização.
- **Visual**: Miniaturas quadradas, nomes claros, preços antes/depois e badges de desconto.

### 3. Fluxo de Frete Dinâmico
- Inicialmente, o frete no resumo aparece como "A calcular".
- Após o preenchimento completo do endereço (CEP e número), o frete será adicionado automaticamente como uma linha de item no resumo.
- Valor do frete: **Grátis**.

### 4. Ajustes no Checkout (PIX)
- Remover a frase "Promoção Évora" do card de pagamento PIX.
- Garantir que apenas o PIX seja exibido como método, conforme solicitado.

## Detalhes Técnicos
- **Store**: Atualizar `useCartStore` (zustand) para garantir que a atualização de quantidade reflita instantaneamente no checkout.
- **Componente**: Modificar `CheckoutOverlay` para gerenciar o estado do countdown e a visibilidade permanente do resumo.
- **Estilos**: Utilizar Tailwind CSS para garantir a responsividade e a paleta de cores `#4a3f35` e `#fcfaf7`.

---
*Nota: Todas as imagens e assets serão mantidos conforme as instruções anteriores.*
