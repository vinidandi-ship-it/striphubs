import Breadcrumbs from '../components/Breadcrumbs';
import { useSEO } from '../lib/seo';

export default function Cookies() {
  useSEO('Cookie Policy', 'Read the StripHubs cookie policy.', '/cookies');

  return (
    <article className="prose prose-invert max-w-3xl">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Cookies' }]} />
      <h1>Cookie Policy</h1>
      <p>Cookies are used for session integrity, security, and affiliate attribution analytics.</p>
      <p>You can disable cookies in your browser, but some features may be limited.</p>
      <p>Continuing to browse the site means you accept this policy.</p>
    </article>
  );
}
