export { selectAffiliate, getAffiliatePerformance, optimizeWeights } from './affiliateRotator';
export { initPopunder, initExitIntent } from './exitTraffic';
export { initEmailCapture, getEmailStats } from './emailCapture';
export { estimateMonthlyRevenue as estimateDisplayRevenue, setUserTier, getUserTier } from './displayAds';
export { estimateMonthlyRevenue as estimatePremiumRevenue, getPremiumStats, isPremiumUser, initPremiumUpsell } from './premium';
export { REVENUE_CONFIG } from './config';

import { selectAffiliate, getAffiliatePerformance, optimizeWeights } from './affiliateRotator';
import { initPopunder, initExitIntent, estimateMonthlyRevenue as estimateExitRevenue } from './exitTraffic';
import { initEmailCapture, estimateMonthlyRevenue as estimateEmailRevenue, getEmailStats } from './emailCapture';
import { estimateMonthlyRevenue as estimateDisplayRevenue, setUserTier, getUserTier } from './displayAds';
import { estimateMonthlyRevenue as estimatePremiumRevenue, getPremiumStats, isPremiumUser, initPremiumUpsell } from './premium';

export const initRevenueStack = (): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  
  const cleanups: (() => void)[] = [];
  
  // DISABLED: No popups, no email capture
  // const cleanupPopunder = initPopunder();
  // if (cleanupPopunder) cleanups.push(cleanupPopunder);
  
  // const cleanupExitIntent = initExitIntent();
  // if (cleanupExitIntent) cleanups.push(cleanupExitIntent);
  
  // const emailCapture = initEmailCapture();
  // if (emailCapture?.cleanup) cleanups.push(emailCapture.cleanup);
  
  // DISABLED: No premium upsell popups
  // const premiumUpsell = initPremiumUpsell();
  // if (premiumUpsell?.cleanup) cleanups.push(premiumUpsell.cleanup);
  
  const optimizeInterval = setInterval(() => {
    optimizeWeights();
  }, 24 * 60 * 60 * 1000);
  
  cleanups.push(() => clearInterval(optimizeInterval));
  
  return () => {
    cleanups.forEach(cleanup => cleanup());
  };
};

export const getRevenueEstimate = (monthlyVisitors: number): {
  affiliate: number;
  exitTraffic: number;
  email: number;
  displayAds: number;
  premium: number;
  total: number;
  breakdown: {
    level1: { source: string; estimate: number; priority: number };
    level2: { source: string; estimate: number; priority: number };
    level3: { source: string; estimate: number; priority: number };
    level4: { source: string; estimate: number; priority: number };
    level5: { source: string; estimate: number; priority: number };
  };
} => {
  const pageviewsPerVisitor = 3;
  const monthlyPageviews = monthlyVisitors * pageviewsPerVisitor;
  
  const affiliateRevenue = monthlyVisitors * 0.003;
  const exitRevenue = estimateExitRevenue(monthlyPageviews)?.revenue || 0;
  const emailRevenue = estimateEmailRevenue(monthlyVisitors)?.revenue || 0;
  const displayRevenue = estimateDisplayRevenue(monthlyPageviews)?.total || 0;
  const premiumRevenue = estimatePremiumRevenue(monthlyVisitors)?.mrr || 0;
  
  const total = affiliateRevenue + exitRevenue + emailRevenue + displayRevenue + premiumRevenue;
  
  return {
    affiliate: affiliateRevenue,
    exitTraffic: exitRevenue,
    email: emailRevenue,
    displayAds: displayRevenue,
    premium: premiumRevenue,
    total,
    breakdown: {
      level1: { source: 'Primary Affiliate (Stripchat/Chaturbate 60/40)', estimate: affiliateRevenue, priority: 1 },
      level2: { source: 'Exit Traffic (Popunder)', estimate: exitRevenue, priority: 2 },
      level3: { source: 'Email Capture', estimate: emailRevenue, priority: 3 },
      level4: { source: 'Display Ads', estimate: displayRevenue, priority: 4 },
      level5: { source: 'Premium/VIP', estimate: premiumRevenue, priority: 5 }
    }
  };
};

export const getRevenueDashboard = () => {
  const affiliate = getAffiliatePerformance();
  const email = getEmailStats();
  const display = estimateDisplayRevenue(100000);
  const premium = getPremiumStats();
  const userTier = getUserTier();
  
  const totalEstimated = (affiliate?.totalRevenue || 0) + 
                         (email?.estimatedMonthlyRevenue || 0) + 
                         (display?.total || 0) + 
                         (premium?.mrr || 0);
  
  return {
    affiliate,
    email,
    display,
    premium,
    userTier,
    totalEstimated
  };
};
