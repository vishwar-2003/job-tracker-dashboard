import { seedJobs } from "../data/seed.js";

const KEY = "jobtrail.jobs.v1";

// localStorage can throw (private mode, blocked storage) - never let it crash the app.
export function loadJobs() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* fall through to seed */
  }
  return seedJobs;
}

export function saveJobs(jobs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(jobs));
  } catch {
    /* storage unavailable - keep working in memory */
  }
}

export function newId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `job-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
