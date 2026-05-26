import { supabase } from '../supabase'

export interface InterviewSession {
  id?: string
  user_id?: string
  application_id: string
  job_description?: string
  ai_provider: string
  questions: string[]
  answers: string[]
  feedback: FeedbackItem[]
  score_summary?: ScoreSummary
  completed: boolean
  created_at?: string
  completed_at?: string
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

export async function saveInterviewSession(session: InterviewSession) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null, error: 'Not logged in' }

  const { data, error } = await supabase
    .from('interview_sessions')
    .upsert({
      ...session,
      user_id: user.id,
      completed_at: session.completed ? new Date().toISOString() : null,
    })
    .select()
    .single()

  return { data, error }
}

export async function getSessionsByApplication(application_id: string) {
  const { data, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('application_id', application_id)
    .order('created_at', { ascending: false })

  return { data, error }
}

export async function getSessionById(id: string) {
  const { data, error } = await supabase
    .from('interview_sessions')
    .select('*')
    .eq('id', id)
    .single()

  return { data, error }
}
