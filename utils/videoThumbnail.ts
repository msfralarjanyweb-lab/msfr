/**
 * دالة لجلب الصورة المصغرة من روابط الفيديو
 * تدعم: يوتيوب، تيك توك، سناب شات
 */

export interface VideoPlatform {
  type: 'youtube' | 'tiktok' | 'snapchat' | 'unknown';
  thumbnail: string;
  videoId?: string;
}

/**
 * استخراج معرف الفيديو من رابط يوتيوب
 */
function extractYouTubeVideoId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/.*[?&]v=([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
}

/**
 * استخراج معرف الفيديو من رابط تيك توك
 */
function extractTikTokVideoId(url: string): string | null {
  // تيك توك: https://www.tiktok.com/@username/video/1234567890
  const pattern = /tiktok\.com\/.*\/video\/(\d+)/;
  const match = url.match(pattern);
  return match ? match[1] : null;
}

/**
 * جلب الصورة المصغرة من رابط يوتيوب
 */
function getYouTubeThumbnail(videoId: string): string {
  // جودة عالية: maxresdefault
  // جودة متوسطة: hqdefault
  // جودة منخفضة: mqdefault
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

/**
 * جلب الصورة المصغرة من رابط تيك توك
 * ملاحظة: تيك توك لا يوفر API عام، لذلك نستخدم oEmbed
 */
async function getTikTokThumbnail(url: string): Promise<string> {
  try {
    // استخدام oEmbed API
    const oembedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`;
    const response = await fetch(oembedUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.thumbnail_url) {
      return data.thumbnail_url;
    }
  } catch (error) {
    console.error('Error fetching TikTok thumbnail:', error);
    // في حالة فشل الجلب، يمكننا محاولة استخدام صورة افتراضية من تيك توك
    // أو إرجاع صورة افتراضية من الموقع
  }
  
  // صورة افتراضية إذا فشل الجلب
  return '/images/service.png';
}

/**
 * جلب الصورة المصغرة من رابط سناب شات
 * ملاحظة: سناب شات لا يوفر API عام للصور المصغرة
 */
function getSnapchatThumbnail(): string {
  // سناب شات لا يوفر صور مصغرة مباشرة
  // نستخدم صورة افتراضية
  return '/images/service.png';
}

/**
 * تحديد نوع المنصة من الرابط
 */
export function detectVideoPlatform(url: string): VideoPlatform['type'] {
  if (!url) return 'unknown';
  
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    return 'youtube';
  }
  
  if (lowerUrl.includes('tiktok.com')) {
    return 'tiktok';
  }
  
  if (lowerUrl.includes('snapchat.com')) {
    return 'snapchat';
  }
  
  return 'unknown';
}

/**
 * جلب الصورة المصغرة من رابط الفيديو
 */
export async function getVideoThumbnail(url: string): Promise<string> {
  if (!url) {
    return '/images/service.png';
  }

  const platform = detectVideoPlatform(url);

  switch (platform) {
    case 'youtube': {
      const videoId = extractYouTubeVideoId(url);
      if (videoId) {
        return getYouTubeThumbnail(videoId);
      }
      break;
    }
    
    case 'tiktok': {
      try {
        return await getTikTokThumbnail(url);
      } catch (error) {
        console.error('Error fetching TikTok thumbnail:', error);
      }
      break;
    }
    
    case 'snapchat': {
      return getSnapchatThumbnail();
    }
    
    default:
      break;
  }

  // صورة افتراضية إذا لم يتم التعرف على المنصة أو فشل الجلب
  return '/images/service.png';
}

/**
 * استخراج معلومات الفيديو من الرابط
 */
export async function extractVideoInfo(url: string): Promise<VideoPlatform> {
  const platform = detectVideoPlatform(url);
  let thumbnail = '/images/service.png';
  let videoId: string | undefined;

  switch (platform) {
    case 'youtube': {
      videoId = extractYouTubeVideoId(url) || undefined;
      if (videoId) {
        thumbnail = getYouTubeThumbnail(videoId);
      }
      break;
    }
    
    case 'tiktok': {
      videoId = extractTikTokVideoId(url) || undefined;
      try {
        thumbnail = await getTikTokThumbnail(url);
      } catch (error) {
        console.error('Error fetching TikTok thumbnail:', error);
      }
      break;
    }
    
    case 'snapchat': {
      thumbnail = getSnapchatThumbnail();
      break;
    }
    
    default:
      break;
  }

  return {
    type: platform,
    thumbnail,
    videoId,
  };
}

