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
      className="native-ad-wrapper col-span-full w-full my-4"
      onClick={() => recordAdClick('native')}
      style={{ order: 999 }}
    >
      <ins 
        className="eas6a97888e20 w-full block"
        data-zoneid="5870892"
      />
    </div>
  );
}
