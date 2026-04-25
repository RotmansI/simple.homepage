import { supabase } from '@/lib/supabase';

/**
 * שליפת כל הנכסים של אתר ספציפי בנתיב מסוים
 * כולל ספירת פריטים בתיקיות וחילוץ סיווג (Classification)
 */
export const fetchSiteAssets = async (siteId: string, path: string = "") => {
  if (!siteId) return [];

  // בניית הנתיב המלא בתוך ה-Bucket
  const fullPath = path ? `${siteId}/${path}` : siteId;

  try {
    const { data, error } = await supabase
      .storage
      .from('site-assets')
      .list(fullPath, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

    if (error) throw error;

    // סינון קבצי מערכת וקבצים נסתרים
    const filteredFiles = data.filter((file: any) => 
      file.name !== '.keep' && 
      file.name !== '.emptyFolderPlaceholder' &&
      !file.name.startsWith('.')
    );

    // עיבוד אסינכרוני להוספת Metadata וספירת פריטים
    const assetsWithCounts = await Promise.all(filteredFiles.map(async (file: any) => {
      // זיהוי אם מדובר בתיקייה (בסופאבייס תיקיות מגיעות ללא metadata מלא או ID)
      const isFolder = !file.metadata || !file.id;
      let itemCount = 0;
      let classification = null;

      if (isFolder) {
        // במידה וזו תיקייה - נבצע קריאה מהירה לספירת הקבצים שבתוכה
        const { data: folderContent } = await supabase.storage
          .from('site-assets')
          .list(`${fullPath}/${file.name}`);
        
        // סופרים רק קבצים אמיתיים
        itemCount = folderContent?.filter(f => f.name !== '.keep' && !f.name.startsWith('.')).length || 0;
      } else {
        // במידה וזה קובץ - נשלוף את הסיווג מתוך ה-Custom Metadata
        // שים לב: המידע נשמר תחת custom_metadata בתוך אובייקט ה-metadata
        classification = file.metadata?.custom_metadata?.classification || null;
      }

      let url = "";
      if (!isFolder) {
        // הפקת URL ציבורי עבור קבצים
        const { data: { publicUrl } } = supabase.storage
          .from('site-assets')
          .getPublicUrl(`${fullPath}/${file.name}`);
        url = publicUrl;
      }

      return {
        id: file.id || `folder-${file.name}`,
        name: file.name,
        url: url,
        isFolder: isFolder,
        itemCount: itemCount,
        classification: classification, // הסיווג ששמור בענן
        created_at: file.created_at,
        path: path ? `${path}/${file.name}` : file.name
      };
    }));

    return assetsWithCounts;
  } catch (error) {
    console.error("❌ Error fetching assets:", error);
    return [];
  }
};

export const fetchAllAssetsRecursive = async (siteId: string) => {
  if (!siteId) return [];

  try {
    // 1. נשלוף את כל הקבצים והתיקיות ב-Root של האתר
    const { data: rootItems, error: rootError } = await supabase.storage
      .from('site-assets')
      .list(siteId);

    if (rootError) throw rootError;

    let allFiles: any[] = [];

    // 2. פונקציית עזר לסריקת תיקייה
    const scanFolder = async (path: string, folderName: string) => {
      const fullFolderPath = `${path}/${folderName}`;
      const { data: items } = await supabase.storage
        .from('site-assets')
        .list(fullFolderPath);

      if (!items) return;

      for (const item of items) {
        const itemPath = `${fullFolderPath}/${item.name}`;
        
        if (!item.metadata) { 
          // זו תיקייה - נסרוק אותה (עד רמה מסוימת)
          await scanFolder(fullFolderPath, item.name);
        } else if (item.name !== '.keep') {
          // זה קובץ - נפיק לו URL ונשמור
          const { data: { publicUrl } } = supabase.storage
            .from('site-assets')
            .getPublicUrl(itemPath);

          allFiles.push({
            id: item.id,
            name: item.name,
            url: publicUrl,
            path: itemPath.replace(`${siteId}/`, '').replace(`/${item.name}`, ''),
            created_at: item.created_at
          });
        }
      }
    };

    // 3. נתחיל בסריקה של פריטי ה-Root
    for (const item of rootItems) {
      if (!item.metadata) {
        await scanFolder(siteId, item.name);
      } else if (item.name !== '.keep') {
        const { data: { publicUrl } } = supabase.storage
          .from('site-assets')
          .getPublicUrl(`${siteId}/${item.name}`);

        allFiles.push({
          id: item.id,
          name: item.name,
          url: publicUrl,
          path: 'Root',
          created_at: item.created_at
        });
      }
    }

    return allFiles;
  } catch (error) {
    console.error("Recursive fetch failed:", error);
    return [];
  }
};