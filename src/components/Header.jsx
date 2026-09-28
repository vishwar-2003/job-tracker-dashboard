import { useRef, useState } from "react";

export default function Header({ tab, onTab, onAdd, onExport, onImport, onReset }) {
  const fileRef = useRef(null);
  const [menu, setMenu] = useState(false);

  return (
    <header className="header">
      <div className="brand">
        <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true">
          <rect width="32" height="32" rx="7" fill="var(--accent)" />
          <path d="M9 17l5 5 9-12" stroke="#fff" strokeWidth="3.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span>JobTrail</span>
      </div>

      <nav className="tabs" aria-label="Sections">
        <button className={tab === "tracker" ? "on" : ""} aria-current={tab === "tracker"} onClick={() => onTab("tracker")}>Tracker</button>
        <button className={tab === "discover" ? "on" : ""} aria-current={tab === "discover"} onClick={() => onTab("discover")}>Discover</button>
      </nav>

      <div className="header-actions">
        <button className="btn primary" onClick={onAdd}>
          <span aria-hidden="true">+</span>Add<span className="hide-sm">&nbsp;application</span>
        </button>
        <div className="menu-wrap">
          <button className="btn ghost icon" aria-label="More actions" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="5" cy="12" r="2" fill="currentColor"/><circle cx="12" cy="12" r="2" fill="currentColor"/><circle cx="19" cy="12" r="2" fill="currentColor"/></svg>
          </button>
          {menu && (
            <div className="menu" role="menu" onMouseLeave={() => setMenu(false)}>
              <button role="menuitem" onClick={() => { onExport(); setMenu(false); }}>Export JSON</button>
              <button role="menuitem" onClick={() => { fileRef.current?.click(); setMenu(false); }}>Import JSON</button>
              <button role="menuitem" onClick={() => { onReset(); setMenu(false); }}>Restore sample data</button>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => { if (e.target.files?.[0]) onImport(e.target.files[0]); e.target.value = ""; }}
          />
        </div>
      </div>
    </header>
  );
}
