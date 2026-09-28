import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell, AreaChart, Area } from "recharts";
import { countByStatus, countBy, weeklyTrend } from "../lib/stats.js";

const axis = { stroke: "var(--muted)", fontSize: 12, tickLine: false, axisLine: false };
const tooltipStyle = {
  contentStyle: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 13, color: "var(--text)" },
  labelStyle: { color: "var(--text)", fontWeight: 600 },
  cursor: { fill: "var(--hover)" },
};

export default function ChartsPanel({ jobs }) {
  const trend = weeklyTrend(jobs);
  const pipeline = countByStatus(jobs);
  const sources = countBy(jobs, "source").slice(0, 6);

  if (!jobs.length) return null;

  return (
    <section className="charts" aria-label="Charts">
      <figure className="panel chart wide">
        <figcaption>
          <h3>Applications per week</h3>
          <p>Submitted applications over the last 8 weeks</p>
        </figcaption>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.28} />
                  <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke="var(--grid)" />
              <XAxis dataKey="label" {...axis} interval="preserveStartEnd" />
              <YAxis allowDecimals={false} {...axis} />
              <Tooltip {...tooltipStyle} cursor={{ stroke: "var(--border)" }} formatter={(v) => [v, "Applications"]} labelFormatter={(l) => `Week of ${l}`} />
              <Area type="monotone" dataKey="count" stroke="var(--accent)" strokeWidth={2} fill="url(#trendFill)" dot={{ r: 3, fill: "var(--accent)" }} activeDot={{ r: 5 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </figure>

      <figure className="panel chart">
        <figcaption>
          <h3>Pipeline</h3>
          <p>Where each application stands</p>
        </figcaption>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipeline} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="var(--grid)" />
              <XAxis dataKey="status" {...axis} />
              <YAxis allowDecimals={false} {...axis} />
              <Tooltip {...tooltipStyle} formatter={(v) => [v, "Applications"]} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={44}>
                {pipeline.map((p) => <Cell key={p.status} fill={`var(--st-${p.status.toLowerCase()})`} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </figure>

      <figure className="panel chart">
        <figcaption>
          <h3>Top sources</h3>
          <p>Where your applications come from</p>
        </figcaption>
        <div className="chart-box">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sources} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
              <CartesianGrid horizontal={false} stroke="var(--grid)" />
              <XAxis type="number" allowDecimals={false} {...axis} />
              <YAxis type="category" dataKey="name" width={92} {...axis} />
              <Tooltip {...tooltipStyle} formatter={(v) => [v, "Applications"]} />
              <Bar dataKey="count" fill="var(--accent)" radius={[0, 6, 6, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </figure>
    </section>
  );
}
