import { useEffect } from 'react';
import { upsertJsonLd } from '../lib/seo';
import { CategorySlug } from '../lib/categories';
import { CountrySlug } from '../lib/countries';
import { Language } from '../i18n/translations';

type FAQ = {
  question: string;
  answer: string;
};

type FAQSectionProps = {
  category?: CategorySlug;
  country?: CountrySlug;
  tag?: string;
  language: Language;
  customFAQs?: FAQ[];
};

export default function FAQSection({ 
  category, 
  country, 
  tag, 
  language,
  customFAQs 
}: FAQSectionProps) {
  const faqs = customFAQs || generateFAQs(category, country, tag, language);

  useEffect(() => {
    if (faqs.length > 0) {
      upsertJsonLd('faq-jsonld', {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer
          }
        }))
      });
    }
  }, [faqs]);

  if (faqs.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="mb-6 text-2xl font-bold">
        {getFAQTitle(language)}
      </h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group rounded-lg border border-border bg-bg/50 p-4"
            open={index === 0}
          >
            <summary className="flex cursor-pointer items-center justify-between font-semibold">
              <span className="pr-4">{faq.question}</span>
              <span className="text-accent transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>
            <p className="mt-3 text-zinc-300">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}

function getFAQTitle(language: Language): string {
  const titles: Record<Language, string> = {
    it: 'Domande Frequenti',
    en: 'Frequently Asked Questions',
    de: 'Häufig Gestellte Fragen',
    fr: 'Questions Fréquemment Posées',
    es: 'Preguntas Frecuentes',
    pt: 'Perguntas Frequentes'
  };
  return titles[language];
}

function generateFAQs(
  category?: CategorySlug, 
  country?: CountrySlug, 
  tag?: string,
  language: Language = 'it'
): FAQ[] {
  const faqs: FAQ[] = [];
  
  if (category && country) {
    faqs.push(...getCategoryCountryFAQs(category, country, language));
  } else if (category) {
    faqs.push(...getCategoryFAQs(category, language));
  } else if (country) {
    faqs.push(...getCountryFAQs(country, language));
  } else if (tag) {
    faqs.push(...getTagFAQs(tag, language));
  } else {
    faqs.push(...getGeneralFAQs(language));
  }
  
  return faqs.slice(0, 10);
}

