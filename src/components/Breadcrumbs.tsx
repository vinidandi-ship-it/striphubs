import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SITE_URL } from '../lib/models';
import { removeJsonLd, upsertJsonLd } from '../lib/seo';

type Crumb = { label: string; to?: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  useEffect(() => {
    upsertJsonLd('breadcrumbs-jsonld', {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        item: item.to ? `${SITE_URL}${item.to}` : window.location.href
      }))
    });

    return () => removeJsonLd('breadcrumbs-jsonld');
  }, [items]);

  return (
    <nav aria-label="Breadcrumb" className="mb-5 text-sm text-zinc-400">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-2">
            {item.to ? <Link className="hover:text-white" to={item.to}>{item.label}</Link> : <span>{item.label}</span>}
            {index < items.length - 1 ? <span>/</span> : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
