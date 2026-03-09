import { writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const siteUrl = process.env.SITE_URL || 'https://striphubs.vercel.app';
const today = new Date().toISOString();
const categories = ['milf', 'blonde', 'asian', 'brunette', 'couple', 'trans'];
const tags = ['new', 'teen', 'big-boobs', 'latina', 'featured', 'top'];

const urls = [
  '/',
  '/live',
  '/search',
  '/privacy',
  '/terms',
  '/cookies',
  ...categories.map((item) => `/cam/${item}`),
  ...tags.map((item) => `/tag/${item}`)
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map(
    (path) =>
      `  <url>\n    <loc>${siteUrl}${path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>daily</changefreq>\n    <priority>${path === '/' ? '1.0' : '0.8'}</priority>\n  </url>`
  )
  .join('\n')}\n</urlset>\n`;

const publicDir = resolve(process.cwd(), 'public');
mkdirSync(publicDir, { recursive: true });
writeFileSync(resolve(publicDir, 'sitemap.xml'), xml);
console.log('Sitemap generated at public/sitemap.xml');
