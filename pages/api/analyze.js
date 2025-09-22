// pages/api/analyze.js
export default async function handler(req, res) {
  // 1.  Accept POST only
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url } = JSON.parse(req.body);
    const hostname = new URL(url).hostname;

    /* ----------  AUTHORITATIVENESS (OpenPageRank)  ---------- */
    let authority = 0;
    try {
      const r = await fetch(
        `https://openpagerank.com/api/v1.0/getPageRank?domains%5B0%5D=${hostname}`,
        { headers: { 'API-OPR': process.env.OPENPAGERANK_KEY } }
      );
      const data = await r.json();
      const rank = data?.response?.[0]?.page_rank_integer ?? 0; // 0-10
      authority = Math.round(rank * 10);                        // 0-100
    } catch {
      authority = 0;
    }

    /* ----------  OTHER DIMENSIONS (placeholders)  ---------- */
    const https = url.startsWith('https') ? 100 : 0;
    const expertise = 50;
    const experience = 50;

    res.status(200).json({
      Experience: experience,
      Expertise: expertise,
      Authoritativeness: authority,
      Trustworthiness: https
    });
  } catch (e) {
    res.status(400).json({ error: 'Bad request' });
  }
}
