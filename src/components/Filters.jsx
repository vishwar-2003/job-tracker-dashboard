import { STATUSES, SOURCES, WORK_MODES } from "../lib/constants.js";
import { DEFAULT_FILTERS } from "../lib/stats.js";

export default function Filters({ filters, onChange, count, total }) {
  const set = (patch) => onChange({ ...filters, ...patch });
  const toggleStatus = (s) =>
    set({ statuses: filters.statuses.includes(s) ? filters.statuses.filter((x) => x !== s) : [...filters.statuses, s] });
  const dirty = JSON.stringify(filters) !== JSON.stringify(DEFAULT_FILTERS);

  return (
    <section className="panel filters" aria-label="Filters">
      <div className="filter-row">
        <label className="search">
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" fill="none"/><path d="M20 20l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          <span className="sr-only">Search</span>
          <input
            type="search"
            placeholder="Search company, role, tag..."
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
          />
        </label>

        <Select label="Source" value={filters.source} options={["All", ...SOURCES]} onChange={(v) => set({ source: v })} />
        <Select label="Work mode" value={filters.mode} options={["All", ...WORK_MODES]} onChange={(v) => set({ mode: v })} />
        <Select
          label="Applied"
          value={filters.range}
          options={[["all", "Any time"], ["7", "Last 7 days"], ["30", "Last 30 days"], ["90", "Last 90 days"]]}
          onChange={(v) => set({ range: v })}
        />
        <Select
          label="Sort"
          value={filters.sort}
          options={[["newest", "Newest"], ["oldest", "Oldest"], ["company", "Company A-Z"], ["status", "Pipeline stage"]]}
          onChange={(v) => set({ sort: v })}
        />
      </div>

      <div className="filter-row chips-row">
        <div className="chips" role="group" aria-label="Status">
          {STATUSES.map((s) => (
            <button
              key={s}
              className={`chip st-${s.toLowerCase()} ${filters.statuses.includes(s) ? "on" : ""}`}
              aria-pressed={filters.statuses.includes(s)}
              onClick={() => toggleStatus(s)}
            >
              <span className="dot" aria-hidden="true" />
              {s}
            </button>
          ))}
        </div>
        <div className="result-count">
          Showing <strong>{count}</strong> of {total}
          {dirty && <button className="link" onClick={() => onChange(DEFAULT_FILTERS)}>Clear filters</button>}
        </div>
      </div>
    </section>
  );
}

function Select({ label, value, options, onChange }) {
  return (
    <label className="select">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => {
          const [v, t] = Array.isArray(o) ? o : [o, o];
          return <option key={v} value={v}>{t}</option>;
        })}
      </select>
    </label>
  );
}
