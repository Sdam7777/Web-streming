// In-Memory Serverless Instance Cache
const viewMemoryCache = new Map();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

export default async function handler(req, res) {
  // Enable CORS & Edge CDN Caching headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
  res.setHeader('CDN-Cache-Control', 'max-age=300');
  res.setHeader('Vercel-CDN-Cache-Control', 'max-age=300');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const episodeId = req.query.episode;
  if (!episodeId) {
    return res.status(400).json({ error: 'Episode ID required' });
  }

  // Check In-Memory Serverless Instance Cache first
  const cached = viewMemoryCache.get(episodeId);
  if (cached && (Date.now() - cached.timestamp < CACHE_TTL_MS)) {
    return res.status(200).json({ views: cached.views, source: 'edge-memory-cache' });
  }

  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL || 'https://touching-joey-224063.upstash.io';
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!upstashToken) {
    return res.status(200).json({ views: 1, source: 'fallback' });
  }

  try {
    const response = await fetch(`${upstashUrl}/incr/views:${encodeURIComponent(episodeId)}`, {
      headers: {
        Authorization: `Bearer ${upstashToken}`
      }
    });

    const data = await response.json();
    const views = data.result || 1;

    // Store in Serverless Instance Memory Cache
    viewMemoryCache.set(episodeId, { views, timestamp: Date.now() });

    return res.status(200).json({ views, source: 'upstash-redis' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to increment view count', views: 1 });
  }
}
