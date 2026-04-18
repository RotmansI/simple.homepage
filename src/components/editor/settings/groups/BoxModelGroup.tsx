"use client";

import React, { useState } from 'react';
import { Move, Link as LinkIcon, Link2Off, AlignCenter } from 'lucide-react';

interface BoxModelGroupProps {
  content: any;
  updateContent: (updates: any) => void;
  prefix?: string;
}

export const BoxModelGroup = ({ content, updateContent, prefix = "" }: BoxModelGroupProps) => {
  // הפרדה מוחלטת בין מצבי הנעילה
  const [isPaddingLocked, setIsPaddingLocked] = useState(true);
  const [isMarginLocked, setIsMarginLocked] = useState(false);

  const getVal = (type: 'padding' | 'margin', side: string) => {
    return content[`${prefix}${type}_${side}`] ?? 0;
  };

  const updateVal = (type: 'padding' | 'margin', side: string, value: number) => {
    const isLocked = type === 'padding' ? isPaddingLocked : isMarginLocked;

    if (isLocked) {
      // עדכון כל 4 הכיוונים בבת אחת לסוג הספציפי (padding או margin)
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
            <span className="text-[9px] font-bold uppercase">{type} (px)</span>
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
              <span className="text-[7px] font-black uppercase opacity-40 ml-1">
                {isLocked ? 'All Sides' : side}
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
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6">
        <Move size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">Spacing & Layout</span>
      </div>

      <div className="space-y-4">
        {renderInputs('padding')}
        {renderInputs('margin')}
      </div>
    </div>
  );
};