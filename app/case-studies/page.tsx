import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/section";

export const metadata: Metadata = {
  title: "導入ケース",
  description: "Web制作会社・広告代理店・士業・不動産・BtoB SaaSなど、業界別の課題と導入ワークフロー、想定効果、料金帯。",
};

interface Case {
  industry: string;
  issue: string;
  workflow: string;
  automated: string;
  effect: string;
  price: string;
  subcontract: string;
}

const CASES: Case[] = [
  {
    industry: "Web制作会社",
    issue: "HP制作後の追加提案メニューが少なく、ストック収益化に課題。",
    workflow: "HP問い合わせAI分類、返信文案生成、Sheets保存、Slack通知。",
    automated: "問い合わせ確認、担当者共有、初回返信案作成。",
    effect: "制作後の保守・改善メニュー化。継続取引のきっかけに。",
    price: "初期10万〜30万円 / 月額3万〜10万円",
    subcontract: "実装・連携・保守を丸ごと巻き取り。制作会社名義で納品可。",
  },
  {
    industry: "広告代理店",
    issue: "広告で獲得したリードの対応品質がクライアント依存で、取りこぼしが発生。",
    workflow: "広告リードAI分類、見込み度判定、即時通知、追客文案生成。",
    automated: "リードの優先順位付け、即時通知、追客メール下書き。",
    effect: "広告CV後の商談化率改善。レポートで成果を可視化。",
    price: "初期15万〜30万円 / 月額5万〜10万円",
    subcontract: "媒体レポートのAIコメント生成までセットで対応可能。",
  },
  {
    industry: "AI導入支援会社",
    issue: "提案はできるが、実際に動くワークフローの実装リソースが不足。",
    workflow: "問い合わせ分類〜通知〜保存の実装、Dify/LangGraph拡張。",
    automated: "実装、API連携、エラー対応、プロンプト改善。",
    effect: "提案から実装・運用までを一気通貫で提供できる体制に。",
    price: "初期30万円〜 / 月額5万〜15万円",
    subcontract: "技術実装パートナーとして稼働。要件定義から伴走可。",
  },
  {
    industry: "営業代行会社",
    issue: "リスト作成・問い合わせ分類・追客が属人的で工数がかかる。",
    workflow: "営業リスト整形、問い合わせ分類、追客管理、スコアリング。",
    automated: "リスト整形、見込み度判定、追客タイミング管理。",
    effect: "人の稼働を商談に集中。対応量と品質を両立。",
    price: "初期15万〜30万円 / 月額5万〜10万円",
    subcontract: "Playwrightによるリスト収集自動化も対応可能。",
  },
  {
    industry: "採用支援会社",
    issue: "応募者対応の初動が遅く、辞退・離脱が発生。個人情報配慮も必要。",
    workflow: "応募者AI分類、一次返信自動生成、面談調整リマインド。",
    automated: "応募確認、一次返信下書き、スコアリング、振り分け。",
    effect: "応募者へのスピード返信で歩留まり改善。",
    price: "初期15万〜30万円 / 月額5万〜10万円",
    subcontract: "個人情報の取り扱い方針に配慮した設計で実装。",
  },
  {
    industry: "士業事務所",
    issue: "相続・補助金・会社設立など問い合わせが増え、一次対応に時間がかかる。",
    workflow: "問い合わせ種別の分類、断定を避けた一次返信、有資格者へ振り分け。",
    automated: "問い合わせ分類、一次返信下書き、担当割り当て。",
    effect: "一次対応を効率化しつつ、専門判断は有資格者が担保。",
    price: "初期10万〜20万円 / 月額3万〜8万円",
    subcontract: "法務・個人情報に配慮し、断定的判断を避ける設計。",
  },
  {
    industry: "スクール・講座運営",
    issue: "資料請求後の追客が手動で、説明会への歩留まりが悪い。",
    workflow: "資料請求リードの分類、段階的な追客文面生成、説明会誘導。",
    automated: "追客メールの段階送信、未対応リマインド、集計。",
    effect: "説明会参加率・申込率の改善。",
    price: "初期10万〜25万円 / 月額3万〜8万円",
    subcontract: "既存のLP・フォーム・メール配信に合わせて連携。",
  },
  {
    industry: "不動産会社",
    issue: "ポータル経由の反響対応が遅く、内見につながらない。",
    workflow: "反響AI分類、即時一次返信、内見希望者の担当振り分け。",
    automated: "反響の即時返信、希望条件の整理、担当割り当て。",
    effect: "初動スピード向上で反響の取りこぼしを削減。",
    price: "初期15万〜30万円 / 月額5万〜10万円",
    subcontract: "重要事項は担当者確認前提の安全な設計で実装。",
  },
  {
    industry: "BtoBサービス会社",
    issue: "資料請求リードが増え、インサイドセールスの初動が追いつかない。",
    workflow: "問い合わせ分類、見込み度判定、Slack通知、Sheets保存、管理画面。",
    automated: "リード仕分け、即時通知、ステータス管理、追客。",
    effect: "インサイドセールスの初動を早め、商談化を最大化。",
    price: "初期15万〜30万円 / 月額5万〜10万円",
    subcontract: "既存CRM（Salesforce/HubSpot等）連携にも対応。",
  },
  {
    industry: "EC / 通販会社",
    issue: "問い合わせ・カスタマーサポートの一次対応が逼迫している。",
    workflow: "問い合わせ分類、FAQボット（Dify）、返信文案生成、エスカレーション。",
    automated: "問い合わせ仕分け、FAQ自動回答、有人対応への振り分け。",
    effect: "一次対応の自動化で対応工数を削減。",
    price: "初期15万〜30万円 / 月額5万〜12万円",
    subcontract: "DifyナレッジボットとSlack/Chatwork連携をセット提供。",
  },
];

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 py-1.5">
      <span className="w-20 shrink-0 text-xs font-medium text-ink-600">
        {label}
      </span>
      <span className="text-sm leading-relaxed text-ink-800">{value}</span>
    </div>
  );
}

export default function CaseStudiesPage() {
  return (
    <div className="container-wide py-12 sm:py-16">
      <div className="max-w-3xl">
        <Eyebrow>導入ケース</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
          業界別に、どう売れて・どう提案できるか
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-600">
          現場の課題から導入ワークフロー、自動化される作業、想定効果、料金帯、下請けとしての対応範囲までを業界別にまとめました。
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {CASES.map((c) => (
          <Card key={c.industry} className="transition-shadow hover:shadow-card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ink-950">
                  {c.industry}
                </h2>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-ink-600">
                  {c.price}
                </span>
              </div>
              <div className="mt-3 divide-y divide-ink-700/8">
                <Row label="課題" value={c.issue} />
                <Row label="ワークフロー" value={c.workflow} />
                <Row label="自動化" value={c.automated} />
                <Row label="想定効果" value={c.effect} />
                <Row label="下請け範囲" value={c.subcontract} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12 rounded-3xl border border-ink-700/12 bg-zinc-50 p-8 text-center">
        <h2 className="text-xl font-semibold text-ink-950">
          貴社の業界・商材に合わせた提案を作成します
        </h2>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/services" variant="secondary">
            料金プランを見る
          </ButtonLink>
          <ButtonLink href="/contact">提案を依頼する</ButtonLink>
        </div>
      </div>
    </div>
  );
}
