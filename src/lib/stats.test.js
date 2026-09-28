import { describe, it, expect } from "vitest";
import { filterJobs, kpis, countByStatus, weeklyTrend, DEFAULT_FILTERS } from "./stats.js";

const today = new Date("2026-09-28T12:00:00");
const jobs = [
  { id: "1", company: "Acme", role: "Frontend Dev", location: "Dublin", mode: "Hybrid", source: "LinkedIn", status: "Applied", dateApplied: "2026-09-25", tags: ["React"] },
  { id: "2", company: "Beta", role: "UI Engineer", location: "Cork", mode: "Remote", source: "Indeed", status: "Interview", dateApplied: "2026-09-10", tags: ["Vue"] },
  { id: "3", company: "Gamma", role: "Web Dev", location: "Dublin", mode: "On-site", source: "LinkedIn", status: "Offer", dateApplied: "2026-06-01", tags: [] },
  { id: "4", company: "Delta", role: "React Dev", location: "Galway", mode: "Hybrid", source: "Referral", status: "Wishlist", dateApplied: "2026-09-27", tags: ["React"] },
];

describe("filterJobs", () => {
  it("returns everything with default filters, newest first", () => {
    expect(filterJobs(jobs, DEFAULT_FILTERS, today).map((j) => j.id)).toEqual(["4", "1", "2", "3"]);
  });
  it("searches across company, role and tags", () => {
    expect(filterJobs(jobs, { ...DEFAULT_FILTERS, search: "react" }, today).map((j) => j.id)).toEqual(["4", "1"]);
  });
  it("combines status, source and date-range filters", () => {
    const f = { ...DEFAULT_FILTERS, statuses: ["Applied", "Offer"], source: "LinkedIn", range: "30" };
    expect(filterJobs(jobs, f, today).map((j) => j.id)).toEqual(["1"]);
  });
});

describe("kpis", () => {
  it("excludes wishlist items from conversion rates", () => {
    expect(kpis(jobs)).toEqual({ total: 4, active: 2, interviewRate: 67, offerRate: 33 });
  });
  it("handles an empty list", () => {
    expect(kpis([])).toEqual({ total: 0, active: 0, interviewRate: 0, offerRate: 0 });
  });
});

describe("aggregations", () => {
  it("counts every status, including zeros", () => {
    expect(countByStatus(jobs).find((s) => s.status === "Rejected").count).toBe(0);
  });
  it("buckets submitted applications into weeks", () => {
    const trend = weeklyTrend(jobs, 8, today);
    expect(trend).toHaveLength(8);
    expect(trend.reduce((s, w) => s + w.count, 0)).toBe(2); // Offer from June is outside the window; wishlist excluded
  });
});
