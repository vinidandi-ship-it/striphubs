import type { Model } from '../lib/models';

const mockModels: Model[] = Array.from({ length: 24 }, (_, i) => ({
  username: `model${i + 1}`,
  thumbnail: `https://picsum.photos/seed/model${i + 1}/640/800`,
  viewers: Math.floor(Math.random() * 500),
  tags: ['girl', 'live', 'cam'],
  country: ['US', 'GB', 'DE', 'IT', 'ES', 'FR'][Math.floor(Math.random() * 6)],
  category: ['milf', 'teen', 'blonde', 'brunette', 'asian'][Math.floor(Math.random() * 5)],
  isLive: true,
  clickUrl: `https://stripchat.com/model${i + 1}?userId=affiliate`
}));

export async function GET() {
  return Response.json({ models: mockModels });
}
