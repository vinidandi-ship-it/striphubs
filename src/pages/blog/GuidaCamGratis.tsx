import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { buildLocalizedPath } from '../../i18n/routing';
import ShareButtons from '../../components/ShareButtons';

export default function GuidaCamGratis() {
  const { t, language } = useI18n();

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Link to={buildLocalizedPath('/blog', language)} className="text-accent hover:underline mb-4 inline-block">
          ← {t('blog.backToGuides')}
        </Link>
        <h1 className="text-3xl font-bold text-white sm:text-4xl mb-4">
          {t('guidaCamGratis.pageTitle')}
        </h1>
        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <span>5 {t('blog.minRead')}</span>
          <span>•</span>
          <span>{t('blog.guideCategory')}</span>
        </div>
      </header>

      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-zinc-300 mb-6">
          {t('guidaCamGratis.intro')}
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">{t('guidaCamGratis.section1Title')}</h2>
        <p className="text-zinc-300 mb-4">
          {t('guidaCamGratis.section1Content')}
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">{t('guidaCamGratis.section2Title')}</h2>
        <p className="text-zinc-300 mb-4">
          {t('guidaCamGratis.section2Content')}
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">{t('guidaCamGratis.section3Title')}</h2>
        <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2">
          {(t('guidaCamGratis.section3List') as unknown as string[]).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>

        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-bold text-white mb-2">{t('guidaCamGratis.exploreTitle')}</h3>
          <p className="text-zinc-300 mb-4">
            {t('guidaCamGratis.exploreDesc')}
          </p>
          <Link
            to={buildLocalizedPath('/live', language)}
            className="inline-block bg-accent text-white px-6 py-2 rounded-full font-semibold hover:bg-accent/80 transition-colors"
          >
            {t('guidaCamGratis.ctaButton')}
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <ShareButtons 
            url={`https://striphubs.com/blog/guida-cam-gratis`} 
            title={t('guidaCamGratis.pageTitle')} 
          />
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-lg font-bold text-white mb-4">{t('guidaCamGratis.relatedTitle')}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to={buildLocalizedPath('/blog/migliori-modelle-italiane', language)}
              className="block p-4 bg-bg-card border border-border rounded-xl hover:border-accent transition-colors"
            >
              <h4 className="font-semibold text-white mb-1">{t('guidaCamGratis.related1Title')}</h4>
              <p className="text-sm text-zinc-400">{t('guidaCamGratis.related1Desc')}</p>
            </Link>
            <Link
              to={buildLocalizedPath('/blog/sicurezza-cam', language)}
              className="block p-4 bg-bg-card border border-border rounded-xl hover:border-accent transition-colors"
            >
              <h4 className="font-semibold text-white mb-1">{t('guidaCamGratis.related2Title')}</h4>
              <p className="text-sm text-zinc-400">{t('guidaCamGratis.related2Desc')}</p>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
