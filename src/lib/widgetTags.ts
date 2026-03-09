export const normalizeWidgetTag = (value: string): string => {
  const v = value.toLowerCase().trim();

  const map: Record<string, string> = {
    milf: 'mature',
    blonde: 'blonde',
    asian: 'asian',
    brunette: 'brunette',
    couple: 'couple',
    trans: 'trans',
    new: 'new',
    teen: 'teen',
    'big-boobs': 'bigboobs',
    latina: 'latina',
    featured: 'girls',
    top: 'girls'
  };

  return map[v] || 'girls';
};

export const isWidgetTagQuery = (value: string): boolean => {
  const v = value.toLowerCase().trim();
  const known = new Set([
    'girls',
    'milf',
    'blonde',
    'asian',
    'brunette',
    'couple',
    'trans',
    'new',
    'teen',
    'big-boobs',
    'latina',
    'featured',
    'top'
  ]);
  return known.has(v);
};
