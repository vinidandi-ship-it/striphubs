import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const siteUrl = process.env.SITE_URL || 'https://striphubs.vercel.app';
const now = new Date().toISOString();
const categories = ['milf', 'blonde', 'asian', 'brunette', 'couple', 'trans'];

const routes = [
  '/',
  '/live',
  '/search',
  '/privacy',
  '/terms',
  '/cookies',
  ...categories.map((category) => `/cam/${category}`)
];

const body = routes
  .map((route) => {
    const priority = route === '/' ? '1.0' : '0.8';
    return `  <url>\n    <loc>${siteUrl}${route}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>hourly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

mkdirSync(resolve(process.cwd(), 'public'), { recursive: true });
writeFileSync(resolve(process.cwd(), 'public', 'sitemap.xml'), xml);
console.log('Generated public/sitemap.xml');
