export default function BannerAd() {
  const bannerUrl =
    'https://go.mavrtracktor.com/api/models/vast?userId=d28a8a923e19b6fd3ed0c160238cdfed71b13f759191c9457b28797b81780881';

  return (
    <section className="rounded-3xl border border-pink-600 bg-gradient-to-r from-[#0a0a0a] via-[#111] to-[#0f0f0f] p-5 shadow-lg shadow-pink-900/30">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="flex-1 space-y-1 text-sm uppercase tracking-wider text-pink-300">
          <p className="text-xs font-semibold text-pink-400">Sponsor official</p>
          <p className="text-lg font-bold text-white">Stripchat ad feed</p>
        </div>
        <div className="flex-1">
          <div className="aspect-video overflow-hidden rounded-2xl border border-pink-500 bg-black">
            <iframe
              title="Stripchat VAST banner"
              src={bannerUrl}
              loading="lazy"
              className="h-full w-full border-none"
              allow="autoplay; fullscreen"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
