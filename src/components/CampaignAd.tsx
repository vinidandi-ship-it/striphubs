export default function CampaignAd() {
  return (
    <section className="rounded-3xl border border-pink-500/60 bg-black/80 p-6 shadow-xl shadow-pink-900/40">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="space-y-2 text-sm uppercase tracking-[0.4em] text-pink-200">
          <p className="text-xs font-semibold text-pink-400">Promo spotlight</p>
          <h3 className="text-2xl font-bold text-white">Easy affiliate toolkit</h3>
          <p className="max-w-2xl text-sm text-zinc-300">
            Genera traffico e monetizza con il nuovo builder Stripcash Easy. Clicca qui per aprire la campagna ufficiale e testare la conversione.
          </p>
        </div>
        <div className="flex flex-1 justify-center">
          <a
            className="flex items-center gap-2 rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-pink-400"
            href="https://go.mavrtracktor.com/easy?campaignId=949b5bbb9004e136477d6ae75475f5da6a7db2c4f43a4130f8f8ca5bde3646f1&userId=d28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881"
            target="_blank"
            rel="noreferrer"
          >
            Apri campagna Stripcash Easy
          </a>
        </div>
      </div>
    </section>
  );
}
