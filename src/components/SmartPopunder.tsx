import { useEffect, useRef, useCallback } from 'react';
import { getClickHistory } from '../lib/affiliateTracking';
import { getAffiliateUrlWithProvider } from '../lib/affiliateProviders';
import { isPremiumUser } from '../lib/revenue';

const CLICK_THRESHOLD = 1;
const STORAGE_KEY = 'sh_smart_popunder';
const COOLDOWN_MINUTES = 5;

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
  const minutesSinceLastShow = (Date.now() - state.lastShown) / (1000 * 60);
  return minutesSinceLastShow < COOLDOWN_MINUTES;
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

  // Timer-based popup - appears every 30 seconds if not converted
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (isPremiumUser()) return;
    if (isWithinCooldown()) return;
    if (hasConverted()) return;

    const POPUP_INTERVAL_MS = 30000; // 30 seconds

    const intervalId = setInterval(() => {
      if (isWithinCooldown() || hasConverted() || triggeredRef.current) return;
      
      triggeredRef.current = true;
      const { url } = getAffiliateUrlWithProvider('stripchat');
      
      const isMobile = /Mobi|Android/i.test(navigator.userAgent);
      const width = isMobile ? window.innerWidth : 800;
      const height = isMobile ? window.innerHeight : 600;
      
      const popunder = window.open(
        url,
        '_blank',
        `width=${width},height=${height},scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no`
      );

      if (popunder) {
        popunder.blur();
        window.focus();
        savePopunderState({
          lastShown: Date.now(),
          shown: true
        });

        if (window.gtag) {
          window.gtag('event', 'smart_popunder_timer_triggered', {
            event_category: 'conversion'
          });
        }
      }
    }, POPUP_INTERVAL_MS);

    return () => clearInterval(intervalId);
  }, []);

  // Click-based popup
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
            
            // Determine dimensions based on device
            const isMobile = /Mobi|Android/i.test(navigator.userAgent);
            const width = isMobile ? window.innerWidth : 800;
            const height = isMobile ? window.innerHeight : 600;
            
            const popunder = window.open(
              url,
              '_blank',
              `width=${width},height=${height},scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=no,status=no`
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
