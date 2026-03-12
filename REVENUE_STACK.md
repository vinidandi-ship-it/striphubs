# StripHubs Revenue Stack - Documentazione Completa

## Panoramica Revenue Stack

Lo stack è progettato per massimizzare il revenue per ogni visitatore attraverso 5 livelli di monetizzazione.

---

## LIVELLO 1: Primary Affiliate (Stripchat + Chaturbate)
**Priorità: CRITICA (1/5)**

### Implementazione
```typescript
// Già implementato in: src/lib/affiliateProviders.ts
// Rotazione 60/40 con ottimizzazione automatica basata su performance

// Uso in ModelCard:
const { url, provider } = getAffiliateUrlWithProvider(username);
// URL: https://go.mavrtracktor.com?userId=...&model=username
// URL: https://chaturbate.com/in/?track=...&room=username
```

### Tracking
- Impression tracking automatico
- Click tracking con localStorage
- Performance-based rotation dopo 50 click

### Stima Revenue Mensile
| Traffico | CTR | Conversioni | Revenue |
|----------|-----|-------------|---------|
| 10K visitatori | 3% | 300 | $75-150 |
| 50K visitatori | 3% | 1,500 | $375-750 |
| 100K visitatori | 3% | 3,000 | $750-1,500 |
| 500K visitatori | 3% | 15,000 | $3,750-7,500 |

---

## LIVELLO 2: Exit Traffic Monetization
**Priorità: ALTA (2/5)**

### Implementazione
```typescript
// File: src/lib/revenue/exitTraffic.ts

// Inizializzazione automatica in App.tsx
initPopunder(); // Popunder su click (frequency cap: 1/24h)
initExitIntent(); // Exit intent detection

// Network: TrafficStars (priority 1), ExoClick (priority 2)
// CPM: $2.00 mobile, $3.50 desktop
```

### Configurazione
- Frequency cap: 1 popunder ogni 24 ore
- Esclusioni: link affiliate, elementi con classe `.sh-no-popunder`
- Trigger: click su elementi non esclusi

### Stima Revenue Mensile
| Traffico | Popunder Rate | Impression | Revenue |
|----------|---------------|------------|---------|
| 10K PV | 5% | 500 | $1.38 |
| 50K PV | 5% | 2,500 | $6.88 |
| 100K PV | 5% | 5,000 | $13.75 |
| 500K PV | 5% | 25,000 | $68.75 |

---

## LIVELLO 3: Email Capture
**Priorità: MEDIA (3/5)**

### Implementazione
```typescript
// File: src/lib/revenue/emailCapture.ts

// Trigger multipli:
// - 30 secondi delay
// - Exit intent
// - 50% scroll

// Popup: src/components/RevenueStack.tsx
// Webhook: /api/subscribe (da implementare)
```

### Configurazione
- Delay popup: 30 secondi
- Exit intent: abilitato
- Scroll threshold: 50%
- Frequency cap: 3 dismissal / 7 giorni
- Conversion value: $0.50/email/mese

### Stima Revenue Mensile
| Visitatori | Capture Rate | Subs | Revenue |
|------------|--------------|------|---------|
| 10K | 2% | 200 | $100 |
| 50K | 2% | 1,000 | $500 |
| 100K | 2% | 2,000 | $1,000 |
| 500K | 2% | 10,000 | $5,000 |

---

## LIVELLO 4: Display Ads
**Priorità: BASSA (4/5)**

### Implementazione
```typescript
// File: src/lib/revenue/displayAds.ts

// Native Ads: ogni 6 card
<NativeAdSlot cardIndex={index} />

// Premium Banner: per non-converting users
<PremiumBanner /> // Appare dopo 3 click affiliate senza conversione
```

### Configurazione
- Native ad interval: ogni 6 card
- Premium banner threshold: 3 affiliate click senza conversione
- CPM Native: $0.80 mobile, $1.20 desktop
- CPM Premium: $2.00 mobile, $3.50 desktop

### Stima Revenue Mensile
| Pageviews | Native (15%) | Premium (5%) | Total |
|-----------|--------------|--------------|-------|
| 30K | $3.60 | $4.13 | $7.73 |
| 150K | $18.00 | $20.63 | $38.63 |
| 300K | $36.00 | $41.25 | $77.25 |
| 1.5M | $180.00 | $206.25 | $386.25 |

