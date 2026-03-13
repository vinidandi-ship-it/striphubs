import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { buildLocalizedPath } from '../../i18n/routing';

export default function TagPopolari() {
  const { t, language } = useI18n();

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Link to={buildLocalizedPath('/blog', language)} className="text-accent hover:underline mb-4 inline-block">
          ← {t('blog.backToGuides')}
        </Link>
        <h1 className="text-3xl font-bold text-white sm:text-4xl mb-4">
          {t('tagPopolari.pageTitle')}
        </h1>
        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <span>{t('blog.minRead')}</span>
          <span>•</span>
          <span>{t('blog.listCategory')}</span>
        </div>
      </header>

      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-zinc-300 mb-6">
          {t('tagPopolari.intro')}
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">{t('tagPopolari.section1Title')}</h2>
        <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2">
          <li><strong>Blonde:</strong> {t('tagPopolari.tags.blonde')}</li>
          <li><strong>Brunette:</strong> {t('tagPopolari.tags.brunette')}</li>
          <li><strong>Redhead:</strong> {t('tagPopolari.tags.redhead')}</li>
          <li><strong>Petite:</strong> {t('tagPopolari.tags.petite')}</li>
          <li><strong>Curvy:</strong> {t('tagPopolari.tags.curvy')}</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">{t('tagPopolari.section2Title')}</h2>
        <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2">
          <li><strong>Teen:</strong> {t('tagPopolari.tags.teen')}</li>
          <li><strong>Milf:</strong> {t('tagPopolari.tags.milf')}</li>
          <li><strong>Asian:</strong> {t('tagPopolari.tags.asian')}</li>
          <li><strong>Latina:</strong> {t('tagPopolari.tags.latina')}</li>
          <li><strong>Ebony:</strong> {t('tagPopolari.tags.ebony')}</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">{t('tagPopolari.section3Title')}</h2>
        <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2">
          <li><strong>HD:</strong> {t('tagPopolari.tags.hd')}</li>
          <li><strong>VR:</strong> {t('tagPopolari.tags.vr')}</li>
          <li><strong>Couple:</strong> {t('tagPopolari.tags.couple')}</li>
          <li><strong>Trans:</strong> {t('tagPopolari.tags.trans')}</li>
        </ul>

        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-bold text-white mb-2">{t('tagPopolari.exploreTags')}</h3>
          <p className="text-zinc-300 mb-4">
            {t('tagPopolari.exploreDesc')}
          </p>
          <Link
            to={buildLocalizedPath('/tag/teen', language)}
            className="inline-block bg-accent text-white px-6 py-2 rounded-full font-semibold hover:bg-accent/80 transition-colors"
          >
            {t('tagPopolari.viewPopularTags')}
          </Link>
        </div>
      </div>
    </article>
  );
}
