import { Language } from '../i18n/translations';
import { CategorySlug, categoryName } from './categories';
import { CountrySlug, getCountryName } from './countries';

export type MetaTags = {
  title: string;
  description: string;
  url: string;
  image?: string;
  keywords?: string[];
};

const BRAND_NAME = 'StripHubs';
const BRAND_URL = 'https://striphubs.com';

const templates = {
  category: {
    title: {
      it: (cat: string, count: number) => `${count} ${cat} Cam Online Gratis - Filtra e Guarda Ora | ${BRAND_NAME}`,
      en: (cat: string, count: number) => `${count} ${cat} Cams Live Free - Filter & Watch Now | ${BRAND_NAME}`,
      de: (cat: string, count: number) => `${count} ${cat} Cams Live Kostenlos - Filtern & Ansehen | ${BRAND_NAME}`,
      fr: (cat: string, count: number) => `${count} ${cat} Cam en Direct Gratuit - Filtrer et Regarder | ${BRAND_NAME}`,
      es: (cat: string, count: number) => `${count} ${cat} Cams en Vivo Gratis - Filtrar y Ver | ${BRAND_NAME}`,
      pt: (cat: string, count: number) => `${count} ${cat} Cams ao Vivo Grátis - Filtrar e Assistir | ${BRAND_NAME}`
    },
    description: {
      it: (cat: string, count: number) => `Scopri ${count} ${cat} cam live in questo momento. Filtra per età, paese, tag e preferenze. 100% gratis, aggiornato in tempo reale, nessuna registrazione.`,
      en: (cat: string, count: number) => `Discover ${count} ${cat} cams live right now. Filter by age, country, tags and preferences. 100% free, real-time updates, no registration.`,
      de: (cat: string, count: number) => `Entdecken Sie ${count} ${cat} Cams live. Filtern Sie nach Alter, Land, Tags und Vorlieben. 100% kostenlos, Echtzeit-Updates, keine Registrierung.`,
      fr: (cat: string, count: number) => `Découvrez ${count} ${cat} cam en direct maintenant. Filtrez par âge, pays, tags et préférences. 100% gratuit, mises à jour en temps réel, sans inscription.`,
      es: (cat: string, count: number) => `Descubre ${count} ${cat} cams en vivo ahora. Filtra por edad, país, tags y preferencias. 100% gratis, actualizaciones en tiempo real, sin registro.`,
      pt: (cat: string, count: number) => `Descubra ${count} ${cat} cams ao vivo agora. Filtre por idade, país, tags e preferências. 100% grátis, atualizações em tempo real, sem registro.`
    }
  },
  country: {
    title: {
      it: (country: string, count: number) => `${count} Cam ${country}e Online - Live dalla ${country}a | ${BRAND_NAME}`,
      en: (country: string, count: number) => `${count} ${country} Cams Online - Live from ${country} | ${BRAND_NAME}`,
      de: (country: string, count: number) => `${count} ${country}e Cams Online - Live aus ${country} | ${BRAND_NAME}`,
      fr: (country: string, count: number) => `${count} Cam ${country}es en Direct - Live de ${country} | ${BRAND_NAME}`,
      es: (country: string, count: number) => `${count} Cams ${country}as en Vivo - Live desde ${country} | ${BRAND_NAME}`,
      pt: (country: string, count: number) => `${count} Cams ${country}as ao Vivo - Live da ${country} | ${BRAND_NAME}`
    },
    description: {
      it: (country: string, count: number) => `Guarda ${count} cam ${country}e in diretta streaming gratis. Modelle ${country}e online 24/7, filtra per categoria e tag. Nessuna registrazione richiesta.`,
      en: (country: string, count: number) => `Watch ${count} ${country} cams live streaming free. ${country} models online 24/7, filter by category and tags. No registration required.`,
      de: (country: string, count: number) => `Schen Sie ${count} ${country}e Cams im Live-Streaming kostenlos. ${country}e Models 24/7 online, filtern nach Kategorie und Tags. Keine Registrierung erforderlich.`,
      fr: (country: string, count: number) => `Regardez ${count} cam ${country}es en streaming live gratuit. Modèles ${country}es en ligne 24/7, filtrez par catégorie et tags. Sans inscription.`,
      es: (country: string, count: number) => `Mira ${count} cams ${country}as en streaming en vivo gratis. Modelos ${country}os en línea 24/7, filtra por categoría y tags. Sin registro requerido.`,
      pt: (country: string, count: number) => `Assista ${count} cams ${country}as em streaming ao vivo grátis. Modelos ${country}os online 24/7, filtre por categoria e tags. Sem registro necessário.`
    }
  },
  tag: {
    title: {
      it: (tag: string, count: number) => `${count} Cam ${tag} Online - Trend ${tag} Live Gratis | ${BRAND_NAME}`,
      en: (tag: string, count: number) => `${count} ${tag} Cams Online - ${tag} Trend Live Free | ${BRAND_NAME}`,
      de: (tag: string, count: number) => `${count} ${tag} Cams Online - ${tag} Trend Live Kostenlos | ${BRAND_NAME}`,
      fr: (tag: string, count: number) => `${count} Cam ${tag} en Direct - Tendance ${tag} Gratuit | ${BRAND_NAME}`,
      es: (tag: string, count: number) => `${count} Cams ${tag} en Vivo - Tendencia ${tag} Gratis | ${BRAND_NAME}`,
      pt: (tag: string, count: number) => `${count} Cams ${tag} ao Vivo - Tendência ${tag} Grátis | ${BRAND_NAME}`
    },
    description: {
      it: (tag: string, count: number) => `Esplora ${count} cam con tag ${tag} in diretta. Le modelle più hot con ${tag} sono qui. Gratis, senza registrazione, streaming live 24/7.`,
      en: (tag: string, count: number) => `Explore ${count} cams tagged ${tag} live. The hottest models with ${tag} are here. Free, no registration, live streaming 24/7.`,
      de: (tag: string, count: number) => `Erkunden Sie ${count} Cams mit Tag ${tag} live. Die heißesten Models mit ${tag} sind hier. Kostenlos, ohne Registrierung, Live-Streaming 24/7.`,
      fr: (tag: string, count: number) => `Explorez ${count} cam taguées ${tag} en direct. Les modèles les plus chauds avec ${tag} sont ici. Gratuit, sans inscription, streaming live 24/7.`,
      es: (tag: string, count: number) => `Explora ${count} cams con tag ${tag} en vivo. Los modelos más calientes con ${tag} están aquí. Gratis, sin registro, streaming en vivo 24/7.`,
      pt: (tag: string, count: number) => `Explore ${count} cams com tag ${tag} ao vivo. Os modelos mais quentes com ${tag} estão aqui. Grátis, sem registro, streaming ao vivo 24/7.`
    }
  },
  combination: {
    title: {
      it: (cat: string, tag: string, count: number) => `${count} ${cat} Cam ${tag} Online Gratis | ${BRAND_NAME}`,
      en: (cat: string, tag: string, count: number) => `${count} ${cat} ${tag} Cams Online Free | ${BRAND_NAME}`,
      de: (cat: string, tag: string, count: number) => `${count} ${cat} ${tag} Cams Online Kostenlos | ${BRAND_NAME}`,
      fr: (cat: string, tag: string, count: number) => `${count} ${cat} Cam ${tag} en Direct Gratuit | ${BRAND_NAME}`,
      es: (cat: string, tag: string, count: number) => `${count} ${cat} Cams ${tag} en Vivo Gratis | ${BRAND_NAME}`,
      pt: (cat: string, tag: string, count: number) => `${count} ${cat} Cams ${tag} ao Vivo Grátis | ${BRAND_NAME}`
    },
    description: {
      it: (cat: string, tag: string, count: number) => `${count} ${cat} cam con ${tag} in diretta streaming gratis. Trova le migliori ${cat} ${tag} live, filtra e guarda ora. Nessuna registrazione.`,
      en: (cat: string, tag: string, count: number) => `${count} ${cat} cams with ${tag} live streaming free. Find the best ${cat} ${tag} live, filter and watch now. No registration.`,
      de: (cat: string, tag: string, count: number) => `${count} ${cat} Cams mit ${tag} im Live-Streaming kostenlos. Finden Sie die besten ${cat} ${tag} live, filtern und jetzt ansehen. Keine Registrierung.`,
      fr: (cat: string, tag: string, count: number) => `${count} ${cat} cam avec ${tag} en streaming live gratuit. Trouvez les meilleures ${cat} ${tag} live, filtrez et regardez maintenant. Sans inscription.`,
      es: (cat: string, tag: string, count: number) => `${count} ${cat} cams con ${tag} en streaming en vivo gratis. Encuentra las mejores ${cat} ${tag} live, filtra y mira ahora. Sin registro.`,
      pt: (cat: string, tag: string, count: number) => `${count} ${cat} cams com ${tag} em streaming ao vivo grátis. Encontre as melhores ${cat} ${tag} ao vivo, filtre e assista agora. Sem registro.`
    }
  },
  model: {
    title: {
      it: (name: string, category?: string) => `${name} Live Cam Gratis${category ? ` - ${category}` : ''} | ${BRAND_NAME}`,
      en: (name: string, category?: string) => `${name} Live Cam Free${category ? ` - ${category}` : ''} | ${BRAND_NAME}`,
      de: (name: string, category?: string) => `${name} Live Cam Kostenlos${category ? ` - ${category}` : ''} | ${BRAND_NAME}`,
      fr: (name: string, category?: string) => `${name} Cam en Direct Gratuit${category ? ` - ${category}` : ''} | ${BRAND_NAME}`,
      es: (name: string, category?: string) => `${name} Cam en Vivo Gratis${category ? ` - ${category}` : ''} | ${BRAND_NAME}`,
      pt: (name: string, category?: string) => `${name} Cam ao Vivo Grátis${category ? ` - ${category}` : ''} | ${BRAND_NAME}`
    },
    description: {
      it: (name: string, category?: string) => `Guarda ${name} in diretta cam${category ? ` - ${category} cam` : ''}. Chat gratis, streaming live HD, interagisci in tempo reale. Solo su StripHubs.`,
      en: (name: string, category?: string) => `Watch ${name} live cam${category ? ` - ${category} cam` : ''}. Free chat, HD live streaming, interact in real-time. Only on StripHubs.`,
      de: (name: string, category?: string) => `Schen Sie ${name} Live-Cam${category ? ` - ${category} Cam` : ''}. Kostenloser Chat, HD Live-Streaming, Echtzeit-Interaktion. Nur auf StripHubs.`,
      fr: (name: string, category?: string) => `Regardez ${name} cam en direct${category ? ` - ${category} cam` : ''}. Chat gratuit, streaming live HD, interagissez en temps réel. Seulement sur StripHubs.`,
      es: (name: string, category?: string) => `Mira ${name} cam en vivo${category ? ` - ${category} cam` : ''}. Chat gratis, streaming en vivo HD, interactúa en tiempo real. Solo en StripHubs.`,
      pt: (name: string, category?: string) => `Assista ${name} cam ao vivo${category ? ` - ${category} cam` : ''}. Chat grátis, streaming ao vivo HD, interaja em tempo real. Só no StripHubs.`
    }
  }
};

