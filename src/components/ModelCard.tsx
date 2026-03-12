import { Link } from 'react-router-dom';
import { Model } from '../lib/models';
import { trackAffiliateClick } from '../lib/affiliateTracking';
import { getAffiliateUrlWithProvider } from '../lib/affiliateProviders';
import Icon from './Icon';

const COUNTRY_FLAGS: Record<string, string> = {
  IT: '🇮🇹',
  US: '🇺🇸',
  GB: '🇬🇧',
  DE: '🇩🇪',
  FR: '🇫🇷',
  ES: '🇪🇸',
  PT: '🇵🇹',
  RU: '🇷🇺',
  UA: '🇺🇦',
  BR: '🇧🇷',
  CO: '🇨🇴',
  CA: '🇨🇦',
  AU: '🇦🇺',
  PL: '🇵🇱',
  NL: '🇳🇱',
  SE: '🇸🇪',
  NO: '🇳🇴',
  DK: '🇩🇰',
  FI: '🇫🇮',
  GR: '🇬🇷',
  TR: '🇹🇷',
  IN: '🇮🇳',
  CN: '🇨🇳',
  JP: '🇯🇵',
  KR: '🇰🇷',
  MX: '🇲🇽',
  PH: '🇵🇭',
  TH: '🇹🇭',
  VN: '🇻🇳'
};

const getCountryFlag = (code: string): string => {
  return COUNTRY_FLAGS[code.toUpperCase()] || '';
};

const getOnlineMinutes = (username: string): number => {
  const key = `sh_online_${username}`;
  try {
    const stored = sessionStorage.getItem(key);
    if (stored) {
      const start = parseInt(stored, 10);
      return Math.floor((Date.now() - start) / 60000);
    }
    sessionStorage.setItem(key, Date.now().toString());
    return 0;
  } catch {
    return Math.floor(Math.random() * 60) + 5;
  }
};

const getViewersTrend = (viewers: number, username: string): 'rising' | 'stable' | 'falling' => {
  const key = `sh_trend_${username}`;
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const prev = parseInt(stored, 10);
      localStorage.setItem(key, viewers.toString());
      if (viewers > prev * 1.1) return 'rising';
      if (viewers < prev * 0.9) return 'falling';
      return 'stable';
    }
    localStorage.setItem(key, viewers.toString());
    return 'stable';
  } catch {
    return viewers > 300 ? 'rising' : viewers > 100 ? 'stable' : 'falling';
  }
};

export default function ModelCard({ model }: { model: Model }) {
  const countryFlag = getCountryFlag(model.country);
  const { url: rotatedUrl, provider } = getAffiliateUrlWithProvider(model.username);
  const clickUrl = model.clickUrl || rotatedUrl;
  
  const onlineMinutes = model.isLive ? getOnlineMinutes(model.username) : 0;
  const viewersTrend = model.isLive ? getViewersTrend(model.viewers, model.username) : 'stable';
  const isHot = model.viewers > 500 && viewersTrend === 'rising';
  const isUrgent = model.isLive && (onlineMinutes < 10 || isHot);
  
  return (
    <article className="content-visibility-card group relative overflow-hidden sh-card transition-all hover:-translate-y-1">
      <Link to={`/model/${encodeURIComponent(model.username)}`} className="block focus:outline-none focus:ring-2 focus:ring-accent-primary" aria-label={`Open ${model.username} profile`}>
        <div className="relative">
          <div className="aspect-[3/4] w-full overflow-hidden rounded-t-2xl">
            <img
              src={model.thumbnail}
              alt={`${model.username} live preview`}
              loading="lazy"
              decoding="async"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span
            className={`absolute left-2 top-2 flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold sm:left-3 sm:top-3 sm:text-[11px] sh-badge ${
              model.isLive ? 'sh-badge-live' : 'bg-bg-tertiary text-text-secondary'
            }`}
          >
            {model.isLive ? <Icon name="live" size={10} /> : null}
            {model.isLive ? 'LIVE' : 'OFFLINE'}
          </span>
          {countryFlag && (
            <span
              className="absolute right-2 top-2 flex items-center justify-center rounded-full bg-black/60 px-1.5 py-0.5 text-sm backdrop-blur-sm sm:right-3 sm:top-3 sm:text-base"
              title={model.country}
            >
              {countryFlag}
            </span>
          )}
          <div className="absolute bottom-2 left-2 right-2 transition-opacity group-hover:opacity-100 sm:bottom-3 sm:left-3 sm:right-3 sm:opacity-0">
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full bg-black/50 px-2 py-1 text-[10px] text-white sm:text-xs flex items-center gap-1">
                <Icon name="eye" size={10} />
                {model.viewers.toLocaleString()}
              </span>
              {model.isLive && (
                <span className={`rounded-full px-2 py-1 text-[10px] font-medium flex items-center gap-1 ${
                  viewersTrend === 'rising' ? 'bg-green-500/30 text-green-400' :
                  viewersTrend === 'falling' ? 'bg-red-500/30 text-red-400' :
                  'bg-white/20 text-white'
                }`}>
                  {viewersTrend === 'rising' && '↑'}
                  {viewersTrend === 'falling' && '↓'}
                  {onlineMinutes}min
                </span>
              )}
            </div>
          </div>
          {isHot && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="animate-ping absolute inline-flex h-12 w-12 rounded-full bg-red-500/30 opacity-75"></div>
            </div>
          )}
        </div>
      </Link>
      <div className="space-y-2 p-3 sm:space-y-3 sm:p-4">
        <div className="flex items-start justify-between gap-2 sm:gap-3">
          <h3 className="truncate text-sm font-semibold text-white transition-colors group-hover:text-accent-primary sm:text-base">
            {countryFlag && <span className="mr-1">{countryFlag}</span>}
            {model.username}
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-[11px] text-text-secondary sm:text-xs">
            <Icon name="eye" size={12} />
            {model.viewers.toLocaleString()}
          </span>
        </div>
        {model.country && model.country !== 'N/A' && (
          <p className="flex items-center gap-1 text-[11px] text-text-muted sm:text-xs">
            {countryFlag ? <span>{countryFlag}</span> : <Icon name="search" size={12} />} {model.country}
          </p>
        )}
        <div className="flex flex-wrap gap-1">
          {model.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="sh-badge sh-badge-category">
              #{tag.replace('girls/', '').replace('couples/', '')}
            </span>
          ))}
        </div>
        <a
          href={clickUrl}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className={`block w-full text-center text-xs sm:text-sm gap-1 ${
            isUrgent 
              ? 'bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3 animate-pulse sh-btn' 
              : 'sh-btn sh-btn-primary'
          }`}
          aria-label={`Guarda ${model.username} live`}
          onClick={() => trackAffiliateClick(model.username, 'card', {
            category: model.category,
            country: model.country,
            viewers: model.viewers,
            provider
          })}
        >
          <Icon name="play" size={14} />
          {model.isLive ? (
            isUrgent ? 'GUARSA ORA!' : 'Guarda ORA'
          ) : 'Vai al Profilo'}
          {model.viewers > 500 && (
            <span className="ml-1 text-[10px] opacity-80">• {model.viewers.toLocaleString()}</span>
          )}
        </a>
        {isHot && (
          <p className="text-[10px] text-center text-green-400 font-medium mt-1 animate-pulse">
            ↑ Viewers in crescita
          </p>
        )}
      </div>
    </article>
  );
}
