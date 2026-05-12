const WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_PER_WINDOW = 10;

type RateRecord = { count: number; resetAt: number };
const store = new Map<string, RateRecord>();

export function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  const existing = store.get(ip);

  if (!existing || now >= existing.resetAt) {
    const next: RateRecord = { count: 1, resetAt: now + WINDOW_MS };
    store.set(ip, next);
    return { allowed: true, remaining: MAX_PER_WINDOW - 1, resetAt: next.resetAt };
  }

  if (existing.count >= MAX_PER_WINDOW) {
    return { allowed: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return { allowed: true, remaining: MAX_PER_WINDOW - existing.count, resetAt: existing.resetAt };
}
