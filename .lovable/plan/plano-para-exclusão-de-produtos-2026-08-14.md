# Plano para exclusão de produtos

Este plano descreve as etapas para remover os produtos solicitados pelo usuário do catálogo da loja Évora.

## Alterações

### Catálogo de Produtos
- Remover o produto **Camisa Évora Orquídea** (ID: `camisa-laco-orquidea`).
- Remover o produto **Colete Évora Rosé** (ID: `colete-rose`).
- Remover o produto **Saia Évora Rosé** (ID: `saia-rose`).

## Detalhes Técnicos
- Editar o arquivo `src/lib/products-data.ts` para remover as entradas correspondentes no array `products`.
- Limpar as importações de assets que se tornarem órfãs após a remoção dos produtos.

## Validação
- Executar `bunx tsgo` para garantir que não existam erros de tipagem.
- Verificar a home page e as páginas de produtos para confirmar que os itens foram removidos.
