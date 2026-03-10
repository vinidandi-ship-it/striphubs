import { useI18n } from '../i18n';

export default function LoadMoreButton({
  onClick,
  loading,
  disabled = false
}: {
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}) {
  const { t } = useI18n();

  return (
    <div className="flex justify-center">
      <button
        type="button"
        onClick={onClick}
        disabled={disabled || loading}
        className="inline-flex min-w-[220px] items-center justify-center gap-2 rounded-full border border-border bg-zinc-900 px-5 py-3 text-sm font-semibold text-zinc-100 transition-colors hover:border-accent hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
      >
        <span>{t('common.loadMore')}</span>
        <span
          className={`h-4 w-4 rounded-full border-2 border-zinc-500 border-t-accent transition-opacity ${
            loading ? 'animate-spin opacity-100' : 'opacity-0'
          }`}
          aria-hidden="true"
        />
      </button>
    </div>
  );
}
