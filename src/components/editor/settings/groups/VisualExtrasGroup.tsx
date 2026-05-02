"use client";

import React from 'react';
import { MousePointer2, Eye, Palette, Type } from 'lucide-react';
import { SmartColorPicker } from '../controls/SmartColorPicker';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

interface VisualExtrasGroupProps {
  content: any;
  updateContent: (updates: any) => void;
  allSectionsContent?: any;
  site: any; 
  prefix?: string;
}

export const VisualExtrasGroup = ({ 
  content, 
  updateContent, 
  allSectionsContent,
  site,
  prefix = "" 
}: VisualExtrasGroupProps) => {
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  const isRTL = lang === 'he';
  
  const getVal = (key: string) => content[`${prefix}${key}`];
  const setVal = (key: string, val: any) => updateContent({ [`${prefix}${key}`]: val });

  // פונקציית עזר לשליפה בטוחה של תרגומים
  const getT = (path: string, fallback: string): string => {
    const keys = path.split('.');
    let current: any = t?.editor?.groups?.visualExtras;
    for (const key of keys) {
      if (current?.[key] === undefined) return fallback;
      current = current[key];
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

  const isOutline = getVal('is_outline');

  const handleThemeColorChange = (color: string) => {
    if (isOutline) {
      updateContent({
        [`${prefix}bg_color`]: color,
        [`${prefix}text_color`]: color
      });
    } else {
      setVal('bg_color', color);
    }
  };

  return (
    <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <MousePointer2 size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">
          {getT('title', 'Button Styling')}
        </span>
      </div>

      {/* 1. Smart Outline Toggle */}
      <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm">
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isOutline ? 'bg-brand-indigo/10 text-brand-indigo' : 'bg-brand-pearl text-brand-midnight/20'}`}>
              <Eye size={12} />
            </div>
            <div className={`flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
              <span className="text-[10px] font-black uppercase tracking-tight text-brand-midnight">
                {getT('outline.label', 'Outline Style')}
              </span>
              <span className="text-[8px] opacity-40 font-bold uppercase">
                {getT('outline.helper', '40% Alpha Glass effect')}
              </span>
            </div>
          </div>
          <button 
            type="button"
            onClick={() => {
              const nextState = !isOutline;
              if (nextState) {
                updateContent({
                  [`${prefix}is_outline`]: true,
                  [`${prefix}text_color`]: getVal('bg_color') || (themeColors ? themeColors[0] : '#6366f1')
                });
              } else {
                setVal('is_outline', false);
              }
            }}
            className={`w-10 h-5 rounded-full transition-all relative ${isOutline ? 'bg-brand-indigo' : 'bg-brand-lavender'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${
              isOutline 
                ? (isRTL ? 'right-6' : 'left-6') 
                : (isRTL ? 'right-1' : 'left-1')
            }`} />
          </button>
        </div>
      </div>

      {/* 2. Color Selection */}
      <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-6">
        <div className="space-y-4">
          <div className={`flex items-center gap-2 opacity-40 ${isRTL ? 'mr-1' : 'ml-1'}`}>
            <Palette size={12} />
            <span className="text-[9px] font-bold uppercase">
              {isOutline ? getT('colors.theme', 'Theme Color') : getT('colors.background', 'Background Color')}
            </span>
          </div>
          <SmartColorPicker 
            label={isOutline ? getT('pickers.theme', 'Theme Color') : getT('pickers.background', 'Background')}
            value={getVal('bg_color') || (themeColors ? themeColors[0] : '#6366f1')}
            onChange={handleThemeColorChange}
            site={site}
            allSectionsContent={allSectionsContent}
          />
        </div>

        {!isOutline && (
          <div className="space-y-4 pt-4 border-t border-brand-lavender/30">
            <div className={`flex items-center gap-2 opacity-40 ${isRTL ? 'mr-1' : 'ml-1'}`}>
              <Type size={12} />
              <span className="text-[9px] font-bold uppercase">{getT('colors.text', 'Text Color')}</span>
            </div>
            <SmartColorPicker 
              label={getT('colors.text', 'Text Color')}
              value={getVal('text_color') || '#ffffff'}
              onChange={(color) => setVal('text_color', color)}
              site={site}
              allSectionsContent={allSectionsContent}
            />
          </div>
        )}
      </div>
    </div>
  );
};