function getCategoryFAQs(category: CategorySlug, language: Language): FAQ[] {
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  
  const faqTemplates: Record<Language, FAQ[]> = {
    it: [
      {
        question: `Cosa sono le ${category} cam?`,
        answer: `Le ${category} cam sono dirette streaming live dove puoi interagire in tempo reale con modelle ${categoryName}. Su StripHubs trovi centinaia di ${category} cam online 24/7, completamente gratis.`
      },
      {
        question: `Come trovare le migliori ${category} cam?`,
        answer: `Per trovare le migliori ${category} cam, usa i filtri su StripHubs. Puoi ordinare per popolarità, numero di spettatori, o usare la ricerca avanzata. Le top model ${categoryName} sono sempre in evidenza.`
      },
      {
        question: `Le ${category} cam sono gratuite?`,
        answer: `Sì, la maggior parte delle ${category} cam su StripHubs sono completamente gratuite da guardare. Puoi guardare le dirette senza registrazione. Per funzioni premium come chat privata, sono disponibili opzioni a pagamento.`
      },
      {
        question: `Quante ${category} cam ci sono online?`,
        answer: `In media ci sono da 50 a 200 ${category} cam online contemporaneamente, 24 ore su 24. Il numero varia in base all'orario e al giorno della settimana.`
      },
      {
        question: `Posso interagire con le modelle ${categoryName}?`,
        answer: `Assolutamente sì! Puoi chattare gratuitamente con le modelle ${categoryName} nella chat pubblica. Per interazioni più personali, puoi richiedere spettacoli privati o inviare mance.`
      },
      {
        question: `È sicuro guardare ${category} cam?`,
        answer: `Sì, guardare ${category} cam su StripHubs è sicuro. Non devi fornire dati personali per guardare le dirette gratuite. Per transazioni a pagamento, il sito usa crittografia SSL e metodi di pagamento sicuri.`
      },
      {
        question: `Devo registrarmi per guardare ${category} cam?`,
        answer: `No, non è necessario registrarsi per guardare ${category} cam su StripHubs. La registrazione è gratuita e ti dà accesso a funzioni extra come salvare le tue modelle preferite e ricevere notifiche.`
      },
      {
        question: `Quali lingue parlano le modelle ${categoryName}?`,
        answer: `Le modelle ${categoryName} parlano diverse lingue in base alla loro nazionalità. Molte parlano inglese oltre alla loro lingua madre. Puoi filtrare le modelle per lingua.`
      }
    ],
    en: [
      {
        question: `What are ${category} cams?`,
        answer: `${categoryName} cams are live streaming shows where you can interact in real-time with ${categoryName} models. On StripHubs you'll find hundreds of ${category} cams online 24/7, completely free.`
      },
      {
        question: `How to find the best ${category} cams?`,
        answer: `To find the best ${category} cams, use the filters on StripHubs. You can sort by popularity, viewer count, or use advanced search. Top ${categoryName} models are always featured.`
      },
      {
        question: `Are ${category} cams free?`,
        answer: `Yes, most ${category} cams on StripHubs are completely free to watch. You can watch live streams without registration. For premium features like private chat, paid options are available.`
      },
      {
        question: `How many ${category} cams are online?`,
        answer: `On average there are 50 to 200 ${category} cams online simultaneously, 24 hours a day. The number varies based on time and day of the week.`
      },
      {
        question: `Can I interact with ${categoryName} models?`,
        answer: `Absolutely! You can chat for free with ${categoryName} models in public chat. For more personal interactions, you can request private shows or send tips.`
      },
      {
        question: `Is it safe to watch ${category} cams?`,
        answer: `Yes, watching ${category} cams on StripHubs is safe. You don't need to provide personal data to watch free streams. For paid transactions, the site uses SSL encryption and secure payment methods.`
      },
      {
        question: `Do I need to register to watch ${category} cams?`,
        answer: `No, registration is not required to watch ${category} cams on StripHubs. Registration is free and gives you access to extra features like saving favorite models and receiving notifications.`
      },
      {
        question: `What languages do ${categoryName} models speak?`,
        answer: `${categoryName} models speak various languages based on their nationality. Many speak English in addition to their native language. You can filter models by language.`
      }
    ],
    de: [
      {
        question: `Was sind ${category} Cams?`,
        answer: `${categoryName} Cams sind Live-Streaming-Shows, bei denen Sie in Echtzeit mit ${categoryName} Models interagieren können. Auf StripHubs finden Sie hunderte ${category} Cams 24/7 online, komplett kostenlos.`
      },
      {
        question: `Wie finde ich die besten ${category} Cams?`,
        answer: `Um die besten ${category} Cams zu finden, nutzen Sie die Filter auf StripHubs. Sie können nach Beliebtheit, Zuschauerzahl sortieren oder die erweiterte Suche nutzen. Top ${categoryName} Models sind immer hervorgehoben.`
      },
      {
        question: `Sind ${category} Cams kostenlos?`,
        answer: `Ja, die meisten ${category} Cams auf StripHubs sind komplett kostenlos anzusehen. Sie können Live-Streams ohne Registrierung ansehen. Für Premium-Funktionen wie Privat-Chat sind kostenpflichtige Optionen verfügbar.`
      },
      {
        question: `Wie viele ${category} Cams sind online?`,
        answer: `Durchschnittlich sind 50 bis 200 ${category} Cams gleichzeitig online, 24 Stunden am Tag. Die Anzahl variiert je nach Uhrzeit und Wochentag.`
      },
      {
        question: `Kann ich mit ${categoryName} Models interagieren?`,
        answer: `Absolut! Sie können kostenlos mit ${categoryName} Models im öffentlichen Chat chatten. Für persönlichere Interaktionen können Sie Privats Shows anfordern oder Trinkgelder senden.`
      },
      {
        question: `Ist es sicher, ${category} Cams anzusehen?`,
        answer: `Ja, das Ansehen von ${category} Cams auf StripHubs ist sicher. Sie müssen keine persönlichen Daten angeben, um kostenlose Streams anzusehen. Für kostenpflichtige Transaktionen verwendet die Seite SSL-Verschlüsselung und sichere Zahlungsmethoden.`
      },
      {
        question: `Muss ich mich registrieren, um ${category} Cams anzusehen?`,
        answer: `Nein, eine Registrierung ist nicht erforderlich, um ${category} Cams auf StripHubs anzusehen. Die Registrierung ist kostenlos und gibt Ihnen Zugang zu zusätzlichen Funktionen wie dem Speichern von Lieblingsmodels und Benachrichtigungen.`
      },
      {
        question: `Welche Sprachen sprechen ${categoryName} Models?`,
        answer: `${categoryName} Models sprechen verschiedene Sprachen basierend auf ihrer Nationalität. Viele sprechen neben ihrer Muttersprache auch Englisch. Sie können Models nach Sprache filtern.`
      }
    ],
    fr: [
      {
        question: `Que sont les cam ${category}?`,
        answer: `Les cam ${category} sont des spectacles en streaming live où vous pouvez interagir en temps réel avec des modèles ${categoryName}. Sur StripHubs vous trouverez des centaines de cam ${category} en ligne 24/7, entièrement gratuites.`
      },
      {
        question: `Comment trouver les meilleures cam ${category}?`,
        answer: `Pour trouver les meilleures cam ${category}, utilisez les filtres sur StripHubs. Vous pouvez trier par popularité, nombre de spectateurs, ou utiliser la recherche avancée. Les top modèles ${categoryName} sont toujours en vedette.`
      },
      {
        question: `Les cam ${category} sont-elles gratuites?`,
        answer: `Oui, la plupart des cam ${category} sur StripHubs sont entièrement gratuites à regarder. Vous pouvez regarder les flux en direct sans inscription. Pour les fonctionnalités premium comme le chat privé, des options payantes sont disponibles.`
      },
      {
        question: `Combien de cam ${category} sont en ligne?`,
        answer: `En moyenne, il y a 50 à 200 cam ${category} en ligne simultanément, 24 heures sur 24. Le nombre varie selon l'heure et le jour de la semaine.`
      },
      {
        question: `Puis-je interagir avec les modèles ${categoryName}?`,
        answer: `Absolument! Vous pouvez discuter gratuitement avec les modèles ${categoryName} dans le chat public. Pour des interactions plus personnelles, vous pouvez demander des spectacles privés ou envoyer des pourboires.`
      },
      {
        question: `Est-il sûr de regarder des cam ${category}?`,
        answer: `Oui, regarder des cam ${category} sur StripHubs est sûr. Vous n'avez pas besoin de fournir de données personnelles pour regarder les flux gratuits. Pour les transactions payantes, le site utilise le cryptage SSL et des méthodes de paiement sécurisées.`
      },
      {
        question: `Dois-je m'inscrire pour regarder des cam ${category}?`,
        answer: `Non, l'inscription n'est pas nécessaire pour regarder des cam ${category} sur StripHubs. L'inscription est gratuite et vous donne accès à des fonctionnalités supplémentaires comme sauvegarder vos modèles préférés et recevoir des notifications.`
      },
      {
        question: `Quelles langues parlent les modèles ${categoryName}?`,
        answer: `Les modèles ${categoryName} parlent différentes langues selon leur nationalité. Beaucoup parlent anglais en plus de leur langue maternelle. Vous pouvez filtrer les modèles par langue.`
      }
    ],
    es: [
      {
        question: `¿Qué son las cam ${category}?`,
        answer: `Las cam ${category} son espectáculos de streaming en vivo donde puedes interactuar en tiempo real con modelos ${categoryName}. En StripHubs encontrarás cientos de cam ${category} en línea 24/7, completamente gratis.`
      },
      {
        question: `¿Cómo encontrar las mejores cam ${category}?`,
        answer: `Para encontrar las mejores cam ${category}, usa los filtros en StripHubs. Puedes ordenar por popularidad, número de espectadores, o usar la búsqueda avanzada. Los top modelos ${categoryName} siempre están destacados.`
      },
      {
        question: `¿Las cam ${category} son gratuitas?`,
        answer: `Sí, la mayoría de las cam ${category} en StripHubs son completamente gratis para ver. Puedes ver los streams en vivo sin registro. Para funciones premium como chat privado, hay opciones de pago disponibles.`
      },
      {
        question: `¿Cuántas cam ${category} hay en línea?`,
        answer: `En promedio hay de 50 a 200 cam ${category} en línea simultáneamente, 24 horas al día. El número varía según la hora y el día de la semana.`
      },
      {
        question: `¿Puedo interactuar con los modelos ${categoryName}?`,
        answer: `¡Absolutamente! Puedes chatear gratis con los modelos ${categoryName} en el chat público. Para interacciones más personales, puedes solicitar espectáculos privados o enviar propinas.`
      },
      {
        question: `¿Es seguro ver cam ${category}?`,
        answer: `Sí, ver cam ${category} en StripHubs es seguro. No necesitas proporcionar datos personales para ver los streams gratuitos. Para transacciones de pago, el sitio usa encriptación SSL y métodos de pago seguros.`
      },
      {
        question: `¿Necesito registrarme para ver cam ${category}?`,
        answer: `No, no es necesario registrarse para ver cam ${category} en StripHubs. El registro es gratis y te da acceso a funciones extra como guardar tus modelos favoritos y recibir notificaciones.`
      },
      {
        question: `¿Qué idiomas hablan los modelos ${categoryName}?`,
        answer: `Los modelos ${categoryName} hablan varios idiomas según su nacionalidad. Muchos hablan inglés además de su idioma nativo. Puedes filtrar los modelos por idioma.`
      }
    ],
    pt: [
      {
        question: `O que são cam ${category}?`,
        answer: `As cam ${category} são shows de streaming ao vivo onde você pode interagir em tempo real com modelos ${categoryName}. No StripHubs você encontra centenas de cam ${category} online 24/7, completamente grátis.`
      },
      {
        question: `Como encontrar as melhores cam ${category}?`,
        answer: `Para encontrar as melhores cam ${category}, use os filtros no StripHubs. Você pode ordenar por popularidade, número de espectadores, ou usar a busca avançada. Os top modelos ${categoryName} sempre estão em destaque.`
      },
      {
        question: `As cam ${category} são gratuitas?`,
        answer: `Sim, a maioria das cam ${category} no StripHubs são completamente grátis para assistir. Você pode assistir aos streams ao vivo sem registro. Para recursos premium como chat privado, há opções pagas disponíveis.`
      },
      {
        question: `Quantas cam ${category} estão online?`,
        answer: `Em média há de 50 a 200 cam ${category} online simultaneamente, 24 horas por dia. O número varia de acordo com a hora e o dia da semana.`
      },
      {
        question: `Posso interagir com os modelos ${categoryName}?`,
        answer: `Absolutamente! Você pode conversar grátis com os modelos ${categoryName} no chat público. Para interações mais pessoais, você pode solicitar shows privados ou enviar gorjetas.`
      },
      {
        question: `É seguro assistir cam ${category}?`,
        answer: `Sim, assistir cam ${category} no StripHubs é seguro. Você não precisa fornecer dados pessoais para assistir aos streams grátis. Para transações pagas, o site usa criptografia SSL e métodos de pagamento seguros.`
      },
      {
        question: `Preciso me registrar para assistir cam ${category}?`,
        answer: `Não, não é necessário se registrar para assistir cam ${category} no StripHubs. O registro é grátis e te dá acesso a recursos extras como salvar seus modelos favoritos e receber notificações.`
      },
      {
        question: `Quais idiomas os modelos ${categoryName} falam?`,
        answer: `Os modelos ${categoryName} falam vários idiomas de acordo com sua nacionalidade. Muitos falam inglês além do seu idioma nativo. Você pode filtrar os modelos por idioma.`
      }
    ]
  };

  return faqTemplates[language] || faqTemplates.it;
}

