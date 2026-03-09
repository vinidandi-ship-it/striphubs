import type { VercelRequest, VercelResponse } from '@vercel/node';
import { apiError, waitForRateLimit } from './shared.js';

const STATS_ENDPOINT = 'https://api.stripcash.com/external/v1/user/statistics';

const extractNumber = (input: unknown, fallback = 0): number => {
  const n = Number(input);
  return Number.isFinite(n) ? n : fallback;
};

const ALLOWED_PERIODS = new Set(['today', 'week', 'month', 'all']);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return apiError(res, 'Method not allowed', 405);

  const period = (req.query.period as string | undefined) || 'today';
  if (!ALLOWED_PERIODS.has(period)) return apiError(res, 'Invalid period', 400);

  try {
    const apiKey = process.env.STRIPCASH_STATS_API_KEY || process.env.STRIPCASH_API_KEY;
    if (!apiKey) return apiError(res, 'Missing STRIPCASH_STATS_API_KEY environment variable.', 500);

    await waitForRateLimit(5000);

    const upstream = new URL(STATS_ENDPOINT);
    upstream.searchParams.set('period', period);

    const response = await fetch(upstream.toString(), {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    });

    const rawText = await response.text();
    if (!response.ok) return apiError(res, `upstream error: ${rawText.slice(0, 300)}`, response.status);

    const payload = JSON.parse(rawText) as Record<string, unknown>;
    const stats = (payload.statistics as Record<string, unknown> | undefined) || {};
    const data = (stats.data as Record<string, unknown> | undefined) || {};
    const totals = Array.isArray(data.totals) ? (data.totals[0] as Record<string, unknown> | undefined) : undefined;

    const normalized = {
      clicks: extractNumber(totals?.clicks ?? totals?.totalClicks ?? 0),
      registrations: extractNumber(totals?.registrations ?? totals?.signups ?? 0),
      earnings: extractNumber(totals?.earning ?? totals?.earnings ?? totals?.revenue ?? 0)
    };

    return res.status(200).json(normalized);
  } catch (error) {
    return apiError(res, error instanceof Error ? error.message : 'upstream error', 500);
  }
}
