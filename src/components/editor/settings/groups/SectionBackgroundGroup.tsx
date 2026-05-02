"use client";

import React from 'react';
import { Image as ImageIcon, Layers, Palette, X } from 'lucide-react';
import { SmartColorPicker } from '../controls/SmartColorPicker';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

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
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  const isRTL = lang === 'he';
  
  const hasBgImage = !!content.bg_image;

  // פונקציית עזר לשליפה בטוחה של תרגומים
  const getT = (path: string, fallback: string): string => {
    const keys = path.split('.');
    let current: any = t?.editor?.groups?.sectionBackground;
    for (const key of keys) {
      if (current?.[key] === undefined) return fallback;
      current = current[key];
    }
    return typeof current === 'string' ? current : fallback;
  };

  const handleImageSelect = () => {
    onOpenAssetManager((url: string) => {
      updateContent({ 
        bg_image: url,
        is_transparent: false 
      });
    });
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* כותרת הקבוצה */}
      <div className={`flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Palette size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">
          {getT('title', 'Background & Overlay')}
        </span>
      </div>

      <div className="space-y-4">
        {/* אזור תמונת רקע */}
        <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-3">
          <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="flex items-center gap-1.5">
               <ImageIcon size={10} className="opacity-40" />
               <span className={`text-[9px] font-bold opacity-40 uppercase ${isRTL ? 'mr-1' : 'ml-1'}`}>
                 {getT('image.label', 'Background Image')}
               </span>
            </div>
            {hasBgImage && (
              <button 
                type="button"
                onClick={() => updateContent({ bg_image: null })}
                className="text-[8px] font-black text-brand-coral uppercase flex items-center gap-1 hover:opacity-70 transition-all"
              >
                <X size={10} /> {getT('image.remove', 'Remove')}
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
              <span className="text-[10px] font-bold opacity-40 uppercase tracking-tight">
                {getT('image.upload', 'Upload or Choose Image')}
              </span>
            </button>
          ) : (
            <div 
              className="relative aspect-video rounded-xl overflow-hidden border border-brand-lavender group shadow-inner cursor-pointer"
              onClick={handleImageSelect}
            >
              <img src={content.bg_image} className="w-full h-full object-cover" alt={getT('image.alt', 'Background')} />
              <div className="absolute inset-0 flex items-center justify-center bg-brand-midnight/60 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                <span className="text-white text-[10px] font-black uppercase tracking-widest border border-white/30 px-3 py-1.5 rounded-lg">
                  {getT('image.change', 'Change Image')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* אזור צבע / שכבת על (Overlay) */}
        <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-5">
          <div className={`flex items-center gap-2 opacity-40 ${isRTL ? 'mr-1' : 'ml-1'}`}>
            <Layers size={12} />
            <span className="text-[9px] font-bold uppercase">
              {hasBgImage ? getT('overlay.titleOverlay', 'Overlay Settings') : getT('overlay.titleSolid', 'Background Solid Color')}
            </span>
          </div>

          <SmartColorPicker 
            label={getT('overlay.colorLabel', 'Select Color')}
            value={content.slider_overlay_color || content.bg_color || '#ffffff'}
            onChange={(color) => updateContent({ 
              slider_overlay_color: color, 
              bg_color: color,
              is_transparent: false 
            })}
            site={site}
            allSectionsContent={allSectionsContent}
          />

          <div className="space-y-3 pt-2 border-t border-brand-lavender/30">
            <div className={`flex justify-between items-center px-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <span className="text-[9px] font-bold opacity-40 uppercase">
                {getT('overlay.opacity', 'Opacity')}
              </span>
              <span className="text-[10px] font-mono font-bold text-brand-indigo bg-brand-indigo/5 px-2 py-0.5 rounded-md">
                {content.slider_overlay_opacity ?? content.bg_opacity ?? 0}%
              </span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={content.slider_overlay_opacity ?? content.bg_opacity ?? 0}
              onChange={(e) => {
                const val = parseInt(e.target.value) || 0;
                updateContent({ slider_overlay_opacity: val, bg_opacity: val });
              }}
              className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
            />
            {hasBgImage && (
              <p className={`text-[8px] opacity-40 italic px-1 leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
                {getT('overlay.note', 'Note: This color acts as an overlay on top of your selected image.')}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};