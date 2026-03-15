import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { buildLocalizedPath } from '../../i18n/routing';

export default function MiglioriModelleItaliane() {
  const { t, language } = useI18n();

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Link to={buildLocalizedPath('/blog', language)} className="text-accent hover:underline mb-4 inline-block">
          ← {t('blog.backToGuides')}
        </Link>
        <h1 className="text-3xl font-bold text-white sm:text-4xl mb-4">
          {t('miglioriModelle.pageTitle')}
        </h1>
        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <span>3 {t('blog.minRead')}</span>
          <span>•</span>
          <span>{t('blog.listCategory')}</span>
        </div>
      </header>

      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-zinc-300 mb-6">
          {t('miglioriModelle.intro')}
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">{t('miglioriModelle.section1Title')}</h2>
        <p className="text-zinc-300 mb-4">
          {t('miglioriModelle.section1Content')}
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">{t('miglioriModelle.section2Title')}</h2>
        <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2">
          {(t('miglioriModelle.categories') as unknown as string[]).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">{t('miglioriModelle.section3Title')}</h2>
        <p className="text-zinc-300 mb-4">
          {t('miglioriModelle.section3Content')}
        </p>

        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-bold text-white mb-2">{t('miglioriModelle.exploreTitle')}</h3>
          <p className="text-zinc-300 mb-4">
            {t('miglioriModelle.exploreDesc')}
          </p>
          <Link
            to={buildLocalizedPath('/country/italian', language)}
            className="inline-block bg-accent text-white px-6 py-2 rounded-full font-semibold hover:bg-accent/80 transition-colors"
          >
            {t('miglioriModelle.ctaButton')}
          </Link>
        </div>
      </div>
    </article>
  );
}
