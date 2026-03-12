import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envPath = resolve(process.cwd(), '.env');
let siteUrl = 'https://striphubs.com';

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
} catch {
  console.log('Could not read .env file, using default URL');
}

const now = new Date().toISOString();
const languages = ['it', 'en', 'de', 'fr', 'es', 'pt'];
const defaultLanguage = 'it';

const categories = [
  'teen', 'milf', 'asian', 'latina', 'blonde', 'brunette', 'ebony', 
  'arab', 'indian', 'japanese', 'couple', 'trans', 'gay', 'lesbian', 
  'bbw', 'mature', 'vr', 'men'
];

const tags = [
  'teen', 'young', 'petite', 'blondes', 'brunettes', 'asian', 'latin',
  'milf', 'big-boobs', 'lingerie', 'college', 'cosplay', 'curvy',
  'tattoo', 'piercing', 'feet', 'redhead', 'squirt', 'anal',
  'dildo', 'lovense', 'ohmibod', 'bdsm', 'fetish', 'hairy',
  'shaved', 'small-tits', 'big-ass', 'muscle', 'pregnant',
  'deepthroat', 'smoke', 'roleplay', 'dirty-talk',
  'interracial', 'group', 'cuckold', 'femdom', 'findom', 
  'joi', 'cei', 'sph', 'chastity', 'sissy',
  'stockings', 'heels', 'yoga', 'fitness', 'glasses',
  'gamer', 'anime', 'kpop', 'goth', 'emo', 'punk'
];

const countries = [
  'italian', 'american', 'british', 'german', 'spanish', 'french',
  'ukrainian', 'russian', 'brazilian', 'colombian', 'canadian',
  'australian', 'polish', 'dutch', 'swedish', 'norwegian', 'danish',
  'finnish', 'portuguese', 'greek', 'turkish', 'indian', 'chinese',
  'japanese', 'korean', 'mexican', 'philippine', 'thai', 'vietnamese',
  'romanian', 'czech', 'hungarian', 'austrian', 'swiss', 'belgian',
  'argentinian', 'chilean', 'peruvian', 'venezuelan', 'cuban'
];

const baseRoutes = ['/', '/live', '/free-cams', '/search', '/privacy', '/terms', '/cookies', '/blog'];

const blogRoutes = [
  '/blog/guida-cam-gratis',
  '/blog/migliori-modelle-italiane',
  '/blog/sicurezza-cam',
  '/blog/tag-popolari'
];

const categoryRoutes = categories.map(c => `/cam/${c}`);
const tagRoutes = tags.map(t => `/tag/${t}`);
const countryRoutes = countries.map(c => `/country/${c}`);

const categoryTagCombos = [];
for (const cat of categories) {
  for (const tag of tags) {
    categoryTagCombos.push(`/cam/${cat}/${tag}`);
  }
}

const countryCategoryCombos = [];
for (const country of countries) {
  for (const cat of categories) {
    countryCategoryCombos.push(`/country/${country}/cam/${cat}`);
  }
}

const countryTagCombos = [];
for (const country of countries) {
  for (const tag of tags) {
    countryTagCombos.push(`/country/${country}/tag/${tag}`);
  }
}

const alternativeRoutes = [
  'chaturbate', 'stripchat', 'xhamsterlive', 'livejasmin', 
  'bongacams', 'cam4', 'jerkmate', 'camsoda', 'myfreecams', 'onlyfans'
].map(a => `/alternative/${a}`);

const bestOfRoutes = [];
const timeframes = ['today', 'week', 'month', 'year'];
for (const tf of timeframes) {
  for (const cat of categories) {
    bestOfRoutes.push(`/best/${tf}/${cat}`);
  }
}

const comparisonRoutes = [];
const comparisonPairs = [
  ['milf', 'teen'], ['asian', 'latina'], ['blonde', 'brunette'],
  ['ebony', 'asian'], ['milf', 'bbw'], ['teen', 'asian'],
  ['couple', 'lesbian'], ['gay', 'trans'], ['mature', 'milf'],
  ['indian', 'arab'], ['japanese', 'asian'], ['latina', 'ebony']
];
for (const [a, b] of comparisonPairs) {
  comparisonRoutes.push(`/vs/${a}-vs-${b}`);
}

