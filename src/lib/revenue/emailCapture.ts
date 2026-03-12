const EMAIL_CONFIG = {
  enabled: true,
  popupDelay: 30000,
  exitIntentEnabled: true,
  scrollThreshold: 50,
  frequencyCap: 3,
  frequencyCapDays: 7,
  conversionValue: 0.50,
  webhookUrl: import.meta.env.VITE_EMAIL_WEBHOOK_URL || '/api/subscribe',
  tags: ['striphubs', 'cam-girls', 'adult-content']
};

interface EmailSubscriber {
  email: string;
  subscribedAt: number;
  source: 'popup' | 'exit-intent' | 'footer';
  tags: string[];
  conversionCount: number;
  lastEmailed: number | null;
}

interface EmailCaptureState {
  impressions: number;
  dismissals: number;
  lastShown: number | null;
  subscribers: EmailSubscriber[];
}

const getState = (): EmailCaptureState => {
  try {
    const stored = localStorage.getItem('sh_email_state');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return { impressions: 0, dismissals: 0, lastShown: null, subscribers: [] };
};

const saveState = (state: EmailCaptureState): void => {
  try {
    localStorage.setItem('sh_email_state', JSON.stringify(state));
  } catch {}
};

const canShowPopup = (): boolean => {
  if (!EMAIL_CONFIG.enabled) return false;
  
  const state = getState();
  const daysSinceLastShow = state.lastShown 
    ? (Date.now() - state.lastShown) / (1000 * 60 * 60 * 24) 
    : Infinity;
  
  if (state.dismissals >= EMAIL_CONFIG.frequencyCap && daysSinceLastShow < EMAIL_CONFIG.frequencyCapDays) {
    return false;
  }
  
  return true;
};

export const subscribeEmail = async (
  email: string,
  source: 'popup' | 'exit-intent' | 'footer'
): Promise<{ success: boolean; message: string }> => {
  const state = getState();
  
  if (state.subscribers.find(s => s.email === email)) {
    return { success: false, message: 'Email già registrata' };
  }
  
  const subscriber: EmailSubscriber = {
    email,
    subscribedAt: Date.now(),
    source,
    tags: EMAIL_CONFIG.tags,
    conversionCount: 0,
    lastEmailed: null
  };
  
  try {
    const response = await fetch(EMAIL_CONFIG.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscriber)
    });
    
    if (!response.ok) {
      throw new Error('Subscription failed');
    }
    
    state.subscribers.push(subscriber);
    saveState(state);
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'email_subscription', {
        event_category: 'revenue',
        event_label: source,
        value: EMAIL_CONFIG.conversionValue
      });
    }
    
    return { success: true, message: 'Iscrizione completata!' };
  } catch (error) {
    console.error('Email subscription error:', error);
    return { success: false, message: 'Errore durante l\'iscrizione' };
  }
};

export const recordEmailConversion = (email: string, value: number): void => {
  const state = getState();
  const subscriber = state.subscribers.find(s => s.email === email);
  
  if (subscriber) {
    subscriber.conversionCount++;
    saveState(state);
    
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'email_conversion', {
        event_category: 'revenue',
        event_label: email,
        value
      });
    }
  }
};

export const initEmailCapture = (): {
  showPopup: () => void;
  dismissPopup: () => void;
  cleanup: () => void;
} => {
  if (typeof window === 'undefined') {
    return { showPopup: () => {}, dismissPopup: () => {}, cleanup: () => {} };
  }
  
  let popupTimeout: ReturnType<typeof setTimeout> | null = null;
  let hasShown = false;
  
  const showPopup = () => {
    if (hasShown || !canShowPopup()) return;
    hasShown = true;
    
    const state = getState();
    state.impressions++;
    state.lastShown = Date.now();
    saveState(state);
    
    const event = new CustomEvent('showEmailPopup', { detail: { timestamp: Date.now() } });
    window.dispatchEvent(event);
    
    if (window.gtag) {
      window.gtag('event', 'email_popup_shown', {
        event_category: 'email_capture'
      });
    }
  };
  
  const dismissPopup = () => {
    const state = getState();
    state.dismissals++;
    saveState(state);
    
    const event = new CustomEvent('dismissEmailPopup', { detail: { timestamp: Date.now() } });
    window.dispatchEvent(event);
  };
  
  popupTimeout = setTimeout(showPopup, EMAIL_CONFIG.popupDelay);
  
  const handleExitIntent = () => {
    if (!hasShown && EMAIL_CONFIG.exitIntentEnabled && canShowPopup()) {
      showPopup();
    }
  };
  
  const handleScroll = () => {
    if (!hasShown && window.scrollY > (document.body.scrollHeight * EMAIL_CONFIG.scrollThreshold / 100)) {
      showPopup();
    }
  };
  
  window.addEventListener('exitIntent', handleExitIntent);
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return {
    showPopup,
    dismissPopup,
    cleanup: () => {
      if (popupTimeout) clearTimeout(popupTimeout);
      window.removeEventListener('exitIntent', handleExitIntent);
      window.removeEventListener('scroll', handleScroll);
    }
  };
};

export const getEmailStats = (): {
  subscribers: number;
  estimatedMonthlyRevenue: number;
  avgConversionRate: number;
} => {
  const state = getState();
  const totalConversions = state.subscribers.reduce((sum, s) => sum + s.conversionCount, 0);
  const avgConversionRate = state.subscribers.length > 0 
    ? totalConversions / state.subscribers.length 
    : 0;
  
  return {
    subscribers: state.subscribers.length,
    estimatedMonthlyRevenue: state.subscribers.length * EMAIL_CONFIG.conversionValue,
    avgConversionRate
  };
};

export const estimateMonthlyRevenue = (monthlyVisitors: number): {
  subscribers: number;
  revenue: number;
} => {
  const captureRate = 0.02;
  const estimatedSubscribers = Math.floor(monthlyVisitors * captureRate);
  const revenue = estimatedSubscribers * EMAIL_CONFIG.conversionValue;
  
  return {
    subscribers: estimatedSubscribers,
    revenue
  };
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
