"use client";

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, RefreshCcw, Plus } from 'lucide-react';

export function MenuItemDefaultImageGroup({ settings, onUpdate, selectAssetForField, selectedId }: any) {
  // State מקומי כדי להבטיח שהתמונה תשתנה ב-UI באותה מילישנייה שנבחרה
  const [localUrl, setLocalUrl] = useState(settings?.defaultItemImage);

  // סנכרון אם ה-Props משתנים מבחוץ (למשל בטעינת דף)
  useEffect(() => {
    setLocalUrl(settings?.defaultItemImage);
  }, [settings?.defaultItemImage]);

  const handleSelectImage = () => {
    if (selectAssetForField) {
      selectAssetForField(
        selectedId, 
        'defaultItemImage', 
        localUrl, 
        (url: string) => {
          // 1. עדכון מקומי מיידי (פותר את בעיית התצוגה שלא מתעדכנת)
          setLocalUrl(url);
          // 2. עדכון גלובלי ל-State ול-Database
          onUpdate({ defaultItemImage: url });
        }
      );
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLocalUrl(null);
    onUpdate({ defaultItemImage: null });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <ImageIcon size={14} className="text-brand-main" />
        <span className="text-[10px] font-black uppercase text-brand-midnight tracking-widest">
          Item Default Image
        </span>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-4 text-start">
        <p className="text-[10px] font-bold text-brand-charcoal/40 italic leading-relaxed">
          תמונה זו תוצג עבור כל פריט בתפריט שאין לו כתובת URL מוגדרת משלו.
        </p>

        <div 
          onClick={handleSelectImage}
          className="aspect-video bg-brand-pearl rounded-xl border-2 border-dashed border-brand-lavender/50 overflow-hidden relative group shadow-inner cursor-pointer hover:border-brand-main/30 transition-all"
        >
          {/* שימוש ב-localUrl במקום ב-settings */}
          {localUrl ? (
            <div className="relative w-full h-full">
              <img 
                src={localUrl} 
                className="w-full h-full object-cover" 
                alt="Default Preview" 
              />
              <div className="absolute inset-0 bg-brand-midnight/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                <div className="bg-white/90 p-2 rounded-full text-brand-midnight shadow-xl">
                  <Plus size={16}/>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3 group-hover:scale-105 transition-transform duration-500">
              <div className="w-10 h-10 rounded-full bg-brand-lavender/20 flex items-center justify-center text-brand-main/40 group-hover:bg-brand-main/10 group-hover:text-brand-main transition-colors">
                <ImageIcon size={20} />
              </div>
              <div className="text-center space-y-1">
                <span className="text-[10px] font-black uppercase tracking-tighter block text-brand-midnight/60">Select Media</span>
                <span className="text-[8px] font-medium text-brand-midnight/30 block uppercase tracking-widest">Click to browse assets</span>
              </div>
            </div>
          )}
        </div>

        {localUrl && (
          <button 
            onClick={handleReset}
            className="w-full py-2 text-[10px] font-black text-red-400 hover:text-red-500 flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-red-100 rounded-lg"
          >
            <RefreshCcw size={12} />
            Reset to Default Icon
          </button>
        )}
      </div>
    </div>
  );
}