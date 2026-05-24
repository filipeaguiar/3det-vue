import { db } from '../../_utils/db.js';
import { getUserFromReq } from '../../_utils/auth.js';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
    const user = await getUserFromReq(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id: campaign_id } = req.query; // the [id] from the path

    // First check if user owns the campaign
    const { rows: camps } = await db.execute({
        sql: 'SELECT id FROM campaigns WHERE id = ? AND user_id = ?',
        args: [campaign_id, user.userId]
    });
    if (camps.length === 0) {
        return res.status(404).json({ error: 'Campaign not found' });
    }

    if (req.method === 'GET') {
        try {
            const { rows } = await db.execute({
                sql: 'SELECT * FROM campaign_chapters WHERE campaign_id = ? ORDER BY chapter_number ASC',
                args: [campaign_id]
            });
            return res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'POST') {
        try {
            const { chapter_number, content } = req.body;
            const chapterId = uuidv4();
            await db.execute({
                sql: 'INSERT INTO campaign_chapters (id, campaign_id, chapter_number, content) VALUES (?, ?, ?, ?)',
                args: [chapterId, campaign_id, chapter_number, content || '']
            });
            return res.status(201).json({ id: chapterId, campaign_id, chapter_number, content });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
