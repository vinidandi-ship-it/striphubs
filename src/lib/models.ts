export const AFFILIATE_ID = 'd28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881';
export const SITE_NAME = 'StripHubs';
export const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://striphubs.vercel.app';

export const CATEGORIES = ['milf', 'blonde', 'asian', 'brunette', 'couple', 'trans'] as const;

export type Model = {
  username: string;
  thumbnail: string;
  viewers: number;
  tags: string[];
  country: string;
  category: string;
  isLive: boolean;
  clickUrl?: string;
};

export const categoryName = (slug: string): string =>
  slug.charAt(0).toUpperCase() + slug.slice(1);

export const watchLiveUrl = (username: string): string =>
  `https://stripchat.com/${encodeURIComponent(username)}?userId=${AFFILIATE_ID}`;
