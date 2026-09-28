import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header.jsx";
import KpiCards from "./components/KpiCards.jsx";
import Filters from "./components/Filters.jsx";
import ChartsPanel from "./components/ChartsPanel.jsx";
import JobTable from "./components/JobTable.jsx";
import Board from "./components/Board.jsx";
import JobForm from "./components/JobForm.jsx";
import Discover from "./components/Discover.jsx";
import { loadJobs, saveJobs, newId } from "./lib/storage.js";
import { filterJobs, DEFAULT_FILTERS } from "./lib/stats.js";
import { seedJobs } from "./data/seed.js";

export default function App() {
  const [jobs, setJobs] = useState(loadJobs);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [tab, setTab] = useState("tracker");
  const [view, setView] = useState("table");
  const [editing, setEditing] = useState(null); // null | {} (new) | job
  const [toast, setToast] = useState("");

  useEffect(() => saveJobs(jobs), [jobs]);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  const visible = useMemo(() => filterJobs(jobs, filters), [jobs, filters]);

  const upsert = (job) => {
    const stamped = { ...job, updatedAt: new Date().toISOString() };
    setJobs((prev) =>
      job.id && prev.some((j) => j.id === job.id)
        ? prev.map((j) => (j.id === job.id ? stamped : j))
        : [{ ...stamped, id: newId() }, ...prev]
    );
    setEditing(null);
    setToast(job.id ? "Application updated" : "Application added");
  };

  const remove = (id) => {
    setJobs((prev) => prev.filter((j) => j.id !== id));
    setEditing(null);
    setToast("Application deleted");
  };

  const moveStatus = (id, status) =>
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status, updatedAt: new Date().toISOString() } : j)));

  const trackFromFeed = (job) => {
    if (jobs.some((j) => j.url && j.url === job.url)) {
      setToast("Already in your tracker");
      return;
    }
    upsert({
      company: job.company,
      role: job.title,
      location: job.location,
      mode: job.remote ? "Remote" : "On-site",
      source: "Arbeitnow",
      status: "Wishlist",
      dateApplied: new Date().toISOString().slice(0, 10),
      salary: "",
      tags: job.tags.slice(0, 3),
      url: job.url,
      notes: "",
    });
    setToast(`Saved ${job.company} to Wishlist`);
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(jobs, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `job-applications-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = async (file) => {
    try {
      const data = JSON.parse(await file.text());
      if (!Array.isArray(data)) throw new Error("Expected an array");
      setJobs(data.map((j) => ({ tags: [], notes: "", url: "", salary: "", ...j, id: j.id ?? newId() })));
      setToast(`Imported ${data.length} applications`);
    } catch {
      setToast("That file isn't a valid export");
    }
  };

  const resetDemo = () => {
    setJobs(seedJobs);
    setFilters(DEFAULT_FILTERS);
    setToast("Sample data restored");
  };

  return (
    <div className="app">
      <Header
        tab={tab}
        onTab={setTab}
        onAdd={() => setEditing({})}
        onExport={exportJson}
        onImport={importJson}
        onReset={resetDemo}
      />

      <main className="main">
        {tab === "tracker" ? (
          <>
            <KpiCards jobs={visible} />
            <Filters filters={filters} onChange={setFilters} count={visible.length} total={jobs.length} />
            <ChartsPanel jobs={visible} />
            <section className="panel" aria-labelledby="apps-heading">
              <div className="panel-head">
                <h2 id="apps-heading">Applications</h2>
                <div className="segmented" role="tablist" aria-label="View">
                  {["table", "board"].map((v) => (
                    <button key={v} role="tab" aria-selected={view === v} className={view === v ? "on" : ""} onClick={() => setView(v)}>
                      {v === "table" ? "List" : "Board"}
                    </button>
                  ))}
                </div>
              </div>
              {view === "table" ? (
                <JobTable jobs={visible} onEdit={setEditing} />
              ) : (
                <Board jobs={visible} onEdit={setEditing} onMove={moveStatus} />
              )}
            </section>
          </>
        ) : (
          <Discover onTrack={trackFromFeed} trackedUrls={new Set(jobs.map((j) => j.url).filter(Boolean))} />
        )}
      </main>

      {editing && <JobForm job={editing} onSave={upsert} onDelete={remove} onClose={() => setEditing(null)} />}
      <div className={`toast ${toast ? "show" : ""}`} role="status" aria-live="polite">{toast}</div>
    </div>
  );
}
