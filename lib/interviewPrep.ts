export interface InterviewConfig {
  jobDescription: string
  apiKey: string
  provider: string
  model: string
}

export interface AnswerPayload {
  question: string
  answer: string
  apiKey: string
  provider: string
  model: string
}

export interface FeedbackItem {
  question: string
  answer: string
  strengths: string[]
  areas_to_improve: string[]
  star_alignment: string
  suggested_answer: string
  score: number
}

export interface ScoreSummary {
  overall_score: number
  strong_answers: number
  weak_answers: number
  top_strengths: string[]
  top_improvements: string[]
}

// Generate interview questions from a job description
export async function generateQuestions(config: InterviewConfig): Promise<string[]> {
  const res = await fetch("/api/interview-prep", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "generate_questions",
      apiKey: config.apiKey,
      provider: config.provider,
      model: config.model,
      jobDescription: config.jobDescription,
    }),
  })

  if (!res.ok) throw new Error("Failed to generate questions")
  const data = await res.json()
  return data.questions
}

// Score a single answer
export async function scoreAnswer(payload: AnswerPayload): Promise<FeedbackItem> {
  const res = await fetch("/api/interview-prep", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "score_answer",
      apiKey: payload.apiKey,
      provider: payload.provider,
      model: payload.model,
      question: payload.question,
      answer: payload.answer,
    }),
  })

  if (!res.ok) throw new Error("Failed to score answer")
  const data = await res.json()
  return data.feedback
}

// Calculate overall session summary from all feedback
export function calculateScoreSummary(feedback: FeedbackItem[]): ScoreSummary {
  if (feedback.length === 0) {
    return {
      overall_score: 0,
      strong_answers: 0,
      weak_answers: 0,
      top_strengths: [],
      top_improvements: [],
    }
  }

  const scores = feedback.map((f) => f.score)
  const overall_score = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
  const strong_answers = feedback.filter((f) => f.score >= 7).length
  const weak_answers = feedback.filter((f) => f.score < 5).length

  const all_strengths = feedback.flatMap((f) => f.strengths)
  const all_improvements = feedback.flatMap((f) => f.areas_to_improve)

  // Deduplicate and take top 3
  const top_strengths = [...new Set(all_strengths)].slice(0, 3)
  const top_improvements = [...new Set(all_improvements)].slice(0, 3)

  return {
    overall_score,
    strong_answers,
    weak_answers,
    top_strengths,
    top_improvements,
  }
}

// Decide whether to prompt "continue or wrap up" after 5 questions
export function shouldPromptContinue(feedback: FeedbackItem[]): boolean {
  if (feedback.length !== 5) return false
  const strong = feedback.filter((f) => f.score >= 7).length
  return strong / feedback.length > 0.5
}
