"use client";

import React, { useState } from 'react';
import { 
  X, Box, Layout, Minus, ImageIcon, UtensilsCrossed, ChevronRight, 
  ChevronDown, Sparkles, MousePointer2, Layers, Info, Phone, 
  MessageSquare, Play, Columns, Plus, Zap
} from 'lucide-react';

interface SectionType {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  previewColor: string;
  // עדכון כאן: הוספת כל הקטגוריות החדשות לרשימה המותרת
  category: 'basics' | 'content' | 'advanced' | 'dividers' | 'split-views';
  features: string[];
}

const SECTIONS: SectionType[] = [
  // Basics
  { id: 'flex', label: 'Custom Canvas', icon: <Box size={18} />, category: 'basics', description: 'Free-form drag and drop canvas', previewColor: 'bg-brand-indigo', features: ['Control section dimensions', 'Design the backgorund', 'Add multi-elements', 'Call to action'] },
  { id: 'hero', label: 'Hero Slider', icon: <Layout size={18} />, category: 'basics', description: 'High impression at first sight', previewColor: 'bg-brand-main', features: ['Create impressive image sliders', 'Add your logo or other images on top', 'Add titles, text and buttons', 'Show more, Speak less'] },
  { id: 'contact', label: 'Contact Us', icon: <Phone size={18} />, category: 'basics', description: 'Creates your contact page', previewColor: 'bg-emerald-500', features: ['Fully designed - Fully informative', 'All contact methods', 'Location widget', 'Socials Icons', 'Contact form'] },
  { id: 'form', label: 'Lead Form', icon: <MousePointer2 size={18} />, category: 'basics', description: 'Customized form', previewColor: 'bg-orange-500', features: ['Any Purpose', 'Customize fields', 'Choose what happens next'] },
  
  // Content
  { id: 'gallery', label: 'Image Gallery', icon: <ImageIcon size={18} />, category: 'content', description: 'Responsive image grid', previewColor: 'bg-brand-accent', features: ['Lightbox', 'Grid/Slider'] },
  { id: 'menu', label: 'Digital Menu', icon: <UtensilsCrossed size={18} />, category: 'content', description: 'Live food & drinks menu', previewColor: 'bg-brand-charcoal', features: ['Menu Manager sync'] },
  { id: 'table', label: 'Data Table', icon: <Layers size={18} />, category: 'content', description: 'Structured pricing or info table', previewColor: 'bg-slate-600', features: ['Rows/Cols', 'Styling options'] },
  { id: 'review', label: 'Reviews', icon: <MessageSquare size={18} />, category: 'content', description: 'Easy share real reviews', previewColor: 'bg-yellow-500', features: ['Star ratings', 'Avatars', 'Real-time reviews', 'Shuffle mode'] },
  { id: 'video', label: 'Video Player', icon: <Play size={18} />, category: 'content', description: 'Content Maximizes', previewColor: 'bg-red-600', features: ['Autoplay', 'Custom cover'] },

  // Dividers
  { id: 'divider-line', label: 'Line Divider', icon: <Minus size={18} />, category: 'dividers', description: 'Simple thin line separator', previewColor: 'bg-brand-lavender', features: ['Adjustable weight'] },
  { id: 'divider-spacer', label: 'Empty Spacer', icon: <Box size={18} />, category: 'dividers', description: 'Blank vertical space', previewColor: 'bg-brand-grey', features: ['Height control'] },

  // Split Views
  { id: 'split-50', label: '50/50 Split', icon: <Columns size={18} />, category: 'split-views', description: 'Image and text side by side', previewColor: 'bg-indigo-400', features: ['Reversible', 'Balanced'] },
  { id: 'split-card', label: 'Card Split', icon: <Layout size={18} />, category: 'split-views', description: 'Content card over background', previewColor: 'bg-purple-400', features: ['Floating effect'] },
];

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (type: string) => void;
}

