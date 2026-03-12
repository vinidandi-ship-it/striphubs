const USERNAME_REGEX = /^[a-zA-Z0-9_-]{2,50}$/;
const PLACEMENT_REGEX = /^(card|sidebar|floating_cta|search|profile|banner)$/;

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
  
  let event: ClickEvent;
  try {
    event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON' });
  }
  
  // Validate required fields
  if (!event.username || typeof event.username !== 'string') {
    return res.status(400).json({ error: 'Username is required' });
  }
  
  // Validate username format
  if (!USERNAME_REGEX.test(event.username)) {
    return res.status(400).json({ error: 'Invalid username format' });
  }
  
  // Validate placement
  if (!event.placement || typeof event.placement !== 'string') {
    return res.status(400).json({ error: 'Placement is required' });
  }
  
  if (!PLACEMENT_REGEX.test(event.placement)) {
    return res.status(400).json({ error: 'Invalid placement value' });
  }
  
  // Validate viewers (optional)
  if (event.viewers !== undefined) {
    const viewers = Number(event.viewers);
    if (!Number.isFinite(viewers) || viewers < 0 || viewers > 1000000) {
      return res.status(400).json({ error: 'Invalid viewers value' });
    }
    event.viewers = viewers;
  }
  
  // Validate provider (optional)
  if (event.provider && typeof event.provider !== 'string') {
    return res.status(400).json({ error: 'Invalid provider value' });
  }
  
  // Rate limiting check
  if (clicksStore.length > 10000) {
    clicksStore.shift();
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
