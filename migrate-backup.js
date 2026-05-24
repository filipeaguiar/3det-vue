import fs from 'fs';
import path from 'path';
import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const TURSO_DATABASE_URL = process.env.TURSO_DATABASE_URL || 'file:local.db';
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;
const TARGET_EMAIL = 'filipe_aac@yahoo.com.br';

console.log('--- Iniciando Preparação para Importação de Backup ---');
if (TURSO_AUTH_TOKEN) {
    console.log('Autenticação via Turso Token configurada.');
}

const db = createClient({
    url: TURSO_DATABASE_URL,
    authToken: TURSO_AUTH_TOKEN,
});

// Decodifica valores com escape do PostgreSQL
function decodePgValue(val) {
    if (val === '\\N' || val === undefined || val === null) {
        return null;
    }
    // Substitui escapes comuns
    let s = val;
    s = s.replace(/\\n/g, '\n');
    s = s.replace(/\\t/g, '\t');
    s = s.replace(/\\r/g, '\r');
    s = s.replace(/\\\\/g, '\\');
    return s;
}

// Converte string de pontos (ex: "12pt" ou "12") para inteiro
function parsePontos(val) {
    const decoded = decodePgValue(val);
    if (!decoded) return null;
    const num = parseInt(decoded.replace(/pt/i, '').trim(), 10);
    return isNaN(num) ? null : num;
}

// Converte strings de inteiros genéricos
function parseIntValue(val, defaultValue = 0) {
    const decoded = decodePgValue(val);
    if (!decoded) return defaultValue;
    const num = parseInt(decoded, 10);
    return isNaN(num) ? defaultValue : num;
}

