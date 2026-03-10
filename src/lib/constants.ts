export const PAGE_SIZES = {
  HOME: 48,
  CATEGORY: 120,
  COUNTRY: 96,
  LIVE: 120
} as const;

export const YOUNG_SPOTLIGHT_THRESHOLD = 60;
export const YOUNG_SPOTLIGHT_SIZE = 6;
export const CATEGORY_PREVIEW_LIMIT = 8;

export const HOME_CATEGORY_PRIORITY = ['teen', 'asian', 'latina', 'blonde', 'brunette'] as const;

export const YOUNG_MODEL_PATTERNS = [
  /(girls\/teens|teen|young|18\+|19|20|21|22|petite|college|student)/i,
  /(blonde|brunette|asian|latina)/i
] as const;
