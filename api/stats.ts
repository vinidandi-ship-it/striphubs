import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getConversionEvents, type ProviderId } from './postbacks-store.js';
import { clicksStore } from './track-click.js';

type ProviderStats = {
  provider: ProviderId;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  approvedConversions: number;
  pendingConversions: number;
  rejectedConversions: number;
  revenue: number;
  cvr: number;
  epc: number;
  topCategories: Array<{ category: string; clicks: number }>;
  topCountries: Array<{ country: string; clicks: number }>;
};

const PROVIDERS: ProviderId[] = ['stripchat', 'chaturbate', 'unknown'];

const normalizeProvider = (value: string | undefined): ProviderId => {
  if (value === 'stripchat' || value === 'chaturbate' || value === 'unknown') return value;
  if (!value) return 'stripchat';
  const normalized = value.toLowerCase();
  if (normalized.includes('strip')) return 'stripchat';
  if (normalized.includes('chataturbate') || normalized.includes('chaturbate')) return 'chaturbate';
  return 'unknown';
};

const toHourBucket = (timestamp: number): number => Math.floor(timestamp / 3_600_000) * 3_600_000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  if (adminKey && adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const providerStats: Record<ProviderId, ProviderStats> = {
    stripchat: {
      provider: 'stripchat',
      impressions: 0,
      clicks: 0,
      ctr: 0,
      conversions: 0,
      approvedConversions: 0,
      pendingConversions: 0,
      rejectedConversions: 0,
      revenue: 0,
      cvr: 0,
      epc: 0,
      topCategories: [],
      topCountries: []
    },
    chaturbate: {
      provider: 'chaturbate',
      impressions: 0,
      clicks: 0,
      ctr: 0,
      conversions: 0,
      approvedConversions: 0,
      pendingConversions: 0,
      rejectedConversions: 0,
      revenue: 0,
      cvr: 0,
      epc: 0,
      topCategories: [],
      topCountries: []
    },
    unknown: {
      provider: 'unknown',
      impressions: 0,
      clicks: 0,
      ctr: 0,
      conversions: 0,
      approvedConversions: 0,
      pendingConversions: 0,
      rejectedConversions: 0,
      revenue: 0,
      cvr: 0,
      epc: 0,
      topCategories: [],
      topCountries: []
    }
  };

  const categoryClicks: Record<ProviderId, Record<string, number>> = {
    stripchat: {},
    chaturbate: {},
    unknown: {}
  };

  const countryClicks: Record<ProviderId, Record<string, number>> = {
    stripchat: {},
    chaturbate: {},
    unknown: {}
  };

  for (const click of clicksStore) {
    const provider = normalizeProvider(click.provider);
    providerStats[provider].clicks++;

    if (click.category) {
      categoryClicks[provider][click.category] = (categoryClicks[provider][click.category] || 0) + 1;
    }

    if (click.country) {
      countryClicks[provider][click.country] = (countryClicks[provider][click.country] || 0) + 1;
    }
  }

  const conversionEvents = getConversionEvents();

  for (const conversion of conversionEvents) {
    const provider = normalizeProvider(conversion.provider);
    const stats = providerStats[provider];
    stats.conversions++;

    if (conversion.status === 'approved') {
      stats.approvedConversions++;
      stats.revenue += Math.max(0, conversion.payout || 0);
    } else if (conversion.status === 'pending') {
      stats.pendingConversions++;
    } else {
      stats.rejectedConversions++;
    }
  }

  for (const provider of PROVIDERS) {
    const stats = providerStats[provider];
    stats.ctr = stats.impressions > 0 ? (stats.clicks / stats.impressions) * 100 : 0;
    stats.cvr = stats.clicks > 0 ? (stats.approvedConversions / stats.clicks) * 100 : 0;
    stats.epc = stats.clicks > 0 ? stats.revenue / stats.clicks : 0;

    stats.topCategories = Object.entries(categoryClicks[provider])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([category, clicks]) => ({ category, clicks }));

    stats.topCountries = Object.entries(countryClicks[provider])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([country, clicks]) => ({ country, clicks }));
  }

  const totalClicks = clicksStore.length;
  const totalApproved = PROVIDERS.reduce((acc, provider) => acc + providerStats[provider].approvedConversions, 0);
  const totalRevenue = PROVIDERS.reduce((acc, provider) => acc + providerStats[provider].revenue, 0);

  const last24hStart = Date.now() - 24 * 60 * 60 * 1000;
  const last24h = clicksStore.filter((c) => c.timestamp >= last24hStart).length;
  const last1h = clicksStore.filter((c) => c.timestamp >= Date.now() - 60 * 60 * 1000).length;
  const conversions24h = conversionEvents.filter((c) => c.timestamp >= last24hStart).length;

  const now = Date.now();
  const firstBucket = toHourBucket(now - 23 * 3_600_000);
  const buckets = new Map<number, {
    ts: number;
    clicks: number;
    approvedConversions: number;
    pendingConversions: number;
    rejectedConversions: number;
    revenue: number;
  }>();

  for (let i = 0; i < 24; i++) {
    const ts = firstBucket + i * 3_600_000;
    buckets.set(ts, {
      ts,
      clicks: 0,
      approvedConversions: 0,
      pendingConversions: 0,
      rejectedConversions: 0,
      revenue: 0
    });
  }

  for (const click of clicksStore) {
    if (click.timestamp < firstBucket) continue;
    const ts = toHourBucket(click.timestamp);
    const bucket = buckets.get(ts);
    if (bucket) bucket.clicks++;
  }

  for (const conversion of conversionEvents) {
    if (conversion.timestamp < firstBucket) continue;
    const ts = toHourBucket(conversion.timestamp);
    const bucket = buckets.get(ts);
    if (!bucket) continue;

    if (conversion.status === 'approved') {
      bucket.approvedConversions++;
      bucket.revenue += Math.max(0, conversion.payout || 0);
    } else if (conversion.status === 'pending') {
      bucket.pendingConversions++;
    } else {
      bucket.rejectedConversions++;
    }
  }

  const placementCounts = clicksStore.reduce<Record<string, number>>((acc, click) => {
    acc[click.placement] = (acc[click.placement] || 0) + 1;
    return acc;
  }, {});

  const revShareBase = providerStats.stripchat.revenue + providerStats.chaturbate.revenue;
  const recommendation = revShareBase > 0
    ? {
        stripchat: Math.round((providerStats.stripchat.revenue / revShareBase) * 100),
        chaturbate: Math.round((providerStats.chaturbate.revenue / revShareBase) * 100),
        note: 'Revenue-based recommendation from approved postbacks.'
      }
    : {
        stripchat: 60,
        chaturbate: 40,
        note: 'Fallback split used until approved postbacks arrive.'
      };

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    summary: {
      totalClicks,
      totalApprovedConversions: totalApproved,
      totalRevenue,
      globalCvr: totalClicks > 0 ? (totalApproved / totalClicks) * 100 : 0,
      last24h,
      last1h,
      conversions24h,
      storeSize: clicksStore.length,
      conversionStoreSize: conversionEvents.length
    },
    providers: providerStats,
    placements: placementCounts,
    timeseries24h: Array.from(buckets.values()),
    recentConversions: [...conversionEvents]
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20)
      .map((event) => ({
        eventId: event.eventId,
        provider: event.provider,
        status: event.status,
        payout: event.payout,
        currency: event.currency,
        clickId: event.clickId,
        username: event.username,
        timestamp: event.timestamp
      })),
    recommendation
  });
}
