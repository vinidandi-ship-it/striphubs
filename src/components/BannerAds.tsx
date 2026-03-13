import { useEffect, useRef, useState } from 'react';
import { recordAdImpression, recordAdClick } from '../lib/revenue/displayAds';

const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  return /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768;
};

export function Banner728x90({ className = '' }: { className?: string }) {
  const [mobile, setMobile] = useState(false);
  
  useEffect(() => {
    setMobile(isMobile());
    recordAdImpression('banner');
  }, []);
  
  return (
    <div 
      className={`${className} w-full flex justify-center ${mobile ? 'hidden md:flex' : ''}`}
      onClick={() => recordAdClick('banner')}
    >
      <ins 
        className="eas6a97888e2" 
        data-zoneid="5870866"
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

export function Banner300x250({ className = '' }: { className?: string }) {
  const [mobile, setMobile] = useState(false);
  
  useEffect(() => {
    setMobile(isMobile());
    recordAdImpression('banner');
  }, []);
  
  return (
    <div 
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

export function Banner728x90Second({ className = '' }: { className?: string }) {
  return <Banner728x90 className={className} />;
}

export function RecommendationWidget({ className = '' }: { className?: string }) {
  const [mobile, setMobile] = useState(false);
  
  useEffect(() => {
    setMobile(isMobile());
  }, []);
  
  return (
    <div 
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

export function NativeAd({ className = '' }: { className?: string }) {
  const [mobile, setMobile] = useState(false);
  
  useEffect(() => {
    setMobile(isMobile());
  }, []);
  
  return (
    <div 
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

export function MultiformatAd({ className = '' }: { className?: string }) {
  const [mobile, setMobile] = useState(false);
  
  useEffect(() => {
    setMobile(isMobile());
  }, []);
  
  return (
    <div 
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

export function MultiformatV2({ className = '' }: { className?: string }) {
  const [mobile, setMobile] = useState(false);
  
  useEffect(() => {
    setMobile(isMobile());
  }, []);
  
  return (
    <div 
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

export function InstantMessage({ className = '' }: { className?: string }) {
  const [mobile, setMobile] = useState(false);
  
  useEffect(() => {
    setMobile(isMobile());
  }, []);
  
  return (
    <div 
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
