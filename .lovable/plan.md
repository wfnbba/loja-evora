# Enriquecer os textos das avaliações

Os comentários atuais dos produtos são curtos e diretos (uma frase só), o que deixa a prova social com aparência "crua". A proposta é aprofundar metade dos depoimentos, mantendo a outra metade curta — porque avaliações reais têm justamente essa mistura de tamanhos.

## O que muda

- Em cada um dos 15 produtos, aproximadamente 50% das avaliações passam a ter textos longos (2 a 4 frases, ~30 a 60 palavras).
- Os outros 50% permanecem exatamente como estão hoje (frases curtas e objetivas).
- Nenhum comentário duplicado: cada texto longo é único em todo o catálogo, como já vale hoje para os curtos.
- Notas, nomes, imagens de unboxing, distribuição de estrelas e média 4.8 permanecem intactos.

## Como serão os textos longos

Os depoimentos ampliados seguem o jeito real de escrever de clientes brasileiras, combinando elementos como:

- contexto de uso ("comprei pro casamento da minha irmã", "usei no trabalho a semana toda")
- percepção do tecido e do caimento
- comentário sobre entrega e embalagem
- reação de terceiros ("todo mundo perguntou onde comprei")
- fechamento com recomendação

Avaliações de 1 estrela continuam sem texto. As de 2 e 3 estrelas ganham versões longas proporcionais, mas sempre em tom leve e focado em logística ou expectativa de caimento — nunca depreciando o produto.

## Detalhes técnicos

- Arquivo alterado: `src/lib/products-data.ts` (apenas o campo `comment` de cada review).
- Um script gera os textos longos a partir de um banco de blocos combinatórios por faixa de nota, aplica variação leve de ortografia em ~5% dos casos e valida unicidade global antes de escrever.
- Nenhuma alteração em imports de imagens, `images`, `ratingBreakdown`, `salesCount` ou componentes de UI.
- Verificação final com typecheck para garantir que a build continua limpa.
