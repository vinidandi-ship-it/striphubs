import { useEffect } from 'react';
import { shouldShowNativeAd, recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';

interface NativeAdSlotProps {
  cardIndex: number;
}

export default function NativeAdSlot({ cardIndex }: NativeAdSlotProps) {
  useEffect(() => {
    recordAdImpression('native');
  }, [cardIndex]);
  
  // Always show ads for debugging
  return (
    <div 
      className="native-ad-wrapper col-span-full w-full my-4 bg-green-900 border-2 border-green-500 p-4 text-center"
      onClick={() => recordAdClick('native')}
    >
      <p className="text-green-400 font-bold mb-2">ADVERTISEMENT (Position {cardIndex})</p>
      <ins 
        className="eas6a97888e20 w-full block"
        data-zoneid="5870892"
      />
    </div>
  );
}
