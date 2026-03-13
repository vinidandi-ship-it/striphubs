import { useEffect, useRef, useState } from 'react';
import ModelCard from './ModelCard';
import NativeAdSlot from './NativeAdSlot';
import { Model, SITE_URL } from '../lib/models';
import { removeJsonLd, upsertJsonLd } from '../lib/seo';
import { useInfiniteLoad } from '../lib/useInfiniteLoad';
import { isPremiumUser } from '../lib/revenue';
import { getClickStats, trackAffiliateClick } from '../lib/affiliateTracking';
import { getAffiliateUrlWithProvider } from '../lib/affiliateProviders';
import Icon from './Icon';

const INITIAL_RENDER_COUNT = 120;
const RENDER_BATCH_SIZE = 120;
const NATIVE_AD_INTERVAL = 6;
const CTA_INTERVAL = 12;
const MAX_ADS = 5;

function InlineCTA({ index }: { index: number }) {
  const stats = getClickStats();
  
  const handleClick = () => {
    const history = JSON.parse(localStorage.getItem('sh_click_history') || '[]');
    const lastModel = history[history.length - 1];
    
    if (lastModel?.username) {
      const { url, provider } = getAffiliateUrlWithProvider(lastModel.username);
      trackAffiliateClick(lastModel.username, 'inline_cta', {
        category: lastModel.category,
        country: lastModel.country,
        viewers: lastModel.viewers,
        provider
      });
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      trackAffiliateClick('homepage', 'inline_cta', { provider: 'stripchat' });
      window.open('https://go.mavrtracktor.com?userId=d28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881', '_blank', 'noopener,noreferrer');
    }
  };
  
  const messages = [
    { emoji: '🔥', text: 'Più di 10,000 modelle online ora' },
    { emoji: '👀', text: `${stats.todayClicks} utenti hanno cliccato oggi` },
    { emoji: '💎', text: 'Accesso gratuito illimitato' },
    { emoji: '🎭', text: 'Nuove modelle ogni minuto' },
  ];
  
  const message = messages[index % messages.length];
  
  return (
    <div className="col-span-full my-2">
      <div 
        onClick={handleClick}
        className="flex items-center justify-between bg-gradient-to-r from-accent-primary/10 via-accent-primary/20 to-accent-secondary/10 border border-accent-primary/30 rounded-xl px-4 py-3 cursor-pointer hover:border-accent-primary transition-all group"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{message.emoji}</span>
          <div>
            <p className="text-white font-medium text-sm">{message.text}</p>
            <p className="text-xs text-zinc-400">Clicca per continuare</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-accent-primary/20 rounded-lg px-3 py-1.5 group-hover:bg-accent-primary/30 transition-colors">
          <span className="text-sm font-medium text-white">Scopri</span>
          <Icon name="arrowRight" size={14} className="text-white group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
}

interface ModelGridProps {
  models: Model[];
  listName: string;
  loading?: boolean;
  showAds?: boolean;
}

export default function ModelGrid({ models, listName, loading = false, showAds: adsEnabled = true }: ModelGridProps) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_RENDER_COUNT);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    upsertJsonLd('itemlist-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: listName,
      itemListElement: models.slice(0, 20).map((model, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${SITE_URL}/model/${encodeURIComponent(model.username)}`,
        name: model.username
      }))
    });
    return () => removeJsonLd('itemlist-jsonld');
  }, [models, listName]);

  useEffect(() => {
    setVisibleCount((current) => {
      if (models.length <= INITIAL_RENDER_COUNT) return models.length;
      if (models.length < current) return models.length;
      return current;
    });
  }, [models.length]);

  const renderedModels = models.slice(0, visibleCount);
  const canRenderMore = visibleCount < models.length;

  useInfiniteLoad({
    targetRef: sentinelRef,
    enabled: canRenderMore && !loading,
    loading: false, // Questo parametro nell'hook è per il caricamento dati, non per il rendering locale
    onLoadMore: () => {
      setVisibleCount((current) => Math.min(current + RENDER_BATCH_SIZE, models.length));
    }
  });

  if (loading) {
    return (
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-2xl border border-border bg-panel sm:h-96" />
        ))}
      </section>
    );
  }

  if (!models.length) {
    return <div className="rounded-2xl border border-border bg-panel p-6 text-zinc-400">No live models found.</div>;
  }
  
  const showAds = adsEnabled && !isPremiumUser();
  const showInlineCta = adsEnabled && !isPremiumUser();
  
  const gridItems: JSX.Element[] = [];
  let modelIndex = 0;
  let ctaCount = 0;
  let adCount = 0;
  
  renderedModels.forEach((model, index) => {
    gridItems.push(<ModelCard key={model.username} model={model} />);
    modelIndex++;
    
    if (showInlineCta && modelIndex > 0 && modelIndex % CTA_INTERVAL === 0 && ctaCount < 2) {
      gridItems.push(<InlineCTA key={`cta-${modelIndex}`} index={ctaCount++} />);
    }
    
    if (showAds && adCount < MAX_ADS && modelIndex > 0 && modelIndex % NATIVE_AD_INTERVAL === 0) {
      gridItems.push(<NativeAdSlot key={`native-${modelIndex}`} cardIndex={modelIndex} />);
      adCount++;
    }
  });

  return (
    <div className="space-y-4">
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {gridItems}
      </section>
      {canRenderMore ? (
        <div className="space-y-3">
          <div ref={sentinelRef} className="h-6" aria-hidden="true" />
          <p className="text-center text-xs text-zinc-500">
            Rendering {renderedModels.length} di {models.length} modelle caricate
          </p>
        </div>
      ) : null}
    </div>
  );
}
