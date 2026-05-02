"use client";

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

export function SidebarTab({ active, onClick, icon, label }: any) {
  const { lang } = useLanguage();
  return (
    <button 
      onClick={onClick} 
      dir={lang === 'he' ? 'rtl' : 'ltr'}
      className={`flex-1 py-3 flex flex-col items-center gap-1 transition-all rounded-xl ${
        active ? 'bg-white shadow-sm text-brand-main border-b-2 border-brand-main' : 'text-brand-charcoal/30 hover:text-brand-main'
      }`}
    >
      {icon} 
      <span className="text-[8px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
}

export function WidgetButton({ icon, label, onClick }: any) {
  const { lang } = useLanguage();
  return (
    <button 
      onClick={onClick} 
      dir={lang === 'he' ? 'rtl' : 'ltr'}
      className="flex flex-col items-center justify-center p-6 bg-brand-grey/50 rounded-[2rem] border-2 border-transparent hover:border-brand-main hover:bg-white transition-all group shadow-sm"
    >
      <div className="text-brand-charcoal/40 group-hover:text-brand-main transition-all mb-3">{icon}</div>
      <span className="text-[11px] font-black text-brand-charcoal uppercase tracking-tighter">{label}</span>
    </button>
  );
}

export function PropertyInput({ label, value, onChange, isTextarea, placeholder }: any) {
  const { lang } = useLanguage();
  const t = translations[lang as Language];

  // לוגיקת Placeholder דינמית מתורגמת
  const defaultPlaceholder = isTextarea 
    ? t.editor.sidebar.ui.inputs.setPlaceholder.replace('{label}', label?.toLowerCase())
    : t.editor.sidebar.ui.inputs.typePlaceholder.replace('{label}', label?.toLowerCase());

  return (
    <div className={`space-y-2 ${lang === 'he' ? 'text-right' : 'text-left'}`} dir={lang === 'he' ? 'rtl' : 'ltr'}>
      <span className="text-[10px] font-black uppercase text-brand-charcoal/40 tracking-widest">{label}</span>
      {isTextarea ? (
        <textarea 
          className="w-full bg-brand-grey p-3 rounded-xl border border-brand-mint outline-none focus:border-brand-main text-[12px] font-medium resize-none shadow-inner" 
          rows={4} 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder={placeholder || defaultPlaceholder}
        />
      ) : (
        <input 
          className="w-full bg-brand-grey p-3 rounded-xl border border-brand-mint outline-none focus:border-brand-main text-[12px] font-medium shadow-inner" 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder={placeholder || defaultPlaceholder}
        />
      )}
    </div>
  );
}