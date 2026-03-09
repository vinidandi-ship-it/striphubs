import { Lang, SUPPORTED_LANGUAGES, useI18n } from '../lib/i18n';

const labels: Record<Lang, string> = {
  en: 'EN',
  it: 'IT',
  es: 'ES',
  fr: 'FR',
  de: 'DE',
  pt: 'PT'
};

export default function LanguageSwitcher() {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-zinc-950/70 p-1">
      {SUPPORTED_LANGUAGES.map((code) => (
        <button
          key={code}
          onClick={() => setLang(code)}
          className={`rounded-full px-2 py-1 text-[11px] font-bold transition ${
            lang === code ? 'bg-accent text-white' : 'text-zinc-400 hover:text-zinc-100'
          }`}
          aria-label={`switch-${code}`}
        >
          {labels[code]}
        </button>
      ))}
    </div>
  );
}
