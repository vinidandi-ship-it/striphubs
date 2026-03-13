import { useEffect, useRef, useState } from 'react';
import { recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';

const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
};

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

// Banner 728x90 (Desktop) - Striphub (5870866)
export function Banner728x90({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);
  useAdScript();
  
  useEffect(() => {
    setMobile(isMobile());
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    recordAdImpression('banner');
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`${className} w-full flex justify-center ${mobile ? 'hidden md:flex' : ''}`}
      onClick={() => recordAdClick('banner')}
    >
      <ins 
        className="eas6a97888e2" 
        data-zoneid={mobile ? '5870904' : '5870866'}
        style={{
          display: 'block',
          width: mobile ? '300px' : '100%',
          maxWidth: mobile ? '300px' : '728px',
          height: mobile ? '250px' : '90px'
        }}
      />
    </div>
  );
}

// Banner 728x90 (Desktop) - Banner 2 (5871370)
export function Banner728x90Second({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);
  useAdScript();
  
  useEffect(() => {
    setMobile(isMobile());
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  useEffect(() => {
    recordAdImpression('banner');
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`${className} w-full flex justify-center ${mobile ? 'hidden md:flex' : ''}`}
      onClick={() => recordAdClick('banner')}
    >
      <ins 
        className="eas6a97888e2" 
        data-zoneid={mobile ? '5870904' : '5871370'}
        style={{
          display: 'block',
          width: mobile ? '300px' : '100%',
          maxWidth: mobile ? '300px' : '728px',
          height: mobile ? '250px' : '90px'
        }}
      />
    </div>
  );
}

// Banner 300x250 (Mobile/Message) - Mobile Banner (5870904)
export function Banner300x250({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);
  useAdScript();
  
  useEffect(() => {
    setMobile(isMobile());
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
        className="eas6a97888e10" 
        data-zoneid="5870904"
        style={{
          display: 'block',
          width: mobile ? '100%' : '300px',
          maxWidth: '300px',
          height: '250px',
          margin: mobile ? '0' : '0 auto'
        }}
      />
    </div>
  );
}

// Recommendation Widget (Griglia 4x1) - Widget (5871378)
export function RecommendationWidget({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);
  useAdScript();
  
  useEffect(() => {
    setMobile(isMobile());
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
        className="eas6a97888e20" 
        data-zoneid={mobile ? '5871378' : '5871378'}
        style={{
          display: 'block',
          width: '100%',
          maxWidth: mobile ? '100%' : '600px',
          height: mobile ? '250px' : '250px',
          margin: '0 auto'
        }}
      />
    </div>
  );
}

// Native Ad (Griglia 4x1) - Nativo (5870892)
export function NativeAd({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);
  useAdScript();
  
  useEffect(() => {
    setMobile(isMobile());
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
        className="eas6a97888e20" 
        data-zoneid={mobile ? '5870892' : '5870892'}
        style={{
          display: 'block',
          width: '100%',
          maxWidth: mobile ? '100%' : '600px',
          height: mobile ? '250px' : '250px',
          margin: '0 auto'
        }}
      />
    </div>
  );
}

// Multiformat - Multiformat Totale (5871380)
export function MultiformatAd({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);
  useAdScript();
  
  useEffect(() => {
    setMobile(isMobile());
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
          maxWidth: mobile ? '100%' : '600px',
          height: mobile ? '250px' : '300px',
          margin: '0 auto'
        }}
      />
    </div>
  );
}

// Multiformat V2 - Multiformat (5870896)
export function MultiformatV2({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);
  useAdScript();
  
  useEffect(() => {
    setMobile(isMobile());
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
          maxWidth: mobile ? '100%' : '600px',
          height: mobile ? '250px' : '300px',
          margin: '0 auto'
        }}
      />
    </div>
  );
}

// Instant Message 300x250 - Message (5870906)
export function InstantMessage({ className = '' }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);
  useAdScript();
  
  useEffect(() => {
    setMobile(isMobile());
    const handleResize = () => setMobile(isMobile());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
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
        className="eas6a97888e6" 
        data-zoneid="5870906"
        style={{
          display: 'block',
          width: mobile ? '100%' : '300px',
          maxWidth: '300px',
          height: '250px',
          margin: mobile ? '0' : '0 auto'
        }}
      />
    </div>
  );
}
