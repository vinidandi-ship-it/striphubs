import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { buildLocalizedPath } from '../../i18n/routing';

export default function TagPopolari() {
  const { t, language } = useI18n();

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Link to={buildLocalizedPath('/blog', language)} className="text-accent hover:underline mb-4 inline-block">
          ← Torna alle Guide
        </Link>
        <h1 className="text-3xl font-bold text-white sm:text-4xl mb-4">
          I Tag più Popolari su Stripchat
        </h1>
        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <span>2 min lettura</span>
          <span>•</span>
          <span>Liste</span>
        </div>
      </header>

      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-zinc-300 mb-6">
          I tag aiutano a categorizzare le modelle e a trovare il contenuto che preferisci. Ecco i tag più popolari.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Tag per Aspetto</h2>
        <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2">
          <li><strong>Blonde:</strong> Bionde</li>
          <li><strong>Brunette:</strong> More</li>
          <li><strong>Redhead:</strong> Rosse</li>
          <li><strong>Petite:</strong> Minutine</li>
          <li><strong>Curvy:</strong> Curvy</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Tag per Categoria</h2>
        <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2">
          <li><strong>Teen:</strong> Giovani</li>
          <li><strong>Milf:</strong> Mature</li>
          <li><strong>Asian:</strong> Asiatiche</li>
          <li><strong>Latina:</strong> Latine</li>
          <li><strong>Ebony:</strong> Nere</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Tag per Interesse</h2>
        <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2">
          <li><strong>HD:</strong> Alta definizione</li>
          <li><strong>VR:</strong> Realtà virtuale</li>
          <li><strong>Couple:</strong> Coppie</li>
          <li><strong>Trans:</strong> Transessuali</li>
        </ul>

        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-bold text-white mb-2">Esplora i Tag</h3>
          <p className="text-zinc-300 mb-4">
            Naviga per tag per trovare esattamente quello che cerchi.
          </p>
          <Link
            to={buildLocalizedPath('/tag/teen', language)}
            className="inline-block bg-accent text-white px-6 py-2 rounded-full font-semibold hover:bg-accent/80 transition-colors"
          >
            Vedi Tag Popolari
          </Link>
        </div>
      </div>
    </article>
  );
}
