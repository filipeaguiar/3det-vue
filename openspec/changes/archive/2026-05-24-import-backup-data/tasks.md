## 1. Preparação e Validação

- [x] 1.1 Atualizar `migrate-backup.js`: remover UUID hardcoded e adicionar resolução dinâmica do `user_id` por email (`filipe_aac@yahoo.com`) consultando a tabela `users` no Turso
- [x] 1.2 Adicionar validação pré-migração: verificar que o usuário existe no banco e falhar com mensagem clara se não existir

## 2. Importação de Dados Globais de Referência

- [x] 2.1 Implementar importação da tabela `vantagens` com `INSERT OR IGNORE` (campos: id, name, cost, description, requirements)
- [x] 2.2 Implementar importação da tabela `desvantagens` com `INSERT OR IGNORE` (campos: id, name, cost, description)
- [x] 2.3 Implementar importação da tabela `pericias` com `INSERT OR IGNORE` (campos: id, name, description)
- [x] 2.4 Implementar importação da tabela `tecnicas` com `INSERT OR IGNORE` (campos: id, name, cost, description, duration, requirements)

## 3. Importação de Campanhas e Capítulos

- [x] 3.1 Implementar importação da tabela `campaigns` com `INSERT OR REPLACE`, substituindo `user_id` pelo ID do usuário-alvo
- [x] 3.2 Implementar importação da tabela `campaign_chapters` mantendo vínculo `campaign_id` original

## 4. Importação de Entidades

- [x] 4.1 Implementar importação de `personagens` com todos os atributos (Habilidade, Poder, Resistencia, PV, PA, PM, etc.) e `user_id` do usuário-alvo
- [x] 4.2 Implementar importação de `npcs` com mesma estrutura de personagens
- [x] 4.3 Implementar importação de `monstros` com mesma estrutura de personagens
- [x] 4.4 Implementar importação das tabelas de junção: `personagens_vantagens`, `personagens_desvantagens`, `personagens_pericias`, `personagens_tecnicas`
- [x] 4.5 Implementar importação das tabelas de junção: `npcs_vantagens`, `npcs_desvantagens`, `npcs_pericias`, `npcs_tecnicas`
- [x] 4.6 Implementar importação das tabelas de junção: `monstros_vantagens`, `monstros_desvantagens`, `monstros_pericias`, `monstros_tecnicas`

## 5. Importação de Sessões e Sub-tabelas

- [x] 5.1 Implementar importação da tabela `sessions` com `user_id` do usuário-alvo
- [x] 5.2 Implementar importação de `session_objetivos`, `session_ganchos_personagens`, `session_locais_interessantes`
- [x] 5.3 Implementar importação de `session_locais_caracteristicas`, `session_npcs_importantes`, `session_encontros_desafios`
- [x] 5.4 Implementar importação de `session_segredos_rumores`, `session_tesouros_recompensas`

## 6. Verificação e Execução

- [x] 6.1 Adicionar log de progresso detalhado por tabela (número de registros processados)
- [x] 6.2 Adicionar verificação pós-migração com contagens de todas as tabelas importadas
- [x] 6.3 Executar o script contra o banco Turso de produção e validar os resultados
