import { get } from '@vercel/blob';
import { getUserFromReq } from '../_utils/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const user = await getUserFromReq(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { url: fileUrl } = req.query;
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
