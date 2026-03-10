import React from 'react';

type IconName = 
  | 'home' | 'search' | 'camera' | 'live' | 'user' 
  | 'heart' | 'heartFilled' | 'star' | 'starFilled' 
  | 'settings' | 'bell' | 'bellFilled' | 'menu' | 'close' 
  | 'arrowRight' | 'arrowLeft' | 'arrowUp' | 'arrowDown'
  | 'play' | 'pause' | 'share' | 'gift' | 'coins' | 'eye'
  | 'filter' | 'grid' | 'list' | 'verified' | 'hd' | 'lock' | 'unlock'
  | 'info' | 'warning' | 'success' | 'error' | 'chat'
  | 'milf' | 'teen' | 'asian' | 'crown' | 'sparkle' | 'lotus';

interface IconProps {
  name: IconName;
  className?: string;
  size?: number;
  color?: string;
}

const icons: Record<IconName, JSX.Element> = {
  home: (
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="8"/>
      <path d="m21 21-4.35-4.35"/>
    </>
  ),
  camera: (
    <>
      <path d="m22 8-6 4 6 4V8Z"/>
      <rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>
    </>
  ),
  live: (
    <>
      <circle cx="12" cy="12" r="8" strokeWidth="2" fill="none"/>
      <circle cx="12" cy="12" r="4" fill="currentColor">
        <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite"/>
      </circle>
    </>
  ),
  user: (
    <>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </>
  ),
  heart: (
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  ),
  heartFilled: (
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
  ),
  star: (
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  ),
  starFilled: (
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  ),
  settings: (
    <>
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.47a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.39a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </>
  ),
  bell: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
    </>
  ),
  bellFilled: (
    <>
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
      <circle cx="18" cy="6" r="4" fill="currentColor" stroke="none"/>
    </>
  ),
  menu: (
    <>
      <line x1="4" x2="20" y1="12" y2="12"/>
      <line x1="4" x2="20" y1="6" y2="6"/>
      <line x1="4" x2="20" y1="18" y2="18"/>
    </>
  ),
  close: (
    <>
      <path d="M18 6 6 18"/>
      <path d="m6 6 12 12"/>
    </>
  ),
  arrowRight: (
    <>
      <path d="M5 12h14"/>
      <path d="m12 5 7 7-7 7"/>
    </>
  ),
  arrowLeft: (
    <>
      <path d="M19 12H5"/>
      <path d="m12 19-7-7 7-7"/>
    </>
  ),
  arrowUp: (
    <>
      <path d="m18 15-6-6-6 6"/>
      <path d="M12 3v12"/>
    </>
  ),
  arrowDown: (
    <>
      <path d="m6 9 6 6 6-6"/>
      <path d="M12 15V3"/>
    </>
  ),
  play: (
    <polygon points="5 3 19 12 5 21 5 3"/>
  ),
  pause: (
    <>
      <rect x="6" y="4" width="4" height="16"/>
      <rect x="14" y="4" width="4" height="16"/>
    </>
  ),
  share: (
    <>
      <circle cx="18" cy="5" r="3"/>
      <circle cx="6" cy="12" r="3"/>
      <circle cx="18" cy="19" r="3"/>
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
    </>
  ),
  gift: (
    <>
      <polyline points="20 12 20 22 4 22 4 12"/>
      <rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </>
  ),
  coins: (
    <>
      <circle cx="12" cy="12" r="8"/>
      <path d="M12 2v6"/>
      <path d="m16.2 16.2 4.2-4.2"/>
      <path d="M12 18v6"/>
      <path d="m7.8 16.2-4.2-4.2"/>
    </>
  ),
  eye: (
    <>
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </>
  ),
  filter: (
    <>
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </>
  ),
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </>
  ),
  list: (
    <>
      <line x1="8" y1="6" x2="21" y2="6"/>
      <line x1="8" y1="12" x2="21" y2="12"/>
      <line x1="8" y1="18" x2="21" y2="18"/>
      <line x1="3" y1="6" x2="3.01" y2="6"/>
      <line x1="3" y1="12" x2="3.01" y2="12"/>
      <line x1="3" y1="18" x2="3.01" y2="18"/>
    </>
  ),
  verified: (
    <>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </>
  ),
  hd: (
    <>
      <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
      <path d="M17 9l-5 5-5-5"/>
    </>
  ),
  lock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </>
  ),
  unlock: (
    <>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 9.9-1"/>
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="16" x2="12" y2="12"/>
      <line x1="12" y1="8" x2="12.01" y2="8"/>
    </>
  ),
  warning: (
    <>
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" y1="9" x2="12" y2="13"/>
      <line x1="12" y1="17" x2="12.01" y2="17"/>
    </>
  ),
  success: (
    <>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </>
  ),
  error: (
    <>
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/>
      <line x1="9" y1="9" x2="15" y2="15"/>
    </>
  ),
  chat: (
    <>
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </>
  ),
  // Category-specific icons
  milf: (
    <>
      <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2Z"/>
      <circle cx="12" cy="14" r="2" fill="currentColor" stroke="none"/>
    </>
  ),
  teen: (
    <>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      <circle cx="12" cy="10" r="3" fill="currentColor" stroke="none"/>
    </>
  ),
  asian: (
    <>
      <circle cx="12" cy="12" r="9" strokeDasharray="4 2"/>
      <circle cx="12" cy="12" r="5" strokeDasharray="3 1"/>
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>
    </>
  ),
  crown: (
    <>
      <path d="M2 20l2-8 4 4 4-6 4 6 4-4 2 8H2z"/>
      <circle cx="12" cy="8" r="2" fill="currentColor" stroke="none"/>
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.6 5.6l2.1 2.1m8.6 8.6l2.1 2.1M5.6 18.4l2.1-2.1m8.6-8.6l2.1-2.1"/>
    </>
  ),
  lotus: (
    <>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.9 0 1.8-.1 2.6-.3C9.1 20.5 5 16.1 5 11c0-4.4 3.1-8.1 7.4-9.5C12.3 2 12.2 2 12 2z"/>
      <path d="M12 2c5.5 0 10 4.5 10 10s-4.5 10-10 10c-.9 0-1.8-.1-2.6-.3C14.9 20.5 19 16.1 19 11c0-4.4-3.1-8.1-7.4-9.5C11.7 2 11.8 2 12 2z" fill="none"/>
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/>
    </>
  ),
};

export const Icon: React.FC<IconProps> = ({ name, className = '', size = 24, color }) => {
  return (
    <svg
      className={`sh-icon ${className}`}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color || "currentColor"}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icons[name]}
    </svg>
  );
};

export default Icon;
