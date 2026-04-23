"use client";

import React from 'react';
import { Image as ImageIcon, Layers, Palette, X } from 'lucide-react';
import { SmartColorPicker } from '../controls/SmartColorPicker';

// הוספת site ל-Props
interface SectionBackgroundGroupProps {
  content: any;
  updateContent: (updates: any) => void;
  allSectionsContent?: any;
  site?: any; 
  onOpenAssetManager: (callback: (url: string) => void) => void;
}

export const SectionBackgroundGroup = ({ 
  content, 
  updateContent, 
  allSectionsContent,
  site,
  onOpenAssetManager 
}: SectionBackgroundGroupProps) => {
  
  const hasBgImage = !!content.bg_image;

  // חילוץ צבעי ברנד בדיוק לפי הלוגיקה שעובדת ב-FrameGroup
  const themeSettings = site?.draft_data?.theme_settings || site?.theme_settings;
  const brandingColors = themeSettings ? [
    themeSettings.primary_color,
    themeSettings.secondary_color,
    themeSettings.accent_color,
    themeSettings.neutral_color,
    '#000000',
    '#ffffff'
  ].filter(Boolean) : undefined;

  // פונקציית עזר לטיפול בבחירת תמונה
const handleImageSelect = () => {
  onOpenAssetManager((url: string) => {
    updateContent({ 
      bg_image: url,
      is_transparent: false // חשוב: ברגע שיש תמונה, הסקשן כבר לא שקוף
    });
  });
};

  return (
    <div className="space-y-6">
      {/* כותרת הקבוצה */}
      <div className="flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6">
        <Palette size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">Background & Overlay</span>
      </div>

      <div className="space-y-4">
        {/* אזור תמונת רקע */}
        <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 ml-1">
               <ImageIcon size={10} className="opacity-40" />
               <span className="text-[9px] font-bold opacity-40 uppercase">Background Image</span>
            </div>
            {hasBgImage && (
              <button 
                type="button"
                onClick={() => updateContent({ bg_image: null })}
                className="text-[8px] font-black text-brand-coral uppercase flex items-center gap-1 hover:opacity-70 transition-all"
              >
                <X size={10} /> Remove
              </button>
            )}
          </div>

          {!hasBgImage ? (
            <button 
              type="button"
              onClick={handleImageSelect}
              className="w-full aspect-video rounded-xl border-2 border-dashed border-brand-lavender bg-brand-pearl/30 flex flex-col items-center justify-center gap-2 hover:bg-brand-pearl hover:border-brand-indigo/30 transition-all group"
            >
              <div className="p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
                <ImageIcon size={18} className="text-brand-indigo opacity-60" />
              </div>
              <span className="text-[10px] font-bold opacity-40 uppercase tracking-tight">Upload or Choose Image</span>
            </button>
          ) : (
            <div 
              className="relative aspect-video rounded-xl overflow-hidden border border-brand-lavender group shadow-inner cursor-pointer"
              onClick={handleImageSelect}
            >
              <img src={content.bg_image} className="w-full h-full object-cover" alt="Background" />
              <div className="absolute inset-0 flex items-center justify-center bg-brand-midnight/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                <span className="text-white text-[10px] font-black uppercase tracking-widest border border-white/30 px-3 py-1.5 rounded-lg">Change Image</span>
              </div>
            </div>
          )}
        </div>

        {/* אזור צבע / שכבת על (Overlay) */}
        <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-5">
          <div className="flex items-center gap-2 opacity-40 ml-1">
            <Layers size={12} />
            <span className="text-[9px] font-bold uppercase">
              {hasBgImage ? 'Overlay Settings' : 'Background Solid Color'}
            </span>
          </div>

<SmartColorPicker 
  label="Select Color"
  value={content.slider_overlay_color || content.bg_color || '#ffffff'}
  onChange={(color) => updateContent({ 
    slider_overlay_color: color, 
    bg_color: color,
    is_transparent: false // חשוב: ברגע שנבחר צבע, הסקשן כבר לא שקוף
  })}
  site={site}
  allSectionsContent={allSectionsContent}
/>

          <div className="space-y-3 pt-2 border-t border-brand-lavender/30">
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-bold opacity-40 uppercase">Opacity</span>
              <span className="text-[10px] font-mono font-bold text-brand-indigo bg-brand-indigo/5 px-2 py-0.5 rounded-md">
                {content.slider_overlay_opacity ?? content.bg_opacity ?? 0}%
              </span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={content.slider_overlay_opacity ?? content.bg_opacity ?? 0}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                updateContent({ slider_overlay_opacity: val, bg_opacity: val });
              }}
              className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
            />
            {hasBgImage && (
              <p className="text-[8px] opacity-40 italic px-1 leading-relaxed">
                Note: This color acts as an overlay on top of your selected image.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};