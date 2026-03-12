const POPUNDER_CONFIG = {
  enabled: true,
  frequencyCap: 1,
  frequencyCapHours: 24,
  mobileCpm: 2.00,
  desktopCpm: 3.50,
  networks: [
    { name: 'trafficstars', priority: 1, url: 'https://tsyndicate.com/api/v1/redirect' },
    { name: 'exoclick', priority: 2, url: 'https://main.exoclick.com/click.php' }
  ]
};

interface PopunderState {
  lastShown: number;
  count: number;
  network: string;
}

const getPopunderState = (): PopunderState => {
  try {
    const stored = localStorage.getItem('sh_popunder_state');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {}
  return { lastShown: 0, count: 0, network: '' };
};

const savePopunderState = (state: PopunderState): void => {
  try {
    localStorage.setItem('sh_popunder_state', JSON.stringify(state));
  } catch {}
};

const canShowPopunder = (): boolean => {
  if (!POPUNDER_CONFIG.enabled) return false;
  
  const state = getPopunderState();
  const hoursSinceLastShow = (Date.now() - state.lastShown) / (1000 * 60 * 60);
  
  if (state.count >= POPUNDER_CONFIG.frequencyCap && hoursSinceLastShow < POPUNDER_CONFIG.frequencyCapHours) {
    return false;
  }
  
  return true;
};

export const initPopunder = (): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  
  const handleClick = (e: MouseEvent) => {
    if (!canShowPopunder()) return;
    
    const target = e.target as HTMLElement;
    const isExcluded = target.closest('a[href*="go.mavrtracktor"]') || 
                       target.closest('a[href*="chaturbate"]') ||
                       target.closest('.sh-no-popunder');
    
    if (isExcluded) return;
    
    const state = getPopunderState();
    const network = POPUNDER_CONFIG.networks.find(n => n.name === state.network) || POPUNDER_CONFIG.networks[0];
    
    const popunder = window.open(
      network.url,
      '_blank',
      'width=800,height=600,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no'
    );
    
    if (popunder) {
      popunder.blur();
      window.focus();
      
      state.lastShown = Date.now();
      state.count++;
      state.network = POPUNDER_CONFIG.networks[(POPUNDER_CONFIG.networks.findIndex(n => n.name === state.network) + 1) % POPUNDER_CONFIG.networks.length].name;
      savePopunderState(state);
      
      if (window.gtag) {
        window.gtag('event', 'popunder_shown', {
          event_category: 'exit_traffic',
          event_label: network.name,
          value: /Mobi|Android/i.test(navigator.userAgent) ? POPUNDER_CONFIG.mobileCpm : POPUNDER_CONFIG.desktopCpm
        });
      }
    }
  };
  
  document.addEventListener('click', handleClick, { capture: true });
  
  return () => {
    document.removeEventListener('click', handleClick, { capture: true });
  };
};

export const initExitIntent = (): (() => void) => {
  if (typeof window === 'undefined') return () => {};
  
  let hasTriggered = false;
  
  const handleMouseLeave = (e: MouseEvent) => {
    if (hasTriggered) return;
    if (e.clientY <= 0 && canShowPopunder()) {
      hasTriggered = true;
      
      const event = new CustomEvent('exitIntent', { detail: { timestamp: Date.now() } });
      window.dispatchEvent(event);
      
      if (window.gtag) {
        window.gtag('event', 'exit_intent_triggered', {
          event_category: 'exit_traffic'
        });
      }
    }
  };
  
  document.addEventListener('mouseleave', handleMouseLeave);
  
  return () => {
    document.removeEventListener('mouseleave', handleMouseLeave);
  };
};

export const getExitTrafficStats = (): {
  popunders: number;
  estimatedRevenue: number;
  lastShown: number | null;
} => {
  const state = getPopunderState();
  const avgCpm = (POPUNDER_CONFIG.mobileCpm + POPUNDER_CONFIG.desktopCpm) / 2;
  
  return {
    popunders: state.count,
    estimatedRevenue: (state.count * avgCpm) / 1000,
    lastShown: state.lastShown || null
  };
};

export const estimateMonthlyRevenue = (monthlyPageviews: number): {
  popunders: number;
  revenue: number;
} => {
  const popunderRate = 0.05;
  const avgCpm = 2.75;
  
  const estimatedPopunders = Math.floor(monthlyPageviews * popunderRate);
  const revenue = (estimatedPopunders / 1000) * avgCpm;
  
  return {
    popunders: estimatedPopunders,
    revenue
  };
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
