## 1. Stores de Regras de Referência

- [x] 1.1 Adicionar flag `fetched` aos stores `vantagens.js`, `desvantagens.js`, `pericias.js` e `tecnicas.js`
- [x] 1.2 Implementar guarda `if (this.fetched) return;` nas ações de `fetch` desses stores
- [x] 1.3 Garantir que a flag `fetched` seja setada para `true` após sucesso no carregamento

## 2. Store de Campanhas

- [x] 2.1 Adicionar flag `fetched` ao store `campaigns.js`
- [x] 2.2 Implementar guarda no `fetchCampaigns`
- [x] 2.3 Atualizar `addCampaign`, `updateCampaign` e `deleteCampaign` para manter o cache válido (ou resetar `fetched = false`)
- [x] 2.4 Adicionar suporte a cache no `campaignChapters.js`, considerando a troca de `campaignId`

## 3. Stores de Entidades

- [x] 3.1 Adicionar flag `fetched` e guardas aos stores `personagens.js`, `npcs.js` e `monstros.js`
- [x] 3.2 Garantir que a troca de `campaignId` no `fetch...` invalide o cache se necessário (ou use cache por campanha)
- [x] 3.3 Atualizar ações de escrita (Add/Update/Delete) para refletir mudanças no estado local sem quebrar o cache

## 4. Store de Sessões

- [x] 4.1 Adicionar flag `fetched` e guarda ao store `sessions.js`
- [x] 4.2 Garantir consistência dos dados ao navegar entre sessões de diferentes campanhas

## 5. Testes Manuais e Validação

- [ ] 5.1 Verificar no console/network se as requisições param de ocorrer ao navegar entre páginas já visitadas
- [ ] 5.2 Confirmar que a criação de novos itens aparece na lista sem precisar de refresh manual da página
- [ ] 5.3 Validar se as edições são refletidas instantaneamente na visualização (cache update)
