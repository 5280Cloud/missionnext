import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { apiKey, model, provider, keyword, location, linkedinOnly, targets } = await req.json();

  const sources: string[] = [];

  if (linkedinOnly) {
    const q = encodeURIComponent(`${keyword} ${location}`);
    sources.push(`https://www.linkedin.com/jobs/search/?keywords=${q}`);
  }

  targets.forEach((t: { name: string; url: string }) => {
    sources.push(t.url);
  });

  const systemPrompt = `You are a job search assistant helping veterans find civilian roles.
The user is searching for "${keyword}" jobs${location ? ` in ${location}` : ""}.
Based on the career pages and search URLs provided, generate a realistic list of relevant job postings.
Return a JSON array of jobs with this structure:
[
  {
    "title": "Job Title",
    "company": "Company Name",
    "location": "City, State or Remote",
    "url": "https://...",
    "description": "Brief 1-2 sentence description of the role"
  }
]
Return only valid JSON, no markdown, no explanation. Return 5-10 relevant jobs.`;

  const userMessage = `Find "${keyword}" jobs${location ? ` in ${location}` : ""} from these sources:\n${sources.join("\n")}`;

  try {
    let text = "";

    if (provider === "openai") {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
        }),
      });
      if (!response.ok) {
        const error = await response.text();
        return NextResponse.json({ error }, { status: response.status });
      }
      const data = await response.json();
      text = data.choices[0].message.content;
    } else {
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
          messages: [{ role: "user", content: userMessage }],
        }),
      });
      if (!response.ok) {
        const error = await response.text();
        return NextResponse.json({ error }, { status: response.status });
      }
      const data = await response.json();
      text = data.content[0].text;
    }

    const clean = text.replace(/```json|```/g, "").trim();
    const jobs = JSON.parse(clean);
    return NextResponse.json({ jobs });
  } catch (err) {
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}