export function generateCategoryMeta(
  category: CategorySlug,
  language: Language,
  count: number = 150
): MetaTags {
  const cat = categoryName(category);
  return {
    title: templates.category.title[language](cat, count),
    description: templates.category.description[language](cat, count),
    url: `${BRAND_URL}/cam/${category}`,
    image: `${BRAND_URL}/icon-512.png`,
    keywords: [category, 'live cam', 'gratis', 'streaming', language]
  };
}

export function generateCountryMeta(
  country: CountrySlug,
  language: Language,
  t: (key: string) => string,
  count: number = 100
): MetaTags {
  const countryName = getCountryName(country, t);
  return {
    title: templates.country.title[language](countryName, count),
    description: templates.country.description[language](countryName, count),
    url: `${BRAND_URL}/country/${country}`,
    image: `${BRAND_URL}/icon-512.png`,
    keywords: [country, 'cam', countryName, 'live', language]
  };
}

export function generateTagMeta(
  tag: string,
  language: Language,
  count: number = 80
): MetaTags {
  const tagName = tag.charAt(0).toUpperCase() + tag.slice(1);
  return {
    title: templates.tag.title[language](tagName, count),
    description: templates.tag.description[language](tagName, count),
    url: `${BRAND_URL}/tag/${tag}`,
    image: `${BRAND_URL}/icon-512.png`,
    keywords: [tag, 'cam', 'tag', 'live', language]
  };
}

