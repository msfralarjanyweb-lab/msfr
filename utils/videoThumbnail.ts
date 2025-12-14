/**
 * دالة لجلب الصورة المصغرة من روابط الفيديو
 * تدعم: يوتيوب، تيك توك، سناب شات
 */

export interface VideoPlatform {
  type: 'youtube' | 'tiktok' | 'snapchat' | 'unknown';
  thumbnail: string;
  duration?: string;
  videoId?: string;
}

/**
 * تحويل الثواني إلى صيغة MM:SS أو HH:MM:SS
 */
function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * تحويل صيغة ISO 8601 (PT4M13S) إلى MM:SS
 */
function parseISO8601Duration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '00:00';
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return formatDuration(totalSeconds);
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
 * جلب الصورة المصغرة والمدة من رابط تيك توك
 * ملاحظة: تيك توك لا يوفر API عام، لذلك نستخدم oEmbed
 */
async function getTikTokInfo(url: string): Promise<{ thumbnail: string; duration?: string }> {
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
    
    return {
      thumbnail: data.thumbnail_url || '/images/service.png',
      duration: undefined, // تيك توك oEmbed لا يوفر المدة
    };
  } catch (error) {
    console.error('Error fetching TikTok info:', error);
  }
  
  // صورة افتراضية إذا فشل الجلب
  return {
    thumbnail: '/images/service.png',
    duration: undefined,
  };
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
        const info = await getTikTokInfo(url);
        return info.thumbnail;
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
 * جلب مدة الفيديو من رابط يوتيوب
 * ملاحظة: YouTube oEmbed لا يوفر المدة مباشرة
 * يمكن استخدام YouTube Data API v3 مع API key للحصول على المدة
 * لكن بدون API key، سنترك المدة فارغة ويمكن للمستخدم إدخالها يدوياً
 */
async function getYouTubeDuration(videoId: string): Promise<string | undefined> {
  // YouTube oEmbed API لا يوفر المدة
  // لجلب المدة، نحتاج إلى YouTube Data API v3 مع API key
  // أو يمكن استخدام iframe API لكنه يحتاج إلى تفاعل المستخدم
  
  // سنترك المدة فارغة ويمكن للمستخدم إدخالها يدوياً
  // أو يمكن إضافة API key لاحقاً إذا لزم الأمر
  return undefined;
}

/**
 * جلب مدة الفيديو من رابط الفيديو
 */
export async function getVideoDuration(url: string): Promise<string | undefined> {
  if (!url) {
    return undefined;
  }

  const platform = detectVideoPlatform(url);

  switch (platform) {
    case 'youtube': {
      const videoId = extractYouTubeVideoId(url);
      if (videoId) {
        // يوتيوب oEmbed لا يوفر المدة مباشرة
        // يمكن استخدام YouTube Data API مع API key، لكننا سنتركه اختياري
        // أو يمكن استخدام iframe API
        return undefined;
      }
      break;
    }
    
    case 'tiktok': {
      try {
        const info = await getTikTokInfo(url);
        return info.duration;
      } catch (error) {
        console.error('Error fetching TikTok duration:', error);
      }
      break;
    }
    
    case 'snapchat': {
      // سناب شات لا يوفر API للمدة
      return undefined;
    }
    
    default:
      break;
  }

  return undefined;
}

/**
 * جلب معلومات الفيديو الكاملة (الصورة المصغرة والمدة)
 */
export async function getVideoInfo(url: string): Promise<{ thumbnail: string; duration?: string }> {
  if (!url) {
    return {
      thumbnail: '/images/service.png',
      duration: undefined,
    };
  }

  const platform = detectVideoPlatform(url);
  let thumbnail = '/images/service.png';
  let duration: string | undefined = undefined;

  switch (platform) {
    case 'youtube': {
      const videoId = extractYouTubeVideoId(url);
      if (videoId) {
        thumbnail = getYouTubeThumbnail(videoId);
        // محاولة جلب المدة من oEmbed (قد لا تعمل بدون API key)
        duration = await getYouTubeDuration(videoId);
      }
      break;
    }
    
    case 'tiktok': {
      try {
        const info = await getTikTokInfo(url);
        thumbnail = info.thumbnail;
        duration = info.duration;
      } catch (error) {
        console.error('Error fetching TikTok info:', error);
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
    thumbnail,
    duration,
  };
}

/**
 * استخراج معلومات الفيديو من الرابط
 */
export async function extractVideoInfo(url: string): Promise<VideoPlatform> {
  const platform = detectVideoPlatform(url);
  let thumbnail = '/images/service.png';
  let duration: string | undefined = undefined;
  let videoId: string | undefined;

  switch (platform) {
    case 'youtube': {
      videoId = extractYouTubeVideoId(url) || undefined;
      if (videoId) {
        thumbnail = getYouTubeThumbnail(videoId);
        duration = await getYouTubeDuration(videoId);
      }
      break;
    }
    
    case 'tiktok': {
      videoId = extractTikTokVideoId(url) || undefined;
      try {
        const info = await getTikTokInfo(url);
        thumbnail = info.thumbnail;
        duration = info.duration;
      } catch (error) {
        console.error('Error fetching TikTok info:', error);
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
    duration,
    videoId,
  };
}

