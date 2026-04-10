"use client";

import { useState } from "react";
import Link from "next/link";

const gradeColor: Record<string, string> = {
  A: "text-green-400",
  B: "text-blue-400",
  C: "text-yellow-400",
  D: "text-orange-400",
  F: "text-red-400",
};

export default function ScorePage() {
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleScore = async () => {
    const stored = localStorage.getItem("missionnext-config");
    if (!stored) {
      setError("Please configure your AI provider in Settings first.");
      return;
    }

    const config = JSON.parse(stored);
    if (!config.apiKey) {
      setError("Please add your API key in Settings first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/score", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: config.apiKey,
          model: config.model,
          jobDescription,
        }),
      });

      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Failed to score the job. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors">← Back</Link>
          <div>
            <h1 className="text-3xl font-bold">Job Scorer</h1>
            <p className="text-gray-400 text-sm">Paste a job description to get an A-F rating</p>
          </div>
        </div>

        <div className="mb-4">
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={10}
            className="w-full p-4 rounded-xl border border-gray-700 bg-gray-900 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 resize-none"
          />
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          onClick={handleScore}
          disabled={loading || !jobDescription.trim()}
          className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold transition-all mb-8"
        >
          {loading ? "Analyzing..." : "Score This Job"}
        </button>

        {result && (
          <div className="space-y-6">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 flex items-center gap-6">
              <div className={`text-8xl font-bold ${gradeColor[result.grade] || "text-white"}`}>
                {result.grade}
              </div>
              <div>
                <p className="text-2xl font-semibold">{result.score}/100</p>
                <p className="text-gray-400 mt-1">{result.summary}</p>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4">Breakdown</h2>
              <div className="space-y-4">
                {result.dimensions?.map((d: any) => (
                  <div key={d.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-300">{d.name}</span>
                      <span className="text-white font-medium">{d.score}/100</span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-2 mb-1">
                      <div
                        className="bg-green-500 h-2 rounded-full transition-all"
                        style={{ width: `${d.score}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500">{d.feedback}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-3 text-green-400">Pros</h2>
                <ul className="space-y-2">
                  {result.pros?.map((pro: string, i: number) => (
                    <li key={i} className="text-sm text-gray-300 flex gap-2">
                      <span className="text-green-500">✓</span> {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-3 text-red-400">Cons</h2>
                <ul className="space-y-2">
                  {result.cons?.map((con: string, i: number) => (
                    <li key={i} className="text-sm text-gray-300 flex gap-2">
                      <span className="text-red-500">✗</span> {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-3">Recommendation</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{result.recommendation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
