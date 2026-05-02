"use client";

import React from 'react';
import { Maximize2, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

interface ImageLayoutGroupProps {
  content: any;
  updateContent: (updates: any) => void;
}

export const ImageLayoutGroup = ({ content, updateContent }: ImageLayoutGroupProps) => {
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  const isRTL = lang === 'he';

  // פונקציית עזר לשליפת מחרוזות בטוחה
  const getT = (path: string, fallback: string): string => {
    const keys = path.split('.');
    let current: any = t?.editor?.groups?.imageLayout;
    for (const key of keys) {
      if (current?.[key] === undefined) return fallback;
      current = current[key];
    }
    return typeof current === 'string' ? current : fallback;
  };

  return (
    <div 
      className={`space-y-6 bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm mb-4 ${isRTL ? 'text-right' : 'text-left'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* כותרת הקבוצה */}
      <div className="flex items-center gap-2 px-1">
        <Maximize2 size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">
          {getT('title', 'Image Layout')}
        </span>
      </div>

      <div className="space-y-4">
        {/* Alignment Control */}
        <div className="space-y-2">
          <span className={`text-[9px] font-bold uppercase opacity-40 ${isRTL ? 'mr-1' : 'ml-1'}`}>
            {getT('alignment', 'Alignment')}
          </span>
          <div className="flex bg-brand-pearl p-1 rounded-xl gap-1">
            {[
              { id: 'left', icon: isRTL ? AlignRight : AlignLeft },
              { id: 'center', icon: AlignCenter },
              { id: 'right', icon: isRTL ? AlignLeft : AlignRight }
            ].map((dir) => (
              <button
                key={dir.id}
                onClick={() => updateContent({ text_align: dir.id })}
                className={`flex-1 flex justify-center py-2 rounded-lg transition-all ${
                  (content.text_align || 'left') === dir.id 
                  ? 'bg-white text-brand-indigo shadow-md' 
                  : 'text-brand-midnight/40 hover:text-brand-midnight hover:bg-white/50'
                }`}
              >
                <dir.icon size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Width / Scale Control */}
        <div className="space-y-3 pt-2">
          <div className="flex justify-between items-center px-1">
            <span className="text-[9px] font-bold uppercase opacity-40">
              {getT('width', 'Component Width')}
            </span>
            <span className="text-[10px] font-mono font-bold text-brand-indigo bg-brand-indigo/5 px-2 py-0.5 rounded-md">
              {content.width || 300}px
            </span>
          </div>
          <div className="px-1">
            <input 
              type="range" min="40" max="1200" step="10"
              value={content.width || 300}
              onChange={(e) => updateContent({ width: parseInt(e.target.value) || 0 })}
              className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
            />
            <div className="flex justify-between mt-2 px-1 opacity-20 text-[7px] font-black uppercase tracking-tighter">
              <span>{getT('sizes.small', 'Small')}</span>
              <span>{getT('sizes.medium', 'Medium')}</span>
              <span>{getT('sizes.full', 'Full Width')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};