import { useEffect, useState } from 'react';
import { useRevenueDashboard } from '../lib/useRevenue';

export default function RevenueDashboard() {
  const { metrics, estimates, loading, refresh } = useRevenueDashboard(100000);
  const [activeTab, setActiveTab] = useState<'overview' | 'affiliate' | 'email' | 'ads' | 'premium'>('overview');

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-panel p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-text-muted/20 rounded"></div>
          <div className="h-32 bg-text-muted/10 rounded"></div>
        </div>
      </div>
    );
  }

  if (!metrics || !estimates) return null;

  return (
    <div className="rounded-2xl border border-border bg-panel p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Revenue Dashboard</h2>
        <button
          onClick={refresh}
          className="rounded-lg bg-accent-primary px-4 py-2 text-sm font-medium text-white hover:bg-accent-primary/90"
        >
          Refresh
        </button>
      </div>

      <div className="mb-6 flex gap-2 overflow-x-auto">
        {(['overview', 'affiliate', 'email', 'ads', 'premium'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition ${
              activeTab === tab
                ? 'bg-accent-primary text-white'
                : 'bg-bg-tertiary text-text-secondary hover:bg-bg-tertiary/80'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="rounded-xl bg-gradient-to-br from-accent-primary/20 to-accent-primary/5 p-6">
            <div className="text-sm text-text-secondary">Estimated Monthly Revenue</div>
            <div className="text-4xl font-bold text-white">${estimates.total.toFixed(2)}</div>
            <div className="mt-2 text-sm text-text-muted">Based on 100K monthly visitors</div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {Object.entries(estimates.breakdown).map(([level, data]) => (
              <div key={level} className="rounded-lg border border-border bg-bg p-4">
                <div className="text-xs text-text-muted uppercase">Level {data.priority}</div>
                <div className="mt-1 text-lg font-bold text-white">${data.estimate.toFixed(2)}</div>
                <div className="mt-2 text-xs text-text-secondary line-clamp-2">{data.source}</div>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-border bg-bg p-4">
            <div className="text-sm font-medium text-white mb-2">User Status</div>
            <div className="flex items-center gap-2">
              <span className={`h-2 w-2 rounded-full ${metrics.userTier === 'premium' ? 'bg-accent-gold' : 'bg-text-muted'}`}></span>
              <span className="text-sm text-text-secondary capitalize">{metrics.userTier}</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'affiliate' && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-border bg-bg p-4">
              <div className="text-sm text-text-muted">Stripchat</div>
              <div className="text-2xl font-bold text-white">${metrics.affiliate.stripchat.revenue.toFixed(2)}</div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-text-muted">Clicks:</span> {metrics.affiliate.stripchat.clicks}</div>
                <div><span className="text-text-muted">Conv:</span> {metrics.affiliate.stripchat.conversions}</div>
                <div><span className="text-text-muted">CVR:</span> {metrics.affiliate.stripchat.cvr.toFixed(2)}%</div>
                <div><span className="text-text-muted">Weight:</span> {metrics.affiliate.recommendedWeight.stripchat}%</div>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-bg p-4">
              <div className="text-sm text-text-muted">Chaturbate</div>
              <div className="text-2xl font-bold text-white">${metrics.affiliate.chaturbate.revenue.toFixed(2)}</div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-text-muted">Clicks:</span> {metrics.affiliate.chaturbate.clicks}</div>
                <div><span className="text-text-muted">Conv:</span> {metrics.affiliate.chaturbate.conversions}</div>
                <div><span className="text-text-muted">CVR:</span> {metrics.affiliate.chaturbate.cvr.toFixed(2)}%</div>
                <div><span className="text-text-muted">Weight:</span> {metrics.affiliate.recommendedWeight.chaturbate}%</div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-bg p-4">
            <div className="text-sm font-medium text-white">Total Affiliate Revenue</div>
            <div className="text-3xl font-bold text-accent-primary">${metrics.affiliate.totalRevenue.toFixed(2)}</div>
          </div>
        </div>
      )}

      {activeTab === 'email' && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-bg p-4">
              <div className="text-sm text-text-muted">Subscribers</div>
              <div className="text-2xl font-bold text-white">{metrics.email.subscribers}</div>
            </div>
            <div className="rounded-lg border border-border bg-bg p-4">
              <div className="text-sm text-text-muted">Monthly Revenue</div>
              <div className="text-2xl font-bold text-accent-primary">${metrics.email.estimatedMonthlyRevenue.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-border bg-bg p-4">
              <div className="text-sm text-text-muted">Avg Conversion</div>
              <div className="text-2xl font-bold text-white">{metrics.email.avgConversionRate.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ads' && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-border bg-bg p-4">
              <div className="text-sm text-text-muted">Native Ads</div>
              <div className="text-2xl font-bold text-white">${metrics.display.nativeAds.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-border bg-bg p-4">
              <div className="text-sm text-text-muted">Premium Ads</div>
              <div className="text-2xl font-bold text-white">${metrics.display.premiumAds.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-border bg-bg p-4">
              <div className="text-sm text-text-muted">Total Ad Revenue</div>
              <div className="text-2xl font-bold text-accent-primary">${metrics.display.total.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'premium' && (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-4">
            <div className="rounded-lg border border-border bg-bg p-4">
              <div className="text-sm text-text-muted">Active Users</div>
              <div className="text-2xl font-bold text-white">{metrics.premium.activeUsers}</div>
            </div>
            <div className="rounded-lg border border-border bg-bg p-4">
              <div className="text-sm text-text-muted">Total Users</div>
              <div className="text-2xl font-bold text-white">{metrics.premium.users}</div>
            </div>
            <div className="rounded-lg border border-border bg-bg p-4">
              <div className="text-sm text-text-muted">MRR</div>
              <div className="text-2xl font-bold text-accent-gold">${metrics.premium.mrr.toFixed(2)}</div>
            </div>
            <div className="rounded-lg border border-border bg-bg p-4">
              <div className="text-sm text-text-muted">Conv Rate</div>
              <div className="text-2xl font-bold text-white">{metrics.premium.conversionRate.toFixed(2)}%</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
