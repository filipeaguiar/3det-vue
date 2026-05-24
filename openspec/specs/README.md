# 📜 3DeT Victory — Escudo do Mestre Digital

## Visão Geral

Aplicação web para Game Masters do RPG **3DeT Victory** (sistema brasileiro de RPG de mesa). Funciona como um "Escudo do Mestre Digital" — ferramenta completa para planejar e gerenciar campanhas, sessões, personagens, NPCs, monstros e combate.

## Mapa de Specs

```
openspec/specs/
├── README.md                  ← Este arquivo (visão geral)
├── autenticacao/spec.md       ← Autenticação e autorização
├── campanhas/spec.md          ← Gerenciamento de campanhas e capítulos
├── entidades/spec.md          ← Personagens, NPCs e Monstros
├── sessoes/spec.md            ← Planejamento e gestão de sessões
├── regras-referencia/spec.md  ← Referência de regras, dados e ferramentas do mestre
├── infraestrutura/spec.md     ← Arquitetura técnica e infraestrutura
└── modelo-dados/spec.md       ← Modelo de dados completo (PostgreSQL/Supabase)
```

## Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (Vue 3 + Vite)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │ Campanha │  │Entidades │  │ Sessões  │   │
│  │  View    │  │  View    │  │  Views   │  │  View    │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │              │             │              │         │
│  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐  ┌────┴─────┐   │
│  │   Auth   │  │Campaign  │  │ Entity   │  │ Session  │   │
│  │  Store   │  │ Stores   │  │ Stores   │  │  Store   │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┴─────┘   │
│       │              │             │              │         │
│  ┌────┴──────────────┴─────────────┴──────────────┴─────┐   │
│  │              Supabase Client Service                  │   │
│  └───────────────────────┬───────────────────────────────┘   │
│                          │                                   │
├──────────────────────────┼───────────────────────────────────┤
│  Referência de Regras    │   (CombateView, ManobrasView,    │
│  (sem estado/DB)         │    MestrandoView, HomeView,      │
│                          │    TestesView, RegrasView)        │
└──────────────────────────┼───────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │  Supabase   │
                    ├─────────────┤
                    │ • Auth      │
                    │ • PostgreSQL│
                    │ • Storage   │
                    │ • RLS       │
                    └─────────────┘
```

## Stack Tecnológica

| Camada       | Tecnologia                      | Versão |
|-------------|--------------------------------|--------|
| Framework   | Vue 3 (Composition API)        | 3.5    |
| Build       | Vite                           | 7.0    |
| CSS         | Tailwind CSS                   | 4.1    |
| Estado      | Pinia                          | 3.0    |
| Roteamento  | Vue Router                     | 4.5    |
| Backend     | Supabase (Auth + PostgreSQL)   | 2.50   |
| Ícones      | Font Awesome                   | 6.7    |
| Markdown    | marked                         | 16.0   |
| IDs         | uuid                           | 11.1   |

## Domínio: 3DeT Victory

O **3DeT Victory** (3 Dados e Testes) é um sistema de RPG brasileiro criado por Marcelo Cassaro. Características principais:

- **3 Atributos**: Poder (P), Habilidade (H), Resistência (R) — escala 0-5
- **Stats Derivados**: PV = 5×R, PM = 5×H, PA = 1×P
- **Testes**: 1d6/2d6/3d6 + atributo vs dificuldade
- **Mecânicas de Construção**: Vantagens (+custo), Desvantagens (-custo), Perícias, Técnicas
- **Orçamento**: 10 pontos padrão, até -2 em desvantagens
- **Escala de Dificuldade**: Fácil (6+), Média (9+), Difícil (15+), Lendária (18+)

## Status do Projeto

| Área | Estado | Notas |
|------|--------|-------|
| Autenticação | ✅ Funcional | Email/senha básico |
| Campanhas | ✅ Funcional | CRUD completo + capítulos |
| Personagens | ⚠️ Parcial | Bugs na integração de imagem e detalhes |
| NPCs | ⚠️ Parcial | Mesmos bugs de personagens |
| Bestiário | ⚠️ Parcial | Mesmos bugs de personagens |
| Sessões | ⚠️ Parcial | Store bypassado, form complexo |
| Referência de Regras | ✅ Funcional | Busca e navegação |
| Dados/Testes | ✅ Funcional | Rolador de dados básico e avançado |
| Ferramentas do Mestre | ✅ Funcional | Gerador de NPC simples |
| Combate | ✅ Funcional | Apenas referência estática |
| PWA | ❌ Desativado | Comentado no vite.config.js |
| Testes Automatizados | ❌ Inexistente | Nenhum teste |

## Dívidas Técnicas Críticas

1. **Duplicação massiva** — Stores e views de personagens/npcs/monstros são ~95% idênticos
2. **ImageUpload quebrado** — Props/eventos incompatíveis com EntityForm
3. **EntityDetailsView quebrado** — Hardcoda nomes de relação 'personagens_*', não funciona para NPCs/monstros
4. **SessionDetailsView bypassa Pinia** — Queries Supabase direto no componente
5. **XSS** — MarkdownRenderer e RegrasView usam v-html sem sanitização
6. **Conflito Font Awesome** — Carregado via CDN E JS library simultaneamente
7. **fetchUser() em toda navegação** — Chamada de rede a cada troca de rota
8. **Delete-and-reinsert sem transação** — Risco de dados órfãos