---

## LIVELLO 5: Premium/VIP Upsell
**Priorità: BASSA (5/5)**

### Implementazione
```typescript
// File: src/lib/revenue/premium.ts

// Trigger: exit intent + 5 affiliate click senza conversione
// Checkout: /api/create-checkout-session (Stripe)
// Price: €4.99/mese, €49.90/anno

// Features VIP:
- No ads
- Favoriti illimitati
- Ricerca avanzata
- Modelle esclusive
- Thumbnail HD
- Supporto prioritario
```

### Configurazione
- Target conversion rate: 1%
- Trial: 7 giorni gratuiti
- Payment provider: Stripe

### Stima Revenue Mensile (MRR)
| Visitatori | Conv Rate | Premium | MRR |
|------------|-----------|---------|-----|
| 10K | 1% | 100 | $499 |
| 50K | 1% | 500 | $2,495 |
| 100K | 1% | 1,000 | $4,990 |
| 500K | 1% | 5,000 | $24,950 |

---

## Revenue Totale Stimato (100K visitatori/mese)

| Livello | Fonte | Revenue Mensile |
|---------|-------|-----------------|
| 1 | Primary Affiliate | $750-1,500 |
| 2 | Exit Traffic | $13.75 |
| 3 | Email Capture | $1,000 |
| 4 | Display Ads | $77.25 |
| 5 | Premium VIP | $4,990 |
| **TOTALE** | | **$6,831-7,581** |

---

## Implementazione Rapida

### 1. Setup variabili ambiente
```env
# .env
VITE_STRIPCHAT_AFFILIATE_ID=d28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881
VITE_CHATURBATE_AFFILIATE_ID=your_chaturbate_id
VITE_EMAIL_WEBHOOK_URL=/api/subscribe
```

### 2. File da creare (✅ completato)
```
src/lib/revenue/
├── affiliateRotator.ts  ✅
├── exitTraffic.ts       ✅
├── emailCapture.ts      ✅
├── displayAds.ts        ✅
├── premium.ts           ✅
└── index.ts             ✅

src/components/
├── RevenueStack.tsx     ✅
├── NativeAdSlot.tsx     ✅
└── PremiumBanner.tsx    ✅
```

### 3. Integrazione App.tsx (✅ completato)
```tsx
import { initRevenueStack } from './lib/revenue';
import RevenueStack from './components/RevenueStack';
import PremiumBanner from './components/PremiumBanner';
import NativeAdSlot from './components/NativeAdSlot';

// In AppContent:
useEffect(() => {
  const cleanup = initRevenueStack();
  return cleanup;
}, []);

// Nel JSX:
<Footer />
<PremiumBanner />
<RevenueStack />
```

### 4. API Endpoints da implementare
```typescript
// /api/subscribe - Email subscription webhook
// /api/create-checkout-session - Stripe checkout
// /api/track-click - Click tracking (opzionale)
```

---

## Ottimizzazione Continua

### A/B Testing Suggeriti
1. **Email popup timing**: 15s vs 30s vs exit-only
2. **Premium price**: €4.99 vs €6.99 vs €9.99
3. **Native ad frequency**: ogni 4, 6, o 8 card
4. **Affiliate rotation**: 60/40 vs 70/30 vs 50/50

### Metriche da Monitorare
- Affiliate CTR per provider
- Email capture rate
- Premium conversion rate
- Popunder trigger rate
- Ad CTR (native vs premium)
- Revenue per visitor (RPV)

---

## Note Tecniche

### Privacy & Compliance
- Tutti i sistemi rispettano GDPR/CCPA
- localStorage per tracking (no cookies third-party)
- Opzione opt-out per utenti premium

### Performance
- Lazy loading per popup
- Intersection Observer per ad impressions
- sendBeacon per tracking asincrono
- Zero impact su Core Web Vitals

### Scalabilità
- Sistema modulare (attiva/disattiva per livello)
- Configurazione centralizzata
- Facile aggiunta nuovi network/affiliate
