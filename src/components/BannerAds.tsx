import { useEffect, useRef } from 'react';
import { recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';

// Componente generico per caricare lo script ExoClick
const useAdScript = () => {
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

// Banner 728x90 (Desktop)
export function Banner728x90({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useAdScript();
  
  useEffect(() => {
    recordAdImpression('banner');
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`${className} w-full flex justify-center`}
      onClick={() => recordAdClick('banner')}
    >
      <ins 
        className="eas6a97888e38" 
        data-zoneid="5870866"
        style={{
          display: 'block',
          width: '728px',
          height: '90px'
        }}
      />
    </div>
  );
}

// Banner 300x250 (Mobile/Message)
export function Banner300x250({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useAdScript();
  
  useEffect(() => {
    recordAdImpression('banner');
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`${className} w-full flex justify-center`}
      onClick={() => recordAdClick('banner')}
    >
      <ins 
        className="eas6a97888e38" 
        data-zoneid="5870904"
        style={{
          display: 'block',
          width: '300px',
          height: '250px'
        }}
      />
    </div>
  );
}

// Recommendation Widget (Griglia 4x1)
export function RecommendationWidget({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useAdScript();
  
  useEffect(() => {
    recordAdImpression('premium');
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`${className} w-full`}
      onClick={() => recordAdClick('premium')}
    >
      <ins 
        className="eas6a97888e38" 
        data-zoneid="5871378"
        style={{
          display: 'block',
          width: '100%',
          height: '250px'
        }}
      />
    </div>
  );
}

// Native Ad (Griglia 4x1)
export function NativeAd({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useAdScript();
  
  useEffect(() => {
    recordAdImpression('native');
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`${className} w-full`}
      onClick={() => recordAdClick('native')}
    >
      <ins 
        className="eas6a97888e38" 
        data-zoneid="5870892"
        style={{
          display: 'block',
          width: '100%',
          height: '250px'
        }}
      />
    </div>
  );
}

// Multiformat
export function MultiformatAd({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useAdScript();
  
  useEffect(() => {
    recordAdImpression('native');
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`${className} w-full flex justify-center`}
      onClick={() => recordAdClick('native')}
    >
      <ins 
        className="eas6a97888e38" 
        data-zoneid="5871380"
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '600px',
          height: '300px',
          margin: '0 auto'
        }}
      />
    </div>
  );
}

// Multiformat V2
export function MultiformatV2({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useAdScript();
  
  useEffect(() => {
    recordAdImpression('native');
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`${className} w-full flex justify-center`}
      onClick={() => recordAdClick('native')}
    >
      <ins 
        className="eas6a97888e38" 
        data-zoneid="5870896"
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '600px',
          height: '300px',
          margin: '0 auto'
        }}
      />
    </div>
  );
}

// Instant Message 300x250
export function InstantMessage({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  useAdScript();
  
  useEffect(() => {
    recordAdImpression('native');
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`${className} w-full flex justify-center`}
      onClick={() => recordAdClick('native')}
    >
      <ins 
        className="eas6a97888e38" 
        data-zoneid="5870906"
        style={{
          display: 'block',
          width: '300px',
          height: '250px'
        }}
      />
    </div>
  );
}

