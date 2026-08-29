export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const episodeId = req.query.episode;
  if (!episodeId) {
    return res.status(400).json({ error: 'Episode ID required' });
  }

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL || 'https://touching-joey-224063.upstash.io';
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!upstashToken) {
    return res.status(200).json({ views: 1 });
  }

  try {
    const response = await fetch(`${upstashUrl}/incr/views:${encodeURIComponent(episodeId)}`, {
      headers: {
        Authorization: `Bearer ${upstashToken}`
      }
    });

    const data = await response.json();
    return res.status(200).json({ views: data.result || 1 });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to increment view count', views: 1 });
  }
}
