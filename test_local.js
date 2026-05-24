import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
    const token = jwt.sign({ userId: '274c3e85-6ada-4de9-a12a-a13b019bb7bf', email: 'filipe_aac@yahoo.com.br' }, process.env.JWT_SECRET || 'fallback_secret');
    
    console.log("Testing local npcs...");
    const res = await fetch("http://localhost:5173/api/entities/npcs", {
        headers: { "Authorization": `Bearer ${token}` }
    });
    console.log("Status:", res.status);
    console.log("Body:", await res.text());
}

test();
