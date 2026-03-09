import Breadcrumbs from '../components/Breadcrumbs';
import { useSEO } from '../lib/seo';

export default function TermsPage() {
  useSEO('Terms of Service', 'Read the StripHubs terms of service.', '/terms');

  return (
    <article className="prose prose-invert max-w-3xl">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Terms' }]} />
      <h1 className="text-3xl font-bold">Terms of Service</h1>
      <p>This site is for adults 18+ only. Do not use this service if prohibited by local law.</p>
      <p>StripHubs is an affiliate directory and does not host live streams directly.</p>
      <p>All third-party content belongs to its respective owners and platforms.</p>
    </article>
  );
}
