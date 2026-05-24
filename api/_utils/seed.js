import fs from 'fs';
import path from 'path';
import { db } from './db.js';

async function seed() {
    try {
        console.log('Seeding database...');
        
        // Lê o schema
        const schemaPath = path.join(process.cwd(), 'api', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf-8');
        
        // Divide o schema em comandos individuais (libSQL prefere uma por vez ou em batch)
        const statements = schema
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0);
            
        console.log(`Executando ${statements.length} comandos de schema...`);
        for (const stmt of statements) {
            await db.execute(stmt);
        }
        console.log('Schema criado com sucesso!');

        // TODO: Inserir Vantagens, Desvantagens, Técnicas e Perícias bases do 3DeT Victory aqui.
        // Como o original usava um dashboard, você pode exportar as tabelas do Supabase
        // para CSV ou JSON e iterar aqui para dar db.execute('INSERT INTO vantagens...')
        
        console.log('Seed concluído!');
    } catch (error) {
        console.error('Erro no seed:', error);
    }
}

seed();
