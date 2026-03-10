import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n';
import { buildLocalizedPath } from '../../i18n/routing';
import ShareButtons from '../../components/ShareButtons';

export default function GuidaCamGratis() {
  const { t, language } = useI18n();

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8">
        <Link to={buildLocalizedPath('/blog', language)} className="text-accent hover:underline mb-4 inline-block">
          ← Torna alle Guide
        </Link>
        <h1 className="text-3xl font-bold text-white sm:text-4xl mb-4">
          Guida Completa alle Cam Live Gratis
        </h1>
        <div className="flex items-center gap-4 text-sm text-zinc-400">
          <span>5 min lettura</span>
          <span>•</span>
          <span>Guide</span>
        </div>
      </header>

      <div className="prose prose-invert max-w-none">
        <p className="text-lg text-zinc-300 mb-6">
          Accedere a cam live gratis è più semplice di quanto pensi. Con la giusta piattaforma e qualche accorgimento, puoi goderti migliaia di dirette senza spendere un centesimo.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">1. Scegli la Piattaforma Giusta</h2>
        <p className="text-zinc-300 mb-4">
          Esistono diverse piattaforme per le cam live, ma StripHubs ti permette di accedere a tutte le modelle di Stripchat in un unico posto. Non è necessaria la registrazione per iniziare a guardare.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">2. Naviga per Categorie</h2>
        <p className="text-zinc-300 mb-4">
          Utilizza le categorie (Teen, Milf, Asian, ecc.) per trovare rapidamente il tipo di intrattenimento che preferisci. Le modelle sono online 24/7.
        </p>

        <h2 className="text-xl font-bold text-white mt-8 mb-4">3. Consigli per la Privacy</h2>
        <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2">
          <li>Non condividere mai informazioni personali.</li>
          <li>Usa una connessione sicura (HTTPS).</li>
          <li>Chiudi la finestra del browser quando hai finito.</li>
        </ul>

        <div className="bg-accent/10 border border-accent/30 rounded-xl p-6 mt-8">
          <h3 className="text-lg font-bold text-white mb-2">Pronto a iniziare?</h3>
          <p className="text-zinc-300 mb-4">
            Esplora migliaia di modelle online ora stesso.
          </p>
          <Link
            to={buildLocalizedPath('/live', language)}
            className="inline-block bg-accent text-white px-6 py-2 rounded-full font-semibold hover:bg-accent/80 transition-colors"
          >
            Guarda le Cam Live
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <ShareButtons 
            url={`https://striphubs.com/blog/guida-cam-gratis`} 
            title="Guida Completa alle Cam Live Gratis - StripHubs" 
          />
        </div>

        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-lg font-bold text-white mb-4">Articoli Correlati</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              to={buildLocalizedPath('/blog/migliori-modelle-italiane', language)}
              className="block p-4 bg-bg-card border border-border rounded-xl hover:border-accent transition-colors"
            >
              <h4 className="font-semibold text-white mb-1">Migliori Modelle Italiane</h4>
              <p className="text-sm text-zinc-400">Scopri le modelle italiane più popolari.</p>
            </Link>
            <Link
              to={buildLocalizedPath('/blog/sicurezza-cam', language)}
              className="block p-4 bg-bg-card border border-border rounded-xl hover:border-accent transition-colors"
            >
              <h4 className="font-semibold text-white mb-1">Sicurezza e Privacy</h4>
              <p className="text-sm text-zinc-400">Proteggi la tua privacy online.</p>
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
