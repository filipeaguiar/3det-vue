import handler from './api/entities/[type]/index.js';

const req = {
    method: 'GET',
    query: { type: 'npcs' },
    headers: {
        authorization: 'Bearer ' + require('jsonwebtoken').sign({ userId: '274c3e85-6ada-4de9-a12a-a13b019bb7bf', email: 'filipe_aac@yahoo.com.br' }, process.env.JWT_SECRET || 'fallback_secret')
    }
};

const res = {
    status: (code) => {
        console.log('Status:', code);
        return res;
    },
    json: (data) => {
        console.log('Response:', data);
    }
};

handler(req, res).catch(console.error);