function getCountryFAQs(country: CountrySlug, language: Language): FAQ[] {
  const countryName = country.charAt(0).toUpperCase() + country.slice(1);
  
  return [
    {
      question: `Quali cam ${countryName}e sono online?`,
      answer: `Ci sono sempre decine di modelle ${countryName}e online su StripHubs. Puoi trovare modelle ${countryName}e in tutte le categorie, dalle teen alle milf, 24 ore su 24.`
    },
    {
      question: `Le modelle ${countryName}e parlano italiano?`,
      answer: `Sì, molte modelle ${countryName}e parlano la loro lingua madre. Puoi filtrare le modelle per lingua per trovare quelle che parlano la tua lingua preferita.`
    },
    {
      question: `Quando sono più attive le modelle ${countryName}e?`,
      answer: `Le modelle ${countryName}e sono più attive durante le ore serali nel loro fuso orario. Tuttavia, ce ne sono online a tutte le ore grazie ai diversi stili di vita e orari.`
    },
    {
      question: `Come riconosco le modelle ${countryName}e?`,
      answer: `Puoi riconoscere le modelle ${countryName}e dal flag del paese nel loro profilo, o usando il filtro per paese su StripHubs. Molte indicano anche la loro nazionalità nella bio.`
    }
  ];
}

function getCategoryCountryFAQs(category: CategorySlug, country: CountrySlug, language: Language): FAQ[] {
  const categoryName = category.charAt(0).toUpperCase() + category.slice(1);
  const countryName = country.charAt(0).toUpperCase() + country.slice(1);
  
  return [
    {
      question: `Quante ${category} cam ${countryName}e ci sono online?`,
      answer: `In genere ci sono da 10 a 50 ${category} cam ${countryName}e online contemporaneamente. Il numero varia in base all'orario, ma ne trovi sempre diverse attive.`
    },
    {
      question: `Le ${category} cam ${countryName}e sono gratis?`,
      answer: `Sì, tutte le ${category} cam ${countryName}e su StripHubs sono gratuite da guardare. Puoi accedere alle dirette senza registrazione e senza costi.`
    },
    {
      question: `Come trovare ${category} cam ${countryName}e?`,
      answer: `Usa i filtri su StripHubs: seleziona la categoria ${category} e filtra per paese ${countryName}. Vedrai solo le modelle ${categoryName} ${countryName}e attualmente online.`
    },
    {
      question: `Posso chattare con le modelle ${categoryName} ${countryName}e?`,
      answer: `Certamente! La chat pubblica è gratuita e puoi chattare con tutte le modelle ${categoryName} ${countryName}e. Per chat private, sono disponibili opzioni premium.`
    },
    {
      question: `Quali orari sono migliori per le ${category} cam ${countryName}e?`,
      answer: `Le ${category} cam ${countryName}e sono più attive la sera nel fuso orario ${countryName}. Controlla in diversi momenti della giornata per trovare le tue preferite.`
    },
    {
      question: `Le modelle ${categoryName} ${countryName}e parlano altre lingue?`,
      answer: `Molte modelle ${categoryName} ${countryName}e parlano anche inglese o altre lingue. Controlla la loro bio per vedere quali lingue parlano.`
    }
  ];
}

