import { categoryName, CategorySlug } from './categories';
import { getCountryName, countries, CountrySlug } from './countries';
import { tags, TagSlug } from './tags';
import { Language, SUPPORTED_LANGUAGES } from './i18n';

interface FAQ {
  question: string;
  answer: string;
}

interface RelatedSearch {
  query: string;
  url: string;
}

interface ProgrammaticContent {
  h1: string;
  intro: string;
  faqs: FAQ[];
  relatedSearches: RelatedSearch[];
  longTailText: string;
}

const translations: Record<Language, {
  watchOnline: string;
  modelsAvailable: string;
  freeAccess: string;
  noRegistration: string;
  liveNow: string;
  viewers: string;
  discoverMore: string;
  relatedQuestions: string;
  peopleAlsoAsk: string;
}> = {
  it: {
    watchOnline: 'Guarda online gratis',
    modelsAvailable: 'modelle disponibili',
    freeAccess: 'Accesso gratuito',
    noRegistration: 'Nessuna registrazione richiesta',
    liveNow: 'Online ora',
    viewers: 'spettatori',
    discoverMore: 'Scopri di più',
    relatedQuestions: 'Domande correlate',
    peopleAlsoAsk: 'Le persone chiedono anche'
  },
  en: {
    watchOnline: 'Watch online free',
    modelsAvailable: 'models available',
    freeAccess: 'Free access',
    noRegistration: 'No registration required',
    liveNow: 'Live now',
    viewers: 'viewers',
    discoverMore: 'Discover more',
    relatedQuestions: 'Related questions',
    peopleAlsoAsk: 'People also ask'
  },
  de: {
    watchOnline: 'Kostenlos online ansehen',
    modelsAvailable: 'Modelle verfügbar',
    freeAccess: 'Kostenloser Zugang',
    noRegistration: 'Keine Registrierung erforderlich',
    liveNow: 'Jetzt live',
    viewers: 'Zuschauer',
    discoverMore: 'Mehr entdecken',
    relatedQuestions: 'Verwandte Fragen',
    peopleAlsoAsk: 'Leute fragen auch'
  },
  fr: {
    watchOnline: 'Regarder en ligne gratuit',
    modelsAvailable: 'modèles disponibles',
    freeAccess: 'Accès gratuit',
    noRegistration: 'Aucune inscription requise',
    liveNow: 'En direct maintenant',
    viewers: 'spectateurs',
    discoverMore: 'Découvrir plus',
    relatedQuestions: 'Questions connexes',
    peopleAlsoAsk: 'Les gens demandent aussi'
  },
  es: {
    watchOnline: 'Ver en línea gratis',
    modelsAvailable: 'modelos disponibles',
    freeAccess: 'Acceso gratuito',
    noRegistration: 'No se requiere registro',
    liveNow: 'En vivo ahora',
    viewers: 'espectadores',
    discoverMore: 'Descubrir más',
    relatedQuestions: 'Preguntas relacionadas',
    peopleAlsoAsk: 'La gente también pregunta'
  },
  pt: {
    watchOnline: 'Assistir online grátis',
    modelsAvailable: 'modelos disponíveis',
    freeAccess: 'Acesso gratuito',
    noRegistration: 'Nenhum registro necessário',
    liveNow: 'Ao vivo agora',
    viewers: 'espectadores',
    discoverMore: 'Descobrir mais',
    relatedQuestions: 'Perguntas relacionadas',
    peopleAlsoAsk: 'As pessoas também perguntam'
  }
};

