import { VideoItem } from '../types';
import { FALLBACK_VIDEOS, TIKTOK_USERNAME } from '../data/constants';

// Function to format video duration
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// Function to format views count
export function formatViews(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M مشاهدة`;
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K مشاهدة`;
  }
  return `${count} مشاهدة`;
}

// Function to fetch TikTok videos using oEmbed API
export async function fetchTikTokVideos(): Promise<VideoItem[]> {
  try {
    // Try using TikTok Video API from RapidAPI first (if API key is available)
    const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY || '';
    
    if (RAPIDAPI_KEY) {
      try {
        const response = await fetch(
          `https://tiktok-video-no-watermark2.p.rapidapi.com/user/posts?unique_id=${TIKTOK_USERNAME}&count=6`,
          {
            headers: {
              'X-RapidAPI-Key': RAPIDAPI_KEY,
              'X-RapidAPI-Host': 'tiktok-video-no-watermark2.p.rapidapi.com'
            }
          }
        );
        
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.videos && Array.isArray(data.data.videos)) {
            return data.data.videos.slice(0, 6).map((video: any) => ({
              title: video.title || video.description || 'فيديو من تيك توك',
              thumbnail: video.cover || video.dynamic_cover || video.origin_cover || '',
              duration: formatDuration(video.duration || 0),
              views: formatViews(video.play_count || video.play || 0),
              url: `https://www.tiktok.com/@${TIKTOK_USERNAME}/video/${video.aweme_id || video.video_id || ''}`
            })).filter((video: VideoItem) => video.thumbnail);
          }
        }
      } catch (rapidApiError) {
        console.warn('RapidAPI failed, trying alternative method:', rapidApiError);
      }
    }
    
    // Alternative: Use TikTok oEmbed API with known video URLs
    const videoUrls: string[] = [
      'https://www.tiktok.com/@msfr_82/video/7570989417960049927',
      'https://www.tiktok.com/@msfr_82/video/7570361049652661511',
      'https://www.tiktok.com/@msfr_82/video/7569279486907272466'
    ];
    
    if (videoUrls.length > 0) {
      try {
        const videos = await Promise.all(
          videoUrls.map(async (url) => {
            try {
              const response = await fetch(
                `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`,
                {
                  headers: {
                    'Accept': 'application/json'
                  }
                }
              );
              
              if (response.ok) {
                const data = await response.json();
                return {
                  title: data.title || 'فيديو من تيك توك',
                  thumbnail: data.thumbnail_url || '',
                  duration: '00:00',
                  views: '0 مشاهدة',
                  url: url
                } as VideoItem;
              }
            } catch (error) {
              console.warn(`Failed to fetch video ${url}:`, error);
              return null;
            }
            return null;
          })
        );
        
        const validVideos = videos.filter((video): video is VideoItem => 
          video !== null && video.thumbnail !== '' && video.url !== undefined
        );
        if (validVideos.length > 0) {
          return validVideos;
        }
      } catch (oEmbedError) {
        console.warn('oEmbed API failed:', oEmbedError);
      }
    }
    
    // Final fallback: return default videos with TikTok profile link
    return FALLBACK_VIDEOS.map((video) => ({
      ...video,
      url: `https://www.tiktok.com/@${TIKTOK_USERNAME}`
    }));
  } catch (error) {
    console.error('Error fetching TikTok videos:', error);
    return FALLBACK_VIDEOS.map((video) => ({
      ...video,
      url: `https://www.tiktok.com/@${TIKTOK_USERNAME}`
    }));
  }
}

