"use client";

import React from 'react';
import { Square, CornerUpLeft, Maximize } from 'lucide-react';
import { SmartColorPicker } from '../controls/SmartColorPicker';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

interface FrameGroupProps {
  site: any;
  content: any;
  updateContent: (updates: any) => void;
  allSectionsContent?: any;
  prefix?: string; 
}

export const FrameGroup = ({ 
  site,
  content, 
  updateContent, 
  allSectionsContent,
  prefix = "" 
}: FrameGroupProps) => {
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  const isRTL = lang === 'he';

  const getVal = (key: string) => content[`${prefix}${key}`];
  const setVal = (key: string, val: any) => updateContent({ [`${prefix}${key}`]: val });

  const isTextElement = content.type === 'heading' || content.type === 'paragraph';

  // פונקציית עזר לשליפת מחרוזות בטוחה
  const getT = (path: string, fallback: string): string => {
    const keys = path.split('.');
    let current: any = t?.editor?.groups?.frame;
    for (const key of keys) {
      if (current?.[key] === undefined) return fallback;
      current = current[key];
    }
    return typeof current === 'string' ? current : fallback;
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* כותרת הקבוצה */}
      <div className={`flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Maximize size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">
          {isTextElement ? getT('titles.text', 'Text Stroke') : getT('titles.frame', 'Frame & Borders')}
        </span>
      </div>

      <div className="space-y-4">
        {/* Corner Radius */}
        {!isTextElement && (
          <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-4">
            <div className={`flex items-center gap-2 opacity-40 ${isRTL ? 'mr-1' : 'ml-1'}`}>
              <CornerUpLeft size={12} className={isRTL ? 'scale-x-[-1]' : ''} />
              <span className="text-[9px] font-bold uppercase">{getT('borderRadius', 'Corner Radius')}</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <div className="flex gap-1">
                  {[0, 8, 16, 99].map(r => (
                    <button 
                      key={r}
                      onClick={() => setVal('border_radius', r)}
                      className={`text-[8px] font-black px-2 py-1 rounded border transition-all ${getVal('border_radius') === r ? 'bg-brand-indigo text-white border-brand-indigo' : 'bg-brand-pearl text-brand-midnight/40 border-transparent hover:border-brand-lavender'}`}
                    >
                      {r === 99 ? getT('radiusFull', 'FULL') : `${r}px`}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] font-mono font-bold text-brand-indigo bg-brand-indigo/5 px-2 py-0.5 rounded-md">
                  {getVal('border_radius') ?? 0}px
                </span>
              </div>
              <input 
                type="range" min="0" max="100" step="1"
                value={getVal('border_radius') ?? 0}
                onChange={(e) => setVal('border_radius', parseInt(e.target.value) || 0)}
                className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
              />
            </div>
          </div>
        )}

        {/* Border/Stroke Settings */}
        <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-5">
          <div className={`flex items-center justify-between ${isRTL ? 'mr-1' : 'ml-1'}`}>
            <div className="flex items-center gap-2 opacity-40">
              <Square size={12} />
              <span className="text-[9px] font-bold uppercase">
                {isTextElement ? getT('styles.text', 'Stroke Style') : getT('styles.frame', 'Border Style')}
              </span>
            </div>
            
            {!isTextElement ? (
              <select 
                className="text-[9px] font-black uppercase bg-brand-pearl px-2 py-1 rounded-lg outline-none border-none text-brand-indigo cursor-pointer"
                value={getVal('border_style') || 'solid'}
                onChange={(e) => setVal('border_style', e.target.value)}
              >
                <option value="solid">{getT('styles.solid', 'Solid')}</option>
                <option value="dashed">{getT('styles.dashed', 'Dashed')}</option>
                <option value="dotted">{getT('styles.dotted', 'Dotted')}</option>
              </select>
            ) : (
                <span className="text-[8px] font-black uppercase opacity-30">{getT('styles.solid', 'Solid')}</span>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-bold opacity-40 uppercase">{getT('width', 'Width')}</span>
              <span className="text-[10px] font-mono font-bold text-brand-indigo">
                {getVal('border_width') ?? 0}px
              </span>
            </div>
            <input 
              type="range" min="0" max="15" step="0.5"
              value={getVal('border_width') ?? 0}
              onChange={(e) => setVal('border_width', parseFloat(e.target.value) || 0)}
              className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
            />
          </div>

          {(getVal('border_width') ?? 0) > 0 && (
            <div className="pt-4 border-t border-brand-lavender/30 animate-in fade-in duration-300">
              <SmartColorPicker 
                label={isTextElement ? getT('color.text', 'Stroke Color') : getT('color.frame', 'Border Color')}
                value={getVal('border_color') || '#000000'}
                onChange={(color) => setVal('border_color', color)}
                site={site}
                allSectionsContent={allSectionsContent}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};