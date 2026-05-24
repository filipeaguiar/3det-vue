import { createClient } from '@libsql/client/http';

// Edge functions do not support .env files.
// Environment variables are injected by Vercel.

export const db = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
});

export default db;
