## Why

Atualmente, cada navegação no aplicativo dispara uma nova requisição de rede para buscar dados, mesmo que esses dados não tenham mudado. Isso resulta em uma experiência de usuário mais lenta, com carregamentos constantes (loading states) e carga desnecessária no backend/Supabase.

## What Changes

Implementar uma estratégia de cache nos stores do Pinia para persistir os dados carregados durante a sessão. Os dados só serão buscados novamente se o store estiver vazio ou se houver uma ação explícita de atualização (como após um salvamento ou deleção).

## Capabilities

### New Capabilities
- Nenhuma.

### Modified Capabilities
- `campanhas`: Adicionar requisito de persistência de dados entre navegações para evitar re-fetch.
- `entidades`: Adicionar requisito de persistência de dados para personagens, NPCs e monstros.
- `sessoes`: Adicionar requisito de persistência para os dados de sessões e capítulos.
- `regras-referencia`: Adicionar requisito de persistência para as regras de referência (Vantagens, Perícias, etc.), que raramente mudam.

## Impact

- **Pinia Stores**: Todos os stores relevantes (`campaigns`, `personagens`, `npcs`, `monstros`, `sessions`, `vantagens`, etc.) serão modificados.
- **Performance**: Transições de página quase instantâneas para dados já carregados.
- **Backend**: Redução significativa no número de leituras no Supabase.
- **UX**: Eliminação de estados de carregamento repetitivos.
