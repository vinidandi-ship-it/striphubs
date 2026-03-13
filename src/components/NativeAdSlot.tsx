import { useEffect, useRef } from 'react';
import { shouldShowNativeAd, recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';

const ZONE_IDS = [
  { id: '5870892', class: 'eas6a97888e20', name: 'Native', width: '100%', height: '250px', minHeight: '200px' },
  { id: '5870866', class: 'eas6a97888e2', name: 'Banner 728x90', width: '728px', height: '90px', minHeight: '90px' },
  { id: '5870896', class: 'eas6a97888e38', name: 'Multiformat', width: '100%', height: '300px', minHeight: '250px' },
  { id: '5870904', class: 'eas6a97888e10', name: 'Mobile 300x250', width: '300px', height: '250px', minHeight: '250px' },
  { id: '5870906', class: 'eas6a97888e6', name: 'Message 300x250', width: '300px', height: '250px', minHeight: '250px' },
];

interface NativeAdSlotProps {
  cardIndex: number;
}

export default function NativeAdSlot({ cardIndex }: NativeAdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    recordAdImpression('native');
    
    // Load ExoClick script
    const existingScript = document.querySelector('script[src*="ad-provider"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://a.magsrv.com/ad-provider.js';
      script.async = true;
      document.head.appendChild(script);
    }
    
    // Trigger AdProvider after a short delay
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider) {
        (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider?.push({ serve: {} });
      }
    }, 500);
  }, [cardIndex]);
  
  // Cycle through different zone IDs
  const zoneIndex = Math.floor((cardIndex - 1) / 3) % ZONE_IDS.length;
  const zone = ZONE_IDS[zoneIndex];
  
  return (
    <div 
      ref={containerRef}
      className="native-ad-wrapper col-span-full w-full my-4 flex justify-center"
      onClick={() => recordAdClick('native')}
    >
      <ins 
        className={zone.class} 
        data-zoneid={zone.id}
        style={{ 
          display: 'block', 
          width: zone.width, 
          height: zone.height,
          minHeight: zone.minHeight,
          margin: '0 auto'
        }}
      />
    </div>
  );
}
