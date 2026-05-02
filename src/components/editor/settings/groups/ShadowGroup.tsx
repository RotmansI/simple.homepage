"use client";

import React from 'react';
import { Layers, Box, Sun } from 'lucide-react';
import { SmartColorPicker } from '../controls/SmartColorPicker';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

interface ShadowGroupProps {
  content: any;
  updateContent: (updates: any) => void;
  allSectionsContent?: any;
  site?: any; 
  prefix?: string;
}

export const ShadowGroup = ({ 
  content, 
  updateContent, 
  allSectionsContent,
  site, 
  prefix = "" 
}: ShadowGroupProps) => {
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  const isRTL = lang === 'he';
  
  const getVal = (key: string) => content[`${prefix}${key}`];
  const setVal = (key: string, val: any) => updateContent({ [`${prefix}${key}`]: val });

  const shadowIntensity = getVal('shadow_intensity') ?? 0;

  // פונקציית עזר לשליפה בטוחה של תרגומים
  const getT = (key: string, fallback: any): any => {
    return t?.editor?.groups?.shadow?.[key as keyof typeof t.editor.groups.shadow] || fallback;
  };

  const shadowLevels = getT('levels', ['None', 'Subtle', 'Medium', 'Strong']);

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* כותרת הקבוצה */}
      <div className={`flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Box size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">
          {getT('title', 'Elevation & Shadows')}
        </span>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-5">
          <div className={`flex items-center justify-between px-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-2 opacity-40">
              <Sun size={12} />
              <span className="text-[9px] font-bold uppercase">{getT('intensity', 'Shadow Intensity')}</span>
            </div>
            <span className="text-[10px] font-black text-brand-indigo uppercase italic">
              {shadowLevels[shadowIntensity] || shadowLevels[0]}
            </span>
          </div>

          <div className="px-2">
            <input 
              type="range" min="0" max="3" step="1"
              value={shadowIntensity}
              onChange={(e) => setVal('shadow_intensity', parseInt(e.target.value) || 0)}
              className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
            />
          </div>
        </div>

        {shadowIntensity > 0 && (
          <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
             <div className={`flex items-center gap-2 opacity-40 ${isRTL ? 'mr-1' : 'ml-1'}`}>
              <Layers size={12} />
              <span className="text-[9px] font-bold uppercase">{getT('color', 'Shadow Color')}</span>
            </div>
            
            <SmartColorPicker 
              label={getT('tintLabel', 'Select Shadow Tint')}
              value={getVal('shadow_color') || 'rgba(0,0,0,0.1)'}
              onChange={(color) => setVal('shadow_color', color)}
              site={site}
              allSectionsContent={allSectionsContent}
            />
          </div>
        )}
      </div>
    </div>
  );
};