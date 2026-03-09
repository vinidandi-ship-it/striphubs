import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const KEY = 'striphubs_cookie_consent';

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(localStorage.getItem(KEY) !== 'accepted');
  }, []);

  if (!show) return null;

  return (
    <aside className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl border border-border bg-panel p-4 shadow-xl sm:left-auto sm:w-[430px]" aria-label="Cookie consent">
      <p className="text-sm text-zinc-300">
        We use cookies for analytics and affiliate attribution. See our{' '}
        <Link className="text-accent underline" to="/cookies">Cookie Policy</Link>.
      </p>
      <button
        onClick={() => {
          localStorage.setItem(KEY, 'accepted');
          setShow(false);
        }}
        className="mt-3 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
      >
        Accept
      </button>
    </aside>
  );
}
