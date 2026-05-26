"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Status = "Saved" | "Applied" | "Interview" | "Offer" | "Rejected";

interface Application {
  id: string;
  company: string;
  role: string;
  status: Status;
  date: string;
  notes: string;
  url: string;
}

const STATUS_COLORS: Record<Status, string> = {
  Saved: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  Applied: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  Interview: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  Offer: "bg-green-500/20 text-green-400 border-green-500/30",
  Rejected: "bg-red-500/20 text-red-400 border-red-500/30",
};

const STATUSES: Status[] = ["Saved", "Applied", "Interview", "Offer", "Rejected"];

const empty: Application = {
  id: "",
  company: "",
  role: "",
  status: "Saved",
  date: new Date().toISOString().split("T")[0],
  notes: "",
  url: "",
};

export default function TrackerPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Application>(empty);
  const [filter, setFilter] = useState<Status | "All">("All");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("missionnext-tracker");
    if (stored) setApps(JSON.parse(stored));
  }, []);

  const save = (updated: Application[]) => {
    setApps(updated);
    localStorage.setItem("missionnext-tracker", JSON.stringify(updated));
  };

  const handleSubmit = () => {
    if (!form.company || !form.role) return;
    if (editId) {
      save(apps.map((a) => (a.id === editId ? { ...form, id: editId } : a)));
      setEditId(null);
    } else {
      save([{ ...form, id: Date.now().toString() }, ...apps]);
    }
    setForm(empty);
    setShowForm(false);
  };

  const handleEdit = (app: Application) => {
    setForm(app);
    setEditId(app.id);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    save(apps.filter((a) => a.id !== id));
  };

  const filtered = filter === "All" ? apps : apps.filter((a) => a.status === filter);

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = apps.filter((a) => a.status === s).length;
    return acc;
  }, {} as Record<Status, number>);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-500 hover:text-white transition-colors">← Back</Link>
            <div>
              <h1 className="text-3xl font-bold">Application Tracker</h1>
              <p className="text-gray-400 text-sm">Track every application in one place</p>
            </div>
          </div>
          <button
            onClick={() => { setForm(empty); setEditId(null); setShowForm(true); }}
            className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-semibold transition-all"
          >
            + Add Application
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-5 gap-3 mb-8">
          {STATUSES.map((s) => (
            <div key={s} className="bg-gray-900 border border-gray-700 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold">{counts[s]}</p>
              <p className="text-xs text-gray-400 mt-1">{s}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {(["All", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full text-sm border transition-all ${
                filter === s
                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                  : "bg-gray-900 text-gray-400 border-gray-700 hover:border-gray-500"
              }`}
            >
              {s} {s !== "All" && `(${counts[s]})`}
            </button>
          ))}
        </div>

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">{editId ? "Edit Application" : "New Application"}</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input
                placeholder="Company *"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className="p-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              />
              <input
                placeholder="Role / Title *"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="p-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                className="p-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:border-green-500"
              >
                {STATUSES.map((s) => <option key={s}>{s}</option>)}
              </select>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="p-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:border-green-500"
              />
              <input
                placeholder="Job URL (optional)"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                className="p-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 col-span-2"
              />
              <textarea
                placeholder="Notes (optional)"
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="p-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 col-span-2 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-sm font-semibold transition-all"
              >
                {editId ? "Save Changes" : "Add Application"}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditId(null); setForm(empty); }}
                className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-semibold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Applications List */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-4xl mb-4">📋</p>
            <p>No applications yet. Add your first one!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => (
              <div key={app.id} className="bg-gray-900 border border-gray-700 rounded-xl p-5 flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold truncate">{app.company}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${STATUS_COLORS[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">{app.role}</p>
                  {app.notes && <p className="text-xs text-gray-500 mt-1 truncate">{app.notes}</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-500">{app.date}</span>
                  {app.url && (
                    <a href={app.url} target="_blank" className="text-xs text-green-400 hover:underline">
                      View
                    </a>
                  )}
                  <button onClick={() => handleEdit(app)} className="text-xs text-gray-400 hover:text-white transition-colors">
                    Edit
                  </button>
                    <Link
                    href={`/interview-prep/${app.id}`}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                    Interview Prep
                    </Link>
                    <button onClick={() => handleDelete(app.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors">
                    Delete
                    </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
