import ModelCard from './ModelCard';
import { Model } from '../lib/models';
import { useI18n } from '../lib/i18n';

type ModelGridProps = {
  models: Model[];
};

export default function ModelGrid({ models }: ModelGridProps) {
  const { t } = useI18n();

  if (!models.length) {
    return <div className="rounded-xl border border-border bg-panel p-6 text-zinc-400">{t('noModels')}</div>;
  }

  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {models.map((model) => (
        <ModelCard key={model.name} model={model} />
      ))}
    </section>
  );
}
