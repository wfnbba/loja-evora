# Plano: Botão de Play Premium Estilo Évora

Adicionar um botão de play grande e sofisticado sobre os vídeos dos produtos para incentivar a interação, seguindo a estética minimalista e premium da marca Évora.

## Alterações

### Frontend

- **Componente de Página de Produto (`src/routes/produtos.$productId.tsx`)**
    - Envolver o elemento `<video>` em um container relativo.
    - Adicionar uma sobreposição (overlay) que aparece apenas quando o vídeo não está rodando.
    - Implementar o botão de play com ícone estilizado (usando `Play` da Lucide).
    - Adicionar animação suave de hover e transição ao clicar.
    - Garantir que o botão suma ao iniciar o vídeo.

## Detalhes Técnicos

- Utilizar `useRef` para controlar a reprodução do vídeo.
- Estado local para gerenciar a visibilidade do botão (baseado em `paused` do elemento de vídeo).
- Estilo: Fundo semi-transparente (blur), bordas finas, tipografia/ícones em dourado ou marrom Évora (#4a3f35).
- Responsividade: O botão deve ser centralizado e proporcional ao tamanho do container 9:16.

## Verificação

- [ ] Testar clique no botão inicia o vídeo.
- [ ] Verificar se o botão some durante a reprodução.
- [ ] Validar visual em dispositivos móveis (o container é 320px de largura).
