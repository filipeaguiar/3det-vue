## ADDED Requirements

### Requirement: Cache de Regras de Referência
O sistema SHALL carregar as regras de referência (Vantagens, Desvantagens, Perícias e Técnicas) apenas uma vez durante a sessão do usuário.

#### Scenario: Uso Repetitivo de Referências
- **WHEN** o usuário abre a tela de Regras pela primeira vez
- **THEN** o sistema SHALL carregar todas as bases de referência do Supabase
- **AND** SHALL marcar os stores correspondentes como "carregados"
- **WHEN** o usuário acessa a tela de Regras novamente ou abre o formulário de criação de personagens (que usa essas referências)
- **THEN** o sistema SHALL utilizar os dados em memória sem chamadas de rede adicionais
