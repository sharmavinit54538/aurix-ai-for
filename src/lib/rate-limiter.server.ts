/**
 * In-memory per-user rate limiter for server routes.
 *
 * Limits:
 * - 20 requests per minute
 * - 200 requests per day
 *
 * NOTE: For distributed or serverless deployments (such as Vercel, AWS Lambda, or Cloudflare Workers)
 * where in-memory state is not shared across isolated process instances,
 * replace this in-memory Map with an Upstash Redis or distributed Redis rate limiter.
 */

interface RateLimitRecord {
  minuteWindowStart: number;
  minuteCount: number;
  dayWindowStart: number;
  dayCount: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

const MINUTE_LIMIT = 20;
const DAY_LIMIT = 200;

const ONE_MINUTE_MS = 60 * 1000;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Periodic cleanup to avoid memory leak over time
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000;
let lastCleanup = Date.now();

function purgeStaleRecords(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, record] of rateLimitStore.entries()) {
    if (now - record.dayWindowStart > ONE_DAY_MS) {
      rateLimitStore.delete(key);
    }
  }
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds?: number;
  limit?: number;
  remaining?: number;
  reason?: string;
}

/**
 * Checks rate limits for a given user identifier.
 */
export function checkRateLimit(userId: string): RateLimitResult {
  const now = Date.now();
  purgeStaleRecords(now);

  let record = rateLimitStore.get(userId);

  if (!record) {
    record = {
      minuteWindowStart: now,
      minuteCount: 1,
      dayWindowStart: now,
      dayCount: 1,
    };
    rateLimitStore.set(userId, record);
    return {
      allowed: true,
      remaining: MINUTE_LIMIT - 1,
      limit: MINUTE_LIMIT,
    };
  }

  // Check 1-minute window
  if (now - record.minuteWindowStart >= ONE_MINUTE_MS) {
    record.minuteWindowStart = now;
    record.minuteCount = 0;
  }

  // Check 1-day window
  if (now - record.dayWindowStart >= ONE_DAY_MS) {
    record.dayWindowStart = now;
    record.dayCount = 0;
  }

  if (record.minuteCount >= MINUTE_LIMIT) {
    const retryAfterSeconds = Math.ceil(
      (record.minuteWindowStart + ONE_MINUTE_MS - now) / 1000,
    );
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
      limit: MINUTE_LIMIT,
      remaining: 0,
      reason: "Rate limit exceeded: max 20 requests per minute allowed.",
    };
  }

  if (record.dayCount >= DAY_LIMIT) {
    const retryAfterSeconds = Math.ceil(
      (record.dayWindowStart + ONE_DAY_MS - now) / 1000,
    );
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, retryAfterSeconds),
      limit: DAY_LIMIT,
      remaining: 0,
      reason: "Daily limit exceeded: max 200 requests per day allowed.",
    };
  }

  record.minuteCount += 1;
  record.dayCount += 1;

  return {
    allowed: true,
    limit: MINUTE_LIMIT,
    remaining: MINUTE_LIMIT - record.minuteCount,
  };
}
