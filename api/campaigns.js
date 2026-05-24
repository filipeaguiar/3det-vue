import { db } from './_utils/db.js';
import { getUserFromReq } from './_utils/auth.js';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
    const user = await getUserFromReq(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { id, action } = req.query;

    // --- CAMPAIGNS ---
    if (!action || action === 'chapters') {
        // GET /api/campaigns (List)
        if (req.method === 'GET' && !id) {
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

        // POST /api/campaigns (Create)
        if (req.method === 'POST' && !id) {
            try {
                const { name, description } = req.body;
                const newId = uuidv4();
                await db.execute({
                    sql: 'INSERT INTO campaigns (id, name, description, user_id) VALUES (?, ?, ?, ?)',
                    args: [newId, name, description || null, user.userId]
                });
                return res.status(201).json({ id: newId, name, description, user_id: user.userId });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        }

        // --- SINGLE CAMPAIGN (id provided) ---
        if (id && (!action || action !== 'chapters')) {
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
        }
    }

    // --- CHAPTERS (/api/campaigns?id=CAMPAIGN_ID&action=chapters) ---
    if (action === 'chapters' && id) {
        const campaign_id = id;
        const { chapterId } = req.query;

        // Verify ownership
        const { rows: camps } = await db.execute({
            sql: 'SELECT id FROM campaigns WHERE id = ? AND user_id = ?',
            args: [campaign_id, user.userId]
        });
        if (camps.length === 0) return res.status(404).json({ error: 'Campaign not found' });

        if (req.method === 'GET') {
            try {
                if (chapterId) {
                    const { rows } = await db.execute({
                        sql: 'SELECT * FROM campaign_chapters WHERE id = ? AND campaign_id = ?',
                        args: [chapterId, campaign_id]
                    });
                    return rows.length ? res.status(200).json(rows[0]) : res.status(404).json({ error: 'Chapter not found' });
                }
                const { rows } = await db.execute({
                    sql: 'SELECT * FROM campaign_chapters WHERE campaign_id = ? ORDER BY chapter_number ASC',
                    args: [campaign_id]
                });
                return res.status(200).json(rows);
            } catch (error) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        }

        if (req.method === 'POST') {
            try {
                const { chapter_number, content } = req.body;
                const newChapterId = uuidv4();
                await db.execute({
                    sql: 'INSERT INTO campaign_chapters (id, campaign_id, chapter_number, content) VALUES (?, ?, ?, ?)',
                    args: [newChapterId, campaign_id, chapter_number, content || '']
                });
                return res.status(201).json({ id: newChapterId, campaign_id, chapter_number, content });
            } catch (error) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        }

        if (req.method === 'PUT') {
            try {
                const { id: bodyId, chapter_number, content } = req.body;
                const targetId = chapterId || bodyId;
                await db.execute({
                    sql: 'UPDATE campaign_chapters SET chapter_number = ?, content = ? WHERE id = ? AND campaign_id = ?',
                    args: [chapter_number, content, targetId, campaign_id]
                });
                return res.status(200).json({ id: targetId, campaign_id, chapter_number, content });
            } catch (error) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        }

        if (req.method === 'DELETE') {
            try {
                const targetId = chapterId || req.query.id_chapter; // Using a different param if needed
                await db.execute({
                    sql: 'DELETE FROM campaign_chapters WHERE id = ? AND campaign_id = ?',
                    args: [targetId, campaign_id]
                });
                return res.status(200).json({ message: 'Chapter deleted' });
            } catch (error) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        }
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
