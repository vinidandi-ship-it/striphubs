import { SITE_URL } from './models';
import { categoryName } from './categories';
import { getCountryName } from './countries';
import { SUPPORTED_LANGUAGES, Language, DEFAULT_LANGUAGE } from './i18n';

export interface ModelSchemaData {
  username: string;
  thumbnail: string;
  viewers: number;
  tags: string[];
  country: string;
  category: string;
  isLive: boolean;
  provider?: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const generateVideoObjectSchema = (model: ModelSchemaData): object => ({
  '@context': 'https://schema.org',
  '@type': 'VideoObject',
  name: `${model.username} Live Cam - Streaming Gratis`,
  description: `Guarda ${model.username} in diretta streaming live cam. ${model.viewers.toLocaleString()} spettatori online. Categoria: ${categoryName(model.category)}. Tag: ${model.tags.slice(0, 5).join(', ')}`,
  thumbnailUrl: [
    model.thumbnail,
    model.thumbnail.replace(/\/preview\//, '/medium/'),
    model.thumbnail.replace(/\/preview\//, '/large/')
  ],
  uploadDate: new Date().toISOString().split('T')[0],
  duration: model.isLive ? 'PT0S' : undefined,
  contentUrl: `${SITE_URL}/model/${encodeURIComponent(model.username)}`,
  embedUrl: `${SITE_URL}/model/${encodeURIComponent(model.username)}`,
  interactionStatistic: {
    '@type': 'InteractionCounter',
    interactionType: { '@type': 'WatchAction' },
    userInteractionCount: model.viewers
  },
  isLiveBroadcast: model.isLive,
  publication: model.isLive ? {
    '@type': 'BroadcastEvent',
    isLiveBroadcast: true,
    startDate: new Date().toISOString(),
    broadcastDisplayName: `${model.username} Live Stream`
  } : undefined,
  actor: {
    '@type': 'Person',
    name: model.username,
    nationality: model.country
  },
  genre: model.category,
  keywords: model.tags.join(', '),
  provider: {
    '@type': 'Organization',
    name: model.provider === 'chaturbate' ? 'Chaturbate' : 'Stripchat',
    url: model.provider === 'chaturbate' ? 'https://chaturbate.com' : 'https://stripchat.com'
  }
});

export const generateBreadcrumbSchema = (items: BreadcrumbItem[]): object => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`
  }))
});

export const generateFAQPageSchema = (items: FAQItem[]): object => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer
    }
  }))
});

export const generateAggregateRatingSchema = (
  itemName: string,
  totalViews: number,
  modelCount: number
): object => {
  const avgRating = Math.min(5, Math.max(3.5, 3.5 + (totalViews / 10000)));
  const reviewCount = Math.floor(totalViews / 100);
  
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'ItemList',
      name: itemName,
      numberOfItems: modelCount
    },
    ratingValue: avgRating.toFixed(1),
    bestRating: '5',
    worstRating: '1',
    ratingCount: reviewCount,
    reviewCount
  };
};

export const generateItemListSchema = (
  title: string,
  items: Array<{ name: string; url: string; image?: string; description?: string }>
): object => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: title,
  numberOfItems: items.length,
  itemListElement: items.slice(0, 10).map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    url: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    image: item.image,
    description: item.description
  }))
});

export const generateOrganizationSchema = (): object => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'StripHubs',
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/search?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  },
  publisher: {
    '@type': 'Organization',
    name: 'StripHubs',
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/logo.svg`,
      width: 200,
      height: 60
    }
  }
});

export const generateCategoryPageSchema = (
  category: string,
  modelCount: number,
  totalViewers: number
): object[] => {
  const catName = categoryName(category);
  
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${catName} Cam Live Gratis`,
      description: `Scopri ${modelCount} modelle ${catName} online in diretta. Streaming gratis 24/7.`,
      url: `${SITE_URL}/cam/${category}`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: modelCount
      }
    },
    generateAggregateRatingSchema(`${catName} Live Cams`, totalViewers, modelCount)
  ];
};

export const generateCountryPageSchema = (
  countrySlug: string,
  t: (key: string) => string,
  modelCount: number,
  totalViewers: number
): object[] => {
  const countryName = getCountryName(countrySlug, t);
  
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Cam ${countryName} Live Gratis`,
      description: `${modelCount} modelle ${countryName} online in diretta streaming gratis.`,
      url: `${SITE_URL}/country/${countrySlug}`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: modelCount
      }
    },
    generateAggregateRatingSchema(`Cam ${countryName}`, totalViewers, modelCount)
  ];
};

