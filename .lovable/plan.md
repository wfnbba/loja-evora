# Plano de Correção: Consistência de Imagens e Dados dos Produtos

Este plano visa corrigir as inconsistências nas imagens dos produtos, especialmente no "Vestido Évora Noir", e garantir que cada produto tenha 4 imagens exclusivas e coerentes.

## Problemas Identificados
- **Mix de Imagens**: Alguns produtos (ex: Vestido Évora Noir e Marfim) estão compartilhando variantes de imagem que pertencem a produtos diferentes.
- **Incoerência Visual**: O usuário relatou que o "Vestido Évora Noir" exibe imagens de produtos distintos em sua galeria.
- **Mapeamento Genérico**: Outros produtos (coletes, calças) também apresentam imagens trocadas ou genéricas de outras peças.

## Ações Propostas

### 1. Auditoria e Limpeza de Dados (`src/lib/products-data.ts`)
- Revisar a lista de 15 produtos e suas associações de imagens.
- Desvincular imagens que não pertencem ao produto específico.
- Garantir que cada ID de produto aponte para um conjunto único de 4 imagens.

### 2. Geração de Variações de Imagem Coerentes
- Identificar produtos que ficaram com menos de 4 imagens após a limpeza.
- Utilizar um subagente especializado em edição de imagem para gerar novas variantes (ângulos diferentes, detalhes) baseadas *exclusivamente* na imagem original de cada produto.
- Garantir que as variantes do "Vestido Évora Noir" sejam exclusivamente do modelo preto e as do "Marfim" sejam do modelo marfim.

### 3. Atualização dos Assets Locais
- Salvar as novas imagens geradas na pasta `src/assets/products/` com nomes claros (ex: `noir-2.jpg`, `marfim-2.jpg`).
- Atualizar os imports e a exportação no `src/lib/products-data.ts`.

### 4. Verificação Final
- Abrir a visualização da loja e navegar pelas páginas dos produtos afetados para confirmar a consistência visual.
- Validar se o "Vestido Évora Noir" agora exibe apenas fotos do mesmo vestido.

## Detalhes Técnicos
- **Subagente**: Será utilizado um subagente para realizar a tarefa de geração de imagens de forma paralela e precisa.
- **Coerência**: As imagens geradas devem manter o mesmo tecido, cor e iluminação da original.
