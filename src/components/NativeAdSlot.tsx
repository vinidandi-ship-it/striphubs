import { useEffect, useRef } from 'react';
import { shouldShowNativeAd, recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';

const ZONE_IDS = [
  { id: '5870892', class: 'eas6a97888e20', name: 'Native' },
  { id: '5870866', class: 'eas6a97888e2', name: 'Banner' },
  { id: '5870896', class: 'eas6a97888e38', name: 'Multiformat' },
  { id: '5870904', class: 'eas6a97888e10', name: 'Mobile' },
  { id: '5870906', class: 'eas6a97888e6', name: 'Message' },
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
      className="native-ad-wrapper col-span-full w-full my-4 border border-yellow-600 bg-yellow-900/20 p-2"
      onClick={() => recordAdClick('native')}
    >
      <p className="text-xs text-yellow-500 mb-1">Ad Position {cardIndex} - {zone.name} ({zone.id})</p>
      <ins 
        className={zone.class} 
        data-zoneid={zone.id}
        style={{ display: 'block', minHeight: '150px', width: '100%' }}
      />
    </div>
  );
}
