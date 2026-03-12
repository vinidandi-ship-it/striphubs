import type { VercelRequest, VercelResponse } from '@vercel/node';

interface SubscribeRequest {
  email: string;
  source: string;
  tags: string[];
}

const SUBSCRIBERS_STORE: Array<{
  email: string;
  source: string;
  tags: string[];
  timestamp: number;
}> = [];

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
    const body: SubscribeRequest = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    if (!body.email || !body.email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Check for duplicates
    const existing = SUBSCRIBERS_STORE.find(s => s.email.toLowerCase() === body.email.toLowerCase());
    if (existing) {
      return res.status(200).json({ success: true, message: 'Email already subscribed' });
    }

    // Store subscriber
    SUBSCRIBERS_STORE.push({
      email: body.email.toLowerCase(),
      source: body.source || 'unknown',
      tags: body.tags || [],
      timestamp: Date.now()
    });

    // Keep only last 10000 subscribers
    if (SUBSCRIBERS_STORE.length > 10000) {
      SUBSCRIBERS_STORE.shift();
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    
    return res.status(200).json({ 
      success: true, 
      message: 'Subscription successful',
      subscriber: {
        email: body.email,
        source: body.source,
        tags: body.tags
      }
    });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
}

export { SUBSCRIBERS_STORE };
