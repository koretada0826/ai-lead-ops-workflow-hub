/**
 * AIリード対応ワークフロー — Google Apps Script
 * 役割:
 *  1) n8n / アプリからの Webhook を受け、問い合わせ一覧シートに1行追加
 *  2) シート上でステータスを変更したら担当者へ通知（onEdit）
 *  3) 毎朝9時に「未対応・高見込み」の日次ダイジェストをメール送信
 *
 * セットアップ:
 *  - スクリプトプロパティに SHEET_ID / NOTIFY_EMAIL を設定
 *  - dailyDigest にトリガー（時間主導 / 毎日 9:00）を設定
 *  - doPost を Web アプリとしてデプロイ（アクセス: 全員）
 */

const PROPS = PropertiesService.getScriptProperties();
const SHEET_NAME = '問い合わせ一覧';
const HEADERS = [
  '日時', '会社名', '担当者', 'メール', '電話', '流入元', '予算感', '希望時期',
  'カテゴリ', '見込み度', '緊急度', '要約', '推奨対応', 'ステータス', '返信文案', '追客文案',
];

function getSheet_() {
  const ss = SpreadsheetApp.openById(PROPS.getProperty('SHEET_ID'));
  let sh = ss.getSheetTemplate ? null : ss.getSheetByName(SHEET_NAME);
  if (!sh) {
    sh = ss.insertSheet(SHEET_NAME);
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sh.setFrozenRows(1);
  }
  return sh;
}

/** Webhook受信 → 1行追加 */
function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);
    const sh = getSheet_();
    sh.appendRow([
      d.created_at || new Date().toISOString(),
      d.company_name, d.contact_name, d.email, d.phone, d.source,
      d.budget, d.desired_timeline, d.category, d.lead_score, d.urgency,
      d.summary, d.recommended_action, d.status || '未対応',
      d.reply_draft, d.followup_draft,
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** ステータス列を編集したら担当者へメール通知 */
function onEdit(e) {
  const sh = e.range.getSheet();
  if (sh.getName() !== SHEET_NAME) return;
  const statusCol = HEADERS.indexOf('ステータス') + 1;
  if (e.range.getColumn() !== statusCol || e.range.getRow() === 1) return;

  const row = e.range.getRow();
  const company = sh.getRange(row, HEADERS.indexOf('会社名') + 1).getValue();
  const status = e.range.getValue();
  MailApp.sendEmail({
    to: PROPS.getProperty('NOTIFY_EMAIL'),
    subject: `[リード] ${company} のステータスが「${status}」に変更されました`,
    body: `${company} の対応ステータスが「${status}」に更新されました。\nシートをご確認ください。`,
  });
}

/** 毎朝9時: 未対応・高見込みの日次ダイジェスト */
function dailyDigest() {
  const sh = getSheet_();
  const rows = sh.getDataRange().getValues();
  const idx = (name) => HEADERS.indexOf(name);

  const targets = rows.slice(1).filter((r) =>
    r[idx('ステータス')] === '未対応' || r[idx('見込み度')] === '高'
  );
  if (targets.length === 0) return;

  const lines = targets.map((r) =>
    `・${r[idx('会社名')]}（${r[idx('流入元')]} / 見込み${r[idx('見込み度')]} / ${r[idx('ステータス')]}）\n  ${r[idx('要約')]}`
  );
  MailApp.sendEmail({
    to: PROPS.getProperty('NOTIFY_EMAIL'),
    subject: `[日次] 要対応リード ${targets.length}件`,
    body: `本日の要対応リード一覧:\n\n${lines.join('\n\n')}`,
  });
}
