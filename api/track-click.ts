import type { VercelRequest, VercelResponse } from '@vercel/node';

type ClickEvent = {
  username: string;
  placement: 'card' | 'sticky' | 'profile' | 'search';
  category?: string;
  country?: string;
  viewers?: number;
  timestamp: number;
  referrer: string;
  provider?: string;
};

const clicksStore: ClickEvent[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const event: ClickEvent = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    if (!event.username || !event.placement) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    clicksStore.push({
      ...event,
      timestamp: event.timestamp || Date.now()
    });

    if (clicksStore.length > 10000) {
      clicksStore.shift();
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    
    return res.status(200).json({ 
      success: true, 
      tracked: {
        username: event.username,
        provider: event.provider || 'stripchat',
        placement: event.placement
      }
    });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
}

export { clicksStore };
