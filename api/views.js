export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
  if (req.method === 'OPTIONS') return res.status(200).end();
  const episodeId = req.query.episode;
  if (!episodeId) return res.status(400).json({ error: 'Episode ID required' });
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL || 'https://touching-joey-224063.upstash.io';
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!upstashToken) return res.status(200).json({ views: 1 });

  // Rate limit: 5 views per 10s per IP
  const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown').split(',')[0].trim();
  const rateKey = `ratelimit:views:${ip}`;
  try {
    const rlRes = await fetch(`${upstashUrl}/incr/${encodeURIComponent(rateKey)}`, { headers: { Authorization: `Bearer ${upstashToken}` } });
    const rlData = await rlRes.json();
    if (rlData.result === 1) {
      await fetch(`${upstashUrl}/expire/${encodeURIComponent(rateKey)}/10`, { headers: { Authorization: `Bearer ${upstashToken}` } });
    }
    if (rlData.result > 5) {
      return res.status(429).json({ error: 'Rate limited', views: 1 });
    }
  } catch (e) {}

  try {
    const response = await fetch(`${upstashUrl}/incr/views:${encodeURIComponent(episodeId)}`, { headers: { Authorization: `Bearer ${upstashToken}` } });
    const data = await response.json();
    return res.status(200).json({ views: data.result || 1 });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to increment view count', views: 1 });
  }
}
