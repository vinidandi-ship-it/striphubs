import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { translations, Language } from './translations';

const LOCALE_FLAGS: Record<Language, string> = {
  it: '🇮🇹',
  en: '🇬🇧',
  de: '🇩🇪',
  fr: '🇫🇷',
  es: '🇪🇸',
  pt: '🇵🇹'
};

const LOCALE_NAMES: Record<Language, string> = {
  it: 'Italiano',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  es: 'Español',
  pt: 'Português'
};

type I18nContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  locale: Language;
  setLocale: (lang: Language) => void;
  supportedLocales: Array<{ code: Language; name: string; flag: string }>;
  localeFlag: string;
  localeName: string;
};

const I18nContext = createContext<I18nContextType | null>(null);

const SUPPORTED_LANGUAGES: Language[] = ['it', 'en', 'de', 'fr', 'es', 'pt'];
const DEFAULT_LANGUAGE: Language = 'en';

const detectLanguage = (): Language => {
  if (typeof window === 'undefined') return DEFAULT_LANGUAGE;
  
  const stored = localStorage.getItem('striphubs-language');
  if (stored && SUPPORTED_LANGUAGES.includes(stored as Language)) {
    return stored as Language;
  }
  
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  if (SUPPORTED_LANGUAGES.includes(browserLang as Language)) {
    return browserLang as Language;
  }
  
  return DEFAULT_LANGUAGE;
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(DEFAULT_LANGUAGE);
  
  useEffect(() => {
    const detected = detectLanguage();
    setLanguageState(detected);
  }, []);
  
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('striphubs-language', lang);
    document.documentElement.lang = lang;
  };
  
  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    if (typeof value !== 'string') return key;
    
    if (params) {
      return Object.entries(params).reduce(
        (str, [paramKey, paramValue]) => str.replace(`{${paramKey}}`, paramValue),
        value
      );
    }
    
    return value;
  };
  
  const supportedLocales = SUPPORTED_LANGUAGES.map(code => ({
    code,
    name: LOCALE_NAMES[code],
    flag: LOCALE_FLAGS[code]
  }));
  
  return (
    <I18nContext.Provider value={{ 
      language, 
      setLanguage, 
      t,
      locale: language,
      setLocale: setLanguage,
      supportedLocales,
      localeFlag: LOCALE_FLAGS[language],
      localeName: LOCALE_NAMES[language]
    }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

export { SUPPORTED_LANGUAGES };
