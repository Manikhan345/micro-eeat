// pages/api/analyze.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = JSON.parse(req.body);        // parse body first
    const url  = body.url;
    if (!url) throw new Error('missing url');

    const hostname = new URL(url).hostname;

    // OpenPageRank live call
    const opr = await fetch(
      `https://openpagerank.com/api/v1.0/getPageRank?domains%5B0%5D=${hostname}`,
      { headers: { 'API-OPR': process.env.OPENPAGERANK_KEY } }
    );
    const data = await opr.json();
    const rank = data?.response?.[0]?.page_rank_integer ?? 0; // 0-10
    const authority = Math.round(rank * 10);                  // 0-100

    res.status(200).json({
      Experience: 50,
      Expertise: 50,
      Authoritativeness: authority,
      Trustworthiness: url.startsWith('https') ? 100 : 0
    });
  } catch (e) {
    // always return JSON (never empty)
    res.status(400).json({
      Experience: 0,
      Expertise: 0,
      Authoritativeness: 0,
      Trustworthiness: 0,
      debug: e.message
    });
  }
}
