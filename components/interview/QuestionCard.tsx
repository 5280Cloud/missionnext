"use client";

import { useState, useRef } from "react";

interface QuestionCardProps {
  questionNumber: number
  totalQuestions: number
  question: string
  onSubmit: (answer: string) => void
  isLoading: boolean
}

export default function QuestionCard({
  questionNumber,
  totalQuestions,
  question,
  onSubmit,
  isLoading,
}: QuestionCardProps) {
  const [answer, setAnswer] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data)
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" })
        const url = URL.createObjectURL(blob)
        // For now append a note — full transcription can be added later
        setAnswer((prev) => prev + " [Voice note recorded — transcription coming soon]")
        URL.revokeObjectURL(url)
        stream.getTracks().forEach((t) => t.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch {
      alert("Microphone access denied. Please type your answer instead.")
    }
  }

  const handleStopRecording = () => {
    mediaRecorderRef.current?.stop()
    setIsRecording(false)
  }

  const handleSubmit = () => {
    if (!answer.trim()) return
    onSubmit(answer.trim())
    setAnswer("")
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-400">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalQuestions }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 w-6 rounded-full ${
                i < questionNumber - 1
                  ? "bg-green-500"
                  : i === questionNumber - 1
                  ? "bg-green-400"
                  : "bg-gray-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Question */}
      <p className="text-lg font-semibold text-white mb-6">{question}</p>

      {/* Answer Input */}
      <textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        rows={5}
        className="w-full p-3 rounded-lg border border-gray-700 bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-green-500 resize-none mb-4"
      />

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSubmit}
          disabled={!answer.trim() || isLoading}
          className="px-6 py-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-semibold transition-all"
        >
          {isLoading ? "Scoring..." : "Submit Answer"}
        </button>

        {isRecording ? (
          <button
            onClick={handleStopRecording}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded-lg text-sm font-semibold transition-all flex items-center gap-2"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            Stop Recording
          </button>
        ) : (
          <button
            onClick={handleStartRecording}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg text-sm font-semibold transition-all"
          >
            🎤 Record Answer
          </button>
        )}
      </div>
    </div>
  )
}
