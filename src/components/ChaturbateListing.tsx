import { useI18n } from '../i18n';
import { trackAffiliateClick } from '../lib/affiliateTracking';

interface ChaturbateListingProps {
  gender?: 'f' | 'm' | 't' | 'c' | 'x';
  count?: number;
  page?: number;
  height?: string;
  offerType?: 'crackrevenue' | 'chaturbate';
}

export default function ChaturbateListing({ 
  gender = 'x', 
  count = 15, 
  page = 1,
  height = '600px',
  offerType = 'chaturbate'
}: ChaturbateListingProps) {
  const { language } = useI18n();
  
  const crackrevenueUrl = `https://t.vlmai-3.com/407726/7477?aff_sub5=SF_006OG000004lmDN`;
  const chaturbateSrc = `https://chaturbate.com/in/?tour=x1Rd&campaign=fxmnz&track=default&c=${count}&p=${page}&gender=${gender}`;
  
  const track = (label: string, provider: string = 'chaturbate') => {
    trackAffiliateClick(label, 'inline_cta', { provider });
  };
  
  return (
    <div className="w-full rounded-2xl overflow-hidden border border-border bg-panel">
      <div className="flex items-center justify-between p-3 border-b border-border bg-bg-secondary">
        <div className="flex items-center gap-2">
          <span className="text-orange-500 font-bold">
            {offerType === 'crackrevenue' ? 'CrackRevenue' : 'Chaturbate'}
          </span>
          <span className="text-xs text-text-muted">Live Cams</span>
        </div>
        <div className="flex gap-1">
          {offerType !== 'crackrevenue' && (
            <>
              <a 
                href={`https://chaturbate.com/in/?tour=x1Rd&campaign=fxmnz&track=default&gender=f`}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="px-2 py-1 text-xs rounded bg-pink-500/20 text-pink-400 hover:bg-pink-500/30"
                onClick={() => track('chaturbate-gender-f')}
              >
                F
              </a>
              <a 
                href={`https://chaturbate.com/in/?tour=x1Rd&campaign=fxmnz&track=default&gender=m`}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="px-2 py-1 text-xs rounded bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                onClick={() => track('chaturbate-gender-m')}
              >
                M
              </a>
              <a 
                href={`https://chaturbate.com/in/?tour=x1Rd&campaign=fxmnz&track=default&gender=c`}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="px-2 py-1 text-xs rounded bg-purple-500/20 text-purple-400 hover:bg-purple-500/30"
                onClick={() => track('chaturbate-gender-c')}
              >
                Couples
              </a>
            </>
          )}
        </div>
      </div>
      {offerType === 'crackrevenue' ? (
        <a href={crackrevenueUrl} target="_blank" rel="noopener noreferrer sponsored" className="block">
          <img 
            src="https://t.vlmai-3.com/407726/7477" 
            alt="CrackRevenue Banner" 
            className="w-full h-auto"
            onClick={() => track('crackrevenue-banner', 'crackrevenue')}
          />
        </a>
      ) : (
        <iframe 
          src={chaturbateSrc}
          className="w-full"
          style={{ height, minHeight: '400px' }}
          frameBorder="0"
          scrolling="no"
          allowFullScreen
          title="Chaturbate Live Cams"
        />
      )}
    </div>
  );
}

export function ChaturbateInlineBanner({ offerType = 'chaturbate' }: { offerType?: 'chaturbate' | 'crackrevenue' } = {}) {
  const crackrevenueUrl = `https://t.vlmai-3.com/407726/7477?aff_sub5=SF_006OG000004lmDN`;
  
  if (offerType === 'crackrevenue') {
    return (
      <a 
        href={crackrevenueUrl}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block w-full p-4 rounded-xl bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 transition-all"
        onClick={() => trackAffiliateClick('crackrevenue-inline-banner', 'inline_cta', { provider: 'crackrevenue' })}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-bold text-white text-lg">CrackRevenue</div>
            <div className="text-white/80 text-sm">Offerte esclusive cam live</div>
          </div>
          <div className="px-4 py-2 bg-white/20 rounded-lg text-white font-semibold">
            Offerte Esclusive
          </div>
        </div>
      </a>
    );
  }
  
  return (
    <a 
      href="https://chaturbate.com/in/?tour=x1Rd&campaign=fxmnz&track=default"
      target="_blank"
      rel="noopener noreferrer sponsored"
      className="block w-full p-4 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 transition-all"
      onClick={() => trackAffiliateClick('chaturbate-inline-banner', 'inline_cta', { provider: 'chaturbate' })}
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="font-bold text-white text-lg">Chaturbate Live</div>
          <div className="text-white/80 text-sm">Migliaia di cam gratis online ora</div>
        </div>
        <div className="px-4 py-2 bg-white/20 rounded-lg text-white font-semibold">
          Entra Gratis
        </div>
      </div>
    </a>
  );
}
