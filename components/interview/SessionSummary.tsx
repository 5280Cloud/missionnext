"use client";

import { FeedbackItem, ScoreSummary } from "@/lib/interviewPrep";

interface SessionSummaryProps {
  feedback: FeedbackItem[]
  summary: ScoreSummary
  onRestart: () => void
}

export default function SessionSummary({
  feedback,
  summary,
  onRestart,
}: SessionSummaryProps) {
  const scoreColor = (score: number) => {
    if (score >= 8) return "text-green-400"
    if (score >= 6) return "text-yellow-400"
    return "text-red-400"
  }

  const scoreBg = (score: number) => {
    if (score >= 8) return "bg-green-500/20 border-green-500/30"
    if (score >= 6) return "bg-yellow-500/20 border-yellow-500/30"
    return "bg-red-500/20 border-red-500/30"
  }

  return (
    <div className="space-y-8">
      {/* Overall Score */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
        <p className="text-gray-400 text-sm mb-2">Overall Score</p>
        <p className={`text-6xl font-bold mb-2 ${scoreColor(summary.overall_score)}`}>
          {summary.overall_score}<span className="text-2xl text-gray-500">/10</span>
        </p>
        <div className="flex justify-center gap-6 mt-4 text-sm">
          <div>
            <p className="text-green-400 font-semibold">{summary.strong_answers}</p>
            <p className="text-gray-500">Strong Answers</p>
          </div>
          <div>
            <p className="text-red-400 font-semibold">{summary.weak_answers}</p>
            <p className="text-gray-500">Needs Work</p>
          </div>
          <div>
            <p className="text-white font-semibold">{feedback.length}</p>
            <p className="text-gray-500">Total Questions</p>
          </div>
        </div>
      </div>

      {/* Top Strengths & Improvements */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
          <h3 className="text-green-400 font-semibold mb-3">💪 Top Strengths</h3>
          <ul className="space-y-2">
            {summary.top_strengths.map((s, i) => (
              <li key={i} className="text-sm text-gray-300 flex gap-2">
                <span className="text-green-500 mt-0.5">✓</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-5">
          <h3 className="text-yellow-400 font-semibold mb-3">🎯 Areas to Improve</h3>
          <ul className="space-y-2">
            {summary.top_improvements.map((s, i) => (
              <li key={i} className="text-sm text-gray-300 flex gap-2">
                <span className="text-yellow-500 mt-0.5">→</span> {s}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Per-Question Breakdown */}
      <div>
        <h2 className="text-xl font-bold mb-4">Question Breakdown</h2>
        <div className="space-y-4">
          {feedback.map((item, i) => (
            <div
              key={i}
              className={`border rounded-xl p-5 ${scoreBg(item.score)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <p className="font-semibold text-white flex-1 pr-4">
                  Q{i + 1}: {item.question}
                </p>
                <span className={`text-2xl font-bold shrink-0 ${scoreColor(item.score)}`}>
                  {item.score}/10
                </span>
              </div>

              <p className="text-sm text-gray-400 mb-4 italic">"{item.answer}"</p>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-xs text-green-400 font-semibold uppercase mb-1">Strengths</p>
                  <ul className="space-y-1">
                    {item.strengths.map((s, j) => (
                      <li key={j} className="text-xs text-gray-300">✓ {s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs text-yellow-400 font-semibold uppercase mb-1">Areas to Improve</p>
                  <ul className="space-y-1">
                    {item.areas_to_improve.map((s, j) => (
                      <li key={j} className="text-xs text-gray-300">→ {s}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-xs text-blue-400 font-semibold uppercase mb-1">STAR Alignment</p>
                <p className="text-xs text-gray-300">{item.star_alignment}</p>
              </div>

              <div className="bg-gray-900/50 rounded-lg p-3">
                <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Suggested Better Answer</p>
                <p className="text-xs text-gray-300">{item.suggested_answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Restart */}
      <div className="text-center pt-4">
        <button
          onClick={onRestart}
          className="px-8 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-all"
        >
          Start New Session
        </button>
      </div>
    </div>
  )
}
