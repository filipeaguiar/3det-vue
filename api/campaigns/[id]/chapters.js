import { db } from '../../_utils/db.js';
import { getUserFromReq } from '../../_utils/auth.js';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
    const user = await getUserFromReq(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id: campaign_id, chapterId } = req.query; 

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
            if (chapterId) {
                const { rows } = await db.execute({
                    sql: 'SELECT * FROM campaign_chapters WHERE id = ? AND campaign_id = ?',
                    args: [chapterId, campaign_id]
                });
                if (rows.length === 0) return res.status(404).json({ error: 'Chapter not found' });
                return res.status(200).json(rows[0]);
            }

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
            const id = uuidv4();
            await db.execute({
                sql: 'INSERT INTO campaign_chapters (id, campaign_id, chapter_number, content) VALUES (?, ?, ?, ?)',
                args: [id, campaign_id, chapter_number, content || '']
            });
            return res.status(201).json({ id, campaign_id, chapter_number, content });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { id, chapter_number, content } = req.body;
            const targetId = chapterId || id;
            if (!targetId) return res.status(400).json({ error: 'Chapter ID required' });

            await db.execute({
                sql: 'UPDATE campaign_chapters SET chapter_number = ?, content = ? WHERE id = ? AND campaign_id = ?',
                args: [chapter_number, content, targetId, campaign_id]
            });
            return res.status(200).json({ id: targetId, campaign_id, chapter_number, content });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            const targetId = chapterId || req.query.id;
            if (!targetId) return res.status(400).json({ error: 'Chapter ID required' });

            await db.execute({
                sql: 'DELETE FROM campaign_chapters WHERE id = ? AND campaign_id = ?',
                args: [targetId, campaign_id]
            });
            return res.status(200).json({ message: 'Chapter deleted' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
