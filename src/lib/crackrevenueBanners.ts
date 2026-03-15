export interface CrackRevenueBanner {
  id: string;
  image: string;
  link: string;
  width: number;
  height: number;
}

export const crackrevenueBanners: CrackRevenueBanner[] = [
  {
    id: 'girlfriend-1280x300',
    image: 'https://www.imglnkx.com/10046/GPTGirlfriend_20250320_GGPT-Art-Gen---Characters---1280300.jpg',
    link: 'https://t.vlmai-3.com/407726/7477?aff_sub5=SF_006OG000004lmDN&aff_sub4=AT_0002',
    width: 1280,
    height: 300
  },
  {
    id: 'dat-300x250',
    image: 'https://www.imglnkx.com/9863/DAT-1173_DESIGN-27368_Banners_Holidays_BlackFriday-NSFW_300250.jpg',
    link: 'https://t.datsk11.com/407726/7234?bo=2753,2754,2755,2756&aff_sub5=SF_006OG000004lmDN&aff_sub4=AT_0002',
    width: 300,
    height: 250
  }
];

export const getRandomCrackRevenueBanner = (): CrackRevenueBanner => {
  const randomIndex = Math.floor(Math.random() * crackrevenueBanners.length);
  return crackrevenueBanners[randomIndex];
};

export const recordCrackRevenueBannerClick = (bannerId: string): void => {
  // Track click for analytics
  try {
    const clicks = JSON.parse(localStorage.getItem('crackrevenue_clicks') || '{}');
    clicks[bannerId] = (clicks[bannerId] || 0) + 1;
    localStorage.setItem('crackrevenue_clicks', JSON.stringify(clicks));
  } catch {}
};
