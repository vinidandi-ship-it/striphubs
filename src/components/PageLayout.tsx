import { ReactNode } from 'react';
import VideoAdSlot, { VideoBannerSlot } from './VideoAdSlot';
import NativeAdSlot from './NativeAdSlot';
import { 
  Banner728x90, 
  Banner300x250, 
  Banner728x90Second,
  RecommendationWidget,
  NativeAd,
  MultiformatAd,
  MultiformatV2,
  InstantMessage
} from './BannerAds';
import CrackRevenueBanner from './CrackRevenueBanner';

interface PageLayoutProps {
  children: ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <div className="space-y-2 my-4">
        <div className="flex justify-center">
          <Banner728x90 className="hidden md:block" />
          <Banner300x250 className="md:hidden" />
        </div>
        <CrackRevenueBanner />
        <RecommendationWidget className="my-2" />
        <NativeAd className="my-2" />
        <VideoBannerSlot />
      </div>
      
      {children}
      
      <div className="space-y-2 my-4">
        <div className="flex justify-center">
          <Banner728x90Second className="hidden md:block" />
          <Banner300x250 className="md:hidden" />
        </div>
        <CrackRevenueBanner />
        <MultiformatAd className="my-2" />
        <MultiformatV2 className="my-2" />
        <InstantMessage className="my-2" />
        <div className="flex justify-center">
          <VideoBannerSlot />
        </div>
      </div>
    </>
  );
}
