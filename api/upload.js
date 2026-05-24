import { put, get } from '@vercel/blob';
import { getUserFromReq } from './_utils/auth.js';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const user = await getUserFromReq(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET: Proxy/Retrieve private blob
  if (req.method === 'GET') {
    try {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const fileUrl = url.searchParams.get('url');
      
      if (!fileUrl) {
        return res.status(400).json({ error: 'File URL is required' });
      }

      console.log('Proxying private blob:', fileUrl);

      // Fetch the private blob using the SDK
      const { stream, blob } = await get(fileUrl, { access: 'private' });

      // Set headers
      res.setHeader('Content-Type', blob.contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');

      // Stream the content to the response
      return stream.pipe(res);
    } catch (error) {
      console.error('Proxy error:', error);
      return res.status(500).json({ error: 'Failed to fetch image', details: error.message });
    }
  }

  // POST: Upload file
  if (req.method === 'POST') {
    try {
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
        contentType: contentType,
      });

      console.log('Upload successful! URL:', blob.url);
      return res.status(200).json(blob);
    } catch (error) {
      console.error('Detailed upload error:', error);
      return res.status(500).json({ 
        error: 'Upload failed', 
        message: error.message
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
