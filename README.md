# AIリード対応ワークフロー / AI Lead Ops Workflow Hub

> 問い合わせ対応・営業リード管理を **AIで自動化** する、ポートフォリオ兼販売デモ用Webアプリ。

HP・LP・広告・資料請求フォームから届いた問い合わせを、AIが自動で
**分類 → 見込み度判定 → 緊急度判定 → 要約 → 返信文案生成 → 追客文案生成 → 管理画面保存 → Slack/Chatwork通知 → Google Sheets保存 → レポート化**
まで、一気通貫で処理する **AIリード対応ワークフロー** です。

単なるAIチャットボットや文章生成ツールではなく、**実際の業務フローとして動く形** で実装しています。

---

## 目次

1. [アプリ概要](#1-アプリ概要)
2. [解決する業務課題](#2-解決する業務課題)
3. [誰向けのサービスか](#3-誰向けのサービスか)
4. [実装機能](#4-実装機能)
5. [技術スタック](#5-技術スタック)
6. [画面一覧](#6-画面一覧)
7. [セットアップ方法](#7-セットアップ方法)
8. [Supabaseテーブル作成SQL](#8-supabaseテーブル作成sql)
9. [環境変数一覧](#9-環境変数一覧)
10. [AI API設定方法](#10-ai-api設定方法)
11. [n8n Webhook連携方法](#11-n8n-webhook連携方法)
12. [Google Sheets / Slack連携の想定](#12-google-sheets--slack連携の想定)
13. [Dify連携の拡張方法](#13-dify連携の拡張方法)
14. [GAS / Make / Zapier連携の拡張方法](#14-gas--make--zapier連携の拡張方法)
15. [LangGraph拡張の方向性](#15-langgraph拡張の方向性)
16. [Playwright / Claude for Chrome活用例](#16-playwright--claude-for-chrome活用例)
17. [デモモードの使い方](#17-デモモードの使い方)
18. [実案件でのカスタマイズ例](#18-実案件でのカスタマイズ例)
19. [受託メニュー](#19-受託メニュー)
20. [下請けパートナーとして対応できる範囲](#20-下請けパートナーとして対応できる範囲)
21. [営業時の説明文](#21-営業時の説明文)
22. [今後の拡張案](#22-今後の拡張案)

---

## 1. アプリ概要

企業のHP・LP・広告・資料請求フォーム・問い合わせフォームから届いたリード情報をAIが自動で整理し、営業担当がすぐ対応できる状態にするためのAIワークフローです。

問い合わせ内容をもとに、AIが以下を生成します。

- 問い合わせカテゴリ
- 緊急度（高/中/低）
- 商談見込み度（高/中/低）
- 100文字以内の要約
- 推奨アクション
- 初回返信文案
- 3日後の追客文案
- 推奨担当者ロール

さらに、Supabaseへの保存、管理画面での一覧・ステータス・内部メモ管理、n8n Webhook送信、Google Sheets保存想定、Slack/Chatwork通知想定、レポート化までを実装しています。

**重要な思想**: これは「問い合わせを増やすサービス」ではなく、「来た問い合わせを早く・漏れなく・商談化しやすく処理するサービス」です。広告やSEOで獲得したリードの取りこぼしを防ぎ、営業担当がすぐ動ける状態にします。

---

## 2. 解決する業務課題

- 問い合わせ対応の初動が遅く、商談化の取りこぼしが発生している
- 問い合わせの仕分け・優先順位付けが属人的で工数がかかる
- 返信文・追客文の作成に時間がかかる
- 流入元・カテゴリ別の傾向が可視化されていない
- 通知やスプレッドシート記録が手動で、漏れが起きる

---

## 3. 誰向けのサービスか

- **エンド企業**: 問い合わせ対応・営業リード管理をAIで自動化したい会社
- **下請け発注元**: Web制作会社・広告代理店・AI導入支援会社・営業代行会社
  （実装パートナーとして稼働します）

---

## 4. 実装機能

- 問い合わせフォーム（デモ）からのAI分析実行
- Claude / OpenAI / モックAI を切り替え可能なAI分析エンジン
- Supabase保存（未設定時はインメモリのデモデータで動作）
- 管理ダッシュボード（サマリーカード・集計・検索・各種フィルター）
- 問い合わせ詳細（ステータス変更・内部メモ・連携ログ）
- n8n Webhook送信（成功/失敗/スキップを記録）
- workflow_logs によるイベントログ
- Difyナレッジボット連携デモ（モック回答対応）
- ワークフロー可視化・技術スタック・導入ケース・料金メニューの各ページ
- 完全なデモモード（APIキー未設定でも全機能が動作）

---

## 5. 技術スタック

| カテゴリ | 使用技術 |
|---|---|
| フレームワーク | Next.js 14（App Router） / TypeScript |
| スタイル | Tailwind CSS（shadcn/ui風の自作UIプリミティブ） |
| データベース | Supabase（PostgreSQL） |
| AI | Claude API（Anthropic SDK） / OpenAI API / モックAI |
| 連携 | n8n Webhook / Google Sheets / Slack / Chatwork（想定） |
| 拡張 | Dify / GAS / Make / Zapier / LangGraph / Playwright / Claude for Chrome |
| デプロイ | Vercel 前提 |

---

## 6. 画面一覧

| パス | 画面 | 内容 |
|---|---|---|
| `/` | トップ | コンセプト・できること・スタック・対応範囲・CTA |
| `/demo/inquiry` | 問い合わせフォーム | 架空の問い合わせを入力しAI分析を実行 |
| `/demo/result/[id]` | AI分析結果 | 分類・見込み度・要約・返信/追客文案の表示 |
| `/dashboard` | 管理ダッシュボード | サマリー・集計・一覧・検索/フィルター |
| `/dashboard/inquiries/[id]` | 問い合わせ詳細 | 詳細・ステータス変更・メモ・連携ログ |
| `/workflow` | ワークフロー可視化 | 14ノードの業務フロー（ノード接続風） |
| `/stack` | 技術スタック | 各ツールの役割と使い分け |
| `/case-studies` | 導入ケース | 業界別の課題・ワークフロー・効果・料金帯 |
| `/services` | 料金・受託メニュー | プラン・メニュー・月額保守 |
| `/dify-demo` | Dify連携デモ | ナレッジボットのチャットデモ |
| `/contact` | お問い合わせ | フォーム自体がAIワークフローに連結 |

### API

| パス | メソッド | 内容 |
|---|---|---|
| `/api/analyze-inquiry` | POST | AI分析のみを実行（保存なし） |
| `/api/inquiries` | GET / POST | 一覧取得 / 受付フルパイプライン（分析+保存+n8n+ログ） |
| `/api/inquiries/[id]` | GET / PATCH | 取得 / ステータス・メモ更新 |
| `/api/dify-chat` | POST | Difyナレッジボット（未設定時モック） |

---

## 7. セットアップ方法

```bash
# 1. 依存関係をインストール
npm install

# 2. 環境変数ファイルを用意（任意。未設定でもデモモードで動作）
cp .env.example .env.local

# 3. 開発サーバーを起動
npm run dev
# → http://localhost:3000

# 本番ビルド
npm run build && npm run start
```

> **APIキーやSupabaseの設定は不要です。** 未設定の場合は自動的にデモモード（モックAI＋インメモリのサンプルデータ）で全画面が動作します。

### Vercelデプロイ

1. 本リポジトリをGitHub等にpush
2. Vercelでインポート
3. （任意）環境変数を設定（[§9](#9-環境変数一覧)）
4. デプロイ

---

## 8. Supabaseテーブル作成SQL

`supabase/schema.sql` に全文があります。Supabase の SQL Editor に貼り付けて実行してください（要点を抜粋）。

```sql
create extension if not exists pgcrypto;

create table if not exists public.inquiries (
  id                uuid primary key default gen_random_uuid(),
  company_name      text,
  contact_name      text,
  email             text,
  phone             text,
  source            text,
  budget            text,
  desired_timeline  text,
  message           text,
  category          text,
  urgency           text,
  lead_score        text,
  summary           text,
  recommended_action text,
  reply_draft       text,
  followup_draft    text,
  assigned_role     text,
  status            text not null default '未対応',
  internal_note     text,
  n8n_webhook_sent  boolean not null default false,
  n8n_webhook_error text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists public.workflow_logs (
  id          uuid primary key default gen_random_uuid(),
  inquiry_id  uuid references public.inquiries(id) on delete cascade,
  event_type  text,
  status      text,
  message     text,
  created_at  timestamptz not null default now()
);
```

---

## 9. 環境変数一覧

| 変数名 | 必須 | 説明 |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | 任意 | Supabase プロジェクトURL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 任意 | Supabase anon キー |
| `SUPABASE_SERVICE_ROLE_KEY` | 任意 | サーバ側書き込み用のService Roleキー |
| `AI_PROVIDER` | 任意 | `claude` / `openai` / `mock`（既定: mock） |
| `ANTHROPIC_API_KEY` | 任意 | Claude APIキー |
| `ANTHROPIC_MODEL` | 任意 | 使用モデル（既定: `claude-opus-4-8`） |
| `OPENAI_API_KEY` | 任意 | OpenAI APIキー |
| `OPENAI_MODEL` | 任意 | 使用モデル（既定: `gpt-4o-mini`） |
| `N8N_WEBHOOK_URL` | 任意 | n8n Webhook URL（未設定時は送信スキップ） |
| `DIFY_API_KEY` | 任意 | Dify APIキー |
| `DIFY_APP_ID` | 任意 | DifyアプリID |
| `DIFY_API_URL` | 任意 | Dify APIベースURL（既定: `https://api.dify.ai/v1`） |

> すべて未設定でもアプリは動作します（デモモード）。

---

## 10. AI API設定方法

`AI_PROVIDER` でエンジンを選択します。

- **Claude を使う**: `AI_PROVIDER=claude` ＋ `ANTHROPIC_API_KEY` を設定
- **OpenAI を使う**: `AI_PROVIDER=openai` ＋ `OPENAI_API_KEY` を設定
- **モック（デモ）**: `AI_PROVIDER=mock` または未設定

AI分析は `lib/ai/index.ts` の `analyzeInquiry()` に集約されています。実APIが失敗した場合でも **必ずモックにフォールバック** し、アプリが壊れないように設計しています。プロンプト仕様は `lib/ai/prompt.ts`、出力の正規化は `lib/ai/schema.ts` にあります。

既定モデルは最新の **Claude Opus 4.8**（`claude-opus-4-8`）です。大量処理でコストを抑えたい場合は `ANTHROPIC_MODEL=claude-haiku-4-5` などに変更してください。

---

## 11. n8n Webhook連携方法

`N8N_WEBHOOK_URL` を設定すると、問い合わせ保存後に問い合わせ情報＋AI分析結果のすべてをJSONでPOSTします。未設定時はスキップし、画面に「デモモード」と表示します。送信成功で `n8n_webhook_sent=true`、失敗で `n8n_webhook_error` に記録し、`workflow_logs` にも残します。

**想定するn8nワークフロー**

1. Webhook Trigger で受信
2. Set node で項目整形
3. IF node で `lead_score` が「高」か判定
4. Google Sheets node で問い合わせ一覧に1行追加
5. Slack node で通知（高見込みは強調）
6. エラー時は管理者向けに通知

**n8nで受け取るデータ**: `company_name` / `contact_name` / `email` / `phone` / `source` / `budget` / `desired_timeline` / `message` / `category` / `urgency` / `lead_score` / `summary` / `recommended_action` / `reply_draft` / `followup_draft` / `assigned_role` / `status` / `created_at`

---

## 12. Google Sheets / Slack連携の想定

**Google Sheets 列**:
`日時 / 会社名 / 担当者 / メール / 電話 / 流入元 / 予算感 / 希望時期 / カテゴリ / 見込み度 / 緊急度 / 要約 / 推奨対応 / ステータス / 返信文案 / 追客文案`

**Slack通知文テンプレート**（`lib/n8n.ts` の `buildSlackMessage`。詳細画面でプレビュー可能）:

```
新規問い合わせが入りました。
会社名：
担当者：
流入元：
カテゴリ：
見込み度：
緊急度：
要約：
推奨対応：
返信文案：
```

n8n の Google Sheets / Slack ノード、または GAS を使ってクライアントの既存運用シート・通知先にそのまま接続します。

---

## 13. Dify連携の拡張方法

`/dify-demo` で、社内FAQ・営業支援AI・問い合わせ対応ナレッジボットへの拡張を体験できます。`DIFY_API_KEY` / `DIFY_API_URL` を設定すると `/api/dify-chat` が実際のDifyアプリ（`/chat-messages`）に接続し、未設定時はモック回答を返します。

**活用例**: 問い合わせ対応ナレッジボット / 営業ロープレAI / 社内FAQ / サービス資料検索AI / 過去対応履歴の検索AI

---

## 14. GAS / Make / Zapier連携の拡張方法

- **GAS**: Google Sheets上でのステータス更新、メール下書き生成、日次集計、定期実行トリガーなど現場向け自動化。
- **Make / Zapier**: クライアントが既に使っているSaaS（kintone / Salesforce / Notion 等）とのノーコード簡易連携や既存フロー修正。

n8n Webhookの送信先・後続処理を、これらのツールに差し替える形で拡張できます。

---

## 15. LangGraph拡張の方向性

複数ステップのAIエージェント、承認フロー、人間確認（human-in-the-loop）を挟む高度ワークフローへ拡張します。例: 「分類 → 下書き → 人間承認 → 送信 → フォローアップ」を状態機械として管理し、条件分岐や再試行を含む堅牢な処理を実現します。

---

## 16. Playwright / Claude for Chrome活用例

- 営業リスト収集（企業情報・連絡先のリサーチ）
- 競合調査・求人媒体調査
- 管理画面の操作自動化
- E2Eテスト自動化・検証

問い合わせ対応の前段（リード獲得・調査）や、運用の検証フェーズを自動化します。

---

## 17. デモモードの使い方

1. `npm run dev` で起動（環境変数の設定は不要）
2. `/demo/inquiry` で「サンプルを入力」→「AI分析を実行する」
3. `/demo/result/[id]` でAI分析結果を確認
4. `/dashboard` で一覧・集計・フィルターを確認（12件のサンプル付き）
5. `/dashboard/inquiries/[id]` でステータス変更・メモ・連携ログを確認

モックAIは問い合わせ本文のキーワードでカテゴリを判定し、予算・希望時期・緊急表現から見込み度/緊急度をスコアリングします（決定的：同じ入力なら同じ出力）。

> インメモリのデモデータはサーバープロセス内に保持されます。Supabaseを設定すると永続化されます。

---

## 18. 実案件でのカスタマイズ例

- **カテゴリ/判定基準**: クライアントの商材に合わせて分類軸・スコアリング基準を調整（`lib/ai/prompt.ts` / `lib/ai/mock.ts`）
- **文面トーン**: 返信/追客文案のトーン&マナーをプロンプトで調整
- **保存先**: 既存DB・CRM（Salesforce / HubSpot / kintone）に合わせて保存先を変更
- **通知先**: Slack / Chatwork / メール / LINE WORKS など通知チャネルを差し替え
- **入力項目**: フォーム項目・選択肢を業種に合わせて追加（`lib/constants.ts`）

---

## 19. 受託メニュー

| プラン | 料金 | 内容 |
|---|---|---|
| ライト | 5万〜10万円 | フォーム連携 / AI分類 / 返信文案 / Sheets保存 |
| スタンダード | 15万〜30万円 | AI分類 / 見込み度・緊急度判定 / 通知 / Sheets / 管理画面 / 追客 |
| カスタム | 30万円〜 | 既存システム連携 / 複数部署 / Dify / CRM / レポート自動化 |
| 月額保守 | 3万〜10万円 | プロンプト改善 / 項目追加 / 通知先変更 / フロー修正 / エラー対応 / 月次改善 |

---

## 20. 下請けパートナーとして対応できる範囲

- Web制作会社: HP制作後の問い合わせ対応フロー実装（制作会社名義での納品可）
- 広告代理店: 広告リードの分類・即時通知・追客＋媒体レポートAIコメント
- AI導入支援会社: 提案後の実装・連携・運用を巻き取る技術実装パートナー
- 営業代行会社: リスト整形・分類・追客の自動化、リスト収集の自動化

要件定義から実装・連携・保守まで、フェーズ単位での発注に対応します。

---

## 21. 営業時の説明文

> このアプリは、HP・LP・広告から届いた問い合わせをAIが自動で分類し、見込み度判定、返信文案生成、Google Sheets保存、Slack通知まで行うAIリード対応ワークフローです。
> Web制作会社、広告代理店、AI導入支援会社、営業代行会社の下請け実装パートナーとして、既存のフォームやGoogle Sheets運用に合わせて小規模導入できます。

---

## 22. 今後の拡張案

- メール（Gmail / IMAP）受信からの自動取り込み
- LINE公式アカウント・Webチャットからのリード取り込み
- リードスコアの学習・自動チューニング
- 商談化率・対応速度のKPIダッシュボード強化
- LangGraphによる承認フロー付きエージェント化
- Playwright / Claude for Chrome による営業リスト収集の自動化
- マルチテナント化・SaaS化

---

**AIリード対応ワークフロー / AI Lead Ops Workflow Hub** — ポートフォリオであると同時に、問い合わせ対応・営業リード管理のAI自動化商品として販売できる構成です。
