import { useEffect, useRef, useState } from "react";
import { STATUSES, SOURCES, WORK_MODES } from "../lib/constants.js";

const blank = {
  company: "", role: "", location: "Dublin", mode: "Hybrid", source: "LinkedIn", status: "Applied",
  dateApplied: new Date().toISOString().slice(0, 10), salary: "", tags: [], url: "", notes: "",
};

export default function JobForm({ job, onSave, onDelete, onClose }) {
  const isNew = !job.id;
  const [form, setForm] = useState({ ...blank, ...job });
  const [tagText, setTagText] = useState((job.tags ?? []).join(", "));
  const [errors, setErrors] = useState({});
  const first = useRef(null);

  useEffect(() => {
    first.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.company.trim()) errs.company = "Company is required";
    if (!form.role.trim()) errs.role = "Role is required";
    if (form.url && !/^https?:\/\//i.test(form.url)) errs.url = "Use a full link starting with http(s)://";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    onSave({
      ...form,
      company: form.company.trim(),
      role: form.role.trim(),
      tags: tagText.split(",").map((t) => t.trim()).filter(Boolean),
    });
  };

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form className="dialog" role="dialog" aria-modal="true" aria-labelledby="form-title" onSubmit={submit} noValidate>
        <div className="dialog-head">
          <h2 id="form-title">{isNew ? "Add application" : `Edit ${job.company}`}</h2>
          <button type="button" className="btn ghost icon" aria-label="Close" onClick={onClose}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>

        <div className="grid2">
          <Field label="Company" error={errors.company}>
            <input ref={first} value={form.company} onChange={set("company")} aria-invalid={!!errors.company} />
          </Field>
          <Field label="Role" error={errors.role}>
            <input value={form.role} onChange={set("role")} aria-invalid={!!errors.role} />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={set("status")}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
          </Field>
          <Field label="Date applied">
            <input type="date" value={form.dateApplied} onChange={set("dateApplied")} />
          </Field>
          <Field label="Location">
            <input value={form.location} onChange={set("location")} />
          </Field>
          <Field label="Work mode">
            <select value={form.mode} onChange={set("mode")}>{WORK_MODES.map((s) => <option key={s}>{s}</option>)}</select>
          </Field>
          <Field label="Source">
            <select value={form.source} onChange={set("source")}>{SOURCES.map((s) => <option key={s}>{s}</option>)}</select>
          </Field>
          <Field label="Salary (optional)">
            <input value={form.salary} onChange={set("salary")} placeholder="e.g. 55-65k" />
          </Field>
          <Field label="Job link" error={errors.url} wide>
            <input type="url" value={form.url} onChange={set("url")} placeholder="https://" aria-invalid={!!errors.url} />
          </Field>
          <Field label="Tags (comma separated)" wide>
            <input value={tagText} onChange={(e) => setTagText(e.target.value)} placeholder="React, TypeScript" />
          </Field>
          <Field label="Notes" wide>
            <textarea rows={3} value={form.notes} onChange={set("notes")} placeholder="Recruiter name, next steps, interview prep..." />
          </Field>
        </div>

        <div className="dialog-foot">
          {!isNew && (
            <button type="button" className="btn danger" onClick={() => confirm(`Delete ${job.company}?`) && onDelete(job.id)}>
              Delete
            </button>
          )}
          <span className="spacer" />
          <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn primary">{isNew ? "Add" : "Save changes"}</button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, wide, children }) {
  return (
    <label className={`field ${wide ? "wide" : ""}`}>
      <span>{label}</span>
      {children}
      {error && <small className="error">{error}</small>}
    </label>
  );
}
