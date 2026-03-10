export default function InfiniteLoader({
  loading,
  hasMore
}: {
  loading?: boolean;
  hasMore?: boolean;
}) {
  if (!hasMore && !loading) return null;

  return (
    <div className="flex justify-center py-2">
      <div className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full border border-border bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-100">
        <span>{loading ? 'Caricamento modelle...' : 'Scorri per caricare altre modelle'}</span>
        <span
          className={`h-4 w-4 rounded-full border-2 border-zinc-500 border-t-accent ${
            loading ? 'animate-spin opacity-100' : 'opacity-60'
          }`}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}
