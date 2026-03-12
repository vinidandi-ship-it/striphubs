import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clicksStore } from './track-click.js';

type ProviderStats = {
  provider: string;
  impressions: number;
  clicks: number;
  ctr: number;
  topCategories: Array<{ category: string; clicks: number }>;
  topCountries: Array<{ country: string; clicks: number }>;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
  if (adminKey && adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const providerStats: Record<string, ProviderStats> = {
    stripchat: { provider: 'stripchat', impressions: 0, clicks: 0, ctr: 0, topCategories: [], topCountries: [] },
    chaturbate: { provider: 'chaturbate', impressions: 0, clicks: 0, ctr: 0, topCategories: [], topCountries: [] }
  };

  const categoryClicks: Record<string, Record<string, number>> = { stripchat: {}, chaturbate: {} };
  const countryClicks: Record<string, Record<string, number>> = { stripchat: {}, chaturbate: {} };

  for (const click of clicksStore) {
    const provider = click.provider || 'stripchat';
    if (providerStats[provider]) {
      providerStats[provider].clicks++;
      
      if (click.category) {
        categoryClicks[provider][click.category] = (categoryClicks[provider][click.category] || 0) + 1;
      }
      if (click.country) {
        countryClicks[provider][click.country] = (countryClicks[provider][click.country] || 0) + 1;
      }
    }
  }

  for (const provider of ['stripchat', 'chaturbate'] as const) {
    const stats = providerStats[provider];
    stats.ctr = stats.impressions > 0 ? (stats.clicks / stats.impressions) * 100 : 0;
    
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
  const last24h = clicksStore.filter(c => Date.now() - c.timestamp < 24 * 60 * 60 * 1000).length;
  const last1h = clicksStore.filter(c => Date.now() - c.timestamp < 60 * 60 * 1000).length;

  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({
    summary: {
      totalClicks,
      last24h,
      last1h,
      storeSize: clicksStore.length
    },
    providers: providerStats,
    placements: {
      card: clicksStore.filter(c => c.placement === 'card').length,
      sticky: clicksStore.filter(c => c.placement === 'sticky').length,
      profile: clicksStore.filter(c => c.placement === 'profile').length,
      search: clicksStore.filter(c => c.placement === 'search').length
    },
    recommendation: {
      stripchat: 60,
      chaturbate: 40,
      note: 'Current rotation weights. Adjust based on conversion data.'
    }
  });
}
