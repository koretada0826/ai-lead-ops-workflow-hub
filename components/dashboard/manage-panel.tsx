"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label, Select, Textarea } from "@/components/ui/field";
import { STATUSES } from "@/lib/constants";
import type { Inquiry, InquiryStatus } from "@/lib/types";

export function ManagePanel({ inquiry }: { inquiry: Inquiry }) {
  const router = useRouter();
  const [status, setStatus] = useState<InquiryStatus>(inquiry.status);
  const [note, setNote] = useState(inquiry.internal_note ?? "");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, internal_note: note }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "更新に失敗しました。");
      setSavedAt("保存しました");
      router.refresh();
      setTimeout(() => setSavedAt(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "更新に失敗しました。");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="status">ステータス変更</Label>
        <Select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as InquiryStatus)}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="note">内部メモ</Label>
        <Textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="対応状況・次のアクションなどを記録"
          rows={4}
        />
      </div>
      {error && <p className="text-xs text-rose-600">{error}</p>}
      <div className="flex items-center gap-3">
        <Button onClick={save} disabled={saving} size="sm">
          {saving ? "保存中…" : "保存する"}
        </Button>
        {savedAt && (
          <span className="text-xs font-medium text-emerald-600">
            {savedAt}
          </span>
        )}
      </div>
    </div>
  );
}
