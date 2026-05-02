"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SettingsCollapseProps {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const SettingsCollapse = ({ label, icon, children, defaultOpen = false }: SettingsCollapseProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { lang } = useLanguage();
  const isRTL = lang === 'he';

  // חישוב דינמי של הצללית (הקו הכחול בצד) לפי כיוון השפה
  const getHeaderStyle = () => {
    if (!isOpen) return {};
    
    // ב-RTL הקו הכחול צריך להיות בימין, ב-LTR בשמאל
    return {
      boxShadow: isRTL 
        ? 'inset 2px 0 0 0 rgba(238,241,252,0.6), inset -2px 0 0 0 rgba(79, 70, 229, 1)' 
        : 'inset -2px 0 0 0 rgba(238,241,252,0.6), inset 2px 0 0 0 rgba(79, 70, 229, 1)'
    };
  };

  const getContentStyle = () => {
    return {
      boxShadow: isRTL
        ? 'inset -2px 0 0 0 rgba(79, 70, 229, 1), inset 2px 0 0 0 rgba(238,241,252,0.6)'
        : 'inset 2px 0 0 0 rgba(79, 70, 229, 1), inset -2px 0 0 0 rgba(238,241,252,0.6)'
    };
  };

  return (
    <div 
      className={`transition-all duration-300 border-b border-brand-lavender/30 ${isOpen ? 'bg-brand-pearl/20' : ''}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* כפתור הכותרת */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between py-4 px-3 transition-colors group relative ${isOpen ? 'bg-brand-pearl/40' : 'hover:bg-brand-pearl/60'}`}
        style={getHeaderStyle()}
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

      {/* הקונטיינר של התוכן */}
      {isOpen && (
        <div 
          className="pb-6 relative animate-in fade-in slide-in-from-top-1 duration-300 bg-white/50"
          style={getContentStyle()}
        >
          <div className="px-3 pt-4">
            {children}
          </div>
        </div>
      )}
    </div>
  );
};