export default function AddSectionModal({ isOpen, onClose, onAddSection }: any) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const activeSection = SECTIONS.find(s => s.id === selectedId) || SECTIONS[0];

  const toggleCategory = (cat: string) => {
    setOpenCategories(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const categories = [
    { id: 'basics', label: 'Basics', icon: <Zap size={14} /> },
    { id: 'content', label: 'Content', icon: <Layers size={14} /> },
    { id: 'dividers', label: 'Dividers', icon: <Minus size={14} /> },
    { id: 'split-views', label: 'Split Views', icon: <Columns size={14} /> },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-brand-midnight/40 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose}>
      <div 
        className="bg-white rounded-[3rem] shadow-2xl w-full max-w-5xl h-[700px] flex overflow-hidden border border-brand-mint/30" 
        onClick={e => e.stopPropagation()}
      >
        
        {/* Sidebar: Categories & Selection */}
        <div className="w-80 border-e border-brand-lavender/40 bg-brand-pearl/10 flex flex-col overflow-hidden">
          <div className="p-8 pb-4">
            <h3 className="font-black uppercase tracking-tighter text-xl text-brand-midnight">Add Section</h3>
            <p className="text-[9px] text-brand-slate font-bold uppercase tracking-widest mt-1 opacity-50 italic">Craft your story</p>
          </div>

          <div className="flex-1 overflow-y-auto px-4 pb-12 custom-scrollbar space-y-6">
            
            {/* Top Picks / Quick Add */}
            <div className="space-y-2">
              <span className="text-[8px] font-black uppercase text-brand-main/60 ml-2 tracking-widest">Recommended</span>
              <div className="grid grid-cols-1 gap-1">
                {['hero', 'flex', 'gallery'].map(id => {
                  const s = SECTIONS.find(item => item.id === id);
                  if (!s) return null;
                  return (
                    <button key={id} onClick={() => setSelectedId(id)} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${selectedId === id ? 'bg-brand-main text-white shadow-md scale-[1.02]' : 'hover:bg-white text-brand-charcoal'}`}>
                      {s.icon} <span className="text-[11px] font-black uppercase tracking-tight">{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="h-px bg-brand-lavender/50 mx-2" />

            {/* Explore Categories (Accordions) */}
            <div className="space-y-4">
               <span className="text-[8px] font-black uppercase text-brand-charcoal/30 ml-2 tracking-[0.2em]">Explore All</span>
               {categories.map(cat => (
                 <div key={cat.id} className="space-y-1">
                    <button 
                      onClick={() => toggleCategory(cat.id)}
                      className="w-full flex items-center justify-between p-2 hover:bg-brand-pearl/50 rounded-lg transition-all"
                    >
                      <div className="flex items-center gap-2 text-brand-charcoal/60">
                        {cat.icon}
                        <span className="text-[10px] font-black uppercase tracking-widest">{cat.label}</span>
                      </div>
                      {openCategories.includes(cat.id) ? <ChevronDown size={14} className="opacity-30" /> : <ChevronRight size={14} className="opacity-30" />}
                    </button>

                    {openCategories.includes(cat.id) && (
                      <div className="space-y-1 animate-in slide-in-from-top-2 duration-300">
                        {SECTIONS.filter(s => s.category === cat.id).map(s => (
                          <button
                            key={s.id}
                            onClick={() => setSelectedId(s.id)}
                            className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all ${selectedId === s.id ? 'bg-brand-main/10 text-brand-main border border-brand-main/20' : 'text-brand-charcoal/60 hover:text-brand-charcoal'}`}
                          >
                            <span className="text-[11px] font-bold">{s.label}</span>
                            {selectedId === s.id && <div className="w-1.5 h-1.5 rounded-full bg-brand-main" />}
                          </button>
                        ))}
                      </div>
                    )}
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Main Content Area: Large Preview */}
        <div className="flex-1 flex flex-col bg-white relative">
          <button onClick={onClose} className="absolute top-8 right-8 p-2 hover:bg-brand-grey rounded-full transition-all z-10 hover:rotate-90">
            <X size={20} className="text-brand-charcoal" />
          </button>

          <div className="flex-1 p-16 overflow-y-auto custom-scrollbar">
            {/* Visual Preview Window */}
            <div className={`w-full aspect-video ${activeSection.previewColor} rounded-[3rem] shadow-2xl mb-12 flex flex-col items-center justify-center relative overflow-hidden group transition-all duration-700`}>
               <div className="absolute inset-0 bg-brand-midnight/10 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="scale-[2.5] opacity-10 rotate-12">{activeSection.icon}</div>
               <div className="absolute bottom-12 left-12 right-12 space-y-3">
                  <div className="h-4 bg-white/20 rounded-full w-2/3 animate-pulse" />
                  <div className="h-4 bg-white/20 rounded-full w-1/2 animate-pulse" />
               </div>
            </div>

            <div className="max-w-2xl">
              <span className="px-3 py-1 bg-brand-main/10 text-brand-main text-[9px] font-black uppercase tracking-widest rounded-full">{activeSection.category}</span>
              <h2 className="text-5xl font-black text-brand-midnight tracking-tighter mt-4">{activeSection.label}</h2>
              <p className="text-brand-slate text-lg font-medium mt-6 leading-relaxed opacity-70">
                {activeSection.description}
              </p>

              <div className="mt-12 grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <span className="text-[10px] font-black uppercase text-brand-charcoal/40 tracking-widest flex items-center gap-2"><Sparkles size={14}/> Top Features</span>
                  <ul className="space-y-2">
                    {activeSection.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-[12px] font-bold text-brand-charcoal">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-mint" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 bg-brand-grey/50 rounded-[2rem] border border-brand-mint/20">
                   <span className="text-[10px] font-black uppercase text-brand-main tracking-widest block mb-2 underline decoration-2">Pro Tip</span>
                   <p className="text-[11px] font-bold text-brand-charcoal/60 leading-relaxed italic">
                     "This section works best when placed {activeSection.category === 'basics' ? 'at the top of your page' : 'after a clean divider'} to maintain visual flow."
                   </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action Bar */}
          <div className="p-10 border-t border-brand-lavender/30 bg-brand-pearl/5 flex items-center justify-between px-16">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-brand-midnight uppercase tracking-tight">Ready to add this section?</p>
               <p className="text-[9px] font-bold text-brand-charcoal/40 italic">You can customize all content and colors later.</p>
            </div>
            <button 
              onClick={() => { onAddSection(activeSection.id); onClose(); }}
              className="px-12 py-5 bg-brand-main text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-[0_20px_50px_rgba(11,68,64,0.3)] hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
            >
              Add to Page <Plus size={20} className="group-hover:rotate-90 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}