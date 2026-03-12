import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { categoryName, categories, CategorySlug } from '../lib/categories';
import { countries, CountrySlug, getCountryName } from '../lib/countries';
import { tags, TagSlug } from '../lib/tags';
import { Model } from '../lib/models';
import { SITE_URL } from '../lib/models';
import { useTranslation } from '../i18n/hooks';

interface RelatedLinksProps {
  currentPath?: string;
  category?: CategorySlug;
  tag?: string;
  country?: CountrySlug;
  models?: Model[];
  maxLinks?: number;
}

interface LinkItem {
  label: string;
  url: string;
  type: 'category' | 'tag' | 'country' | 'combination';
  priority: number;
}

const prioritizeLinks = (items: LinkItem[], currentPath: string, limit: number): LinkItem[] => {
  return items
    .filter(item => !currentPath.includes(item.url))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, limit);
};

export const RelatedLinks: React.FC<RelatedLinksProps> = ({
  currentPath = '',
  category,
  tag,
  country,
  models = [],
  maxLinks = 12
}) => {
  const { t } = useTranslation();
  
  const relatedLinks = useMemo(() => {
    const links: LinkItem[] = [];
    
    if (category) {
      const relatedTags = tags.filter(t => 
        t !== tag && 
        models.some(m => m.tags.includes(t))
      ).slice(0, 4);
      
      relatedTags.forEach(relatedTag => {
        links.push({
          label: `${categoryName(category)} ${relatedTag}`,
          url: `/cam/${category}/${relatedTag}`,
          type: 'combination',
          priority: 80
        });
      });
      
      categories.filter(c => c !== category).slice(0, 3).forEach(cat => {
        links.push({
          label: `${categoryName(cat)} Cam`,
          url: `/cam/${cat}`,
          type: 'category',
          priority: 60
        });
      });
    }
    
    if (tag) {
      const relatedCategories = categories.filter(c =>
        c !== category &&
        models.some(m => m.category === c && m.tags.includes(tag))
      ).slice(0, 3);
      
      relatedCategories.forEach(cat => {
        links.push({
          label: `${categoryName(cat)} ${tag}`,
          url: `/cam/${cat}/${tag}`,
          type: 'combination',
          priority: 85
        });
      });
      
      tags.filter(t => t !== tag).slice(0, 3).forEach(relatedTag => {
        links.push({
          label: `Cam ${relatedTag}`,
          url: `/tag/${relatedTag}`,
          type: 'tag',
          priority: 50
        });
      });
    }
    
    if (country) {
      const countryObj = countries.find(c => c.slug === country);
      if (countryObj) {
        categories.slice(0, 3).forEach(cat => {
          links.push({
            label: `${categoryName(cat)} ${getCountryName(country, t)}`,
            url: `/cam/${cat}`,
            type: 'category',
            priority: 70
          });
        });
      }
      
      countries.filter(c => c.slug !== country).slice(0, 4).forEach(c => {
        links.push({
          label: `Cam ${getCountryName(c.slug, t)}`,
          url: `/country/${c.slug}`,
          type: 'country',
          priority: 55
        });
      });
    }
    
    if (models.length > 0 && !category && !tag && !country) {
      const modelCategories = new Map<string, number>();
      const modelTags = new Map<string, number>();
      const modelCountries = new Map<string, number>();
      
      models.forEach(m => {
        modelCategories.set(m.category, (modelCategories.get(m.category) || 0) + 1);
        m.tags.forEach(t => modelTags.set(t, (modelTags.get(t) || 0) + 1));
        if (m.country) modelCountries.set(m.country, (modelCountries.get(m.country) || 0) + 1);
      });
      
      Array.from(modelCategories.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .forEach(([cat, count]) => {
          links.push({
            label: `${categoryName(cat)} Cam (${count})`,
            url: `/cam/${cat}`,
            type: 'category',
            priority: 90
          });
        });
      
      Array.from(modelTags.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .forEach(([t, count]) => {
          links.push({
            label: `${t} (${count})`,
            url: `/tag/${t}`,
            type: 'tag',
            priority: 75
          });
        });
    }
    
    return prioritizeLinks(links, currentPath, maxLinks);
  }, [category, tag, country, models, currentPath, maxLinks, t]);
  
  if (relatedLinks.length === 0) return null;
  
  return (
    <section className="related-links mt-8 mb-6" aria-label="Link correlati">
      <h2 className="text-lg font-semibold mb-4 text-gray-200">
        {t('relatedLinks.title') || 'See Also'}
      </h2>
      <div className="flex flex-wrap gap-2">
        {relatedLinks.map((link, index) => (
          <Link
            key={`${link.url}-${index}`}
            to={link.url}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${link.type === 'combination' 
                ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-300 hover:from-purple-600/30 hover:to-pink-600/30 border border-purple-500/30'
                : link.type === 'category'
                ? 'bg-blue-600/20 text-blue-300 hover:bg-blue-600/30 border border-blue-500/30'
                : link.type === 'country'
                ? 'bg-green-600/20 text-green-300 hover:bg-green-600/30 border border-green-500/30'
                : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700 border border-gray-600'
              }
              hover:scale-105
            `}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </section>
  );
};

interface TagCloudProps {
  tags: Array<{ name: string; count: number }>;
  maxTags?: number;
  currentTag?: string;
}

export const TagCloud: React.FC<TagCloudProps> = ({ 
  tags: tagData, 
  maxTags = 20,
  currentTag 
}) => {
  const { t } = useTranslation();
  
  const sortedTags = useMemo(() => 
    tagData
      .filter(t => t.name !== currentTag)
      .sort((a, b) => b.count - a.count)
      .slice(0, maxTags),
    [tagData, maxTags, currentTag]
  );
  
  const maxCount = Math.max(...sortedTags.map(t => t.count), 1);
  
  if (sortedTags.length === 0) return null;
  
  return (
    <section className="tag-cloud mt-8 mb-6" aria-label="Tag popolari">
      <h2 className="text-lg font-semibold mb-4 text-gray-200">
        {t('tagCloud.title') || 'Tag Popolari'}
      </h2>
      <div className="flex flex-wrap gap-3 items-center justify-center">
        {sortedTags.map((tag) => {
          const size = 0.8 + (tag.count / maxCount) * 0.6;
          const opacity = 0.6 + (tag.count / maxCount) * 0.4;
          
          return (
            <Link
              key={tag.name}
              to={`/tag/${tag.name}`}
              className="px-3 py-1 rounded-full bg-gray-800/60 hover:bg-gray-700/80 transition-all hover:scale-110"
              style={{ 
                fontSize: `${size}rem`,
                opacity 
              }}
            >
              {tag.name}
              <span className="ml-1 text-xs text-gray-400">({tag.count})</span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

interface CountryCrossLinksProps {
  currentCountry?: CountrySlug;
  maxLinks?: number;
}

export const CountryCrossLinks: React.FC<CountryCrossLinksProps> = ({
  currentCountry,
  maxLinks = 6
}) => {
  const { t } = useTranslation();
  
  const otherCountries = countries
    .filter(c => c.slug !== currentCountry)
    .slice(0, maxLinks);
  
  if (otherCountries.length === 0) return null;
  
  return (
    <section className="country-links mt-8 mb-6" aria-label="Cam per paese">
      <h2 className="text-lg font-semibold mb-4 text-gray-200">
        {t('countryLinks.title') || 'Cam per Nazionalità'}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {otherCountries.map(country => (
          <Link
            key={country.slug}
            to={`/country/${country.slug}`}
            className="flex items-center gap-2 p-3 rounded-lg bg-gray-800/50 hover:bg-gray-700/70 transition-all border border-gray-700/50 hover:border-gray-600"
          >
            <span className="text-2xl">{getCountryFlag(country.code)}</span>
            <span className="text-sm font-medium text-gray-200">
              {getCountryName(country.slug, t)}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

const getCountryFlag = (code: string): string => {
  const flags: Record<string, string> = {
    IT: '🇮🇹', DE: '🇩🇪', FR: '🇫🇷', ES: '🇪🇸', GB: '🇬🇧', US: '🇺🇸',
    UA: '🇺🇦', RU: '🇷🇺', BR: '🇧🇷', CO: '🇨🇴', CA: '🇨🇦', AU: '🇦🇺',
    PL: '🇵🇱', NL: '🇳🇱', SE: '🇸🇪', NO: '🇳🇴', DK: '🇩🇰', FI: '🇫🇮',
    PT: '🇵🇹', GR: '🇬🇷', TR: '🇹🇷', IN: '🇮🇳', CN: '🇨🇳', JP: '🇯🇵',
    KR: '🇰🇷', MX: '🇲🇽', PH: '🇵🇭', TH: '🇹🇭', VN: '🇻🇳'
  };
  return flags[code] || '🌐';
};

interface ModelRelatedModelsProps {
  currentModel: string;
  models: Model[];
  maxModels?: number;
}

export const ModelRelatedModels: React.FC<ModelRelatedModelsProps> = ({
  currentModel,
  models,
  maxModels = 6
}) => {
  const { t } = useTranslation();
  
  if (models.length === 0) return null;
  
  return (
    <section className="related-models mt-8 mb-6" aria-label="Modelle simili">
      <h2 className="text-lg font-semibold mb-4 text-gray-200">
        {t('relatedModels.title') || 'Modelle Simili'}
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {models.slice(0, maxModels).map(model => (
          <Link
            key={model.username}
            to={`/model/${model.username}`}
            className="group"
          >
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-gray-800">
              <img
                src={model.thumbnail}
                alt={model.username}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                loading="lazy"
              />
              {model.isLive && (
                <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-xs font-bold rounded">
                  LIVE
                </span>
              )}
              <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 text-white text-xs rounded">
                👁 {model.viewers}
              </span>
            </div>
            <p className="mt-2 text-sm font-medium text-gray-200 truncate">
              {model.username}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default RelatedLinks;
