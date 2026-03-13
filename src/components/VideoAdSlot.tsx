import { useEffect, useRef } from 'react';
import { recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';

export default function VideoAdSlot() {
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
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="w-full flex justify-center py-3"
      onClick={() => recordAdClick('native')}
    >
      <ins 
        className="eas6a97888e20" 
        data-zoneid="5871378"
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

export function VideoBannerSlot() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="ad-provider"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://a.magsrv.com/ad-provider.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="w-full flex justify-center py-2"
      onClick={() => recordAdClick('banner')}
    >
      <ins 
        className="eas6a97888e20" 
        data-zoneid="5871378"
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
