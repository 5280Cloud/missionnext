"use client";

import { useState } from "react";
import Link from "next/link";

const PRESET_COMPANIES = [
  { name: "Anthropic", url: "https://www.anthropic.com/careers" },
  { name: "Amazon", url: "https://www.amazon.jobs" },
  { name: "Microsoft", url: "https://careers.microsoft.com" },
  { name: "Google", url: "https://careers.google.com" },
  { name: "Booz Allen", url: "https://careers.boozallen.com" },
  { name: "Leidos", url: "https://careers.leidos.com" },
  { name: "SAIC", url: "https://www.saic.com/careers" },
  { name: "Raytheon", url: "https://careers.rtx.com" },
  { name: "CACI", url: "https://careers.caci.com" },
  { name: "Palantir", url: "https://www.palantir.com/careers" },
];

interface Job {
  title: string;
  company: string;
  location: string;
  url: string;
  description: string;
}

export default function ScannerPage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [linkedinOnly, setLinkedinOnly] = useState(false);
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [customUrl, setCustomUrl] = useState("");
  const [customUrls, setCustomUrls] = useState<{ name: string; url: string }[]>([]);
  const [results, setResults] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const toggleCompany = (name: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(name) ? prev.filter((c) => c !== name) : [...prev, name]
    );
  };

  const addCustomUrl = () => {
    if (!customUrl.trim()) return;
    try {
      const name = new URL(customUrl).hostname.replace("www.", "");
      setCustomUrls((prev) => [...prev, { name, url: customUrl }]);
      setCustomUrl("");
    } catch {
      setError("Invalid URL format");
    }
  };

  const handleScan = async () => {
    const stored = localStorage.getItem("missionnext-config");
    if (!stored) { setError("Please configure your AI provider in Settings first."); return; }
    const config = JSON.parse(stored);
    setLoading(true);
    setError("");
    setResults([]);
    setSearched(false);
    const selectedPresets = PRESET_COMPANIES.filter((c) => selectedCompanies.includes(c.name));
    const allTargets = [...selectedPresets, ...customUrls];
    try {
      const response = await fetch("/api/scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: config.apiKey,
          model: config.model,
          provider: config.provider,
          keyword,
          location,
          linkedinOnly,
          targets: allTargets,
        }),
      });
      if (!response.ok) throw new Error("Scan failed");
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResults(data.jobs || []);
      setSearched(true);
    } catch (err) {
      setError("Scan failed. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors">Back</Link>
          <div>
            <h1 className="text-3xl font-bold">Job Scanner</h1>
            <p className="text-gray-400 text-sm">Search LinkedIn and company career pages</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <input
            placeholder="Job title or keyword (e.g. Cloud Engineer)"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            className="p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-600 focus:outline-none focus:border-green-500"
          />
          <input
            placeholder="Location (e.g. Remote, Virginia, DC)"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-600 focus:outline-none focus:border-green-500"
          />
        </div>

        <div
          onClick={() => setLinkedinOnly(!linkedinOnly)}
          className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer mb-6 transition-all ${linkedinOnly ? "border-blue-500 bg-blue-500/10" : "border-gray-700 bg-gray-900 hover:border-gray-500"}`}
        >
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${linkedinOnly ? "border-blue-500 bg-blue-500" : "border-gray-500"}`}>
            {linkedinOnly && <span className="text-white text-xs">✓</span>}
          </div>
          <div>
            <p className="font-medium text-sm">Include LinkedIn</p>
            <p className="text-xs text-gray-400">Search LinkedIn jobs in addition to company pages</p>
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">Company Career Pages</label>
          <div className="grid grid-cols-5 gap-2">
            {PRESET_COMPANIES.map((c) => (
              <button
                key={c.name}
                onClick={() => toggleCompany(c.name)}
                className={`p-2 rounded-lg border text-xs font-medium transition-all ${selectedCompanies.includes(c.name) ? "border-green-500 bg-green-500/10 text-green-400" : "border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500"}`}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">Add Custom Career Page</label>
          <div className="flex gap-3">
            <input
              placeholder="https://careers.example.com"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustomUrl()}
              className="flex-1 p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-600 focus:outline-none focus:border-green-500"
            />
            <button onClick={addCustomUrl} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-all">
              Add
            </button>
          </div>
          {customUrls.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {customUrls.map((u) => (
                <span key={u.url} className="text-xs px-3 py-1 bg-gray-800 border border-gray-700 rounded-full text-gray-300 flex items-center gap-2">
                  {u.name}
                  <button onClick={() => setCustomUrls((prev) => prev.filter((x) => x.url !== u.url))} className="text-gray-500 hover:text-red-400">x</button>
                </span>
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          onClick={handleScan}
          disabled={loading || !keyword.trim()}
          className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold transition-all mb-8"
        >
          {loading ? "Scanning..." : "Scan for Jobs"}
        </button>

        {searched && results.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p className="text-4xl mb-4">🔍</p>
            <p>No jobs found. Try different keywords or add more company pages.</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400">{results.length} jobs found</p>
            {results.map((job, i) => (
              <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-5">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-400">{job.company} · {job.location}</p>
                  </div>
                  <a href={job.url} target="_blank" rel="noreferrer" className="text-xs text-green-400 hover:underline shrink-0 ml-4">
                    View Job
                  </a>
                </div>
                {job.description && <p className="text-xs text-gray-500 mt-2">{job.description}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
