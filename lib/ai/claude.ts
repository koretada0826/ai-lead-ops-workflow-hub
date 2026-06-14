import Anthropic from "@anthropic-ai/sdk";
import type { AnalysisResult, AnalyzeInput } from "../types";
import { SYSTEM_PROMPT, buildUserPrompt } from "./prompt";
import { coerceAnalysis } from "./schema";

/** レスポンステキストから最初のJSONオブジェクトを抽出する（保険）。 */
function extractJson(text: string): unknown {
  const trimmed = text.trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(trimmed.slice(start, end + 1));
    }
    throw new Error("AI応答からJSONを抽出できませんでした。");
  }
}

/** Claude (Anthropic Messages API) でAI分析を実行する。 */
export async function analyzeWithClaude(
  input: AnalyzeInput
): Promise<AnalysisResult> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const model = process.env.ANTHROPIC_MODEL || "claude-opus-4-8";

  const response = await client.messages.create({
    model,
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [
      { role: "user", content: buildUserPrompt(input) },
      // JSONのみを返すよう明示的に誘導（プレフィルではなく指示）
      {
        role: "user",
        content: "上記をJSONオブジェクトのみで返してください。説明文やMarkdownは不要です。",
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("");

  return coerceAnalysis(extractJson(text));
}
