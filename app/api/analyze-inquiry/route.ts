import { NextResponse } from "next/server";
import { analyzeInquiry } from "@/lib/ai";
import type { AnalyzeInput } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function toInput(body: Record<string, unknown>): AnalyzeInput {
  const s = (v: unknown) => (typeof v === "string" ? v : v == null ? "" : String(v));
  return {
    company_name: s(body.company_name),
    contact_name: s(body.contact_name),
    email: s(body.email),
    phone: s(body.phone),
    source: s(body.source),
    budget: s(body.budget),
    desired_timeline: s(body.desired_timeline),
    message: s(body.message),
  };
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストボディが不正です（JSONとして解釈できません）。" },
      { status: 400 }
    );
  }

  const input = toInput(body);
  if (!input.message.trim()) {
    return NextResponse.json(
      { error: "問い合わせ本文（message）は必須です。" },
      { status: 400 }
    );
  }

  try {
    const outcome = await analyzeInquiry(input);
    return NextResponse.json({
      ...outcome.result,
      _engine: outcome.engine,
      _fallbackNote: outcome.fallbackNote ?? null,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      { error: `AI分析に失敗しました: ${msg}` },
      { status: 500 }
    );
  }
}
