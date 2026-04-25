"use client";

import React from 'react';
import { Sparkles, Eye, Info } from 'lucide-react';
import SiteNavbar from '@/components/sites/SiteNavbar';

export const NavbarPreviewCanvas = ({ site, previewMode }: any) => {
  if (!site) return null;

  // חילוץ נתונים בזמן אמת מהאדיטור
  const navData = site?.draft_data?.navbar || {};
  const pages = site?.draft_data?.pages || {};
  const theme = site?.theme_settings || {};
  
  // בניית אובייקט ה-Settings ש-SiteNavbar מצפה לו
  const mockSettings = {
    navbar: navData
  };

  return (
    <main className="flex-1 bg-brand-grey/20 overflow-y-auto custom-scrollbar flex flex-col items-center">
      
      {/* אינדיקטור מצב פוקוס עליון */}
      <div className="py-8 text-center animate-in fade-in slide-in-from-top-4">
        <div className="flex items-center justify-center gap-2 text-brand-main bg-white px-6 py-2 rounded-full w-fit mx-auto border border-brand-lavender/50 shadow-sm mb-2">
          <Sparkles size={16} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Navigation Studio</span>
        </div>
      </div>

      {/* קונטיינר הסימולטור - שים לב לשינוי הרוחב כאן */}
      <div 
        className={`
          bg-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.12)] 
          transition-all duration-500 ease-in-out relative flex flex-col
          ${previewMode === 'desktop' ? 'w-full min-h-[120vh]' : 'w-[375px] h-[667px] mb-20'} 
          rounded-t-[3rem] border-x border-t border-brand-lavender/30 overflow-hidden
        `}
      >
        {/* בידוד לייט-מוד כדי למנוע קונפליקטים עם האדיטור */}
        <div className="flex-1 bg-white relative z-10 light" style={{ colorScheme: 'light' }}>
          
          <SiteNavbar 
            //Props המקוריים של הקומפוננטה שלך
            pages={pages}
            slug={site.slug}
            activePage={site?.draft_data?.activePage || 'home'}
            settings={mockSettings}
            // חשוב: orgName ו-theme מוזרקים כאן כדי שהטקסט/לוגו יתעדכנו
            orgName={site.brand_name} 
            theme={theme}
            isPreview={true}
          />

          {/* גוף עמוד ריק - נותן פרופורציה לנאב-בר */}
          <div className="p-20 space-y-12 opacity-[0.03] pointer-events-none">
             <div className="h-96 bg-brand-dark rounded-[3rem]" />
             <div className="grid grid-cols-3 gap-8">
                <div className="h-64 bg-brand-dark rounded-[2rem]" />
                <div className="h-64 bg-brand-dark rounded-[2rem]" />
                <div className="h-64 bg-brand-dark rounded-[2rem]" />
             </div>
          </div>
        </div>

        {/* Notch למובייל */}
        {previewMode === 'mobile' && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-brand-dark rounded-b-[1.5rem] z-[110]" />
        )}
      </div>

      {/* טיפ תחתון - מוצג רק אם העמוד לא ארוך מדי */}
      <div className="py-10 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3 text-brand-charcoal/30 bg-white/60 px-6 py-3 rounded-2xl border border-brand-lavender/30">
          <Eye size={14} className="text-brand-main" />
          <span className="text-[10px] font-black uppercase tracking-widest">Interactive UI Preview</span>
        </div>
      </div>
    </main>
  );
};