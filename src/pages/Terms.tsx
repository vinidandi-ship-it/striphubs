import Breadcrumbs from '../components/Breadcrumbs';
import { useSEO } from '../lib/seo';

export default function Terms() {
  useSEO('Terms of Service', 'Read the StripHubs terms of service.', '/terms');

  return (
    <article className="prose prose-invert max-w-3xl">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Terms' }]} />
      <h1>Terms of Service</h1>
      <p>This website is intended exclusively for adults aged 18 years or older.</p>
      <p>StripHubs is a directory and does not host, own, or control third-party live streams.</p>
      <p>Use of this site is subject to local laws and platform partner rules.</p>
    </article>
  );
}
