import { useMemo } from 'react';
import { AFFILIATE_ID, WIDGET_BASE } from '../lib/constants';
import { useI18n } from '../lib/i18n';

type StripchatWidgetProps = {
  tag?: string;
  limit?: number;
};

export default function StripchatWidget({ tag = 'girls', limit = 24 }: StripchatWidgetProps) {
  const { t } = useI18n();

  const widgetSrc = useMemo(() => {
    const params = new URLSearchParams({
      userId: AFFILIATE_ID,
      tag,
      limit: String(limit),
      thumbSize: 'big',
      responsive: '1'
    });
    return `${WIDGET_BASE}?${params.toString()}`;
  }, [tag, limit]);

  return (
    <div>
      <iframe
        src={widgetSrc}
        title={`live-widget-${tag}`}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-[820px] w-full rounded-xl border border-border bg-black"
      />
      <p className="mt-3 text-xs text-zinc-400">
        {t('ifNoFeed')}{' '}
        <a
          className="text-accent underline"
          href={`https://stripchat.com/?userId=${AFFILIATE_ID}`}
          target="_blank"
          rel="noopener noreferrer sponsored"
        >
          {t('stripchat')}
        </a>
        .
      </p>
    </div>
  );
}
