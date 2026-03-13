import { useEffect } from 'react';
import { shouldShowNativeAd, recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';

interface NativeAdSlotProps {
  cardIndex: number;
}

export default function NativeAdSlot({ cardIndex }: NativeAdSlotProps) {
  useEffect(() => {
    recordAdImpression('native');
  }, [cardIndex]);
  
  // Use iframe approach like before
  return (
    <div 
      className="native-ad-wrapper col-span-full w-full my-4"
      onClick={() => recordAdClick('native')}
    >
      <iframe 
        src={`https://ads.exoclick.com/ads.php?zoneid=5870892&charset=utf-8`}
        className="w-full h-[300px] border-0"
        scrolling="no"
        title="Advertisement"
      />
    </div>
  );
}
