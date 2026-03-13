import { useEffect, useRef } from 'react';
import { shouldShowNativeAd, recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';

interface NativeAdSlotProps {
  cardIndex: number;
}

export default function NativeAdSlot({ cardIndex }: NativeAdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    recordAdImpression('native');
    
    // Trigger AdProvider
    if (typeof window !== 'undefined') {
      (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider = (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider || [];
    }
  }, [cardIndex]);
  
  return (
    <div 
      ref={containerRef}
      className="native-ad-wrapper col-span-full w-full my-4 border border-yellow-600 bg-yellow-900/20 p-2"
      onClick={() => recordAdClick('native')}
    >
      <p className="text-xs text-yellow-500 mb-1">Ad Position {cardIndex}</p>
      <ins 
        className="eas6a97888e20" 
        data-zoneid="5870892"
        style={{ display: 'block', minHeight: '100px' }}
      />
    </div>
  );
}
