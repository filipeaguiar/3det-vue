import { db } from './api/_utils/db.js';

async function test() {
    try {
        await db.execute(`SELECT j.vantagem_id as id, r.name, r.cost, r.description FROM monstros_vantagens j JOIN vantagens r ON j.vantagem_id = r.id WHERE j.monstro_id = 'test'`);
        console.log('monstros query works');
    } catch (e) {
        console.error('monstros query failed:', e.message);
    }
}
test();
