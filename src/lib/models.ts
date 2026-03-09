import { CATEGORIES, TAGS, AFFILIATE_ID } from './constants';

export type Model = {
  name: string;
  thumbnail: string;
  viewers: number;
  category: (typeof CATEGORIES)[number];
  tags: string[];
  isLive: boolean;
};

const names = [
  'AvaVelvet', 'LunaRose', 'MiaStorm', 'NikaBlush', 'SakuraNite', 'BellaFlame', 'TinaMuse',
  'IvyDawn', 'CoraShine', 'VeraNova', 'KiraGlow', 'LexiLuxe', 'AriaBunny', 'NinaStar',
  'EmmaPulse', 'LolaSpark', 'RinaSky', 'MonaSilk', 'PiperDream', 'ZoeyFlash'
];

const hash = (value: string): number =>
  value.split('').reduce((acc, char, idx) => acc + char.charCodeAt(0) * (idx + 7), 0);

export const slugify = (value: string): string =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export const getModelLink = (name: string): string =>
  `https://stripchat.com/${encodeURIComponent(name)}?userId=${AFFILIATE_ID}`;

export const generateFakeModels = (count = 72): Model[] => {
  const data: Model[] = [];

  for (let i = 0; i < count; i += 1) {
    const name = `${names[i % names.length]}${i >= names.length ? i : ''}`;
    const base = hash(name);
    const category = CATEGORIES[base % CATEGORIES.length];
    const tags = [
      TAGS[base % TAGS.length],
      TAGS[(base + 2) % TAGS.length]
    ];

    data.push({
      name,
      thumbnail: `https://picsum.photos/seed/${slugify(name)}/640/800`,
      viewers: 150 + (base % 8900),
      category,
      tags,
      isLive: true
    });
  }

  return data;
};

const models = generateFakeModels();

export const allModels = (): Model[] => models;

export const getTrendingModels = (limit = 12): Model[] =>
  [...models].sort((a, b) => b.viewers - a.viewers).slice(0, limit);

export const getModelByName = (name: string): Model | undefined =>
  models.find((model) => model.name.toLowerCase() === name.toLowerCase());

export const getByCategory = (category: string): Model[] =>
  models.filter((model) => model.category.toLowerCase() === category.toLowerCase());

export const getByTag = (tag: string): Model[] =>
  models.filter((model) => model.tags.some((item) => item.toLowerCase() === tag.toLowerCase()));

export const searchModels = (query: string): Model[] => {
  const q = query.trim().toLowerCase();
  if (!q) return models;

  return models.filter((model) =>
    model.name.toLowerCase().includes(q) ||
    model.category.toLowerCase().includes(q) ||
    model.tags.some((tag) => tag.toLowerCase().includes(q))
  );
};
