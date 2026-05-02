"use client";

import React, { useState } from 'react';
import { Type, Edit3 } from 'lucide-react';
import { FontPickerModal } from './FontPickerModal';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

export const GoogleFontPicker = ({ label, value, onChange }: any) => {
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-2 text-start" dir={lang === 'he' ? 'rtl' : 'ltr'}>
        <span className="text-[9px] font-black uppercase text-brand-midnight opacity-40 tracking-wider px-1">
          {label}
        </span>
        
        <button
          onClick={() => setModalOpen(true)}
          className="w-full bg-white border border-brand-lavender rounded-2xl p-4 flex items-center justify-between hover:border-brand-main transition-all shadow-sm group"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-brand-pearl rounded-xl flex items-center justify-center text-brand-main shadow-inner">
               <Type size={20} />
            </div>
            <div className="text-start">
              <p className="text-xs font-black text-brand-dark" style={{ fontFamily: value }}>{value || t.editor.modals.fontPicker.defaultFont}</p>
              <p className="text-[8px] font-bold text-brand-charcoal/40 uppercase tracking-tight">{t.editor.modals.fontPicker.triggerSubtitle}</p>
            </div>
          </div>
          <Edit3 size={14} className="text-brand-charcoal/20 group-hover:text-brand-main transition-colors" />
        </button>
      </div>

      <FontPickerModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        selectedFont={value}
        onSelect={(font: string) => {
          onChange(font);
          setModalOpen(false);
        }}
      />
    </>
  );
};