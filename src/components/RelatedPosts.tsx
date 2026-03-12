import { Link } from 'react-router-dom';
import { BlogPost, getRelatedPosts } from '../lib/blogContent';
import { Language } from '../i18n/translations';

type SupportedLocale = 'it' | 'en' | 'de' | 'fr' | 'es' | 'pt';

type RelatedPostsProps = {
  posts: BlogPost[];
  language: Language;
};

export default function RelatedPosts({ posts, language }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  const titles: Record<SupportedLocale, string> = {
    it: 'Articoli Correlati',
    en: 'Related Articles',
    de: 'Verwandte Artikel',
    fr: 'Articles Connexes',
    es: 'Artículos Relacionados',
    pt: 'Artigos Relacionados'
  };

  return (
    <section className="rounded-2xl border border-border bg-panel p-6">
      <h2 className="mb-6 text-2xl font-bold">{titles[language]}</h2>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group rounded-lg border border-border bg-bg/50 p-4 transition-all hover:border-accent hover:bg-accent/5"
          >
            <div className="mb-2 text-xs font-medium uppercase tracking-wide text-accent">
              {getPostTypeLabel(post.type, language)}
            </div>
            <h3 className="font-semibold text-zinc-100 group-hover:text-accent">
              {post.title[language]}
            </h3>
            <p className="mt-2 text-sm text-zinc-400 line-clamp-2">
              {post.description[language]}
            </p>
            {post.category && (
              <div className="mt-3 text-xs text-zinc-500">
                {post.category}
                {post.category2 && ` vs ${post.category2}`}
              </div>
            )}
          </Link>
        ))}
      </div>
    </section>
  );
}

function getPostTypeLabel(type: string, language: Language): string {
  const labels: Record<string, Record<Language, string>> = {
    'best-category-cams': {
      it: 'Migliori Cam',
      en: 'Best Cams',
      de: 'Beste Cams',
      fr: 'Meilleures Cam',
      es: 'Mejores Cams',
      pt: 'Melhores Cams'
    },
    'category-vs-category': {
      it: 'Confronto',
      en: 'Comparison',
      de: 'Vergleich',
      fr: 'Comparaison',
      es: 'Comparación',
      pt: 'Comparação'
    },
    'top-category-by-country': {
      it: 'Top per Paese',
      en: 'Top by Country',
      de: 'Top nach Land',
      fr: 'Top par Pays',
      es: 'Top por País',
      pt: 'Top por País'
    },
    'how-to': {
      it: 'Guida',
      en: 'Guide',
      de: 'Anleitung',
      fr: 'Guide',
      es: 'Guía',
      pt: 'Guia'
    },
    'complete-guide': {
      it: 'Guida Completa',
      en: 'Complete Guide',
      de: 'Vollständiger Leitfaden',
      fr: 'Guide Complet',
      es: 'Guía Completa',
      pt: 'Guia Completo'
    },
    'statistics': {
      it: 'Statistiche',
      en: 'Statistics',
      de: 'Statistiken',
      fr: 'Statistiques',
      es: 'Estadísticas',
      pt: 'Estatísticas'
    },
    'review': {
      it: 'Recensione',
      en: 'Review',
      de: 'Bewertung',
      fr: 'Avis',
      es: 'Reseña',
      pt: 'Análise'
    },
    'tutorial': {
      it: 'Tutorial',
      en: 'Tutorial',
      de: 'Tutorial',
      fr: 'Tutoriel',
      es: 'Tutorial',
      pt: 'Tutorial'
    },
    'security': {
      it: 'Sicurezza',
      en: 'Security',
      de: 'Sicherheit',
      fr: 'Sécurité',
      es: 'Seguridad',
      pt: 'Segurança'
    },
    'trends': {
      it: 'Trend',
      en: 'Trends',
      de: 'Trends',
      fr: 'Tendances',
      es: 'Tendencias',
      pt: 'Tendências'
    }
  };

  return labels[type]?.[language] || type;
}