function getTagFAQs(tag: string, language: Language): FAQ[] {
  const tagName = tag.charAt(0).toUpperCase() + tag.slice(1);
  
  return [
    {
      question: `Cosa significa il tag ${tagName}?`,
      answer: `Il tag ${tagName} identifica modelle con questa caratteristica specifica. Puoi trovare tutte le modelle con il tag ${tagName} usando il filtro tag su StripHubs.`
    },
    {
      question: `Quante modelle con tag ${tagName} ci sono online?`,
      answer: `Il numero di modelle con tag ${tagName} online varia continuamente. In genere ce ne sono sempre diverse attive, specialmente nelle ore di punta.`
    },
    {
      question: `Come cerco modelle con tag ${tagName}?`,
      answer: `Clicca sul tag ${tagName} o usa la funzione di ricerca avanzata su StripHubs per filtrare le modelle per questo tag specifico.`
    },
    {
      question: `Il tag ${tagName} è gratuito?`,
      answer: `Sì, guardare modelle con tag ${tagName} è completamente gratuito su StripHubs. Non ci sono costi per accedere a queste dirette.`
    }
  ];
}

function getGeneralFAQs(language: Language): FAQ[] {
  return [
    {
      question: 'Cos\'è StripHubs?',
      answer: 'StripHubs è una directory gratuita di live cam che ti permette di scoprire e guardare centinaia di modelle in diretta streaming. Trovi cam di ogni categoria, paese e tag, tutte accessibili gratuitamente.'
    },
    {
      question: 'StripHubs è gratuito?',
      answer: 'Sì, StripHubs è completamente gratuito. Puoi guardare tutte le dirette senza pagare e senza registrazione. Per funzioni premium come chat private, sono disponibili opzioni a pagamento.'
    },
    {
      question: 'Devo registrarmi per usare StripHubs?',
      answer: 'No, non è necessario registrarsi. Puoi guardare tutte le cam gratuitamente senza account. La registrazione gratuita ti dà però accesso a funzioni extra come salvare le preferite e ricevere notifiche.'
    },
    {
      question: 'È sicuro usare StripHubs?',
      answer: 'Sì, StripHubs è sicuro. Non raccogliamo dati personali per l\'uso gratuito. Per transazioni a pagamento, usiamo solo piattaforme sicure con crittografia SSL.'
    },
    {
      question: 'Come posso trovare modelle specifiche?',
      answer: 'Puoi usare i filtri per categoria, paese, tag, o la barra di ricerca. Puoi anche ordinare per popolarità, numero di spettatori, o nuove arrivate.'
    },
    {
      question: 'Posso interagire con le modelle?',
      answer: 'Sì! La chat pubblica è gratuita e puoi chattare con tutte le modelle. Per interazioni più personali, puoi richiedere spettacoli privati o inviare mance.'
    },
    {
      question: 'Quante cam ci sono online?',
      answer: 'Ci sono sempre centinaia di cam online 24 ore su 24, 7 giorni su 7. Il numero esatto varia, ma trovi sempre moltissime modelle attive in ogni momento.'
    },
    {
      question: 'In quali lingue è disponibile StripHubs?',
      answer: 'StripHubs è disponibile in 6 lingue: italiano, inglese, tedesco, francese, spagnolo e portoghese. Puoi cambiare lingua in qualsiasi momento dal menu.'
    }
  ];
}
