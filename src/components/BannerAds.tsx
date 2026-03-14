import { useEffect, useRef, useState } from 'react';
import { recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';
import { crackrevenueBanners, recordCrackRevenueBannerClick, CrackRevenueBanner } from '../lib/crackrevenueBanners';

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
    
    // Trigger ExoClick ad
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider) {
        (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider?.push({ serve: {} });
      }
    }, 500);
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
    
    // Trigger ExoClick ad
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider) {
        (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider?.push({ serve: {} });
      }
    }, 500);
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`${className} w-full flex justify-center ${mobile ? 'hidden md:flex' : ''}`}
      onClick={() => recordAdClick('banner')}
    >
      <ins 
        className="eas6a97888e2" 
        data-zoneid="5871370"
        style={{
          display: 'block',
          width: '728px',
          maxWidth: '100%',
          height: '90px'
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
    
    // Trigger ExoClick ad
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider) {
        (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider?.push({ serve: {} });
      }
    }, 500);
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
          width: '300px',
          maxWidth: '100%',
          height: '250px'
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
    
    // Trigger ExoClick ad
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider) {
        (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider?.push({ serve: {} });
      }
    }, 500);
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`${className} w-full`}
      onClick={() => recordAdClick('premium')}
    >
      <ins 
        className="eas6a97888e20" 
        data-zoneid="5871378"
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
    
    // Trigger ExoClick ad
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider) {
        (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider?.push({ serve: {} });
      }
    }, 500);
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className={`${className} w-full`}
      onClick={() => recordAdClick('native')}
    >
      <ins 
        className="eas6a97888e20" 
        data-zoneid="5870892"
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
    
    // Trigger ExoClick ad
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider) {
        (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider?.push({ serve: {} });
      }
    }, 500);
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
    
    // Trigger ExoClick ad
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider) {
        (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider?.push({ serve: {} });
      }
    }, 500);
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
    
    // Trigger ExoClick ad
    setTimeout(() => {
      if (typeof window !== 'undefined' && (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider) {
        (window as unknown as { AdProvider?: { push: (obj: object) => void }[] }).AdProvider?.push({ serve: {} });
      }
    }, 500);
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

// CrackRevenue Banner - Fisso (senza rotazione)
export function CrackRevenueAd({ className = '', bannerId }: { className?: string, bannerId?: string }) {
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    import('../lib/crackrevenueBanners').then((module) => {
      const banners = module.crackrevenueBanners;
      const selected = bannerId 
        ? banners.find(b => b.id === bannerId) 
        : banners[0];
      setBanner(selected);
    });
  }, [bannerId]);

  if (!banner) return null;

  return (
    <div 
      className={`${className} w-full flex justify-center`}
      onClick={() => {
        import('../lib/crackrevenueBanners').then((module) => {
          module.recordCrackRevenueBannerClick(banner.id);
        });
      }}
    >
      <a
        href={banner.link}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className="block overflow-hidden"
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '1280px',
          height: 'auto'
        }}
      >
        <img
          src={banner.image}
          alt="CrackRevenue"
          width={banner.width}
          height={banner.height}
          loading="lazy"
          decoding="async"
          className="w-full h-auto"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      </a>
    </div>
  );
}

// MOSTRA TUTTI I BANNER CRACKREVENUE - tutti visibili insieme
export function AllCrackRevenueBanners({ className = '' }: { className?: string }) {
  return (
    <div className={`${className} flex flex-col gap-4`}>
      {crackrevenueBanners.map((banner) => (
        <div 
          key={banner.id}
          className="w-full flex justify-center"
          onClick={() => recordCrackRevenueBannerClick(banner.id)}
        >
          <a
            href={banner.link}
            target="_blank"
            rel="noopener noreferrer sponsored"
            className="block overflow-hidden"
            style={{
              display: 'block',
              width: '100%',
              maxWidth: '1280px',
              height: 'auto'
            }}
          >
            <img
              src={banner.image}
              alt="CrackRevenue"
              width={banner.width}
              height={banner.height}
              loading="lazy"
              decoding="async"
              className="w-full h-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </a>
        </div>
      ))}
    </div>
  );
}
