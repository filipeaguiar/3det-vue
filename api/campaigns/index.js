import { db } from '../_utils/db.js';
import { getUserFromReq } from '../_utils/auth.js';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
    const user = await getUserFromReq(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
        try {
            const { rows } = await db.execute({
                sql: 'SELECT * FROM campaigns WHERE user_id = ? ORDER BY created_at DESC',
                args: [user.userId]
            });
            return res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { name, description } = req.body;
            const id = uuidv4();
            await db.execute({
                sql: 'INSERT INTO campaigns (id, name, description, user_id) VALUES (?, ?, ?, ?)',
                args: [id, name, description || null, user.userId]
            });
            return res.status(201).json({ id, name, description, user_id: user.userId });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
