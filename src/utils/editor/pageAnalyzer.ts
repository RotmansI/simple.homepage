export interface ImageLocation {
  url: string;
  pageKey: string;
  sectionId: string;
  sectionType: string;
  context: string; // 'background' | 'content' | 'gallery' | 'logo'
}

export interface PageAnalysis {
  sectionCount: number;
  elementCount: number;
  imageCount: number;
  score: number;
  isOverloaded: boolean;
  images: ImageLocation[];
}

/**
 * מנתח עמוד ספציפי ומחזיר סטטיסטיקה ומיקומי תמונות
 */
export const analyzePage = (sections: any[], site: any, pageKey: string): PageAnalysis => {
  const images: ImageLocation[] = [];
  let elementCount = 0;
  let hasMenu = false;

  // סריקת לוגו (רק אם אנחנו בעמוד הבית או שהלוגו גלובלי)
  if (site?.draft_data?.navbar?.brand_image) {
    images.push({
      url: site.draft_data.navbar.brand_image,
      pageKey,
      sectionId: 'navbar',
      sectionType: 'navbar',
      context: 'logo'
    });
  }

  sections.forEach(section => {
    const sId = section.id;
    const sType = section.type;

    if (sType === 'menu') {
      hasMenu = true;
      elementCount++;
    }

    if (section.content?.elements) {
      elementCount += section.content.elements.length;
    }

    // --- סריקת תמונות בסקשן ---
    
    // 1. תמונת רקע של סקשן
    if (section.content?.bg_image) {
      images.push({ url: section.content.bg_image, pageKey, sectionId: sId, sectionType: sType, context: 'background' });
    }

    // 2. תמונה ראשית (Hero / Flex)
    if (section.content?.image) {
      images.push({ url: section.content.image, pageKey, sectionId: sId, sectionType: sType, context: 'content' });
    }

    // 3. סליידרים / גלריות
    if (section.content?.slider_images) {
      section.content.slider_images.forEach((url: string) => {
        images.push({ url, pageKey, sectionId: sId, sectionType: sType, context: 'gallery' });
      });
    }

    // 4. פריטים (Menu items / Gallery items)
    if (section.content?.items) {
      section.content.items.forEach((item: any) => {
        if (item.image) {
          images.push({ url: item.image, pageKey, sectionId: sId, sectionType: sType, context: 'content' });
        }
      });
    }
  });

  // חישוב ציון
  let score = 40;
  let isOverloaded = false;
  if (sections.length >= 3 && sections.length <= 7) score += 20;
  if (images.length > 0) score += 10;
  if (elementCount > 5) score += 10;
  if (hasMenu) score += 30;

  if (hasMenu && elementCount > 10) {
    const extraElements = elementCount - 10;
    score -= (extraElements * 4);
    isOverloaded = true;
  }

  return {
    sectionCount: sections.length,
    elementCount,
    imageCount: images.length,
    score: Math.max(0, Math.min(score, 100)),
    isOverloaded,
    images
  };
};

/**
 * סורק את כל האתר ומחזיר מפה מלאה של שימוש בתמונות וציונים
 */
export const analyzeSite = (site: any) => {
  const pages = site?.draft_data?.pages || {};
  const siteAnalysis: Record<string, PageAnalysis> = {};
  const allImages: ImageLocation[] = [];

  Object.keys(pages).forEach(pageKey => {
    const page = pages[pageKey];
    const analysis = analyzePage(page.sections || [], site, pageKey);
    siteAnalysis[pageKey] = analysis;
    allImages.push(...analysis.images);
  });

  return {
    pages: siteAnalysis,
    allImages,
    totalImages: allImages.length,
    siteHealth: Object.values(siteAnalysis).reduce((acc, curr) => acc + curr.score, 0) / Object.keys(siteAnalysis).length || 0
  };
};