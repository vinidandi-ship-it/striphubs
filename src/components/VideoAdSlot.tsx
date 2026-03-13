import { useEffect, useRef } from 'react';
import { recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';

interface VideoAdSlotProps {
  position?: 'top' | 'bottom';
}

export default function VideoAdSlot({ position = 'top' }: VideoAdSlotProps) {
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
  }, [position]);
  
  // Use Recommendation Widget - best for video pages
  // Format: 5870892 - responsive, fits any screen
  const ad = {
    id: '5870892',
    class: 'eas6a97888e20'
  };
  
  return (
    <div 
      ref={containerRef}
      className="w-full py-3"
      onClick={() => recordAdClick('native')}
    >
      <ins 
        className={ad.class} 
        data-zoneid={ad.id}
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '600px',
          height: '260px',
          margin: '0 auto'
        }}
      />
    </div>
  );
}
