import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Difyナレッジボットのモック回答。問い合わせ対応ノウハウを返す。
function mockDifyAnswer(question: string): string {
  const q = question || "";
  if (/(返信|どう返|文面|メール)/.test(q)) {
    return [
      "過去の対応履歴とFAQナレッジを参照しました。返信のポイントは次の3点です。",
      "",
      "1. まず相手の課題に共感し、問い合わせへの感謝を述べます。",
      "2. 断定を避けつつ、解決の方向性（例: 小さく始める自動化）を1つ提示します。",
      "3. 「30分のオンライン相談」など、次の具体アクションに誘導します。",
      "",
      "高見込みリードの場合は24時間以内の初動が商談化率に大きく影響します。",
    ].join("\n");
  }
  if (/(見込み|スコア|優先)/.test(q)) {
    return [
      "見込み度の判断基準（社内ナレッジより）:",
      "・予算と導入時期が明確 → 高",
      "・具体的な課題が記載されている → 中〜高",
      "・情報収集のみ・予算未定 → 中〜低",
      "高見込みはSlackで強調通知し、当日中に一次対応するのが推奨フローです。",
    ].join("\n");
  }
  if (/(料金|価格|いくら|費用)/.test(q)) {
    return [
      "料金レンジ（サービス資料より）:",
      "・ライト: 5〜10万円（フォーム連携＋AI分類＋返信文案＋Sheets保存）",
      "・スタンダード: 15〜30万円（見込み度判定＋通知＋管理画面＋追客）",
      "・カスタム: 30万円〜（既存システム連携／Dify／レポート自動化）",
      "・月額保守: 3〜10万円（プロンプト改善・項目追加・エラー対応）",
    ].join("\n");
  }
  return [
    "ご質問ありがとうございます。社内FAQと過去の問い合わせ対応履歴を参照して回答します。",
    "",
    "このボットは Dify を使い、サービス資料・FAQ・過去対応ナレッジを横断検索して、",
    "営業担当の「この問い合わせにどう対応すべきか」をその場で支援する想定です。",
    "",
    "具体的な問い合わせ文面を貼っていただければ、返信方針・見込み度・推奨アクションを提案します。",
  ].join("\n");
}

export async function POST(req: Request) {
  let body: { query?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSONが不正です。" }, { status: 400 });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json(
      { error: "リクエストボディはオブジェクトである必要があります。" },
      { status: 400 }
    );
  }
  const query = (body.query || "").toString();

  const hasDify =
    !!process.env.DIFY_API_KEY && !!process.env.DIFY_API_URL;

  if (!hasDify) {
    return NextResponse.json({
      answer: mockDifyAnswer(query),
      mode: "demo",
    });
  }

  try {
    const res = await fetch(`${process.env.DIFY_API_URL}/chat-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: {},
        query,
        response_mode: "blocking",
        user: "lead-ops-demo",
      }),
    });
    if (!res.ok) throw new Error(`Dify API error ${res.status}`);
    const data = (await res.json()) as { answer?: string };
    return NextResponse.json({ answer: data.answer ?? "", mode: "live" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({
      answer: mockDifyAnswer(query),
      mode: "demo",
      note: `Dify API接続に失敗したためデモ回答を表示: ${msg}`,
    });
  }
}
