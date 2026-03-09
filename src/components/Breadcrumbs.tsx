import { Link } from 'react-router-dom';
import { SITE_URL } from '../lib/constants';
import { injectJsonLd, removeJsonLd } from '../lib/seo';
import { useEffect } from 'react';

type Crumb = { label: string; to?: string };

type BreadcrumbsProps = {
  items: Crumb[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: item.to ? `${SITE_URL}${item.to}` : window.location.href
      }))
    };

    injectJsonLd('breadcrumbs-schema', schema);
    return () => removeJsonLd('breadcrumbs-schema');
  }, [items]);

  return (
    <nav aria-label="Breadcrumb" className="mb-6 text-sm text-zinc-400">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.to ? <Link to={item.to} className="hover:text-white">{item.label}</Link> : <span>{item.label}</span>}
            {index < items.length - 1 && <span>/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
