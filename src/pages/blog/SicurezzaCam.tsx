import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { buildLocalizedPath } from '../../i18n/routing';

export default function SicurezzaCam() {
  const { t, language } = useI18n();

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Link to={buildLocalizedPath('/blog', language)} className="text-accent hover:underline mb-4 inline-block">
          ← Torna alle Guide
        </Link>
        <h1 className="text-3xl font-bold text-white sm:text-4xl mb-4">
          Sicurezza e Privacy sulle Cam Live
        </h1>
        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <span>4 min lettura</span>
          <span>•</span>
          <span>Guide</span>
        </div>
      </header>

      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-zinc-300 mb-6">
          La privacy è fondamentale quando si naviga su siti di cam live. Ecco come proteggerti.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Non Condividere Informazioni Personali</h2>
        <p className="text-zinc-300 mb-4">
          Non condividere mai il tuo nome completo, indirizzo, numero di telefono o altre informazioni personali con le modelle o altri utenti.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Usa una Connessione Sicura</h2>
        <p className="text-zinc-300 mb-4">
          Assicurati che il sito usi HTTPS (il lucchetto nella barra degli indirizzi). StripHubs usa sempre connessioni sicure.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Navigazione Anonima</h2>
        <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2">
          <li>Usa la modalità di navigazione in incognito del browser</li>
          <li>Considera l'uso di una VPN per maggiore privacy</li>
          <li>Cancella la cache e i cookie regolarmente</li>
        </ul>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">4. Proteggi il Tuo Dispositivo</h2>
        <p className="text-zinc-300 mb-4">
          Assicurati di avere un antivirus aggiornato e di non scaricare file sospetti.
        </p>

        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-bold text-white mb-2">Naviga in Sicurezza</h3>
          <p className="text-zinc-300 mb-4">
            Goditi le cam live in totale sicurezza e privacy.
          </p>
          <Link
            to={buildLocalizedPath('/live', language)}
            className="inline-block bg-accent text-white px-6 py-2 rounded-full font-semibold hover:bg-accent/80 transition-colors"
          >
            Inizia Ora
          </Link>
        </div>
      </div>
    </article>
  );
}
