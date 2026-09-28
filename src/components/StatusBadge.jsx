export default function StatusBadge({ status }) {
  return (
    <span className={`badge st-${status.toLowerCase()}`}>
      <span className="dot" aria-hidden="true" />
      {status}
    </span>
  );
}

export const fmtDate = (iso) =>
  iso ? new Date(iso).toLocaleDateString("en-IE", { day: "numeric", month: "short", year: "numeric" }) : "-";
