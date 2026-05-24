import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
import path from 'path';

// Carrega as variáveis de ambiente baseadas no ambiente
// Quando estiver na Vercel (Production), process.env já estará populado
if (process.env.NODE_ENV !== 'production') {
    dotenv.config({ path: path.resolve(process.cwd(), '.env') });
}

export const db = createClient({
    url: process.env.TURSO_DATABASE_URL || 'file:local.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export default db;
