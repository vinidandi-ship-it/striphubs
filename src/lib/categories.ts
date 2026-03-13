export const categories = [
  'milf',
  'teen',
  'ebony',
  'asian',
  'latina',
  'blonde',
  'brunette',
  'bbw',
  'arab',
  'indian',
  'brazilian',
  'japanese',
  'couple',
  'gay',
  'lesbian',
  'men',
  'trans',
  'vr'
] as const;

export type CategorySlug = (typeof categories)[number];

export const categoryDescriptions: Record<CategorySlug, { it: string; en: string }> = {
  milf: { 
    it: 'Cam con modelle MILF经验e online. Modelle mature e sexy over 30 in diretta streaming gratuito.', 
    en: 'MILF cam models online. Mature and sexy models over 30 in free live streaming.' 
  },
  teen: { 
    it: 'Cam teen più popolari. Giovani modelle in diretta 24/7.', 
    en: 'Most popular teen cams. Young models live 24/7.' 
  },
  ebony: { 
    it: 'Cam ebony e modelle di colore. Streaming gratis in alta qualità.', 
    en: 'Ebony and black cam models. Free streaming in high quality.' 
  },
  asian: { 
    it: 'Cam asiatiche e giapponesi. Modelle orientali live streaming.', 
    en: 'Asian and Japanese cams. Oriental models live streaming.' 
  },
  latina: { 
    it: 'Cam latine e brasiliane. Modelle hot dal Sud America.', 
    en: 'Latin and Brazilian cams. Hot models from South America.' 
  },
  blonde: { 
    it: 'Cam bionde più hot. Modelle bionde in diretta streaming.', 
    en: 'Hottest blonde cams. Blonde models in live streaming.' 
  },
  brunette: { 
    it: 'Cam morette e brune. Modelle more in diretta gratis.', 
    en: 'Brunette cams. Dark-haired models live for free.' 
  },
  bbw: { 
    it: 'Cam BBW e curvy. Modelle formose in diretta streaming.', 
    en: 'BBW and curvy cams. Curvy models in live streaming.' 
  },
  arab: { 
    it: 'Cam arabe e mediorientali. Modelle arab in diretta.', 
    en: 'Arab and Middle Eastern cams. Arab models live.' 
  },
  indian: { 
    it: 'Cam indiane e hindu. Modelle dallIndia in streaming.', 
    en: 'Indian and Hindu cams. Models from India streaming.' 
  },
  brazilian: { 
    it: 'Cam brasiliane più hot. Modelle brasiliane live.', 
    en: 'Hottest Brazilian cams. Brazilian models live.' 
  },
  japanese: { 
    it: 'Cam giapponesi JAV. Modelle giapponesi in diretta.', 
    en: 'Japanese JAV cams. Japanese models live.' 
  },
  couple: { 
    it: 'Cam couple e duo. Coppie hot in streaming gratis.', 
    en: 'Couple and duo cams. Hot couples in free streaming.' 
  },
  gay: { 
    it: 'Cam gay maschili. Modelli gay in diretta streaming.', 
    en: 'Gay male cams. Gay models in live streaming.' 
  },
  lesbian: { 
    it: 'Cam lesbian e girls. Modelle lesbiche in diretta.', 
    en: 'Lesbian and girls cams. Lesbian models live.' 
  },
  men: { 
    it: 'Cam maschili e boys. Uomini hot in streaming.', 
    en: 'Male cams and boys. Hot men in streaming.' 
  },
  trans: { 
    it: 'Cam trans e shemale. Modelle transgender in diretta.', 
    en: 'Trans and shemale cams. Transgender models live.' 
  },
  vr: { 
    it: 'Cam VR e virtual reality. Esperienze immersive in 3D.', 
    en: 'VR and virtual reality cams. Immersive 3D experiences.' 
  }
};

export const categoryName = (slug: string) =>
  slug.charAt(0).toUpperCase() + slug.slice(1);

export type DerivedCategory = {
  name: string;
  slug: string;
  count: number;
};

const CATEGORY_PATTERNS: Record<CategorySlug, RegExp> = {
  milf: /(girls\/milfs|milf|milfs|mature)/i,
  teen: /(girls\/teens|teen)/i,
  ebony: /(girls\/ebony|ebony|black)/i,
  asian: /(girls\/asian|asian)/i,
  latina: /(girls\/latin|latina|latin)/i,
  blonde: /(girls\/blondes|blonde)/i,
  brunette: /(girls\/brunettes|brunette)/i,
  bbw: /(girls\/bbw|bbw)/i,
  arab: /(girls\/arab|arab)/i,
  indian: /(girls\/indian|indian)/i,
  brazilian: /(girls\/brazilian|brazilian)/i,
  japanese: /(girls\/japanese|japanese)/i,
  couple: /(couples|couple|couples)/i,
  gay: /(gay)/i,
  lesbian: /(girls\/lesbian|lesbian)/i,
  men: /(men|male)/i,
  trans: /(trans)/i,
  vr: /(vr)/i
};

export const categorizeModels = (models: Array<{ tags: string[] }>): DerivedCategory[] => {
  const counts = new Map<CategorySlug, number>();
  categories.forEach((slug) => counts.set(slug, 0));

  models.forEach((model) => {
    model.tags.forEach((tag) => {
      categories.forEach((slug) => {
        if (CATEGORY_PATTERNS[slug].test(tag)) {
          counts.set(slug, (counts.get(slug) || 0) + 1);
        }
      });
    });
  });

  return categories.map((slug) => ({
    slug,
    name: categoryName(slug),
    count: counts.get(slug) ?? 0
  }));
};