export function generateCombinationMeta(
  category: CategorySlug,
  tag: string,
  language: Language,
  count: number = 50
): MetaTags {
  const cat = categoryName(category);
  const tagName = tag.charAt(0).toUpperCase() + tag.slice(1);
  return {
    title: templates.combination.title[language](cat, tagName, count),
    description: templates.combination.description[language](cat, tagName, count),
    url: `${BRAND_URL}/cam/${category}/${tag}`,
    image: `${BRAND_URL}/icon-512.png`,
    keywords: [category, tag, 'live cam', 'gratis', language]
  };
}

export function generateModelMeta(
  username: string,
  language: Language,
  category?: string
): MetaTags {
  const name = username.charAt(0).toUpperCase() + username.slice(1);
  return {
    title: templates.model.title[language](name, category),
    description: templates.model.description[language](name, category),
    url: `${BRAND_URL}/model/${username}`,
    image: `${BRAND_URL}/icon-512.png`,
    keywords: [username, 'cam', 'live', 'model', language]
  };
}

export function generateSearchMeta(
  query: string,
  language: Language
): MetaTags {
  const searchTitles: Record<Language, string> = {
    it: `Risultati per "${query}" - Cerca Cam Live | ${BRAND_NAME}`,
    en: `Results for "${query}" - Search Live Cams | ${BRAND_NAME}`,
    de: `Ergebnisse für "${query}" - Live Cams Suchen | ${BRAND_NAME}`,
    fr: `Résultats pour "${query}" - Rechercher Cam Live | ${BRAND_NAME}`,
    es: `Resultados para "${query}" - Buscar Cams en Vivo | ${BRAND_NAME}`,
    pt: `Resultados para "${query}" - Buscar Cams ao Vivo | ${BRAND_NAME}`
  };

  const searchDescriptions: Record<Language, string> = {
    it: `Cerca "${query}" tra centinaia di live cam. Trova modelle per nome, categoria, tag o paese. Risultati in tempo reale.`,
    en: `Search "${query}" among hundreds of live cams. Find models by name, category, tag or country. Real-time results.`,
    de: `Suchen Sie "${query}" unter hunderten Live Cams. Finden Sie Models nach Name, Kategorie, Tag oder Land. Echtzeit-Ergebnisse.`,
    fr: `Recherchez "${query}" parmi des centaines de cam live. Trouvez des modèles par nom, catégorie, tag ou pays. Résultats en temps réel.`,
    es: `Busca "${query}" entre cientos de cams en vivo. Encuentra modelos por nombre, categoría, tag o país. Resultados en tiempo real.`,
    pt: `Busque "${query}" entre centenas de cams ao vivo. Encontre modelos por nome, categoria, tag ou país. Resultados em tempo real.`
  };

  return {
    title: searchTitles[language],
    description: searchDescriptions[language],
    url: `${BRAND_URL}/search?q=${encodeURIComponent(query)}`,
    image: `${BRAND_URL}/icon-512.png`,
    keywords: [query, 'search', 'cam', 'live', language]
  };
}
