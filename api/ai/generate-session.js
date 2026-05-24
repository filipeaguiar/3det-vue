import { google } from '@ai-sdk/google';
import { streamObject } from 'ai';
import { z } from 'zod';
import { db } from '../_utils/db.js';
import { getUserFromReq } from '../_utils/auth.js';

export const config = {
  runtime: 'edge',
};

// Esquema Zod para a Sessão (espelhando o formulário e banco)
const sessionSchema = z.object({
  title: z.string().describe('Um título criativo para a sessão'),
  description: z.string().describe('Resumo geral da trama'),
  comeco_forte: z.string().describe('Uma cena de abertura impactante para prender os jogadores'),
  objetivos: z.array(z.object({
    description: z.string().describe('O que os heróis precisam alcançar'),
    completed: z.boolean().default(false)
  })).describe('Lista de 3 a 5 objetivos claros para a sessão'),
  ganchos_personagens: z.array(z.object({
    personagem_name: z.string().describe('Nome do personagem'),
    description: z.string().describe('Por que este herói se importa com esta aventura especificamente')
  })).describe('Ganchos individuais baseados nas motivações ou desvantagens dos heróis'),
  locais_interessantes: z.array(z.object({
    name: z.string().describe('Nome do local'),
    description: z.string().describe('Descrição visual evocativa'),
    caracteristicas: z.array(z.string()).describe('3 aspectos sensoriais ou mecânicos (ex: Cheiro de enxofre, Ruído de engrenagens)')
  })).describe('Cenários marcantes que serão visitados'),
  npcs_importantes: z.array(z.object({
    name: z.string().describe('Nome do NPC'),
    role: z.string().describe('Papel na trama (Aliado, Antagonista, etc)'),
    notes: z.string().describe('Personalidade ou segredo')
  })).describe('Personagens do mestre que terão destaque'),
  encontros_desafios: z.array(z.object({
    name: z.string().describe('Nome do desafio ou monstro'),
    description: z.string().describe('Descrição da situação'),
    mecanica: z.string().describe('Como resolver (Dificuldade de teste, stats simplificados)')
  })).describe('Conflitos, armadilhas ou combates'),
  segredos_rumores: z.array(z.object({
    description: z.string().describe('Um fato oculto que pode ser descoberto'),
    revealed: z.boolean().default(false)
  })).describe('10 segredos ou pistas para os jogadores descobrirem'),
  tesouros_recompensas: z.array(z.object({
    description: z.string().describe('Item mágico, moedas ou favores'),
    claimed: z.boolean().default(false)
  })).describe('Recompensas pelo sucesso'),
  gancho_proxima_aventura: z.string().describe('Uma ponta solta para a próxima sessão')
});

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const user = await getUserFromReq(req);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    const { campaignId, userInput, selectedNpcs, selectedMonstros } = await req.json();

    // 1. Coletar Contexto da Campanha
    const campaignResult = await db.execute({
      sql: 'SELECT name, description FROM campaigns WHERE id = ? AND user_id = ?',
      args: [campaignId, user.userId]
    });
    if (campaignResult.rows.length === 0) {
      return new Response(JSON.stringify({ error: 'Campaign not found' }), { status: 404 });
    }
    const campaign = campaignResult.rows[0];

    // 2. Coletar Diários (Resumos)
    const chaptersResult = await db.execute({
      sql: 'SELECT chapter_number, summary, content FROM campaign_chapters WHERE campaign_id = ? ORDER BY chapter_number ASC',
      args: [campaignId]
    });
    const chapters = chaptersResult.rows;
    const timeline = chapters.map(c => `Capítulo ${c.chapter_number}: ${c.summary || 'Sem resumo'}`).join('\n');
    const lastChapterProse = chapters.length > 0 ? chapters[chapters.length - 1].content : 'Nenhum capítulo registrado ainda.';

    // 3. Coletar Personagens (Ganchos)
    const charsResult = await db.execute({
      sql: 'SELECT name, concept, archetype FROM personagens WHERE campaign_id = ? OR campaign_id IS NULL AND user_id = ?',
      args: [campaignId, user.userId]
    });
    const characters = charsResult.rows.map(c => `- ${c.name} (${c.concept}, ${c.archetype})`).join('\n');

    // 4. Montar Prompt
    const systemPrompt = `Você é um Co-Mestre especialista no sistema de RPG 3DeT Victory.
Sua tarefa é gerar uma sessão de aventura estruturada e criativa.

CONTEXTO DA CAMPANHA:
Nome: ${campaign.name}
Descrição: ${campaign.description}

HISTÓRICO (LINHA DO TEMPO):
${timeline}

ÚLTIMO EVENTO (PROSA):
${lastChapterProse}

PERSONAGENS JOGADORES:
${characters}

DIRETIVAS DO MESTRE:
- Ideia Central: ${userInput}
- NPCs Obrigatórios: ${selectedNpcs?.map(n => `${n.name} (${n.role})`).join(', ') || 'Nenhum específico'}
- Monstros/Desafios Obrigatórios: ${selectedMonstros?.map(m => `${m.name} (${m.role})`).join(', ') || 'Nenhum específico'}

REGRAS DE GERAÇÃO:
1. Use o lore da campanha para manter a continuidade.
2. Crie ganchos específicos para as Desvantagens e Conceitos dos personagens.
3. Os NPCs e Monstros selecionados DEVEM ter papéis centrais conforme descrito.
4. O tom deve ser de aventura heróica (estilo 3DeT).
5. Retorne APENAS o objeto JSON conforme o esquema solicitado.`;

    const result = await streamObject({
      model: google('gemini-2.0-flash'),
      schema: sessionSchema,
      system: systemPrompt,
      prompt: `Gere a sessão baseada na ideia: ${userInput}`,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error('AI Generation Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), { status: 500 });
  }
}
