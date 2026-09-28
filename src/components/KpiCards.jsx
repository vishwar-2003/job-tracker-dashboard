import { kpis } from "../lib/stats.js";

export default function KpiCards({ jobs }) {
  const k = kpis(jobs);
  const cards = [
    { label: "Tracked", value: k.total, hint: "in current view" },
    { label: "In progress", value: k.active, hint: "applied or interviewing" },
    { label: "Interview rate", value: `${k.interviewRate}%`, hint: "of submitted applications" },
    { label: "Offer rate", value: `${k.offerRate}%`, hint: "of submitted applications" },
  ];
  return (
    <section className="kpis" aria-label="Key numbers">
      {cards.map((c) => (
        <div className="kpi" key={c.label}>
          <div className="kpi-label">{c.label}</div>
          <div className="kpi-value">{c.value}</div>
          <div className="kpi-hint">{c.hint}</div>
        </div>
      ))}
    </section>
  );
}
