import { db } from '../../_utils/db.js';
import { getUserFromReq } from '../../_utils/auth.js';

export default async function handler(req, res) {
    const user = await getUserFromReq(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const { id: campaignId, chapterId } = req.query;

    // Verify campaign ownership
    const { rows: camps } = await db.execute({
        sql: 'SELECT id FROM campaigns WHERE id = ? AND user_id = ?',
        args: [campaignId, user.userId]
    });
    if (camps.length === 0) {
        return res.status(404).json({ error: 'Campaign not found' });
    }

    if (req.method === 'GET') {
        try {
            const { rows } = await db.execute({
                sql: 'SELECT * FROM campaign_chapters WHERE id = ? AND campaign_id = ?',
                args: [chapterId, campaignId]
            });
            if (rows.length === 0) return res.status(404).json({ error: 'Chapter not found' });
            return res.status(200).json(rows[0]);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'PUT') {
        try {
            const { chapter_number, content } = req.body;
            await db.execute({
                sql: 'UPDATE campaign_chapters SET chapter_number = ?, content = ? WHERE id = ? AND campaign_id = ?',
                args: [chapter_number, content, chapterId, campaignId]
            });
            return res.status(200).json({ id: chapterId, campaign_id: campaignId, chapter_number, content });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    if (req.method === 'DELETE') {
        try {
            await db.execute({
                sql: 'DELETE FROM campaign_chapters WHERE id = ? AND campaign_id = ?',
                args: [chapterId, campaignId]
            });
            return res.status(200).json({ message: 'Chapter deleted' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
