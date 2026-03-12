const AFFILIATE_CONFIG = {
  stripchat: {
    id: import.meta.env.VITE_STRIPCHAT_AFFILIATE_ID || 'd28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881',
    baseUrl: 'https://go.mavrtracktor.com',
    weight: 60
  },
  chaturbate: {
    id: import.meta.env.VITE_CHATURBATE_AFFILIATE_ID || '',
    baseUrl: 'https://chaturbate.com/in',
    weight: 40
  }
};

interface AffiliateStats {
  stripchat: { clicks: number; conversions: number; revenue: number };
  chaturbate: { clicks: number; conversions: number; revenue: number };
  lastUpdated: number;
}

interface RotationResult {
  platform: 'stripchat' | 'chaturbate';
  url: string;
  trackingId: string;
}

const getStats = (): AffiliateStats => {
  try {
    const stored = localStorage.getItem('sh_affiliate_stats');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return {
    stripchat: { clicks: 0, conversions: 0, revenue: 0 },
    chaturbate: { clicks: 0, conversions: 0, revenue: 0 },
    lastUpdated: Date.now()
  };
};

const saveStats = (stats: AffiliateStats): void => {
  try {
    localStorage.setItem('sh_affiliate_stats', JSON.stringify(stats));
  } catch {}
};

export const selectAffiliate = (
  username: string,
  forcePlatform?: 'stripchat' | 'chaturbate'
): RotationResult => {
  const stats = getStats();
  const trackingId = `${Date.now()}_${Math.random().toString(36).substring(7)}`;
  
  let platform: 'stripchat' | 'chaturbate';
  
  if (forcePlatform) {
    platform = forcePlatform;
  } else {
    const totalClicks = stats.stripchat.clicks + stats.chaturbate.clicks;
    
    if (totalClicks < 100) {
      const random = Math.random() * 100;
      platform = random < AFFILIATE_CONFIG.stripchat.weight ? 'stripchat' : 'chaturbate';
    } else {
      const stripchatRatio = stats.stripchat.clicks / totalClicks;
      platform = stripchatRatio < 0.6 ? 'stripchat' : 'chaturbate';
    }
  }
  
  stats[platform].clicks++;
  stats.lastUpdated = Date.now();
  saveStats(stats);
  
  let url: string;
  if (platform === 'stripchat') {
    url = `${AFFILIATE_CONFIG.stripchat.baseUrl}?userId=${AFFILIATE_CONFIG.stripchat.id}&model=${encodeURIComponent(username)}&track=${trackingId}`;
  } else {
    url = `${AFFILIATE_CONFIG.chaturbate.baseUrl}/${AFFILIATE_CONFIG.chaturbate.id}/?track=${trackingId}&room=${encodeURIComponent(username)}`;
  }
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'affiliate_rotation', {
      event_category: 'revenue',
      event_label: platform,
      tracking_id: trackingId,
      username
    });
  }
  
  return { platform, url, trackingId };
};

export const recordConversion = (
  trackingId: string,
  platform: 'stripchat' | 'chaturbate',
  value: number
): void => {
  const stats = getStats();
  stats[platform].conversions++;
  stats[platform].revenue += value;
  stats.lastUpdated = Date.now();
  saveStats(stats);
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      event_category: 'revenue',
      event_label: platform,
      value,
      tracking_id: trackingId
    });
  }
};

export const getAffiliatePerformance = (): {
  stripchat: { clicks: number; conversions: number; revenue: number; cvr: number };
  chaturbate: { clicks: number; conversions: number; revenue: number; cvr: number };
  totalRevenue: number;
  recommendedWeight: { stripchat: number; chaturbate: number };
} => {
  const stats = getStats();
  
  const stripchatCvr = stats.stripchat.clicks > 0 
    ? (stats.stripchat.conversions / stats.stripchat.clicks) * 100 
    : 0;
  const chaturbateCvr = stats.chaturbate.clicks > 0 
    ? (stats.chaturbate.conversions / stats.chaturbate.clicks) * 100 
    : 0;
  
  const totalRevenue = stats.stripchat.revenue + stats.chaturbate.revenue;
  
  let recommendedWeight = { stripchat: 60, chaturbate: 40 };
  if (stripchatCvr > 0 || chaturbateCvr > 0) {
    const totalCvr = stripchatCvr + chaturbateCvr;
    if (totalCvr > 0) {
      recommendedWeight = {
        stripchat: Math.round((stripchatCvr / totalCvr) * 100),
        chaturbate: Math.round((chaturbateCvr / totalCvr) * 100)
      };
    }
  }
  
  return {
    stripchat: { ...stats.stripchat, cvr: stripchatCvr },
    chaturbate: { ...stats.chaturbate, cvr: chaturbateCvr },
    totalRevenue,
    recommendedWeight
  };
};

export const optimizeWeights = (): void => {
  const performance = getAffiliatePerformance();
  const { recommendedWeight } = performance;
  
  AFFILIATE_CONFIG.stripchat.weight = recommendedWeight.stripchat;
  AFFILIATE_CONFIG.chaturbate.weight = recommendedWeight.chaturbate;
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'affiliate_optimization', {
      event_category: 'revenue',
      stripchat_weight: recommendedWeight.stripchat,
      chaturbate_weight: recommendedWeight.chaturbate
    });
  }
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
