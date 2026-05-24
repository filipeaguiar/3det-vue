## ADDED Requirements

### Requirement: Persistência de Entidades em Memória
O sistema SHALL persistir os dados de Personagens, NPCs e Monstros em seus respectivos stores do Pinia, evitando re-fetch em cada mudança de rota.

#### Scenario: Navegação entre Telas de Entidades
- **WHEN** o usuário carrega a lista de Personagens
- **THEN** o sistema SHALL marcar o store de personagens como "carregado"
- **WHEN** o usuário navega para NPCs e volta para Personagens
- **THEN** o sistema SHALL exibir a lista de Personagens instantaneamente sem requisição de rede
