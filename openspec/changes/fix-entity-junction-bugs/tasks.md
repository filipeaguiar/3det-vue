## 1. Ajustes no Backend (Relacionamentos com Joins e Retrocompatibilidade)

- [x] 1.1 Atualizar `/api/entities/[type]/index.js` para buscar os relacionamentos (vantagens, desvantagens, perícias e técnicas) realizando `JOIN` com as respectivas tabelas de referência para recuperar nome, custo e descrição.
- [x] 1.2 No mesmo arquivo (`index.js`), formatar as respostas JSON das entidades de modo a expor tanto as propriedades diretas (`vantagens`, `desvantagens`, etc.) quanto injetar dinamicamente as propriedades aninhadas legadas de retrocompatibilidade (ex: `personagens_vantagens` contendo a chave `vantagens: { name }`).
- [x] 1.3 Atualizar `/api/entities/[type]/[id].js` (método GET) com a mesma lógica de Joins e mapeamento de chaves de retrocompatibilidade.
- [x] 1.4 Garantir que o método PUT em `/api/entities/[type]/[id].js` lide com a persistência de forma robusta e limpe/reinsira os dados a partir das propriedades corretas recebidas.

## 2. Ajustes de Mapeamento no Frontend (Fichas e Edição)

- [x] 2.1 Modificar o arquivo `src/components/EntityDetailsView.vue` para importar `computed` e implementar propriedades computadas dinâmicas (`vantagensList`, `desvantagensList`, `periciasList`, `tecnicasList`) que resolvem os relacionamentos de forma agnóstica de tipo e retrocompatível.
- [x] 2.2 Atualizar o `<template>` de `EntityDetailsView.vue` para renderizar as listas a partir das novas computed properties unificadas (removendo as propriedades estáticas `personagens_vantagens`, etc.).
- [x] 2.3 Ajustar o `watch` de carregamento de entidade em `src/components/EntityForm.vue` para mapear os relacionamentos de forma robusta a partir de fallbacks caso as chaves específicas de tipo venham nulas ou vazias.
