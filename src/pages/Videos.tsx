import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon';
import NativeAdSlot from '../components/NativeAdSlot';
import { useI18n } from '../i18n';
import { useSEO } from '../lib/seo';
import { buildLocalizedPath } from '../i18n/routing';
import { getAffiliateUrlWithProvider } from '../lib/affiliateProviders';

interface Video {
  id: string;
  title: string;
  thumbnail: string;
  tags: string[];
  pornstar: string;
  duration: number;
  views: number;
  rating: number;
  embedUrl: string;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatViews(views: number): string {
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`;
  if (views >= 1000) return `${(views / 1000).toFixed(0)}K`;
  return views.toString();
}

export default function Videos() {
  const { language, t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const currentTag = searchParams.get('tag') || '';

  useSEO(
    currentTag ? `${currentTag} Videos - Top Rated XXX` : 'Porn Videos - Top Rated XXX Videos',
    currentTag ? `Watch the hottest ${currentTag} porn videos online for free.` : 'Watch the hottest porn videos online for free. Top rated XXX content updated daily.',
    '/videos',
    { lang: language }
  );

  useEffect(() => {
    fetch('/top-videos.json')
      .then(res => res.json())
      .then(data => {
        setVideos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredVideos = searchTerm
    ? videos.filter(v => 
        v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
        v.pornstar.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : currentTag
      ? videos.filter(v => v.tags.includes(currentTag))
      : videos;

  const popularTags = [...new Set(videos.flatMap(v => v.tags))].slice(0, 30);

  const clearTag = () => {
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  const displayVideos = filteredVideos.slice(0, 50);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white">
          {currentTag ? `${currentTag.charAt(0).toUpperCase() + currentTag.slice(1)} Videos` : 'Top Porn Videos'}
        </h1>
        <p className="text-zinc-400">
          {filteredVideos.length} videos • Watch free XXX videos online
        </p>
      </div>

      <div className="relative max-w-md mx-auto">
        <input
          type="text"
          placeholder="Search videos, tags, pornstars..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-panel border border-border rounded-full px-4 py-3 pl-12 text-white placeholder-zinc-500 focus:outline-none focus:border-accent"
        />
        <Icon name="search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
      </div>

      {currentTag && (
        <div className="text-center">
          <button
            onClick={clearTag}
            className="px-4 py-2 bg-accent text-white rounded-full text-sm hover:bg-accent/80 transition"
          >
            ✕ Clear filter: {currentTag}
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2 justify-center">
        {popularTags.map(tag => (
          <Link
            key={tag}
            to={buildLocalizedPath(`/videos?tag=${tag}`, language)}
            className={`px-3 py-1 bg-panel border rounded-full text-sm transition ${
              currentTag === tag 
                ? 'border-accent text-accent' 
                : 'border-border text-zinc-300 hover:border-accent hover:text-accent'
            }`}
          >
            #{tag}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {displayVideos.map((video, index) => (
          <>
            {index > 0 && index % 6 === 0 && (
              <div className="col-span-full flex justify-center my-4">
                <NativeAdSlot cardIndex={index} />
              </div>
            )}
            <div key={video.id}>
              <Link
                to={buildLocalizedPath(`/video/${video.id}`, language)}
                className="group relative overflow-hidden rounded-xl border border-border bg-panel hover:border-accent transition block"
              >
                <div className="aspect-video relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 text-xs text-white rounded">
                    {formatDuration(video.duration)}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition">
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-medium line-clamp-2">{video.title}</p>
                    </div>
                  </div>
                  {index < 3 && (
                    <div className="absolute top-2 left-2 bg-accent px-2 py-0.5 text-xs font-bold text-white rounded">
                      TOP {index + 1}
                    </div>
                  )}
                </div>
                <div className="p-2 space-y-1">
                  <p className="text-white text-xs font-medium line-clamp-2">{video.title}</p>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span>{formatViews(video.views)} views</span>
                    <span>{(video.rating / 1000).toFixed(1)}★</span>
                  </div>
                </div>
              </Link>
            </div>
          </>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href={getAffiliateUrlWithProvider('stripchat').url}
          target="_blank"
          rel="noopener noreferrer"
          className="block bg-accent hover:bg-accent/80 text-white font-semibold py-4 px-6 rounded-xl text-center transition"
        >
          🎯 Stripchat - Live Cams
        </a>
        <a
          href={getAffiliateUrlWithProvider('chaturbate').url}
          target="_blank"
          rel="noopener noreferrer"
          className="block border border-border hover:border-accent text-white font-semibold py-4 px-6 rounded-xl text-center transition"
        >
          💄 Chaturbate - Live Girls
        </a>
      </div>

      {filteredVideos.length > 50 && (
        <p className="text-center text-zinc-500 text-sm">
          Showing 50 of {filteredVideos.length} videos
        </p>
      )}
    </div>
  );
}
