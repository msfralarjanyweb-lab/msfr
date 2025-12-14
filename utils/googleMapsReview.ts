/**
 * أداة لاستخراج بيانات التقييم من رابط Google Maps
 */

export interface GoogleMapsReviewData {
  name: string;
  content: string;
  date?: string;
  rating?: number;
  image?: string;
}

/**
 * التحقق من أن الرابط هو رابط Google Maps review
 */
export function isGoogleMapsReviewUrl(url: string): boolean {
  if (!url || typeof url !== 'string') return false;
  
  const googleMapsPatterns = [
    /maps\.google\./i,
    /google\.com\/maps/i,
    /goo\.gl\/maps/i,
    /maps\.app\.goo\.gl/i,
  ];
  
  return googleMapsPatterns.some(pattern => pattern.test(url));
}

/**
 * استخراج معرف المكان من رابط Google Maps
 */
function extractPlaceId(url: string): string | null {
  // محاولة استخراج Place ID من الرابط
  const placeIdMatch = url.match(/place_id=([^&]+)/);
  if (placeIdMatch) {
    return placeIdMatch[1];
  }
  
  // محاولة استخراج من رابط قصير
  const dataMatch = url.match(/data=([^&]+)/);
  if (dataMatch) {
    try {
      const decoded = decodeURIComponent(dataMatch[1]);
      const placeIdMatch2 = decoded.match(/place_id[=:]([^&,\s]+)/);
      if (placeIdMatch2) {
        return placeIdMatch2[1];
      }
    } catch (e) {
      console.error('Error decoding URL:', e);
    }
  }
  
  return null;
}

/**
 * استخراج بيانات التقييم من رابط Google Maps
 * ملاحظة: Google Maps لا يوفر API مجاني لاستخراج التقييمات مباشرة
 * هذا الحل يحاول استخراج ما يمكن من الرابط أو استخدام CORS proxy
 */
export async function extractReviewFromGoogleMaps(url: string): Promise<Partial<GoogleMapsReviewData>> {
  if (!isGoogleMapsReviewUrl(url)) {
    throw new Error('الرابط المدخل ليس رابط Google Maps صحيح');
  }

  try {
    // محاولة استخراج البيانات من الرابط مباشرة
    const placeId = extractPlaceId(url);
    
    // محاولة استخدام CORS proxy لجلب HTML الصفحة
    // ملاحظة: هذا قد لا يعمل بسبب CORS policies في المتصفح
    try {
      // استخدام CORS proxy (مثال: allorigins.win أو cors-anywhere)
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (data.contents) {
        const html = data.contents;
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        // محاولة استخراج اسم المستخدم
        const reviewerName = doc.querySelector('[data-review-id] [class*="font"]')?.textContent?.trim() || 
                            doc.querySelector('.d4r55')?.textContent?.trim() || '';
        
        // محاولة استخراج محتوى التقييم
        const reviewText = doc.querySelector('[data-review-id] [class*="wiI7pd"]')?.textContent?.trim() ||
                          doc.querySelector('.MyEned')?.textContent?.trim() || '';
        
        // محاولة استخراج التاريخ
        const reviewDate = doc.querySelector('[data-review-id] [class*="rsqaWe"]')?.textContent?.trim() ||
                          doc.querySelector('.rsqaWe')?.textContent?.trim() || '';
        
        // محاولة استخراج صورة المستخدم
        const reviewerImage = doc.querySelector('[data-review-id] img')?.getAttribute('src') || '';
        
        if (reviewerName || reviewText) {
          return {
            name: reviewerName || '',
            content: reviewText || '',
            date: reviewDate ? parseDateFromText(reviewDate) : new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }),
            image: reviewerImage || '',
          };
        }
      }
    } catch (proxyError) {
      console.warn('CORS proxy failed, trying alternative method:', proxyError);
    }
    
    // إذا فشل استخراج البيانات، إرجاع بيانات فارغة مع التاريخ الحالي
    return {
      name: '',
      content: '',
      date: new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
  } catch (error) {
    console.error('Error extracting review data:', error);
    // إرجاع بيانات فارغة بدلاً من رمي خطأ
    return {
      name: '',
      content: '',
      date: new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' }),
    };
  }
}

/**
 * تحليل نص التقييم لمحاولة استخراج اسم المستخدم
 */
export function extractNameFromContent(content: string): string {
  // محاولة بسيطة لاستخراج الاسم من بداية النص
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length > 0) {
    const firstLine = lines[0].trim();
    // إذا كان السطر الأول قصير (أقل من 50 حرف)، قد يكون اسم
    if (firstLine.length < 50 && !firstLine.includes('.')) {
      return firstLine;
    }
  }
  return '';
}

/**
 * تنسيق التاريخ من نص
 */
export function parseDateFromText(text: string): string {
  // محاولة استخراج التاريخ من النص
  const datePatterns = [
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // MM/DD/YYYY
    /(\d{4})-(\d{1,2})-(\d{1,2})/, // YYYY-MM-DD
  ];
  
  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        const date = new Date(match[0]);
        return date.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
      } catch (e) {
        // ignore
      }
    }
  }
  
  return new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric' });
}

