## ADDED Requirements

### Requirement: Substituição do Provedor de Armazenamento
O sistema DEVE usar o serviço Vercel Blob (ou equivalente fornecido nativamente via Vercel Edge) para o upload de avatares e imagens de campanha, removendo referências ao Supabase Storage.

#### Scenario: Upload de imagem de personagem
- **WHEN** o usuário faz upload da foto pelo componente `ImageUpload` em uma entidade (Personagem, NPC ou Monstro)
- **THEN** o frontend dispara uma requisição POST para `/api/upload` (em vez de usar SDK local), que fará upload da imagem para o Blob e retornará a URL pública final para ser gravada no banco de dados.
