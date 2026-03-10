import { Link } from 'react-router-dom';
import { CategorySlug, categories, categoryName } from '../lib/categories';
import { CountrySlug, countries } from '../lib/countries';
import { tags } from '../lib/tags';
import { Language } from '../i18n/translations';
import { useI18n } from '../i18n';

type InternalLinksProps = {
  currentCategory?: CategorySlug;
  currentCountry?: CountrySlug;
  currentTag?: string;
  language: Language;
};

export default function InternalLinks({
  currentCategory,
  currentCountry,
  currentTag,
  language
}: InternalLinksProps) {
  const { t } = useI18n();

  const relatedCategories = categories
    .filter((cat) => cat !== currentCategory)
    .slice(0, 6);

  const relatedCountries = countries.slice(0, 6);

  const relatedTags = tags
    .filter((tag) => tag !== currentTag)
    .slice(0, 8);

  const labels = {
    relatedCategories: {
      it: 'Categorie Correlate',
      en: 'Related Categories',
      de: 'Verwandte Kategorien',
      fr: 'Catégories Connexes',
      es: 'Categorías Relacionadas',
      pt: 'Categorias Relacionadas'
    },
    relatedCountries: {
      it: 'Cam per Paese',
      en: 'Cams by Country',
      de: 'Cams nach Land',
      fr: 'Cam par Pays',
      es: 'Cams por País',
      pt: 'Cams por País'
    },
    popularTags: {
      it: 'Tag Popolari',
      en: 'Popular Tags',
      de: 'Beliebte Tags',
      fr: 'Tags Populaires',
      es: 'Tags Populares',
      pt: 'Tags Populares'
    }
  };

  return (
    <aside className="space-y-8">
      {relatedCategories.length > 0 && (
        <div className="rounded-xl border border-border bg-panel p-5">
          <h3 className="mb-4 text-lg font-bold">
            {labels.relatedCategories[language]}
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedCategories.map((cat) => (
              <Link
                key={cat}
                to={`/cam/${cat}`}
                className="rounded-full border border-border bg-bg/50 px-3 py-1.5 text-sm transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
              >
                {categoryName(cat)}
              </Link>
            ))}
          </div>
        </div>
      )}

      {relatedCountries.length > 0 && (
        <div className="rounded-xl border border-border bg-panel p-5">
          <h3 className="mb-4 text-lg font-bold">
            {labels.relatedCountries[language]}
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedCountries.map((country) => (
              <Link
                key={country.slug}
                to={`/country/${country.slug}`}
                className="rounded-full border border-border bg-bg/50 px-3 py-1.5 text-sm transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
              >
                {country.code} {t(`countries.${country.nameKey}`)}
              </Link>
            ))}
          </div>
        </div>
      )}

      {relatedTags.length > 0 && (
        <div className="rounded-xl border border-border bg-panel p-5">
          <h3 className="mb-4 text-lg font-bold">
            {labels.popularTags[language]}
          </h3>
          <div className="flex flex-wrap gap-2">
            {relatedTags.map((tag) => (
              <Link
                key={tag}
                to={`/tag/${tag}`}
                className="rounded-full border border-border bg-bg/50 px-3 py-1.5 text-sm transition-colors hover:border-accent hover:bg-accent/10 hover:text-accent"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}
