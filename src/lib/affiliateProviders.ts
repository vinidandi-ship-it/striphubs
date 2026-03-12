export type ProviderId = 'stripchat' | 'chaturbate';

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
    weight: 60,
    priority: 1,
    affiliateUrl: (username: string) =>
      `https://go.mavrtracktor.com?userId=d28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881&model=${encodeURIComponent(username)}`,
    apiEndpoint: 'https://go.mavrtracktor.com/api/models'
  },
  chaturbate: {
    id: 'chaturbate',
    name: 'Chaturbate',
    weight: 40,
    priority: 2,
    affiliateUrl: (username: string, options?: { room?: string }) =>
      `https://chaturbate.com/in/?tour=LQps&campaign=fxmnz&track=default&room=${encodeURIComponent(username)}`
  }
};

export const PROVIDER_WEIGHTS: Array<{ provider: ProviderId; weight: number }> = [
  { provider: 'stripchat', weight: 60 },
  { provider: 'chaturbate', weight: 40 }
];

type RotationState = {
  stripchat: number;
  chaturbate: number;
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
    lastProvider: 'stripchat',
    impressions: { stripchat: 0, chaturbate: 0 },
    clicks: { stripchat: 0, chaturbate: 0 }
  };
};

const saveRotationState = (state: RotationState): void => {
  try {
    localStorage.setItem('sh_rotation_state', JSON.stringify(state));
  } catch {}
};

export const selectProviderByRotation = (): ProviderId => {
  const state = getRotationState();
  const total = state.impressions.stripchat + state.impressions.chaturbate + 1;
  
  const stripchatRatio = state.impressions.stripchat / total;
  const chaturbateRatio = state.impressions.chaturbate / total;
  
  let selected: ProviderId;
  
  if (stripchatRatio < 0.55) {
    selected = 'stripchat';
  } else if (chaturbateRatio < 0.35) {
    selected = 'chaturbate';
  } else {
    const random = Math.random() * 100;
    selected = random < 60 ? 'stripchat' : 'chaturbate';
  }
  
  state.impressions[selected]++;
  state.lastProvider = selected;
  saveRotationState(state);
  
  return selected;
};

export const selectProviderByPerformance = (): ProviderId => {
  const state = getRotationState();
  const totalClicks = state.clicks.stripchat + state.clicks.chaturbate;
  
  if (totalClicks < 50) {
    return selectProviderByRotation();
  }
  
  const stripchatCtr = state.clicks.stripchat / Math.max(1, state.impressions.stripchat);
  const chaturbateCtr = state.clicks.chaturbate / Math.max(1, state.impressions.chaturbate);
  
  const stripchatWeight = Math.max(20, AFFILIATE_PROVIDERS.stripchat.weight * (stripchatCtr / (stripchatCtr + chaturbateCtr || 0.5)));
  const totalWeight = stripchatWeight + AFFILIATE_PROVIDERS.chaturbate.weight;
  
  const random = Math.random() * totalWeight;
  const selected = random < stripchatWeight ? 'stripchat' : 'chaturbate';
  
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
