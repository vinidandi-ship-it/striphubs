import { useEffect, useRef, useCallback } from 'react';
import { getClickHistory } from '../lib/affiliateTracking';
import { getAffiliateUrlWithProvider } from '../lib/affiliateProviders';
import { isPremiumUser } from '../lib/revenue';

const CLICK_THRESHOLD = 3;
const STORAGE_KEY = 'sh_smart_popunder';
const COOLDOWN_HOURS = 24;

interface PopunderState {
  lastShown: number;
  shown: boolean;
}

const getPopunderState = (): PopunderState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { lastShown: 0, shown: false };
};

const savePopunderState = (state: PopunderState): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
};

const isWithinCooldown = (): boolean => {
  const state = getPopunderState();
  const hoursSinceLastShow = (Date.now() - state.lastShown) / (1000 * 60 * 60);
  return hoursSinceLastShow < COOLDOWN_HOURS;
};

const hasConverted = (): boolean => {
  const history = getClickHistory();
  if (history.length === 0) return false;
  
  const recentClicks = history.filter(
    (c) => Date.now() - c.timestamp < 30 * 60 * 1000
  );
  
  return recentClicks.some((c) => c.placement === 'profile' || c.viewers === undefined);
};

export function useSmartPopunder() {
  const clickCountRef = useRef(0);
  const triggeredRef = useRef(false);

  const checkAndTrigger = useCallback(() => {
    if (isPremiumUser()) return;
    if (triggeredRef.current) return;
    if (isWithinCooldown()) return;
    if (hasConverted()) return;

    const history = getClickHistory();
    const recentClicks = history.filter(
      (c) => Date.now() - c.timestamp < 10 * 60 * 1000
    );

    clickCountRef.current = recentClicks.length;

    if (clickCountRef.current >= CLICK_THRESHOLD) {
      triggeredRef.current = true;
      return true;
    }

    return false;
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      const isAffiliateLink = 
        target.closest('a[href*="go.mavrtracktor"]') ||
        target.closest('a[href*="chaturbate"]') ||
        target.closest('.sh-btn-primary');
      
      if (isAffiliateLink) return;

      if (checkAndTrigger()) {
        const history = getClickHistory();
        const lastClick = history[history.length - 1];
        
        if (lastClick) {
          const { url } = getAffiliateUrlWithProvider(lastClick.username);
          
          const popunder = window.open(
            url,
            '_blank',
            'width=800,height=600,scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no'
          );

          if (popunder) {
            popunder.blur();
            window.focus();

            savePopunderState({
              lastShown: Date.now(),
              shown: true
            });

            if (window.gtag) {
              window.gtag('event', 'smart_popunder_triggered', {
                event_category: 'conversion',
                clicks_before_trigger: clickCountRef.current,
                model: lastClick.username
              });
            }
          }
        }
      }
    };

    document.addEventListener('click', handleClick, { capture: true });
    return () => document.removeEventListener('click', handleClick, { capture: true });
  }, [checkAndTrigger]);

  return {
    clickCount: clickCountRef.current,
    threshold: CLICK_THRESHOLD,
    canTrigger: !isWithinCooldown() && !hasConverted()
  };
}

export default function SmartPopunder() {
  useSmartPopunder();
  return null;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}
