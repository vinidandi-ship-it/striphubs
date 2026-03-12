const PREMIUM_CONFIG = {
  enabled: true,
  price: 4.99,
  currency: 'EUR',
  billingCycle: 'monthly',
  trialDays: 7,
  features: [
    'no-ads',
    'unlimited-favorites',
    'advanced-search',
    'exclusive-models',
    'hd-thumbnails',
    'priority-support'
  ],
  conversionTarget: 0.01,
  upgradeThreshold: 5,
  paymentProvider: 'stripe'
};

interface PremiumUser {
  email: string;
  subscribedAt: number;
  plan: 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  features: string[];
}

interface PremiumState {
  impressions: number;
  dismissals: number;
  lastShown: number | null;
  conversionAttempts: number;
  users: PremiumUser[];
}

const getPremiumState = (): PremiumState => {
  try {
    const stored = localStorage.getItem('sh_premium_state');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return {
    impressions: 0,
    dismissals: 0,
    lastShown: null,
    conversionAttempts: 0,
    users: []
  };
};

const savePremiumState = (state: PremiumState): void => {
  try {
    localStorage.setItem('sh_premium_state', JSON.stringify(state));
  } catch {}
};

export const isPremiumUser = (): boolean => {
  const state = getPremiumState();
  const activeUser = state.users.find(u => u.status === 'active');
  return !!activeUser;
};

export const getPremiumUser = (): PremiumUser | null => {
  const state = getPremiumState();
  return state.users.find(u => u.status === 'active') || null;
};

export const shouldShowPremiumUpsell = (): boolean => {
  if (!PREMIUM_CONFIG.enabled) return false;
  if (isPremiumUser()) return false;
  
  const adState = localStorage.getItem('sh_ad_state');
  if (adState) {
    const parsed = JSON.parse(adState);
    if (parsed.affiliateClicksWithoutConversion >= PREMIUM_CONFIG.upgradeThreshold) {
      return true;
    }
  }
  
  return false;
};

export const initPremiumUpsell = (): {
  showUpsell: () => void;
  dismissUpsell: () => void;
  cleanup: () => void;
} => {
  if (typeof window === 'undefined') {
    return { showUpsell: () => {}, dismissUpsell: () => {}, cleanup: () => {} };
  }
  
  let hasShown = false;
  let exitIntentTriggered = false;
  
  const showUpsell = () => {
    if (hasShown || isPremiumUser()) return;
    hasShown = true;
    
    const state = getPremiumState();
    state.impressions++;
    state.lastShown = Date.now();
    savePremiumState(state);
    
    const event = new CustomEvent('showPremiumUpsell', { 
      detail: { 
        timestamp: Date.now(),
        price: PREMIUM_CONFIG.price,
        features: PREMIUM_CONFIG.features
      } 
    });
    window.dispatchEvent(event);
    
    if (window.gtag) {
      window.gtag('event', 'premium_upsell_shown', {
        event_category: 'premium',
        value: PREMIUM_CONFIG.price
      });
    }
  };
  
  const dismissUpsell = () => {
    const state = getPremiumState();
    state.dismissals++;
    savePremiumState(state);
    
    const event = new CustomEvent('dismissPremiumUpsell', { detail: { timestamp: Date.now() } });
    window.dispatchEvent(event);
  };
  
  const handleExitIntent = () => {
    if (!exitIntentTriggered && shouldShowPremiumUpsell()) {
      exitIntentTriggered = true;
      setTimeout(showUpsell, 500);
    }
  };
  
  window.addEventListener('exitIntent', handleExitIntent);
  
  return {
    showUpsell,
    dismissUpsell,
    cleanup: () => {
      window.removeEventListener('exitIntent', handleExitIntent);
    }
  };
};

export const createCheckoutSession = async (
  email: string,
  plan: 'monthly' | 'yearly' = 'monthly'
): Promise<{ success: boolean; checkoutUrl?: string; error?: string }> => {
  const state = getPremiumState();
  state.conversionAttempts++;
  savePremiumState(state);
  
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        plan,
        price: plan === 'monthly' ? PREMIUM_CONFIG.price : PREMIUM_CONFIG.price * 10,
        currency: PREMIUM_CONFIG.currency,
        successUrl: `${window.location.origin}/premium/success`,
        cancelUrl: `${window.location.origin}/premium/cancel`
      })
    });
    
    if (!response.ok) {
      throw new Error('Checkout session creation failed');
    }
    
    const data = await response.json();
    
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        event_category: 'premium',
        items: [{
          name: `Premium ${plan}`,
          price: plan === 'monthly' ? PREMIUM_CONFIG.price : PREMIUM_CONFIG.price * 10,
          quantity: 1
        }]
      });
    }
    
    return { success: true, checkoutUrl: data.url };
  } catch (error) {
    console.error('Checkout error:', error);
    return { success: false, error: 'Errore durante il checkout' };
  }
};

