export type ProviderId = 'stripchat' | 'chaturbate' | 'crackrevenue';

export type ProviderConfig = {
  id: ProviderId;
  name: string;
  weight: number;
  affiliateUrl: (username: string, options?: { room?: string }) => string;
  apiEndpoint?: string;
  priority: number;
};

export const AFFILIATE_PROVIDERS: Record<ProviderId, ProviderConfig> = {
  stripchat: {
    id: 'stripchat',
    name: 'Stripchat',
    weight: 50,
    priority: 1,
    affiliateUrl: (username: string) =>
      `https://go.mavrtracktor.com?userId=d28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881&model=${encodeURIComponent(username)}`,
    apiEndpoint: 'https://go.mavrtracktor.com/api/models'
  },
  chaturbate: {
    id: 'chaturbate',
    name: 'Chaturbate',
    weight: 30,
    priority: 2,
    affiliateUrl: (username: string, options?: { room?: string }) =>
      `https://chaturbate.com/in/?tour=LQps&campaign=fxmnz&track=default&room=${encodeURIComponent(username)}`
  },
  crackrevenue: {
    id: 'crackrevenue',
    name: 'CrackRevenue',
    weight: 20,
    priority: 3,
    affiliateUrl: (username: string) =>
      `https://t.vlmai-3.com/407726/7477?aff_sub5=SF_006OG000004lmDN`
  }
};

export const PROVIDER_WEIGHTS: Array<{ provider: ProviderId; weight: number }> = [
  { provider: 'stripchat', weight: 50 },
  { provider: 'chaturbate', weight: 30 },
  { provider: 'crackrevenue', weight: 20 }
];

type RotationState = {
  stripchat: number;
  chaturbate: number;
  crackrevenue: number;
  lastProvider: ProviderId;
  impressions: Record<ProviderId, number>;
  clicks: Record<ProviderId, number>;
};

const getRotationState = (): RotationState => {
  try {
    const stored = localStorage.getItem('sh_rotation_state');
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    stripchat: 0,
    chaturbate: 0,
    crackrevenue: 0,
    lastProvider: 'stripchat',
    impressions: { stripchat: 0, chaturbate: 0, crackrevenue: 0 },
    clicks: { stripchat: 0, chaturbate: 0, crackrevenue: 0 }
  };
};

const saveRotationState = (state: RotationState): void => {
  try {
    localStorage.setItem('sh_rotation_state', JSON.stringify(state));
  } catch {}
};

export const selectProviderByRotation = (): ProviderId => {
  const state = getRotationState();
  const total = state.impressions.stripchat + state.impressions.chaturbate + state.impressions.crackrevenue + 1;
  
  const stripchatRatio = state.impressions.stripchat / total;
  const chaturbateRatio = state.impressions.chaturbate / total;
  
  let selected: ProviderId;
  
  if (stripchatRatio < 0.5) {
    selected = 'stripchat';
  } else if (chaturbateRatio < 0.3) {
    selected = 'chaturbate';
  } else if (state.impressions.crackrevenue < total * 0.2) {
    selected = 'crackrevenue';
  } else {
    const random = Math.random() * 100;
    if (random < 50) selected = 'stripchat';
    else if (random < 80) selected = 'chaturbate';
    else selected = 'crackrevenue';
  }
  
  state.impressions[selected]++;
  state.lastProvider = selected;
  saveRotationState(state);
  
  return selected;
};

export const selectProviderByPerformance = (): ProviderId => {
  const state = getRotationState();
  const totalClicks = state.clicks.stripchat + state.clicks.chaturbate + state.clicks.crackrevenue;
  
  if (totalClicks < 50) {
    return selectProviderByRotation();
  }
  
  const stripchatCtr = state.clicks.stripchat / Math.max(1, state.impressions.stripchat);
  const chaturbateCtr = state.clicks.chaturbate / Math.max(1, state.impressions.chaturbate);
  const crackrevenueCtr = state.clicks.crackrevenue / Math.max(1, state.impressions.crackrevenue);
  
  const stripchatWeight = Math.max(10, AFFILIATE_PROVIDERS.stripchat.weight * (stripchatCtr / (stripchatCtr + chaturbateCtr + crackrevenueCtr || 0.33)));
  const chaturbateWeight = Math.max(10, AFFILIATE_PROVIDERS.chaturbate.weight * (chaturbateCtr / (stripchatCtr + chaturbateCtr + crackrevenueCtr || 0.33)));
  const totalWeight = stripchatWeight + chaturbateWeight + AFFILIATE_PROVIDERS.crackrevenue.weight;
  
  const random = Math.random() * totalWeight;
  let selected: ProviderId;
  if (random < stripchatWeight) selected = 'stripchat';
  else if (random < stripchatWeight + chaturbateWeight) selected = 'chaturbate';
  else selected = 'crackrevenue';
  
  state.impressions[selected]++;
  state.lastProvider = selected;
  saveRotationState(state);
  
  return selected;
};

export const recordProviderClick = (provider: ProviderId): void => {
  try {
    const state = getRotationState();
    state.clicks[provider]++;
    saveRotationState(state);
  } catch {}
};

export const getProviderStats = (): RotationState => getRotationState();

export const getAffiliateUrlWithProvider = (
  username: string,
  provider: ProviderId = selectProviderByRotation()
): { url: string; provider: ProviderId } => ({
  url: AFFILIATE_PROVIDERS[provider].affiliateUrl(username),
  provider
});

export const resetRotationState = (): void => {
  try {
    localStorage.removeItem('sh_rotation_state');
  } catch {}
};
