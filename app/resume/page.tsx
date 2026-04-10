"use client";

import { useState } from "react";
import Link from "next/link";

export default function ResumePage() {
  const [jobDescription, setJobDescription] = useState("");
  const [resume, setResume] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
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
    setResult("");

    try {
      const response = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey: config.apiKey,
          model: config.model,
          provider: config.provider,
          jobDescription,
          resume,
        }),
      });

      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setResult(data.resume);
    } catch (err) {
      setError("Failed to generate resume. Check your API key and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-gray-500 hover:text-white transition-colors">← Back</Link>
          <div>
            <h1 className="text-3xl font-bold">Resume Builder</h1>
            <p className="text-gray-400 text-sm">Generate a tailored resume for any job posting</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Current Resume
            </label>
            <textarea
              value={resume}
              onChange={(e) => setResume(e.target.value)}
              placeholder="Paste your current resume here (or key experience, skills, and background)..."
              rows={14}
              className="w-full p-4 rounded-xl border border-gray-700 bg-gray-900 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 resize-none text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Description
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description you're applying for..."
              rows={14}
              className="w-full p-4 rounded-xl border border-gray-700 bg-gray-900 text-white placeholder-gray-600 focus:outline-none focus:border-green-500 resize-none text-sm"
            />
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <button
          onClick={handleGenerate}
          disabled={loading || !jobDescription.trim() || !resume.trim()}
          className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-semibold transition-all mb-8"
        >
          {loading ? "Generating..." : "Generate Tailored Resume"}
        </button>

        {result && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Tailored Resume</h2>
              <button
                onClick={handleCopy}
                className="px-4 py-1.5 text-sm bg-gray-700 hover:bg-gray-600 rounded-lg transition-all"
              >
                {copied ? "✓ Copied!" : "Copy"}
              </button>
            </div>
            <pre className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-mono">
              {result}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
