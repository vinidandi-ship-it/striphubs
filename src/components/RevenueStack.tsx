import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function RevenueStack() {
  const { t } = useI18n();
  const [showPremiumUpsell, setShowPremiumUpsell] = useState(false);

  useEffect(() => {
    const handleShowPremiumUpsell = () => setShowPremiumUpsell(true);
    const handleDismissPremiumUpsell = () => setShowPremiumUpsell(false);

    window.addEventListener('showPremiumUpsell', handleShowPremiumUpsell);
    window.addEventListener('dismissPremiumUpsell', handleDismissPremiumUpsell);

    return () => {
      window.removeEventListener('showPremiumUpsell', handleShowPremiumUpsell);
      window.removeEventListener('dismissPremiumUpsell', handleDismissPremiumUpsell);
    };
  }, []);

  const handlePremiumSubscribe = async () => {
    if (window.gtag) {
      window.gtag('event', 'begin_checkout', {
        event_category: 'premium',
        value: 4.99
      });
    }
    window.location.href = '/premium/checkout';
  };

  return (
    <>
      {showPremiumUpsell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-br from-panel to-accent-primary/10 p-6 shadow-2xl">
            <button
              onClick={() => setShowPremiumUpsell(false)}
              className="absolute right-4 top-4 text-text-muted hover:text-white"
              aria-label={t('revenueStack.close')}
            >
              ✕
            </button>

            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-gold/20">
                <span className="text-3xl">👑</span>
              </div>
              <h3 className="text-2xl font-bold text-white">{t('revenueStack.premiumUpsell.title')}</h3>
              <p className="mt-2 text-sm text-text-secondary">
                {t('revenueStack.premiumUpsell.subtitle')}
              </p>
            </div>

            <div className="mb-6 space-y-3">
              {t('revenueStack.premiumUpsell.features', { returnObjects: true }).map((feature: string, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-primary text-xs text-white">✓</span>
                  <span className="text-sm text-text-primary">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mb-6 rounded-lg bg-accent-gold/10 p-4 text-center">
              <div className="text-3xl font-bold text-accent-gold">{t('revenueStack.premiumUpsell.price')}<span className="text-base font-normal text-text-secondary">{t('revenueStack.premiumUpsell.pricePeriod')}</span></div>
              <p className="mt-1 text-xs text-text-muted">{t('revenueStack.premiumUpsell.trial')}</p>
            </div>

            <button
              onClick={handlePremiumSubscribe}
              className="w-full rounded-lg bg-accent-gold py-3 font-semibold text-black transition hover:bg-accent-gold/90"
            >
              {t('revenueStack.premiumUpsell.button')}
            </button>

            <p className="mt-4 text-center text-xs text-text-muted">
              {t('revenueStack.premiumUpsell.cancelAnytime')}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
