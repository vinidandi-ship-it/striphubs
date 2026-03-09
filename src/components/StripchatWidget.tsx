import { useEffect, useMemo } from 'react';
import { AFFILIATE_ID, WIDGET_BASE } from '../lib/constants';

type StripchatWidgetProps = {
  tag?: string;
  limit?: number;
};

export default function StripchatWidget({ tag = 'girls', limit = 24 }: StripchatWidgetProps) {
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

  useEffect(() => {
    const container = document.getElementById('stripchat-widget-container');
    if (!container) return;

    container.innerHTML = '';
    const script = document.createElement('script');
    script.src = widgetSrc;
    script.async = true;
    script.defer = true;
    container.appendChild(script);

    return () => {
      container.innerHTML = '';
    };
  }, [widgetSrc]);

  return <div id="stripchat-widget-container" className="min-h-[300px]" />;
}
