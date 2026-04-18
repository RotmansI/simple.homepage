"use client";

import React from 'react';
import { MousePointer2, Eye, Palette, Type } from 'lucide-react';
import { SmartColorPicker } from '../controls/SmartColorPicker';

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
  
  const getVal = (key: string) => content[`${prefix}${key}`];
  const setVal = (key: string, val: any) => updateContent({ [`${prefix}${key}`]: val });

  // --- תיקון חילוץ הצבעים לפי הלוגיקה של FrameGroup ---
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
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6">
        <MousePointer2 size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">Button Styling</span>
      </div>

      {/* 1. Smart Outline Toggle */}
      <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${isOutline ? 'bg-brand-indigo/10 text-brand-indigo' : 'bg-brand-pearl text-brand-midnight/20'}`}>
              <Eye size={12} />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-tight text-brand-midnight">Outline Style</span>
              <span className="text-[8px] opacity-40 font-bold uppercase">40% Alpha Glass effect</span>
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
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isOutline ? 'left-6' : 'left-1'}`} />
          </button>
        </div>
      </div>

      {/* 2. Color Selection */}
      <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2 opacity-40 ml-1">
            <Palette size={12} />
            <span className="text-[9px] font-bold uppercase">
              {isOutline ? 'Theme Color' : 'Background Color'}
            </span>
          </div>
          <SmartColorPicker 
            label={isOutline ? "Theme Color" : "Background"}
            value={getVal('bg_color') || (themeColors ? themeColors[0] : '#6366f1')}
            onChange={handleThemeColorChange}
            brandingColors={themeColors}
            allSectionsContent={allSectionsContent}
          />
        </div>

        {!isOutline && (
          <div className="space-y-4 pt-4 border-t border-brand-lavender/30">
            <div className="flex items-center gap-2 opacity-40 ml-1">
              <Type size={12} />
              <span className="text-[9px] font-bold uppercase">Text Color</span>
            </div>
            <SmartColorPicker 
              label="Text Color"
              value={getVal('text_color') || '#ffffff'}
              onChange={(color) => setVal('text_color', color)}
              brandingColors={themeColors}
              allSectionsContent={allSectionsContent}
            />
          </div>
        )}
      </div>
    </div>
  );
};