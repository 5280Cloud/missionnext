# MissionNext

An open-source, AI-powered career transition platform built for veterans.

Live: https://missionnext.vercel.app

---

## What's New — Interview Prep

MissionNext now includes a full Interview Prep feature, completing the end-to-end job flow:

JD Ingestion > Resume Feedback > Application Tracking > Interview Prep

---

## Features

### Job Scorer
Paste a job description and get an A-F rating based on how well the role aligns with your background and transition goals.

### Resume Builder
Upload your resume and a job description. The AI generates a tailored version optimized for that specific role.

### Application Tracker
Track every job in one place. Log status, notes, dates, and next steps. Linked to the full job flow.

### Job Scanner
Scan job portals for roles that match your profile.

### Interview Prep (New)
Tied directly to a job application. Launch a mock interview powered by the JD you already ingested.

- Role-specific questions generated from the job description
- Answer one question at a time via text or voice
- Adaptive session length: after 5 strong answers you can wrap up or keep going (up to 15 questions)
- End-of-session feedback: strength highlights, areas to improve, STAR method alignment, suggested better answers
- Sessions saved to your account when logged in
- Choose your AI provider per session: Claude, GPT-4o, or Gemini

---

## Getting Started

### Prerequisites
- Node.js 18+
- API key from Anthropic, OpenAI, or Google Gemini
- Supabase project for auth and session persistence

### Install and Run

git clone https://github.com/5280Cloud/missionnext.git
cd missionnext
npm install
npx next dev

Open http://localhost:3000 in your browser.

### Environment Variables

Create a .env.local file:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

Never commit API keys to GitHub. AI provider keys are entered by the user in the UI.

---

## Tech Stack

- Next.js 14 + TypeScript
- Tailwind CSS
- Supabase (auth + database)
- Model-agnostic AI layer: Claude, GPT-4o, Gemini
- Vercel (deployment)

---

## Roadmap

- [x] Job Scorer
- [x] Resume Builder
- [x] Application Tracker
- [x] Job Scanner
- [x] Supabase auth
- [x] Interview Prep
- [ ] Veteran community sharing
- [ ] Mobile-responsive polish
- [ ] Exportable interview prep reports (PDF)
- [ ] LinkedIn integration

---

## Contributing

Open source and built for the veteran community. Contributions welcome.

1. Fork the repo
2. Create a feature branch: git checkout -b feature/your-feature
3. Commit: git commit -m "Add your feature"
4. Push: git push origin feature/your-feature
5. Open a Pull Request

---

## Acknowledgments

Inspired by career-ops by Santiago (MIT License).

---

## License

MIT
