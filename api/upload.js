import { put } from '@vercel/blob';
import { getUserFromReq } from './_utils/auth.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  console.log('Upload request received. Method:', req.method);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await getUserFromReq(req);
    if (!user) {
      console.warn('Unauthorized upload attempt');
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const filename = url.searchParams.get('filename') || `image-${Date.now()}`;
    const contentType = req.headers['content-type'] || 'application/octet-stream';
    
    console.log(`Attempting upload: ${filename} (${contentType})`);

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.error('CRITICAL: BLOB_READ_WRITE_TOKEN is not defined in process.env');
      return res.status(500).json({ error: 'Storage configuration missing on server' });
    }

    // Pass the request directly to put
    const blob = await put(filename, req, {
      access: 'private',
      contentType: contentType, // Help Vercel Blob identify the file type
    });

    console.log('Upload successful! URL:', blob.url);
    return res.status(200).json(blob);
  } catch (error) {
    console.error('Detailed upload error:', error);
    return res.status(500).json({ 
      error: 'Upload failed', 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
