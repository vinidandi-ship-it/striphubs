const DISPLAY_AD_CONFIG = {
  enabled: true,
  nativeAdsEnabled: true,
  premiumAdsEnabled: true,
  nativeAdInterval: 6,
  premiumAdThreshold: 3,
  cpmRates: {
    native: { mobile: 0.80, desktop: 1.20 },
    banner: { mobile: 0.50, desktop: 0.80 },
    premium: { mobile: 2.00, desktop: 3.50 }
  },
  networks: {
    native: 'exoclick',
    banner: 'exoclick',
    premium: 'exoclick'
  },
  zoneIds: {
    native: '5870896',
    banner: '5870866',
    premium: '5870892'
  }
};

interface AdState {
  impressions: { native: number; banner: number; premium: number };
  clicks: { native: number; banner: number; premium: number };
  affiliateClicksWithoutConversion: number;
  lastAdShown: number | null;
  userTier: 'free' | 'premium';
}

const getAdState = (): AdState => {
  try {
    const stored = localStorage.getItem('sh_ad_state');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return {
    impressions: { native: 0, banner: 0, premium: 0 },
    clicks: { native: 0, banner: 0, premium: 0 },
    affiliateClicksWithoutConversion: 0,
    lastAdShown: null,
    userTier: 'free'
  };
};

const saveAdState = (state: AdState): void => {
  try {
    localStorage.setItem('sh_ad_state', JSON.stringify(state));
  } catch {}
};

export const shouldShowNativeAd = (cardIndex: number): boolean => {
  if (!DISPLAY_AD_CONFIG.enabled || !DISPLAY_AD_CONFIG.nativeAdsEnabled) return false;
  
  const state = getAdState();
  if (state.userTier === 'premium') return false;
  
  return (cardIndex + 1) % DISPLAY_AD_CONFIG.nativeAdInterval === 0;
};

export const shouldShowPremiumAd = (): boolean => {
  if (!DISPLAY_AD_CONFIG.enabled || !DISPLAY_AD_CONFIG.premiumAdsEnabled) return false;
  
  const state = getAdState();
  if (state.userTier === 'premium') return false;
  
  return state.affiliateClicksWithoutConversion >= DISPLAY_AD_CONFIG.premiumAdThreshold;
};

export const recordAffiliateClick = (converted: boolean): void => {
  const state = getAdState();
  
  if (converted) {
    state.affiliateClicksWithoutConversion = 0;
  } else {
    state.affiliateClicksWithoutConversion++;
  }
  
  saveAdState(state);
};

export const recordAdImpression = (type: 'native' | 'banner' | 'premium'): void => {
  const state = getAdState();
  state.impressions[type]++;
  state.lastAdShown = Date.now();
  saveAdState(state);
  
  if (typeof window !== 'undefined' && window.gtag) {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const cpm = DISPLAY_AD_CONFIG.cpmRates[type][isMobile ? 'mobile' : 'desktop'];
    
    window.gtag('event', 'ad_impression', {
      event_category: 'display_ads',
      event_label: type,
      value: cpm / 1000
    });
  }
};

export const recordAdClick = (type: 'native' | 'banner' | 'premium'): void => {
  const state = getAdState();
  state.clicks[type]++;
  saveAdState(state);
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'ad_click', {
      event_category: 'display_ads',
      event_label: type
    });
  }
};

export const getAdNetworkScript = (type: 'native' | 'banner' | 'premium'): string => {
  const network = DISPLAY_AD_CONFIG.networks[type];
  const zoneId = DISPLAY_AD_CONFIG.zoneIds[type];
  
  switch (network) {
    case 'mgid':
      return `<script src="https://a.mgid.com/${zoneId}.js" async></script>`;
    case 'exoclick':
      return `<script src="https://a.exoclick.com/${zoneId}.js" async></script>`;
    case 'trafficstars':
      return `<script src="https://a.trafficstars.com/${zoneId}.js" async></script>`;
    default:
      return '';
  }
};

