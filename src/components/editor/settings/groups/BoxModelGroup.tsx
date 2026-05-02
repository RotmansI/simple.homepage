"use client";

import React, { useState } from 'react';
import { Move, Link as LinkIcon, Link2Off, AlignCenter } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

interface BoxModelGroupProps {
  content: any;
  updateContent: (updates: any) => void;
  prefix?: string;
}

export const BoxModelGroup = ({ content, updateContent, prefix = "" }: BoxModelGroupProps) => {
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  
  const [isPaddingLocked, setIsPaddingLocked] = useState(true);
  const [isMarginLocked, setIsMarginLocked] = useState(false);

  const getVal = (type: 'padding' | 'margin', side: string) => {
    return content[`${prefix}${type}_${side}`] ?? 0;
  };

  const updateVal = (type: 'padding' | 'margin', side: string, value: number) => {
    const isLocked = type === 'padding' ? isPaddingLocked : isMarginLocked;

    if (isLocked) {
      updateContent({
        [`${prefix}${type}_top`]: value,
        [`${prefix}${type}_bottom`]: value,
        [`${prefix}${type}_left`]: value,
        [`${prefix}${type}_right`]: value,
      });
    } else {
      updateContent({ [`${prefix}${type}_${side}`]: value });
    }
  };

  const renderInputs = (type: 'padding' | 'margin') => {
    const isLocked = type === 'padding' ? isPaddingLocked : isMarginLocked;
    const toggleLock = () => type === 'padding' ? setIsPaddingLocked(!isPaddingLocked) : setIsMarginLocked(!isMarginLocked);

    return (
      <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2 opacity-40">
            {type === 'padding' ? <AlignCenter size={12} /> : <Move size={12} />}
            <span className="text-[9px] font-bold uppercase">
              {type === 'padding' ? t.editor.groups.boxModel.padding : t.editor.groups.boxModel.margin} (px)
            </span>
          </div>
          <button 
            type="button"
            onClick={toggleLock}
            className={`p-1 rounded-md transition-colors ${isLocked ? 'bg-brand-indigo/10 text-brand-indigo' : 'bg-brand-pearl text-brand-midnight/40'}`}
          >
            {isLocked ? <LinkIcon size={12} /> : <Link2Off size={12} />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {['top', 'bottom', 'left', 'right'].map((side) => (
            <div key={side} className={`space-y-1 ${isLocked && side !== 'top' ? 'opacity-40 pointer-events-none' : ''}`}>
              <span className={`text-[7px] font-black uppercase opacity-40 ${lang === 'he' ? 'mr-1' : 'ml-1'}`}>
                {isLocked ? t.editor.groups.boxModel.sides.all : t.editor.groups.boxModel.sides[side as keyof typeof t.editor.groups.boxModel.sides]}
              </span>
              <input 
                type="number"
                value={getVal(type, side)}
                onChange={(e) => updateVal(type, side, parseInt(e.target.value) || 0)}
                className="w-full bg-brand-pearl/50 border border-transparent focus:border-brand-indigo/30 rounded-lg px-3 py-1.5 text-[11px] font-bold outline-none transition-all shadow-inner"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <div className={`flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6 ${lang === 'he' ? 'text-right' : 'text-left'}`}>
        <Move size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">
          {t.editor.groups.boxModel.title}
        </span>
      </div>

      <div className="space-y-4">
        {renderInputs('padding')}
        {renderInputs('margin')}
      </div>
    </div>
  );
};