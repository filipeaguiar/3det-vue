## MODIFIED Requirements

### Requirement: Layout do AuthView
O sistema SHALL exibir o formulário de login e registro em uma interface dedicada e imersiva para o usuário.

#### Scenario: Visualização do AuthView
- **WHEN** o usuário não está autenticado e é redirecionado ou navega para a rota `/auth`
- **THEN** o sistema oculta a navegação superior (Header e Nav) do site
- **THEN** o sistema exibe a página em tela cheia (fullscreen) ocupando 100% da viewport (100vw e 100vh) sem margens
- **THEN** o sistema apresenta a imagem de plano de fundo do tema 3DeT (hero image)
- **THEN** o sistema exibe o formulário centralizado com um estilo _Glassmorphism_ translúcido que preserva a legibilidade independentemente do background
