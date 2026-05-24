import { db } from './api/_utils/db.js';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

async function run() {
    const email = 'filipe_aac@yahoo.com';
    const password = 'password123';
    
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const userId = uuidv4();
    
    await db.execute({
        sql: 'INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)',
        args: [userId, email, passwordHash]
    });
    
    const profileId = uuidv4();
    await db.execute({
        sql: 'INSERT INTO profiles (id, user_id, username) VALUES (?, ?, ?)',
        args: [profileId, userId, email.split('@')[0]]
    });
    console.log('User created:', email);
}

run();
