import { getUserFromReq } from '../_utils/auth.js';
import { db } from '../_utils/db.js';

export default async function handler(req, res) {
    if (req.method === 'DELETE') {
        res.setHeader('Set-Cookie', 'auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');
        return res.status(200).json({ message: 'Logged out successfully' });
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const payload = await getUserFromReq(req);
        
        if (!payload) {
            return res.status(401).json({ user: null });
        }

        // Get profile
        const { rows } = await db.execute({
            sql: 'SELECT id, username, avatar_url FROM profiles WHERE user_id = ?',
            args: [payload.userId]
        });

        const profile = rows.length > 0 ? rows[0] : null;

        return res.status(200).json({
            user: {
                id: payload.userId,
                email: payload.email,
                profile
            }
        });
    } catch (error) {
        console.error('Session error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
