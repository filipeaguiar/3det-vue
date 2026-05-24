import { db } from '../../../_utils/db.js';
import { getUserFromReq } from '../../../_utils/auth.js';

export default async function handler(req, res) {
    const user = await getUserFromReq(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { type, id } = req.query;

    const allowedTypes = ['personagens', 'npcs', 'monstros'];
    if (!allowedTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid entity type' });
    }

    // Verify ownership
    const { rows: entities } = await db.execute({
        sql: `SELECT id FROM ${type} WHERE id = ? AND user_id = ?`,
        args: [id, user.userId]
    });
    if (entities.length === 0) return res.status(404).json({ error: 'Not found' });

    if (req.method === 'GET') {
        try {
            const { rows } = await db.execute({
                sql: `SELECT * FROM ${type} WHERE id = ?`,
                args: [id]
            });
            const entity = rows[0];

            // Relations
            const singular = type === 'personagens' ? 'personagem' : type.slice(0, -1);
            const vantagens = (await db.execute(`SELECT j.vantagem_id as id, r.name, r.cost, r.description FROM ${type}_vantagens j JOIN vantagens r ON j.vantagem_id = r.id WHERE j.${singular}_id = '${id}'`)).rows;
            const desvantagens = (await db.execute(`SELECT j.desvantagem_id as id, r.name, r.cost, r.description FROM ${type}_desvantagens j JOIN desvantagens r ON j.desvantagem_id = r.id WHERE j.${singular}_id = '${id}'`)).rows;
            const pericias = (await db.execute(`SELECT j.pericia_id as id, r.name, r.description FROM ${type}_pericias j JOIN pericias r ON j.pericia_id = r.id WHERE j.${singular}_id = '${id}'`)).rows;
            const tecnicas = (await db.execute(`SELECT j.tecnica_id as id, r.name, r.cost, r.description, r.duration, r.requirements FROM ${type}_tecnicas j JOIN tecnicas r ON j.tecnica_id = r.id WHERE j.${singular}_id = '${id}'`)).rows;

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

            return res.status(200).json(entity);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const data = req.body;
            const singular = type === 'personagens' ? 'personagem' : type.slice(0, -1);
            
            const stmts = [];
            stmts.push({
                sql: `UPDATE ${type} SET name=?, archetype=?, concept=?, pontos=?, Habilidade=?, Poder=?, Resistencia=?, Pontos_Vida=?, Pontos_Acao=?, Pontos_Mana=?, image=?, campaign_id=? WHERE id=?`,
                args: [data.name, data.archetype, data.concept, data.pontos, data.Habilidade, data.Poder, data.Resistencia, data.Pontos_Vida, data.Pontos_Acao, data.Pontos_Mana, data.image, data.campaign_id || null, id]
            });

            // Clean existing relations
            stmts.push({ sql: `DELETE FROM ${type}_vantagens WHERE ${singular}_id = ?`, args: [id] });
            stmts.push({ sql: `DELETE FROM ${type}_desvantagens WHERE ${singular}_id = ?`, args: [id] });
            stmts.push({ sql: `DELETE FROM ${type}_pericias WHERE ${singular}_id = ?`, args: [id] });
            stmts.push({ sql: `DELETE FROM ${type}_tecnicas WHERE ${singular}_id = ?`, args: [id] });

            // Reinsert new relations
            if (data.vantagens) data.vantagens.forEach(v => stmts.push({ sql: `INSERT INTO ${type}_vantagens (${singular}_id, vantagem_id) VALUES (?, ?)`, args: [id, v.id || v] }));
            if (data.desvantagens) data.desvantagens.forEach(v => stmts.push({ sql: `INSERT INTO ${type}_desvantagens (${singular}_id, desvantagem_id) VALUES (?, ?)`, args: [id, v.id || v] }));
            if (data.pericias) data.pericias.forEach(v => stmts.push({ sql: `INSERT INTO ${type}_pericias (${singular}_id, pericia_id) VALUES (?, ?)`, args: [id, v.id || v] }));
            if (data.tecnicas) data.tecnicas.forEach(v => stmts.push({ sql: `INSERT INTO ${type}_tecnicas (${singular}_id, tecnica_id) VALUES (?, ?)`, args: [id, v.id || v] }));

            await db.batch(stmts, 'write');
            return res.status(200).json({ message: 'Updated successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            await db.execute({
                sql: `DELETE FROM ${type} WHERE id = ?`,
                args: [id]
            });
            return res.status(200).json({ message: 'Deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
