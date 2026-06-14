import type { Metadata } from "next";
import { Card, CardContent } from "@/components/ui/card";
import { Eyebrow } from "@/components/ui/section";
import { InquiryForm } from "@/components/inquiry/inquiry-form";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description: "AIリード対応ワークフローの導入・下請け実装のご相談。このフォーム自体もAIが分類します。",
};

export default function ContactPage() {
  return (
    <div className="container-page py-12 sm:py-16">
      <div className="mx-auto max-w-3xl">
        <Eyebrow>お問い合わせ</Eyebrow>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-950 sm:text-4xl">
          導入・下請け実装のご相談
        </h1>
        <p className="mt-3 text-base leading-relaxed text-ink-600">
          AIリード対応ワークフローの導入、または下請け実装パートナーとしてのご依頼など、お気軽にご相談ください。
        </p>

        <Card className="mt-6 border-ink-950/10 bg-zinc-50">
          <CardContent className="pt-5">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-ink-950 text-[11px] font-bold text-white">
                AI
              </span>
              <p className="text-sm leading-relaxed text-ink-700">
                <span className="font-medium text-ink-950">
                  このお問い合わせフォーム自体が、AIリード対応ワークフローのデモになっています。
                </span>
                送信すると、ご相談内容をAIが分類・見込み度判定し、返信文案の生成まで実行します。自社の問い合わせ対応をそのまま自動化している構成です。
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <InquiryForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
