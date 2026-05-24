import { db } from '../_utils/db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if user exists
        const { rows } = await db.execute({
            sql: 'SELECT id FROM users WHERE email = ?',
            args: [email]
        });

        if (rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert user
        const userId = uuidv4();
        await db.execute({
            sql: 'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
            args: [userId, email, passwordHash]
        });
        
        // Insert profile
        const profileId = uuidv4();
        await db.execute({
            sql: 'INSERT INTO profiles (id, user_id, username) VALUES (?, ?, ?)',
            args: [profileId, userId, email.split('@')[0]]
        });

        return res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
