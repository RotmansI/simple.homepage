"use client";

import React from 'react';
import { Droplets, Sparkles } from 'lucide-react';
import { SmartColorPicker } from '../controls/SmartColorPicker';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

interface EdgeEffectsGroupProps {
  content: any;
  updateContent: (updates: any) => void;
  allSectionsContent?: any;
  site?: any; 
}

export const EdgeEffectsGroup = ({ 
  content, 
  updateContent, 
  allSectionsContent,
  site
}: EdgeEffectsGroupProps) => {
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  const isRTL = lang === 'he';

  // פונקציית עזר לשליפת מחרוזות בטוחה למניעת שגיאות Type
  const getGroupText = (key: 'title' | 'colorLabel' | 'spreadLabel' | 'opacityLabel') => {
    const val = t?.editor?.groups?.edgeEffects?.[key];
    return typeof val === 'string' ? val : key;
  };

  const updateFade = (type: 'top' | 'bottom', updates: any) => {
    const fadeKey = `${type}_fade`;
    updateContent({
      [fadeKey]: {
        ...(content[fadeKey] || { enabled: false, color: '#ffffff', spread: 100, opacity: 100 }),
        ...updates
      }
    });
  };

  const renderFadeControls = (type: 'top' | 'bottom') => {
    const data = content[`${type}_fade`] || { 
      enabled: false, 
      color: '#ffffff', 
      spread: 150, 
      opacity: 100 
    };

    // טיפול בטוח בטקסט הכותרת הדינמי
    const sides = t?.editor?.groups?.edgeEffects?.sides;
    const sideName = type === 'top' ? sides?.top : sides?.bottom;
    const rawTitle = t?.editor?.groups?.edgeEffects?.fadeTitle || "{type} Fade Effect";
    const fadeTitle = typeof rawTitle === 'string' 
      ? rawTitle.replace('{type}', sideName || type) 
      : `${sideName || type} Fade`;
    
    return (
      <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${data.enabled ? 'bg-brand-indigo/10 text-brand-indigo' : 'bg-brand-pearl text-brand-midnight/20'}`}>
              <Sparkles size={12} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tight text-brand-midnight">
              {fadeTitle}
            </span>
          </div>
          
          <button 
            type="button"
            onClick={() => updateFade(type, { enabled: !data.enabled })}
            className={`w-10 h-5 rounded-full transition-all relative ${data.enabled ? 'bg-brand-indigo' : 'bg-brand-lavender'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${
              data.enabled 
                ? (isRTL ? 'right-6' : 'left-6') 
                : (isRTL ? 'right-1' : 'left-1')
            }`} />
          </button>
        </div>

        {data.enabled && (
          <div className={`space-y-5 pt-4 border-t border-brand-lavender/30 animate-in fade-in slide-in-from-top-2 duration-300 ${isRTL ? 'text-right' : 'text-left'}`}>
            <SmartColorPicker 
              label={getGroupText('colorLabel')}
              value={data.color || '#ffffff'}
              onChange={(color) => updateFade(type, { color })}
              site={site}
              allSectionsContent={allSectionsContent}
            />

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="text-[9px] font-bold opacity-40 uppercase">{getGroupText('spreadLabel')}</span>
                <span className="text-[10px] font-mono font-bold text-brand-indigo">{data.spread}px</span>
              </div>
              <input 
                type="range" min="20" max="500" step="10"
                value={data.spread}
                onChange={(e) => updateFade(type, { spread: parseInt(e.target.value) || 0 })}
                className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="text-[9px] font-bold opacity-40 uppercase">{getGroupText('opacityLabel')}</span>
                <span className="text-[10px] font-mono font-bold text-brand-indigo">{data.opacity}%</span>
              </div>
              <input 
                type="range" min="0" max="100"
                value={data.opacity}
                onChange={(e) => updateFade(type, { opacity: parseInt(e.target.value) || 0 })}
                className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Droplets size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">
          {getGroupText('title')}
        </span>
      </div>

      <div className="space-y-4">
        {renderFadeControls('top')}
        {renderFadeControls('bottom')}
      </div>
    </div>
  );
};