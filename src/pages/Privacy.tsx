import Breadcrumbs from '../components/Breadcrumbs';
import { useSEO } from '../lib/seo';

export default function Privacy() {
  useSEO('Privacy Policy', 'Read the StripHubs privacy policy.', '/privacy');

  return (
    <article className="prose prose-invert max-w-3xl">
      <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Privacy' }]} />
      <h1>Privacy Policy</h1>
      <p>StripHubs stores minimal technical and analytics data required for site operation and affiliate tracking.</p>
      <p>Outbound links may be tracked by partner platforms for attribution and fraud prevention.</p>
      <p>By using this website, you agree to this policy and your local legal obligations.</p>
    </article>
  );
}
