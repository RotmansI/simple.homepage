"use client";

import React from 'react';
import { Maximize, Layers } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

export function MenuLayoutGroup({ settings, onUpdate }: any) {
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  const isRTL = lang === 'he';

  // פונקציית עזר לשליפה בטוחה של תרגומים
  const getT = (key: string, fallback: string): string => {
    return t?.editor?.groups?.menuLayout?.[key as keyof typeof t.editor.groups.menuLayout] || fallback;
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Layers size={14} className="text-brand-main" />
        <span className="text-[10px] font-black uppercase text-brand-midnight tracking-widest">
          {getT('title', 'Menu Scale')}
        </span>
      </div>

      {/* Menu Scale Slider */}
      <div className="space-y-3 bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm">
        <div className={`flex items-center gap-2 justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-2">
            <Maximize size={14} className="text-brand-main" />
            <span className="text-[11px] font-bold text-brand-midnight">
              {getT('sliderLabel', 'Menu Scale')}
            </span>
          </div>
          <span className="text-[10px] font-black text-brand-main">{settings.menuScale ?? 100}%</span>
        </div>
        <input 
          type="range" min="50" max="150" step="5"
          value={settings.menuScale ?? 100}
          onChange={(e) => onUpdate({ menuScale: parseInt(e.target.value) || 0 })}
          className="w-full accent-brand-main cursor-pointer"
        />
        <p className={`text-[9px] font-medium text-brand-slate/60 text-center italic leading-relaxed`}>
          {getT('description', 'Smaller scale allows more items per row')}
        </p>
      </div>
    </div>
  );
}