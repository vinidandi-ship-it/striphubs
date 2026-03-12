import type { VercelRequest, VercelResponse } from '@vercel/node';

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{2,50}$/;
const PLACEMENT_REGEX = /^(card|sidebar|floating_cta|sticky|search|profile|banner|exit_intent|footer_cta|inline_cta)$/;

interface ClickEvent {
  username: string;
  placement: string;
  timestamp?: number;
  viewers?: number;
  provider?: string;
  category?: string;
  country?: string;
}

const clicksStore: ClickEvent[] = [];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  let event: ClickEvent;
  try {
    event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  
  if (!event.username || typeof event.username !== 'string') {
    return res.status(400).json({ error: 'Username is required' });
  }
  
  if (!USERNAME_REGEX.test(event.username)) {
    return res.status(400).json({ error: 'Invalid username format' });
  }
  
  if (!event.placement || typeof event.placement !== 'string') {
    return res.status(400).json({ error: 'Placement is required' });
  }
  
  if (!PLACEMENT_REGEX.test(event.placement)) {
    return res.status(400).json({ error: 'Invalid placement value' });
  }
  
  if (event.viewers !== undefined) {
    const viewers = Number(event.viewers);
    if (!Number.isFinite(viewers) || viewers < 0 || viewers > 1000000) {
      return res.status(400).json({ error: 'Invalid viewers value' });
    }
    event.viewers = viewers;
  }
  
  if (event.provider && typeof event.provider !== 'string') {
    return res.status(400).json({ error: 'Invalid provider value' });
  }
  
  clicksStore.push({
    ...event,
    timestamp: event.timestamp || Date.now()
  });
  
  if (clicksStore.length > 10000) {
    clicksStore.shift();
  }
  
  res.setHeader('Cache-Control', 'no-store');
  
  return res.status(200).json({ 
    success: true, 
    tracked: {
      username: event.username,
      provider: event.provider || 'stripchat',
      placement: event.placement
    }
  });
}

export { clicksStore };
