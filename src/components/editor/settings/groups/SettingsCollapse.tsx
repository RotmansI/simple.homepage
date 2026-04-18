"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface SettingsCollapseProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const SettingsCollapse = ({ label, icon, children, defaultOpen = false }: SettingsCollapseProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`transition-all duration-300 border-b border-brand-lavender/30 ${isOpen ? 'bg-brand-pearl/20' : ''}`}>
      {/* כפתור הכותרת של האקורדיון */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between py-4 px-3 transition-colors group relative ${isOpen ? 'bg-brand-pearl/40' : 'hover:bg-brand-pearl/60'}`}
        style={isOpen ? { boxShadow: 'inset -2px 0 0 0 rgba(238,241,252,0.6), inset 2px 0 0 0 rgba(79, 70, 229, 1)' } : {}}
      >
        <div className="flex items-center gap-2">
          <div className={`transition-colors duration-300 ${isOpen ? 'text-brand-indigo' : 'text-brand-midnight/40 group-hover:text-brand-midnight'}`}>
            {icon}
          </div>
          <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${isOpen ? 'text-brand-indigo' : 'text-brand-midnight/40 group-hover:text-brand-midnight'}`}>
            {label}
          </span>
        </div>
        <ChevronDown 
          size={14} 
          className={`transition-transform duration-500 ${isOpen ? 'rotate-180 text-brand-indigo' : 'text-brand-midnight/20'}`} 
        />
      </button>

      {/* הקונטיינר של ה-Group */}
      {isOpen && (
        <div 
          className="pb-6 relative animate-in fade-in slide-in-from-top-1 duration-300 bg-white/50"
          style={{ boxShadow: 'inset -2px 0 0 0 rgba(79, 70, 229, 1), inset 2px 0 0 0 rgba(238,241,252,0.6)' }}
        >
          {/* ה-children - הגרופ עצמו עם פאדינג פנימי */}
          <div className="px-3 pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};