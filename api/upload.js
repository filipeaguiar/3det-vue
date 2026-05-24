import { put } from '@vercel/blob';
import { getUserFromReq } from './utils/auth.js';

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

    const blob = await put(filename, req, {
      access: 'public',
    });

    return res.status(200).json(blob);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
