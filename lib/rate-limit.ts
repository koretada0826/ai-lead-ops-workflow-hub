/**
 * シンプルなインメモリ・レート制限（ポートフォリオ公開デモ用）。
 * 同一IPからの短時間の連投を制限し、公開デモでのAI API濫用＝課金暴走を防ぐ。
 * ※サーバ複数インスタンス間では厳密に共有されないが、Anthropic側の
 *   月額上限(spend limit)と二重の保険にするのが狙い。
 */
type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  limit = 5,
  windowMs = 60_000
): { ok: boolean; retryAfter: number } {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }

  if (bucket.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
  }

  bucket.count += 1;
  return { ok: true, retryAfter: 0 };
}
