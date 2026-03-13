import { useEffect, useRef, useState } from 'react';
import { shouldShowNativeAd, recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';

interface NativeAdSlotProps {
  cardIndex: number;
}

export default function NativeAdSlot({ cardIndex }: NativeAdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [adLoaded, setAdLoaded] = useState(false);
  
  useEffect(() => {
    if (!shouldShowNativeAd(cardIndex)) return;
    
    const loadAd = () => {
      if (adLoaded) return;
      setAdLoaded(true);
      recordAdImpression('native');
    };
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadAd();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, [cardIndex, adLoaded]);
  
  if (!shouldShowNativeAd(cardIndex)) return null;
  
  return (
    <div 
      ref={containerRef}
      className="content-visibility-card sh-card overflow-hidden"
      onClick={() => recordAdClick('native')}
    >
      <div className="relative">
        <iframe 
          src={`https://ads.exoclick.com/ads.php?zoneid=5870892&charset=utf-8`}
          className="w-full h-full min-h-[300px]"
          frameBorder="0"
          scrolling="no"
          title="Advertisement"
        />
      </div>
    </div>
  );
}
}
