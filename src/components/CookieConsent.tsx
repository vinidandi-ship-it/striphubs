import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const STORAGE_KEY = 'striphubs_cookie_consent';

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    setVisible(consent !== 'accepted');
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 z-[90] rounded-xl border border-border bg-panel p-4 shadow-xl sm:left-auto sm:w-[420px]">
      <p className="text-sm text-zinc-300">
        We use cookies to improve your experience and track affiliate performance. Read our{' '}
        <Link to="/cookies" className="text-accent underline">Cookie Policy</Link>.
      </p>
      <button onClick={accept} className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-bold text-white">Accept</button>
    </div>
  );
}
