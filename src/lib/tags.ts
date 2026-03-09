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
