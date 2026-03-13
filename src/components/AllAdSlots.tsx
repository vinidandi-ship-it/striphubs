import { useEffect, useRef } from 'react';
import { recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';

const useAdScript = (zoneId: string) => {
  useEffect(() => {
    const existingScript = document.querySelector('script[src*="ad-provider"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://a.magsrv.com/ad-provider.js';
      script.async = true;
      document.head.appendChild(script);
    }
  }, []);
};

export function MultiformatAd({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useAdScript('5871380');
  
  return (
    <div ref={ref} className={className} onClick={() => recordAdClick('multiformat')}>
      <ins className="eas6a97888e38" data-zoneid="5871380" style={{ display: 'block', width: '100%', height: '300px' }} />
    </div>
  );
}

export function Banner728x90({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useAdScript('5870866');
  
  return (
    <div ref={ref} className={className} onClick={() => recordAdClick('banner728')}>
      <ins className="eas6a97888e38" data-zoneid="5870866" style={{ display: 'block', width: '728px', height: '90px', margin: '0 auto' }} />
    </div>
  );
}

export function Banner300x250({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useAdScript('5870904');
  
  return (
    <div ref={ref} className={className} onClick={() => recordAdClick('banner300')}>
      <ins className="eas6a97888e38" data-zoneid="5870904" style={{ display: 'block', width: '300px', height: '250px', margin: '0 auto' }} />
    </div>
  );
}

export function Banner160x600({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useAdScript('5871370');
  
  return (
    <div ref={ref} className={className} onClick={() => recordAdClick('banner160')}>
      <ins className="eas6a97888e38" data-zoneid="5871370" style={{ display: 'block', width: '160px', height: '600px', margin: '0 auto' }} />
    </div>
  );
}

export function Message300x250({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useAdScript('5870906');
  
  return (
    <div ref={ref} className={className} onClick={() => recordAdClick('message300')}>
      <ins className="eas6a97888e38" data-zoneid="5870906" style={{ display: 'block', width: '300px', height: '250px', margin: '0 auto' }} />
    </div>
  );
}

export function RecommendationWidget({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useAdScript('5871378');
  
  return (
    <div ref={ref} className={className} onClick={() => recordAdClick('recommendation')}>
      <ins className="eas6a97888e38" data-zoneid="5871378" style={{ display: 'block', width: '100%', height: '250px' }} />
    </div>
  );
}

export function NativeAd({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useAdScript('5870892');
  
  return (
    <div ref={ref} className={className} onClick={() => recordAdClick('native2')}>
      <ins className="eas6a97888e38" data-zoneid="5870892" style={{ display: 'block', width: '100%', height: '250px' }} />
    </div>
  );
}

export function MultiformatV2({ className = '' }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useAdScript('5870896');
  
  return (
    <div ref={ref} className={className} onClick={() => recordAdClick('multiformat2')}>
      <ins className="eas6a97888e38" data-zoneid="5870896" style={{ display: 'block', width: '100%', height: '300px' }} />
    </div>
  );
}

export function AdBannerRow({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full py-2 ${className}`}>
      <MultiformatAd className="max-w-[600px] mx-auto" />
    </div>
  );
}

export function AdBannerInline({ className = '' }: { className?: string }) {
  return (
    <div className={`w-full ${className}`}>
      <Banner728x90 className="hidden md:block" />
      <Banner300x250 className="md:hidden mx-auto" />
    </div>
  );
}

export function AdSidebar({ className = '' }: { className?: string }) {
  return (
    <div className={`${className}`}>
      <Banner160x600 className="hidden lg:block" />
    </div>
  );
}

export function AdDoubleBanner({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center gap-4 flex-wrap ${className}`}>
      <Banner300x250 />
      <Banner300x250 />
    </div>
  );
}
