import { db } from './api/_utils/db.js';

async function run() {
    const res = await db.execute('SELECT id, email FROM users');
    console.log(res.rows);
}

run();
