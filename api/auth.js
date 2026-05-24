import { db } from './_utils/db.js';
import bcrypt from 'bcryptjs';
import { createToken, getUserFromReq } from './_utils/auth.js';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
    const { action } = req.query;

    // POST /api/auth?action=login
    if (req.method === 'POST' && action === 'login') {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

            const { rows } = await db.execute({
                sql: 'SELECT id, email, password_hash FROM users WHERE email = ?',
                args: [email]
            });

            if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
            const user = rows[0];

            const isMatch = await bcrypt.compare(password, user.password_hash);
            if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });

            const token = await createToken({ userId: user.id, email: user.email });
            res.setHeader('Set-Cookie', `auth_token=${token}; HttpOnly; Path=/; Max-Age=${7 * 24 * 60 * 60}; SameSite=Strict`);
            return res.status(200).json({ user: { id: user.id, email: user.email } });
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // POST /api/auth?action=register
    if (req.method === 'POST' && action === 'register') {
        try {
            const { email, password } = req.body;
            if (!email || !password) return res.status(400).json({ error: 'Email and password are required' });

            const { rows } = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [email] });
            if (rows.length > 0) return res.status(400).json({ error: 'Email already registered' });

            const salt = await bcrypt.genSalt(10);
            const passwordHash = await bcrypt.hash(password, salt);
            const userId = uuidv4();
            
            await db.execute({ sql: 'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)', args: [userId, email, passwordHash] });
            await db.execute({ sql: 'INSERT INTO profiles (id, user_id, username) VALUES (?, ?, ?)', args: [uuidv4(), userId, email.split('@')[0]] });

            return res.status(201).json({ message: 'User created successfully' });
        } catch (error) {
            console.error('Registration error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // GET /api/auth (Session check)
    if (req.method === 'GET') {
        try {
            const payload = await getUserFromReq(req);
            if (!payload) return res.status(200).json({ user: null }); // Don't return 401 for session check

            const { rows } = await db.execute({
                sql: 'SELECT id, username, avatar_url FROM profiles WHERE user_id = ?',
                args: [payload.userId]
            });
            return res.status(200).json({ user: { id: payload.userId, email: payload.email, profile: rows[0] || null } });
        } catch (error) {
            console.error('Session error:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }

    // DELETE /api/auth (Logout)
    if (req.method === 'DELETE') {
        res.setHeader('Set-Cookie', 'auth_token=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict');
        return res.status(200).json({ message: 'Logged out successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
}
