import type { AnalysisResult, AnalyzeInput } from "../types";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";
import { coerceAnalysis } from "./schema";

/**
 * OpenAI Chat Completions API でAI分析を実行する。
 * 軽量に保つため公式SDKではなく fetch を使用（Anthropic以外のプロバイダ）。
 */
export async function analyzeWithOpenAI(
  input: AnalyzeInput
): Promise<AnalysisResult> {
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserPrompt(input) },
      ],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`OpenAI API error ${res.status}: ${detail.slice(0, 200)}`);
  }

  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = data.choices?.[0]?.message?.content ?? "{}";
  return coerceAnalysis(JSON.parse(content));
}
