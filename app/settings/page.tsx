"use client";

import { useState, useEffect } from "react";
import { AIProvider, PROVIDER_MODELS, DEFAULT_MODELS } from "@/lib/ai-provider";

export default function SettingsPage() {
  const [provider, setProvider] = useState<AIProvider>("anthropic");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(DEFAULT_MODELS["anthropic"]);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("missionnext-config");
    if (stored) {
      const config = JSON.parse(stored);
      setProvider(config.provider);
      setApiKey(config.apiKey);
      setModel(config.model);
    }
  }, []);

  const handleProviderChange = (p: AIProvider) => {
    setProvider(p);
    setModel(DEFAULT_MODELS[p]);
  };

  const handleSave = () => {
    localStorage.setItem(
      "missionnext-config",
      JSON.stringify({ provider, apiKey, model })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400 mb-8">
          Configure your AI provider. Your API key is stored locally and never sent to our servers.
        </p>

        {/* Provider Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            AI Provider
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(["anthropic", "openai", "gemini"] as AIProvider[]).map((p) => (
              <button
                key={p}
                onClick={() => handleProviderChange(p)}
                className={`p-3 rounded-lg border text-sm font-medium capitalize transition-all ${
                  provider === p
                    ? "border-green-500 bg-green-500/10 text-green-400"
                    : "border-gray-700 bg-gray-900 text-gray-400 hover:border-gray-500"
                }`}
              >
                {p === "anthropic" ? "Claude" : p === "openai" ? "OpenAI" : "Gemini"}
              </button>
            ))}
          </div>
        </div>

        {/* Model Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            Model
          </label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white focus:outline-none focus:border-green-500"
          >
            {PROVIDER_MODELS[provider].map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* API Key */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={
              provider === "anthropic"
                ? "sk-ant-..."
                : provider === "openai"
                ? "sk-..."
                : "AIza..."
            }
            className="w-full p-3 rounded-lg border border-gray-700 bg-gray-900 text-white placeholder-gray-600 focus:outline-none focus:border-green-500"
          />
          <p className="text-xs text-gray-500 mt-2">
            {provider === "anthropic" && (
              <span>Get your key at{" "}
                <a href="https://console.anthropic.com" target="_blank" className="text-green-400 hover:underline">
                  console.anthropic.com
                </a>
              </span>
            )}
            {provider === "openai" && (
              <span>Get your key at{" "}
                <a href="https://platform.openai.com/api-keys" target="_blank" className="text-green-400 hover:underline">
                  platform.openai.com
                </a>
              </span>
            )}
            {provider === "gemini" && (
              <span>Get your key at{" "}
                <a href="https://aistudio.google.com" target="_blank" className="text-green-400 hover:underline">
                  aistudio.google.com
                </a>
              </span>
            )}
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold transition-all"
        >
          {saved ? "✓ Saved!" : "Save Settings"}
        </button>
      </div>
    </div>
  );
}