"use client";

import React from 'react';
import { Info, Layout } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

interface SectionBasicGroupProps {
  content: {
    name?: string;
    description?: string;
  };
  updateContent: (updates: any) => void;
}

export const SectionBasicGroup = ({ content, updateContent }: SectionBasicGroupProps) => {
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  const isRTL = lang === 'he';

  // פונקציית עזר לשליפה בטוחה של תרגומים
  const getT = (key: string, fallback: string): string => {
    return t?.editor?.groups?.sectionBasic?.[key as keyof typeof t.editor.groups.sectionBasic] || fallback;
  };

  return (
    <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* כותרת הקבוצה */}
      <div className={`flex items-center gap-2 px-1 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Layout size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">
          {getT('title', 'Section Identity')}
        </span>
      </div>

      {/* קופסת ההגדרות */}
      <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-4">
        
        {/* שם פנימי */}
        <div className="space-y-1.5">
          <div className={`flex items-center justify-between px-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <span className="text-[9px] font-bold opacity-40 uppercase">
              {getT('nameLabel', 'Internal Name')}
            </span>
          </div>
          <input 
            type="text"
            className={`w-full bg-brand-pearl/50 border border-transparent focus:border-brand-indigo/30 rounded-xl px-4 py-2.5 text-[12px] font-bold outline-none transition-all shadow-inner placeholder:opacity-30 ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={getT('namePlaceholder', 'e.g., Summer Promotion Hero')}
            value={content.name || ''}
            onChange={(e) => updateContent({ name: e.target.value })}
          />
          <p className={`text-[8px] opacity-40 italic px-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            {getT('nameHelper', 'Visible in structure sidebar and breadcrumbs')}
          </p>
        </div>

        {/* תיאור פנימי */}
        <div className="space-y-1.5 pt-2 border-t border-brand-lavender/30">
          <div className={`flex items-center gap-1.5 px-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <Info size={10} className="opacity-40" />
            <span className="text-[9px] font-bold opacity-40 uppercase">
              {getT('descLabel', 'Internal Description')}
            </span>
          </div>
          <textarea 
            className={`w-full bg-brand-pearl/50 border border-transparent focus:border-brand-indigo/30 rounded-xl px-4 py-3 text-[11px] font-medium outline-none transition-all shadow-inner min-h-[80px] resize-none placeholder:opacity-30 ${isRTL ? 'text-right' : 'text-left'}`}
            placeholder={getT('descPlaceholder', 'Internal note...')}
            value={content.description || ''}
            onChange={(e) => updateContent({ description: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};