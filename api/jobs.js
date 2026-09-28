// Vercel serverless function: GET /api/jobs?page=1&q=react&remote=true
// Proxies the free Arbeitnow job board API (no key needed), normalises the
// shape, filters server-side and adds a short CDN cache.
const SOURCE = "https://www.arbeitnow.com/api/job-board-api";

export default async function handler(req, res) {
  const page = Math.max(1, parseInt(req.query.page ?? "1", 10) || 1);
  const q = String(req.query.q ?? "").trim().toLowerCase();
  const remoteOnly = req.query.remote === "true";

  try {
    const upstream = await fetch(`${SOURCE}?page=${page}`, {
      headers: { Accept: "application/json" },
    });
    if (!upstream.ok) {
      return res.status(502).json({ error: `Upstream returned ${upstream.status}` });
    }
    const body = await upstream.json();
    let jobs = (body.data ?? []).map((j) => ({
      id: j.slug,
      title: j.title,
      company: j.company_name,
      location: j.location,
      remote: Boolean(j.remote),
      tags: [...(j.tags ?? []), ...(j.job_types ?? [])].slice(0, 5),
      url: j.url,
      postedAt: new Date(j.created_at * 1000).toISOString(),
    }));
    if (q) {
      jobs = jobs.filter((j) =>
        [j.title, j.company, j.location, ...j.tags].join(" ").toLowerCase().includes(q)
      );
    }
    if (remoteOnly) jobs = jobs.filter((j) => j.remote);

    res.setHeader("Cache-Control", "s-maxage=600, stale-while-revalidate=3600");
    return res.status(200).json({ page, hasMore: Boolean(body.links?.next), jobs });
  } catch (err) {
    return res.status(500).json({ error: "Could not reach the job feed", detail: String(err) });
  }
}
