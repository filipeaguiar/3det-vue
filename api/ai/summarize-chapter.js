import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';
import { getUserFromReq } from '../_utils/auth.js';

export const config = {
  runtime: 'edge',
};

const summarySchema = z.object({
  summary: z.string().describe('Um resumo técnico estruturado contendo Personagens, NPCs e Eventos Chave')
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

    const { content } = await req.json();
    if (!content) {
      return new Response(JSON.stringify({ error: 'Content required' }), { status: 400 });
    }

    const { object } = await generateObject({
      model: google('gemini-2.0-flash'),
      schema: summarySchema,
      system: `Você é um arquivista de RPG. Seu trabalho é ler um texto em prosa de uma sessão e extrair um resumo técnico e conciso.
      
FORMATO DO RESUMO:
Personagens: [lista]
NPCs: [lista]
Eventos: [lista concisa de acontecimentos chave]

REGRAS:
- Seja extremamente conciso.
- Foque em fatos, não em estilo literário.
- Use no máximo 250 caracteres no total.`,
      prompt: `Resuma o seguinte capítulo de RPG: ${content}`,
    });

    return new Response(JSON.stringify(object), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Summarization Error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error', details: error.message }), { status: 500 });
  }
}
