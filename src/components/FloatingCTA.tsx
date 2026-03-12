import { useEffect, useState, useCallback } from 'react';
import { trackAffiliateClick, getClickStats } from '../lib/affiliateTracking';
import { getAffiliateUrlWithProvider } from '../lib/affiliateProviders';
import { isPremiumUser } from '../lib/revenue';
import Icon from './Icon';

interface FloatingCTAProps {
  model?: { username: string; viewers: number; thumbnail: string; isLive?: boolean } | null;
}

const STORAGE_KEY = 'sh_floating_cta_dismissed';

export default function FloatingCTA({ model }: FloatingCTAProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);

  useEffect(() => {
    if (isPremiumUser()) return;
    
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) setDismissed(true);
    } catch {}
  }, []);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      setSessionTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (dismissed || isPremiumUser()) return;

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      const scrollY = window.scrollY;

      if (scrollY > 600 && scrollPercent > 30) {
        setVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dismissed]);

  const handleDismiss = useCallback(() => {
    setDismissed(true);
    setVisible(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {}
  }, []);

  const handleClick = useCallback(() => {
    if (model) {
      const { url, provider } = getAffiliateUrlWithProvider(model.username);
      trackAffiliateClick(model.username, 'floating_cta', {
        viewers: model.viewers,
        provider
      });
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      const stats = getClickStats();
      const history = stats.totalClicks > 0 ? JSON.parse(localStorage.getItem('sh_click_history') || '[]') : [];
      const lastModel = history[history.length - 1];
      
      if (lastModel) {
        const { url, provider } = getAffiliateUrlWithProvider(lastModel.username);
        trackAffiliateClick(lastModel.username, 'floating_cta', {
          viewers: lastModel.viewers,
          provider
        });
        window.open(url, '_blank', 'noopener,noreferrer');
      }
    }
  }, [model]);

  if (!visible || dismissed || isPremiumUser()) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stats = getClickStats();

  return (
    <div className="fixed bottom-20 right-4 z-40 hidden lg:block">
      <div className="relative animate-bounce-subtle">
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 w-6 h-6 bg-bg-secondary border border-border rounded-full flex items-center justify-center text-text-muted hover:text-white hover:border-red-500 transition-colors z-10"
          aria-label="Chiudi"
        >
          <Icon name="close" size={12} />
        </button>

        <div
          onClick={handleClick}
          className="group cursor-pointer bg-gradient-to-br from-accent-primary to-accent-secondary rounded-2xl p-4 shadow-lg shadow-accent-primary/20 hover:shadow-accent-primary/40 transition-all hover:scale-105 min-w-[200px]"
        >
          <div className="flex items-center gap-3">
            {model ? (
              <>
                <img
                  src={model.thumbnail}
                  alt={model.username}
                  className="w-12 h-12 rounded-lg object-cover border-2 border-white/20"
                />
                <div className="text-left">
                  <div className="font-bold text-white text-sm truncate max-w-[120px]">
                    {model.username}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-white/80">
                    {model.isLive && (
                      <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
                    )}
                    <span>{model.viewers.toLocaleString()} viewers</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
                  <Icon name="play" size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-white text-sm">Guarda Ora</div>
                  <div className="text-xs text-white/80">
                    Sessione: {formatTime(sessionTime)}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs text-white/70">
              {stats.todayClicks} click oggi
            </span>
            <span className="text-xs font-medium text-white flex items-center gap-1 group-hover:gap-2 transition-all">
              Vai <Icon name="arrowRight" size={12} />
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
