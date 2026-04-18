"use client";

import React from 'react';
import { Info, Layout } from 'lucide-react';

interface SectionBasicGroupProps {
  content: {
    name?: string;
    description?: string;
  };
  updateContent: (updates: any) => void;
}

export const SectionBasicGroup = ({ content, updateContent }: SectionBasicGroupProps) => {
  return (
    <div className="space-y-4">
      {/* כותרת הקבוצה */}
      <div className="flex items-center gap-2 px-1">
        <Layout size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">Section Identity</span>
      </div>

      {/* קופסת ההגדרות */}
      <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-4">
        
        {/* שם פנימי */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between px-1">
            <span className="text-[9px] font-bold opacity-40 uppercase">Internal Name</span>
          </div>
          <input 
            type="text"
            className="w-full bg-brand-pearl/50 border border-transparent focus:border-brand-indigo/30 rounded-xl px-4 py-2.5 text-[12px] font-bold outline-none transition-all shadow-inner placeholder:opacity-30"
            placeholder="e.g., Summer Promotion Hero"
            value={content.name || ''}
            onChange={(e) => updateContent({ name: e.target.value })}
          />
          <p className="text-[8px] opacity-40 italic px-1">
            Visible in structure sidebar and breadcrumbs
          </p>
        </div>

        {/* תיאור פנימי */}
        <div className="space-y-1.5 pt-2 border-t border-brand-lavender/30">
          <div className="flex items-center gap-1.5 px-1">
            <Info size={10} className="opacity-40" />
            <span className="text-[9px] font-bold opacity-40 uppercase">Internal Description</span>
          </div>
          <textarea 
            className="w-full bg-brand-pearl/50 border border-transparent focus:border-brand-indigo/30 rounded-xl px-4 py-3 text-[11px] font-medium outline-none transition-all shadow-inner min-h-[80px] resize-none placeholder:opacity-30"
            placeholder="What is this section about? (Internal note only for team orientation)"
            value={content.description || ''}
            onChange={(e) => updateContent({ description: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};