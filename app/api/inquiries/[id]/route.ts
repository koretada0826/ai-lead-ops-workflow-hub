import { NextResponse } from "next/server";
import { addLog, getInquiry, updateInquiry } from "@/lib/repository";
import { STATUSES } from "@/lib/constants";
import type { InquiryStatus } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const inquiry = await getInquiry(params.id);
  if (!inquiry) {
    return NextResponse.json({ error: "見つかりません。" }, { status: 404 });
  }
  return NextResponse.json({ inquiry });
}

/** ステータス・内部メモの更新 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSONが不正です。" }, { status: 400 });
  }

  const patch: { status?: InquiryStatus; internal_note?: string } = {};
  if (typeof body.status === "string") {
    if (!STATUSES.includes(body.status as InquiryStatus)) {
      return NextResponse.json(
        { error: "不正なステータスです。" },
        { status: 400 }
      );
    }
    patch.status = body.status as InquiryStatus;
  }
  if (typeof body.internal_note === "string") {
    patch.internal_note = body.internal_note;
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json(
      { error: "更新対象がありません。" },
      { status: 400 }
    );
  }

  try {
    const updated = await updateInquiry(params.id, patch);
    if (!updated) {
      return NextResponse.json({ error: "見つかりません。" }, { status: 404 });
    }
    if (patch.status) {
      await addLog(params.id, "status_changed", "success", `ステータスを「${patch.status}」に変更`);
    }
    if (patch.internal_note !== undefined) {
      await addLog(params.id, "note_updated", "success", "内部メモを更新しました");
    }
    return NextResponse.json({ inquiry: updated });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
