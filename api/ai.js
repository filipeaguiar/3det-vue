import { google } from '@ai-sdk/google';
import { streamObject, generateObject } from 'ai';
import { z } from 'zod';
import { db } from './_utils/db-edge.js';
import { jwtVerify } from 'jose';

export const config = {
  runtime: 'edge',
};

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

// Esquema para a Sessão
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

// Esquema para o Resumo
const summarySchema = z.object({
  summary: z.string().describe('Um resumo técnico estruturado contendo Personagens, NPCs e Eventos Chave')
});

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  const { searchParams } = new URL(req.url);
  const action = searchParams.get('action');

  try {
    const token = req.headers.get('cookie')?.split('; ').find(c => c.startsWith('auth_token='))?.split('=')[1];
    if (!token) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

    const user = await jwtVerify(token, JWT_SECRET).then(v => v.payload).catch(() => null);
    if (!user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });

    // --- AÇÃO: GENERATE SESSION ---
    if (action === 'generate-session') {
      const { campaignId, userInput, selectedNpcs, selectedMonstros } = await req.json();

      const campaignResult = await db.execute({
        sql: 'SELECT name, description FROM campaigns WHERE id = ? AND user_id = ?',
        args: [campaignId, user.userId]
      });
      if (campaignResult.rows.length === 0) return new Response(JSON.stringify({ error: 'Campaign not found' }), { status: 404 });
      const campaign = campaignResult.rows[0];

      // Buscar Vilões Recorrentes
      const villainsResult = await db.execute({
        sql: 'SELECT name, villain_motives FROM npcs WHERE campaign_id = ? AND user_id = ? AND is_villain = 1',
        args: [campaignId, user.userId]
      });
      const villainsContext = villainsResult.rows.map(v => `- ${v.name}: ${v.villain_motives || 'Motivações ocultas'}`).join('
');

      const chaptersResult = await db.execute({
        sql: 'SELECT chapter_number, summary, content FROM campaign_chapters WHERE campaign_id = ? ORDER BY chapter_number ASC',
        args: [campaignId]
      });
      const chapters = chaptersResult.rows;
      const timeline = chapters.map(c => `Capítulo ${c.chapter_number}: ${c.summary || 'Sem resumo'}`).join('
');
      const lastChapterProse = chapters.length > 0 ? chapters[chapters.length - 1].content : 'Nenhum capítulo registrado ainda.';

      const charsResult = await db.execute({
        sql: 'SELECT name, concept, archetype FROM personagens WHERE campaign_id = ? OR campaign_id IS NULL AND user_id = ?',
        args: [campaignId, user.userId]
      });
      const characters = charsResult.rows.map(c => `- ${c.name} (${c.concept}, ${c.archetype})`).join('
');

      const systemPrompt = `Você é um Co-Mestre especialista no sistema de RPG 3DeT Victory. Sua tarefa é gerar uma sessão estruturada.
CONTEXTO DA CAMPANHA: Nome: ${campaign.name}, Descrição: ${campaign.description}
HISTÓRICO: ${timeline}
ÚLTIMO EVENTO: ${lastChapterProse}
PERSONAGENS: ${characters}
ANTAGONISTAS RECORRENTES E SEUS PLANOS:
${villainsContext || 'Nenhum vilão recorrente identificado ainda.'}

DIRETIVAS: Ideia: ${userInput}, NPCs: ${selectedNpcs?.map(n => `${n.name} (${n.role})`).join(', ')}, Monstros: ${selectedMonstros?.map(m => `${m.name} (${m.role})`).join(', ')}
Retorne APENAS o JSON conforme esquema.`;

      const result = await streamObject({
        model: google('gemini-2.5-flash-lite'),
        schema: sessionSchema,
        system: systemPrompt,
        prompt: `Gere a sessão: ${userInput}`,
      });

      return result.toTextStreamResponse();
    }

    // --- AÇÃO: SUMMARIZE CHAPTER ---
    if (action === 'summarize-chapter') {
      const { content, campaignId } = await req.json();
      if (!content) return new Response(JSON.stringify({ error: 'Content required' }), { status: 400 });

      let entityContext = '';
      if (campaignId) {
        const chars = await db.execute({
          sql: 'SELECT name FROM personagens WHERE campaign_id = ? OR campaign_id IS NULL AND user_id = ?',
          args: [campaignId, user.userId]
        });
        const npcs = await db.execute({
          sql: 'SELECT name, is_villain FROM npcs WHERE campaign_id = ? AND user_id = ?',
          args: [campaignId, user.userId]
        });
        const villains = npcs.rows.filter(n => n.is_villain === 1).map(n => n.name);
        const regularNpcs = npcs.rows.filter(n => n.is_villain !== 1).map(n => n.name);
        
        entityContext = `
PERSONAGENS CONHECIDOS: ${chars.rows.map(c => c.name).join(', ')}
NPCS CONHECIDOS: ${regularNpcs.join(', ')}
ANTAGONISTAS CONHECIDOS: ${villains.join(', ')}`;
      }

      const { object } = await generateObject({
        model: google('gemini-2.5-flash-lite'),
        schema: summarySchema,
        system: `Você é um arquivista técnico de RPG. Seu trabalho é converter prosa em dados narrativos concisos.
      
CONTEÚDO PARA REFERÊNCIA:${entityContext}

FORMATO OBRIGATÓRIO:
Personagens: [Lista de Heróis presentes na cena]
NPCs: [Lista de coadjuvantes/vilões presentes na cena. Se for um antagonista conhecido, destaque-o]
Eventos: [Tópicos dos fatos que mudaram o mundo ou a história]

REGRAS:
- Priorize identificar ações ou menções aos Antagonistas Conhecidos.
- Use os nomes dos personagens conhecidos fornecidos se eles aparecerem na prosa.
- Não use estilo literário.
- Seja direto e factual.
- Máximo 250 caracteres.`,
        prompt: `Extraia os dados técnicos deste capítulo: ${content}`,
      });

      return new Response(JSON.stringify(object), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });
  } catch (error) {
    console.error('AI Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), { status: 500 });
  }
}
