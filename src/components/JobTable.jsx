import StatusBadge, { fmtDate } from "./StatusBadge.jsx";

export default function JobTable({ jobs, onEdit }) {
  if (!jobs.length) return <Empty />;
  return (
    <div className="table-wrap">
      <table className="jobs">
        <thead>
          <tr>
            <th>Company</th>
            <th>Role</th>
            <th>Status</th>
            <th>Applied</th>
            <th>Location</th>
            <th>Source</th>
            <th><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id} onClick={() => onEdit(j)} tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onEdit(j)}>
              <td data-label="Company">
                <div className="company">
                  <span className="avatar" aria-hidden="true">{j.company.slice(0, 1)}</span>
                  <strong>{j.company}</strong>
                </div>
              </td>
              <td data-label="Role">
                <div>{j.role}</div>
                {j.tags?.length > 0 && (
                  <div className="tags">{j.tags.slice(0, 3).map((t) => <span key={t} className="tag">{t}</span>)}</div>
                )}
              </td>
              <td data-label="Status"><StatusBadge status={j.status} /></td>
              <td data-label="Applied" className="num">{fmtDate(j.dateApplied)}</td>
              <td data-label="Location">{j.location}{j.mode !== j.location && <span className="muted"> - {j.mode}</span>}</td>
              <td data-label="Source">{j.source}</td>
              <td className="row-action">
                {j.url ? (
                  <a href={j.url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()} aria-label={`Open ${j.company} posting`}>
                    <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </a>
                ) : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Empty() {
  return (
    <div className="empty">
      <p><strong>No applications match these filters.</strong></p>
      <p className="muted">Try clearing a filter, or add a new application.</p>
    </div>
  );
}
