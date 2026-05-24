## ADDED Requirements

### Requirement: Persistência de Sessões em Memória
O sistema SHALL persistir a lista de sessões da campanha ativa em memória.

#### Scenario: Visualização de Sessões
- **WHEN** o usuário abre a tela de sessões para a Campanha Ativa
- **THEN** o sistema SHALL carregar os dados uma única vez e armazenar no store
- **WHEN** o usuário navega e retorna à tela de sessões da mesma campanha
- **THEN** o sistema SHALL exibir os dados cacheados
