---
name: Limpar Cache e Restaurar Visibilidade das Imagens
description: Remove classes de ocultação e otimiza a galeria para garantir que todas as imagens sejam visíveis e navegáveis.
type: feature
---

A análise do preview indicou que, embora o banco de dados (`products-data.ts`) contenha as imagens corretas e o DOM as carregue (10 imagens por produto), o componente de galeria está com a seção de miniaturas oculta via CSS (`hidden`) e os indicadores mobile estão difíceis de visualizar. Para "limpar o cache" do ponto de vista do usuário (ver as fotos), restauraremos a interface de galeria completa.

### Alterações Técnicas

1. **Restaurar Miniaturas na Página de Produto:**
   - No arquivo `src/routes/produtos.$productId.tsx`, remover a classe `hidden` da `div` de miniaturas (linhas 167-181) para que as fotos adicionais fiquem visíveis para clique e navegação rápida.

2. **Otimizar Carregamento de Ativos:**
   - Verificar se o componente `OptimizedImage` está interferindo na renderização inicial e garantir que a primeira imagem tenha prioridade total de carregamento.

3. **Validação Visual:**
   - Confirmar se o seletor de imagens (`selectedImage`) alterna corretamente entre todas as URLs mapeadas no `products-data.ts`.

Este ajuste garantirá que o usuário veja imediatamente que o catálogo está completo, sem depender de cliques às cegas na imagem principal.
