import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const siteUrl = process.env.SITE_URL || 'https://striphubs.com';
const now = new Date().toISOString();
const categories = ['milf', 'blonde', 'asian', 'brunette', 'couple', 'trans'];
const tags = ['teen', 'young', 'petite', 'blondes', 'brunettes', 'asian', 'latin', 'milf', 'big-boobs', 'lingerie', 'college', 'cosplay'];
const countries = ['italian', 'american', 'british', 'german', 'spanish', 'french'];
const combinations = [
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
];

const routes = [
  '/',
  '/live',
  '/search',
  '/privacy',
  '/terms',
  '/cookies',
  ...categories.map((category) => `/cam/${category}`),
  ...tags.map((tag) => `/tag/${tag}`),
  ...countries.map((country) => `/country/${country}`),
  ...combinations.map(([category, tag]) => `/cam/${category}/${tag}`)
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
