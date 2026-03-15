import { VercelRequest, VercelResponse } from '@vercel/node';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface SubscribeRequest {
  email?: string;
  source?: string;
  tags?: string[];
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

  let body: SubscribeRequest;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }

  if (!body.email || typeof body.email !== 'string') {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  if (!EMAIL_REGEX.test(body.email)) {
    return res.status(400).json({ error: 'Invalid email format' });
  }
  
  if (!body.source || typeof body.source !== 'string') {
    return res.status(400).json({ error: 'Source is required' });
  }
  
  if (body.tags && !Array.isArray(body.tags)) {
    return res.status(400).json({ error: 'Tags must be an array' });
  }

  const exists = SUBSCRIBERS_STORE.some(s => s.email === body.email!.toLowerCase());
  if (exists) {
    return res.status(200).json({ success: true, message: 'Email already subscribed' });
  }
  
  SUBSCRIBERS_STORE.push({
    email: body.email.toLowerCase(),
    source: body.source,
    tags: body.tags || [],
    timestamp: Date.now()
  });

  if (SUBSCRIBERS_STORE.length > 10000) {
    SUBSCRIBERS_STORE.shift();
  }
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');
  res.status(201).json({ 
    success: true,
    message: 'Successfully subscribed'
  });
}

export { SUBSCRIBERS_STORE };
