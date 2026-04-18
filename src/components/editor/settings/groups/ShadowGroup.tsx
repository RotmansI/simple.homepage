"use client";

import React from 'react';
import { Layers, Box, Sun } from 'lucide-react';
import { SmartColorPicker } from '../controls/SmartColorPicker';

interface ShadowGroupProps {
  content: any;
  updateContent: (updates: any) => void;
  allSectionsContent?: any;
  site?: any; // הוספת site ל-Interface
  prefix?: string;
}

export const ShadowGroup = ({ 
  content, 
  updateContent, 
  allSectionsContent,
  site, // חילוץ ה-site
  prefix = "" 
}: ShadowGroupProps) => {
  
  const getVal = (key: string) => content[`${prefix}${key}`];
  const setVal = (key: string, val: any) => updateContent({ [`${prefix}${key}`]: val });

  const shadowIntensity = getVal('shadow_intensity') ?? 0;

  // חילוץ צבעי המיתוג מה-site
  const themeColors = site?.theme_settings ? [
    site.theme_settings.primary_color,
    site.theme_settings.secondary_color,
    site.theme_settings.accent_color,
    site.theme_settings.neutral_color,
    '#000000',
    '#ffffff'
  ].filter(Boolean) : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6">
        <Box size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">Elevation & Shadows</span>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2 opacity-40">
              <Sun size={12} />
              <span className="text-[9px] font-bold uppercase">Shadow Intensity</span>
            </div>
            <span className="text-[10px] font-black text-brand-indigo uppercase italic">
              {['None', 'Subtle', 'Medium', 'Strong'][shadowIntensity]}
            </span>
          </div>

          <div className="px-2">
            <input 
              type="range" min="0" max="3" step="1"
              value={shadowIntensity}
              onChange={(e) => setVal('shadow_intensity', parseInt(e.target.value))}
              className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
            />
          </div>
        </div>

        {shadowIntensity > 0 && (
          <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm animate-in fade-in slide-in-from-top-2 duration-300 space-y-4">
             <div className="flex items-center gap-2 opacity-40 ml-1">
              <Layers size={12} />
              <span className="text-[9px] font-bold uppercase">Shadow Color</span>
            </div>
            
            <SmartColorPicker 
              label="Select Shadow Tint"
              value={getVal('shadow_color') || 'rgba(0,0,0,0.1)'}
              onChange={(color) => setVal('shadow_color', color)}
              brandingColors={themeColors} // <--- העברה של צבעי המותג לקולור פיקר
              allSectionsContent={allSectionsContent}
            />
          </div>
        )}
      </div>
    </div>
  );
};