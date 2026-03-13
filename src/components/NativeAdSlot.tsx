import { useEffect, useRef } from 'react';
import { recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';

interface NativeAdSlotProps {
  cardIndex: number;
}

// Pattern of formats to use - all from the dashboard
const FORMAT_PATTERNS = [
  { id: '5870892', name: 'Recommendation Widget 250px', width: '100%', maxWidth: '600px', height: '250px', className: 'eas6a97888e20', mobileId: '5870904' },
  { id: '5870904', name: 'Mobile Banner 300x250', width: '300px', maxWidth: '100%', height: '250px', className: 'eas6a97888e10', mobileId: '5870904' },
  { id: '5870906', name: 'Instant Message 300x250', width: '300px', maxWidth: '100%', height: '250px', className: 'eas6a97888e6', mobileId: '5870906' },
  { id: '5870866', name: 'Banner 728x90', width: '728px', maxWidth: '100%', height: '90px', className: 'eas6a97888e2', mobileId: '5870904' },
  { id: '5871380', name: 'Multiformat', width: '100%', maxWidth: '600px', height: '300px', className: 'eas6a97888e38', mobileId: '5871380' },
  { id: '5871378', name: 'Recommendation Widget 250px', width: '100%', maxWidth: '600px', height: '250px', className: 'eas6a97888e38', mobileId: '5871378' },
];

const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
};

export default function NativeAdSlot({ cardIndex }: NativeAdSlotProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Select format based on position
  const formatIndex = cardIndex % FORMAT_PATTERNS.length;
  const format = FORMAT_PATTERNS[formatIndex];
  const mobileMode = isMobile();
  
  // Use mobile-specific zone ID on mobile
  const zoneId = mobileMode && format.mobileId ? format.mobileId : format.id;
  
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
        className={format.className} 
        data-zoneid={zoneId}
        style={{ 
          display: 'block', 
          width: mobileMode ? '100%' : format.width, 
          maxWidth: mobileMode ? '100%' : format.maxWidth, 
          height: mobileMode ? '250px' : format.height, 
          margin: '0 auto' 
        }}
      />
    </div>
  );
}
