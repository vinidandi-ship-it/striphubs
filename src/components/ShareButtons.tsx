import Icon from './Icon';

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const shareUrl = encodeURIComponent(url);
  const shareTitle = encodeURIComponent(title);

  const socialLinks = [
    {
      name: 'Twitter',
      url: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
      icon: 'twitter' as const,
      color: 'bg-blue-400'
    },
    {
      name: 'Facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      icon: 'facebook' as const,
      color: 'bg-blue-600'
    },
    {
      name: 'WhatsApp',
      url: `https://wa.me/?text=${shareTitle}%20${shareUrl}`,
      icon: 'whatsapp' as const,
      color: 'bg-green-500'
    },
    {
      name: 'Telegram',
      url: `https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`,
      icon: 'telegram' as const,
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-zinc-400">Condividi:</span>
      {socialLinks.map((social) => (
        <a
          key={social.name}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${social.color} text-white p-2 rounded-full hover:opacity-80 transition-opacity`}
          aria-label={`Condividi su ${social.name}`}
        >
          <Icon name={social.icon} size={16} />
        </a>
      ))}
    </div>
  );
}
