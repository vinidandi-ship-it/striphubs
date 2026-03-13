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
        <ins 
          className="eas6a97888e2" 
          data-zoneid="5870892"
        />
        <script 
          async 
          type="application/javascript" 
          src="https://a.magsrv.com/ad-provider.js"
        />
        <script 
          dangerouslySetInnerHTML={{__html: '(AdProvider = window.AdProvider || []).push({"serve": {}});'}}
        />
      </div>
    </div>
  );
}
