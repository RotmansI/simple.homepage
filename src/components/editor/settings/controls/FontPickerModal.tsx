"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom'; // קריטי לפתרון הבעיה
import { X, Search, Check, Loader2, Languages, Globe } from 'lucide-react';
import { fetchGoogleFonts } from '@/services/googleFonts';

export const FontPickerModal = ({ isOpen, onClose, onSelect, selectedFont }: any) => {
  const [mounted, setMounted] = useState(false);
  const [fonts, setFonts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('hebrew'); 
  const [displayCount, setDisplayCount] = useState(30);

  // הגנה: Portal חייב לעבוד רק בצד הלקוח
  useEffect(() => {
    setMounted(true);
    if (isOpen) {
        document.body.style.overflow = 'hidden';
        loadFonts();
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const loadFonts = async () => {
    setLoading(true);
    const data = await fetchGoogleFonts();
    setFonts(data);
    setLoading(false);
  };

  const filteredFonts = useMemo(() => {
    return fonts.filter(f => {
      const matchesSearch = f.family.toLowerCase().includes(search.toLowerCase());
      const supportsHebrew = f.subsets.includes('hebrew');
      if (activeTab === 'hebrew') return matchesSearch && supportsHebrew;
      return matchesSearch;
    });
  }, [fonts, search, activeTab]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    // z-index 1000 כאן ינצח את ה-z-40 של ה-aside כי הוא מרונדר ב-body
    <div className="fixed inset-0 z-[1000] bg-brand-dark/40 backdrop-blur-sm flex items-start justify-center pt-[80px] pb-10 px-4 md:px-8 overflow-hidden animate-in fade-in duration-300">
      
      <div className="bg-[#FDFDFD] w-full max-w-7xl h-full max-h-[calc(100vh-140px)] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/40 animate-in zoom-in-95 duration-300">
        
        {/* Header - בול כמו במניו מודאל */}
        <div className="p-6 bg-white border-b border-brand-lavender/30 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-black text-brand-dark tracking-tighter flex items-center gap-2">
              <Languages className="text-brand-main" size={24} />
              Typography Library
            </h2>
            <p className="text-[11px] font-bold text-brand-charcoal/30 uppercase tracking-widest">Global Assets Management</p>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex gap-2 bg-brand-grey p-1 rounded-xl mr-4 text-start">
                <button 
                  onClick={() => setActiveTab('hebrew')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'hebrew' ? 'bg-brand-dark text-white shadow-md' : 'text-brand-charcoal/40 hover:text-brand-charcoal'}`}
                >
                  <Languages size={14} /> Hebrew
                </button>
                <button 
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all ${activeTab === 'all' ? 'bg-brand-dark text-white shadow-md' : 'text-brand-charcoal/40 hover:text-brand-charcoal'}`}
                >
                  <Globe size={14} /> All Fonts
                </button>
             </div>
             <button onClick={onClose} className="p-2.5 bg-brand-grey hover:bg-red-50 hover:text-red-500 rounded-full transition-all">
               <X size={20} />
             </button>
          </div>
        </div>

        {/* Toolbar - Search */}
        <div className="p-6 bg-[#F8F9FB] border-b border-brand-lavender/20 text-start">
          <div className="relative max-w-2xl mx-auto group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-brand-charcoal/30 group-focus-within:text-brand-main transition-colors" size={20} />
            <input 
              className="w-full bg-white border border-brand-lavender/30 shadow-sm focus:border-brand-main/30 rounded-2xl py-4 pl-14 pr-6 text-base font-bold outline-none transition-all"
              placeholder="Search for a font name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setDisplayCount(30); }}
            />
          </div>
        </div>

        {/* Main Content Area - Grid Layout */}
        <div className="flex-1 overflow-y-auto bg-[#F8F9FB] p-10 custom-scrollbar">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center opacity-40">
              <Loader2 className="animate-spin mb-4 text-brand-main" size={48} />
              <span className="text-sm font-black uppercase tracking-widest">Fetching Library...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
              {filteredFonts.slice(0, displayCount).map((font) => (
                <button
                  key={font.family}
                  onClick={() => onSelect(font.family)}
                  className={`group p-8 bg-white rounded-[2rem] border-2 transition-all text-start relative flex flex-col justify-between h-48 shadow-sm ${
                    selectedFont === font.family 
                    ? 'border-brand-main ring-4 ring-brand-main/5 scale-[1.02]' 
                    : 'border-transparent hover:border-brand-lavender hover:shadow-md'
                  }`}
                >
                   <link href={`https://fonts.googleapis.com/css2?family=${font.family.replace(/\s+/g, '+')}&display=swap`} rel="stylesheet" />
                   
                   <div className="flex flex-col gap-2">
                     <div className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-brand-charcoal/20 uppercase tracking-widest">
                          {font.category}
                        </span>
                        {font.subsets.includes('hebrew') && (
                           <span className="px-2 py-0.5 bg-brand-main/5 text-brand-main text-[8px] font-black rounded-md uppercase">Hebrew</span>
                        )}
                     </div>
                     <span className="text-3xl lg:text-4xl truncate py-2 leading-tight" style={{ fontFamily: font.family }}>
                       {font.subsets.includes('hebrew') ? 'אבגד (Preview)' : font.family}
                     </span>
                   </div>

                   <div className="flex items-center justify-between mt-4">
                      <span className="text-xs font-bold text-brand-charcoal/30 italic">{font.family}</span>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${selectedFont === font.family ? 'bg-brand-main text-white' : 'bg-brand-grey text-brand-charcoal/10 group-hover:bg-brand-main group-hover:text-white'}`}>
                        <Check size={20} />
                      </div>
                   </div>
                </button>
              ))}
            </div>
          )}

          {!loading && displayCount < filteredFonts.length && (
            <div className="py-12 flex justify-center">
              <button 
                onClick={() => setDisplayCount(prev => prev + 30)}
                className="px-12 py-4 bg-brand-dark text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-brand-main transition-all shadow-xl active:scale-95"
              >
                Load More Typography
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};