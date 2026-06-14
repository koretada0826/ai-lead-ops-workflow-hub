-- =====================================================================
-- AIリード対応ワークフロー / AI Lead Ops Workflow Hub
-- Supabase スキーマ定義
--
-- Supabase の SQL Editor に貼り付けて実行してください。
-- アプリは Supabase 未設定でもインメモリのデモデータで動作しますが、
-- 本番運用ではこのスキーマを作成し、環境変数を設定してください。
-- =====================================================================

-- 拡張（gen_random_uuid 用）。Supabaseでは標準で有効なことが多い。
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- inquiries: 問い合わせ＋AI分析結果
-- ---------------------------------------------------------------------
create table if not exists public.inquiries (
  id                uuid primary key default gen_random_uuid(),
  -- 問い合わせ元情報
  company_name      text,
  contact_name      text,
  email             text,
  phone             text,
  source            text,             -- 流入元: HP / LP / 広告 / 資料請求 / 紹介 / SNS / メール / その他
  budget            text,             -- 予算感
  desired_timeline  text,             -- 希望対応時期
  message           text,             -- 問い合わせ本文
  -- AI分析結果
  category          text,             -- 問い合わせカテゴリ
  urgency           text,             -- 緊急度: 高 / 中 / 低
  lead_score        text,             -- 商談見込み度: 高 / 中 / 低
  summary           text,             -- 100文字以内の要約
  recommended_action text,            -- 推奨アクション
  reply_draft       text,             -- 初回返信文案
  followup_draft    text,             -- 3日後の追客文案
  assigned_role     text,             -- 推奨担当者ロール
  -- 運用情報
  status            text not null default '未対応',  -- 未対応/対応中/返信済み/商談化/失注/保留
  internal_note     text,
  n8n_webhook_sent  boolean not null default false,
  n8n_webhook_error text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists inquiries_created_at_idx on public.inquiries (created_at desc);
create index if not exists inquiries_status_idx     on public.inquiries (status);
create index if not exists inquiries_lead_score_idx on public.inquiries (lead_score);
create index if not exists inquiries_source_idx     on public.inquiries (source);

-- ---------------------------------------------------------------------
-- workflow_logs: 外部連携・処理ログ
-- ---------------------------------------------------------------------
create table if not exists public.workflow_logs (
  id          uuid primary key default gen_random_uuid(),
  inquiry_id  uuid references public.inquiries(id) on delete cascade,
  event_type  text,   -- form_submitted / ai_analyzed / supabase_saved / n8n_webhook / slack_planned / status_changed ...
  status      text,   -- success / skipped / planned / error
  message     text,
  created_at  timestamptz not null default now()
);

create index if not exists workflow_logs_inquiry_idx on public.workflow_logs (inquiry_id, created_at);

-- ---------------------------------------------------------------------
-- updated_at 自動更新トリガー
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_inquiries_updated_at on public.inquiries;
create trigger trg_inquiries_updated_at
  before update on public.inquiries
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security（任意）
-- 本アプリはサーバ側で Service Role キーを使うため RLS の影響を受けませんが、
-- anon キーでの直接アクセスを防ぐため RLS を有効化しておくのが安全です。
-- ---------------------------------------------------------------------
alter table public.inquiries     enable row level security;
alter table public.workflow_logs enable row level security;
-- ポリシーを定義しない場合、anon からの読み書きは拒否されます（サーバのService Role経由のみ許可）。
