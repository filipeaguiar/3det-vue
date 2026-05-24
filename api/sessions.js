import { db } from './_utils/db.js';
import { getUserFromReq } from './_utils/auth.js';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
    const user = await getUserFromReq(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { id } = req.query;

    // GET /api/sessions
    if (req.method === 'GET') {
        try {
            if (id) {
                const { rows } = await db.execute({ sql: 'SELECT * FROM sessions WHERE id = ? AND user_id = ?', args: [id, user.userId] });
                if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
                const session = rows[0];
                session.objetivos = (await db.execute({ sql: 'SELECT * FROM session_objetivos WHERE session_id = ?', args: [id] })).rows;
                session.ganchos_personagens = (await db.execute({ sql: 'SELECT * FROM session_ganchos_personagens WHERE session_id = ?', args: [id] })).rows;
                session.locais_interessantes = (await db.execute({ sql: 'SELECT * FROM session_locais_interessantes WHERE session_id = ?', args: [id] })).rows;
                for (let local of session.locais_interessantes) {
                    local.caracteristicas = (await db.execute({ sql: 'SELECT * FROM session_locais_caracteristicas WHERE local_id = ?', args: [local.id] })).rows;
                }
                session.npcs_importantes = (await db.execute({ sql: 'SELECT * FROM session_npcs_importantes WHERE session_id = ?', args: [id] })).rows;
                session.encontros_desafios = (await db.execute({ sql: 'SELECT * FROM session_encontros_desafios WHERE session_id = ?', args: [id] })).rows;
                session.segredos_rumores = (await db.execute({ sql: 'SELECT * FROM session_segredos_rumores WHERE session_id = ?', args: [id] })).rows;
                session.tesouros_recompensas = (await db.execute({ sql: 'SELECT * FROM session_tesouros_recompensas WHERE session_id = ?', args: [id] })).rows;
                return res.status(200).json(session);
            }
            const { campaign_id } = req.query;
            let sql = 'SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC';
            let args = [user.userId];
            if (campaign_id) {
                sql = 'SELECT * FROM sessions WHERE user_id = ? AND campaign_id = ? ORDER BY created_at DESC';
                args.push(campaign_id);
            }
            const { rows } = await db.execute({ sql, args });
            return res.status(200).json(rows);
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // POST /api/sessions
    if (req.method === 'POST') {
        try {
            const data = req.body;
            const sessionId = uuidv4();
            const stmts = [];
            stmts.push({
                sql: `INSERT INTO sessions (id, campaign_id, user_id, title, description, comeco_forte, gancho_proxima_aventura) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                args: [sessionId, data.campaign_id, user.userId, data.title || 'Nova Sessão', data.description || '', data.comeco_forte || '', data.gancho_proxima_aventura || '']
            });
            if (data.objetivos) data.objetivos.forEach(o => stmts.push({ sql: 'INSERT INTO session_objetivos (id, session_id, description, completed) VALUES (?, ?, ?, ?)', args: [uuidv4(), sessionId, o.description, o.completed ? 1 : 0] }));
            await db.batch(stmts, 'write');
            return res.status(201).json({ id: sessionId, ...data });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // PUT /api/sessions?id=...
    if (req.method === 'PUT' && id) {
        try {
            const data = req.body;
            const stmts = [];
            stmts.push({ sql: 'UPDATE sessions SET title=?, description=?, comeco_forte=?, gancho_proxima_aventura=? WHERE id=? AND user_id=?', args: [data.title, data.description || '', data.comeco_forte || '', data.gancho_proxima_aventura || '', id, user.userId] });
            stmts.push({ sql: 'DELETE FROM session_objetivos WHERE session_id=?', args: [id] });
            stmts.push({ sql: 'DELETE FROM session_ganchos_personagens WHERE session_id=?', args: [id] });
            stmts.push({ sql: 'DELETE FROM session_locais_interessantes WHERE session_id=?', args: [id] });
            stmts.push({ sql: 'DELETE FROM session_npcs_importantes WHERE session_id=?', args: [id] });
            stmts.push({ sql: 'DELETE FROM session_encontros_desafios WHERE session_id=?', args: [id] });
            stmts.push({ sql: 'DELETE FROM session_segredos_rumores WHERE session_id=?', args: [id] });
            stmts.push({ sql: 'DELETE FROM session_tesouros_recompensas WHERE session_id=?', args: [id] });

            if (data.objetivos) data.objetivos.forEach(o => stmts.push({ sql: 'INSERT INTO session_objetivos (id, session_id, description, completed) VALUES (?, ?, ?, ?)', args: [uuidv4(), id, o.description, o.completed ? 1 : 0] }));
            if (data.ganchos_personagens) data.ganchos_personagens.forEach(g => stmts.push({ sql: 'INSERT INTO session_ganchos_personagens (id, session_id, personagem_id, personagem_name, description) VALUES (?, ?, ?, ?, ?)', args: [uuidv4(), id, g.personagem_id || null, g.personagem_name || '', g.description] }));
            if (data.locais_interessantes) {
                data.locais_interessantes.forEach(l => {
                    const localId = uuidv4();
                    stmts.push({ sql: 'INSERT INTO session_locais_interessantes (id, session_id, name, description) VALUES (?, ?, ?, ?)', args: [localId, id, l.name, l.description || ''] });
                    if (l.caracteristicas) l.caracteristicas.forEach(c => stmts.push({ sql: 'INSERT INTO session_locais_caracteristicas (id, local_id, description) VALUES (?, ?, ?)', args: [uuidv4(), localId, c.description || c] }));
                });
            }
            if (data.npcs_importantes) data.npcs_importantes.forEach(n => stmts.push({ sql: 'INSERT INTO session_npcs_importantes (id, session_id, npc_id, name, role, notes) VALUES (?, ?, ?, ?, ?, ?)', args: [uuidv4(), id, n.npc_id || null, n.name || '', n.role || '', n.notes || ''] }));
            if (data.encontros_desafios) data.encontros_desafios.forEach(e => stmts.push({ sql: 'INSERT INTO session_encontros_desafios (id, session_id, name, description, mecanica) VALUES (?, ?, ?, ?, ?)', args: [uuidv4(), id, e.name, e.description || '', e.mecanica || ''] }));
            if (data.segredos_rumores) data.segredos_rumores.forEach(s => stmts.push({ sql: 'INSERT INTO session_segredos_rumores (id, session_id, description, revealed) VALUES (?, ?, ?, ?)', args: [uuidv4(), id, s.description, s.revealed ? 1 : 0] }));
            if (data.tesouros_recompensas) data.tesouros_recompensas.forEach(t => stmts.push({ sql: 'INSERT INTO session_tesouros_recompensas (id, session_id, description, claimed) VALUES (?, ?, ?, ?)', args: [uuidv4(), id, t.description, t.claimed ? 1 : 0] }));

            await db.batch(stmts, 'write');
            return res.status(200).json({ message: 'Updated successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // DELETE /api/sessions?id=...
    if (req.method === 'DELETE' && id) {
        try {
            await db.execute({ sql: 'DELETE FROM sessions WHERE id = ? AND user_id = ?', args: [id, user.userId] });
            return res.status(200).json({ message: 'Deleted successfully' });
        } catch (error) {
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
