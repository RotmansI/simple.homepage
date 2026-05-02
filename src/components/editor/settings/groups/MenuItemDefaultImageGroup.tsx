"use client";

import React, { useState, useEffect } from 'react';
import { Image as ImageIcon, RefreshCcw, Plus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

export function MenuItemDefaultImageGroup({ settings, onUpdate, selectAssetForField, selectedId }: any) {
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  const isRTL = lang === 'he';

  // State מקומי לסנכרון מהיר של ה-UI
  const [localUrl, setLocalUrl] = useState(settings?.defaultItemImage);

  useEffect(() => {
    setLocalUrl(settings?.defaultItemImage);
  }, [settings?.defaultItemImage]);

  // פונקציית עזר לשליפה בטוחה של תרגומים
  const getT = (key: string, fallback: string): string => {
    return t?.editor?.groups?.menuItemImage?.[key as keyof typeof t.editor.groups.menuItemImage] || fallback;
  };

  const handleSelectImage = () => {
    if (selectAssetForField) {
      selectAssetForField(
        selectedId, 
        'defaultItemImage', 
        localUrl, 
        (url: string) => {
          setLocalUrl(url);
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
    <div className="space-y-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className={`flex items-center gap-2 mb-2 ${isRTL ? 'text-right' : 'text-left'}`}>
        <ImageIcon size={14} className="text-brand-main" />
        <span className="text-[10px] font-black uppercase text-brand-midnight tracking-widest">
          {getT('title', 'Item Default Image')}
        </span>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-4">
        <p className={`text-[10px] font-bold text-brand-charcoal/40 italic leading-relaxed ${isRTL ? 'text-right' : 'text-left'}`}>
          {getT('description', 'This image will be displayed for any menu item that doesn\'t have its own image.')}
        </p>

        <div 
          onClick={handleSelectImage}
          className="aspect-video bg-brand-pearl rounded-xl border-2 border-dashed border-brand-lavender/50 overflow-hidden relative group shadow-inner cursor-pointer hover:border-brand-main/30 transition-all"
        >
          {localUrl ? (
            <div className="relative w-full h-full">
              <img 
                src={localUrl} 
                className="w-full h-full object-cover" 
                alt={getT('previewAlt', 'Default Preview')} 
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
                <span className="text-[10px] font-black uppercase tracking-tighter block text-brand-midnight/60">
                  {getT('selectMedia', 'Select Media')}
                </span>
                <span className="text-[8px] font-medium text-brand-midnight/30 block uppercase tracking-widest">
                  {getT('browse', 'Click to browse assets')}
                </span>
              </div>
            </div>
          )}
        </div>

        {localUrl && (
          <button 
            onClick={handleReset}
            className="w-full py-2 text-[10px] font-black text-red-400 hover:text-red-500 flex items-center justify-center gap-2 transition-colors border border-transparent hover:border-red-100 rounded-lg"
          >
            <RefreshCcw size={12} className={isRTL ? 'scale-x-[-1]' : ''} />
            {getT('reset', 'Reset to Default Icon')}
          </button>
        )}
      </div>
    </div>
  );
}