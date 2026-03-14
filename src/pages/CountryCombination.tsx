import { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ModelGrid from '../components/ModelGrid';
import { AllCrackRevenueBanners, Banner728x90, Banner300x250, Banner728x90Second, NativeAd, MultiformatAd, MultiformatV2, InstantMessage, RecommendationWidget } from '../components/BannerAds';
import { useI18n } from '../i18n';
import { useSEO, upsertJsonLd, removeJsonLd } from '../lib/seo';
import { useModelsByProvider } from '../lib/useModelsByProvider';
import { PAGE_SIZES } from '../lib/constants';

const COUNTRY_NAMES: Record<string, string> = {
  italian: 'Italiane', american: 'Americane', british: 'Britanniche',
  german: 'Tedesche', spanish: 'Spagnole', french: 'Francesi',
  ukrainian: 'Ucraine', russian: 'Russe', brazilian: 'Brasiliane',
  colombian: 'Colombiane', canadian: 'Canadesi', australian: 'Australiane',
  polish: 'Polacche', dutch: 'Olandesi', swedish: 'Svedesi',
  norwegian: 'Norvegesi', danish: 'Danesi', finnish: 'Finlandesi',
  portuguese: 'Portoghesi', greek: 'Greche', turkish: 'Turche',
  indian: 'Indiane', chinese: 'Cinesi', japanese: 'Giapponesi',
  korean: 'Coreane', mexican: 'Messicane', philippine: 'Filippine',
  thai: 'Tailandesi', vietnamese: 'Vietnamite', romanian: 'Rumene',
  czech: 'Ceche', hungarian: 'Ungheresi', austrian: 'Austriache',
  swiss: 'Svizzere', belgian: 'Belghe', argentinian: 'Argentine',
  chilean: 'Cilene', peruvian: 'Peruviane', venezuelan: 'Venezuelane',
  cuban: 'Cubane'
};

const COUNTRY_CODES: Record<string, string> = {
  italian: 'IT', american: 'US', british: 'GB', german: 'DE',
  spanish: 'ES', french: 'FR', ukrainian: 'UA', russian: 'RU',
  brazilian: 'BR', colombian: 'CO', canadian: 'CA', australian: 'AU',
  polish: 'PL', dutch: 'NL', swedish: 'SE', norwegian: 'NO',
  danish: 'DK', finnish: 'FI', portuguese: 'PT', greek: 'GR',
  turkish: 'TR', indian: 'IN', chinese: 'CN', japanese: 'JP',
  korean: 'KR', mexican: 'MX', philippine: 'PH', thai: 'TH',
  vietnamese: 'VN', romanian: 'RO', czech: 'CZ', hungarian: 'HU',
  austrian: 'AT', swiss: 'CH', belgian: 'BE', argentinian: 'AR',
  chilean: 'CL', peruvian: 'PE', venezuelan: 'VE', cuban: 'CU'
};

const TAG_MAP: Record<string, string> = {
  teen: 'teen', milf: 'milf', asian: 'asian', latina: 'latin',
  blonde: 'blondes', brunette: 'brunettes', ebony: 'ebony',
  bbw: 'bbw', couple: 'couples', trans: 'trans', gay: 'gay',
  lesbian: 'lesbian', mature: 'milf', petite: 'petite',
  'big-boobs': 'big-boobs', lingerie: 'lingerie', cosplay: 'cosplay',
  feet: 'feet', squirt: 'squirt', anal: 'anal', bdsm: 'bdsm'
};

export default function CountryCombination() {
  const { countrySlug = 'italian', category, tag } = useParams<{ countrySlug: string; category?: string; tag?: string }>();
  const { language, t } = useI18n();

  const countryCode = COUNTRY_CODES[countrySlug.toLowerCase()] || 'IT';
  const countryName = COUNTRY_NAMES[countrySlug.toLowerCase()] || countrySlug;
  const filterType = category ? 'category' : 'tag';
  const filterValue = category || tag || '';
  const apiTag = TAG_MAP[filterValue.toLowerCase()] || filterValue;

  const providerData = useModelsByProvider({
    country: countryCode,
    tag: apiTag,
    pageSize: PAGE_SIZES.COUNTRY_COMBINATION,
    initialIncludeOffline: false
  });

  const { models, total, loading, error } = providerData;
  
  const allModels = [...models.stripchat, ...models.chaturbate];
  
  const title = category 
    ? `${countryName} ${category.charAt(0).toUpperCase() + category.slice(1)} Cam Live`
    : `${countryName} ${(tag || '').charAt(0).toUpperCase() + (tag || '').slice(1)} Live`;

  useSEO(
    `${title} - StripHubs`,
    `Guarda le migliori ${countryName.toLowerCase()} ${filterValue} in diretta. Cam live gratis.`,
    `/country/${countrySlug}/${filterType}/${filterValue}`,
    language
  );

  // Add structured data
  useEffect(() => {
    if (!allModels.length) return;
    
    const itemListElement = allModels.slice(0, 20).map((model, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      url: `/model/${model.provider || 'stripchat'}/${encodeURIComponent(model.username)}`
    }));
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description: `${countryName.toLowerCase()} ${filterValue} live cam models`,
      itemListElement
    };
    
    upsertJsonLd('country-combination-schema', structuredData);
    
    return () => removeJsonLd('country-combination-schema');
  }, [title, countryName, filterValue, allModels]);

  const breadcrumbs = useMemo(() => [
    { label: t('common.home'), to: '/' },
    { label: countryName, to: `/country/${countrySlug}` },
    { label: filterValue.charAt(0).toUpperCase() + filterValue.slice(1) }
  ], [countryName, countrySlug, filterValue, t]);

  return (
    <div className="space-y-4 md:space-y-8">
      <Breadcrumbs items={breadcrumbs} />
      
      <header className="space-y-4">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="text-zinc-400 max-w-2xl">
          {total.stripchat + total.chaturbate} modelle {countryName.toLowerCase()} {filterValue} online in questo momento.
        </p>
      </header>

      {error.stripchat || error.chaturbate ? <p className="text-sm text-red-400">{error.stripchat || error.chaturbate}</p> : null}

      {/* Banner section */}
      <AllCrackRevenueBanners className="my-4" />
      <MultiformatAd className="my-4" />

      {/* STRIPCHAT MODELS - REAL API */}
      <section>
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
          <span className="text-pink-500">●</span> Stripchat
        </h3>
        <ModelGrid models={models.stripchat} loading={loading.stripchat} listName={`${title} Stripchat`} />
      </section>

      {/* Banner between providers */}
      <AllCrackRevenueBanners className="my-4" />
      
      {/* CHATURBATE MODELS - REAL API */}
      <section>
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-3">
          <span className="text-green-500">●</span> Chaturbate
        </h3>
        <ModelGrid models={models.chaturbate} loading={loading.chaturbate} listName={`${title} Chaturbate`} />
      </section>

      <Banner728x90 className="hidden md:block mx-auto my-2" />
      <Banner300x250 className="md:hidden mx-auto my-2" />
      <Banner728x90Second className="hidden md:block mx-auto my-2" />
      <NativeAd className="my-4" />
      <MultiformatV2 className="my-4" />
      <RecommendationWidget className="my-4" />
      <InstantMessage className="my-4" />

      <nav className="flex flex-wrap gap-2">
        {Object.keys(TAG_MAP).slice(0, 12).map(tg => (
          <Link
            key={tg}
            to={`/country/${countrySlug}/tag/${tg}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              tg === filterValue.toLowerCase() 
                ? 'bg-accent-primary text-white' 
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {tg}
          </Link>
        ))}
      </nav>
    </div>
  );
}
