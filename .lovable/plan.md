# Plano de Alteração de Nome da Loja

O usuário solicitou a alteração do nome da loja de "Évora Luxury Store" para "Loja Évora".

## Alterações Propostas

### Frontend

- **src/components/cart/checkout-overlay.tsx**:
    - Alterar o texto "Évora Luxury Store" para "Loja Évora" no cabeçalho do checkout (linha 220).

### Documentação / Memória

- Já atualizei a memória do projeto em `mem://index.md` e criei `mem://preference/store-name-update.md`.

## Verificação

- Após a alteração, farei uma busca global (grep) para garantir que não restaram referências a "Évora Luxury Store".
