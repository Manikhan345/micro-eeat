// pages/api/analyze.js  (OpenPageRank edition)
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { url } = JSON.parse(req.body);
  const hostname = new URL(url).hostname;

  /* ----------  AUTHORITATIVENESS (live OpenPageRank)  ---------- */
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

  /* ----------  TRUSTWORTHINESS  ---------- */
  const https = url.startsWith('https') ? 100 : 0;

  /* ----------  EXPERTISE & EXPERIENCE (placeholders)  ---------- */
  const expertise = 50;
  const experience = 50;

  res.status(200).json({
    Experience: experience,
    Expertise: expertise,
    Authoritativeness: authority,
    Trustworthiness: https
  });
}
