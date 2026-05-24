import { db } from '../../utils/db.js';
import { getUserFromReq } from '../../utils/auth.js';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
    const user = await getUserFromReq(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        const { campaign_id } = req.query;
        try {
            let sql = 'SELECT * FROM sessions WHERE user_id = ? ORDER BY created_at DESC';
            let args = [user.userId];
            if (campaign_id) {
                sql = 'SELECT * FROM sessions WHERE user_id = ? AND campaign_id = ? ORDER BY created_at DESC';
                args.push(campaign_id);
            }
            const { rows } = await db.execute({ sql, args });
            return res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        try {
            const data = req.body;
            const sessionId = uuidv4();
            
            const stmts = [];
            stmts.push({
                sql: `INSERT INTO sessions (id, campaign_id, user_id, title, description, comeco_forte, gancho_proxima_aventura) 
                      VALUES (?, ?, ?, ?, ?, ?, ?)`,
                args: [sessionId, data.campaign_id, user.userId, data.title || 'Nova Sessão', data.description || '', data.comeco_forte || '', data.gancho_proxima_aventura || '']
            });

            // Handle sub-tables here if they are provided during POST
            // (Typically sessions are created mostly empty, but if data is passed, we insert)
            if (data.objetivos) data.objetivos.forEach(o => stmts.push({ sql: 'INSERT INTO session_objetivos (id, session_id, description, completed) VALUES (?, ?, ?, ?)', args: [uuidv4(), sessionId, o.description, o.completed ? 1 : 0] }));
            
            await db.batch(stmts, 'write');
            return res.status(201).json({ id: sessionId, ...data });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
