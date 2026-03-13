import { useEffect, useState } from 'react';
import { isPremiumUser } from '../lib/revenue';
import { crackrevenueBanners, getRandomCrackRevenueBanner, recordCrackRevenueBannerClick, CrackRevenueBanner as BannerType } from '../lib/crackrevenueBanners';

// Configurazione monetizzazione
const MONETIZATION_SOURCES = {
  crackrevenue: 0.5,
  exoclick: 0.5
};

interface UniversalAdsProps {
  containerClass?: string;
  excludeTypes?: ('crackrevenue' | 'exoclick')[];
}

export default function UniversalAds({ containerClass = '', excludeTypes = [] }: UniversalAdsProps) {
  const [banner, setBanner] = useState<BannerType | null>(null);
  const [showExoClick728, setShowExoClick728] = useState(false);
  const [showExoClick300, setShowExoClick300] = useState(false);

  useEffect(() => {
    if (isPremiumUser()) return;

    const random = Math.random();
    let cumulative = 0;
    
    // CrackRevenue (50%)
    cumulative += MONETIZATION_SOURCES.crackrevenue;
    if (random < cumulative && !excludeTypes.includes('crackrevenue')) {
      setBanner(getRandomCrackRevenueBanner());
      return;
    }
    
    // ExoClick 728x90 (25%)
    cumulative += MONETIZATION_SOURCES.exoclick / 2;
    if (random < cumulative && !excludeTypes.includes('exoclick')) {
      setShowExoClick728(true);
      return;
    }
    
    // ExoClick 300x250 (25%)
    cumulative += MONETIZATION_SOURCES.exoclick / 2;
    if (random < cumulative && !excludeTypes.includes('exoclick')) {
      setShowExoClick300(true);
      return;
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

  // ExoClick 728x90 Banner
  if (showExoClick728) {
    return (
      <div className={`universal-ad exoclick-ad ${containerClass}`}>
        <div className="w-full flex justify-center">
          <ins 
            className="eas6a97888e2" 
            data-zoneid="5870866"
            style={{ display: 'block', width: '728px', maxWidth: '100%', height: '90px' }}
          />
        </div>
      </div>
    );
  }

  // ExoClick 300x250 Banner
  if (showExoClick300) {
    return (
      <div className={`universal-ad exoclick-ad ${containerClass}`}>
        <div className="w-full flex justify-center">
          <ins 
            className="eas6a97888e10" 
            data-zoneid="5870904"
            style={{ display: 'block', width: '300px', height: '250px' }}
          />
        </div>
      </div>
    );
  }

  return null;
}
