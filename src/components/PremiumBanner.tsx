import { useEffect, useState } from 'react';
import { shouldShowPremiumAd, recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';

export default function PremiumBanner() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  
  useEffect(() => {
    const checkInterval = setInterval(() => {
      if (shouldShowPremiumAd() && !dismissed) {
        setShow(true);
        recordAdImpression('premium');
      }
    }, 5000);
    
    return () => clearInterval(checkInterval);
  }, [dismissed]);
  
  if (!show || dismissed) return null;
  
  const handleDismiss = () => {
    setDismissed(true);
    setShow(false);
  };
  
  const handleClick = () => {
    recordAdClick('premium');
    window.location.href = '/premium/checkout';
  };
  
  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-[320px] bg-gradient-to-br from-panel to-accent-primary/10 border border-border rounded-xl p-4 shadow-2xl z-40 animate-slide-up">
      <button
        onClick={handleDismiss}
        className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-bg-tertiary text-text-muted hover:text-white flex items-center justify-center text-sm"
        aria-label="Chiudi"
      >
        ✕
      </button>
      
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-gold/20">
          <span className="text-xl">👑</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-white">Rimuovi gli ads</h4>
          <p className="text-xs text-text-secondary mt-0.5">
            VIP a soli €4.99/mese
          </p>
        </div>
      </div>
      
      <button
        onClick={handleClick}
        className="mt-3 w-full rounded-lg bg-accent-gold py-2 text-sm font-semibold text-black hover:bg-accent-gold/90 transition"
      >
        Attiva VIP
      </button>
      
      <p className="mt-2 text-center text-[10px] text-text-muted">
        Prova gratuita 7 giorni
      </p>
    </div>
  );
}
