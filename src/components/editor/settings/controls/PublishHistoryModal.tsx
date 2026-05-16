import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  History, X, Loader2, CheckCircle, Clock, 
  User, Clipboard, Check, SlidersHorizontal, RotateCcw 
} from 'lucide-react';

interface PublishHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  site: any;
  lang: string;
  activePageKey: string;
  updateSiteWithHistory: (newSite: any) => void;
  markChanged: (type: 'section' | 'page' | 'site', id: string) => void;
}

export default function PublishHistoryModal({
  isOpen,
  onClose,
  site,
  lang,
  activePageKey,
  updateSiteWithHistory,
  markChanged
}: PublishHistoryModalProps) {
  const [publications, setPublications] = useState<any[]>([]);
  const [loadingPublicationId, setLoadingPublicationId] = useState<string | null>(null);
  const [restoredVersionInfo, setRestoredVersionInfo] = useState<{ date: string; by: string } | null>(null);
  const [copiedFieldId, setCopiedFieldId] = useState<string | null>(null);

  // שליפת 5 גרסאות הפרסום האחרונות מה-DB
  const fetchPublishHistory = async () => {
    if (!site) return;
    try {
      const { data, error } = await supabase
        .from('site_publications')
        .select('*')
        .eq('site_id', site.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setPublications(data || []);
    } catch (err) {
      console.error("Error fetching publish history:", err);
    }
  };

  // שליפה אוטומטית בכל פעם שהמודאל נפתח
  useEffect(() => {
    if (isOpen) {
      fetchPublishHistory();
      setRestoredVersionInfo(null); // איפוס הודעת הצלחה קודמת בכל פתיחה מחדש
    }
  }, [isOpen]);

  // לוגיקת שחזור גרסה עם סימולציית טעינה (3.5 שניות)
  const handleRollback = async (pub: any) => {
    setLoadingPublicationId(pub.id);
    setRestoredVersionInfo(null);

    // סימולציית תהליך טעינה של 3.5 שניות
    await new Promise(resolve => setTimeout(resolve, 3500));

    // עדכון מקומי של האדיטור בנתוני הגרסה מהעבר
    const updatedSite = {
      ...site,
      draft_data: pub.published_data,
      theme_settings: pub.published_theme
    };

    // דחיפה למערכת הסטייט וה-Undo בקומפוננטת האב
    updateSiteWithHistory(updatedSite);
    markChanged('page', activePageKey);

    // הגדרת נתוני הגרסה ששוחזרה עבור הודעת הסיום
    setRestoredVersionInfo({
      date: new Date(pub.created_at).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' }),
      by: pub.published_by || 'System User'
    });
    
    setLoadingPublicationId(null);
  };

  // פונקציית עזר להעתקת ה-JSON למקלדת
  const copyJsonToClipboard = (json: any, fieldKey: string) => {
    navigator.clipboard.writeText(JSON.stringify(json, null, 2));
    setCopiedFieldId(fieldKey);
    setTimeout(() => setCopiedFieldId(null), 2000); // איפוס האייקון אחרי 2 שניות
  };

  if (!isOpen) return null;

  const isRtl = lang === 'he';

  return (
    <div 
      className="fixed inset-0 bg-brand-midnight/40 backdrop-blur-sm z-[300] flex items-center justify-center p-4 animate-in fade-in duration-200"
      dir={isRtl ? 'rtl' : 'ltr'} // 🎯 הזרקת כיווניות גלובלית למודאל כולו
    >
      
      {/* רקע שקוף לסגירה בלחיצה בחוץ (בתנאי שאין לואודר פעיל) */}
      {!loadingPublicationId && <div className="absolute inset-0" onClick={onClose} />}
      
      <div className="bg-white border-2 border-brand-mint w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        
        {/* כותרת המודאל */}
        <div className="p-5 border-b border-brand-mint/20 flex items-center justify-between bg-gray-50">
          <div className="flex items-center gap-2 text-brand-main">
            <History size={20} />
            <h3 className="font-black text-sm uppercase tracking-wide">
              {isRtl ? 'היסטוריית פרסומים (עד 5 אחרונים)' : 'Publication History'}
            </h3>
          </div>
          {!loadingPublicationId && (
            <button type="button" onClick={onClose} className="text-gray-400 hover:text-brand-charcoal transition-colors">
              <X size={20} />
            </button>
          )}
        </div>

        {/* תוכן המודאל */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col justify-center">
          
          {loadingPublicationId ? (
            /* מצב 1: לואודר סימולציית טעינה */
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader2 size={40} className="animate-spin text-brand-main" />
              <div className="text-center">
                <p className="font-black text-brand-main text-sm animate-pulse">
                  {isRtl ? 'שולף נתוני ארכיון ומבצע קונפיגורציה...' : 'Retrieving archive and configuring data...'}
                </p>
                <p className="text-[11px] font-bold text-gray-400 mt-1">
                  {isRtl ? 'תהליך השחזור אורך מספר שניות' : 'Rollback takes a few seconds'}
                </p>
              </div>
            </div>
          ) : restoredVersionInfo ? (
            /* מצב 2: מסך הצלחה לאחר שחזור */
            <div className="bg-brand-mint/30 border-2 border-brand-main p-6 rounded-xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-3 text-brand-main">
                <CheckCircle size={24} />
                <h4 className="font-black text-lg">{isRtl ? 'הגרסה שוחזרה בהצלחה!' : 'Version Restored Successfully!'}</h4>
              </div>
              
              <div className="bg-white/80 border border-brand-main/20 p-4 rounded-lg text-xs font-bold text-brand-charcoal flex flex-col gap-2 shadow-sm">
                <div className="flex items-center gap-1.5"><Clock size={14} className="text-brand-main" /> <span>{isRtl ? 'תאריך פרסום מקורי:' : 'Original Publish Date:'} {restoredVersionInfo.date}</span></div>
                <div className="flex items-center gap-1.5"><User size={14} className="text-brand-main" /> <span>{isRtl ? 'פורסם על ידי:' : 'Published By:'} {restoredVersionInfo.by}</span></div>
              </div>

              <p className="text-xs font-black text-brand-indigo bg-brand-indigo/5 border border-brand-indigo/20 p-3 rounded-lg leading-relaxed">
                💡 {isRtl 
                  ? 'הגרסה נטענה בהצלחה לתוך סביבת העבודה באדיטור. שים לב: יש לבצע שמירה ופרסום מחדש על מנת להחיל את השינויים הללו בפועל על האתר הציבורי של הלקוחות.'
                  : 'The version loaded into your editor environment. Note: You must save and publish again to apply these changes onto the live public site.'}
              </p>
              
              <button 
                type="button"
                onClick={onClose}
                className={`mt-2 bg-brand-main text-white px-5 py-2.5 rounded-xl font-black text-xs hover:scale-102 transition-all shadow-md ${isRtl ? 'self-start' : 'self-end'}`}
              >
                {isRtl ? 'הבנתי, חזרה לאדיטור' : 'Got it, back to editor'}
              </button>
            </div>
          ) : publications.length === 0 ? (
            /* מצב 3: רשימה ריקה */
            <div className="text-center py-8 text-xs font-bold text-gray-400">
              {isRtl ? 'לא נמצאו גרסאות פורסמות קודמות לאתר זה.' : 'No previous versions found for this site.'}
            </div>
          ) : (
            /* מצב 4: רשימת הגרסאות לשחזור */
            <div className="flex flex-col gap-3">
              <p className="text-[11px] font-bold text-gray-400 mb-2">
                {isRtl ? 'בחר גרסה מהעבר כדי לטעון אותה בחזרה לתוך משטח העבודה:' : 'Select a past version to load back into your workspace:'}
              </p>
              
              {publications.map((pub, idx) => {
                const pubId = pub.id;
                const dateStr = new Date(pub.created_at).toLocaleString('he-IL', { dateStyle: 'short', timeStyle: 'short' });
                
                return (
                  <div key={pubId} className="border border-brand-mint/30 rounded-xl p-4 flex items-center justify-between hover:border-brand-main/40 transition-all bg-gray-50/50 hover:bg-white shadow-sm gap-4">
                    
                    {/* פרטי הגרסה */}
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-brand-mint text-brand-main flex items-center justify-center text-[10px] font-black shadow-inner">#{publications.length - idx}</span>
                        <span className="text-xs font-black text-brand-charcoal truncate">{dateStr}</span>
                        {idx === 0 && (
                          <span className="bg-brand-indigo/10 text-brand-indigo border border-brand-indigo/20 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tight">
                            {isRtl ? 'נוכחי בציבורי' : 'Live Now'}
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                        <User size={12} />
                        <span className="truncate">{pub.published_by || 'System User'}</span>
                      </div>
                    </div>

                    {/* כפתורי פעולה והעתקת ג'ייסונים */}
                    <div className="flex items-center gap-2 shrink-0">
                      
                      {/* העתקת דאטה */}
                      <button 
                        type="button"
                        onClick={() => copyJsonToClipboard(pub.published_data, `data-${pubId}`)}
                        className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-brand-main hover:border-brand-main transition-all bg-white"
                        title={isRtl ? 'העתק JSON של התוכן' : 'Copy Content JSON'}
                      >
                        {copiedFieldId === `data-${pubId}` ? <Check size={14} className="text-green-600" /> : <Clipboard size={14} />}
                      </button>

                      {/* העתקת תמה */}
                      <button 
                        type="button"
                        onClick={() => copyJsonToClipboard(pub.published_theme, `theme-${pubId}`)}
                        className="p-2 border border-gray-200 rounded-lg text-gray-400 hover:text-brand-indigo hover:border-brand-indigo transition-all bg-white"
                        title={isRtl ? 'העתק JSON של העיצוב' : 'Copy Theme JSON'}
                      >
                        {copiedFieldId === `theme-${pubId}` ? <Check size={14} className="text-green-600" /> : <SlidersHorizontal size={14} />}
                      </button>

                      {/* כפתור שחזור */}
                      <button
                        type="button"
                        onClick={() => handleRollback(pub)}
                        className="flex items-center gap-1 bg-white border border-brand-main hover:bg-brand-main hover:text-white text-brand-main px-3 py-2 rounded-lg text-[10px] font-black transition-all shadow-sm"
                      >
                        <RotateCcw size={12} />
                        <span>{isRtl ? 'שחזר גרסה' : 'Rollback'}</span>
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}