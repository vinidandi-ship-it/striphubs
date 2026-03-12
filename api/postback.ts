import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { addConversionEvent, type ConversionEvent, type ConversionStatus, type ProviderId } from './postbacks-store.js';

const toString = (value: unknown): string => {
  if (Array.isArray(value)) return String(value[0] ?? '').trim();
  return typeof value === 'string' ? value.trim() : String(value ?? '').trim();
};

const toNumber = (value: unknown): number => {
  const n = Number(toString(value));
  return Number.isFinite(n) ? n : 0;
};

const first = (payload: Record<string, unknown>, keys: string[]): string => {
  for (const key of keys) {
    const value = payload[key];
    const normalized = toString(value);
    if (normalized) return normalized;
  }
  return '';
};

const normalizeProvider = (value: string): ProviderId => {
  const v = value.toLowerCase();
  if (v.includes('strip')) return 'stripchat';
  if (v.includes('chataturbate') || v.includes('chaturbate')) return 'chaturbate';
  return 'unknown';
};

const normalizeStatus = (value: string): ConversionStatus => {
  const v = value.toLowerCase();
  if (['approved', 'paid', 'confirmed', 'sale', 'success'].includes(v)) return 'approved';
  if (['rejected', 'declined', 'void', 'chargeback', 'failed', 'cancelled'].includes(v)) return 'rejected';
  return 'pending';
};

const parseRequestPayload = (req: VercelRequest): Record<string, unknown> => {
  const queryPayload: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(req.query || {})) {
    queryPayload[key] = Array.isArray(value) ? value[0] : value;
  }

  let bodyPayload: Record<string, unknown> = {};
  if (req.method === 'POST') {
    if (typeof req.body === 'string') {
      try {
        const parsed = JSON.parse(req.body) as Record<string, unknown>;
        bodyPayload = parsed && typeof parsed === 'object' ? parsed : {};
      } catch {
        const params = new URLSearchParams(req.body);
        bodyPayload = Object.fromEntries(params.entries());
      }
    } else if (req.body && typeof req.body === 'object') {
      bodyPayload = req.body as Record<string, unknown>;
    }
  }

  return { ...queryPayload, ...bodyPayload };
};

const buildCanonicalPayload = (payload: Record<string, unknown>): string => {
  const ignored = new Set(['sig', 'signature', 'hmac', 'token']);
  const entries = Object.entries(payload)
    .filter(([key]) => !ignored.has(key))
    .map(([key, value]) => [key, toString(value)] as const)
    .sort(([a], [b]) => a.localeCompare(b));

  return entries.map(([key, value]) => `${key}=${value}`).join('&');
};

const safeCompare = (a: string, b: string): boolean => {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
};

const verifySignature = (payload: Record<string, unknown>, secret: string): boolean => {
  const provided = first(payload, ['sig', 'signature', 'hmac'])
    .replace(/^sha256=/i, '')
    .toLowerCase();

  if (!provided) return false;

  const canonical = buildCanonicalPayload(payload);
  const expected = createHmac('sha256', secret).update(canonical).digest('hex').toLowerCase();
  return safeCompare(expected, provided);
};

const buildEventId = (payload: Record<string, unknown>, provider: ProviderId): string => {
  const explicit = first(payload, [
    'eventId',
    'event_id',
    'conversionId',
    'conversion_id',
    'transaction_id',
    'transactionId',
    'txn_id',
    'txid',
    'id',
    'click_id',
    'clickId'
  ]);
  if (explicit) return `${provider}:${explicit}`;

  const fallback = createHash('sha256').update(buildCanonicalPayload(payload)).digest('hex').slice(0, 24);
  return `${provider}:derived:${fallback}`;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const payload = parseRequestPayload(req);
  const postbackToken = process.env.POSTBACK_TOKEN;
  const postbackSecret = process.env.POSTBACK_SECRET;

  if (!postbackToken && !postbackSecret) {
    return res.status(500).json({ error: 'Postback auth is not configured' });
  }

  if (postbackToken) {
    const providedToken = first(payload, ['token']) || toString(req.headers['x-postback-token']);
    if (!providedToken || providedToken !== postbackToken) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  }

  if (postbackSecret && !verifySignature(payload, postbackSecret)) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const provider = normalizeProvider(first(payload, ['provider', 'network', 'source', 'program']));
  const status = normalizeStatus(first(payload, ['status', 'event', 'state']));
  const payout = toNumber(first(payload, ['payout', 'amount', 'revenue', 'earning', 'commission']));
  const currency = first(payload, ['currency']) || 'USD';
  const clickId = first(payload, ['clickId', 'click_id', 'subid', 's1']);
  const username = first(payload, ['username', 'model', 'room']);
  const externalTxnId = first(payload, ['transaction_id', 'transactionId', 'txid']);
  const timestamp = toNumber(first(payload, ['timestamp', 'ts', 'time'])) || Date.now();
  const eventId = buildEventId(payload, provider);
  const sourceIp = toString(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '');

  const event: ConversionEvent = {
    eventId,
    provider,
    status,
    payout,
    currency,
    clickId: clickId || undefined,
    username: username || undefined,
    externalTxnId: externalTxnId || undefined,
    timestamp,
    sourceIp: sourceIp || undefined,
    raw: payload
  };

  const { duplicate } = addConversionEvent(event);

  return res.status(200).json({
    success: true,
    duplicate,
    eventId,
    provider,
    status,
    payout,
    currency
  });
}
