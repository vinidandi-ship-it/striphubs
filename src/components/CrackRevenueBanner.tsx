import { useEffect, useState } from 'react';
import { crackrevenueBanners, getRandomCrackRevenueBanner, recordCrackRevenueBannerClick, CrackRevenueBanner as BannerType } from '../lib/crackrevenueBanners';

interface CrackRevenueBannerProps {
  className?: string;
  position?: 'top' | 'bottom' | 'side';
  size?: 'full' | 'small';
}

export default function CrackRevenueBanner({ className = '', position = 'bottom', size = 'full' }: CrackRevenueBannerProps) {
  const [banner, setBanner] = useState<BannerType | null>(null);

  useEffect(() => {
    // Select random banner
    setBanner(getRandomCrackRevenueBanner());
  }, []);

  if (!banner) return null;

  return (
    <a
      href={banner.link}
      target="_blank"
      rel="noopener noreferrer sponsored"
      className={`crackrevenue-banner block overflow-hidden ${className} ${
        position === 'bottom' ? 'mt-4' : ''
      }`}
      onClick={() => recordCrackRevenueBannerClick(banner.id)}
      aria-label="CrackRevenue Banner"
    >
      <img
        src={banner.image}
        alt="CrackRevenue"
        width={banner.width}
        height={banner.height}
        loading="lazy"
        decoding="async"
        className={`w-full h-auto object-cover ${
          size === 'small' ? 'max-w-[300px] mx-auto' : ''
        }`}
      />
    </a>
  );
}
