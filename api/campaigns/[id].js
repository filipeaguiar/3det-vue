import { db } from '../utils/db.js';
import { getUserFromReq } from '../utils/auth.js';

export default async function handler(req, res) {
    const user = await getUserFromReq(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id } = req.query; // Vercel injects path params into query

    if (req.method === 'GET') {
        try {
            const { rows } = await db.execute({
                sql: 'SELECT * FROM campaigns WHERE id = ? AND user_id = ?',
                args: [id, user.userId]
            });
            if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
            return res.status(200).json(rows[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { name, description } = req.body;
            await db.execute({
                sql: 'UPDATE campaigns SET name = ?, description = ? WHERE id = ? AND user_id = ?',
                args: [name, description || null, id, user.userId]
            });
            return res.status(200).json({ message: 'Updated successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            // Due to PRAGMA foreign_keys = ON and ON DELETE CASCADE, this deletes all related entities!
            await db.execute({
                sql: 'DELETE FROM campaigns WHERE id = ? AND user_id = ?',
                args: [id, user.userId]
            });
            return res.status(200).json({ message: 'Deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
