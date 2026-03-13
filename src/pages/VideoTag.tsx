import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { 
  MultiformatAd, 
  Banner728x90, 
  Banner300x250, 
  RecommendationWidget,
  NativeAd,
  Message300x250,
  AdBannerRow,
  AdBannerInline,
  MultiformatV2
} from '../components/AllAdSlots';
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

const popularTags = [
  'big-boobs', 'ass', 'teen', 'milf', 'blonde', 'latina', 'bbw', 'anal',
  'threesome', 'lesbian', 'hardcore', 'blowjob', 'public', 'fetish',
  'ebony', 'asian', 'pornstar', 'vr', 'hentai', 'stepmother', 'sister',
  'mom', 'maid', 'uniform', 'casting', 'party', 'college', 'office',
  'massage', 'spycam', 'bathroom', 'kitchen', 'bedroom', 'outdoor'
];

export default function VideoTag() {
  const { tag } = useParams();
  const { language } = useI18n();
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [allVideos, setAllVideos] = useState<Video[]>([]);

  const currentTag = tag || '';

  useSEO(
    `${currentTag.charAt(0).toUpperCase() + currentTag.slice(1)} Porn Videos - Free XXX`,
    `Watch the hottest ${currentTag} porn videos online for free. Best HD ${currentTag} xxx movies updated daily.`,
    `/videos/${currentTag}`
  );

  useEffect(() => {
    fetch('/top-videos.json')
      .then(res => res.json())
      .then(data => {
        setAllVideos(data);
        if (currentTag) {
          const filtered = data.filter((v: Video) => v.tags.includes(currentTag));
          setVideos(filtered);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [currentTag]);

  const otherTags = popularTags.filter(t => t !== currentTag).slice(0, 20);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent"></div>
      </div>
    );
  }

  const displayVideos = videos.slice(0, 50);

  return (
    <div className="space-y-4">
      <AdBannerInline className="mb-2" />

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white capitalize">
          {currentTag} Videos
        </h1>
        <p className="text-zinc-400">
          {videos.length} videos • Free XXX {currentTag} porn
        </p>
      </div>

      <div className="flex flex-wrap gap-2 justify-center">
        {otherTags.map(t => (
          <Link
            key={t}
            to={buildLocalizedPath(`/videos/${t}`, language)}
            className="px-3 py-1 bg-panel border border-border rounded-full text-sm text-zinc-300 hover:border-accent hover:text-accent transition"
          >
            #{t}
          </Link>
        ))}
      </div>

      <RecommendationWidget className="my-2" />

      {displayVideos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {displayVideos.map((video, index) => (
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
                </div>
                <div className="p-2 space-y-1">
                  <p className="text-white text-xs font-medium line-clamp-2">{video.title}</p>
                  <div className="flex items-center justify-between text-[10px] text-zinc-500">
                    <span>{formatViews(video.views)} views</span>
                    <span>{(video.rating / 1000).toFixed(1)}★</span>
                  </div>
                </div>
              </Link>
              
              {index === 4 && <NativeAd className="mt-1" />}
              {index === 14 && <MultiformatAd className="mt-1" />}
              {index === 24 && <MultiformatV2 className="mt-1" />}
              {index === 34 && <Message300x250 className="mt-1 flex justify-center" />}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-zinc-400">No videos found for this tag.</p>
          <Link to="/videos" className="text-accent hover:underline mt-2 inline-block">
            Browse all videos →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
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

      <AdBannerRow className="my-4" />
    </div>
  );
}
