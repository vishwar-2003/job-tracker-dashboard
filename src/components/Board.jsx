import { useState } from "react";
import { STATUSES } from "../lib/constants.js";
import { fmtDate } from "./StatusBadge.jsx";

// Kanban board. Desktop: drag cards between columns. Touch / keyboard:
// use the stage dropdown on each card.
export default function Board({ jobs, onEdit, onMove }) {
  const [over, setOver] = useState(null);

  return (
    <div className="board">
      {STATUSES.map((status) => {
        const col = jobs.filter((j) => j.status === status);
        return (
          <div
            key={status}
            className={`column ${over === status ? "drop" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setOver(status); }}
            onDragLeave={() => setOver(null)}
            onDrop={(e) => { e.preventDefault(); onMove(e.dataTransfer.getData("text/plain"), status); setOver(null); }}
          >
            <div className={`column-head st-${status.toLowerCase()}`}>
              <span className="dot" aria-hidden="true" />
              <h3>{status}</h3>
              <span className="count">{col.length}</span>
            </div>
            <div className="column-body">
              {col.map((j) => (
                <article
                  key={j.id}
                  className="card"
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/plain", j.id)}
                >
                  <button className="card-main" onClick={() => onEdit(j)}>
                    <strong>{j.company}</strong>
                    <span>{j.role}</span>
                    <span className="muted small">{fmtDate(j.dateApplied)} - {j.mode}</span>
                  </button>
                  <label className="card-move">
                    <span className="sr-only">Move {j.company} to stage</span>
                    <select value={j.status} onChange={(e) => onMove(j.id, e.target.value)}>
                      {STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </label>
                </article>
              ))}
              {!col.length && <p className="column-empty">Drop here</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