const categoryFAQTemplates: Record<Language, Record<string, (cat: string) => FAQ[]>> = {
  it: {
    teen: (cat) => [
      { question: `Quante modelle ${cat} ci sono online?`, answer: `Ci sono sempre decine di modelle ${cat} online 24/7 su StripHubs. Il numero varia in base all'orario, con picchi nelle ore serali.` },
      { question: `Le cam ${cat} sono davvero gratis?`, answer: `Sì, tutte le cam ${cat} su StripHubs sono completamente gratuite. Nessuna registrazione o pagamento richiesto per guardare.` },
      { question: `Come trovo le migliori ${cat} cam?`, answer: `Usa i filtri per ordinare per numero di spettatori, lingua o tag. Le cam più popolari sono sempre in cima alla lista.` },
      { question: `Posso interagire con le modelle ${cat}?`, answer: `Sì, puoi chattare gratuitamente con le modelle ${cat} durante le dirette. Alcune offrono anche funzionalità interattive.` }
    ],
    milf: (cat) => [
      { question: `Cosa rende le ${cat} cam speciali?`, answer: `Le modelle ${cat} portano esperienza e maturità nelle loro dirette. Molte hanno anni di esperienza nel settore.` },
      { question: `Quante ${cat} sono online adesso?`, answer: `StripHubs ospita centinaia di ${cat} attive 24 ore su 24. Controlla sempre la pagina per vedere chi è online.` },
      { question: `Le ${cat} fanno spettacoli privati?`, answer: `Molte ${cat} offrono sia contenuti pubblici gratuiti che opzioni private per esperienze più personalizzate.` }
    ],
    asian: (cat) => [
      { question: `Da quali paesi provengono le ${cat}?`, answer: `Le modelle ${cat} provengono da Giappone, Corea, Thailandia, Filippine, Cina e altri paesi asiatici.` },
      { question: `A che ore è meglio guardare ${cat} cam?`, answer: `Per le ${cat}, le ore migliori sono quelle che corrispondono alla sera nel loro fuso orario locale.` },
      { question: `Le ${cat} parlano italiano?`, answer: `Alcune ${cat} parlano italiano, ma la maggior parte comunica in inglese. La chat funziona bene in qualsiasi lingua.` }
    ],
    default: (cat) => [
      { question: `Cosa trovo nella categoria ${cat}?`, answer: `Nella categoria ${cat} trovi una selezione aggiornata di modelle live, con profili verificati e streaming HD.` },
      { question: `Quante ${cat} ci sono online adesso?`, answer: `Il numero di ${cat} online varia continuamente. Aggiorna la pagina per vedere le modelle attualmente in diretta.` },
      { question: `Guardare le ${cat} cam è gratis?`, answer: `Sì, guardare le ${cat} cam su StripHubs è completamente gratuito. Nessuna registrazione richiesta.` },
      { question: `Come contatto una modella ${cat}?`, answer: `Clicca sul profilo della modella ${cat} per accedere alla sua chat gratuita e iniziare a interagire.` }
    ]
  },
  en: {
    default: (cat) => [
      { question: `How many ${cat} models are online?`, answer: `There are always dozens of ${cat} models online 24/7 on StripHubs. Numbers peak during evening hours.` },
      { question: `Are ${cat} cams really free?`, answer: `Yes, all ${cat} cams on StripHubs are completely free. No registration or payment required to watch.` },
      { question: `How do I find the best ${cat} cams?`, answer: `Use filters to sort by viewer count, language, or tags. The most popular cams are always at the top.` }
    ]
  },
  de: {
    default: (cat) => [
      { question: `Wie viele ${cat} Models sind online?`, answer: `Es sind immer Dutzende von ${cat} Models 24/7 auf StripHubs online. Die Zahlen steigen in den Abendstunden.` },
      { question: `Sind ${cat} Cams wirklich kostenlos?`, answer: `Ja, alle ${cat} Cams auf StripHubs sind völlig kostenlos. Keine Registrierung oder Zahlung erforderlich.` }
    ]
  },
  fr: {
    default: (cat) => [
      { question: `Combien de modèles ${cat} sont en ligne?`, answer: `Il y a toujours des dizaines de modèles ${cat} en ligne 24/7 sur StripHubs.` },
      { question: `Les cams ${cat} sont-elles vraiment gratuites?`, answer: `Oui, toutes les cams ${cat} sur StripHubs sont entièrement gratuites. Aucune inscription requise.` }
    ]
  },
  es: {
    default: (cat) => [
      { question: `¿Cuántos modelos ${cat} están en línea?`, answer: `Siempre hay docenas de modelos ${cat} en línea 24/7 en StripHubs.` },
      { question: `¿Las cams ${cat} son realmente gratis?`, answer: `Sí, todas las cams ${cat} en StripHubs son completamente gratuitas. No se requiere registro.` }
    ]
  },
  pt: {
    default: (cat) => [
      { question: `Quantos modelos ${cat} estão online?`, answer: `Sempre há dezenas de modelos ${cat} online 24/7 no StripHubs.` },
      { question: `As cams ${cat} são realmente grátis?`, answer: `Sim, todas as cams ${cat} no StripHubs são completamente gratuitas. Nenhum registro necessário.` }
    ]
  }
};

