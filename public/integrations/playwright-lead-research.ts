/**
 * AIリード対応ワークフロー — Playwright 営業リスト収集 / リード調査
 *
 * 役割: 問い合わせ前段の「リード獲得・エンリッチ」を自動化する例。
 *  - 公開ディレクトリ等から企業情報を収集（許諾・利用規約の範囲で実施）
 *  - 各社サイトから問い合わせ導線・事業概要を抽出
 *  - Claude で「自社サービスとの相性」を要約し、CSV出力
 *
 * 実行: npx tsx playwright-lead-research.ts
 * 依存: playwright, @anthropic-ai/sdk, csv-stringify
 *
 * ※ robots.txt と各サイトの利用規約を順守し、レート制限を守ること。
 */

import { chromium, type Page } from "playwright";
import Anthropic from "@anthropic-ai/sdk";
import { stringify } from "csv-stringify/sync";
import { writeFileSync } from "node:fs";

const anthropic = new Anthropic();

interface Lead {
  company: string;
  url: string;
  industry: string;
  hasContactForm: boolean;
  fitSummary: string;
}

const TARGET_URLS = [
  "https://example-directory.test/companies?industry=web",
  // ...対象リストのソースURL
];

async function extractCompanyLinks(page: Page, listUrl: string): Promise<string[]> {
  await page.goto(listUrl, { waitUntil: "domcontentloaded" });
  return page.$$eval("a.company-card__link", (els) =>
    els.map((e) => (e as HTMLAnchorElement).href).slice(0, 20)
  );
}

async function scrapeCompany(page: Page, url: string): Promise<Omit<Lead, "fitSummary">> {
  await page.goto(url, { waitUntil: "domcontentloaded" });
  const company = (await page.title()).split(/[|｜-]/)[0].trim();
  const industry =
    (await page.$eval('meta[name="keywords"]', (m) => m.getAttribute("content")).catch(() => "")) ?? "";
  const hasContactForm =
    (await page.locator('a:has-text("お問い合わせ"), a:has-text("Contact")').count()) > 0;
  return { company, url, industry, hasContactForm };
}

async function summarizeFit(company: string, industry: string): Promise<string> {
  const res = await anthropic.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 200,
    messages: [
      {
        role: "user",
        content:
          `企業「${company}」（業種ヒント: ${industry}）に対し、` +
          "問い合わせ対応・営業リード管理のAI自動化を提案する際の相性を80字以内で要約せよ。",
      },
    ],
  });
  const block = res.content.find((b) => b.type === "text");
  return block && block.type === "text" ? block.text.trim() : "";
}

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const leads: Lead[] = [];

  for (const listUrl of TARGET_URLS) {
    const links = await extractCompanyLinks(page, listUrl);
    for (const url of links) {
      const base = await scrapeCompany(page, url);
      const fitSummary = await summarizeFit(base.company, base.industry);
      leads.push({ ...base, fitSummary });
      await page.waitForTimeout(1500); // レート制限を守る
    }
  }

  await browser.close();
  const csv = stringify(leads, {
    header: true,
    columns: ["company", "url", "industry", "hasContactForm", "fitSummary"],
  });
  writeFileSync("leads.csv", csv);
  console.log(`収集完了: ${leads.length}件 → leads.csv`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
