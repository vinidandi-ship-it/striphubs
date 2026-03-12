import { useEffect, useState, useCallback } from 'react';
import { trackAffiliateClick } from '../lib/affiliateTracking';
import { getAffiliateUrlWithProvider } from '../lib/affiliateProviders';
import { getClickStats } from '../lib/affiliateTracking';
import { isPremiumUser } from '../lib/revenue';
import { useI18n } from '../i18n';
import Icon from './Icon';

interface ExitIntentProps {
  topModel?: { username: string; viewers: number; thumbnail: string } | null;
}

const STORAGE_KEY = 'sh_exit_intent_shown';

export default function ExitIntent({ topModel }: ExitIntentProps) {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [urgencyData, setUrgencyData] = useState({
    onlineModels: 0,
    topViewers: 0,
    avgSession: 0
  });

  const canShow = useCallback(() => {
    if (isPremiumUser()) return false;
    
    try {
      const shown = sessionStorage.getItem(STORAGE_KEY);
      if (shown) return false;
      
      const stats = getClickStats();
      if (stats.todayClicks >= 3) return false;
      
      return true;
    } catch {
      return true;
    }
  }, []);

  useEffect(() => {
    if (!canShow()) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem(STORAGE_KEY)) {
        const stats = getClickStats();
        setUrgencyData({
          onlineModels: Math.floor(Math.random() * 500) + 8000,
          topViewers: topModel?.viewers || Math.floor(Math.random() * 1000) + 500,
          avgSession: Math.floor(Math.random() * 45) + 15
        });
        
        sessionStorage.setItem(STORAGE_KEY, '1');
        setVisible(true);
        setTimeout(() => setAnimate(true), 50);
        
        if (window.gtag) {
          window.gtag('event', 'exit_intent_shown', {
            event_category: 'conversion',
            clicks_before_exit: stats.totalClicks
          });
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [canShow, topModel]);

  const handleClose = () => {
    setAnimate(false);
    setTimeout(() => setVisible(false), 300);
  };

  const handleCta = () => {
    if (topModel) {
      const { url, provider } = getAffiliateUrlWithProvider(topModel.username);
      trackAffiliateClick(topModel.username, 'exit_intent', {
        viewers: topModel.viewers,
        provider
      });
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    handleClose();
  };

  if (!visible) return null;

  const stats = getClickStats();

  return (
    <div
      className={`fixed inset-0 z-[90] flex items-center justify-center p-4 transition-all duration-300 ${
        animate ? 'bg-black/80 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={handleClose}
    >
      <div
        className={`relative max-w-md w-full bg-gradient-to-br from-panel to-bg-secondary border border-border rounded-2xl p-6 shadow-2xl transition-all duration-300 ${
          animate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-text-muted hover:text-white transition-colors p-1"
          aria-label="Close"
        >
          <Icon name="close" size={20} />
        </button>

        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-400 px-3 py-1.5 rounded-full text-sm font-medium">
            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            {t('exitIntent.title')}
          </div>

          <h2 className="text-2xl font-bold text-white">
            {topModel ? (
              <>
                <span className="text-accent-primary">{topModel.username}</span> {t('exitIntent.onlineNow')}
              </>
            ) : (
              <>
                <span className="text-accent-primary">{urgencyData.onlineModels.toLocaleString()}</span> {t('exitIntent.modelsOnline')}
              </>
            )}
          </h2>

          <div className="grid grid-cols-3 gap-3 py-4">
            <div className="bg-bg/50 rounded-xl p-3">
              <div className="text-2xl font-bold text-accent-primary">{urgencyData.topViewers.toLocaleString()}</div>
              <div className="text-xs text-text-muted">{t('exitIntent.viewersNow')}</div>
            </div>
            <div className="bg-bg/50 rounded-xl p-3">
              <div className="text-2xl font-bold text-green-400">{urgencyData.avgSession}{t('exitIntent.avgSession')}</div>
              <div className="text-xs text-text-muted">&nbsp;</div>
            </div>
            <div className="bg-bg/50 rounded-xl p-3">
              <div className="text-2xl font-bold text-yellow-400">{stats.todayClicks}</div>
              <div className="text-xs text-text-muted">{t('exitIntent.clicksToday')}</div>
            </div>
          </div>

          {topModel && (
            <div className="flex items-center gap-3 bg-bg/30 rounded-xl p-3">
              <img
                src={topModel.thumbnail}
                alt={topModel.username}
                className="w-14 h-14 rounded-lg object-cover"
              />
              <div className="text-left flex-1">
                <div className="font-semibold text-white">{topModel.username}</div>
                <div className="text-sm text-text-muted flex items-center gap-2">
                  <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  {topModel.viewers.toLocaleString()} {t('common.viewers')}
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleCta}
            className="w-full sh-btn sh-btn-primary text-lg font-bold py-4 flex items-center justify-center gap-2"
          >
            <Icon name="play" size={20} />
            {t('exitIntent.watchFree')}
          </button>

          <p className="text-xs text-text-muted">
            {t('exitIntent.noRegistration')}
          </p>
        </div>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
