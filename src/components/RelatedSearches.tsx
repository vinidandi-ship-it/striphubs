import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CategorySlug, categoryName } from '../lib/categories';
import { CountrySlug, getCountryName } from '../lib/countries';
import { tags } from '../lib/tags';
import { useTranslation } from '../i18n/hooks';

interface RelatedSearchItem {
  query: string;
  url: string;
}

interface RelatedSearchesProps {
  items: RelatedSearchItem[];
  title?: string;
  maxItems?: number;
}

export const RelatedSearches: React.FC<RelatedSearchesProps> = ({
  items,
  title,
  maxItems = 8
}) => {
  const { t } = useTranslation();
  
  const displayItems = useMemo(() => 
    items.slice(0, maxItems),
    [items, maxItems]
  );
  
  if (displayItems.length === 0) return null;
  
  return (
    <section className="related-searches mt-8 mb-6" aria-label="Ricerche correlate">
      <h2 className="text-lg font-semibold mb-4 text-gray-200">
        {title || t('relatedSearches.title') || 'Ricerche Correlate'}
      </h2>
      <div className="flex flex-wrap gap-2">
        {displayItems.map((item, index) => (
          <Link
            key={`${item.url}-${index}`}
            to={item.url}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-800/60 hover:bg-gray-700/80 text-sm text-gray-300 hover:text-white transition-all border border-gray-700/50 hover:border-gray-600"
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            {item.query}
          </Link>
        ))}
      </div>
    </section>
  );
};

interface AutoRelatedSearchesProps {
  category?: CategorySlug;
  tag?: string;
  country?: CountrySlug;
  modelUsername?: string;
  maxItems?: number;
}

export const AutoRelatedSearches: React.FC<AutoRelatedSearchesProps> = ({
  category,
  tag,
  country,
  modelUsername,
  maxItems = 8
}) => {
  const { t } = useTranslation();
  
  const items = useMemo(() => {
    const searches: RelatedSearchItem[] = [];
    
    if (modelUsername) {
      searches.push({ query: `${modelUsername} live`, url: `/model/${modelUsername}` });
      searches.push({ query: `${modelUsername} cam`, url: `/model/${modelUsername}` });
      if (category) {
        searches.push({ query: `${categoryName(category)} cam`, url: `/cam/${category}` });
      }
    }
    
    if (category) {
      const catName = categoryName(category);
      searches.push({ query: `${catName} cam live`, url: `/cam/${category}` });
      searches.push({ query: `${catName} cam gratis`, url: `/cam/${category}` });
      
      const relatedTags = tags.filter(t => t !== tag).slice(0, 2);
      relatedTags.forEach(relatedTag => {
        searches.push({ 
          query: `${catName} ${relatedTag}`, 
          url: `/cam/${category}/${relatedTag}` 
        });
      });
      
      if (tag) {
        searches.push({ query: `${catName} ${tag}`, url: `/cam/${category}/${tag}` });
      }
    }
    
    if (tag) {
      const tagName = tag.charAt(0).toUpperCase() + tag.slice(1);
      searches.push({ query: `${tagName} cam`, url: `/tag/${tag}` });
      searches.push({ query: `${tagName} live`, url: `/tag/${tag}` });
      
      if (category) {
        searches.push({ query: `${categoryName(category)} ${tag}`, url: `/cam/${category}/${tag}` });
      }
    }
    
    if (country) {
      const countryName = getCountryName(country, t);
      searches.push({ query: `Cam ${countryName}`, url: `/country/${country}` });
      searches.push({ query: `${countryName} live cam`, url: `/country/${country}` });
    }
    
    return searches;
  }, [category, tag, country, modelUsername, t]);
  
  const uniqueItems = useMemo(() => {
    const seen = new Set<string>();
    return items.filter(item => {
      if (seen.has(item.url)) return false;
      seen.add(item.url);
      return true;
    });
  }, [items]);
  
  return <RelatedSearches items={uniqueItems} maxItems={maxItems} />;
};

interface SEOTextBlockProps {
  text: string;
  className?: string;
}

export const SEOTextBlock: React.FC<SEOTextBlockProps> = ({ text, className = '' }) => {
  if (!text) return null;
  
  return (
    <div className={`seo-text mt-8 mb-6 p-4 rounded-lg bg-gray-800/30 border border-gray-700/50 ${className}`}>
      <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
    </div>
  );
};

interface ProgrammaticSEOSectionProps {
  h1?: string;
  intro?: string;
  longTailText?: string;
  relatedSearches?: RelatedSearchItem[];
  showH1?: boolean;
}

export const ProgrammaticSEOSection: React.FC<ProgrammaticSEOSectionProps> = ({
  h1,
  intro,
  longTailText,
  relatedSearches,
  showH1 = false
}) => {
  return (
    <section className="programmatic-seo mt-8 space-y-6">
      {showH1 && h1 && (
        <h1 className="text-2xl font-bold text-white">{h1}</h1>
      )}
      {intro && (
        <p className="text-gray-300 leading-relaxed">{intro}</p>
      )}
      {relatedSearches && relatedSearches.length > 0 && (
        <RelatedSearches items={relatedSearches} />
      )}
      {longTailText && (
        <SEOTextBlock text={longTailText} />
      )}
    </section>
  );
};

export default RelatedSearches;
