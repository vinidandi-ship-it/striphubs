export default function LoadMoreButton({
  onClick,
  loading,
  disabled = false
}: {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className="rounded-full border border-border bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Caricamento...' : 'Carica altre modelle'}
      </button>
    </div>
  );
}
