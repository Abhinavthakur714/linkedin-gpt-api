export default async function handler(req, res) {
  const { feature, author, limit = 10 } = req.query;

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    return res.status(500).json({ error: "Missing Supabase credentials" });
  }

  const query = new URLSearchParams({
    select: "*",
    ...(feature && { features: `cs.{${feature}}` }),
    ...(author && { author: `ilike.*${author}*` }),
    limit: limit
  });

  const response = await fetch(`${SUPABASE_URL}/rest/v1/Linkedin_gaming_posts?${query.toString()}`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });

  if (!response.ok) {
    const err = await response.text();
    return res.status(response.status).json({ error: err });
  }

  const data = await response.json();
  res.status(200).json(data);
}
