import type { AnalysisEngine, AnalysisResult, AnalyzeInput } from "../types";
import { getRuntimeConfig } from "../constants";
import { mockAnalyze } from "./mock";
import { analyzeWithClaude } from "./claude";
import { analyzeWithOpenAI } from "./openai";
import { analyzeWithGemini } from "./gemini";

export interface AnalyzeOutcome {
  result: AnalysisResult;
  /** 実際に使われたエンジン */
  engine: AnalysisEngine;
  /** 本来のエンジンが失敗してmockにフォールバックした場合のメッセージ */
  fallbackNote?: string;
}

/**
 * AI分析のエントリポイント。
 * AI_PROVIDER と APIキーの設定状況に応じて Claude / OpenAI / mock を選択。
 * 実APIが失敗した場合は必ず mock にフォールバックし、アプリを壊さない。
 */
export async function analyzeInquiry(
  input: AnalyzeInput
): Promise<AnalyzeOutcome> {
  const { aiEngine } = getRuntimeConfig();

  if (aiEngine === "mock") {
    return { result: mockAnalyze(input), engine: "mock" };
  }

  try {
    if (aiEngine === "claude") {
      return { result: await analyzeWithClaude(input), engine: "claude" };
    }
    if (aiEngine === "openai") {
      return { result: await analyzeWithOpenAI(input), engine: "openai" };
    }
    if (aiEngine === "gemini") {
      return { result: await analyzeWithGemini(input), engine: "gemini" };
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return {
      result: mockAnalyze(input),
      engine: "mock",
      fallbackNote: `AI APIエラーのためデモモードで応答しました: ${msg}`,
    };
  }

  return { result: mockAnalyze(input), engine: "mock" };
}

export { mockAnalyze };