const getCountryFAQs = (country: string, lang: Language): FAQ[] => {
  const t = translations[lang];
  return [
    { 
      question: `Quante modelle ${country} ci sono online?`, 
      answer: `Ci sono sempre molte modelle ${country} attive su StripHubs. Il numero varia durante il giorno con picchi nelle ore serali del paese.` 
    },
    { 
      question: `Le cam ${country} sono gratis?`, 
      answer: `Sì, tutte le cam ${country} su StripHubs sono completamente gratuite. ${t.noRegistration}.` 
    },
    { 
      question: `Come trovo modelle ${country}?`, 
      answer: `Seleziona il paese ${country} dal filtro o visita la pagina dedicata. Troverai tutte le modelle attive da quel paese.` 
    }
  ];
};

const getTagFAQs = (tag: string, lang: Language): FAQ[] => {
  return [
    { 
      question: `Cosa significa il tag ${tag}?`, 
      answer: `Il tag ${tag} identifica modelle che offrono contenuti specifici legati a questa categoria o caratteristica.` 
    },
    { 
      question: `Quante modelle con tag ${tag} sono online?`, 
      answer: `Il numero di modelle con tag ${tag} cambia continuamente. La pagina si aggiorna in tempo reale per mostrare chi è attivo.` 
    },
    { 
      question: `Posso combinare il tag ${tag} con altre categorie?`, 
      answer: `Sì, puoi usare i filtri per combinare ${tag} con categorie, paesi o altri tag per affinare la ricerca.` 
    }
  ];
};

const getCombinationFAQs = (category: string, tag: string, lang: Language): FAQ[] => {
  return [
    { 
      question: `Perché esiste una pagina per ${category} + ${tag}?`, 
      answer: `La combinazione ${category} ${tag} permette di trovare esattamente il tipo di modelle che cerchi, filtrando per categoria e caratteristiche specifiche.` 
    },
    { 
      question: `Quante ${category} con ${tag} ci sono online?`, 
      answer: `Il numero di ${category} con tag ${tag} varia. La pagina mostra sempre le modelle attualmente in diretta.` 
    },
    { 
      question: `Questa combinazione è popolare?`, 
      answer: `Sì, ${category} ${tag} è una delle combinazioni più ricercate. Molti utenti apprezzano questa specifica nicchia.` 
    }
  ];
};

export const generateCategoryContent = (
  category: CategorySlug,
  modelCount: number,
  lang: Language = 'it'
): ProgrammaticContent => {
  const catName = categoryName(category);
  const t = translations[lang];
  const faqTemplate = categoryFAQTemplates[lang]?.[category] || categoryFAQTemplates[lang]?.default || categoryFAQTemplates.it.default;
  
  return {
    h1: `${catName} Cam Live Gratis - ${modelCount} Modelle Online`,
    intro: `Scopri ${modelCount} modelle ${catName} online in diretta streaming su StripHubs. ${t.freeAccess}, ${t.noRegistration.toLowerCase()}. Filtra per età, paese e preferenze per trovare la ${catName.toLowerCase()} perfetta per te.`,
    faqs: faqTemplate(catName),
    relatedSearches: generateCategoryRelatedSearches(category),
    longTailText: `Le migliori ${catName.toLowerCase()} cam live sono su StripHubs. Guarda ${modelCount}+ modelle ${catName.toLowerCase()} in diretta streaming HD gratis. Chat gratuita, nessuna registrazione, accesso immediato. Le ${catName.toLowerCase()} più hot del web ti aspettano 24 ore su 24.`
  };
};

export const generateCountryContent = (
  country: CountrySlug,
  t: (key: string) => string,
  modelCount: number,
  lang: Language = 'it'
): ProgrammaticContent => {
  const countryName = getCountryName(country, t);
  const tr = translations[lang];
  
  return {
    h1: `Cam ${countryName} Live Gratis - ${modelCount} Modelle Online`,
    intro: `Guarda ${modelCount} cam ${countryName.toLowerCase()} in diretta streaming gratis. Modelle ${countryName.toLowerCase()} online 24/7, ${tr.noRegistration.toLowerCase()}. Filtra per categoria e tag.`,
    faqs: getCountryFAQs(countryName, lang),
    relatedSearches: generateCountryRelatedSearches(country, countryName),
    longTailText: `Le migliori cam ${countryName.toLowerCase()} live sono su StripHubs. Guarda ${modelCount}+ modelle ${countryName.toLowerCase()} in streaming HD gratis. Chat gratuita, accesso immediato, nessuna registrazione richiesta.`
  };
};

