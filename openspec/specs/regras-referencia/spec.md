# 🎲 Referência de Regras e Ferramentas do Mestre

## Visão Geral
Grande parte da aplicação atua como um repositório rápido de referência do sistema 3DeT Victory, além de oferecer utilitários para facilitar o andamento do jogo na mesa (roladores de dados e geradores aleatórios). Toda esta seção não grava dados dos usuários no Supabase.

## Estado Atual

### Funcionalidades de Referência (Read-Only)
- **Busca de Regras** (`RegrasView.vue`): Navegador em abas que consulta as tabelas de referência puras (Perícias, Vantagens, Desvantagens, Técnicas). Suporta busca por texto parcial (mínimo de 3 caracteres) em todo o conteúdo simultaneamente.
- **Regras de Combate e Manobras** (`CombateView.vue`, `ManobrasView.vue`): Texto puramente estático no código `.vue`. Explica escalas de combate, distâncias, testes opostos e condições.

### Ferramentas Utilitárias
- **Dice Rollers**:
  - Simples (`HomeView.vue`): Rolagem rápida de 1D, 2D ou 3D com destaque para acertos críticos (6) e falhas críticas (1).
  - Avançado (`TestesView.vue`): Rolador complexo customizável (quantidade de dados e modificadores diretos). Validação de inputs garantida.
- **Gerador de NPCs** (`MestrandoView.vue`): Botão "Gerar NPC Aleatório" que constrói localmente, via arrays JavaScript no próprio componente, um conceito e um arquétipo para auxiliar o mestre em criação emergencial (ex: "Um Ciborgue... Cientista Louco"). Não salva os resultados gerados na DB.

### Arquitetura de Stores
- 4 stores dedicadas para carregar dados fixos do Supabase: `pericias.js`, `vantagens.js`, `desvantagens.js`, `tecnicas.js`.
- Carregamento na inicialização: Assim que acessado pela primeira vez, faz o Fetch completo da base de dados correspondente e guarda localmente.

## Problemas Conhecidos e Dívidas Técnicas

1. **Risco de XSS (Vulnerabilidade) em RegrasView**: A descrição das regras (buscadas do DB) passa por uma função `formatDescription` que injeta tags `<br>` e em seguida exibe esse conteúdo usando a diretiva `v-html`. Como não há biblioteca de sanitização (como o DOMPurify, apesar do componente MarkdownRenderer existir), qualquer inserção maliciosa nessas tabelas da base de dados será executada como código pelo navegador dos usuários (Stored XSS).
2. **Estilo Misto na Store**: A store `pericias.js` foi escrita usando o estilo "Composition API" do Pinia (`defineStore` com setup function), enquanto todas as outras lojas do projeto usam o formato "Options API". Inconsistência de código.
3. **Hardcoding de Texto Massivo**: `ManobrasView` e `CombateView` têm centenas de linhas de regras de jogo injetadas diretamente como `<template>`. Isso incha o bundle JS do componente desnecessariamente, em vez de importar os textos como JSON ou Markdown.
