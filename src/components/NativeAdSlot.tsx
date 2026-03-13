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
  
  // Use different ad formats based on position
  const getAdFormat = () => {
    const position = cardIndex % 6;
    
    switch (position) {
      case 0:
        return { id: '5870892', class: 'eas6a97888e20', style: { width: '100%', maxWidth: '600px', height: '280px' } };
      case 1:
        return { id: '5870904', class: 'eas6a97888e10', style: { width: '300px', height: '250px' } };
      case 2:
        return { id: '5870906', class: 'eas6a97888e6', style: { width: '300px', height: '250px' } };
      case 3:
        return { id: '5870896', class: 'eas6a97888e38', style: { width: '100%', maxWidth: '500px', height: '320px' } };
      case 4:
        return { id: '5871370', class: 'eas6a97888e2', style: { width: '728px', height: '90px', maxWidth: '100%' } };
      case 5:
        return { id: '5870892', class: 'eas6a97888e20', style: { width: '100%', maxWidth: '600px', height: '280px' } };
      default:
        return { id: '5870892', class: 'eas6a97888e20', style: { width: '100%', maxWidth: '600px', height: '280px' } };
    }
  };
  
  const ad = getAdFormat();
  
  return (
    <div 
      ref={containerRef}
      className="native-ad-wrapper col-span-full w-full my-4 flex justify-center items-center"
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
