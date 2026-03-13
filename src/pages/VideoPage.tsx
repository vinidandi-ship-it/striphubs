import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import VideoAdSlot, { VideoBannerSlot } from '../components/VideoAdSlot';
import NativeAdSlot from '../components/NativeAdSlot';
import { useI18n } from '../i18n';
import { useSEO } from '../lib/seo';
import { buildLocalizedPath } from '../i18n/routing';
import { getAffiliateUrlWithProvider } from '../lib/affiliateProviders';
import Icon from '../components/Icon';

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

export default function VideoPage() {
  const { id } = useParams();
  const { language, t } = useI18n();
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [videos, setVideos] = useState<Video[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/top-videos.json').then(res => res.json()),
      fetch('/api/models?limit=20').then(res => res.json()).catch(() => ({ models: [] }))
    ]).then(([videosData, modelsData]) => {
      const found = videosData.find((v: Video) => v.id === id);
      setVideo(found || null);
      setVideos(videosData.slice(0, 20));
      setLoading(false);
    });
  }, [id]);

  useSEO(
    video ? `${video.title} - Free XXX Video` : 'Video',
    video ? `Watch ${video.title} for free. ${formatViews(video.views)} views. ${video.tags.slice(0, 5).join(', ')}` : 'Watch free porn videos',
    `/video/${id}`,
    { lang: language }
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold text-white mb-4">Video not found</h1>
        <Link to={buildLocalizedPath('/videos', language)} className="text-accent hover:underline">
          Browse all videos →
        </Link>
      </div>
    );
  }

  const relatedVideos = videos.filter(v => v.id !== video.id).slice(0, 10);

  return (
    <div className="space-y-6">
      <Breadcrumbs
        items={[
          { label: 'Home', path: '/' },
          { label: 'Videos', path: '/videos' },
          { label: video.title.slice(0, 30) + '...' }
        ]}
      />

      <div className="space-y-4">
        <div className="aspect-video w-full bg-black rounded-xl overflow-hidden relative">
          <iframe
            src={video.embedUrl}
            frameBorder="0"
            allowFullScreen
            allow="autoplay; fullscreen"
            className="w-full h-full absolute inset-0"
            title={video.title}
          />
        </div>

        <div className="space-y-2">
          <h1 className="text-xl font-bold text-white">{video.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
            <span className="flex items-center gap-1">
              <Icon name="eye" size={14} />
              {formatViews(video.views)} views
            </span>
            <span className="flex items-center gap-1">
              <Icon name="clock" size={14} />
              {formatDuration(video.duration)}
            </span>
            <span className="flex items-center gap-1">
              ★ {(video.rating / 1000).toFixed(1)}
            </span>
          </div>

          {video.pornstar && (
            <p className="text-zinc-300">
              <span className="text-zinc-500">Pornstar:</span> {video.pornstar}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            {video.tags.map(tag => (
              <Link
                key={tag}
                to={buildLocalizedPath(`/videos?tag=${tag}`, language)}
                className="px-2 py-1 bg-panel border border-border rounded text-xs text-zinc-300 hover:border-accent hover:text-accent transition"
              >
                #{tag}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to={getAffiliateUrlWithProvider('stripchat').url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-accent hover:bg-accent/80 text-white font-semibold py-3 px-6 rounded-full text-center transition"
          >
            🎯 Go to Stripchat
          </Link>
          <Link
            to={buildLocalizedPath('/live', language)}
            className="flex-1 border border-border hover:border-accent text-white font-semibold py-3 px-6 rounded-full text-center transition"
          >
            💄 Watch Live Cams
          </Link>
        </div>

        <VideoBannerSlot />
        
        <VideoAdSlot />
        
        <div className="flex justify-center">
          <NativeAdSlot cardIndex={1} />
        </div>
        
        <div className="flex justify-center">
          <VideoBannerSlot />
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white">Related Videos</h2>
        
        <NativeAdSlot cardIndex={10} />
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {relatedVideos.map(v => (
            <Link
              key={v.id}
              to={buildLocalizedPath(`/video/${v.id}`, language)}
              className="group relative overflow-hidden rounded-xl border border-border bg-panel hover:border-accent transition"
            >
              <div className="aspect-video relative">
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 text-xs text-white rounded">
                  {formatDuration(v.duration)}
                </div>
              </div>
              <div className="p-2">
                <p className="text-white text-xs line-clamp-2">{v.title}</p>
              </div>
            </Link>
          ))}
        </div>
        
        <NativeAdSlot cardIndex={20} />
      </div>
    </div>
  );
}
