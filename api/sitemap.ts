import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  AFFILIATE_ID,
  apiError,
  CATEGORY_DEFINITIONS,
  createNormalizedModel,
  NormalizedModel,
  parseProviderModels,
  sanitizeTagForRoute,
  STATIC_TAGS,
  waitForRateLimit
} from './shared.js';

const SITE_URL = process.env.VITE_SITE_URL || 'https://striphubs.com';
const MODELS_ENDPOINT = process.env.STRIPCHAT_API_ENDPOINT || 'https://go.mavrtracktor.com/api/models';
const MAX_MODEL_ROUTES = 200;
const COUNTRY_SLUGS = ['italian', 'american', 'british', 'german', 'spanish', 'french'];
const PRIORITY_TAGS = ['teen', 'young', 'petite', 'blondes', 'brunettes', 'asian', 'latin', 'milf', 'big-boobs', 'lingerie', 'college', 'cosplay'];
const FEATURED_COMBINATIONS = [
  ['teen', 'petite'],
  ['teen', 'blondes'],
  ['teen', 'college'],
  ['asian', 'petite'],
  ['asian', 'lingerie'],
  ['latina', 'big-boobs'],
  ['blonde', 'young'],
  ['brunette', 'cosplay'],
  ['milf', 'lingerie'],
  ['milf', 'big-boobs']
] as const;

export default async function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const apiKey = process.env.STRIPCASH_API_KEY;
    if (!apiKey) return apiError(res, 'Missing STRIPCASH_API_KEY environment variable.', 500);

    const url = new URL(MODELS_ENDPOINT);
    url.searchParams.set('userId', AFFILIATE_ID);
    url.searchParams.set('limit', '400');
    url.searchParams.set('tag', 'girls,couples,trans,men');
    url.searchParams.set('strict', '1');
    url.searchParams.set('fields', 'tags');

    await waitForRateLimit(5000);

    const upstreamRes = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    });

    if (!upstreamRes.ok) {
      const detail = await upstreamRes.text();
      return apiError(res, `upstream error: ${detail.slice(0, 250)}`, upstreamRes.status);
    }

    const providerPayload = await upstreamRes.json();
    const models = parseProviderModels(providerPayload)
      .map(createNormalizedModel)
      .filter((item): item is NormalizedModel => Boolean(item));

    const tags = new Set<string>();
    for (const model of models) {
      for (const tag of model.tags) {
        const cleaned = sanitizeTagForRoute(tag);
        if (cleaned) tags.add(cleaned);
        if (tags.size >= 40) break;
      }
      if (tags.size >= 40) break;
    }

    const routes = new Set<string>();
    const addRoute = (path: string) => {
      if (!routes.has(path)) routes.add(path);
    };

    addRoute('/');
    addRoute('/live');
    addRoute('/search');

    CATEGORY_DEFINITIONS.forEach((category) => addRoute(`/cam/${category.slug}`));
    STATIC_TAGS.forEach((tag) => addRoute(`/tag/${tag}`));
    PRIORITY_TAGS.forEach((tag) => addRoute(`/tag/${tag}`));
    COUNTRY_SLUGS.forEach((country) => addRoute(`/country/${country}`));
    Array.from(tags).forEach((tag) => addRoute(`/tag/${tag}`));
    CATEGORY_DEFINITIONS.forEach((category) =>
      STATIC_TAGS.forEach((tag) => addRoute(`/cam/${category.slug}/${tag}`))
    );
    FEATURED_COMBINATIONS.forEach(([category, tag]) => addRoute(`/cam/${category}/${tag}`));
    models.slice(0, MAX_MODEL_ROUTES).forEach((model) => addRoute(`/model/${encodeURIComponent(model.username)}`));

    const now = new Date().toISOString();
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Array.from(routes)
      .map((path) => `  <url>\n    <loc>${SITE_URL}${path}</loc>\n    <lastmod>${now}</lastmod>\n  </url>`)
      .join('\n')}\n</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    return res.status(200).send(xml);
  } catch (error) {
    return apiError(res, error instanceof Error ? error.message : 'sitemap error', 500);
  }
}
