// pages/api/analyze.js
export default function handler(req, res) {
  const url = req.body;
  // VERY dummy EEAT check
  const https = url.startsWith('https') ? 100 : 0;
  const hasAuthor = Math.random() > 0.5 ? 100 : 0;
  const eeat = { Experience: 50, Expertise: hasAuthor, Authoritativeness: 40, Trustworthiness: https };
  res.status(200).json(eeat);
}
