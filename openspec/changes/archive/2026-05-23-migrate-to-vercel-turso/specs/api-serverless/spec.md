## ADDED Requirements

### Requirement: Camada de API Intermediária
O sistema DEVE possuir uma camada de backend (Vercel Serverless Functions em `/api`) que recebe requisições do frontend e consulta o banco de dados Turso. Nenhuma conexão de banco deve ocorrer no frontend.

#### Scenario: Consulta segura de banco (RLS via Backend)
- **WHEN** uma requisição de leitura ou gravação chega a um endpoint da API (ex: `/api/personagens`)
- **THEN** a API extrai o `userId` validado a partir do token de sessão (cookie) e restringe ativamente as queries SQL para que operem ou retornem apenas registros do usuário logado.

### Requirement: Transações Atômicas
Operações de atualização que afetem tabelas múltiplas (exemplo: salvar um personagem e suas dezenas de tabelas de junção como `personagens_pericias`) DEVEM ser envolvidas em uma Transação SQL no lado do servidor.

#### Scenario: Falha parcial de escrita em tabelas de relacionamento
- **WHEN** ocorre um erro de banco ou de validação ao inserir itens em uma relação n:m durante a edição
- **THEN** a transação sofre `ROLLBACK`, garantindo que os dados prévios da entidade não fiquem apagados nem em estado inconsistente.
