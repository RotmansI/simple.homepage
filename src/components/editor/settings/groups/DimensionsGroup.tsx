"use client";

import React from 'react';
import { Maximize2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

interface DimensionsGroupProps {
  content: any;
  updateContent: (updates: any) => void;
  site?: any; 
}

export const DimensionsGroup = ({ content, updateContent, site }: DimensionsGroupProps) => {
  const { lang } = useLanguage();
  const t = translations[lang as Language];

  return (
    <div className="space-y-6" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      {/* כותרת הקבוצה */}
      <div className={`flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6 ${lang === 'he' ? 'text-right' : 'text-left'}`}>
        <Maximize2 size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">
          {t?.editor?.groups?.dimensions?.title || "Section Dimensions"}
        </span>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-4">
        <div className="flex justify-between items-center px-1">
          <div className={`flex flex-col ${lang === 'he' ? 'text-right' : 'text-left'}`}>
             <span className="text-[9px] font-bold opacity-40 uppercase">
               {t?.editor?.groups?.dimensions?.heightLabel || "Section Height"}
             </span>
             <span className="text-[8px] opacity-30 italic">
               {t?.editor?.groups?.dimensions?.heightDesc || "Set the maximum height in pixels"}
             </span>
          </div>
          <span className="text-[10px] font-mono font-bold text-brand-indigo bg-brand-indigo/5 px-2 py-0.5 rounded-md">
            {content.max_height || 600}px
          </span>
        </div>
        
        <input 
          type="range" 
          min="200" 
          max="1200" 
          step="10"
          value={content.max_height || 600}
          onChange={(e) => updateContent({ max_height: parseInt(e.target.value) })}
          className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
        />
        
        <div className="flex justify-between px-1 text-[8px] font-bold opacity-20 uppercase">
          <span>{t?.editor?.groups?.dimensions?.min || "Min"} (200px)</span>
          <span>{t?.editor?.groups?.dimensions?.max || "Max"} (1200px)</span>
        </div>
      </div>
    </div>
  );
};