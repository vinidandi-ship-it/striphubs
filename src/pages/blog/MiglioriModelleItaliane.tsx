import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { buildLocalizedPath } from '../../i18n/routing';

export default function MiglioriModelleItaliane() {
  const { t, language } = useI18n();

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Link to={buildLocalizedPath('/blog', language)} className="text-accent hover:underline mb-4 inline-block">
          ← Torna alle Guide
        </Link>
        <h1 className="text-3xl font-bold text-white sm:text-4xl mb-4">
          Migliori Modelle Italiane su Stripchat
        </h1>
        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <span>3 min lettura</span>
          <span>•</span>
          <span>Liste</span>
        </div>
      </header>

      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-zinc-300 mb-6">
          Le modelle italiane sono tra le più richieste su Stripchat. Ecco una selezione delle migliori modelle italiane online ora.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Modelle Italiane Popolari</h2>
        <p className="text-zinc-300 mb-4">
          Le modelle italiane sono conosciute per il loro fascino e la loro passione. Cerca le modelle con il tag "italian" per trovare le migliori.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Categorie Popolari</h2>
        <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2">
          <li><strong>Teen Italiane:</strong> Giovani e vivaci</li>
          <li><strong>Milf Italiane:</strong> Mature e esperte</li>
          <li><strong>Coppie Italiane:</strong> Per chi ama le dinamiche di coppia</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Come Trovare le Modelle Italiane</h2>
        <p className="text-zinc-300 mb-4">
          Usa la funzione di ricerca o naviga per paese selezionando "Italia" per vedere tutte le modelle italiane online.
        </p>

        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-bold text-white mb-2">Esplora le Modelle Italiane</h3>
          <p className="text-zinc-300 mb-4">
            Guarda ora le modelle italiane in diretta.
          </p>
          <Link
            to={buildLocalizedPath('/country/italian', language)}
            className="inline-block bg-accent text-white px-6 py-2 rounded-full font-semibold hover:bg-accent/80 transition-colors"
          >
            Vedi Modelle Italiane
          </Link>
        </div>
      </div>
    </article>
  );
}
