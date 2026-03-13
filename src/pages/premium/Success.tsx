import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useI18n } from '../../i18n';

export default function PremiumSuccess() {
  const [countdown, setCountdown] = useState(5);
  const navigate = useNavigate();
  const { t } = useI18n();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [navigate]);

  const features = t('premium.features') as unknown as string[];

  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-4">
      <div className="max-w-md text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-4">
            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">{t('premium.welcome')}</h1>
          <p className="text-text-secondary">
            {t('premium.subscriptionActive')}
          </p>
        </div>

        <div className="bg-panel rounded-2xl border border-border p-6 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">{t('premium.featuresTitle')}</h2>
          <ul className="space-y-2 text-left">
            {features.map((feature) => (
              <li key={feature} className="text-sm text-text-secondary">
                ✅ {feature}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-text-muted">
          {t('premium.redirecting', { countdown })}
        </p>
      </div>
    </div>
  );
}