export const generateTagContent = (
  tag: string,
  modelCount: number,
  lang: Language = 'it'
): ProgrammaticContent => {
  const tagName = tag.charAt(0).toUpperCase() + tag.slice(1);
  const t = translations[lang];
  
  return {
    h1: `${tagName} Cam Live Gratis - ${modelCount} Modelle Online`,
    intro: `Esplora ${modelCount} modelle con tag ${tagName} in diretta streaming. Le cam più hot con ${tagName} sono qui. ${t.freeAccess}, ${t.noRegistration.toLowerCase()}.`,
    faqs: getTagFAQs(tag, lang),
    relatedSearches: generateTagRelatedSearches(tag),
    longTailText: `Scopri le migliori cam ${tag} live su StripHubs. ${modelCount}+ modelle con tag ${tag} online in streaming HD gratis. Chat gratuita, accesso immediato 24/7.`
  };
};

export const generateCombinationContent = (
  category: CategorySlug,
  tag: string,
  modelCount: number,
  lang: Language = 'it'
): ProgrammaticContent => {
  const catName = categoryName(category);
  const tagName = tag.charAt(0).toUpperCase() + tag.slice(1);
  const t = translations[lang];
  
  return {
    h1: `${catName} ${tagName} Cam Live Gratis - ${modelCount} Modelle`,
    intro: `Trova ${modelCount} ${catName.toLowerCase()} con tag ${tagName} in diretta streaming. ${t.freeAccess}, ${t.noRegistration.toLowerCase()}. La combinazione perfetta per le tue preferenze.`,
    faqs: getCombinationFAQs(catName, tag, lang),
    relatedSearches: generateCombinationRelatedSearches(category, tag),
    longTailText: `Le migliori ${catName.toLowerCase()} ${tag} cam live su StripHubs. Guarda ${modelCount}+ modelle ${catName.toLowerCase()} con ${tag} in streaming HD gratis. Chat gratuita, accesso immediato.`
  };
};

export const generateModelContent = (
  username: string,
  category: string,
  tags: string[],
  viewers: number,
  lang: Language = 'it'
): ProgrammaticContent => {
  const catName = categoryName(category);
  const t = translations[lang];
  const tagList = tags.slice(0, 3).join(', ');
  
  return {
    h1: `${username} Live Cam - ${catName} - ${viewers.toLocaleString()} ${t.viewers}`,
    intro: `Guarda ${username} in diretta streaming HD. ${catName} con ${viewers.toLocaleString()} ${t.viewers} online. Tag: ${tagList}. ${t.freeAccess}, ${t.noRegistration.toLowerCase()}.`,
    faqs: [
      { question: `${username} è online adesso?`, answer: `Controlla lo stato LIVE sulla thumbnail. Se è online, puoi entrare in chat immediatamente.` },
      { question: `Posso chattare con ${username}?`, answer: `Sì, la chat con ${username} è completamente gratuita. Nessuna registrazione richiesta.` },
      { question: `Che tipo di contenuti fa ${username}?`, answer: `${username} è una ${catName.toLowerCase()}. Tag popolari: ${tagList}. Visita il profilo per saperne di più.` }
    ],
    relatedSearches: [
      { query: `${username} live`, url: `/model/${username}` },
      { query: `${catName} cam`, url: `/cam/${category}` },
      ...tags.slice(0, 2).map(t => ({ query: `${t} cam`, url: `/tag/${t}` }))
    ],
    longTailText: `Guarda ${username} live cam gratis su StripHubs. ${catName} con ${viewers.toLocaleString()} spettatori. Streaming HD, chat gratuita, nessuna registrazione. Tag: ${tagList}.`
  };
};

const generateCategoryRelatedSearches = (category: CategorySlug): RelatedSearch[] => {
  const catName = categoryName(category);
  const relatedTags = tags.slice(0, 4);
  const otherCategories = ['teen', 'milf', 'asian', 'latina'].filter(c => c !== category).slice(0, 2);
  
  return [
    { query: `${catName} cam live`, url: `/cam/${category}` },
    { query: `${catName} cam gratis`, url: `/cam/${category}` },
    ...relatedTags.map(tag => ({ query: `${catName} ${tag}`, url: `/cam/${category}/${tag}` })),
    ...otherCategories.map(cat => ({ query: `${categoryName(cat)} cam`, url: `/cam/${cat}` }))
  ];
};

