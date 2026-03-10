export const seoTextForCategory = (category: string) =>
  `Scopri ${category} cam live con modelle online adesso, profili aggiornati e accesso rapido alle dirette più viste.`;

export const seoTextForTag = (tag: string) =>
  `Esplora modelle live con tag ${tag}, camere online attive e nuove dirette aggiornate in tempo reale.`;

export const seoTextForCombination = (category: string, tag: string) =>
  `Guarda ${category} cam live con tag ${tag}, performer online adesso e accesso immediato alle camere attive.`;

export const seoTextForCountry = (country: string) =>
  `Guarda ${country.toLowerCase()} cam live online ora con modelle attive, profili aggiornati e link rapidi verso categorie e tag più cercati.`;

export const seoFaqForTag = (tag: string) => [
  {
    question: `Cosa trovi nella pagina ${tag}?`,
    answer: `Una selezione aggiornata di modelle live con tag ${tag}, ordinata per popolarita e disponibilita attiva.`
  },
  {
    question: `Le modelle ${tag} sono online in tempo reale?`,
    answer: `Si, la pagina mostra performer recuperate dal feed live e aggiornate di continuo durante la navigazione.`
  }
];

export const seoFaqForCombination = (category: string, tag: string) => [
  {
    question: `Che tipo di dirette trovi in ${category} + ${tag}?`,
    answer: `La pagina combina la categoria ${category} con il tag ${tag} per offrire landing piu specifiche e adatte alla ricerca long-tail.`
  },
  {
    question: `Perche esiste una landing ${category} ${tag}?`,
    answer: `Serve a raccogliere modelle live pertinenti, migliorare il linking interno e intercettare ricerche piu precise.`
  }
];

export const seoFaqForCategory = (category: string) => [
  {
    question: `Cosa trovi nella categoria ${category}?`,
    answer: `Una selezione di modelle live legate alla categoria ${category}, aggiornata in tempo reale e ordinata per disponibilita e interesse.`
  },
  {
    question: `La categoria ${category} viene aggiornata spesso?`,
    answer: `Si, la pagina viene alimentata dal feed live e continua a caricare nuove modelle mentre scorri.`
  }
];
