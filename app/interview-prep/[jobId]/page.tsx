"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import QuestionCard from "@/components/interview/QuestionCard";
import SessionSummary from "@/components/interview/SessionSummary";
import {
  generateQuestions,
  scoreAnswer,
  calculateScoreSummary,
  shouldPromptContinue,
  FeedbackItem,
} from "@/lib/interviewPrep";
import { saveInterviewSession } from "@/lib/supabase/interviewSessions";

type Stage = "setup" | "interview" | "continue_prompt" | "summary";

const PROVIDERS = [
  { id: "claude", label: "Claude (Anthropic)", models: ["claude-opus-4-5", "claude-sonnet-4-5"] },
  { id: "openai", label: "GPT-4o (OpenAI)", models: ["gpt-4o", "gpt-4-turbo"] },
  { id: "gemini", label: "Gemini (Google)", models: ["gemini-1.5-pro"] },
];

export default function InterviewPrepPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  const [stage, setStage] = useState<Stage>("setup");
  const [provider, setProvider] = useState("claude");
  const [model, setModel] = useState("claude-sonnet-4-5");
  const [apiKey, setApiKey] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Load saved API key from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("missionnext-api-key");
    if (saved) setApiKey(saved);
  }, []);

  const handleProviderChange = (p: string) => {
    setProvider(p);
    const found = PROVIDERS.find((x) => x.id === p);
    if (found) setModel(found.models[0]);
  };

  const handleStart = async () => {
    if (!apiKey.trim() || !jobDescription.trim()) return;
    setIsLoading(true);
    setError("");
    try {
      localStorage.setItem("missionnext-api-key", apiKey);
      const qs = await generateQuestions({ jobDescription, apiKey, provider, model });
      setQuestions(qs.slice(0, 15));
      setStage("interview");
    } catch {
      setError("Failed to generate questions. Check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    setIsLoading(true);
    setError("");
    try {
      const result = await scoreAnswer({
        question: questions[currentIndex],
        answer,
        apiKey,
        provider,
        model,
      });
      const updatedFeedback = [...feedback, result];
      setFeedback(updatedFeedback);

      if (shouldPromptContinue(updatedFeedback)) {
        setStage("continue_prompt");
      } else if (currentIndex + 1 >= questions.length) {
        await finishSession(updatedFeedback);
      } else {
        setCurrentIndex(currentIndex + 1);
      }
    } catch {
      setError("Failed to score answer. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const finishSession = async (finalFeedback: FeedbackItem[]) => {
    const summary = calculateScoreSummary(finalFeedback);
    await saveInterviewSession({
      application_id: jobId,
      job_description: jobDescription,
      ai_provider: provider,
      questions,
      answers: finalFeedback.map((f) => f.answer),
      feedback: finalFeedback,
      score_summary: summary,
      completed: true,
    });
    setStage("summary");
  };

  const handleRestart = () => {
    setStage("setup");
    setQuestions([]);
    setCurrentIndex(0);
    setFeedback([]);
    setError("");
  };

  const summary = calculateScoreSummary(feedback);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/tracker" className="text-gray-500 hover:text-white transition-colors">
            ← Back to Tracker
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Interview Prep</h1>
            <p className="text-gray-400 text-sm">Mock interview powered by AI</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        {/* Setup Stage */}
        {stage === "setup" && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 space-y-5">
            <h2 className="text-xl font-semibold">Set Up Your Session</h2>

            {/* Provider */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">AI Provider</label>
              <div className="grid grid-cols-3 gap-3">
                {PROVIDERS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleProviderChange(p.id)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      provider === p.id
                        ? "bg-green-500/20 border-green-500/30 text-green-400"
                        : "bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500"
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Model */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Model</label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:border-green-500"
              >
                {PROVIDERS.find((p) => p.id === provider)?.models.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* API Key */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste your API key..."
                className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm text-gray-400 mb-2">Job Description</label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                rows={6}
                className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none"
              />
            </div>

            <button
              onClick={handleStart}
              disabled={!apiKey.trim() || !jobDescription.trim() || isLoading}
              className="w-full py-3 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all"
            >
              {isLoading ? "Generating Questions..." : "Start Interview"}
            </button>
          </div>
        )}

        {/* Interview Stage */}
        {stage === "interview" && (
          <QuestionCard
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
            question={questions[currentIndex]}
            onSubmit={handleAnswer}
            isLoading={isLoading}
          />
        )}

        {/* Continue Prompt */}
        {stage === "continue_prompt" && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-8 text-center">
            <p className="text-4xl mb-4">🎉</p>
            <h2 className="text-2xl font-bold mb-2">Great Start!</h2>
            <p className="text-gray-400 mb-6">
              You're performing well — over 50% strong answers in your first 5 questions.
              Want to keep going or wrap up and review your feedback?
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => { setCurrentIndex(currentIndex + 1); setStage("interview"); }}
                className="px-6 py-3 bg-green-600 hover:bg-green-500 rounded-lg font-semibold transition-all"
              >
                Keep Going
              </button>
              <button
                onClick={() => finishSession(feedback)}
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-all"
              >
                Wrap Up & Review
              </button>
            </div>
          </div>
        )}

        {/* Summary Stage */}
        {stage === "summary" && (
          <SessionSummary
            feedback={feedback}
            summary={summary}
            onRestart={handleRestart}
          />
        )}
      </div>
    </div>
  );
}
