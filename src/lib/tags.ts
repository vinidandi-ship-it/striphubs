export const tags = [
  'italian',
  'colombian',
  'ukrainian',
  'japanese',
  'indian',
  'arab',
  'asian',
  'latin',
  'blondes',
  'brunettes',
  'redhead',
  'bdsm',
  'milf',
  'young',
  'mature',
  'student',
  'mobile',
  'interactive-toys',
  'big-tits',
  'big-ass',
  'anal',
  'squirt',
  'blowjob',
  'masturbation',
  'tattoo',
  'big-boobs',
  'petite',
  'teen',
  'ebony',
  'redhead',
  'curvy',
  'college',
  'cosplay',
  'piercing',
  'feet',
  'lingerie'
] as const;

export type TagSlug = (typeof tags)[number];

export const featuredTagGroups = {
  speciali: ['ukrainian', 'bdsm', 'interactive-toys', 'mobile'],
  eta: ['teen', 'young', 'milf', 'mature'],
  etnicita: ['arab', 'asian', 'indian', 'latin'],
  capelli: ['blondes', 'brunettes', 'redhead'],
  popolari: ['big-tits', 'big-ass', 'anal', 'squirt', 'blowjob', 'masturbation'],
  paesi: ['italian', 'colombian', 'japanese', 'ukrainian']
} as const;

const SEO_TAG_ALLOWLIST = new Set(tags);
const SEO_TAG_ALIASES: Record<string, string> = {
  blonde: 'blondes',
  brunette: 'brunettes',
  tattoos: 'tattoo',
  piercings: 'piercing',
  latin: 'latin',
  petite: 'petite',
  teen: 'teen',
  teens: 'teen',
  young: 'young',
  mature: 'mature',
  milf: 'milf',
  asian: 'asian',
  arab: 'arab',
  indian: 'indian',
  japanese: 'japanese',
  ukrainian: 'ukrainian',
  colombian: 'colombian',
  italian: 'italian',
  'big-tits': 'big-tits',
  'big-boobs': 'big-boobs',
  'big-ass': 'big-ass',
  anal: 'anal',
  squirt: 'squirt',
  blowjob: 'blowjob',
  masturbation: 'masturbation',
  student: 'student',
  college: 'college',
  cosplay: 'cosplay',
  lingerie: 'lingerie',
  bdsm: 'bdsm',
  feet: 'feet',
  redhead: 'redhead',
  ebony: 'ebony',
  curvy: 'curvy',
  mobile: 'mobile',
  'interactive-toys': 'interactive-toys'
};

const SEO_TAG_BLOCKLIST = [
  'cam2cam',
  'privates',
  'recordable',
  'publics',
  'affordable',
  'priced',
  'luxurious',
  'moderately',
  'cheapest',
  'deluxe',
  'new',
  'best',
  'white',
  'girls',
  'couples',
  'men',
  'hd'
];

export const normalizeSeoTag = (raw: string): string | null => {
  const cleaned = raw
    .toLowerCase()
    .replace(/^(girls|couples|trans|men)\//, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  if (!cleaned) return null;
  if (SEO_TAG_BLOCKLIST.some((part) => cleaned.includes(part))) return null;

  const direct = SEO_TAG_ALIASES[cleaned] || cleaned;
  if (SEO_TAG_ALLOWLIST.has(direct as TagSlug)) return direct;

  const pieces = cleaned.split('-');
  for (const piece of pieces) {
    const alias = SEO_TAG_ALIASES[piece] || piece;
    if (SEO_TAG_ALLOWLIST.has(alias as TagSlug)) return alias;
  }

  return null;
};

export const extractSeoTags = (rawTags: string[], limit = 8): string[] => {
  const seen = new Set<string>();

  for (const rawTag of rawTags) {
    const normalized = normalizeSeoTag(rawTag);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    if (seen.size >= limit) break;
  }

  return Array.from(seen);
};
