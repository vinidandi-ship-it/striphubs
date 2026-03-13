import { useEffect, useRef } from 'react';
import { shouldShowNativeAd, recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';

interface NativeAdSlotProps {
  cardIndex: number;
}

export default function NativeAdSlot({ cardIndex }: NativeAdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    recordAdImpression('native');
    
    const existingScript = document.querySelector('script[src*="ad-provider"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://a.magsrv.com/ad-provider.js';
      script.async = true;
      document.head.appendChild(script);
    }
    
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider) {
        (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider?.push({ serve: {} });
      }
    }, 500);
  }, [cardIndex]);
  
  // ExoClick optimized formats - use only responsive, non-intrusive sizes
  const getAdFormat = () => {
    const position = cardIndex % 4;
    
    switch (position) {
      case 0:
        // Recommendation Widget - best for desktop/mobile
        return { id: '5870892', class: 'eas6a97888e20', style: { width: '100%', maxWidth: '580px', height: '250px', margin: '0 auto' } };
      case 1:
        // Mobile Banner 300x250 - good for sidebar
        return { id: '5870904', class: 'eas6a97888e10', style: { width: '300px', height: '250px', margin: '0 auto' } };
      case 2:
        // Instant Message 300x250
        return { id: '5870906', class: 'eas6a97888e6', style: { width: '300px', height: '250px', margin: '0 auto' } };
      case 3:
        // Banner 728x90 - horizontal, fits well
        return { id: '5870866', class: 'eas6a97888e2', style: { width: '728px', height: '90px', maxWidth: '100%', margin: '0 auto' } };
      default:
        return { id: '5870892', class: 'eas6a97888e20', style: { width: '100%', maxWidth: '580px', height: '250px', margin: '0 auto' } };
    }
  };
  
  const ad = getAdFormat();
  
  return (
    <div 
      ref={containerRef}
      className="native-ad-wrapper col-span-full w-full my-3 py-2 flex justify-center items-center overflow-hidden"
      onClick={() => recordAdClick('native')}
    >
      <ins 
        className={ad.class} 
        data-zoneid={ad.id}
        style={ad.style}
      />
    </div>
  );
}
