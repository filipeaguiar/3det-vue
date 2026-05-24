import { put } from '@vercel/blob';
import { getUserFromReq } from './_utils/auth.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await getUserFromReq(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const filename = url.searchParams.get('filename') || 'image-' + Date.now();
    
    console.log('Attempting upload for file:', filename);

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('Missing BLOB_READ_WRITE_TOKEN environment variable');
      return res.status(500).json({ error: 'Storage configuration missing' });
    }

    const blob = await put(filename, req, {
      access: 'public',
    });

    console.log('Upload successful:', blob.url);
    return res.status(200).json(blob);
  } catch (error) {
    console.error('Detailed upload error:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}
