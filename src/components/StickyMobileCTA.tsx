import { useEffect, useState } from 'react';
import { Model } from '../lib/models';
import { trackAffiliateClick } from '../lib/affiliateTracking';
import { getAffiliateUrlWithProvider, ProviderId } from '../lib/affiliateProviders';
import { useI18n } from '../i18n';

interface StickyMobileCTAProps {
  model: Model | null;
  visible: boolean;
}

export default function StickyMobileCTA({ model, visible }: StickyMobileCTAProps) {
  const { t } = useI18n();
  const [dismissed, setDismissed] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [rotation, setRotation] = useState<{ url: string; provider: ProviderId }>({ url: '', provider: 'stripchat' });

  useEffect(() => {
    if (model && visible && !dismissed) {
      const rot = getAffiliateUrlWithProvider(model.username);
      setRotation(rot);
    }
  }, [model, visible, dismissed]);

  useEffect(() => {
    if (visible && !dismissed) {
      const timer = setTimeout(() => setAnimate(true), 100);
      return () => clearTimeout(timer);
    }
  }, [visible, dismissed]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300 && !dismissed) {
        setAnimate(true);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  if (!model || dismissed || !visible) return null;

  const handleClick = () => {
    trackAffiliateClick(model.username, 'sticky', {
      category: model.category,
      country: model.country,
      viewers: model.viewers,
      provider: rotation.provider
    });
  };

  const clickUrl = model.clickUrl || rotation.url;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 lg:hidden transition-transform duration-300 ${
        animate ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="bg-gradient-to-t from-black via-black/95 to-black/90 backdrop-blur-lg border-t border-white/10 p-3 safe-area-inset-bottom">
        <div className="flex items-center gap-3">
          <img
            src={model.thumbnail}
            alt={model.username}
            className="w-12 h-12 rounded-full object-cover border-2 border-accent-primary"
          />
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{model.username}</p>
            <p className="text-xs text-zinc-400 flex items-center gap-1">
              {model.isLive && (
                <>
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-red-400 font-medium">LIVE</span>
                  <span className="text-zinc-500">•</span>
                </>
              )}
              <span>{model.viewers.toLocaleString()} viewers</span>
            </p>
          </div>
          <a
            href={clickUrl}
            target="_blank"
            rel="noopener noreferrer sponsored"
            onClick={handleClick}
            className="sh-btn sh-btn-primary px-4 py-2.5 text-sm font-bold flex items-center gap-2 whitespace-nowrap"
          >
            {t('common.watchLive')}
          </a>
          <button
            onClick={() => setDismissed(true)}
            className="text-zinc-500 hover:text-white p-1"
            aria-label="Close"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
