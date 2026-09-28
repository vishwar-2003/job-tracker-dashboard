import { useCallback, useEffect, useState } from "react";
import { fmtDate } from "./StatusBadge.jsx";

const DIRECT = "https://www.arbeitnow.com/api/job-board-api";

// Normalise the raw Arbeitnow shape (used when calling the API directly).
const normalise = (j) => ({
  id: j.slug,
  title: j.title,
  company: j.company_name,
  location: j.location,
  remote: Boolean(j.remote),
  tags: [...(j.tags ?? []), ...(j.job_types ?? [])].slice(0, 5),
  url: j.url,
  postedAt: new Date(j.created_at * 1000).toISOString(),
});

async function fetchPage(page) {
  // 1) Our own backend (Vercel function / Vite dev proxy)
  try {
    const r = await fetch(`/api/jobs?page=${page}`);
    if (r.ok) {
      const body = await r.json();
      if (Array.isArray(body.jobs)) return { jobs: body.jobs, hasMore: body.hasMore };
      if (Array.isArray(body.data)) return { jobs: body.data.map(normalise), hasMore: Boolean(body.links?.next) };
    }
  } catch { /* fall through */ }
  // 2) Straight to the public API
  const r = await fetch(`${DIRECT}?page=${page}`);
  if (!r.ok) throw new Error(`Feed returned ${r.status}`);
  const body = await r.json();
  return { jobs: body.data.map(normalise), hasMore: Boolean(body.links?.next) };
}

export default function Discover({ onTrack, trackedUrls }) {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [state, setState] = useState("loading"); // loading | ready | error
  const [q, setQ] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);

  const load = useCallback(async (p) => {
    setState("loading");
    try {
      const res = await fetchPage(p);
      setJobs((prev) => (p === 1 ? res.jobs : [...prev, ...res.jobs.filter((j) => !prev.some((x) => x.id === j.id))]));
      setHasMore(res.hasMore);
      setPage(p);
      setState("ready");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => { load(1); }, [load]);

  const needle = q.trim().toLowerCase();
  const shown = jobs.filter(
    (j) =>
      (!remoteOnly || j.remote) &&
      (!needle || [j.title, j.company, j.location, ...j.tags].join(" ").toLowerCase().includes(needle))
  );

  return (
    <section className="panel" aria-labelledby="discover-heading">
      <div className="panel-head">
        <div>
          <h2 id="discover-heading">Discover jobs</h2>
          <p className="muted small">Live listings from the free Arbeitnow job board API. Save any role straight to your Wishlist.</p>
        </div>
      </div>

      <div className="filter-row">
        <label className="search">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          <span className="sr-only">Search listings</span>
          <input type="search" placeholder="Filter by title, company, skill..." value={q} onChange={(e) => setQ(e.target.value)} />
        </label>
        <label className="toggle">
          <input type="checkbox" checked={remoteOnly} onChange={(e) => setRemoteOnly(e.target.checked)} />
          <span>Remote only</span>
        </label>
      </div>

      {state === "error" && jobs.length === 0 ? (
        <div className="empty">
          <p><strong>Couldn't load the live job feed.</strong></p>
          <p className="muted">The public API may be unreachable from here. Deployed on Vercel, the /api/jobs function fetches it server-side.</p>
          <button className="btn" onClick={() => load(1)}>Try again</button>
        </div>
      ) : (
        <>
          <div className="feed">
            {shown.map((j) => {
              const saved = trackedUrls.has(j.url);
              return (
                <article key={j.id} className="feed-card">
                  <div className="feed-top">
                    <span className="avatar" aria-hidden="true">{j.company.slice(0, 1)}</span>
                    <div>
                      <h3><a href={j.url} target="_blank" rel="noreferrer">{j.title}</a></h3>
                      <p className="muted small">{j.company} - {j.location}{j.remote ? " - Remote" : ""}</p>
                    </div>
                  </div>
                  <div className="tags">{j.tags.map((t) => <span key={t} className="tag">{t}</span>)}</div>
                  <div className="feed-foot">
                    <span className="muted small">Posted {fmtDate(j.postedAt)}</span>
                    <button className={`btn small ${saved ? "ghost" : "primary"}`} disabled={saved} onClick={() => onTrack(j)}>
                      {saved ? "Saved" : "Track"}
                    </button>
                  </div>
                </article>
              );
            })}
            {state === "loading" && Array.from({ length: 6 }).map((_, i) => <div key={i} className="feed-card skeleton" aria-hidden="true" />)}
          </div>
          {state === "ready" && !shown.length && <div className="empty"><p className="muted">No listings match on the loaded pages. Load more or change the filter.</p></div>}
          {hasMore && state !== "loading" && (
            <div className="center"><button className="btn" onClick={() => load(page + 1)}>Load more</button></div>
          )}
        </>
      )}
    </section>
  );
}
