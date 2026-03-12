import { useState, useEffect, useCallback } from 'react';
import { getRevenueDashboard, getRevenueEstimate } from '../lib/revenue';

interface RevenueMetrics {
  affiliate: {
    stripchat: { clicks: number; conversions: number; revenue: number; cvr: number };
    chaturbate: { clicks: number; conversions: number; revenue: number; cvr: number };
    totalRevenue: number;
    recommendedWeight: { stripchat: number; chaturbate: number };
  };
  email: {
    subscribers: number;
    estimatedMonthlyRevenue: number;
    avgConversionRate: number;
  };
  display: {
    nativeAds: number;
    premiumAds: number;
    total: number;
  };
  premium: {
    users: number;
    activeUsers: number;
    mrr: number;
    conversionRate: number;
  };
  userTier: 'free' | 'premium';
  totalEstimated: number;
}

export function useRevenueDashboard(monthlyVisitors: number = 100000) {
  const [metrics, setMetrics] = useState<RevenueMetrics | null>(null);
  const [estimates, setEstimates] = useState<ReturnType<typeof getRevenueEstimate> | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(() => {
    setLoading(true);
    try {
      const dashboard = getRevenueDashboard();
      const revenueEstimate = getRevenueEstimate(monthlyVisitors);
      
      setMetrics(dashboard);
      setEstimates(revenueEstimate);
    } finally {
      setLoading(false);
    }
  }, [monthlyVisitors]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    metrics,
    estimates,
    loading,
    refresh
  };
}

export function useRevenueTracking() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [sessionStart] = useState(Date.now());

  useEffect(() => {
    const updateRevenue = () => {
      const dashboard = getRevenueDashboard();
      setTotalRevenue(dashboard.totalEstimated);
    };

    updateRevenue();

    const interval = setInterval(updateRevenue, 60000);
    return () => clearInterval(interval);
  }, []);

  const sessionDuration = (Date.now() - sessionStart) / 1000;

  return {
    totalRevenue,
    sessionDuration,
    revenuePerMinute: sessionDuration > 0 ? totalRevenue / (sessionDuration / 60) : 0
  };
}
