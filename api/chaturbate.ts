import type { VercelRequest, VercelResponse } from '@vercel/node';

const CHATURBATE_AFFILIATE = 'fxmnz';
const CHATURBATE_API = 'https://chaturbate.com/api/public/affiliates/onlinerooms/';

interface ChaturbateRoom {
  username: string;
  tags: string[];
  num_users: number;
  gender: 'f' | 'm' | 't' | 'c';
  country: string;
  age: number;
  image_url: string;
  image_url_360x270: string;
  chat_room_url: string;
  chat_room_url_revshare: string;
  seconds_online: number;
  current_show: string;
  is_hd: boolean;
  is_new: boolean;
  location: string;
  spoken_languages: string;
}

interface ChaturbateResponse {
  count: number;
  results: ChaturbateRoom[];
}

const GENDER_MAP: Record<string, string> = {
  f: 'girls',
  m: 'men',
  t: 'trans',
  c: 'couples'
};

const normalizeChaturbateRoom = (room: ChaturbateRoom) => {
  const tags = room.tags || [];
  const category = detectCategoryFromTags(tags);
  
  return {
    username: room.username,
    thumbnail: room.image_url_360x270 || room.image_url || `https://placehold.co/360x270/1a1a2e/ffffff?text=${room.username}`,
    viewers: room.num_users || 0,
    tags: tags.map(t => t.toLowerCase().replace(/[^a-z0-9]/g, '')),
    country: room.country || 'N/A',
    category,
    isLive: room.current_show === 'public' && room.seconds_online > 0,
    clickUrl: room.chat_room_url_revshare || room.chat_room_url,
    provider: 'chaturbate' as const,
    age: room.age,
    isHd: room.is_hd,
    isNew: room.is_new,
    secondsOnline: room.seconds_online
  };
};

const detectCategoryFromTags = (tags: string[]): string => {
  const tagStr = tags.join(' ').toLowerCase();
  
  if (/milf|mature|mom|cougar/.test(tagStr)) return 'milf';
  if (/teen|young|18|19|20/.test(tagStr)) return 'teen';
  if (/asian|japanese|chinese|korean|thai/.test(tagStr)) return 'asian';
  if (/latina|latin|brazilian|colombian|mexican/.test(tagStr)) return 'latina';
  if (/blonde|blond|blondes/.test(tagStr)) return 'blonde';
  if (/brunette|brunettes?|brown hair/.test(tagStr)) return 'brunette';
  if (/ebony|black|african/.test(tagStr)) return 'ebony';
  if (/bbw|curvy|plus size|chubby/.test(tagStr)) return 'bbw';
  if (/couple|couples|twosome/.test(tagStr)) return 'couple';
  if (/trans|transgender|ts|shemale/.test(tagStr)) return 'trans';
  if (/lesbian|lesbians|girl.*girl|girl on girl/.test(tagStr)) return 'lesbian';
  if (/gay|gay.?men|gay.?couple/.test(tagStr)) return 'gay';
  
  return 'general';
};

const mapTagToGender = (tag?: string): string[] => {
  if (!tag) return ['f'];
  
  const tagLower = tag.toLowerCase();
  if (tagLower.includes('couple') || tagLower.includes('couples')) return ['c'];
  if (tagLower.includes('trans')) return ['t'];
  if (tagLower.includes('gay') || tagLower.includes('men')) return ['m'];
  if (tagLower.includes('lesbian')) return ['f'];
  
  return ['f'];
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const tag = req.query.tag as string | undefined;
    const gender = req.query.gender as string | undefined;
    
    const url = new URL(CHATURBATE_API);
    url.searchParams.set('wm', CHATURBATE_AFFILIATE);
    url.searchParams.set('client_ip', 'request_ip');
    url.searchParams.set('format', 'json');
    url.searchParams.set('limit', String(limit));
    url.searchParams.set('offset', String(offset));
    
    const genders = gender ? gender.split(',') : mapTagToGender(tag);
    genders.forEach(g => url.searchParams.append('gender', g));
    
    if (tag) {
      const tags = tag.split(',').slice(0, 5);
      tags.forEach(t => {
        const cleaned = t.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
        if (cleaned) url.searchParams.append('tag', cleaned);
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'StripHubs/1.0'
      }
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({ 
        error: 'Chaturbate API error', 
        details: text.slice(0, 200) 
      });
    }

    const data: ChaturbateResponse = await response.json();
    
    const models = data.results
      .filter(room => room.current_show === 'public' && room.num_users > 0)
      .map(normalizeChaturbateRoom)
      .sort((a, b) => b.viewers - a.viewers);

    res.setHeader('Cache-Control', 's-maxage=30, stale-while-revalidate=60');
    res.status(200).json({
      models,
      total: data.count,
      offset,
      hasMore: offset + models.length < data.count,
      provider: 'chaturbate'
    });

  } catch (error) {
    console.error('Chaturbate API error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
