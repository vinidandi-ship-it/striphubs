import { CategorySlug } from './categories';
import { CountrySlug } from './countries';
import { SupportedLocale } from '../i18n/types';

export type BlogContentType = 
  | 'best-category-cams'
  | 'category-vs-category'
  | 'how-to'
  | 'top-category-by-country'
  | 'complete-guide'
  | 'statistics'
  | 'review'
  | 'tutorial'
  | 'faq-extended'
  | 'case-study'
  | 'security'
  | 'trends'
  | 'comparison'
  | 'how-to-list'
  | 'best-practices';

export type BlogPost = {
  slug: string;
  type: BlogContentType;
  title: Record<SupportedLocale, string>;
  description: Record<SupportedLocale, string>;
  h1: Record<SupportedLocale, string>;
  category?: CategorySlug;
  category2?: CategorySlug;
  country?: CountrySlug;
  tags: string[];
  publishDate: string;
  lastModified: string;
};

const generateSlug = (...parts: string[]): string => {
  return parts.filter(Boolean).join('-').toLowerCase().replace(/\s+/g, '-');
};

export const generateBlogPosts = (): BlogPost[] => {
  const posts: BlogPost[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  const locales: SupportedLocale[] = ['it', 'en', 'de', 'fr', 'es', 'pt'];
  
  const categories: CategorySlug[] = [
    'milf', 'teen', 'ebony', 'asian', 'latina', 'blonde', 'brunette',
    'bbw', 'arab', 'indian', 'brazilian', 'japanese', 'couple'
  ];
  
  const featuredCountries: CountrySlug[] = [
    'italian', 'german', 'french', 'spanish', 'british', 'american'
  ];

  // Type 1: Best [Category] Cams
  categories.forEach((category) => {
    const slug = generateSlug('migliori', category, 'cam');
    posts.push({
      slug,
      type: 'best-category-cams',
      title: {
        it: `Migliori ${category} Cam Online - Top ${Math.floor(Math.random() * 50) + 100} Live`,
        en: `Best ${category} Cams Online - Top ${Math.floor(Math.random() * 50) + 100} Live`,
        de: `Beste ${category} Cams Online - Top ${Math.floor(Math.random() * 50) + 100} Live`,
        fr: `Meilleures ${category} Cam en Direct - Top ${Math.floor(Math.random() * 50) + 100}`,
        es: `Mejores ${category} Cams en Vivo - Top ${Math.floor(Math.random() * 50) + 100}`,
        pt: `Melhores ${category} Cams ao Vivo - Top ${Math.floor(Math.random() * 50) + 100}`
      },
      description: {
        it: `Scopri le migliori ${category} cam live in questo momento. Filtra per età, paese e preferenze. 100% gratis, aggiornato in tempo reale.`,
        en: `Discover the best ${category} cams live right now. Filter by age, country and preferences. 100% free, real-time updates.`,
        de: `Entdecken Sie die besten ${category} Cams live. Filtern Sie nach Alter, Land und Vorlieben. 100% kostenlos, Echtzeit-Updates.`,
        fr: `Découvrez les meilleures ${category} cam en direct. Filtrez par âge, pays et préférences. 100% gratuit, mises à jour en temps réel.`,
        es: `Descubre las mejores ${category} cams en vivo ahora. Filtra por edad, país y preferencias. 100% gratis, actualizaciones en tiempo real.`,
        pt: `Descubra as melhores ${category} cams ao vivo agora. Filtre por idade, país e preferências. 100% grátis, atualizações em tempo real.`
      },
      h1: {
        it: `Top ${Math.floor(Math.random() * 50) + 100} ${category.charAt(0).toUpperCase() + category.slice(1)} Cam Live - Guarda Gratis`,
        en: `Top ${Math.floor(Math.random() * 50) + 100} ${category.charAt(0).toUpperCase() + category.slice(1)} Cams Live - Watch Free`,
        de: `Top ${Math.floor(Math.random() * 50) + 100} ${category.charAt(0).toUpperCase() + category.slice(1)} Cams Live - Kostenlos ansehen`,
        fr: `Top ${Math.floor(Math.random() * 50) + 100} ${category.charAt(0).toUpperCase() + category.slice(1)} Cam en Direct - Regarder Gratuit`,
        es: `Top ${Math.floor(Math.random() * 50) + 100} ${category.charAt(0).toUpperCase() + category.slice(1)} Cams en Vivo - Ver Gratis`,
        pt: `Top ${Math.floor(Math.random() * 50) + 100} ${category.charAt(0).toUpperCase() + category.slice(1)} Cams ao Vivo - Assistir Grátis`
      },
      category,
      tags: [category, 'live-cam', 'gratis', 'streaming'],
      publishDate: today,
      lastModified: today
    });
  });

  // Type 2: Category vs Category
  const comparisons: Array<[CategorySlug, CategorySlug]> = [
    ['teen', 'milf'],
    ['asian', 'latina'],
    ['blonde', 'brunette'],
    ['ebony', 'asian'],
    ['milf', 'bbw']
  ];

  comparisons.forEach(([cat1, cat2]) => {
    const slug = generateSlug(cat1, 'vs', cat2, 'cam');
    posts.push({
      slug,
      type: 'category-vs-category',
      title: {
        it: `${cat1.charAt(0).toUpperCase() + cat1.slice(1)} vs ${cat2.charAt(0).toUpperCase() + cat2.slice(1)} Cam - Confronto Completo`,
        en: `${cat1.charAt(0).toUpperCase() + cat1.slice(1)} vs ${cat2.charAt(0).toUpperCase() + cat2.slice(1)} Cams - Complete Comparison`,
        de: `${cat1.charAt(0).toUpperCase() + cat1.slice(1)} vs ${cat2.charAt(0).toUpperCase() + cat2.slice(1)} Cams - Vollständiger Vergleich`,
        fr: `${cat1.charAt(0).toUpperCase() + cat1.slice(1)} vs ${cat2.charAt(0).toUpperCase() + cat2.slice(1)} Cam - Comparaison Complète`,
        es: `${cat1.charAt(0).toUpperCase() + cat1.slice(1)} vs ${cat2.charAt(0).toUpperCase() + cat2.slice(1)} Cams - Comparación Completa`,
        pt: `${cat1.charAt(0).toUpperCase() + cat1.slice(1)} vs ${cat2.charAt(0).toUpperCase() + cat2.slice(1)} Cams - Comparação Completa`
      },
      description: {
        it: `Confronto dettagliato tra ${cat1} e ${cat2} cam: differenze, pro e contro, quale scegliere per le tue preferenze.`,
        en: `Detailed comparison between ${cat1} and ${cat2} cams: differences, pros and cons, which to choose for your preferences.`,
        de: `Detaillierter Vergleich zwischen ${cat1} und ${cat2} Cams: Unterschiede, Vor- und Nachteile, welche für Ihre Vorlieben.`,
        fr: `Comparaison détaillée entre ${cat1} et ${cat2} cam: différences, avantages et inconvénients, lequel choisir.`,
        es: `Comparación detallada entre ${cat1} y ${cat2} cams: diferencias, pros y contras, cuál elegir para tus preferencias.`,
        pt: `Comparação detalhada entre ${cat1} e ${cat2} cams: diferenças, prós e contras, qual escolher para suas preferências.`
      },
      h1: {
        it: `${cat1.charAt(0).toUpperCase() + cat1.slice(1)} Cam vs ${cat2.charAt(0).toUpperCase() + cat2.slice(1)} Cam: Quale Scegliere?`,
        en: `${cat1.charAt(0).toUpperCase() + cat1.slice(1)} Cam vs ${cat2.charAt(0).toUpperCase() + cat2.slice(1)} Cam: Which to Choose?`,
        de: `${cat1.charAt(0).toUpperCase() + cat1.slice(1)} Cam vs ${cat2.charAt(0).toUpperCase() + cat2.slice(1)} Cam: Was wählen?`,
        fr: `${cat1.charAt(0).toUpperCase() + cat1.slice(1)} Cam vs ${cat2.charAt(0).toUpperCase() + cat2.slice(1)} Cam: Laquelle Choisir?`,
        es: `${cat1.charAt(0).toUpperCase() + cat1.slice(1)} Cam vs ${cat2.charAt(0).toUpperCase() + cat2.slice(1)} Cam: ¿Cuál Elegir?`,
        pt: `${cat1.charAt(0).toUpperCase() + cat1.slice(1)} Cam vs ${cat2.charAt(0).toUpperCase() + cat2.slice(1)} Cam: Qual Escolher?`
      },
      category: cat1,
      category2: cat2,
      tags: [cat1, cat2, 'confronto', 'comparison'],
      publishDate: today,
      lastModified: today
    });
  });

  // Type 3: Top [Category] by Country
  categories.slice(0, 6).forEach((category) => {
    featuredCountries.slice(0, 3).forEach((country) => {
      const slug = generateSlug('top', category, 'cam', country);
      posts.push({
        slug,
        type: 'top-category-by-country',
        title: {
          it: `Migliori ${category} Cam ${country.charAt(0).toUpperCase() + country.slice(1)}e - Top Live`,
          en: `Best ${category} Cams from ${country.charAt(0).toUpperCase() + country.slice(1)} - Top Live`,
          de: `Beste ${category} Cams aus ${country.charAt(0).toUpperCase() + country.slice(1)} - Top Live`,
          fr: `Meilleures ${category} Cam ${country.charAt(0).toUpperCase() + country.slice(1)}es - Top Live`,
          es: `Mejores ${category} Cams de ${country.charAt(0).toUpperCase() + country.slice(1)}as - Top Live`,
          pt: `Melhores ${category} Cams ${country.charAt(0).toUpperCase() + country.slice(1)}as - Top Live`
        },
        description: {
          it: `Le migliori ${category} cam ${country}e online. Scopri le modelle più hot dalla ${country}a in diretta.`,
          en: `The best ${category} cams from ${country} models online. Discover the hottest ${country} models live.`,
          de: `Die besten ${category} Cams von ${country}en Models online. Entdecken Sie die heißesten ${country}en Models live.`,
          fr: `Les meilleures ${category} cam ${country}es en ligne. Découvrez les modèles ${country}es les plus chauds en direct.`,
          es: `Las mejores ${category} cams de modelos ${country}as en línea. Descubre los modelos ${country}os más calientes en vivo.`,
          pt: `As melhores ${category} cams de modelos ${country}as online. Descubra os modelos ${country}os mais quentes ao vivo.`
        },
        h1: {
          it: `Top ${category.charAt(0).toUpperCase() + category.slice(1)} Cam ${country.charAt(0).toUpperCase() + country.slice(1)}e in Diretta`,
          en: `Top ${category.charAt(0).toUpperCase() + category.slice(1)} Cams from ${country.charAt(0).toUpperCase() + country.slice(1)} Live`,
          de: `Top ${category.charAt(0).toUpperCase() + category.slice(1)} Cams aus ${country.charAt(0).toUpperCase() + country.slice(1)} Live`,
          fr: `Top ${category.charAt(0).toUpperCase() + category.slice(1)} Cam ${country.charAt(0).toUpperCase() + country.slice(1)}es en Direct`,
          es: `Top ${category.charAt(0).toUpperCase() + category.slice(1)} Cams de ${country.charAt(0).toUpperCase() + country.slice(1)}as en Vivo`,
          pt: `Top ${category.charAt(0).toUpperCase() + category.slice(1)} Cams ${country.charAt(0).toUpperCase() + country.slice(1)}as ao Vivo`
        },
        category,
        country,
        tags: [category, country, 'locale', 'live'],
        publishDate: today,
        lastModified: today
      });
    });
  });

  // Type 4: How To Guides
  const howToTopics = [
    { slug: 'trovare-cam-gratis', topic: 'cam gratuite', title: 'Trovare le Migliori Cam Gratis' },
    { slug: 'interagire-modelle', topic: 'interazione modelle', title: 'Come Interagire con le Modelle' },
    { slug: 'proteggere-privacy', topic: 'privacy', title: 'Proteggere la Tua Privacy' },
    { slug: 'massimizzare-esperienza', topic: 'esperienza', title: 'Massimizzare la Tua Esperienza' }
  ];

  howToTopics.forEach((topic) => {
    posts.push({
      slug: `come-${topic.slug}`,
      type: 'how-to',
      title: {
        it: `Come ${topic.title} - Guida Completa 2024`,
        en: `How to ${topic.title} - Complete Guide 2024`,
        de: `Wie man ${topic.title} - Vollständiger Leitfaden 2024`,
        fr: `Comment ${topic.title} - Guide Complet 2024`,
        es: `Cómo ${topic.title} - Guía Completa 2024`,
        pt: `Como ${topic.title} - Guia Completo 2024`
      },
      description: {
        it: `Guida passo-passo su ${topic.topic}. Scopri tutti i segreti e le migliori pratiche per ${topic.title.toLowerCase()}.`,
        en: `Step-by-step guide on ${topic.topic}. Discover all the secrets and best practices for ${topic.title.toLowerCase()}.`,
        de: `Schritt-für-Schritt-Anleitung zu ${topic.topic}. Entdecken Sie alle Geheimnisse und Best Practices.`,
        fr: `Guide étape par étape sur ${topic.topic}. Découvrez tous les secrets et meilleures pratiques.`,
        es: `Guía paso a paso sobre ${topic.topic}. Descubre todos los secretos y mejores prácticas.`,
        pt: `Guia passo a passo sobre ${topic.topic}. Descubra todos os segredos e melhores práticas.`
      },
      h1: {
        it: `Come ${topic.title}: Guida Passo-Passo`,
        en: `How to ${topic.title}: Step-by-Step Guide`,
        de: `Wie man ${topic.title}: Schritt-für-Schritt-Anleitung`,
        fr: `Comment ${topic.title}: Guide Étape par Étape`,
        es: `Cómo ${topic.title}: Guía Paso a Paso`,
        pt: `Como ${topic.title}: Guia Passo a Passo`
      },
      tags: ['guida', 'tutorial', 'how-to', topic.topic],
      publishDate: today,
      lastModified: today
    });
  });

  // Type 5: Complete Guide
  posts.push({
    slug: 'guida-completa-live-cam',
    type: 'complete-guide',
    title: {
      it: 'Guida Completa alle Live Cam 2024 - Tutto Quello che Devi Sapere',
      en: 'Complete Guide to Live Cams 2024 - Everything You Need to Know',
      de: 'Vollständiger Leitfaden zu Live Cams 2024 - Alles was Sie wissen müssen',
      fr: 'Guide Complet des Live Cam 2024 - Tout ce que vous devez savoir',
      es: 'Guía Completa de Cams en Vivo 2024 - Todo lo que necesitas saber',
      pt: 'Guia Completo de Cams ao Vivo 2024 - Tudo que você precisa saber'
    },
    description: {
      it: 'La guida più completa alle live cam: come funzionano, come scegliere le migliori, sicurezza, etiquette e molto altro.',
      en: 'The most complete guide to live cams: how they work, how to choose the best, security, etiquette and much more.',
      de: 'Der vollständigste Leitfaden zu Live Cams: wie sie funktionieren, wie man die besten wählt, Sicherheit, Etikette und mehr.',
      fr: 'Le guide le plus complet sur les live cam: comment elles fonctionnent, comment choisir les meilleures, sécurité, étiquette et plus.',
      es: 'La guía más completa de cams en vivo: cómo funcionan, cómo elegir las mejores, seguridad, etiqueta y mucho más.',
      pt: 'O guia mais completo de cams ao vivo: como funcionam, como escolher as melhores, segurança, etiqueta e muito mais.'
    },
    h1: {
      it: 'Guida Completa alle Live Cam: Tutto il Mondo in Diretta',
      en: 'Complete Guide to Live Cams: The Whole World Live',
      de: 'Vollständiger Leitfaden zu Live Cams: Die ganze Welt live',
      fr: 'Guide Complet des Live Cam: Le monde entier en direct',
      es: 'Guía Completa de Cams en Vivo: El mundo entero en vivo',
      pt: 'Guia Completo de Cams ao Vivo: O mundo inteiro ao vivo'
    },
    tags: ['guida', 'complete', 'tutorial', 'basics'],
    publishDate: today,
    lastModified: today
  });

  // Type 6: Statistics
  posts.push({
    slug: 'statistiche-live-cam-2024',
    type: 'statistics',
    title: {
      it: 'Statistiche Live Cam 2024 - Dati e Trend del Settore',
      en: 'Live Cam Statistics 2024 - Industry Data and Trends',
      de: 'Live Cam Statistiken 2024 - Branchendaten und Trends',
      fr: 'Statistiques Live Cam 2024 - Données et Tendances du Secteur',
      es: 'Estadísticas de Cams en Vivo 2024 - Datos y Tendencias',
      pt: 'Estatísticas de Cams ao Vivo 2024 - Dados e Tendências'
    },
    description: {
      it: 'Analisi completa delle statistiche del settore live cam: utenti, ricavi, trend e proiezioni future.',
      en: 'Complete analysis of live cam industry statistics: users, revenue, trends and future projections.',
      de: 'Vollständige Analyse der Live Cam Branchenstatistiken: Nutzer, Einnahmen, Trends und Zukunftsprognosen.',
      fr: 'Analyse complète des statistiques de l\'industrie live cam: utilisateurs, revenus, tendances et projections.',
      es: 'Análisis completo de estadísticas de la industria de cams: usuarios, ingresos, tendencias y proyecciones.',
      pt: 'Análise completa das estatísticas da indústria de cams: usuários, receitas, tendências e projeções.'
    },
    h1: {
      it: 'Statistiche Live Cam 2024: Il Settore in Numeri',
      en: 'Live Cam Statistics 2024: The Industry in Numbers',
      de: 'Live Cam Statistiken 2024: Die Branche in Zahlen',
      fr: 'Statistiques Live Cam 2024: L\'industrie en chiffres',
      es: 'Estadísticas de Cams 2024: La Industria en Números',
      pt: 'Estatísticas de Cams 2024: A Indústria em Números'
    },
    tags: ['statistiche', 'dati', 'trend', 'analisi'],
    publishDate: today,
    lastModified: today
  });

  // Type 7: Security Guide
  posts.push({
    slug: 'sicurezza-privacy-live-cam',
    type: 'security',
    title: {
      it: 'Sicurezza e Privacy nelle Live Cam - Guida Completa',
      en: 'Security and Privacy in Live Cams - Complete Guide',
      de: 'Sicherheit und Datenschutz bei Live Cams - Vollständiger Leitfaden',
      fr: 'Sécurité et Confidentialité dans les Live Cam - Guide Complet',
      es: 'Seguridad y Privacidad en Cams en Vivo - Guía Completa',
      pt: 'Segurança e Privacidade em Cams ao Vivo - Guia Completo'
    },
    description: {
      it: 'Tutto su sicurezza e privacy nelle live cam: come proteggere i tuoi dati, pagamenti sicuri, anonimato.',
      en: 'Everything about security and privacy in live cams: how to protect your data, secure payments, anonymity.',
      de: 'Alles über Sicherheit und Datenschutz bei Live Cams: wie Sie Ihre Daten schützen, sichere Zahlungen, Anonymität.',
      fr: 'Tout sur la sécurité et la confidentialité dans les live cam: protection des données, paiements sécurisés, anonymat.',
      es: 'Todo sobre seguridad y privacidad en cams: cómo proteger tus datos, pagos seguros, anonimato.',
      pt: 'Tudo sobre segurança e privacidade em cams: como proteger seus dados, pagamentos seguros, anonimato.'
    },
    h1: {
      it: 'Sicurezza e Privacy Live Cam: Proteggi Te Stesso',
      en: 'Live Cam Security and Privacy: Protect Yourself',
      de: 'Live Cam Sicherheit und Datenschutz: Schützen Sie sich',
      fr: 'Sécurité et Confidentialité Live Cam: Protégez-vous',
      es: 'Seguridad y Privacidad en Cams: Protégete',
      pt: 'Segurança e Privacidade em Cams: Proteja-se'
    },
    tags: ['sicurezza', 'privacy', 'protezione', 'guida'],
    publishDate: today,
    lastModified: today
  });

  return posts;
};

export const getAllBlogSlugs = (): string[] => {
  return generateBlogPosts().map((post) => post.slug);
};

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return generateBlogPosts().find((post) => post.slug === slug);
};

export const getBlogPostsByCategory = (category: CategorySlug): BlogPost[] => {
  return generateBlogPosts().filter((post) => post.category === category);
};

export const getBlogPostsByCountry = (country: CountrySlug): BlogPost[] => {
  return generateBlogPosts().filter((post) => post.country === country);
};

export const getRelatedPosts = (post: BlogPost, limit: number = 5): BlogPost[] => {
  const allPosts = generateBlogPosts();
  
  const scored = allPosts
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      let score = 0;
      if (p.category && p.category === post.category) score += 3;
      if (p.category2 && p.category2 === post.category) score += 2;
      if (p.country && p.country === post.country) score += 2;
      if (p.type === post.type) score += 1;
      const commonTags = p.tags.filter((tag) => post.tags.includes(tag));
      score += commonTags.length;
      return { post: p, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);
  
  return scored;
};
