"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SettingsCollapseProps {
  id: string; // ה-ID הכרחי כדי לזכור את המצב במהלך הסשן
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export const SettingsCollapse = ({ 
  id, 
  label, 
  icon, 
  children, 
  defaultOpen = false 
}: SettingsCollapseProps) => {
  const { lang } = useLanguage();
  const isRTL = lang === 'he';

  // 🎯 מנגנון הזיכרון: בדיקה ב-sessionStorage בעת הטעינה הראשונית
  const [isOpen, setIsOpen] = useState(() => {
    // בשרת (SSR) תמיד נחזיר את ברירת המחדל
    if (typeof window === 'undefined') return defaultOpen;
    
    const savedState = sessionStorage.getItem(`collapse-${id}`);
    // אם יש ערך שמור, נשתמש בו. אם לא, נשתמש ב-defaultOpen (שעכשיו הוא תמיד false)
    return savedState !== null ? JSON.parse(savedState) : defaultOpen;
  });

  // עדכון הזיכרון בכל פעם שהמשתמש משנה את המצב
  const toggleOpen = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    sessionStorage.setItem(`collapse-${id}`, JSON.stringify(newState));
  };

  const getHeaderStyle = () => {
    if (!isOpen) return {};
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
      <button
        onClick={toggleOpen}
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