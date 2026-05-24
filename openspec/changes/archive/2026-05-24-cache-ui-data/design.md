## Context

O aplicativo utiliza Pinia para gerenciamento de estado. Atualmente, as ações de busca (`fetch`) nos stores são chamadas toda vez que um componente é montado ou uma rota muda, resultando em requisições de rede redundantes. Como o estado do Pinia é mantido na memória enquanto a página não for recarregada, podemos aproveitar esse estado para evitar chamadas extras ao Supabase.

## Goals / Non-Goals

**Goals:**
- Adicionar lógica de verificação de cache em todos os stores de dados (`campaigns`, `personagens`, `npcs`, `monstros`, `sessions`, `vantagens`, `desvantagens`, `pericias`, `tecnicas`).
- Garantir que dados recém-criados ou editados sejam refletidos corretamente sem quebrar o cache.
- Implementar um mecanismo simples de invalidação de cache para atualizações manuais.

**Non-Goals:**
- Persistência offline (Service Workers ou IndexedDB).
- Persistência entre recarregamentos de página (localStorage). O cache deve ser limpo se o usuário der F5.
- Sincronização em tempo real via WebSockets (fora de escopo para esta melhoria de performance).

## Decisions

### 1. Adição de flag `fetched` no estado
Cada store terá uma propriedade `fetched: boolean` inicializada como `false`.
- **Racional**: Verificar apenas se a lista de dados está vazia (`length === 0`) não é suficiente, pois uma campanha pode legitimamente não ter personagens, o que causaria fetch infinito em cada navegação.

### 2. Guardas nas ações de `fetch`
As ações de busca (ex: `fetchCampaigns`) começarão com uma verificação: `if (this.fetched) return;`.
- **Racional**: Simplicidade. O Pinia já mantém os dados; se já buscamos uma vez, não precisamos buscar de novo a menos que seja solicitado.

### 3. Invalidação Automática em Escritas
Ações que modificam dados (`add...`, `update...`, `delete...`) continuarão atualizando o estado local. Se o backend retornar o objeto completo, o store será atualizado cirurgicamente. Se não, a flag `fetched` pode ser resetada para `false` para forçar um refresh na próxima navegação, ou a lista pode ser re-buscada imediatamente.
- **Decisão**: Preferencialmente atualizar a lista local para manter o cache válido e a UI responsiva.

## Risks / Trade-offs

- **Dados Obsoletos**: Se os dados mudarem no banco de dados por outro meio (ou outra aba), o usuário não verá a mudança até atualizar a página ou realizar uma ação de escrita.
  - **Mitigação**: O impacto é baixo para um "Escudo do Mestre" que geralmente é usado por uma única pessoa por vez. No futuro, podemos adicionar um botão de "Sincronizar".
- **Memória**: Manter muitos dados em memória pode aumentar o consumo de RAM do navegador.
  - **Mitigação**: Os dados de RPG (texto e números) são extremamente leves. Imagens não são cacheadas em memória (apenas suas URLs).
