import { db } from '../../../_utils/db.js';
import { getUserFromReq } from '../../../_utils/auth.js';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
    const user = await getUserFromReq(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { type, campaign_id } = req.query;

    const allowedTypes = ['personagens', 'npcs', 'monstros'];
    if (!allowedTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid entity type' });
    }

    if (req.method === 'GET') {
        try {
            let sql = `SELECT * FROM ${type} WHERE user_id = ?`;
            let args = [user.userId];
            
            if (campaign_id) {
                sql += ' AND (campaign_id = ? OR campaign_id IS NULL)';
                args.push(campaign_id);
            }

            const { rows } = await db.execute({ sql, args });

            // Fetch relations
            const singular = type.slice(0, -1);
            for (let entity of rows) {
                const vantagens = (await db.execute(`SELECT j.vantagem_id as id, r.name, r.cost, r.description FROM ${type}_vantagens j JOIN vantagens r ON j.vantagem_id = r.id WHERE j.${singular}_id = '${entity.id}'`)).rows;
                const desvantagens = (await db.execute(`SELECT j.desvantagem_id as id, r.name, r.cost, r.description FROM ${type}_desvantagens j JOIN desvantagens r ON j.desvantagem_id = r.id WHERE j.${singular}_id = '${entity.id}'`)).rows;
                const pericias = (await db.execute(`SELECT j.pericia_id as id, r.name, r.description FROM ${type}_pericias j JOIN pericias r ON j.pericia_id = r.id WHERE j.${singular}_id = '${entity.id}'`)).rows;
                const tecnicas = (await db.execute(`SELECT j.tecnica_id as id, r.name, r.cost, r.description, r.duration, r.requirements FROM ${type}_tecnicas j JOIN tecnicas r ON j.tecnica_id = r.id WHERE j.${singular}_id = '${entity.id}'`)).rows;

                // Set clean properties
                entity.vantagens = vantagens;
                entity.desvantagens = desvantagens;
                entity.pericias = pericias;
                entity.tecnicas = tecnicas;

                // Set old compatibility properties for the frontend
                entity[`${type}_vantagens`] = vantagens.map(v => ({ vantagem_id: v.id, vantagens: { name: v.name } }));
                entity[`${type}_desvantagens`] = desvantagens.map(d => ({ desvantagem_id: d.id, desvantagens: { name: d.name } }));
                entity[`${type}_pericias`] = pericias.map(p => ({ pericia_id: p.id, pericias: { name: p.name } }));
                entity[`${type}_tecnicas`] = tecnicas.map(t => ({ tecnica_id: t.id, tecnicas: { name: t.name } }));
            }

            return res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        try {
            const data = req.body;
            const id = uuidv4();
            
            const stmts = [];
            stmts.push({
                sql: `INSERT INTO ${type} (id, name, archetype, concept, pontos, Habilidade, Poder, Resistencia, Pontos_Vida, Pontos_Acao, Pontos_Mana, image, campaign_id, user_id) 
                      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                args: [id, data.name, data.archetype, data.concept, data.pontos, data.Habilidade, data.Poder, data.Resistencia, data.Pontos_Vida, data.Pontos_Acao, data.Pontos_Mana, data.image, data.campaign_id || null, user.userId]
            });

            const singular = type.slice(0, -1);
            if (data.vantagens) data.vantagens.forEach(v => stmts.push({ sql: `INSERT INTO ${type}_vantagens (${singular}_id, vantagem_id) VALUES (?, ?)`, args: [id, v.id || v] }));
            if (data.desvantagens) data.desvantagens.forEach(v => stmts.push({ sql: `INSERT INTO ${type}_desvantagens (${singular}_id, desvantagem_id) VALUES (?, ?)`, args: [id, v.id || v] }));
            if (data.pericias) data.pericias.forEach(v => stmts.push({ sql: `INSERT INTO ${type}_pericias (${singular}_id, pericia_id) VALUES (?, ?)`, args: [id, v.id || v] }));
            if (data.tecnicas) data.tecnicas.forEach(v => stmts.push({ sql: `INSERT INTO ${type}_tecnicas (${singular}_id, tecnica_id) VALUES (?, ?)`, args: [id, v.id || v] }));

            await db.batch(stmts, 'write');
            
            return res.status(201).json({ id, ...data });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
