# Plano de Replicação: Layout DoramaFLIX em Espanhol para Évora

O objetivo é replicar a estrutura visual e de vendas do site `doramatvflix.com.br` na loja **Évora**, traduzindo toda a interface e conteúdo para o **Espanhol**, conforme solicitado. Manteremos a estratégia de conversão original, adaptando-a para o nicho de moda de luxo da Évora.

## Alterações de Idioma (Espanhol)

- **Textos de Interface**: Traduzir botões, labels e navegação (ex: "Assinar Agora" -> "Suscribirse Ahora", "Explorar Coleção" -> "Explorar Colección").
- **Catálogo e Produtos**: Traduzir nomes, descrições e categorias dos produtos no `products-data.ts`.
- **Provas Sociais**: Traduzir ou adaptar os feedbacks das clientes para espanhol, mantendo o tom realista e positivo.
- **Slogans**: Adaptar os slogans da Évora para o espanhol (ex: "Elegancia que impone presencia").

## Replicação Visual (Baseada no DoramaFLIX)

- **Estilo Dark/Premium**: Adotar o fundo escuro e sofisticado do DoramaFLIX, mas com a paleta da Évora (tons de café, marfim e dourado).
- **Seção de Ofertas (Planos)**: Replicar o layout de cards de preço do DoramaFLIX para exibir combos ou seleções exclusivas da Évora em espanhol.
- **Grade de Destaques**: Usar o estilo de posters arredondados para as peças principais da coleção.
- **Footer e Garantia**: Traduzir selos de segurança e métodos de pagamento.

## Detalhes Técnicos

- **Internacionalização**: Embora o foco seja a versão em espanhol, os textos serão substituídos diretamente nos arquivos de dados e componentes para esta versão específica.
- **Componentes**: Manter o uso de `Carousel` e `Card` do shadcn, aplicando os estilos visuais (gradientes e glassmorphism) do site de referência.

## Próximos Passos

1. Atualizar `src/lib/products-data.ts` com traduções para o espanhol.
2. Reformular a `src/routes/index.tsx` para seguir a estrutura de seções do DoramaFLIX (Hero -> Destaques -> Planos/Ofertas -> Feedbacks).
3. Ajustar os metadados de SEO na `index.tsx` e `__root.tsx` para o idioma espanhol.