export const generateTagPageSchema = (
  tag: string,
  modelCount: number,
  totalViewers: number
): object[] => {
  const tagName = tag.charAt(0).toUpperCase() + tag.slice(1);
  
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `Cam ${tagName} Live Gratis`,
      description: `${modelCount} modelle con tag ${tagName} online in diretta.`,
      url: `${SITE_URL}/tag/${tag}`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: modelCount
      }
    },
    generateAggregateRatingSchema(`${tagName} Cams`, totalViewers, modelCount)
  ];
};

export const generateCombinationPageSchema = (
  category: string,
  tag: string,
  modelCount: number,
  totalViewers: number
): object[] => {
  const catName = categoryName(category);
  const tagName = tag.charAt(0).toUpperCase() + tag.slice(1);
  
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: `${catName} ${tagName} Cam Live Gratis`,
      description: `${modelCount} modelle ${catName} con tag ${tagName} online.`,
      url: `${SITE_URL}/cam/${category}/${tag}`,
      mainEntity: {
        '@type': 'ItemList',
        numberOfItems: modelCount
      }
    },
    generateAggregateRatingSchema(`${catName} ${tagName} Cams`, totalViewers, modelCount)
  ];
};

export const generateModelPageSchemas = (
  model: ModelSchemaData,
  relatedModels: ModelSchemaData[]
): object[] => {
  const schemas: object[] = [];
  
  schemas.push(generateVideoObjectSchema(model));
  
  schemas.push(generateBreadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: categoryName(model.category), url: `/cam/${model.category}` },
    { name: model.username, url: `/model/${model.username}` }
  ]));
  
  if (relatedModels.length > 0) {
    schemas.push(generateItemListSchema(
      `Modelle simili a ${model.username}`,
      relatedModels.slice(0, 6).map(m => ({
        name: m.username,
        url: `/model/${m.username}`,
        image: m.thumbnail,
        description: `${m.username} - ${categoryName(m.category)} - ${m.viewers} viewers`
      }))
    ));
  }
  
  return schemas;
};

export const generateHomeSchemas = (
  totalModels: number,
  totalViewers: number,
  topCategories: Array<{ slug: string; count: number }>
): object[] => {
  const schemas: object[] = [];
  
  schemas.push(generateOrganizationSchema());
  
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'StripHubs - Live Cam Gratis',
    description: 'Directory italiana di live cam gratis. Migliaia di modelle online 24/7.',
    url: SITE_URL,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: totalModels
    }
  });
  
  schemas.push(generateItemListSchema(
    'Categorie Popolari',
    topCategories.slice(0, 8).map(cat => ({
      name: categoryName(cat.slug),
      url: `/cam/${cat.slug}`,
      description: `${cat.count} modelle ${categoryName(cat.slug)} online`
    }))
  ));
  
  return schemas;
};

export const generateHreflangTags = (
  path: string,
  currentLang: Language = DEFAULT_LANGUAGE
): Array<{ hreflang: string; href: string }> => {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  const tags: Array<{ hreflang: string; href: string }> = SUPPORTED_LANGUAGES.map(lang => ({
    hreflang: lang,
    href: lang === DEFAULT_LANGUAGE 
      ? `${SITE_URL}${cleanPath}`
      : `${SITE_URL}/${lang}${cleanPath}`
  }));
  
  tags.push({
    hreflang: 'x-default',
    href: `${SITE_URL}${cleanPath}`
  });
  
  return tags;
};

export const injectSchema = (id: string, schema: object): void => {
  let node = document.getElementById(id) as HTMLScriptElement | null;
  if (!node) {
    node = document.createElement('script');
    node.id = id;
    node.type = 'application/ld+json';
    document.head.appendChild(node);
  }
  node.text = JSON.stringify(schema);
};

export const injectSchemas = (schemas: Array<{ id: string; schema: object }>): void => {
  schemas.forEach(({ id, schema }) => injectSchema(id, schema));
};

export const removeSchema = (id: string): void => {
  const node = document.getElementById(id);
  if (node) node.remove();
};

export const removeSchemas = (ids: string[]): void => {
  ids.forEach(removeSchema);
};
