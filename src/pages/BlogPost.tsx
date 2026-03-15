import { 
  Banner728x90, 
  Banner300x250, 
  Banner728x90Second,
  RecommendationWidget,
  NativeAd,
  MultiformatAd,
  MultiformatV2,
  InstantMessage
} from '../components/BannerAds';
import CrackRevenueBanner from '../components/CrackRevenueBanner';
import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { getBlogPostBySlug, getRelatedPosts, BlogPost } from '../lib/blogContent';
import { upsertJsonLd, useSEO } from '../lib/seo';
import Breadcrumbs from '../components/Breadcrumbs';
import FAQSection from '../components/FAQSection';
import RelatedPosts from '../components/RelatedPosts';
import { SITE_NAME, SITE_URL } from '../lib/models';

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { language, t } = useI18n();
  const post = slug ? getBlogPostBySlug(slug) : undefined;

  const title = post ? post.title[language] : '';
  const description = post ? post.description[language] : '';
  const url = post ? `${SITE_URL}/blog/${post.slug}` : '';

  useSEO(
    title ? `${title} | ${SITE_NAME}` : 'Blog',
    description || '',
    `/blog/${slug || ''}`,
    language
  );

  useEffect(() => {
    if (post) {
      upsertJsonLd('article-jsonld', {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: title,
        description,
        author: {
          '@type': 'Organization',
          name: SITE_NAME
        },
        publisher: {
          '@type': 'Organization',
          name: SITE_NAME,
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/icon-512.png`
          }
        },
        datePublished: post.publishDate,
        dateModified: post.lastModified,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': url
        }
      });
    }
  }, [post, title, description, url]);

  if (!post) {
    return (
      <div className="rounded-2xl border border-border bg-panel p-8 text-center">
        <h1 className="text-2xl font-bold">{t('blog.notFound')}</h1>
        <Link to="/" className="mt-4 inline-block text-accent hover:underline">
          {t('common.backToHome')}
        </Link>
      </div>
    );
  }

  const relatedPosts = getRelatedPosts(post, 5);
  const h1 = post.h1[language];

  return (
    <div className="space-y-8">
      <Breadcrumbs
        items={[
          { label: t('nav.home'), to: '/' },
          { label: t('nav.blog'), to: '/blog' },
          { label: h1 }
        ]}
      />

      <article className="rounded-2xl border border-border bg-panel p-6 md:p-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold md:text-4xl">{h1}</h1>
          <p className="mt-4 text-lg text-zinc-400">{description}</p>
          <div className="mt-4 flex gap-4 text-sm text-zinc-500">
            <span>{t('blog.published')}: {post.publishDate}</span>
            <span>{t('blog.updated')}: {post.lastModified}</span>
          </div>
        </header>

        <div className="prose prose-invert max-w-none">
          <BlogContent post={post} language={language} />
        </div>

        <FAQSection 
          category={post.category}
          country={post.country}
          language={language}
        />
      </article>

      {relatedPosts.length > 0 && (
        <RelatedPosts posts={relatedPosts} language={language} />
      )}

      <div className="space-y-1 my-2">
        <div className="flex justify-center">
          <Banner728x90 className="hidden md:block" />
          <Banner300x250 className="md:hidden" />
        </div>
        <CrackRevenueBanner />
      </div>
    </div>
  );
}

function BlogContent({ post, language }: { post: BlogPost; language: string }) {
  const { t } = useI18n();
  
  if (post.type === 'best-category-cams' && post.category) {
    return (
      <>
        <p className="lead">
          {t('blog.bestCategoryIntro', { 
            category: post.category,
            count: String(Math.floor(Math.random() * 50) + 100)
          })}
        </p>
        
        <h2>{t('blog.whatAreCategoryCams', { category: post.category })}</h2>
        <p>
          {t('blog.categoryDescription', { category: post.category })}
        </p>

        <h2>{t('blog.whyChooseCategory', { category: post.category })}</h2>
        <ul>
          <li>{t('blog.benefit1', { category: post.category })}</li>
          <li>{t('blog.benefit2', { category: post.category })}</li>
          <li>{t('blog.benefit3', { category: post.category })}</li>
        </ul>

        <h2>{t('blog.howToFind')}</h2>
        <p>{t('blog.howToFindDescription')}</p>
        <ol>
          <li>{t('blog.step1')}</li>
          <li>{t('blog.step2')}</li>
          <li>{t('blog.step3')}</li>
        </ol>

        <h2>{t('blog.tips')}</h2>
        <p>{t('blog.tipsDescription')}</p>

        <h2>{t('blog.conclusion')}</h2>
        <p>
          {t('blog.bestCategoryConclusion', { category: post.category })}
        </p>
      </>
    );
  }

  if (post.type === 'category-vs-category' && post.category && post.category2) {
    return (
      <>
        <p className="lead">
          {t('blog.comparisonIntro', { 
            cat1: post.category, 
            cat2: post.category2 
          })}
        </p>

        <h2>{t('blog.mainDifferences')}</h2>
        <table>
          <thead>
            <tr>
              <th>{post.category}</th>
              <th>{post.category2}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{t('blog.cat1Feature1', { cat: post.category })}</td>
              <td>{t('blog.cat2Feature1', { cat: post.category2 })}</td>
            </tr>
            <tr>
              <td>{t('blog.cat1Feature2', { cat: post.category })}</td>
              <td>{t('blog.cat2Feature2', { cat: post.category2 })}</td>
            </tr>
            <tr>
              <td>{t('blog.cat1Feature3', { cat: post.category })}</td>
              <td>{t('blog.cat2Feature3', { cat: post.category2 })}</td>
            </tr>
          </tbody>
        </table>

        <h2>{t('blog.whoShouldChoose', { cat: post.category })}</h2>
        <p>{t('blog.cat1Audience', { cat: post.category })}</p>

        <h2>{t('blog.whoShouldChoose', { cat: post.category2 })}</h2>
        <p>{t('blog.cat2Audience', { cat: post.category2 })}</p>

        <h2>{t('blog.verdict')}</h2>
        <p>{t('blog.comparisonConclusion', { cat1: post.category, cat2: post.category2 })}</p>
      </>
    );
  }

  if (post.type === 'top-category-by-country' && post.category && post.country) {
    return (
      <>
        <p className="lead">
          {t('blog.countryCategoryIntro', { 
            category: post.category,
            country: post.country 
          })}
        </p>

        <h2>{t('blog.whyCountryCategory', { country: post.country, category: post.category })}</h2>
        <p>{t('blog.countryCategoryDescription')}</p>

        <h2>{t('blog.whatMakesSpecial', { country: post.country })}</h2>
        <ul>
          <li>{t('blog.countryFeature1', { country: post.country })}</li>
          <li>{t('blog.countryFeature2', { country: post.country })}</li>
          <li>{t('blog.countryFeature3', { country: post.country })}</li>
        </ul>

        <h2>{t('blog.howToConnect')}</h2>
        <p>{t('blog.howToConnectDescription')}</p>

        <h2>{t('blog.tips')}</h2>
        <p>{t('blog.countryTips', { country: post.country })}</p>
      </>
    );
  }

  if (post.type === 'how-to') {
    return (
      <>
        <p className="lead">{t('blog.howToIntro')}</p>

        <h2>{t('blog.stepByStep')}</h2>
        
        <h3>{t('blog.step1Title')}</h3>
        <p>{t('blog.step1Description')}</p>

        <h3>{t('blog.step2Title')}</h3>
        <p>{t('blog.step2Description')}</p>

        <h3>{t('blog.step3Title')}</h3>
        <p>{t('blog.step3Description')}</p>

        <h3>{t('blog.step4Title')}</h3>
        <p>{t('blog.step4Description')}</p>

        <h3>{t('blog.step5Title')}</h3>
        <p>{t('blog.step5Description')}</p>

        <h2>{t('blog.proTips')}</h2>
        <ul>
          <li>{t('blog.proTip1')}</li>
          <li>{t('blog.proTip2')}</li>
          <li>{t('blog.proTip3')}</li>
        </ul>

        <h2>{t('blog.commonMistakes')}</h2>
        <ul>
          <li>{t('blog.mistake1')}</li>
          <li>{t('blog.mistake2')}</li>
          <li>{t('blog.mistake3')}</li>
        </ul>

        <h2>{t('blog.conclusion')}</h2>
        <p>{t('blog.howToConclusion')}</p>
      </>
    );
  }

  if (post.type === 'complete-guide') {
    return (
      <>
        <p className="lead">{t('blog.completeGuideIntro')}</p>

        <h2>{t('blog.tableOfContents')}</h2>
        <ul>
          <li><a href="#cosa-sono">{t('blog.whatAre')}</a></li>
          <li><a href="#come-funzionano">{t('blog.howWork')}</a></li>
          <li><a href="#come-scegliere">{t('blog.howToChoose')}</a></li>
          <li><a href="#sicurezza">{t('blog.security')}</a></li>
          <li><a href="#etiquette">{t('blog.etiquette')}</a></li>
        </ul>

        <h2 id="cosa-sono">{t('blog.whatAre')}</h2>
        <p>{t('blog.whatAreDescription')}</p>

        <h2 id="come-funzionano">{t('blog.howWork')}</h2>
        <p>{t('blog.howWorkDescription')}</p>

        <h2 id="come-scegliere">{t('blog.howToChoose')}</h2>
        <p>{t('blog.howToChooseDescription')}</p>

        <h2 id="sicurezza">{t('blog.security')}</h2>
        <p>{t('blog.securityDescription')}</p>

        <h2 id="etiquette">{t('blog.etiquette')}</h2>
        <p>{t('blog.etiquetteDescription')}</p>

        <h2>{t('blog.conclusion')}</h2>
        <p>{t('blog.completeGuideConclusion')}</p>
      </>
    );
  }

  if (post.type === 'statistics') {
    return (
      <>
        <p className="lead">{t('blog.statisticsIntro')}</p>

        <h2>{t('blog.keyStats')}</h2>
        <ul>
          <li><strong>{t('blog.stat1Label')}</strong>: {t('blog.stat1Value')}</li>
          <li><strong>{t('blog.stat2Label')}</strong>: {t('blog.stat2Value')}</li>
          <li><strong>{t('blog.stat3Label')}</strong>: {t('blog.stat3Value')}</li>
          <li><strong>{t('blog.stat4Label')}</strong>: {t('blog.stat4Value')}</li>
        </ul>

        <h2>{t('blog.trends')}</h2>
        <p>{t('blog.trendsDescription')}</p>

        <h2>{t('blog.futureOutlook')}</h2>
        <p>{t('blog.futureOutlookDescription')}</p>
      </>
    );
  }

  if (post.type === 'security') {
    return (
      <>
        <p className="lead">{t('blog.securityIntro')}</p>

        <h2>{t('blog.dataProtection')}</h2>
        <p>{t('blog.dataProtectionDescription')}</p>

        <h2>{t('blog.securePayments')}</h2>
        <p>{t('blog.securePaymentsDescription')}</p>

        <h2>{t('blog.anonymity')}</h2>
        <p>{t('blog.anonymityDescription')}</p>

        <h2>{t('blog.bestPractices')}</h2>
        <ul>
          <li>{t('blog.securityTip1')}</li>
          <li>{t('blog.securityTip2')}</li>
          <li>{t('blog.securityTip3')}</li>
        </ul>
      </>
    );
  }

  return (
    <>
      <p>{post.description[language as keyof typeof post.description]}</p>
    </>
  );
}
