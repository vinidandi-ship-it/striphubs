import Breadcrumbs from '../components/Breadcrumbs';
import { useSEO } from '../lib/seo';

export default function CookiesPage() {
  useSEO('Cookie Policy', 'Read the StripHubs cookie policy.', '/cookies');

  return (
    <article className="prose prose-invert max-w-3xl">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cookies' }]} />
      <h1 className="text-3xl font-bold">Cookie Policy</h1>
      <p>We use cookies for core functionality, analytics placeholders, and affiliate performance attribution.</p>
      <p>You can manage cookie preferences in your browser settings at any time.</p>
      <p>Continuing to use this site indicates consent to cookies as described in this policy.</p>
    </article>
  );
}
