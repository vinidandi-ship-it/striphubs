import type { VercelRequest, VercelResponse } from '@vercel/node';

interface CheckoutRequest {
  email: string;
  plan: 'monthly' | 'yearly';
  price: number;
  currency: string;
  successUrl: string;
  cancelUrl: string;
}

// Mock checkout session storage (in production, use Stripe)
const CHECKOUT_SESSIONS: Map<string, {
  id: string;
  email: string;
  plan: string;
  price: number;
  currency: string;
  status: 'open' | 'complete' | 'expired';
  createdAt: number;
}> = new Map();

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
    const body: CheckoutRequest = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    
    if (!body.email || !body.email.includes('@')) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    if (!['monthly', 'yearly'].includes(body.plan)) {
      return res.status(400).json({ error: 'Invalid plan' });
    }

    // Create mock checkout session
    const sessionId = `cs_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const session = {
      id: sessionId,
      email: body.email,
      plan: body.plan,
      price: body.price,
      currency: body.currency || 'EUR',
      status: 'open',
      createdAt: Date.now()
    };

    CHECKOUT_SESSIONS.set(sessionId, session);

    // In production, this would be a real Stripe checkout URL
    // For now, return a mock URL that would redirect to payment
    const mockCheckoutUrl = `${body.successUrl}?session_id=${sessionId}&email=${encodeURIComponent(body.email)}&plan=${body.plan}`;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-store');
    
    return res.status(200).json({ 
      success: true, 
      url: mockCheckoutUrl,
      sessionId
    });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
}

export { CHECKOUT_SESSIONS };
