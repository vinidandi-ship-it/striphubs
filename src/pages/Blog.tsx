import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { buildLocalizedPath } from '../i18n/routing';
import Icon from '../components/Icon';

interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: 'guida-cam-gratis',
    title: 'Guida Completa alle Cam Live Gratis',
    excerpt: 'Scopri come accedere a migliaia di cam live gratuite senza registrazione. Consigli e trucchi per la migliore esperienza.',
    category: 'Guide',
    readTime: '5 min'
  },
  {
    slug: 'migliori-modelle-italiane',
    title: 'Migliori Modelle Italiane su Stripchat',
    excerpt: 'Una selezione delle modelle italiane più popolari e hot disponibili ora in diretta.',
    category: 'Liste',
    readTime: '3 min'
  },
  {
    slug: 'sicurezza-cam',
    title: 'Sicurezza e Privacy sulle Cam Live',
    excerpt: 'Come proteggere la tua privacy quando guardi cam live e interagisci con le modelle.',
    category: 'Guide',
    readTime: '4 min'
  },
  {
    slug: 'tag-popolari',
    title: 'I Tag più Popolari su Stripchat',
    excerpt: 'Esplora i tag più cercati e scopri nuove categorie di modelle.',
    category: 'Liste',
    readTime: '2 min'
  }
];

export default function Blog() {
  const { t, language } = useI18n();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-white sm:text-4xl mb-4">
          <Icon name="blog" size={32} className="inline-block mr-2" />
          Guida e Consigli
        </h1>
        <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
          Scopri le migliori guide, consigli e notizie sul mondo delle cam live gratis.
        </p>
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
    </div>
  );
}
