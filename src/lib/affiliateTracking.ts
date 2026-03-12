import { ProviderId, AFFILIATE_PROVIDERS, selectProviderByPerformance, recordProviderClick } from './affiliateProviders';

const AFFILIATE_ID = import.meta.env.VITE_AFFILIATE_ID || 'd28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881';

interface ClickEvent {
  username: string;
  placement: 'card' | 'sticky' | 'profile' | 'search' | 'exit_intent' | 'floating_cta' | 'footer_cta' | 'inline_cta';
  category?: string;
  country?: string;
  viewers?: number;
  timestamp: number;
  referrer: string;
  provider?: ProviderId;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const trackAffiliateClick = (
  username: string,
  placement: ClickEvent['placement'],
  metadata?: { category?: string; country?: string; viewers?: number; provider?: ProviderId }
): void => {
  const provider = metadata?.provider || 'stripchat';
  
  recordProviderClick(provider);
  
  const event: ClickEvent = {
    username,
    placement,
    category: metadata?.category,
    country: metadata?.country,
    viewers: metadata?.viewers,
    timestamp: Date.now(),
    referrer: typeof document !== 'undefined' ? document.referrer : '',
    provider
  };

  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'affiliate_click', {
      event_category: 'conversion',
      event_label: username,
      placement: placement,
      viewers: metadata?.viewers || 0,
      category: metadata?.category || '',
      country: metadata?.country || '',
      provider: provider
    });
  }

  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    const payload = new Blob([JSON.stringify(event)], { type: 'application/json' });
    navigator.sendBeacon('/api/track-click', payload);
  }

  try {
    const stored = localStorage.getItem('sh_click_history') || '[]';
    const history = JSON.parse(stored) as ClickEvent[];
    history.push(event);
    if (history.length > 100) history.shift();
    localStorage.setItem('sh_click_history', JSON.stringify(history));
  } catch {
    // localStorage not available
  }
};

export const getClickHistory = (): ClickEvent[] => {
  try {
    return JSON.parse(localStorage.getItem('sh_click_history') || '[]');
  } catch {
    return [];
  }
};

export const getAffiliateUrl = (username: string): string => {
  return `https://go.mavrtracktor.com?userId=${AFFILIATE_ID}&model=${encodeURIComponent(username)}`;
};

export const getClickStats = (): { totalClicks: number; uniqueModels: number; todayClicks: number } => {
  const history = getClickHistory();
  const today = new Date().toDateString();
  const uniqueModels = new Set(history.map(e => e.username)).size;
  const todayClicks = history.filter(e => new Date(e.timestamp).toDateString() === today).length;
  
  return {
    totalClicks: history.length,
    uniqueModels,
    todayClicks
  };
};

export const getAffiliateUrlWithRotation = (username: string): { url: string; provider: ProviderId } => {
  const provider = selectProviderByPerformance();
  const url = AFFILIATE_PROVIDERS[provider].affiliateUrl(username);
  return { url, provider };
};
