import { useEffect } from 'react';

const GOOGLE_ANALYTICS_ID = 'GOOGLE_ANALYTICS_ID';

export default function Analytics() {
  useEffect(() => {
    if (GOOGLE_ANALYTICS_ID === 'GOOGLE_ANALYTICS_ID') return;

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`;
    document.head.appendChild(script);

    const inline = document.createElement('script');
    inline.innerHTML = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GOOGLE_ANALYTICS_ID}');`;
    document.head.appendChild(inline);

    return () => {
      script.remove();
      inline.remove();
    };
  }, []);

  return null;
}
