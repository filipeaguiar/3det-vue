import { db } from '../_utils/db.js';

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type } = req.query;

    const allowedTypes = ['vantagens', 'desvantagens', 'pericias', 'tecnicas'];
    if (!allowedTypes.includes(type)) {
        return res.status(400).json({ error: 'Invalid rule type' });
    }

    try {
        const { rows } = await db.execute({
            sql: `SELECT * FROM ${type} ORDER BY name ASC`
        });
        return res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
