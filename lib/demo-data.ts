import { mockAnalyze } from "./ai/mock";
import type { Inquiry, InquiryStatus, WorkflowLog } from "./types";

interface SeedBase {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  source: string;
  budget: string;
  desired_timeline: string;
  message: string;
  status: InquiryStatus;
  internal_note: string | null;
  n8n_webhook_sent: boolean;
  daysAgo: number;
}

// 12件の実務的サンプル。AI分析フィールドは mockAnalyze で補完して一貫性を保つ。
const SEEDS: SeedBase[] = [
  {
    id: "11111111-0001-4a01-8001-000000000001",
    company_name: "株式会社サンライズ商事",
    contact_name: "田中 健一",
    email: "tanaka@sunrise-trading.example.jp",
    phone: "03-1234-0001",
    source: "HP",
    budget: "30万〜50万円",
    desired_timeline: "すぐに相談したい",
    message:
      "新規開拓のための営業リスト作成とテレアポ前の優先順位付けを自動化したいです。現在は手作業で月に2,000件ほどのリストを作っており、担当者3名で属人的に運用していて工数がかなりかかっています。至急ご相談したいです。",
    status: "未対応",
    internal_note: null,
    n8n_webhook_sent: true,
    daysAgo: 0,
  },
  {
    id: "11111111-0002-4a01-8001-000000000002",
    company_name: "グロウスマーケティング合同会社",
    contact_name: "佐藤 美咲",
    email: "sato@growth-mk.example.jp",
    phone: "06-2345-0002",
    source: "資料請求",
    budget: "10万〜30万円",
    desired_timeline: "1週間以内",
    message:
      "問い合わせフォームから来たリードをAIで自動分類し、見込み度ごとに担当へ振り分けたいです。問い合わせ対応の初動が遅く、商談化の取りこぼしが課題になっています。",
    status: "対応中",
    internal_note: "初回返信済み。来週オンライン商談予定。",
    n8n_webhook_sent: true,
    daysAgo: 1,
  },
  {
    id: "11111111-0003-4a01-8001-000000000003",
    company_name: "アドフロンティア株式会社",
    contact_name: "鈴木 大輔",
    email: "suzuki@ad-frontier.example.jp",
    phone: "03-3456-0003",
    source: "広告",
    budget: "30万〜50万円",
    desired_timeline: "今月中",
    message:
      "複数クライアントの広告レポートを毎月作成しており、GA4とリスティングの数値をまとめてAIコメントを自動生成したいです。ROASやコンバージョンの変動説明に毎回時間がかかっています。",
    status: "返信済み",
    internal_note: "サンプルレポート送付済み。",
    n8n_webhook_sent: true,
    daysAgo: 2,
  },
  {
    id: "11111111-0004-4a01-8001-000000000004",
    company_name: "サーチアップ株式会社",
    contact_name: "高橋 直樹",
    email: "takahashi@searchup.example.jp",
    phone: "052-456-0004",
    source: "LP",
    budget: "10万〜30万円",
    desired_timeline: "今月中",
    message:
      "SEOのレポート業務を効率化したいです。Search Consoleの検索順位やコンテンツ別の流入をまとめ、変動の要因をAIに要約させたいと考えています。",
    status: "対応中",
    internal_note: null,
    n8n_webhook_sent: true,
    daysAgo: 3,
  },
  {
    id: "11111111-0005-4a01-8001-000000000005",
    company_name: "株式会社ヒトテラス",
    contact_name: "伊藤 彩",
    email: "ito@hitoterrace.example.jp",
    phone: "03-5678-0005",
    source: "紹介",
    budget: "50万円以上",
    desired_timeline: "すぐに相談したい",
    message:
      "採用の応募者対応を自動化したいです。応募から面談調整までの一次対応に時間がかかっており、応募者へのスピード返信とスコアリングをAIで支援したいです。個人情報の扱いには配慮が必要です。",
    status: "商談化",
    internal_note: "要件定義フェーズ。個人情報配慮の方針を別途確認。",
    n8n_webhook_sent: true,
    daysAgo: 4,
  },
  {
    id: "11111111-0006-4a01-8001-000000000006",
    company_name: "テックサポート・ジャパン株式会社",
    contact_name: "渡辺 翔",
    email: "watanabe@techsupport-jp.example.jp",
    phone: "03-6789-0006",
    source: "HP",
    budget: "10万〜30万円",
    desired_timeline: "3ヶ月以内",
    message:
      "社内FAQと問い合わせ対応のナレッジボットを作りたいです。Difyを使って、過去の問い合わせ履歴やサービス資料を参照して回答できるチャットボットを検討しています。",
    status: "未対応",
    internal_note: null,
    n8n_webhook_sent: false,
    daysAgo: 5,
  },
  {
    id: "11111111-0007-4a01-8001-000000000007",
    company_name: "やまと総合法務事務所",
    contact_name: "山本 法子",
    email: "yamamoto@yamato-legal.example.jp",
    phone: "03-7890-0007",
    source: "メール",
    budget: "5万〜10万円",
    desired_timeline: "情報収集中",
    message:
      "相続や会社設立の問い合わせが増えており、一次対応の振り分けを自動化できないか情報収集しています。士業のため断定的な回答は避けたいです。",
    status: "保留",
    internal_note: "予算感が小さめ。ライトプラン提案を検討。",
    n8n_webhook_sent: false,
    daysAgo: 6,
  },
  {
    id: "11111111-0008-4a01-8001-000000000008",
    company_name: "未来キャリアスクール",
    contact_name: "中村 さやか",
    email: "nakamura@mirai-school.example.jp",
    phone: "045-901-0008",
    source: "資料請求",
    budget: "5万〜10万円",
    desired_timeline: "今月中",
    message:
      "講座の資料請求後の追客を自動化したいです。説明会への誘導メールを段階的に送る仕組みを作りたいですが、現状は手動で歩留まりが悪いです。",
    status: "返信済み",
    internal_note: null,
    n8n_webhook_sent: true,
    daysAgo: 7,
  },
  {
    id: "11111111-0009-4a01-8001-000000000009",
    company_name: "株式会社みなと不動産",
    contact_name: "小林 健太",
    email: "kobayashi@minato-estate.example.jp",
    phone: "078-012-0009",
    source: "広告",
    budget: "10万〜30万円",
    desired_timeline: "1週間以内",
    message:
      "ポータルサイト経由の反響対応を早くしたいです。物件への問い合わせに即時で一次返信し、内見希望者を担当に振り分けたいです。重要事項は担当者が確認する前提で運用したいです。",
    status: "対応中",
    internal_note: "反響流入元を確認中。",
    n8n_webhook_sent: true,
    daysAgo: 8,
  },
  {
    id: "11111111-0010-4a01-8001-000000000010",
    company_name: "クラウドワークス・ソリューションズ株式会社",
    contact_name: "加藤 拓也",
    email: "kato@cw-solutions.example.jp",
    phone: "03-1230-0010",
    source: "LP",
    budget: "30万〜50万円",
    desired_timeline: "今月中",
    message:
      "BtoB SaaSの資料請求リードが増えてきたため、問い合わせの分類と見込み度判定、Slack通知、スプレッドシート保存までを一気通貫で構築したいです。インサイドセールスの初動を早めたいです。",
    status: "商談化",
    internal_note: "スタンダードプランで提案。次回見積もり提示。",
    n8n_webhook_sent: true,
    daysAgo: 10,
  },
  {
    id: "11111111-0011-4a01-8001-000000000011",
    company_name: "株式会社ネクストエデュ",
    contact_name: "吉田 真一",
    email: "yoshida@nextedu.example.jp",
    phone: "03-2340-0011",
    source: "紹介",
    budget: "30万〜50万円",
    desired_timeline: "1週間以内",
    message:
      "先日のAI研修を受けて、実際の業務に自動化を導入したいです。研修で学んだn8nとGASを使って、まずは小さく問い合わせ対応の自動化から伴走支援してほしいです。",
    status: "未対応",
    internal_note: null,
    n8n_webhook_sent: true,
    daysAgo: 12,
  },
  {
    id: "11111111-0012-4a01-8001-000000000012",
    company_name: "個人事業 スズキデザイン",
    contact_name: "鈴木 一郎",
    email: "ichiro@suzuki-design.example.jp",
    phone: "090-0000-0012",
    source: "SNS",
    budget: "5万円未満",
    desired_timeline: "情報収集中",
    message:
      "とりあえずどんなことができるのか情報収集しています。まだ具体的な予算は決まっていませんが、将来的に問い合わせ対応をラクにできたらいいなと思っています。",
    status: "失注",
    internal_note: "情報収集段階。資料のみ送付。",
    n8n_webhook_sent: false,
    daysAgo: 20,
  },
];

