"use client";

import React from 'react';
import { ArrowsUpFromLine, Palette, Ghost } from 'lucide-react';
import { SmartColorPicker } from '../controls/SmartColorPicker';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

interface SpacerGroupProps {
  site: any;
  content: any;
  updateContent: (updates: any) => void;
  allSectionsContent?: any;
  prefix?: string;
}

export const SpacerGroup = ({ 
  site,
  content, 
  updateContent, 
  allSectionsContent,
  prefix = "" 
}: SpacerGroupProps) => {
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  const isRTL = lang === 'he';
  
  const getVal = (key: string) => content[`${prefix}${key}`];
  const setVal = (key: string, val: any) => updateContent({ [`${prefix}${key}`]: val });

  // פונקציית עזר לשליפה בטוחה של תרגומים
  const getT = (key: string, fallback: string): string => {
    const keys = key.split('.');
    let current: any = t?.editor?.groups?.spacer;
    for (const k of keys) {
      if (current?.[k] === undefined) return fallback;
      current = current[k];
    }
    return typeof current === 'string' ? current : fallback;
  };

  const themeSettings = site?.draft_data?.theme_settings || site?.theme_settings;
  const themeColors = themeSettings ? [
    themeSettings.primary_color,
    themeSettings.secondary_color,
    themeSettings.accent_color,
    themeSettings.neutral_color,
    '#000000',
    '#ffffff'
  ].filter(Boolean) : undefined;

  const isTransparent = getVal('spacer_transparent') ?? true;

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* כותרת הקבוצה */}
      <div className={`flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <ArrowsUpFromLine size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">
          {getT('title', 'Spacer Settings')}
        </span>
      </div>

      <div className="space-y-4">
        {/* גובה הספייסר */}
        <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-4">
          <div className={`flex justify-between items-center px-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-2 opacity-40">
              <ArrowsUpFromLine size={12} />
              <span className="text-[9px] font-bold uppercase">{getT('height', 'Height')}</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-brand-indigo bg-brand-indigo/5 px-2 py-0.5 rounded-md">
              {getVal('spacer_height') ?? 40}px
            </span>
          </div>
          
          <input 
            type="range" min="0" max="200" step="4"
            value={getVal('spacer_height') ?? 40}
            onChange={(e) => setVal('spacer_height', parseInt(e.target.value) || 0)}
            className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
          />
        </div>

        {/* מראה (שקוף/צבעוני) */}
        <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-4">
          <div className={`flex items-center justify-between px-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-2 opacity-40">
              <Ghost size={12} />
              <span className="text-[9px] font-bold uppercase">{getT('appearance', 'Appearance')}</span>
            </div>
            
            <button 
              type="button"
              onClick={() => setVal('spacer_transparent', !isTransparent)}
              className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all ${
                isTransparent 
                ? 'bg-brand-pearl border-brand-lavender text-brand-midnight/40' 
                : 'bg-brand-indigo/10 border-brand-indigo/30 text-brand-indigo'
              }`}
            >
              <span className="text-[8px] font-black uppercase">
                {isTransparent ? getT('modes.transparent', 'Transparent') : getT('modes.solid', 'Solid Color')}
              </span>
              <div className={`w-2 h-2 rounded-full ${isTransparent ? 'bg-brand-lavender' : 'bg-brand-indigo'}`} />
            </button>
          </div>

          {!isTransparent && (
            <div className={`pt-4 border-t border-brand-lavender/30 animate-in fade-in slide-in-from-top-2 duration-300 space-y-5 ${isRTL ? 'text-right' : 'text-left'}`}>
              <SmartColorPicker 
                label={getT('colorLabel', 'Spacer Color')}
                value={getVal('spacer_color') || (themeColors ? themeColors[0] : '#000000')}
                onChange={(color) => setVal('spacer_color', color)}
                site={site}
                allSectionsContent={allSectionsContent}
              />

              <div className="space-y-3">
                <div className={`flex justify-between items-center px-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-[9px] font-bold opacity-40 uppercase">{getT('opacity', 'Opacity')}</span>
                  <span className="text-[10px] font-mono font-bold text-brand-indigo">{getVal('spacer_opacity') ?? 100}%</span>
                </div>
                <input 
                  type="range" min="0" max="100"
                  value={getVal('spacer_opacity') ?? 100}
                  onChange={(e) => setVal('spacer_opacity', parseInt(e.target.value) || 0)}
                  className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};