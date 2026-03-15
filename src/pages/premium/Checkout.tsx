import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createCheckoutSession } from '../../lib/revenue/premium';
import { useI18n } from '../../i18n';
import { 
  Banner728x90, 
  Banner300x250, 
  Banner728x90Second
} from '../../components/BannerAds';
import CrackRevenueBanner from '../../components/CrackRevenueBanner';

export default function PremiumCheckout() {
  const [email, setEmail] = useState('');
  const [plan, setPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await createCheckoutSession(email, plan);
      if (result.success && result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      } else {
        setError(result.error || t('premium.error'));
      }
    } catch (err) {
      setError(t('premium.connectionError'));
    } finally {
      setLoading(false);
    }
  };

  const features = t('premium.features') as unknown as string[];

  return (
    <div className="min-h-screen bg-bg py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('premium.becomeVip')}</h1>
          <p className="text-text-secondary">{t('premium.unlockFeatures')}</p>
        </div>

        <div className="space-y-1 my-2">
          <div className="flex justify-center">
            <Banner728x90 className="hidden md:block" />
            <Banner300x250 className="md:hidden" />
          </div>
          <CrackRevenueBanner />
        </div>

        <div className="bg-panel rounded-2xl border border-border p-6 mb-6">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setPlan('monthly')}
              className={`flex-1 p-4 rounded-xl border-2 transition ${
                plan === 'monthly'
                  ? 'border-accent-gold bg-accent-gold/10'
                  : 'border-border bg-bg'
              }`}
            >
              <div className="text-sm text-text-muted">{t('premium.monthly')}</div>
              <div className="text-xl font-bold text-white">€4.99</div>
            </button>
            <button
              onClick={() => setPlan('yearly')}
              className={`flex-1 p-4 rounded-xl border-2 transition ${
                plan === 'yearly'
                  ? 'border-accent-gold bg-accent-gold/10'
                  : 'border-border bg-bg'
              }`}
            >
              <div className="text-sm text-text-muted">{t('premium.annual')}</div>
              <div className="text-xl font-bold text-white">€49.90</div>
              <div className="text-xs text-green-400">{t('premium.save')}</div>
            </button>
          </div>

          <ul className="space-y-2 mb-6">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-2 text-sm text-text-secondary">
                <span className="text-accent-primary">✓</span> {feature}
              </li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="bg-panel rounded-2xl border border-border p-6">
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-border bg-bg px-4 py-3 text-white placeholder-text-muted focus:border-accent-gold focus:outline-none"
              placeholder={t('premium.emailPlaceholder')}
            />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent-gold py-3 font-semibold text-black hover:bg-accent-gold/90 transition disabled:opacity-50"
          >
            {loading ? t('premium.processing') : `${t('premium.activate')} ${plan === 'monthly' ? t('premium.monthly') : t('premium.annual')}`}
          </button>

          <p className="mt-4 text-center text-xs text-text-muted">
            {t('premium.trial')}
          </p>
        </form>

        <button
          onClick={() => navigate('/')}
          className="mt-6 w-full text-center text-sm text-text-muted hover:text-white transition"
        >
          ← {t('premium.backToHome')}
        </button>

        <div className="space-y-1 my-2">
          <div className="flex justify-center">
            <Banner728x90Second className="hidden md:block" />
            <Banner300x250 className="md:hidden" />
          </div>
          <CrackRevenueBanner />
        </div>
      </div>
    </div>
  );
}
