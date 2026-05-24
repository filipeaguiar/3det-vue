## MODIFIED Requirements

### Requirement: Registro de Atividade de Sessões
**ESTADO ANTERIOR**: O sistema permite criar e gerenciar sessões manualmente.
**MUDANÇA**: Adicionar ponto de entrada para geração automática via IA.

#### Scenario: Início de Geração via IA
- **WHEN** o usuário está na tela de listagem de sessões
- **THEN** o sistema SHALL oferecer uma opção de "Gerar com IA"
- **AND** SHALL permitir que o resultado preencha o formulário de criação padrão para validação manual
