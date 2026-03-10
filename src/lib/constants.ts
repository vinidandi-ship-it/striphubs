export const PAGE_SIZES = {
  HOME: 120,
  CATEGORY: 200,
  COUNTRY: 200,
  LIVE: 200
} as const;

export const YOUNG_SPOTLIGHT_THRESHOLD = 60;
export const YOUNG_SPOTLIGHT_SIZE = 6;
export const CATEGORY_PREVIEW_LIMIT = 8;

export const HOME_CATEGORY_PRIORITY = ['teen', 'asian', 'latina', 'blonde', 'brunette'] as const;

export const YOUNG_MODEL_PATTERNS = [
  /(girls\/teens|teen|young|18\+|19|20|21|22|petite|college|student)/i,
  /(blonde|brunette|asian|latina)/i
] as const;

// Theme Colors
export const THEME_COLORS = {
  primary: '#ff006e',
  secondary: '#00d4ff',
  gold: '#ffb800',
  bgPrimary: '#0a0a0f',
  bgSecondary: '#12121a',
  bgCard: '#151520',
  textPrimary: '#ffffff',
  textSecondary: '#b8b8c8',
  border: '#2a2a3a'
} as const;
