export type AIProvider = "anthropic" | "openai" | "gemini";

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
}

export const PROVIDER_MODELS: Record<AIProvider, string[]> = {
  anthropic: ["claude-opus-4-5", "claude-sonnet-4-5", "claude-haiku-4-5-20251001"],
  openai: ["gpt-4o", "gpt-4o-mini", "gpt-4-turbo"],
  gemini: ["gemini-1.5-pro", "gemini-1.5-flash"],
};

export const DEFAULT_MODELS: Record<AIProvider, string> = {
  anthropic: "claude-sonnet-4-5",
  openai: "gpt-4o",
  gemini: "gemini-1.5-pro",
};

export async function callAI(
  config: AIConfig,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  switch (config.provider) {
    case "anthropic":
      return callAnthropic(config, systemPrompt, userMessage);
    case "openai":
      return callOpenAI(config, systemPrompt, userMessage);
    case "gemini":
      return callGemini(config, systemPrompt, userMessage);
    default:
      throw new Error("Unsupported AI provider");
  }
}

async function callAnthropic(
  config: AIConfig,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 2048,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    }),
  });

  if (!response.ok) throw new Error(`Anthropic API error: ${response.statusText}`);
  const data = await response.json();
  return data.content[0].text;
}

async function callOpenAI(
  config: AIConfig,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  });

  if (!response.ok) throw new Error(`OpenAI API error: ${response.statusText}`);
  const data = await response.json();
  return data.choices[0].message.content;
}

async function callGemini(
  config: AIConfig,
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${config.model}:generateContent?key=${config.apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [{ parts: [{ text: userMessage }] }],
      }),
    }
  );

  if (!response.ok) throw new Error(`Gemini API error: ${response.statusText}`);
  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}