const DAY_MS = 24 * 60 * 60 * 1000;
// 決定的な基準時刻（2026-06-13 10:00 JST 相当）でサンプルの作成日時を作る。
const BASE_TIME = Date.parse("2026-06-13T01:00:00.000Z");

export function buildDemoInquiries(): Inquiry[] {
  return SEEDS.map((s) => {
    const analysis = mockAnalyze(s);
    const created = new Date(BASE_TIME - s.daysAgo * DAY_MS).toISOString();
    return {
      id: s.id,
      company_name: s.company_name,
      contact_name: s.contact_name,
      email: s.email,
      phone: s.phone,
      source: s.source,
      budget: s.budget,
      desired_timeline: s.desired_timeline,
      message: s.message,
      ...analysis,
      status: s.status,
      internal_note: s.internal_note,
      n8n_webhook_sent: s.n8n_webhook_sent,
      n8n_webhook_error: null,
      created_at: created,
      updated_at: created,
    };
  });
}

export function buildDemoLogs(inquiries: Inquiry[]): WorkflowLog[] {
  const logs: WorkflowLog[] = [];
  for (const inq of inquiries) {
    const t = Date.parse(inq.created_at);
    const at = (offset: number) => new Date(t + offset).toISOString();
    let i = 0;
    const push = (
      event_type: WorkflowLog["event_type"],
      status: WorkflowLog["status"],
      message: string
    ) => {
      logs.push({
        id: `${inq.id}-log-${i}`,
        inquiry_id: inq.id,
        event_type,
        status,
        message,
        created_at: at(i * 1500),
      });
      i += 1;
    };
    push("form_submitted", "success", "問い合わせフォームから受信");
    push("ai_analyzed", "success", `AI分析完了（カテゴリ: ${inq.category} / 見込み度: ${inq.lead_score}）`);
    push("supabase_saved", "success", "Supabaseに保存しました");
    if (inq.n8n_webhook_sent) {
      push("n8n_webhook", "success", "n8n Webhookに送信しました");
      push("sheets_planned", "planned", "Google Sheetsへの追加予定");
      push("slack_planned", "planned", "Slack通知予定");
    } else {
      push("n8n_webhook", "skipped", "デモモード: n8n Webhook未設定のためスキップ");
    }
  }
  return logs;
}
