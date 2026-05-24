import { db } from './api/_utils/db.js';

async function run() {
    const userId = '274c3e85-6ada-4de9-a12a-a13b019bb7bf';
    try {
        console.log("Personagens:", (await db.execute({ sql: "SELECT id FROM personagens WHERE user_id = ?", args: [userId] })).rows.length);
        console.log("NPCs:", (await db.execute({ sql: "SELECT id FROM npcs WHERE user_id = ?", args: [userId] })).rows.length);
        console.log("Monstros:", (await db.execute({ sql: "SELECT id FROM monstros WHERE user_id = ?", args: [userId] })).rows.length);
    } catch (e) {
        console.error(e);
    }
}
run();
