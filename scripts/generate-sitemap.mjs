import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Load environment variables from .env file
const envPath = resolve(process.cwd(), '.env');
let siteUrl = 'https://striphubs.com'; // Default fallback

try {
  const envContent = readFileSync(envPath, 'utf-8');
  const envLines = envContent.split('\n');
  for (const line of envLines) {
    const [key, value] = line.split('=');
    if (key && value && key.trim() === 'VITE_SITE_URL') {
      siteUrl = value.trim().replace(/^"|"$/g, '');
      break;
    }
  }
} catch (error) {
  console.log('Could not read .env file, using default URL');
}

const now = new Date().toISOString();

const languages = ['it', 'en', 'de', 'fr', 'es', 'pt'];
const defaultLanguage = 'it';

const categories = ['teen', 'milf', 'asian', 'latina', 'blonde', 'brunette', 'ebony', 'arab', 'indian', 'japanese', 'couple', 'trans'];
const tags = ['teen', 'young', 'petite', 'blondes', 'brunettes', 'asian', 'latin', 'milf', 'big-boobs', 'lingerie', 'college', 'cosplay', 'curvy'];
const countries = ['italian', 'american', 'british', 'german', 'spanish', 'french', 'russian', 'brazilian'];
const combinations = [
  ['teen', 'petite'],
  ['teen', 'blondes'],
  ['teen', 'college'],
  ['teen', 'cosplay'],
  ['teen', 'lingerie'],
  ['asian', 'petite'],
  ['asian', 'lingerie'],
  ['asian', 'young'],
  ['asian', 'cosplay'],
  ['latina', 'big-boobs'],
  ['latina', 'young'],
  ['latina', 'lingerie'],
  ['blonde', 'young'],
  ['blonde', 'petite'],
  ['blonde', 'lingerie'],
  ['brunette', 'cosplay'],
  ['brunette', 'young'],
  ['brunette', 'college'],
  ['milf', 'lingerie'],
  ['milf', 'big-boobs'],
  ['milf', 'curvy'],
  ['ebony', 'big-boobs'],
  ['ebony', 'young'],
  ['arab', 'petite'],
  ['indian', 'young'],
  ['japanese', 'cosplay']
];

const baseRoutes = [
  '/',
  '/live',
  '/free-cams',
  '/search',
  '/privacy',
  '/terms',
  '/cookies',
  ...categories.map((category) => `/cam/${category}`),
  ...tags.map((tag) => `/tag/${tag}`),
  ...countries.map((country) => `/country/${country}`),
  ...combinations.map(([category, tag]) => `/cam/${category}/${tag}`)
];

const getUrlForLanguage = (route, lang) => {
  if (lang === defaultLanguage) {
    return `${siteUrl}${route}`;
  }
  return `${siteUrl}/${lang}${route}`;
};

const getHreflangLinks = (route) => {
  const links = languages.map((lang) => {
    const url = getUrlForLanguage(route, lang);
    return `      <xhtml:link rel="alternate" hreflang="${lang}" href="${url}"/>`;
  });
  
  links.push(`      <xhtml:link rel="alternate" hreflang="x-default" href="${getUrlForLanguage(route, defaultLanguage)}"/>`);
  
  return links.join('\n');
};

const getPriority = (route) => {
  if (route === '/') return '1.0';
  if (route === '/live') return '0.9';
  if (route.startsWith('/cam/')) return '0.8';
  if (route.startsWith('/tag/')) return '0.7';
  if (route.startsWith('/country/')) return '0.7';
  if (route === '/search') return '0.6';
  return '0.5';
};

const getChangefreq = (route) => {
  if (route === '/' || route === '/live') return 'hourly';
  if (route.startsWith('/cam/') || route.startsWith('/tag/') || route.startsWith('/country/')) return 'daily';
  return 'weekly';
};

const generateMultilingualUrlEntries = (route) => {
  return languages.map((lang) => {
    const url = getUrlForLanguage(route, lang);
    const hreflangLinks = getHreflangLinks(route);
    const priority = getPriority(route);
    const changefreq = getChangefreq(route);
    
    return `  <url>
    <loc>${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
${hreflangLinks}
  </url>`;
  }).join('\n');
};

const body = baseRoutes
  .map((route) => generateMultilingualUrlEntries(route))
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

mkdirSync(resolve(process.cwd(), 'public'), { recursive: true });
writeFileSync(resolve(process.cwd(), 'public', 'sitemap.xml'), xml);

// Also generate a sitemap index for Google Search Console
const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteUrl}/sitemap.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>
</sitemapindex>`;

writeFileSync(resolve(process.cwd(), 'public', 'sitemap-index.xml'), sitemapIndex);
console.log('Generated public/sitemap.xml with multilingual support');
console.log('Generated public/sitemap-index.xml');
console.log(`Total URLs: ${baseRoutes.length * languages.length}`);
