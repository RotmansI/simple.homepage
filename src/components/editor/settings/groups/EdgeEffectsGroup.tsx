"use client";

import React from 'react';
import { AlignVerticalSpaceAround, Droplets, Sparkles } from 'lucide-react';
import { SmartColorPicker } from '../controls/SmartColorPicker';

// 1. עדכון ה-Interface שיכלול את site ו-allSectionsContent
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
  
  // 2. חילוץ צבעי המותג לפי הלוגיקה שעובדת ב-FrameGroup
  const themeSettings = site?.draft_data?.theme_settings || site?.theme_settings;
  const brandingColors = themeSettings ? [
    themeSettings.primary_color,
    themeSettings.secondary_color,
    themeSettings.accent_color,
    themeSettings.neutral_color,
    '#000000',
    '#ffffff'
  ].filter(Boolean) : undefined;

  // פונקציית עזר לעדכון הגדרות פייד ספציפיות
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
    
    return (
      <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-4">
        {/* Toggle Enable */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${data.enabled ? 'bg-brand-indigo/10 text-brand-indigo' : 'bg-brand-pearl text-brand-midnight/20'}`}>
              <Sparkles size={12} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tight text-brand-midnight">
              {type} Fade Effect
            </span>
          </div>
          <button 
            type="button"
            onClick={() => updateFade(type, { enabled: !data.enabled })}
            className={`w-10 h-5 rounded-full transition-all relative ${data.enabled ? 'bg-brand-indigo' : 'bg-brand-lavender'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${data.enabled ? 'left-6' : 'left-1'}`} />
          </button>
        </div>

        {data.enabled && (
          <div className="space-y-5 pt-4 border-t border-brand-lavender/30 animate-in fade-in slide-in-from-top-2 duration-300">
            {/* צבע הפייד - עכשיו עם brandingColors */}
            <SmartColorPicker 
              label="Fade Color"
              value={data.color || '#ffffff'}
              onChange={(color) => updateFade(type, { color })}
              site={site}
              allSectionsContent={allSectionsContent}
            />

            {/* פיזור (Spread) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="text-[9px] font-bold opacity-40 uppercase">Spread (Size)</span>
                <span className="text-[10px] font-mono font-bold text-brand-indigo">{data.spread}px</span>
              </div>
              <input 
                type="range" min="20" max="500" step="10"
                value={data.spread}
                onChange={(e) => updateFade(type, { spread: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
              />
            </div>

            {/* שקיפות (Opacity) */}
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <span className="text-[9px] font-bold opacity-40 uppercase">Fade Opacity</span>
                <span className="text-[10px] font-mono font-bold text-brand-indigo">{data.opacity}%</span>
              </div>
              <input 
                type="range" min="0" max="100"
                value={data.opacity}
                onChange={(e) => updateFade(type, { opacity: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
              />
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6">
        <Droplets size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">Edge Effects</span>
      </div>

      <div className="space-y-4">
        {renderFadeControls('top')}
        {renderFadeControls('bottom')}
      </div>
    </div>
  );
};