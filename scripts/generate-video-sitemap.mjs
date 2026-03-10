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

// Generate video sitemap for popular models
const videoSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  <url>
    <loc>${siteUrl}/</loc>
    <video:video>
      <video:title>StripHubs - Live Cam Gratis</video:title>
      <video:description>La migliore directory italiana di live cam gratis con centinaia di modelle online 24/7.</video:description>
      <video:thumbnail_loc>${siteUrl}/icon-512.png</video:thumbnail_loc>
      <video:content_loc>${siteUrl}/</video:content_loc>
      <video:player_loc>${siteUrl}/</video:player_loc>
      <video:duration>60</video:duration>
      <video:view_count>1000</video:view_count>
      <video:publication_date>${now}</video:publication_date>
      <video:family_friendly>no</video:family_friendly>
      <video:live>yes</video:live>
    </video:video>
  </url>
</urlset>`;

mkdirSync(resolve(process.cwd(), 'public'), { recursive: true });
writeFileSync(resolve(process.cwd(), 'public', 'video-sitemap.xml'), videoSitemap);
console.log('Generated public/video-sitemap.xml');
