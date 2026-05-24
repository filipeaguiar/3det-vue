import { db } from './api/_utils/db.js';

async function run() {
    const userId = '274c3e85-6ada-4de9-a12a-a13b019bb7bf';
    const type = 'personagens';
    
    try {
        let sql = `SELECT * FROM ${type} WHERE user_id = ?`;
        let args = [userId];
        const { rows } = await db.execute({ sql, args });

        const singular = type === 'personagens' ? 'personagem' : type.slice(0, -1);
        for (let entity of rows) {
            console.log(`Testing ${type} ID: ${entity.id}`);
            const vantagens = (await db.execute(`SELECT j.vantagem_id as id, r.name, r.cost, r.description FROM ${type}_vantagens j JOIN vantagens r ON j.vantagem_id = r.id WHERE j.${singular}_id = '${entity.id}'`)).rows;
            const desvantagens = (await db.execute(`SELECT j.desvantagem_id as id, r.name, r.cost, r.description FROM ${type}_desvantagens j JOIN desvantagens r ON j.desvantagem_id = r.id WHERE j.${singular}_id = '${entity.id}'`)).rows;
            const pericias = (await db.execute(`SELECT j.pericia_id as id, r.name, r.description FROM ${type}_pericias j JOIN pericias r ON j.pericia_id = r.id WHERE j.${singular}_id = '${entity.id}'`)).rows;
            const tecnicas = (await db.execute(`SELECT j.tecnica_id as id, r.name, r.cost, r.description, r.duration, r.requirements FROM ${type}_tecnicas j JOIN tecnicas r ON j.tecnica_id = r.id WHERE j.${singular}_id = '${entity.id}'`)).rows;
            console.log("Success for entity", entity.id);
        }
    } catch (e) {
        console.error("Error:", e);
    }
}
run();
