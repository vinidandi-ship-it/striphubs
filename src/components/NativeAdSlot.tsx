import { useEffect, useRef } from 'react';
import { shouldShowNativeAd, recordAdImpression, recordAdClick, getAdNetworkScript } from '../lib/revenue/displayAds';

interface NativeAdSlotProps {
  cardIndex: number;
}

export default function NativeAdSlot({ cardIndex }: NativeAdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);
  
  useEffect(() => {
    if (!shouldShowNativeAd(cardIndex) || loadedRef.current) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !loadedRef.current) {
            loadedRef.current = true;
            recordAdImpression('native');
            
            const script = document.createElement('script');
            script.src = 'https://a.exoclick.com/5870896.js';
            script.async = true;
            script.id = 'exoclick-native-script';
            document.body.appendChild(script);
            
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => observer.disconnect();
  }, [cardIndex]);
  
  if (!shouldShowNativeAd(cardIndex)) return null;
  
  return (
    <div 
      ref={containerRef}
      className="content-visibility-card sh-card overflow-hidden"
      onClick={() => recordAdClick('native')}
    >
      <div className="relative">
        <div className="aspect-[3/4] w-full bg-gradient-to-br from-panel to-bg-tertiary flex items-center justify-center">
          <div className="text-center p-4">
            <div className="text-xs text-text-muted mb-2 uppercase tracking-wider">Sponsorizzato</div>
            <div className="h-3 bg-text-muted/20 rounded w-32 mx-auto mb-2"></div>
            <div className="h-2 bg-text-muted/10 rounded w-24 mx-auto"></div>
          </div>
        </div>
      </div>
      <div className="p-3 sm:p-4">
        <div className="space-y-2">
          <div className="h-3 bg-text-muted/20 rounded w-3/4"></div>
          <div className="h-2 bg-text-muted/10 rounded w-1/2"></div>
        </div>
        <button className="mt-3 w-full sh-btn bg-text-muted/20 text-text-secondary cursor-pointer">
          Scopri di più
        </button>
      </div>
    </div>
  );
}
