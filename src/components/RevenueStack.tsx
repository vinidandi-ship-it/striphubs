import { useEffect, useState } from 'react';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export default function RevenueStack() {
  const [showEmailPopup, setShowEmailPopup] = useState(false);
  const [showPremiumUpsell, setShowPremiumUpsell] = useState(false);
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [emailMessage, setEmailMessage] = useState('');

  useEffect(() => {
    const handleShowEmailPopup = () => setShowEmailPopup(true);
    const handleDismissEmailPopup = () => setShowEmailPopup(false);
    const handleShowPremiumUpsell = () => setShowPremiumUpsell(true);
    const handleDismissPremiumUpsell = () => setShowPremiumUpsell(false);

    window.addEventListener('showEmailPopup', handleShowEmailPopup);
    window.addEventListener('dismissEmailPopup', handleDismissEmailPopup);
    window.addEventListener('showPremiumUpsell', handleShowPremiumUpsell);
    window.addEventListener('dismissPremiumUpsell', handleDismissPremiumUpsell);

    return () => {
      window.removeEventListener('showEmailPopup', handleShowEmailPopup);
      window.removeEventListener('dismissEmailPopup', handleDismissEmailPopup);
      window.removeEventListener('showPremiumUpsell', handleShowPremiumUpsell);
      window.removeEventListener('dismissPremiumUpsell', handleDismissPremiumUpsell);
    };
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailStatus('loading');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'popup', tags: ['striphubs', 'cam-girls'] })
      });

      if (response.ok) {
        setEmailStatus('success');
        setEmailMessage('Grazie! Riceverai presto le nostre migliori offerte.');
        setTimeout(() => setShowEmailPopup(false), 2000);
      } else {
        throw new Error('Subscription failed');
      }
    } catch {
      setEmailStatus('error');
      setEmailMessage('Errore durante l\'iscrizione. Riprova.');
    }
  };

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
      {showEmailPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-panel p-6 shadow-2xl">
            <button
              onClick={() => setShowEmailPopup(false)}
              className="absolute right-4 top-4 text-text-muted hover:text-white"
              aria-label="Chiudi"
            >
              ✕
            </button>

            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-primary/20">
                <span className="text-3xl">📧</span>
              </div>
              <h3 className="text-xl font-bold text-white">Non perdere le migliori modelle!</h3>
              <p className="mt-2 text-sm text-text-secondary">
                Iscriviti e ricevi aggiornamenti esclusivi sulle top performer della settimana
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="La tua email"
                required
                className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-white placeholder-text-muted focus:border-accent-primary focus:outline-none"
              />
              <button
                type="submit"
                disabled={emailStatus === 'loading'}
                className="w-full rounded-lg bg-accent-primary py-3 font-semibold text-white transition hover:bg-accent-primary/90 disabled:opacity-50"
              >
                {emailStatus === 'loading' ? 'Iscrizione...' : 'Iscriviti Gratis'}
              </button>
            </form>

            {emailMessage && (
              <p className={`mt-4 text-center text-sm ${emailStatus === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {emailMessage}
              </p>
            )}

            <p className="mt-4 text-center text-xs text-text-muted">
              Nessuno spam. Cancella quando vuoi.
            </p>
          </div>
        </div>
      )}

      {showPremiumUpsell && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="relative w-full max-w-lg rounded-2xl bg-gradient-to-br from-panel to-accent-primary/10 p-6 shadow-2xl">
            <button
              onClick={() => setShowPremiumUpsell(false)}
              className="absolute right-4 top-4 text-text-muted hover:text-white"
              aria-label="Chiudi"
            >
              ✕
            </button>

            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-gold/20">
                <span className="text-3xl">👑</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Diventa VIP</h3>
              <p className="mt-2 text-sm text-text-secondary">
                Rimuovi tutte le pubblicità e sblocca funzionalità esclusive
              </p>
            </div>

            <div className="mb-6 space-y-3">
              {[
                'Nessuna pubblicità',
                'Favoriti illimitati',
                'Ricerca avanzata',
                'Modelle esclusive',
                'Thumbnail HD',
                'Supporto prioritario'
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-primary text-xs text-white">✓</span>
                  <span className="text-sm text-text-primary">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mb-6 rounded-lg bg-accent-gold/10 p-4 text-center">
              <div className="text-3xl font-bold text-accent-gold">€4.99<span className="text-base font-normal text-text-secondary">/mese</span></div>
              <p className="mt-1 text-xs text-text-muted">7 giorni prova gratuita</p>
            </div>

            <button
              onClick={handlePremiumSubscribe}
              className="w-full rounded-lg bg-accent-gold py-3 font-semibold text-black transition hover:bg-accent-gold/90"
            >
              Attiva Ora - Prova Gratuita
            </button>

            <p className="mt-4 text-center text-xs text-text-muted">
              Cancella in qualsiasi momento. Nessun vincolo.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
