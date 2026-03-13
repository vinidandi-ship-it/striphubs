import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { buildLocalizedPath } from '../i18n/routing';
import Icon from './Icon';

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
    excerpt: 'Scopri come accedere a migliaia di cam live gratuite senza registrazione.',
    category: 'Guide',
    readTime: '5 min'
  },
  {
    slug: 'migliori-modelle-italiane',
    title: 'Migliori Modelle Italiane su Stripchat',
    excerpt: 'Una selezione delle modelle italiane più popolari e hot.',
    category: 'Liste',
    readTime: '3 min'
  },
  {
    slug: 'sicurezza-cam',
    title: 'Sicurezza e Privacy sulle Cam Live',
    excerpt: 'Come proteggere la tua privacy quando guardi cam live.',
    category: 'Guide',
    readTime: '4 min'
  },
  {
    slug: 'tag-popolari',
    title: 'I Tag più Popolari su Stripchat',
    excerpt: 'Esplora i tag più cercati e scopri nuove categorie.',
    category: 'Liste',
    readTime: '2 min'
  }
];

export default function BlogSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<BlogPost[]>([]);
  const { t, language } = useI18n();

  useEffect(() => {
    if (query.length > 1) {
      const filtered = blogPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.excerpt.toLowerCase().includes(query.toLowerCase()) ||
          post.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  return (
    <div className="relative mb-8">
      <div className="relative">
        <Icon name="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('blog.searchPlaceholder') || 'Cerca articoli...'}
          className="w-full pl-10 pr-4 py-3 bg-bg-card border border-border rounded-xl text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-accent"
        />
      </div>
      
      {results.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-bg-card border border-border rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {results.map((post) => (
            <Link
              key={post.slug}
              to={buildLocalizedPath(`/blog/${post.slug}`, language)}
              className="block px-4 py-3 hover:bg-bg-hover transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{post.title}</span>
                <span className="text-xs text-zinc-400">{post.readTime}</span>
              </div>
              <p className="text-sm text-zinc-400 mt-1">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
