import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { apiKey, model, jobDescription } = await req.json();

  const systemPrompt = `You are a career advisor helping veterans transition to civilian careers. 
Evaluate the following job description and return a JSON object with this exact structure:
{
  "grade": "A",
  "score": 92,
  "summary": "Brief one sentence summary of the role",
  "dimensions": [
    { "name": "Mission Alignment", "score": 90, "feedback": "..." },
    { "name": "Skill Match", "score": 85, "feedback": "..." },
    { "name": "Growth Potential", "score": 95, "feedback": "..." },
    { "name": "Compensation", "score": 88, "feedback": "..." },
    { "name": "Culture Fit", "score": 90, "feedback": "..." }
  ],
  "pros": ["pro 1", "pro 2", "pro 3"],
  "cons": ["con 1", "con 2"],
  "recommendation": "A paragraph with your overall recommendation for a veteran applicant."
}
Return only valid JSON, no markdown, no explanation.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 2048,
        system: systemPrompt,
        messages: [{ role: "user", content: jobDescription }],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: response.status });
    }

    const data = await response.json();
    const text = data.content[0].text;
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (err) {
    return NextResponse.json({ error: "Failed to score job" }, { status: 500 });
  }
}
