"use client";

import React from 'react';
import { HardDrive, Menu, Wrench, ChevronLeft, Lightbulb, ChevronRight, LayoutGrid, Settings2, ListTree } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';
interface ToolsPanelProps {
  openAssetManager: () => void;
  openMenuManager: () => void;
}

export const ToolsPanel = ({ openAssetManager, openMenuManager }: ToolsPanelProps) => {
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  return (
    <div className="p-6 space-y-8 text-start animate-in fade-in duration-500" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      
      {/* Header הקדמה */}
      <div className="space-y-1">
        <h3 className="text-[11px] font-black uppercase text-brand-main tracking-[0.2em]">{t.editor.structure.toolsPanel.header.label}</h3>
        <p className="text-xl font-black text-brand-dark tracking-tighter">{t.editor.structure.toolsPanel.header.title}</p>
      </div>

      <div className="space-y-4" dir='ltr'>
        {/* כרטיס ניהול נכסים - Asset Manager */}
        <button 
          onClick={openAssetManager}
          className="w-full group relative overflow-hidden bg-white border border-brand-lavender/30 p-5 rounded-[2rem] flex items-center gap-4 hover:border-brand-main hover:shadow-xl hover:shadow-brand-main/10 transition-all text-start"
        >
          <div className="w-12 h-12 bg-brand-main/10 rounded-2xl flex items-center justify-center text-brand-main group-hover:scale-110 transition-transform">
            <HardDrive size={22} />
          </div>
          <div className="flex-1" dir={lang === 'he' ? 'rtl' : 'ltr'}>
            <h4 className="text-sm font-black text-brand-dark uppercase tracking-tight">{t.editor.structure.toolsPanel.assetManager.title}</h4>
            <p className="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-widest mt-0.5">{t.editor.structure.toolsPanel.assetManager.subtitle}</p>
          </div>
          <ChevronRight size={16} className="text-brand-charcoal/20 group-hover:text-brand-main group-hover:translate-x-[-4px] transition-all" />
          
          {/* אפקט דקורטיבי ברקע */}
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-brand-main pointer-events-none group-hover:opacity-[0.08] transition-opacity">
            <LayoutGrid size={80} />
          </div>
        </button>

        {/* כרטיס ניהול תפריט - Menu Manager */}
        <button 
          onClick={openMenuManager}
          className="w-full group relative overflow-hidden bg-white border border-brand-lavender/30 p-5 rounded-[2rem] flex items-center gap-4 hover:border-brand-main hover:shadow-xl hover:shadow-brand-main/10 transition-all text-start"
        >
          <div className="w-12 h-12 bg-brand-main/10 rounded-2xl flex items-center justify-center text-brand-main group-hover:scale-110 transition-transform">
            <ListTree size={22} />
          </div>
          <div className="flex-1" dir={lang === 'he' ? 'rtl' : 'ltr'}>
            <h4 className="text-sm font-black text-brand-dark uppercase tracking-tight">{t.editor.structure.toolsPanel.menuManager.title}</h4>
            <p className="text-[10px] font-bold text-brand-charcoal/40 uppercase tracking-widest mt-0.5">{t.editor.structure.toolsPanel.menuManager.subtitle}</p>
          </div>
          <ChevronRight size={16} className="text-brand-charcoal/20 group-hover:text-brand-main group-hover:translate-x-[-4px] transition-all" />

          {/* אפקט דקורטיבי ברקע */}
          <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-brand-main pointer-events-none group-hover:opacity-[0.08] transition-opacity">
            <Settings2 size={80} />
          </div>
        </button>
      </div>

      {/* אזור הערות/טיפ מהיר בתחתית */}
      <div className="mt-12 p-6 bg-brand-grey/50 rounded-[2.5rem] border border-brand-lavender/10">
        <div className="flex items-center gap-3 mb-2 text-brand-main">
            <Lightbulb size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">{t.editor.structure.toolsPanel.tip.label}</span>
        </div>
        <p className="text-[11px] font-bold text-brand-charcoal/50 leading-relaxed">
          {t.editor.structure.toolsPanel.tip.text}
        </p>
      </div>

    </div>
  );
};