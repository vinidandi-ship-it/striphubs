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
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { buildLocalizedPath } from '../i18n/routing';
import Icon from '../components/Icon';
import BlogSearch from '../components/BlogSearch';
import { generateBlogPosts, BlogPost as GeneratedBlogPost } from '../lib/blogContent';

// Calculate read time based on content length
const calculateReadTime = (title: string, description: string): string => {
  const words = (title + ' ' + description).split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min`;
};

// Map blog post type to display category
const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'best-category-cams': 'Liste',
    'category-vs-category': 'Confronto',
    'how-to': 'Guide',
    'top-category-by-country': 'Locali',
    'complete-guide': 'Guida Completa',
    'statistics': 'Statistiche',
    'security': 'Sicurezza',
    'trends': 'Tendenze',
    'comparison': 'Confronto',
    'how-to-list': 'Guide',
    'best-practices': 'Consigli'
  };
  return labels[type] || 'Articolo';
};

export default function Blog() {
  const { t, language, setLanguage } = useI18n();
  const [visibleCount, setVisibleCount] = useState(12);
  
  // Generate blog posts dynamically
  const allGeneratedPosts = generateBlogPosts();
  
  // Map generated posts to display format
  const allBlogPosts: Array<{
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    readTime: string;
  }> = allGeneratedPosts.map((post) => ({
    slug: post.slug,
    title: post.title[language] || post.title.it,
    excerpt: post.description[language] || post.description.it,
    category: getTypeLabel(post.type),
    readTime: calculateReadTime(post.title[language] || post.title.it, post.description[language] || post.description.it)
  }));
  
  const blogPosts = allBlogPosts.slice(0, visibleCount);
  const hasMore = visibleCount < allBlogPosts.length;

  const loadMore = () => {
    setVisibleCount((current) => Math.min(current + 6, allBlogPosts.length));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white sm:text-4xl mb-4">
          <Icon name="blog" size={32} className="inline-block mr-2" />
          Guida e Consigli
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
          Scopri le migliori guide, consigli e notizie sul mondo delle cam live gratis.
        </p>
        <div className="max-w-md mx-auto">
          <BlogSearch />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            to={buildLocalizedPath(`/blog/${post.slug}`, language)}
            className="group bg-panel rounded-xl border border-border overflow-hidden hover:border-accent transition-all"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-semibold text-accent bg-accent/10 px-2 py-1 rounded-full">
                  {post.category}
                </span>
                <span className="text-xs text-zinc-500">{post.readTime} lettura</span>
              </div>
              <h2 className="text-xl font-bold text-white group-hover:text-accent transition-colors mb-2">
                {post.title}
              </h2>
              <p className="text-sm text-zinc-400 line-clamp-2">
                {post.excerpt}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="space-y-2 my-4">
        <div className="flex justify-center">
          <Banner728x90 className="hidden md:block" />
          <Banner300x250 className="md:hidden" />
        </div>
        <CrackRevenueBanner />
      </div>
      
      {hasMore && (
        <div className="text-center mt-8">
          <button
            onClick={loadMore}
            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full font-semibold hover:bg-accent/80 transition-colors"
          >
            <Icon name="arrowDown" size={16} />
            Carica Altri Articoli ({allBlogPosts.length - visibleCount})
          </button>
        </div>
      )}

      <div className="space-y-2 my-4">
        <div className="flex justify-center">
          <Banner728x90Second className="hidden md:block" />
          <Banner300x250 className="md:hidden" />
        </div>
        <CrackRevenueBanner />
      </div>
    </div>
  );
}
