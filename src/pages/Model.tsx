import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import InternalLinks from '../components/InternalLinks';
import ModelGrid from '../components/ModelGrid';
import { 
  Banner728x90, 
  Banner300x250, 
  Banner728x90Second
} from '../components/BannerAds';
import CrackRevenueBanner from '../components/CrackRevenueBanner';
import { useI18n } from '../i18n';
import { api } from '../lib/api';
import { Model as LiveModel, AFFILIATE_ID } from '../lib/models';
import { generateModelMeta } from '../lib/metaTags';
import { useSEO, upsertJsonLd, removeJsonLd } from '../lib/seo';
import { trackAffiliateClick, getAffiliateUrl } from '../lib/affiliateTracking';
import { getAffiliateUrlWithProvider } from '../lib/affiliateProviders';

export default function ModelPage() {
  const { username = '' } = useParams();
  const { language, t } = useI18n();
  const decodedName = decodeURIComponent(username);

  const [model, setModel] = useState<LiveModel | null>(null);
  const [related, setRelated] = useState<LiveModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const meta = generateModelMeta(decodedName, language);
  useSEO(meta.title, meta.description, `/model/${encodeURIComponent(decodedName)}`, language);

  useEffect(() => {
    setLoading(true);
    setError('');
    setModel(null);
    
    const loadModel = async () => {
      try {
        // Search by username using search parameter
        const data = await api.getModels({ search: decodedName, limit: 1 });
        
        if (data.models && data.models.length > 0) {
          const apiModel = data.models[0];
          
          // Map API response to our Model type - check all possible image fields
          const thumbnail = 
            apiModel.snapshotUrl || 
            apiModel.previewUrl || 
            apiModel.avatarUrl || 
            apiModel.widgetPreviewUrl ||
            apiModel.popularSnapshotUrl ||
            '';
          
          const { url: affiliateUrl, provider: affiliateProvider } = getAffiliateUrlWithProvider(apiModel.username);
          
          const mappedModel: LiveModel = {
            username: apiModel.username,
            thumbnail: thumbnail,
            viewers: apiModel.viewersCount || apiModel.viewers || 0,
            tags: apiModel.defaultTags || apiModel.tags || [],
            country: apiModel.modelsCountry || apiModel.country || '',
            category: apiModel.gender || apiModel.broadcastGender || 'female',
            isLive: apiModel.strict !== false,
            clickUrl: affiliateUrl,
            provider: affiliateProvider
          };
          setModel(mappedModel);
          
          // Get related models in background (don't block)
          setTimeout(() => {
            api.getModels({ limit: 9 })
              .then(relatedData => {
                setRelated(relatedData.models.filter((m) => m.username !== apiModel.username).slice(0, 8));
              })
              .catch(() => {});
          }, 100);
          
          window.dispatchEvent(new CustomEvent('modelView', { detail: mappedModel }));
        } else {
          setError(t('model.notFound'));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load model profile');
      } finally {
        setLoading(false);
      }
    };
    
    loadModel();
  }, [decodedName, t]);

  // Add structured data for model profile
  useEffect(() => {
    if (!model) return;
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: model.username,
      image: model.thumbnail,
      url: `/model/${encodeURIComponent(model.username)}`,
      jobTitle: 'Live Cam Model',
      additionalName: model.username,
      description: `${model.category} live cam model on StripHubs`,
      knowsAbout: model.tags,
      address: {
        '@type': 'Country',
        name: model.country
      },
      interactionStatistic: {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/WatchAction',
        userInteractionCount: model.viewers
      }
    };
    
    upsertJsonLd('model-schema', structuredData);
    
    return () => removeJsonLd('model-schema');
  }, [model]);

  const breadcrumbs = useMemo(() => [
    { label: t('common.home'), to: '/' },
    { label: t('common.live'), to: '/live' },
    { label: decodedName }
  ], [decodedName, t]);

  if (error) return <div className="rounded-2xl border border-border bg-panel p-6 text-red-400">{error}</div>;
  if (!model) return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
    </div>
  );

  return (
    <div className="space-y-8">
      <Breadcrumbs items={breadcrumbs} />

      <section className="grid gap-6 rounded-2xl border border-border bg-panel p-5 md:grid-cols-[360px_1fr]">
        <div className="h-[440px] w-full rounded-xl bg-zinc-800 overflow-hidden relative">
          <div className="absolute inset-0 animate-pulse bg-zinc-700"></div>
          <img 
            src={model.thumbnail} 
            alt={`${model.username} profile`} 
            className="h-full w-full object-cover relative z-10" 
            loading="lazy"
            onLoad={(e) => e.currentTarget.previousElementSibling?.remove()}
            onError={(e) => {
              e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 440"%3E%3Crect fill="%23222" width="360" height="440"/%3E%3Ctext fill="%23666" x="50%25" y="50%25" text-anchor="middle"%3ENo Image%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">{model.username}</h1>
          <p className="mt-2 text-zinc-300">{model.viewers.toLocaleString()} {t('model.watchingNow')}</p>
          <p className="mt-2 text-sm text-zinc-400">{t('model.country')}: {model.country}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {model.tags.map((tag) => <span key={tag} className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-200">#{tag}</span>)}
          </div>
          <a
            href={model.clickUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="mt-6 inline-block rounded-full bg-accent px-6 py-3 font-semibold text-white"
            onClick={() => trackAffiliateClick(model.username, 'profile', {
              category: model.category,
              country: model.country,
              viewers: model.viewers,
              provider: model.provider
            })}
          >
            {t('cta.watchLive')}
          </a>
        </div>
      </section>

      <div className="space-y-1 my-2">
        <div className="flex justify-center">
          <Banner728x90 className="hidden md:block" />
          <Banner300x250 className="md:hidden" />
        </div>
        <CrackRevenueBanner />
      </div>

      <section>
        <h2 className="mb-4 text-2xl font-bold text-white">{t('model.relatedModels')}</h2>
        <ModelGrid models={related} loading={loading} listName={t('model.relatedModels')} />
      </section>

      <div className="space-y-1 my-2">
        <div className="flex justify-center">
          <Banner728x90Second className="hidden md:block" />
          <Banner300x250 className="md:hidden" />
        </div>
        <CrackRevenueBanner />
      </div>
      
      <InternalLinks language={language} />
    </div>
  );
}
