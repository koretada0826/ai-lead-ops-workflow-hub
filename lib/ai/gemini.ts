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

/**
 * Google Gemini API でAI分析を実行する。
 * 無料枠（Google AI Studioのキー）で動かせるため、デモ用途のコストを¥0にできる。
 * 軽量に保つため公式SDKではなく fetch を使用。
 */
export async function analyzeWithGemini(
  input: AnalyzeInput
): Promise<AnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                buildUserPrompt(input) +
                "\n\n上記をJSONオブジェクトのみで返してください。説明文やMarkdownは不要です。",
            },
          ],
        },
      ],
      // JSONのみを返すよう明示（Geminiの構造化出力）
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 2000,
      },
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Gemini API error ${res.status}: ${detail.slice(0, 500)}`);
  }

  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
  };
  const text =
    data.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? "")
      .join("") ?? "";

  return coerceAnalysis(extractJson(text));
}
