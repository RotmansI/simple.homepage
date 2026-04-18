"use client";

import React from 'react';
import { Images, Plus, X, GripVertical, Layers } from 'lucide-react';
import { SmartColorPicker } from '../controls/SmartColorPicker';

// הגדרת ה-Props בצורה מפורשת עם טיפוסים ל-TypeScript
interface HeroSliderGroupProps {
  content: any;
  updateContent: (updates: any) => void;
  allSectionsContent?: any;
  // כאן התיקון: אנחנו מגדירים בדיוק מה ה-onOpenAssetManager מצפה לקבל
  onOpenAssetManager: (callback: (url: string) => void) => void;
}

export const HeroSliderGroup = ({ 
  content, 
  updateContent, 
  allSectionsContent,
  onOpenAssetManager 
}: HeroSliderGroupProps) => {
  
  const sliderImages = content.slider_images || [];

  const addImage = () => {
    // עכשיו TypeScript יודע ש-url הוא string ושה-callback תקין
    onOpenAssetManager((url: string) => {
      const newImages = [...sliderImages, url];
      updateContent({ slider_images: newImages });
    });
  };

  const removeImage = (index: number) => {
    const newImages = sliderImages.filter((_: any, i: number) => i !== index);
    updateContent({ slider_images: newImages });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6">
        <Images size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">Hero Slider Management</span>
      </div>

      <div className="space-y-4">
        <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-4">
          <div className="flex items-center justify-between px-1">
            <span className="text-[9px] font-bold opacity-40 uppercase">Slides ({sliderImages.length}/5)</span>
            {sliderImages.length < 5 && (
              <button 
                type="button"
                onClick={addImage} // הפעלת הפונקציה החדשה
                className="flex items-center gap-1 text-[9px] font-bold text-brand-indigo hover:opacity-70 transition-all uppercase"
              >
                <Plus size={12} /> Add Slide
              </button>
            )}
          </div>

          <div className="space-y-2">
            {sliderImages.map((img: string, idx: number) => (
              <div 
                key={`${img}-${idx}`}
                className="flex items-center gap-3 p-2 bg-brand-pearl/30 rounded-xl border border-brand-lavender/50 group"
              >
                <div className="cursor-grab opacity-20 group-hover:opacity-40 transition-opacity">
                  <GripVertical size={14} />
                </div>
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-brand-lavender shadow-sm bg-white">
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold truncate opacity-60 italic">Slide {idx + 1}</p>
                </div>
                <button 
                  type="button"
                  onClick={() => removeImage(idx)}
                  className="p-1.5 text-brand-coral opacity-0 group-hover:opacity-100 transition-all hover:bg-brand-coral/10 rounded-md"
                >
                  <X size={14} />
                </button>
              </div>
            ))}

            {sliderImages.length === 0 && (
              <div className="text-center py-8 border-2 border-dashed border-brand-lavender rounded-xl bg-brand-pearl/20">
                <p className="text-[10px] font-bold opacity-30 uppercase tracking-tighter">No slides added yet</p>
                <button 
                  type="button"
                  onClick={addImage}
                  className="mt-2 text-[9px] font-black text-brand-indigo underline uppercase"
                >
                  Click to add first slide
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Slider Overlay Settings */}
        <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-5">
          <div className="flex items-center gap-2 opacity-40 ml-1">
            <Layers size={12} />
            <span className="text-[9px] font-bold uppercase">Slider Overlay</span>
          </div>

          <SmartColorPicker 
            label="Overlay Color"
            value={content.slider_overlay_color || '#000000'}
            onChange={(color) => updateContent({ slider_overlay_color: color })}
            allSectionsContent={allSectionsContent}
          />

          <div className="space-y-3 pt-2 border-t border-brand-lavender/30">
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-bold opacity-40 uppercase">Overlay Opacity</span>
              <span className="text-[10px] font-mono font-bold text-brand-indigo bg-brand-indigo/5 px-2 py-0.5 rounded-md">
                {content.slider_overlay_opacity ?? 40}%
              </span>
            </div>
            <input 
              type="range" 
              min="0" max="100" 
              value={content.slider_overlay_opacity ?? 40}
              onChange={(e) => updateContent({ slider_overlay_opacity: parseInt(e.target.value) })}
              className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};