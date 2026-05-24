## ADDED Requirements

### Requirement: Persistência de Dados de Campanhas em Memória
O sistema SHALL persistir os dados de campanhas carregados no store do Pinia durante a sessão do usuário, evitando requisições redundantes ao backend em cada mudança de rota.

#### Scenario: Carregamento de Campanhas com Cache
- **WHEN** o usuário acessa a tela de campanhas pela primeira vez
- **THEN** o sistema SHALL disparar uma requisição `GET /api/campaigns`
- **AND** SHALL marcar o store como "carregado" (`fetched = true`)
- **WHEN** o usuário navega para outra tela e retorna para a tela de campanhas
- **THEN** o sistema SHALL exibir os dados presentes no store sem disparar uma nova requisição de rede

### Requirement: Persistência de Capítulos em Memória
O sistema SHALL persistir os capítulos de diário de uma campanha carregados no store, evitando re-fetch ao trocar entre campanhas e retornar.

#### Scenario: Troca de Campanha e Cache de Capítulos
- **WHEN** o usuário seleciona uma campanha X e seus capítulos são carregados
- **THEN** o sistema SHALL armazenar esses capítulos vinculados ao ID da campanha
- **WHEN** o usuário seleciona a campanha X novamente após ter selecionado a campanha Y
- **THEN** o sistema SHALL exibir os capítulos de X instantaneamente se já estiverem em memória
