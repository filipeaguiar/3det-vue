## Context

Na visualização de campanhas (`CampanhaView.vue`), a interface é dividida em duas colunas: uma lista de campanhas na esquerda (`EntityListView.vue`) e os detalhes da campanha selecionada na direita (`CampaignDetailsView.vue`). Quando o usuário entra em modo de edição ou adição de nova campanha, a coluna da direita deve ser substituída pelo formulário (`CampaignForm.vue`).

No entanto, a lógica condicional no template de `CampanhaView.vue` está acoplada incorretamente:
```vue
<CampaignDetailsView v-if="selectedCampaign && !isEditMode" ... />
<CampaignForm v-else ... />
```
Isso faz com que o `CampaignForm` seja carregado sempre que `selectedCampaign` for `null`. Dado que `CampaignForm.vue` é renderizado como um modal em tela cheia com posicionamento `fixed inset-0`, ele obstrui toda a tela em estados como:
1. Durante a requisição assíncrona inicial de dados no carregamento da tela (onde a lista ainda está vazia).
2. Se a conta do usuário não possuir campanhas cadastradas (bloqueando totalmente o usuário e impedindo-o de usar o app).

Além disso, o design visual de `CampaignForm.vue` é rudimentar (cinza opaco `bg-gray-800`, inputs padrão, botões básicos e sem contraste adequado nos diferentes modos de cor da aplicação).

## Goals / Non-Goals

**Goals:**
- Corrigir a lógica de fluxo de tela em `CampanhaView.vue`, separando o modo de visualização e o modo de formulário através do estado `isEditMode`.
- Permitir que a própria visualização de detalhes (`CampaignDetailsView.vue`) lide graciosamente com o estado sem campanha ativa (exibindo um banner/placeholder centralizado moderno com orientações).
- Redesenhar por completo o `CampaignForm.vue` integrando a estética moderna do projeto: Glassmorphism translúcido, suporte completo a temas claro/escuro (Light/Dark mode) e efeitos interativos de foco refinados nas cores do tema 3DeT (Amber/Laranja).
- Adicionar um botão de ação "Editar Campanha" diretamente na barra de ações da `CampaignDetailsView.vue` para facilitar a edição.

**Non-Goals:**
- Mudar qualquer endpoint de API do backend (`/api/campaigns`) ou modificar a modelagem do banco de dados (SQLite/Supabase).
- Adicionar uploads de imagens para a campanha no escopo deste ajuste.

## Decisions

### 1. Separação de Estados Condicionais no CampanhaView
- **Abordagem**: Alterar o template para renderizar `CampaignDetailsView` se `!isEditMode`, e `CampaignForm` se `isEditMode`.
- **Justificativa**: `CampaignDetailsView` já possui em seu interior uma seção `v-else` dedicada para lidar com campanhas nulas (exibindo a mensagem *"Selecione uma Campanha na lista para ver os detalhes ou adicione uma nova"*). Ao remover a checagem de `selectedCampaign` do container pai, permitimos que essa mensagem amigável apareça em vez de renderizar o formulário diretamente em formato de modal.
- **Alternativa Considerada**: Manter o formulário em-place desabilitando as classes de modal fixed. No entanto, o design atual de formulários no app como Popovers/Modais centralizados oferece foco total ao fluxo de entrada de dados, o que é preferível no momento.

### 2. Modernização Estética do CampaignForm
- **Abordagem**: Implementar estilos de Glassmorphism e adaptar cores de acordo com o tema.
  - Container principal com fundo translúcido e desfoque (`bg-white/80 dark:bg-slate-900/80 backdrop-blur-md`).
  - Bordas discretas em vidro (`border border-slate-200/50 dark:border-slate-700/50`).
  - Inputs com transições dinâmicas de foco e anéis suaves (`focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500`).
  - Botão principal com gradiente animado e hover suave baseados em tons de Amber/Laranja.
- **Justificativa**: Cria um fluxo visual de altíssimo nível, alinhado à proposta modernizada da tela de login e de RPG premium.

### 3. Integração de Edição na Visualização de Detalhes
- **Abordagem**: Adicionar um botão "Editar Detalhes" com ícone de caneta na visualização de detalhes `CampaignDetailsView.vue` junto às ações de capítulos.
- **Justificativa**: Evita a necessidade de procurar o ícone minúsculo de caneta na lista de campanhas do painel lateral esquerdo, facilitando a edição intuitiva por parte do usuário.

## Risks / Trade-offs

- **[Risco]** Diferença visual pontual em relação a outros formulários menos estilizados (ex: `ChapterForm`).
  - *Mitigação*: Os estilos do formulário de campanhas serão isolados no escopo do componente para garantir segurança, e as novas classes Tailwind servirão como base recomendada para a futura padronização dos demais formulários.
