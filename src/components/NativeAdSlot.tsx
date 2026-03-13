import { useEffect } from 'react';
import { shouldShowNativeAd, recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';

interface NativeAdSlotProps {
  cardIndex: number;
}

export default function NativeAdSlot({ cardIndex }: NativeAdSlotProps) {
  useEffect(() => {
    if (shouldShowNativeAd(cardIndex)) {
      recordAdImpression('native');
    }
  }, [cardIndex]);
  
  // Debug: render on specific indices
  if (cardIndex !== 6 && cardIndex !== 12 && cardIndex !== 18 && cardIndex !== 24 && cardIndex !== 30) {
    return null;
  }
  
  return (
    <div 
      className="native-ad-wrapper col-span-full w-full my-4 bg-panel border border-accent p-4"
      onClick={() => recordAdClick('native')}
    >
      <p className="text-xs text-accent mb-2">Advertisement</p>
      <ins 
        className="eas6a97888e20 w-full block"
        data-zoneid="5870892"
      />
    </div>
  );
}
