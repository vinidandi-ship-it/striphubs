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
    id: 'chaturbate-gif-298x148',
    image: 'https://www.imglnkx.com/3688/thumbs_Chaturbate.gif',
    link: 'https://t.acrsmartcam.com/407726/3688/18345?bo=2779,2778,2777,2776,2775&file_id=262434&po=6533&aff_sub5=SF_006OG000004lmDN&aff_sub4=AT_0002',
    width: 298,
    height: 148
  },
  {
    id: 'gdat-950x250',
    image: 'https://www.imglnkx.com/3785/010770A_GDAT_18_ALL_EN_83_L.jpg',
    link: 'https://t.mbjms.com/407726/3785/0?bo=Array&target=banners&file_id=554069&po=6456&aff_sub5=SF_006OG000004lmDN&aff_sub4=AT_0002',
    width: 950,
    height: 250
  },
  {
    id: 'latexjoy-640x360',
    image: 'https://www.imglnkx.com/6224/JM-645_DESIGN-22450_LATEXJOY_640360.jpg',
    link: 'https://t.ajrkmx1.com/407726/6224/17111?bo=2779,2778,2777,2776,2775&file_id=617408&po=6533&aff_sub5=SF_006OG000004lmDN&aff_sub4=AT_0002',
    width: 640,
    height: 360
  },
  {
    id: 'gdat-928x244',
    image: 'https://www.imglnkx.com/3788/20180402102026-005088A_GDAT_18_ALL_EN_798_L.jpg',
    link: 'https://t.mbjms.com/407726/3788/0?bo=Array&target=banners&file_id=288249&po=6456&aff_sub5=SF_006OG000004lmDN&aff_sub4=AT_0002',
    width: 928,
    height: 244
  },
  {
    id: 'sexmessenger-300x250',
    image: 'https://www.imglnkx.com/9863/DAT-459_DESIGN-23699_SEXMESSENGER_NSFW_300250.jpg',
    link: 'https://t.datsk11.com/407726/7234?bo=2753,2754,2755,2756&aff_sub5=SF_006OG000004lmDN&aff_sub4=AT_0002',
    width: 300,
    height: 250
  }
];

export const getAllCrackRevenueBanners = (): CrackRevenueBanner[] => crackrevenueBanners;

export const getRandomCrackRevenueBanner = (): CrackRevenueBanner => {
  const randomIndex = Math.floor(Math.random() * crackrevenueBanners.length);
  return crackrevenueBanners[randomIndex];
};

export const recordCrackRevenueBannerClick = (bannerId: string): void => {
  try {
    const clicks = JSON.parse(localStorage.getItem('crackrevenue_clicks') || '{}');
    clicks[bannerId] = (clicks[bannerId] || 0) + 1;
    localStorage.setItem('crackrevenue_clicks', JSON.stringify(clicks));
  } catch {}
};