export const generateNativeAdSlot = (): {
  html: string;
  onMount: () => void;
} => {
  return {
    html: `
      <div class="native-ad-container sh-card" data-ad-type="native">
        <div class="ad-label text-[10px] text-text-muted mb-2">Sponsorizzato</div>
        <div id="native-ad-slot" class="native-ad-content"></div>
      </div>
    `,
    onMount: () => {
      recordAdImpression('native');
    }
  };
};

export const generatePremiumBannerSlot = (): {
  html: string;
  onMount: () => void;
} => {
  return {
    html: `
      <div class="premium-ad-container fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-[300px] bg-panel border border-border rounded-lg p-4 shadow-xl z-40" data-ad-type="premium">
        <button class="close-premium-ad absolute top-2 right-2 text-text-muted hover:text-white">✕</button>
        <div class="ad-label text-[10px] text-text-muted mb-2">Pubblicità Premium</div>
        <div id="premium-ad-slot" class="premium-ad-content"></div>
      </div>
    `,
    onMount: () => {
      recordAdImpression('premium');
      
      const closeBtn = document.querySelector('.close-premium-ad');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => {
          const container = document.querySelector('.premium-ad-container');
          if (container) {
            (container as HTMLElement).style.display = 'none';
          }
        });
      }
    }
  };
};

export const getDisplayAdStats = (): {
  impressions: { native: number; banner: number; premium: number };
  clicks: { native: number; banner: number; premium: number };
  estimatedRevenue: number;
  ctr: { native: number; banner: number; premium: number };
} => {
  const state = getAdState();
  const isMobile = typeof navigator !== 'undefined' && /Mobi|Android/i.test(navigator.userAgent);
  
  const nativeRevenue = (state.impressions.native / 1000) * DISPLAY_AD_CONFIG.cpmRates.native[isMobile ? 'mobile' : 'desktop'];
  const bannerRevenue = (state.impressions.banner / 1000) * DISPLAY_AD_CONFIG.cpmRates.banner[isMobile ? 'mobile' : 'desktop'];
  const premiumRevenue = (state.impressions.premium / 1000) * DISPLAY_AD_CONFIG.cpmRates.premium[isMobile ? 'mobile' : 'desktop'];
  
  const totalRevenue = nativeRevenue + bannerRevenue + premiumRevenue;
  
  return {
    impressions: state.impressions,
    clicks: state.clicks,
    estimatedRevenue: totalRevenue,
    ctr: {
      native: state.impressions.native > 0 ? (state.clicks.native / state.impressions.native) * 100 : 0,
      banner: state.impressions.banner > 0 ? (state.clicks.banner / state.impressions.banner) * 100 : 0,
      premium: state.impressions.premium > 0 ? (state.clicks.premium / state.impressions.premium) * 100 : 0
    }
  };
};

export const estimateMonthlyRevenue = (monthlyPageviews: number): {
  nativeAds: number;
  premiumAds: number;
  total: number;
} => {
  const nativeAdRate = 0.15;
  const premiumAdRate = 0.05;
  const avgNativeCpm = 1.00;
  const avgPremiumCpm = 2.75;
  
  const nativeImpressions = Math.floor(monthlyPageviews * nativeAdRate);
  const premiumImpressions = Math.floor(monthlyPageviews * premiumAdRate);
  
  const nativeRevenue = (nativeImpressions / 1000) * avgNativeCpm;
  const premiumRevenue = (premiumImpressions / 1000) * avgPremiumCpm;
  
  return {
    nativeAds: nativeRevenue,
    premiumAds: premiumRevenue,
    total: nativeRevenue + premiumRevenue
  };
};

export const setUserTier = (tier: 'free' | 'premium'): void => {
  const state = getAdState();
  state.userTier = tier;
  saveAdState(state);
};

export const getUserTier = (): 'free' | 'premium' => {
  const state = getAdState();
  return state.userTier;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