export const activatePremium = (
  email: string,
  subscriptionId: string,
  customerId: string,
  plan: 'monthly' | 'yearly'
): void => {
  const state = getPremiumState();
  
  const user: PremiumUser = {
    email,
    subscribedAt: Date.now(),
    plan,
    status: 'active',
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    features: PREMIUM_CONFIG.features
  };
  
  state.users = state.users.filter(u => u.email !== email);
  state.users.push(user);
  savePremiumState(state);
  
  const adState = localStorage.getItem('sh_ad_state');
  if (adState) {
    const parsed = JSON.parse(adState);
    parsed.userTier = 'premium';
    localStorage.setItem('sh_ad_state', JSON.stringify(parsed));
  }
  
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'purchase', {
      event_category: 'premium',
      transaction_id: subscriptionId,
      value: plan === 'monthly' ? PREMIUM_CONFIG.price : PREMIUM_CONFIG.price * 10,
      currency: PREMIUM_CONFIG.currency,
      items: [{
        name: `Premium ${plan}`,
        quantity: 1
      }]
    });
  }
};

export const cancelPremium = (email: string): void => {
  const state = getPremiumState();
  const user = state.users.find(u => u.email === email);
  
  if (user) {
    user.status = 'cancelled';
    savePremiumState(state);
    
    const adState = localStorage.getItem('sh_ad_state');
    if (adState) {
      const parsed = JSON.parse(adState);
      parsed.userTier = 'free';
      localStorage.setItem('sh_ad_state', JSON.stringify(parsed));
    }
  }
};

export const getPremiumFeatures = (): string[] => {
  return PREMIUM_CONFIG.features;
};

export const getPremiumPrice = (): { monthly: number; yearly: number; currency: string } => {
  return {
    monthly: PREMIUM_CONFIG.price,
    yearly: PREMIUM_CONFIG.price * 10,
    currency: PREMIUM_CONFIG.currency
  };
};

export const getPremiumStats = (): {
  users: number;
  activeUsers: number;
  mrr: number;
  conversionRate: number;
} => {
  const state = getPremiumState();
  const activeUsers = state.users.filter(u => u.status === 'active');
  const monthlyUsers = activeUsers.filter(u => u.plan === 'monthly');
  const yearlyUsers = activeUsers.filter(u => u.plan === 'yearly');
  
  const mrr = (monthlyUsers.length * PREMIUM_CONFIG.price) + 
              (yearlyUsers.length * (PREMIUM_CONFIG.price * 10) / 12);
  
  const conversionRate = state.impressions > 0 
    ? (activeUsers.length / state.impressions) * 100 
    : 0;
  
  return {
    users: state.users.length,
    activeUsers: activeUsers.length,
    mrr,
    conversionRate
  };
};

export const estimateMonthlyRevenue = (monthlyVisitors: number): {
  premiumUsers: number;
  mrr: number;
} => {
  const estimatedPremiumUsers = Math.floor(monthlyVisitors * PREMIUM_CONFIG.conversionTarget);
  const mrr = estimatedPremiumUsers * PREMIUM_CONFIG.price;
  
  return {
    premiumUsers: estimatedPremiumUsers,
    mrr
  };
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
