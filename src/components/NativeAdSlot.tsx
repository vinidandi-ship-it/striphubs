import { useEffect, useRef } from 'react';
import { recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';

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
    
    // Force ad loading
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as any).AdProvider) {
        (window as any).AdProvider.push({ serve: {} });
      }
    }, 500);
  }, [cardIndex]);
  
  return (
    <div 
      ref={containerRef}
      className="native-ad-wrapper col-span-full w-full my-3 py-2 flex justify-center items-center overflow-hidden"
      onClick={() => recordAdClick('native')}
    >
      <ins 
        className="eas6a97888e20" 
        data-zoneid="5870892"
        style={{ 
          display: 'block', 
          width: '100%', 
          maxWidth: '600px', 
          height: '250px', 
          margin: '0 auto' 
        }}
      />
    </div>
  );
}
