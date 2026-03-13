import { useEffect, useRef } from 'react';
import { recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';

interface VideoAdSlotProps {
  position: 'top' | 'middle' | 'bottom';
}

export default function VideoAdSlot({ position }: VideoAdSlotProps) {
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
  
  // Use different formats based on position
  const getAdConfig = () => {
    if (position === 'top') {
      return { 
        id: '5870892', 
        class: 'eas6a97888e20', 
        style: { width: '100%', maxWidth: '580px', height: '250px', margin: '0 auto', display: 'block' } 
      };
    }
    if (position === 'middle') {
      return { 
        id: '5870904', 
        class: 'eas6a97888e10', 
        style: { width: '300px', height: '250px', margin: '0 auto', display: 'block' } 
      };
    }
    // bottom
    return { 
      id: '5870892', 
      class: 'eas6a97888e20', 
      style: { width: '100%', maxWidth: '580px', height: '250px', margin: '0 auto', display: 'block' } 
    };
  };
  
  const ad = getAdConfig();
  
  return (
    <div 
      ref={containerRef}
      className="w-full my-4 flex justify-center items-center"
      onClick={() => recordAdClick('native')}
    >
      <ins 
        className={ad.class} 
        data-zoneid={ad.id}
        style={ad.style}
      />
    </div>
  );
}
