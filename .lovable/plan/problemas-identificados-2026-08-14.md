---
title: Otimização de Performance Évora
description: Plano para atingir 99+ no PageSpeed corrigindo LCP, imagens pesadas e bloqueio de renderização.
---

## Problemas Identificados
O PageSpeed reporta 66% de performance com os seguintes gargalos:
1. **LCP (Largest Contentful Paint) crítico**: 21.5s (causado por imagens de ~3MB carregadas sem otimização).
2. **Payload de rede enorme**: 32MB total (imagens PNG/JPG não comprimidas).
3. **Imagens sem dimensões explícitas**: Causa instabilidade no layout.
4. **Recursos que bloqueiam a renderização**: Scripts da Wistia no head sem tratamento.

## Ações de Otimização

### 1. Otimização de Imagens (Crítico)
- **Compressão**: Converter e comprimir todas as imagens para formatos modernos (WebP/AVIF) via pipeline Lovable Assets (onde possível) ou ajuste de carregamento.
- **Prioridade (LCP)**: Marcar as imagens de hero (seção inicial) com `fetchpriority="high"` e `loading="eager"`.
- **Dimensões**: Adicionar atributos `width` e `height` em todas as tags `<img>` para reservar espaço e evitar CLS.

### 2. Melhoria do Caminho Crítico
- **Scripts Wistia**: Mover scripts da Wistia para o final do body ou usar `defer` para não bloquear o FCP (First Contentful Paint).
- **CSS Inline**: Verificar se há CSS crítico que pode ser inalinhado.

### 3. Ajustes de Código
- **Componentes de Imagem**: Criar um componente `<OptimizedImage />` para padronizar o uso de lazy loading e dimensões.
- **Remover Redundâncias**: Limpar imports e estilos não utilizados.

## Verificação
- Rodar novo teste de PageSpeed após as alterações.
- Monitorar o tempo de LCP no console do navegador.