const generateCountryRelatedSearches = (country: CountrySlug, countryName: string): RelatedSearch[] => {
  const topCategories = ['teen', 'milf', 'asian'];
  const otherCountries = countries.filter(c => c.slug !== country).slice(0, 3);
  
  return [
    { query: `cam ${countryName.toLowerCase()}`, url: `/country/${country}` },
    { query: `${countryName.toLowerCase()} live cam`, url: `/country/${country}` },
    ...topCategories.map(cat => ({ query: `${categoryName(cat)} ${countryName.toLowerCase()}`, url: `/cam/${cat}` })),
    ...otherCountries.map(c => ({ query: `cam ${c.name.toLowerCase()}`, url: `/country/${c.slug}` }))
  ];
};

const generateTagRelatedSearches = (tag: string): RelatedSearch[] => {
  const tagName = tag.charAt(0).toUpperCase() + tag.slice(1);
  const topCategories = ['teen', 'milf', 'asian', 'latina'];
  const otherTags = tags.filter(t => t !== tag).slice(0, 3);
  
  return [
    { query: `${tagName} cam`, url: `/tag/${tag}` },
    { query: `${tagName} live`, url: `/tag/${tag}` },
    ...topCategories.map(cat => ({ query: `${categoryName(cat)} ${tag}`, url: `/cam/${cat}/${tag}` })),
    ...otherTags.map(t => ({ query: `${t} cam`, url: `/tag/${t}` }))
  ];
};

const generateCombinationRelatedSearches = (category: CategorySlug, tag: string): RelatedSearch[] => {
  const catName = categoryName(category);
  const tagName = tag.charAt(0).toUpperCase() + tag.slice(1);
  const otherTags = tags.filter(t => t !== tag).slice(0, 2);
  const otherCategories = ['teen', 'milf', 'asian'].filter(c => c !== category).slice(0, 2);
  
  return [
    { query: `${catName} ${tagName}`, url: `/cam/${category}/${tag}` },
    { query: `${catName} cam`, url: `/cam/${category}` },
    { query: `${tagName} cam`, url: `/tag/${tag}` },
    ...otherTags.map(t => ({ query: `${catName} ${t}`, url: `/cam/${category}/${t}` })),
    ...otherCategories.map(c => ({ query: `${categoryName(c)} ${tag}`, url: `/cam/${c}/${tag}` }))
  ];
};

export const generateRelatedSearchesSection = (
  searches: RelatedSearch[]
): { title: string; items: RelatedSearch[] } => {
  return {
    title: 'Ricerche correlate',
    items: searches.slice(0, 8)
  };
};

export const generatePeopleAlsoAsk = (
  faqs: FAQ[]
): { title: string; items: FAQ[] } => {
  return {
    title: 'Le persone chiedono anche',
    items: faqs.slice(0, 4)
  };
};

export const generateSEOFooter = (
  category?: CategorySlug,
  country?: CountrySlug,
  tag?: string
): string => {
  const parts: string[] = [];
  
  if (category) {
    parts.push(`Esplora la categoria ${categoryName(category)} per scoprire le migliori modelle online.`);
  }
  if (tag) {
    parts.push(`Il tag ${tag} identifica contenuti specifici e popolari tra gli utenti.`);
  }
  if (country) {
    parts.push(`Le modelle del paese selezionato sono online 24/7 con streaming HD.`);
  }
  
  parts.push('StripHubs è la directory italiana di live cam gratis. Accesso immediato, nessuna registrazione, streaming HD 24/7.');
  
  return parts.join(' ');
};

export const generateMetaKeywords = (
  category?: CategorySlug,
  tag?: string,
  country?: CountrySlug,
  additionalKeywords: string[] = []
): string[] => {
  const keywords = new Set<string>();
  
  if (category) {
    keywords.add(category);
    keywords.add(categoryName(category).toLowerCase());
  }
  if (tag) {
    keywords.add(tag);
    keywords.add(tag.toLowerCase());
  }
  if (country) {
    keywords.add(country);
  }
  
  keywords.add('live cam');
  keywords.add('streaming');
  keywords.add('gratis');
  keywords.add('free');
  keywords.add('online');
  keywords.add('diretta');
  keywords.add('chat');
  
  additionalKeywords.forEach(k => keywords.add(k.toLowerCase()));
  
  return Array.from(keywords).slice(0, 15);
};
