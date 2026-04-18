"use client";

import React from 'react';
import { Maximize2 } from 'lucide-react';

// עדכון ה-Interface שיכלול את site כדי למנוע את השגיאה ב-FlexSettings
interface DimensionsGroupProps {
  content: any;
  updateContent: (updates: any) => void;
  site?: any; 
}

export const DimensionsGroup = ({ content, updateContent, site }: DimensionsGroupProps) => {
  return (
    <div className="space-y-6">
      {/* כותרת הקבוצה */}
      <div className="flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6">
        <Maximize2 size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">Section Dimensions</span>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-4">
        <div className="flex justify-between items-center px-1">
          <div className="flex flex-col">
             <span className="text-[9px] font-bold opacity-40 uppercase">Section Height</span>
             <span className="text-[8px] opacity-30 italic">Set the maximum height in pixels</span>
          </div>
          <span className="text-[10px] font-mono font-bold text-brand-indigo bg-brand-indigo/5 px-2 py-0.5 rounded-md">
            {content.max_height || 600}px
          </span>
        </div>
        
        <input 
          type="range" 
          min="200" 
          max="1200" 
          step="10"
          value={content.max_height || 600}
          onChange={(e) => updateContent({ max_height: parseInt(e.target.value) })}
          className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
        />
        
        <div className="flex justify-between px-1 text-[8px] font-bold opacity-20 uppercase">
          <span>Min (200px)</span>
          <span>Max (1200px)</span>
        </div>
      </div>
    </div>
  );
};