export const AFFILIATE_ID = import.meta.env.VITE_AFFILIATE_ID || 'd28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881';
export const SITE_NAME = 'StripHubs';
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://striphubs.com';
export const CHATURBATE_CAMPAIGN = 'fxmnz';

export type ProviderId = 'stripchat' | 'chaturbate';

export type Model = {
  username: string;
  thumbnail: string;
  viewers: number;
  tags: string[];
  country: string;
  category: string;
  isLive: boolean;
  clickUrl?: string;
  provider?: ProviderId;
};

export const watchLiveUrl = (username: string, provider: ProviderId = 'stripchat'): string => {
  if (provider === 'chaturbate') {
    return `https://chaturbate.com/in/?tour=LQps&campaign=${CHATURBATE_CAMPAIGN}&track=default&room=${encodeURIComponent(username)}`;
  }
  return `https://go.mavrtracktor.com?userId=${AFFILIATE_ID}&model=${encodeURIComponent(username)}`;
};

export const selectProviderByWeight = (): ProviderId => {
  const random = Math.random() * 100;
  return random < 60 ? 'stripchat' : 'chaturbate';
};

export const getChaturbateUrl = (username: string): string =>
  `https://chaturbate.com/in/?tour=LQps&campaign=${CHATURBATE_CAMPAIGN}&track=default&room=${encodeURIComponent(username)}`;
