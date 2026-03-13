import { useEffect, useState } from 'react';
import { crackrevenueBanners, getRandomCrackRevenueBanner, recordCrackRevenueBannerClick, CrackRevenueBanner as BannerType } from '../lib/crackrevenueBanners';

interface UniversalAdsProps {
  containerClass?: string;
}

export default function UniversalAds({ containerClass = '' }: UniversalAdsProps) {
  const [banner, setBanner] = useState<BannerType | null>(null);
  const [showExoClick728, setShowExoClick728] = useState(false);

  useEffect(() => {
    try {
      const random = Math.random();
      
      // 50% CrackRevenue, 50% ExoClick
      if (random < 0.5) {
        const randomBanner = getRandomCrackRevenueBanner();
        if (randomBanner) {
          setBanner(randomBanner);
        }
      } else {
        setShowExoClick728(true);
      }
    } catch (error) {
      console.error('UniversalAds error:', error);
    }
  }, []);

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

  return null;
}
