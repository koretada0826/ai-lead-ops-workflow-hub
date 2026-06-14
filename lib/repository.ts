import { getServerSupabase } from "./supabase/server";
import { buildDemoInquiries, buildDemoLogs } from "./demo-data";
import type {
  AnalysisResult,
  AnalyzeInput,
  DashboardStats,
  Inquiry,
  InquiryStatus,
  LeadScore,
  WorkflowEventStatus,
  WorkflowEventType,
  WorkflowLog,
} from "./types";

// =====================================================================
// データアクセス層。
// Supabaseが設定されていればDBを、無ければプロセス内メモリ（デモシード）を使う。
// どちらでも同じインターフェースで動くように抽象化している。
// =====================================================================

const TABLE = "inquiries";
const LOG_TABLE = "workflow_logs";

// ---- インメモリストア（Supabase未設定時のフォールバック） -------------
interface MemStore {
  inquiries: Inquiry[];
  logs: WorkflowLog[];
}

// グローバルにキャッシュして、開発時のHMRでもシードが保持されるようにする。
const g = globalThis as unknown as { __leadOpsStore?: MemStore };

function memStore(): MemStore {
  if (!g.__leadOpsStore) {
    const inquiries = buildDemoInquiries();
    g.__leadOpsStore = {
      inquiries,
      logs: buildDemoLogs(inquiries),
    };
  }
  return g.__leadOpsStore;
}

function uuid(): string {
  // crypto.randomUUID はNode 18+で利用可能
  return globalThis.crypto?.randomUUID?.() ?? `mem-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

// ---- 新規問い合わせ作成 ----------------------------------------------
export interface CreateInquiryInput extends AnalyzeInput, AnalysisResult {
  status?: InquiryStatus;
}

export async function createInquiry(
  input: CreateInquiryInput
): Promise<Inquiry> {
  const sb = getServerSupabase();
  const base = {
    company_name: input.company_name,
    contact_name: input.contact_name,
    email: input.email,
    phone: input.phone,
    source: input.source,
    budget: input.budget,
    desired_timeline: input.desired_timeline,
    message: input.message,
    category: input.category,
    urgency: input.urgency,
    lead_score: input.lead_score,
    summary: input.summary,
    recommended_action: input.recommended_action,
    reply_draft: input.reply_draft,
    followup_draft: input.followup_draft,
    assigned_role: input.assigned_role,
    status: input.status ?? "未対応",
    internal_note: null as string | null,
    n8n_webhook_sent: false,
    n8n_webhook_error: null as string | null,
  };

  if (sb) {
    const { data, error } = await sb
      .from(TABLE)
      .insert(base)
      .select()
      .single();
    if (error) throw new Error(`Supabase insert失敗: ${error.message}`);
    return data as Inquiry;
  }

  const rec: Inquiry = {
    id: uuid(),
    ...base,
    created_at: nowIso(),
    updated_at: nowIso(),
  };
  memStore().inquiries.unshift(rec);
  return rec;
}

// ---- 取得 -----------------------------------------------------------
export async function getInquiry(id: string): Promise<Inquiry | null> {
  const sb = getServerSupabase();
  if (sb) {
    const { data, error } = await sb
      .from(TABLE)
      .select()
      .eq("id", id)
      .maybeSingle();
    if (error) throw new Error(`Supabase select失敗: ${error.message}`);
    return (data as Inquiry) ?? null;
  }
  return memStore().inquiries.find((i) => i.id === id) ?? null;
}

export async function listInquiries(): Promise<Inquiry[]> {
  const sb = getServerSupabase();
  if (sb) {
    const { data, error } = await sb
      .from(TABLE)
      .select()
      .order("created_at", { ascending: false });
    if (error) throw new Error(`Supabase select失敗: ${error.message}`);
    return (data as Inquiry[]) ?? [];
  }
  return [...memStore().inquiries].sort(
    (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at)
  );
}

// ---- 更新 -----------------------------------------------------------
export async function updateInquiry(
  id: string,
  patch: Partial<Pick<Inquiry, "status" | "internal_note" | "n8n_webhook_sent" | "n8n_webhook_error">>
): Promise<Inquiry | null> {
  const sb = getServerSupabase();
  const payload = { ...patch, updated_at: nowIso() };
  if (sb) {
    const { data, error } = await sb
      .from(TABLE)
      .update(payload)
      .eq("id", id)
      .select()
      .maybeSingle();
    if (error) throw new Error(`Supabase update失敗: ${error.message}`);
    return (data as Inquiry) ?? null;
  }
  const store = memStore();
  const idx = store.inquiries.findIndex((i) => i.id === id);
  if (idx < 0) return null;
  store.inquiries[idx] = { ...store.inquiries[idx], ...payload };
  return store.inquiries[idx];
}

// ---- ワークフローログ ------------------------------------------------
export async function addLog(
  inquiry_id: string,
  event_type: WorkflowEventType,
  status: WorkflowEventStatus,
  message: string
): Promise<void> {
  const sb = getServerSupabase();
  const rec = { inquiry_id, event_type, status, message };
  if (sb) {
    await sb.from(LOG_TABLE).insert(rec);
    return;
  }
  memStore().logs.push({
    id: uuid(),
    ...rec,
    created_at: nowIso(),
  });
}

export async function listLogs(inquiry_id: string): Promise<WorkflowLog[]> {
  const sb = getServerSupabase();
  if (sb) {
    const { data, error } = await sb
      .from(LOG_TABLE)
      .select()
      .eq("inquiry_id", inquiry_id)
      .order("created_at", { ascending: true });
    if (error) return [];
    return (data as WorkflowLog[]) ?? [];
  }
  return memStore()
    .logs.filter((l) => l.inquiry_id === inquiry_id)
    .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at));
}

// ---- ダッシュボード集計 ----------------------------------------------
export function computeStats(inquiries: Inquiry[]): DashboardStats {
  const now = new Date("2026-06-13T01:00:00.000Z");
  const monthKey = `${now.getUTCFullYear()}-${now.getUTCMonth()}`;

  const bySource: Record<string, number> = {};
  const byCategory: Record<string, number> = {};
  const byStatus: Record<string, number> = {};
  const byLeadScore: Record<LeadScore, number> = { 高: 0, 中: 0, 低: 0 };

  let highLead = 0;
  let unhandled = 0;
  let urgent = 0;
  let thisMonth = 0;
  let integrated = 0;

  for (const i of inquiries) {
    bySource[i.source] = (bySource[i.source] ?? 0) + 1;
    byCategory[i.category] = (byCategory[i.category] ?? 0) + 1;
    byStatus[i.status] = (byStatus[i.status] ?? 0) + 1;
    byLeadScore[i.lead_score] = (byLeadScore[i.lead_score] ?? 0) + 1;

    if (i.lead_score === "高") highLead += 1;
    if (i.status === "未対応") unhandled += 1;
    if (i.urgency === "高") urgent += 1;
    if (i.n8n_webhook_sent) integrated += 1;

    const d = new Date(i.created_at);
    if (`${d.getUTCFullYear()}-${d.getUTCMonth()}` === monthKey) thisMonth += 1;
  }

  return {
    total: inquiries.length,
    highLead,
    unhandled,
    urgent,
    thisMonth,
    integrated,
    bySource,
    byCategory,
    byLeadScore,
    byStatus,
  };
}