async function runMigration() {
    try {
        const backupPath = path.resolve(process.cwd(), 'db_cluster-04-09-2025@03-12-59.backup');
        if (!fs.existsSync(backupPath)) {
            throw new Error(`Arquivo de backup não encontrado em: ${backupPath}`);
        }

        console.log('Lendo arquivo de backup...');
        const backupContent = fs.readFileSync(backupPath, 'utf-8');
        const lines = backupContent.split(/\r?\n/);
        console.log(`Backup lido com sucesso. Total de linhas: ${lines.length}`);

        console.log(`Validando usuário alvo: ${TARGET_EMAIL}...`);
        const userRes = await db.execute({
            sql: 'SELECT id FROM users WHERE email = ?',
            args: [TARGET_EMAIL]
        });

        if (userRes.rows.length === 0) {
            console.error(`ERRO: Usuário alvo (${TARGET_EMAIL}) não encontrado no banco de dados.`);
            console.error('Por favor, registre o usuário primeiro usando o fluxo normal de registro na aplicação.');
            process.exit(1);
        }

        const TARGET_USER_ID = userRes.rows[0].id;
        console.log(`Usuário encontrado. ID alvo: ${TARGET_USER_ID}`);

        const tablesData = {};
        let currentTable = null;
        let currentColumns = [];

        console.log('Iniciando parsing do arquivo de backup...');
        // Regex para capturar linhas de início de COPY
        const copyRegex = /^COPY\s+public\.(\w+)\s+\((.+?)\)\s+FROM\s+stdin;/i;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            if (currentTable) {
                if (line.trim() === '\\.') {
                    // Fim do bloco de dados da tabela atual
                    console.log(`Parsed ${tablesData[currentTable].length} registros para a tabela public.${currentTable}`);
                    currentTable = null;
                    currentColumns = [];
                } else {
                    const rowValues = line.split('\t');
                    const record = {};
                    for (let colIdx = 0; colIdx < currentColumns.length; colIdx++) {
                        const colName = currentColumns[colIdx];
                        record[colName] = rowValues[colIdx];
                    }
                    tablesData[currentTable].push(record);
                }
            } else {
                const match = line.match(copyRegex);
                if (match) {
                    currentTable = match[1];
                    const columnsStr = match[2];
                    currentColumns = columnsStr.split(',').map(s => s.trim().replace(/"/g, ''));
                    tablesData[currentTable] = [];
                    console.log(`Encontrado bloco COPY para a tabela: public.${currentTable} com colunas: [${currentColumns.join(', ')}]`);
                }
            }
        }

        console.log('\n--- Início do Povoamento do Banco SQLite/Turso ---');

        // FASE 1: Importar tabelas de referência com INSERT OR IGNORE
        // Isto assegura que chaves estrangeiras de vantagens, desvantagens, etc., existam.
        if (tablesData.vantagens) {
            console.log('Povoando vantagens (INSERT OR IGNORE)...');
            for (const item of tablesData.vantagens) {
                await db.execute({
                    sql: 'INSERT OR IGNORE INTO vantagens (id, name, cost, description, requirements) VALUES (?, ?, ?, ?, ?)',
                    args: [
                        decodePgValue(item.id),
                        decodePgValue(item.name) || 'Vantagem Sem Nome',
                        decodePgValue(item.cost),
                        decodePgValue(item.description),
                        decodePgValue(item.requirements)
                    ]
                });
            }
        }

        if (tablesData.desvantagens) {
            console.log('Povoando desvantagens (INSERT OR IGNORE)...');
            for (const item of tablesData.desvantagens) {
                await db.execute({
                    sql: 'INSERT OR IGNORE INTO desvantagens (id, name, cost, description) VALUES (?, ?, ?, ?)',
                    args: [
                        decodePgValue(item.id),
                        decodePgValue(item.name) || 'Desvantagem Sem Nome',
                        decodePgValue(item.cost),
                        decodePgValue(item.description)
                    ]
                });
            }
        }

        if (tablesData.pericias) {
            console.log('Povoando pericias (INSERT OR IGNORE)...');
            for (const item of tablesData.pericias) {
                await db.execute({
                    sql: 'INSERT OR IGNORE INTO pericias (id, name, description) VALUES (?, ?, ?)',
                    args: [
                        decodePgValue(item.id),
                        decodePgValue(item.name) || 'Perícia Sem Nome',
                        decodePgValue(item.description)
                    ]
                });
            }
        }

        if (tablesData.tecnicas) {
            console.log('Povoando tecnicas (INSERT OR IGNORE)...');
            for (const item of tablesData.tecnicas) {
                await db.execute({
                    sql: 'INSERT OR IGNORE INTO tecnicas (id, name, cost, description, duration, requirements) VALUES (?, ?, ?, ?, ?, ?)',
                    args: [
                        decodePgValue(item.id),
                        decodePgValue(item.name) || 'Técnica Sem Nome',
                        decodePgValue(item.cost),
                        decodePgValue(item.description),
                        decodePgValue(item.duration),
                        decodePgValue(item.requirements)
                    ]
                });
            }
        }

        // FASE 2: Importar Campanhas
        if (tablesData.campaigns) {
            console.log('Povoando campaigns...');
            for (const item of tablesData.campaigns) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO campaigns (id, name, description, user_id, created_at) VALUES (?, ?, ?, ?, ?)',
                    args: [
                        decodePgValue(item.id),
                        decodePgValue(item.name) || 'Campanha Sem Nome',
                        decodePgValue(item.description),
                        TARGET_USER_ID, // Override para associar ao usuário ativo
                        decodePgValue(item.created_at) || new Date().toISOString()
                    ]
                });
            }
        }

        if (tablesData.campaign_chapters) {
            console.log('Povoando campaign_chapters...');
            for (const item of tablesData.campaign_chapters) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO campaign_chapters (id, campaign_id, chapter_number, content, created_at) VALUES (?, ?, ?, ?, ?)',
                    args: [
                        decodePgValue(item.id),
                        decodePgValue(item.campaign_id),
                        parseIntValue(item.chapter_number, 1),
                        decodePgValue(item.content),
                        decodePgValue(item.created_at) || new Date().toISOString()
                    ]
                });
            }
        }

        // FASE 3: Entidades Principais
        // Guardamos mapas de IDs -> Nomes para ajudar na correspondência das sessões depois
        const characterIdMap = {};
        const npcIdMap = {};

        if (tablesData.personagens) {
            console.log('Povoando personagens...');
            for (const item of tablesData.personagens) {
                const id = decodePgValue(item.id);
                const name = decodePgValue(item.name);
                characterIdMap[name] = id;

                await db.execute({
                    sql: `INSERT OR REPLACE INTO personagens (
                        id, name, archetype, concept, pontos, Habilidade, Poder, Resistencia, 
                        Pontos_Vida, Pontos_Acao, Pontos_Mana, image, campaign_id, user_id, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    args: [
                        id,
                        name || 'Personagem Sem Nome',
                        decodePgValue(item.archetype),
                        decodePgValue(item.concept),
                        parsePontos(item.pontos),
                        parseIntValue(item.Habilidade, 0),
                        parseIntValue(item.Poder, 0),
                        parseIntValue(item.Resistencia, 0),
                        parseIntValue(item.Pontos_Vida, 1),
                        parseIntValue(item.Pontos_Acao, 1),
                        parseIntValue(item.Pontos_Mana, 1),
                        decodePgValue(item.image),
                        decodePgValue(item.campaign_id),
                        TARGET_USER_ID, // Override
                        new Date().toISOString()
                    ]
                });
            }
        }

        if (tablesData.npcs) {
            console.log('Povoando npcs...');
            for (const item of tablesData.npcs) {
                const id = decodePgValue(item.id);
                const name = decodePgValue(item.name);
                npcIdMap[name] = id;

                await db.execute({
                    sql: `INSERT OR REPLACE INTO npcs (
                        id, name, archetype, concept, pontos, Habilidade, Poder, Resistencia, 
                        Pontos_Vida, Pontos_Acao, Pontos_Mana, image, campaign_id, user_id, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    args: [
                        id,
                        name || 'NPC Sem Nome',
                        decodePgValue(item.archetype),
                        decodePgValue(item.concept),
                        parsePontos(item.pontos),
                        parseIntValue(item.Habilidade, 0),
                        parseIntValue(item.Poder, 0),
                        parseIntValue(item.Resistencia, 0),
                        parseIntValue(item.Pontos_Vida, 1),
                        parseIntValue(item.Pontos_Acao, 1),
                        parseIntValue(item.Pontos_Mana, 1),
                        decodePgValue(item.image),
                        decodePgValue(item.campaign_id),
                        TARGET_USER_ID, // Override
                        new Date().toISOString()
                    ]
                });
            }
        }

        if (tablesData.monstros) {
            console.log('Povoando monstros...');
            for (const item of tablesData.monstros) {
                await db.execute({
                    sql: `INSERT OR REPLACE INTO monstros (
                        id, name, archetype, concept, pontos, Habilidade, Poder, Resistencia, 
                        Pontos_Vida, Pontos_Acao, Pontos_Mana, image, campaign_id, user_id, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    args: [
                        decodePgValue(item.id),
                        decodePgValue(item.name) || 'Monstro Sem Nome',
                        decodePgValue(item.archetype),
                        decodePgValue(item.concept),
                        parsePontos(item.pontos),
                        parseIntValue(item.Habilidade, 0),
                        parseIntValue(item.Poder, 0),
                        parseIntValue(item.Resistencia, 0),
                        parseIntValue(item.Pontos_Vida, 1),
                        parseIntValue(item.Pontos_Acao, 1),
                        parseIntValue(item.Pontos_Mana, 1),
                        decodePgValue(item.image),
                        decodePgValue(item.campaign_id),
                        TARGET_USER_ID, // Override
                        new Date().toISOString()
                    ]
                });
            }
        }

        // FASE 4: Tabelas de Junção (Junction Tables)
        
        // Personagens Junções
        if (tablesData.personagens_vantagens) {
            console.log('Povoando personagens_vantagens...');
            for (const item of tablesData.personagens_vantagens) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO personagens_vantagens (personagem_id, vantagem_id) VALUES (?, ?)',
                    args: [decodePgValue(item.personagem_id), decodePgValue(item.vantagem_id)]
                });
            }
        }
        if (tablesData.personagens_desvantagens) {
            console.log('Povoando personagens_desvantagens...');
            for (const item of tablesData.personagens_desvantagens) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO personagens_desvantagens (personagem_id, desvantagem_id) VALUES (?, ?)',
                    args: [decodePgValue(item.personagem_id), decodePgValue(item.desvantagem_id)]
                });
            }
        }
        if (tablesData.personagens_pericias) {
            console.log('Povoando personagens_pericias...');
            for (const item of tablesData.personagens_pericias) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO personagens_pericias (personagem_id, pericia_id) VALUES (?, ?)',
                    args: [decodePgValue(item.personagem_id), decodePgValue(item.pericia_id)]
                });
            }
        }
        if (tablesData.personagens_tecnicas) {
            console.log('Povoando personagens_tecnicas...');
            for (const item of tablesData.personagens_tecnicas) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO personagens_tecnicas (personagem_id, tecnica_id) VALUES (?, ?)',
                    args: [decodePgValue(item.personagem_id), decodePgValue(item.tecnica_id)]
                });
            }
        }

        // NPCs Junções
        if (tablesData.npcs_vantagens) {
            console.log('Povoando npcs_vantagens...');
            for (const item of tablesData.npcs_vantagens) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO npcs_vantagens (npc_id, vantagem_id) VALUES (?, ?)',
                    args: [decodePgValue(item.npc_id), decodePgValue(item.vantagem_id)]
                });
            }
        }
        if (tablesData.npcs_desvantagens) {
            console.log('Povoando npcs_desvantagens...');
            for (const item of tablesData.npcs_desvantagens) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO npcs_desvantagens (npc_id, desvantagem_id) VALUES (?, ?)',
                    args: [decodePgValue(item.npc_id), decodePgValue(item.desvantagem_id)]
                });
            }
        }
        if (tablesData.npcs_pericias) {
            console.log('Povoando npcs_pericias...');
            for (const item of tablesData.npcs_pericias) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO npcs_pericias (npc_id, pericia_id) VALUES (?, ?)',
                    args: [decodePgValue(item.npc_id), decodePgValue(item.pericia_id)]
                });
            }
        }
        if (tablesData.npcs_tecnicas) {
            console.log('Povoando npcs_tecnicas...');
            for (const item of tablesData.npcs_tecnicas) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO npcs_tecnicas (npc_id, tecnica_id) VALUES (?, ?)',
                    args: [decodePgValue(item.npc_id), decodePgValue(item.tecnica_id)]
                });
            }
        }

        // Monstros Junções
        if (tablesData.monstros_vantagens) {
            console.log('Povoando monstros_vantagens...');
            for (const item of tablesData.monstros_vantagens) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO monstros_vantagens (monstro_id, vantagem_id) VALUES (?, ?)',
                    args: [decodePgValue(item.monstro_id), decodePgValue(item.vantagem_id)]
                });
            }
        }
        if (tablesData.monstros_desvantagens) {
            console.log('Povoando monstros_desvantagens...');
            for (const item of tablesData.monstros_desvantagens) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO monstros_desvantagens (monstro_id, desvantagem_id) VALUES (?, ?)',
                    args: [decodePgValue(item.monstro_id), decodePgValue(item.desvantagem_id)]
                });
            }
        }
        if (tablesData.monstros_pericias) {
            console.log('Povoando monstros_pericias...');
            for (const item of tablesData.monstros_pericias) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO monstros_pericias (monstro_id, pericia_id) VALUES (?, ?)',
                    args: [decodePgValue(item.monstro_id), decodePgValue(item.pericia_id)]
                });
            }
        }
        if (tablesData.monstros_tecnicas) {
            console.log('Povoando monstros_tecnicas...');
            for (const item of tablesData.monstros_tecnicas) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO monstros_tecnicas (monstro_id, tecnica_id) VALUES (?, ?)',
                    args: [decodePgValue(item.monstro_id), decodePgValue(item.tecnica_id)]
                });
            }
        }

        // FASE 5: Sessões e Sub-tabelas
        if (tablesData.sessions) {
            console.log('Povoando sessions...');
            for (const item of tablesData.sessions) {
                await db.execute({
                    sql: `INSERT OR REPLACE INTO sessions (
                        id, campaign_id, user_id, title, description, comeco_forte, gancho_proxima_aventura, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                    args: [
                        decodePgValue(item.id),
                        decodePgValue(item.campaign_id),
                        TARGET_USER_ID, // Override
                        decodePgValue(item.title) || 'Sessão Sem Título',
                        decodePgValue(item.description),
                        decodePgValue(item.comeco_forte),
                        decodePgValue(item.gancho_proxima_aventura),
                        decodePgValue(item.created_at) || new Date().toISOString()
                    ]
                });
            }
        }

        if (tablesData.session_objetivos) {
            console.log('Povoando session_objetivos...');
            for (const item of tablesData.session_objetivos) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO session_objetivos (id, session_id, description, completed) VALUES (?, ?, ?, ?)',
                    args: [
                        decodePgValue(item.id),
                        decodePgValue(item.session_id),
                        decodePgValue(item.description) || 'Objetivo Sem Descrição',
                        0 // default: false
                    ]
                });
            }
        }

        if (tablesData.session_ganchos_personagens) {
            console.log('Povoando session_ganchos_personagens...');
            for (const item of tablesData.session_ganchos_personagens) {
                const charName = decodePgValue(item.personagem_name);
                // Se encontrarmos o ID correspondente pelo nome, vinculamos a chave estrangeira personagem_id
                const charId = (charName && characterIdMap[charName]) ? characterIdMap[charName] : null;

                await db.execute({
                    sql: 'INSERT OR REPLACE INTO session_ganchos_personagens (id, session_id, personagem_id, personagem_name, description) VALUES (?, ?, ?, ?, ?)',
                    args: [
                        decodePgValue(item.id),
                        decodePgValue(item.session_id),
                        charId,
                        charName,
                        decodePgValue(item.description) || 'Gancho Sem Descrição'
                    ]
                });
            }
        }

        if (tablesData.session_locais_interessantes) {
            console.log('Povoando session_locais_interessantes...');
            for (const item of tablesData.session_locais_interessantes) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO session_locais_interessantes (id, session_id, name, description) VALUES (?, ?, ?, ?)',
                    args: [
                        decodePgValue(item.id),
                        decodePgValue(item.session_id),
                        decodePgValue(item.name) || 'Local Sem Nome',
                        null // default
                    ]
                });
            }
        }

        if (tablesData.session_locais_caracteristicas) {
            console.log('Povoando session_locais_caracteristicas...');
            for (const item of tablesData.session_locais_caracteristicas) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO session_locais_caracteristicas (id, local_id, description) VALUES (?, ?, ?)',
                    args: [
                        decodePgValue(item.id),
                        decodePgValue(item.local_id),
                        decodePgValue(item.description) || 'Característica Sem Descrição'
                    ]
                });
            }
        }

        if (tablesData.session_npcs_importantes) {
            console.log('Povoando session_npcs_importantes...');
            for (const item of tablesData.session_npcs_importantes) {
                const sessId = decodePgValue(item.session_id);
                const nId = decodePgValue(item.npc_id);
                const pkId = `${sessId}_${nId}`; // Geramos uma chave única de ID para o SQLite

                // Busca o nome do NPC para enriquecer o banco
                let npcName = null;
                if (nId) {
                    const matchName = Object.keys(npcIdMap).find(k => npcIdMap[k] === nId);
                    if (matchName) npcName = matchName;
                }

                await db.execute({
                    sql: 'INSERT OR REPLACE INTO session_npcs_importantes (id, session_id, npc_id, name, role, notes) VALUES (?, ?, ?, ?, ?, ?)',
                    args: [
                        pkId,
                        sessId,
                        nId,
                        npcName, // Preenche com o nome mapeado
                        null,
                        null
                    ]
                });
            }
        }

        if (tablesData.session_encontros_desafios) {
            console.log('Povoando session_encontros_desafios...');
            for (const item of tablesData.session_encontros_desafios) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO session_encontros_desafios (id, session_id, name, description, mecanica) VALUES (?, ?, ?, ?, ?)',
                    args: [
                        decodePgValue(item.id),
                        decodePgValue(item.session_id),
                        decodePgValue(item.title) || 'Encontro Sem Nome', // Mapeia title -> name
                        decodePgValue(item.description),
                        decodePgValue(item.mecanica)
                    ]
                });
            }
        }

        if (tablesData.session_segredos_rumores) {
            console.log('Povoando session_segredos_rumores...');
            for (const item of tablesData.session_segredos_rumores) {
                await db.execute({
                    sql: 'INSERT OR REPLACE INTO session_segredos_rumores (id, session_id, description, revealed) VALUES (?, ?, ?, ?)',
                    args: [
                        decodePgValue(item.id),
                        decodePgValue(item.session_id),
                        decodePgValue(item.description) || 'Segredo Sem Descrição',
                        0 // default: false
                    ]
                });
            }
        }

        if (tablesData.session_tesouros_recompensas) {
            console.log('Povoando session_tesouros_recompensas...');
            for (const item of tablesData.session_tesouros_recompensas) {
                const tName = decodePgValue(item.name) || 'Tesouro';
                const tMech = decodePgValue(item.description_mecanica) || '';
                // Combina nome e descrição mecânica em description no SQLite para não perder detalhes
                const fullDescription = tMech ? `${tName}: ${tMech}` : tName;

                await db.execute({
                    sql: 'INSERT OR REPLACE INTO session_tesouros_recompensas (id, session_id, description, claimed) VALUES (?, ?, ?, ?)',
                    args: [
                        decodePgValue(item.id),
                        decodePgValue(item.session_id),
                        fullDescription,
                        0 // default: false
                    ]
                });
            }
        }

        console.log('\n--- Povoamento Concluído com Sucesso! ---');

        // FASE 6: Verificação de contagem
        console.log('\nRealizando verificação de contagem pós-migração...');
        const countCampaigns = await db.execute('SELECT COUNT(*) as c FROM campaigns');
        const countChapters = await db.execute('SELECT COUNT(*) as c FROM campaign_chapters');
        const countCharacters = await db.execute('SELECT COUNT(*) as c FROM personagens');
        const countNPCs = await db.execute('SELECT COUNT(*) as c FROM npcs');
        const countMonsters = await db.execute('SELECT COUNT(*) as c FROM monstros');
        const countSessions = await db.execute('SELECT COUNT(*) as c FROM sessions');

        console.log(`[VERIFICAÇÃO] Campanhas no Turso: ${countCampaigns.rows[0].c}`);
        console.log(`[VERIFICAÇÃO] Capítulos no Turso: ${countChapters.rows[0].c}`);
        console.log(`[VERIFICAÇÃO] Personagens no Turso: ${countCharacters.rows[0].c}`);
        console.log(`[VERIFICAÇÃO] NPCs no Turso: ${countNPCs.rows[0].c}`);
        console.log(`[VERIFICAÇÃO] Monstros no Turso: ${countMonsters.rows[0].c}`);
        console.log(`[VERIFICAÇÃO] Sessões no Turso: ${countSessions.rows[0].c}`);
        
        // Log extra tables added in this PR
        const countLocais = await db.execute('SELECT COUNT(*) as c FROM session_locais_interessantes');
        const countEncontros = await db.execute('SELECT COUNT(*) as c FROM session_encontros_desafios');
        const countTesouros = await db.execute('SELECT COUNT(*) as c FROM session_tesouros_recompensas');
        
        console.log(`[VERIFICAÇÃO] Locais Importantes no Turso: ${countLocais.rows[0].c}`);
        console.log(`[VERIFICAÇÃO] Encontros no Turso: ${countEncontros.rows[0].c}`);
        console.log(`[VERIFICAÇÃO] Tesouros no Turso: ${countTesouros.rows[0].c}`);

        console.log('\n--- Fim da Migração Sem Erros ---');

    } catch (e) {
        console.error('ERRO FATAL NA MIGRAÇÃO:', e);
        process.exit(1);
    }
}

runMigration();
