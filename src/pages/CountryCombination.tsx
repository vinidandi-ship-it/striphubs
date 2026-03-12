import { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import ModelGrid from '../components/ModelGrid';
import { useI18n } from '../i18n';
import { api } from '../lib/api';
import { Model } from '../lib/models';
import { useSEO } from '../lib/seo';

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
  const { language } = useI18n();
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  const countryCode = COUNTRY_CODES[countrySlug.toLowerCase()] || 'IT';
  const countryName = COUNTRY_NAMES[countrySlug.toLowerCase()] || countrySlug;
  const filterType = category ? 'category' : 'tag';
  const filterValue = category || tag || '';
  const apiTag = TAG_MAP[filterValue.toLowerCase()] || filterValue;

  const title = category 
    ? `${countryName} ${category.charAt(0).toUpperCase() + category.slice(1)} Cam Live`
    : `${countryName} ${(tag || '').charAt(0).toUpperCase() + (tag || '').slice(1)} Live`;

  useSEO(
    `${title} - StripHubs`,
    `Guarda le migliori ${countryName.toLowerCase()} ${filterValue} in diretta. Cam live gratis.`,
    `/country/${countrySlug}/${filterType}/${filterValue}`,
    language
  );

  useEffect(() => {
    setLoading(true);
    api.getModels({ 
      country: countryCode, 
      tag: apiTag, 
      limit: 48, 
      offset: 0 
    })
      .then(data => setModels(data.models))
      .finally(() => setLoading(false));
  }, [countryCode, apiTag]);

  const breadcrumbs = useMemo(() => [
    { label: 'Home', to: '/' },
    { label: countryName, to: `/country/${countrySlug}` },
    { label: filterValue.charAt(0).toUpperCase() + filterValue.slice(1) }
  ], [countryName, countrySlug, filterValue]);

  return (
    <div className="space-y-8">
      <Breadcrumbs items={breadcrumbs} />
      
      <header className="space-y-4">
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="text-zinc-400 max-w-2xl">
          {models.length} modelle {countryName.toLowerCase()} {filterValue} online in questo momento.
        </p>
      </header>

      <section>
        <ModelGrid models={models} loading={loading} listName={title} />
      </section>

      <nav className="flex flex-wrap gap-2">
        {Object.keys(TAG_MAP).slice(0, 12).map(t => (
          <Link
            key={t}
            to={`/country/${countrySlug}/tag/${t}`}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              t === filterValue.toLowerCase() 
                ? 'bg-accent-primary text-white' 
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {t}
          </Link>
        ))}
      </nav>
    </div>
  );
}