const allRoutes = [
  ...baseRoutes,
  ...blogRoutes,
  ...categoryRoutes,
  ...tagRoutes,
  ...countryRoutes,
  ...categoryTagCombos,
  ...countryCategoryCombos,
  ...countryTagCombos,
  ...alternativeRoutes,
  ...bestOfRoutes,
  ...comparisonRoutes
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
  if (route.startsWith('/cam/') && !route.split('/').some(Boolean)) return '0.8';
  if (route.startsWith('/tag/')) return '0.7';
  if (route.startsWith('/country/') && !route.includes('/cam/') && !route.includes('/tag/')) return '0.7';
  if (route.startsWith('/alternative/')) return '0.8';
  if (route.startsWith('/best/')) return '0.7';
  if (route.startsWith('/vs/')) return '0.6';
  if (route.startsWith('/blog/')) return '0.8';
  if (route === '/blog') return '0.7';
  if (route.includes('/cam/') && route.includes('/tag/')) return '0.6';
  if (route.includes('/country/') && route.includes('/cam/')) return '0.6';
  if (route.includes('/country/') && route.includes('/tag/')) return '0.6';
  return '0.5';
};

const getChangefreq = (route) => {
  if (route === '/' || route === '/live') return 'hourly';
  if (route.startsWith('/cam/') || route.startsWith('/tag/') || route.startsWith('/country/')) return 'daily';
  if (route.startsWith('/alternative/')) return 'weekly';
  if (route.startsWith('/best/')) return 'daily';
  if (route.startsWith('/vs/')) return 'monthly';
  if (route.startsWith('/blog/')) return 'monthly';
  if (route === '/blog') return 'weekly';
  return 'weekly';
};

const generateUrlEntry = (route) => {
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

const chunks = [];
const chunkSize = 7000;
for (let i = 0; i < allRoutes.length; i += chunkSize) {
  chunks.push(allRoutes.slice(i, i + chunkSize));
}

mkdirSync(resolve(process.cwd(), 'public'), { recursive: true });

const sitemapFiles = [];

chunks.forEach((chunk, index) => {
  const body = chunk.map(generateUrlEntry).join('\n');
  const filename = index === 0 ? 'sitemap.xml' : `sitemap-${index + 1}.xml`;
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>`;
  
  writeFileSync(resolve(process.cwd(), 'public', filename), xml);
  sitemapFiles.push(filename);
  console.log(`Generated public/${filename} with ${chunk.length * languages.length} URLs`);
});

console.log(`\nCombos generated:`);
console.log(`  Category+Tag: ${categoryTagCombos.length}`);
console.log(`  Country+Category: ${countryCategoryCombos.length}`);
console.log(`  Country+Tag: ${countryTagCombos.length}`);

const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapFiles.map(f => `  <sitemap>
    <loc>${siteUrl}/${f}</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;

writeFileSync(resolve(process.cwd(), 'public', 'sitemap-index.xml'), sitemapIndex);

const totalUrls = allRoutes.length * languages.length;
console.log(`\n=== SITEMAP GENERATION COMPLETE ===`);
console.log(`Total routes: ${allRoutes.length}`);
console.log(`Languages: ${languages.length}`);
console.log(`Total URLs: ${totalUrls}`);
console.log(`Sitemap files: ${sitemapFiles.length}`);
console.log(`\nRoute breakdown:`);
console.log(`  Base routes: ${baseRoutes.length}`);
console.log(`  Blog routes: ${blogRoutes.length}`);
console.log(`  Categories: ${categoryRoutes.length}`);
console.log(`  Tags: ${tagRoutes.length}`);
console.log(`  Countries: ${countryRoutes.length}`);
console.log(`  Category+Tag combos: ${categoryTagCombos.length}`);
console.log(`  Country+Category combos: ${countryCategoryCombos.length}`);
console.log(`  Country+Tag combos: ${countryTagCombos.length}`);
console.log(`  Alternative pages: ${alternativeRoutes.length}`);
console.log(`  Best Of pages: ${bestOfRoutes.length}`);
console.log(`  Comparison pages: ${comparisonRoutes.length}`);
