"use client";

import React, { useState } from 'react';
import { 
  X, Box, Layout, Minus, ImageIcon, UtensilsCrossed, ChevronRight, 
  ChevronDown, Sparkles, MousePointer2, Layers, Phone, 
  MessageSquare, Play, Columns, Plus, Zap
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

interface SectionType {
  id: string;
  icon: React.ReactNode;
  previewColor: string;
  category: 'basics' | 'content' | 'advanced' | 'dividers' | 'split-views';
}

interface SectionTranslation {
  label: string;
  desc: string;
  features: string[];
}

const SECTIONS: SectionType[] = [
  { id: 'flex', icon: <Box size={18} />, category: 'basics', previewColor: 'bg-brand-indigo' },
  { id: 'hero', icon: <Layout size={18} />, category: 'basics', previewColor: 'bg-brand-main' },
  { id: 'contact', icon: <Phone size={18} />, category: 'basics', previewColor: 'bg-emerald-500' },
  { id: 'form', icon: <MousePointer2 size={18} />, category: 'basics', previewColor: 'bg-orange-500' },
  { id: 'gallery', icon: <ImageIcon size={18} />, category: 'content', previewColor: 'bg-brand-accent' },
  { id: 'menu', icon: <UtensilsCrossed size={18} />, category: 'content', previewColor: 'bg-brand-charcoal' },
  { id: 'table', icon: <Layers size={18} />, category: 'content', previewColor: 'bg-slate-600' },
  { id: 'review', icon: <MessageSquare size={18} />, category: 'content', previewColor: 'bg-yellow-500' },
  { id: 'video', icon: <Play size={18} />, category: 'content', previewColor: 'bg-red-600' },
  { id: 'divider-line', icon: <Minus size={18} />, category: 'dividers', previewColor: 'bg-brand-lavender' },
  { id: 'divider-spacer', icon: <Box size={18} />, category: 'dividers', previewColor: 'bg-brand-grey' },
  { id: 'split-50', icon: <Columns size={18} />, category: 'split-views', previewColor: 'bg-indigo-400' },
  { id: 'split-card', icon: <Layout size={18} />, category: 'split-views', previewColor: 'bg-purple-400' },
];

export default function AddSectionModal({ isOpen, onClose, onAddSection }: any) {
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  
  const [selectedId, setSelectedId] = useState<string | null>('flex');
  const [openCategories, setOpenCategories] = useState<string[]>(['basics']);

  const activeSection = SECTIONS.find(s => s.id === selectedId) || SECTIONS[0];
  
  // כאן קורה הקסם: שליפת כל הטקסטים (כולל features) לפי ה-ID והשפה
const sectionText = t.editor.modals.addSection.sections[
  activeSection.id as keyof typeof t.editor.modals.addSection.sections
] as SectionTranslation; //
  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const categories = [
    { id: 'basics', icon: <Zap size={14} /> },
    { id: 'content', icon: <Layers size={14} /> },
    { id: 'dividers', icon: <Minus size={14} /> },
    { id: 'split-views', icon: <Columns size={14} /> },
  ];

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[300] flex items-center justify-center bg-brand-midnight/40 backdrop-blur-md animate-in fade-in duration-300" 
      onClick={onClose}
      dir={lang === 'he' ? 'rtl' : 'ltr'}
    >
      <div 
        className={`bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl h-[700px] flex overflow-hidden border border-brand-mint/30 ${lang === 'he' ? 'text-right' : 'text-left'}`} 
        onClick={e => e.stopPropagation()}
      >
        
        {/* Sidebar */}
        <div className="w-80 border-e border-brand-lavender/40 bg-brand-pearl/10 flex flex-col overflow-hidden">
          <div className="p-8 pb-4">
            <h3 className="font-black uppercase tracking-tighter text-xl text-brand-midnight">
              {t.editor.modals.addSection.title}
            </h3>
            <p className="text-[9px] text-brand-slate font-bold uppercase tracking-widest mt-1 opacity-50 italic">
              {t.editor.modals.addSection.subtitle}
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-12 custom-scrollbar space-y-6">
            <div className="space-y-2">
              <span className="text-[8px] font-black uppercase text-brand-main/60 ms-2 tracking-widest">
                {t.editor.modals.addSection.recommended}
              </span>
              <div className="grid grid-cols-1 gap-1">
                {['hero', 'flex', 'gallery'].map(id => {
                  const s = SECTIONS.find(item => item.id === id);
                  if (!s) return null;
                  const st = t.editor.modals.addSection.sections[id as keyof typeof t.editor.modals.addSection.sections];
                  return (
                    <button 
                      key={id} 
                      onClick={() => setSelectedId(id)} 
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${selectedId === id ? 'bg-brand-main text-white shadow-md scale-[1.02]' : 'hover:bg-white text-brand-charcoal'}`}
                    >
                      {s.icon} <span className="text-[11px] font-black uppercase tracking-tight">{st.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-brand-lavender/50 mx-2" />

            <div className="space-y-4">
               <span className="text-[8px] font-black uppercase text-brand-charcoal/30 ms-2 tracking-[0.2em]">
                 {t.editor.modals.addSection.exploreAll}
               </span>
               {categories.map(cat => (
                 <div key={cat.id} className="space-y-1">
                    <button 
                      onClick={() => toggleCategory(cat.id)}
                      className="w-full flex items-center justify-between p-2 hover:bg-brand-pearl/50 rounded-lg transition-all"
                    >
                      <div className="flex items-center gap-2 text-brand-charcoal/60">
                        {cat.icon}
                        <span className="text-[10px] font-black uppercase tracking-widest">
                          {t.editor.modals.addSection.categories[cat.id as keyof typeof t.editor.modals.addSection.categories]}
                        </span>
                      </div>
                      {openCategories.includes(cat.id) ? <ChevronDown size={14} className="opacity-30" /> : <ChevronRight size={14} className={`opacity-30 ${lang === 'he' ? 'rotate-180' : ''}`} />}
                    </button>

                    {openCategories.includes(cat.id) && (
                      <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                        {SECTIONS.filter(s => s.category === cat.id).map(s => {
                          const st = t.editor.modals.addSection.sections[s.id as keyof typeof t.editor.modals.addSection.sections];
                          return (
                            <button
                              key={s.id}
                              onClick={() => setSelectedId(s.id)}
                              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${selectedId === s.id ? 'bg-brand-main/10 text-brand-main border border-brand-main/20' : 'text-brand-charcoal/60 hover:text-brand-charcoal'}`}
                            >
                              <span className="text-[11px] font-bold">{st.label}</span>
                              {selectedId === s.id && <div className="w-1.5 h-1.5 rounded-full bg-brand-main" />}
                            </button>
                          );
                        })}
                      </div>
                    )}
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col bg-white relative">
          <button 
            onClick={onClose} 
            className={`absolute top-8 ${lang === 'he' ? 'left-8' : 'right-8'} p-2 hover:bg-brand-grey rounded-full transition-all z-10 hover:rotate-90`}
          >
            <X size={20} className="text-brand-charcoal" />
          </button>

          <div className="flex-1 p-16 overflow-y-auto custom-scrollbar">
            <div className={`w-full aspect-video ${activeSection.previewColor} rounded-[3rem] shadow-2xl mb-12 flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-700`}>
               <div className="absolute inset-0 bg-brand-midnight/10 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="scale-[2.5] opacity-10 rotate-12">{activeSection.icon}</div>
               <div className="absolute bottom-12 left-12 right-12 space-y-3">
                  <div className="h-4 bg-white/20 rounded-full w-2/3 animate-pulse" />
                  <div className="h-4 bg-white/20 rounded-full w-1/2 animate-pulse" />
               </div>
            </div>

            <div className="max-w-2xl">
              <span className="px-3 py-1 bg-brand-main/10 text-brand-main text-[9px] font-black uppercase tracking-widest rounded-full">
                {t.editor.modals.addSection.categories[activeSection.category as keyof typeof t.editor.modals.addSection.categories]}
              </span>
              <h2 className="text-5xl font-black text-brand-midnight tracking-tighter mt-4">
                {sectionText.label}
              </h2>
              <p className="text-brand-slate text-lg font-medium mt-6 leading-relaxed opacity-70">
                {sectionText.desc}
              </p>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-brand-charcoal/40 tracking-widest flex items-center gap-2">
                    <Sparkles size={14}/> {t.editor.modals.addSection.featuresTitle}
                  </span>
                  <ul className="space-y-2">
                    {/* כאן המערך נמשך מהתרגום */}
                    {sectionText.features.map((f: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-[12px] font-bold text-brand-charcoal">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-mint" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 bg-brand-grey/50 rounded-[2rem] border border-brand-mint/20">
                   <span className="text-[10px] font-black uppercase text-brand-main tracking-widest block mb-2 underline decoration-2">
                     {t.editor.modals.addSection.proTip}
                   </span>
                   <p className="text-[11px] font-bold text-brand-charcoal/60 leading-relaxed italic">
                     "{activeSection.category === 'basics' ? t.editor.modals.addSection.proTipText.top : t.editor.modals.addSection.proTipText.middle}"
                   </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-10 border-t border-brand-lavender/30 bg-brand-pearl/5 flex items-center justify-between px-16">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-brand-midnight uppercase tracking-tight">
                 {t.editor.modals.addSection.readyTitle}
               </p>
               <p className="text-[9px] font-bold text-brand-charcoal/40 italic">
                 {t.editor.modals.addSection.readySubtitle}
               </p>
            </div>
            <button 
              onClick={() => { onAddSection(activeSection.id); onClose(); }}
              className="px-12 py-5 bg-brand-main text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(11,68,64,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
            >
              {t.editor.modals.addSection.addBtn} 
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}