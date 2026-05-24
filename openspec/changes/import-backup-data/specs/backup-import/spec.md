## ADDED Requirements

### Requirement: Validação pré-migração do usuário-alvo
O script DEVE verificar que o usuário `filipe_aac@yahoo.com` existe na tabela `users` do Turso antes de iniciar qualquer inserção de dados. O `user_id` DEVE ser resolvido dinamicamente por consulta SQL.

#### Scenario: Usuário existe no banco
- **WHEN** o script inicia e consulta `SELECT id FROM users WHERE email = 'filipe_aac@yahoo.com'`
- **THEN** o `user_id` retornado é armazenado e utilizado em todas as inserções subsequentes que requerem `user_id`

#### Scenario: Usuário não existe no banco
- **WHEN** o script inicia e a consulta retorna zero resultados
- **THEN** o script DEVE encerrar com código de erro e mensagem indicando que o usuário precisa ser registrado primeiro

### Requirement: Importação de dados globais de referência
O script DEVE importar as tabelas `vantagens`, `desvantagens`, `pericias` e `tecnicas` do backup como dados compartilhados entre todos os usuários, usando `INSERT OR IGNORE` para evitar duplicatas.

#### Scenario: Importação de vantagens
- **WHEN** o backup contém registros na tabela `public.vantagens`
- **THEN** cada registro é inserido na tabela `vantagens` do Turso com os campos `id`, `name`, `cost`, `description`, `requirements`

#### Scenario: Vantagem já existe no banco
- **WHEN** um registro de vantagem com o mesmo `id` já existe no Turso
- **THEN** o registro existente NÃO é sobrescrito (INSERT OR IGNORE)

#### Scenario: Importação de desvantagens
- **WHEN** o backup contém registros na tabela `public.desvantagens`
- **THEN** cada registro é inserido na tabela `desvantagens` do Turso com os campos `id`, `name`, `cost`, `description`

#### Scenario: Importação de perícias
- **WHEN** o backup contém registros na tabela `public.pericias`
- **THEN** cada registro é inserido na tabela `pericias` do Turso com os campos `id`, `name`, `description`

#### Scenario: Importação de técnicas
- **WHEN** o backup contém registros na tabela `public.tecnicas`
- **THEN** cada registro é inserido na tabela `tecnicas` do Turso com os campos `id`, `name`, `cost`, `description`, `duration`, `requirements`

### Requirement: Importação de campanhas e capítulos vinculados ao usuário
O script DEVE importar campanhas e capítulos do backup vinculando-os ao `user_id` do usuário `filipe_aac@yahoo.com`.

#### Scenario: Importação de campanhas
- **WHEN** o backup contém registros na tabela `public.campaigns`
- **THEN** cada campanha é inserida com `user_id` do usuário-alvo (substituindo o `user_id` original do backup)

#### Scenario: Importação de capítulos de campanha
- **WHEN** o backup contém registros na tabela `public.campaign_chapters`
- **THEN** cada capítulo é inserido mantendo o vínculo `campaign_id` original

### Requirement: Importação de entidades (personagens, NPCs, monstros) vinculadas ao usuário
O script DEVE importar personagens, NPCs e monstros do backup vinculando-os ao `user_id` do usuário `filipe_aac@yahoo.com`, incluindo todas as tabelas de junção.

#### Scenario: Importação de personagens com atributos
- **WHEN** o backup contém registros na tabela `public.personagens`
- **THEN** cada personagem é inserido com todos os atributos (name, archetype, concept, pontos, Habilidade, Poder, Resistencia, Pontos_Vida, Pontos_Acao, Pontos_Mana, image, campaign_id) e `user_id` do usuário-alvo

#### Scenario: Importação de tabelas de junção de personagens
- **WHEN** o backup contém registros em `personagens_vantagens`, `personagens_desvantagens`, `personagens_pericias`, `personagens_tecnicas`
- **THEN** cada vínculo é inserido preservando as chaves `personagem_id` e a chave da referência correspondente

#### Scenario: Importação de NPCs e monstros
- **WHEN** o backup contém registros nas tabelas `public.npcs` e `public.monstros`
- **THEN** cada entidade é inserida com os mesmos atributos dos personagens e `user_id` do usuário-alvo, incluindo suas respectivas tabelas de junção

### Requirement: Importação de sessões e sub-tabelas vinculadas ao usuário
O script DEVE importar sessões e todas as sub-tabelas associadas, vinculando ao `user_id` do usuário `filipe_aac@yahoo.com`.

#### Scenario: Importação de sessões
- **WHEN** o backup contém registros na tabela `public.sessions`
- **THEN** cada sessão é inserida com campos `title`, `description`, `comeco_forte`, `gancho_proxima_aventura`, `campaign_id` e `user_id` do usuário-alvo

#### Scenario: Importação de sub-tabelas de sessão
- **WHEN** o backup contém registros em `session_objetivos`, `session_ganchos_personagens`, `session_locais_interessantes`, `session_locais_caracteristicas`, `session_npcs_importantes`, `session_encontros_desafios`, `session_segredos_rumores`, `session_tesouros_recompensas`
- **THEN** cada registro é inserido preservando as chaves estrangeiras originais (`session_id`, `personagem_id`, `npc_id`, `local_id`)

### Requirement: Parsing correto do formato PostgreSQL COPY
O script DEVE extrair corretamente os dados dos blocos `COPY ... FROM stdin` do backup PostgreSQL.

#### Scenario: Decodificação de valores nulos
- **WHEN** um campo contém `\N` no backup
- **THEN** o valor é convertido para `null` no SQLite

#### Scenario: Decodificação de escapes
- **WHEN** um campo contém `\n`, `\t`, `\r`, ou `\\` no backup
- **THEN** os escapes são convertidos para os caracteres correspondentes (newline, tab, return, backslash)

### Requirement: Log de progresso e verificação final
O script DEVE exibir progresso durante a execução e contagens de verificação ao final.

#### Scenario: Log de progresso
- **WHEN** o script processa cada tabela
- **THEN** uma mensagem é exibida indicando a tabela sendo processada e o número de registros

#### Scenario: Verificação pós-migração
- **WHEN** a importação termina sem erros
- **THEN** o script exibe contagens totais de campanhas, capítulos, personagens, NPCs, monstros e sessões no banco Turso
