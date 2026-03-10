import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SupportedLocale } from './types';
import { useI18n } from './index';

interface LanguageSwitcherProps {
  compact?: boolean;
}

export function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { locale, setLocale, supportedLocales, localeFlag, localeName } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLocaleChange = (newLocale: SupportedLocale) => {
    setLocale(newLocale);
    setIsOpen(false);
    
    const currentPath = window.location.pathname;
    const pathWithoutLocale = currentPath.replace(/^\/(it|en|de|fr|es|pt)(\/|$)/, '/');
    
    if (newLocale === 'it') {
      navigate(pathWithoutLocale || '/', { replace: true });
    } else {
      const cleanPath = pathWithoutLocale === '/' ? '' : pathWithoutLocale;
      navigate(`/${newLocale}${cleanPath}`, { replace: true });
    }
  };

  if (compact) {
    return (
      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 rounded-xl px-3 py-2 text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all"
          aria-label="Change language"
        >
          <span>{localeFlag}</span>
          <svg className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isOpen && (
          <div className="absolute right-0 top-full mt-1 w-36 bg-panel border border-border rounded-xl shadow-xl z-50">
            {supportedLocales.map((loc) => (
              <button
                key={loc.code}
                onClick={() => handleLocaleChange(loc.code)}
                className={`flex w-full items-center gap-2 px-4 py-2 text-sm first:rounded-t-xl last:rounded-b-xl transition-colors ${
                  loc.code === locale
                    ? 'bg-accent/20 text-accent'
                    : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
                }`}
              >
                <span>{loc.flag}</span>
                <span>{loc.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-xl border border-border bg-panel px-4 py-2 text-sm font-medium text-zinc-300 hover:text-white hover:border-accent transition-all"
        aria-label="Change language"
      >
        <span>{localeFlag}</span>
        <span>{localeName}</span>
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-panel border border-border rounded-xl shadow-xl z-50">
          {supportedLocales.map((loc) => (
            <button
              key={loc.code}
              onClick={() => handleLocaleChange(loc.code)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-sm first:rounded-t-xl last:rounded-b-xl transition-colors ${
                loc.code === locale
                  ? 'bg-accent/20 text-accent'
                  : 'text-zinc-300 hover:text-white hover:bg-zinc-800/50'
              }`}
            >
              <span className="text-lg">{loc.flag}</span>
              <span>{loc.name}</span>
              {loc.code === locale && (
                <svg className="w-4 h-4 ml-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
