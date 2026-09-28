import { STATUSES } from "./constants.js";

export const DEFAULT_FILTERS = {
  search: "",
  statuses: [],
  source: "All",
  mode: "All",
  range: "all",
  sort: "newest",
};

const RANGE_DAYS = { "7": 7, "30": 30, "90": 90 };

export function filterJobs(jobs, f, today = new Date()) {
  const q = f.search.trim().toLowerCase();
  const cutoff = RANGE_DAYS[f.range]
    ? new Date(today.getTime() - RANGE_DAYS[f.range] * 86400000)
    : null;

  const out = jobs.filter((j) => {
    if (f.statuses.length && !f.statuses.includes(j.status)) return false;
    if (f.source !== "All" && j.source !== f.source) return false;
    if (f.mode !== "All" && j.mode !== f.mode) return false;
    if (cutoff && new Date(j.dateApplied) < cutoff) return false;
    if (q) {
      const hay = [j.company, j.role, j.location, j.notes, ...(j.tags ?? [])].join(" ").toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const by = {
    newest: (a, b) => b.dateApplied.localeCompare(a.dateApplied),
    oldest: (a, b) => a.dateApplied.localeCompare(b.dateApplied),
    company: (a, b) => a.company.localeCompare(b.company),
    status: (a, b) => STATUSES.indexOf(a.status) - STATUSES.indexOf(b.status),
  };
  return out.sort(by[f.sort] ?? by.newest);
}

export function kpis(jobs) {
  const submitted = jobs.filter((j) => j.status !== "Wishlist");
  const reachedInterview = submitted.filter((j) => j.status === "Interview" || j.status === "Offer");
  const offers = submitted.filter((j) => j.status === "Offer");
  const active = jobs.filter((j) => ["Applied", "Interview"].includes(j.status));
  const pct = (n, d) => (d ? Math.round((n / d) * 100) : 0);
  return {
    total: jobs.length,
    active: active.length,
    interviewRate: pct(reachedInterview.length, submitted.length),
    offerRate: pct(offers.length, submitted.length),
  };
}

export function countByStatus(jobs) {
  return STATUSES.map((status) => ({ status, count: jobs.filter((j) => j.status === status).length }));
}

export function countBy(jobs, key) {
  const map = new Map();
  for (const j of jobs) map.set(j[key], (map.get(j[key]) ?? 0) + 1);
  return [...map.entries()].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
}

// Applications per ISO week (Monday start) for the last `weeks` weeks.
export function weeklyTrend(jobs, weeks = 8, today = new Date()) {
  const monday = (d) => {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
    return x;
  };
  const start = monday(today);
  const buckets = [];
  for (let i = weeks - 1; i >= 0; i--) {
    const w = new Date(start);
    w.setDate(w.getDate() - i * 7);
    buckets.push({ week: w, label: w.toLocaleDateString("en-IE", { day: "numeric", month: "short" }), count: 0 });
  }
  for (const j of jobs) {
    if (j.status === "Wishlist") continue;
    const wk = monday(j.dateApplied).getTime();
    const b = buckets.find((x) => x.week.getTime() === wk);
    if (b) b.count += 1;
  }
  return buckets.map(({ label, count }) => ({ label, count }));
}
