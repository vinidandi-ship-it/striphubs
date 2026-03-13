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
  
  if (!shouldShowNativeAd(cardIndex)) return null;
  
  return (
    <div 
      className="content-visibility-card sh-card overflow-hidden min-h-[300px]"
      onClick={() => recordAdClick('native')}
    >
      <ins 
        className="eas6a97888e20" 
        data-zoneid="5870892"
      />
    </div>
  );
}
