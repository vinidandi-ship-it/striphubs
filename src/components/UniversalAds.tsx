import { useEffect, useState } from 'react';
import { isPremiumUser } from '../lib/revenue';
import { crackrevenueBanners, getRandomCrackRevenueBanner, recordCrackRevenueBannerClick, CrackRevenueBanner as BannerType } from '../lib/crackrevenueBanners';

// Configurazione banner
const SHOW_CRACKREVENUE_CHANCE = 0.3; // 30% di mostrare CrackRevenue
const SHOW_EXOCLICK_CHANCE = 0.4;     // 40% di mostrare ExoClick

interface UniversalAdsProps {
  containerClass?: string;
  excludeTypes?: ('crackrevenue' | 'exoclick')[];
}

export default function UniversalAds({ containerClass = '', excludeTypes = [] }: UniversalAdsProps) {
  const [banner, setBanner] = useState<BannerType | null>(null);
  const [showExoClick, setShowExoClick] = useState(false);

  useEffect(() => {
    if (isPremiumUser()) return;

    const random = Math.random();
    
    // Solo CrackRevenue o ExoClick, non entrambi
    if (random < SHOW_CRACKREVENUE_CHANCE && !excludeTypes.includes('crackrevenue')) {
      setBanner(getRandomCrackRevenueBanner());
    } else if (random < SHOW_CRACKREVENUE_CHANCE + SHOW_EXOCLICK_CHANCE && !excludeTypes.includes('exoclick')) {
      setShowExoClick(true);
    }
  }, [excludeTypes]);

  // CrackRevenue Banner
  if (banner) {
    return (
      <div className={`universal-ad ${containerClass}`}>
        <a
          href={banner.link}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="block overflow-hidden"
          onClick={() => recordCrackRevenueBannerClick(banner.id)}
        >
          <img
            src={banner.image}
            alt="CrackRevenue"
            width={banner.width}
            height={banner.height}
            loading="lazy"
            decoding="async"
            className="w-full h-auto"
          />
        </a>
      </div>
    );
  }

  // ExoClick Placeholder (user will add actual ExoClick script)
  if (showExoClick) {
    return (
      <div className={`universal-ad exoclick-ad ${containerClass}`}>
        <div className="exoclick-banner" data-zoneid="5870866">
          {/* ExoClick script will be loaded here */}
        </div>
      </div>
    );
  }

  return null;
}
