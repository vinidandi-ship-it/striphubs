export const REVENUE_CONFIG = {
  affiliate: {
    stripchat: {
      weight: 60,
      minWeight: 20,
      maxWeight: 80,
      affiliateId: import.meta.env.VITE_STRIPCHAT_AFFILIATE_ID || 'd28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881',
      baseUrl: 'https://go.mavrtracktor.com'
    },
    chaturbate: {
      weight: 40,
      minWeight: 20,
      maxWeight: 80,
      affiliateId: import.meta.env.VITE_CHATURBATE_AFFILIATE_ID || '',
      baseUrl: 'https://chaturbate.com/in'
    },
    optimizationThreshold: 100,
    autoOptimize: true
  },
  
  exitTraffic: {
    enabled: true,
    popunder: {
      frequencyCap: 1,
      frequencyCapHours: 24,
      networks: [
        { name: 'trafficstars', priority: 1, zoneId: '' },
        { name: 'exoclick', priority: 2, zoneId: '' }
      ]
    },
    exitIntent: {
      enabled: true,
      cooldown: 30000
    },
    cpm: {
      mobile: 2.00,
      desktop: 3.50
    }
  },
  
  email: {
    enabled: true,
    popup: {
      delay: 30000,
      scrollThreshold: 50,
      exitIntent: true,
      frequencyCap: 3,
      frequencyCapDays: 7
    },
    newsletter: {
      valuePerEmail: 0.50,
      provider: 'mailchimp',
      apiKey: import.meta.env.VITE_MAILCHIMP_API_KEY || '',
      listId: import.meta.env.VITE_MAILCHIMP_LIST_ID || ''
    },
    tags: ['striphubs', 'cam-girls', 'adult-content']
  },
  
  displayAds: {
    enabled: true,
    native: {
      enabled: true,
      interval: 6,
      cpm: { mobile: 0.80, desktop: 1.20 },
      network: 'mgid',
      zoneId: import.meta.env.VITE_MGID_ZONE_ID || ''
    },
    premium: {
      enabled: true,
      threshold: 3,
      cpm: { mobile: 2.00, desktop: 3.50 },
      network: 'trafficstars',
      zoneId: import.meta.env.VITE_TRAFFICSTARS_ZONE_ID || ''
    }
  },
  
  premium: {
    enabled: true,
    price: {
      monthly: 4.99,
      yearly: 49.90,
      currency: 'EUR'
    },
    trialDays: 7,
    targetConversionRate: 0.01,
    upgradeThreshold: 5,
    stripe: {
      publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || '',
      monthlyPriceId: import.meta.env.VITE_STRIPE_MONTHLY_PRICE_ID || '',
      yearlyPriceId: import.meta.env.VITE_STRIPE_YEARLY_PRICE_ID || ''
    },
    features: [
      'no-ads',
      'unlimited-favorites',
      'advanced-search',
      'exclusive-models',
      'hd-thumbnails',
      'priority-support'
    ]
  },
  
  tracking: {
    googleAnalytics: true,
    customEvents: true,
    localStorage: true,
    sessionTimeout: 30 * 60 * 1000
  }
} as const;

export type RevenueConfig = typeof REVENUE_CONFIG;
