import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import {
  SupportedLocale,
  SUPPORTED_LOCALES,
  DEFAULT_LOCALE,
  LOCALE_NAMES,
  LOCALE_FLAGS,
  TranslationKeys
} from './types';

import itTranslations from './locales/it.json';
import enTranslations from './locales/en.json';
import deTranslations from './locales/de.json';
import frTranslations from './locales/fr.json';
import esTranslations from './locales/es.json';
import ptTranslations from './locales/pt.json';

const translations: Record<SupportedLocale, TranslationKeys> = {
  it: itTranslations as TranslationKeys,
  en: enTranslations as TranslationKeys,
  de: deTranslations as TranslationKeys,
  fr: frTranslations as TranslationKeys,
  es: esTranslations as TranslationKeys,
  pt: ptTranslations as TranslationKeys
};

const STORAGE_KEY = 'striphubs_locale';

type NestedKeyOf<ObjectType extends object> = {
  [Key in keyof ObjectType & string]: ObjectType[Key] extends object
    ? `${Key}.${NestedKeyOf<ObjectType[Key]>}`
    : Key;
}[keyof ObjectType & string];

type TranslationKey = NestedKeyOf<TranslationKeys>;

interface I18nContextValue {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: (key: string, params?: Record<string, string>) => string;
  localeName: string;
  localeFlag: string;
  supportedLocales: Array<{ code: SupportedLocale; name: string; flag: string }>;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const getNestedValue = (obj: Record<string, unknown>, path: string): string => {
  const value = path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
  return typeof value === 'string' ? value : path;
};

const interpolate = (str: string, params?: Record<string, string>): string => {
  if (!params) return str;
  return Object.entries(params).reduce(
    (acc, [key, value]) => acc.replace(new RegExp(`\\{${key}\\}`, 'g'), value),
    str
  );
};

const detectBrowserLocale = (): SupportedLocale => {
  const browserLang = navigator.language.split('-')[0].toLowerCase();
  if (SUPPORTED_LOCALES.includes(browserLang as SupportedLocale)) {
    return browserLang as SupportedLocale;
  }
  return DEFAULT_LOCALE;
};

const getStoredLocale = (): SupportedLocale | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LOCALES.includes(stored as SupportedLocale)) {
    return stored as SupportedLocale;
  }
  return null;
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<SupportedLocale>(() => {
    const stored = getStoredLocale();
    return stored || detectBrowserLocale();
  });

  const setLocale = useCallback((newLocale: SupportedLocale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    document.documentElement.lang = newLocale;
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback((key: string, params?: Record<string, string>): string => {
    const translation = getNestedValue(translations[locale] as unknown as Record<string, unknown>, key);
    return interpolate(translation, params);
  }, [locale]);

  const value: I18nContextValue = {
    locale,
    setLocale,
    t,
    localeName: LOCALE_NAMES[locale],
    localeFlag: LOCALE_FLAGS[locale],
    supportedLocales: SUPPORTED_LOCALES.map((code) => ({
      code,
      name: LOCALE_NAMES[code],
      flag: LOCALE_FLAGS[code]
    }))
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}

export { SUPPORTED_LOCALES, DEFAULT_LOCALE, LOCALE_NAMES, LOCALE_FLAGS };
export type { SupportedLocale, TranslationKeys };
