# Plano de Restauração de Imagens de Feedback

O usuário relatou que as imagens nos feedbacks dos produtos desapareceram. Após análise do arquivo `src/lib/products-data.ts`, identifiquei que embora existam importações de arquivos JSON de feedback e imagens, as revisões nas primeiras posições do array `reviews` de cada produto (que são as que aparecem primeiro devido à paginação) não possuem a propriedade `image` definida.

## Ações Necessárias

1.  **Auditoria do Catálogo:** Verificar em `src/lib/products-data.ts` quais revisões deveriam ter imagens associadas.
2.  **Mapeamento de Imagens:** Reatribuir as propriedades `image` nas primeiras revisões de cada produto para garantir que as fotos de unboxing e feedbacks reais apareçam nas primeiras páginas.
3.  **Correção de Dados:** Atualizar o array `reviews` de cada um dos 15 produtos para incluir o link da imagem (usando as importações `.url` já existentes no topo do arquivo).

## Detalhes Técnicos

-   **Arquivo Alvo:** `src/lib/products-data.ts`.
-   **Estrutura da Revisão:** Garantir que o objeto `{ user, comment, rating, image }` tenha a propriedade `image` apontando para a importação correta (ex: `image: feedbackMarfim1.url`).
-   **Distribuição:** Pelo menos as 5 a 10 primeiras avaliações de cada produto principal devem ter imagens restauradas, conforme solicitado anteriormente no histórico do projeto.
-   **Validação:** Verificar se o componente `OptimizedImage` em `src/routes/produtos.$productId.tsx` está recebendo a URL corretamente (o código atual parece correto, o problema é no dado).

Este plano foca exclusivamente na restauração da visibilidade das imagens nos feedbacks, mantendo a integridade dos comentários e nomes brasileiros já implementados.
