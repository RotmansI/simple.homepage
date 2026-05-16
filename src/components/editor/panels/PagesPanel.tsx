"use client";

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';
import { 
  ChevronRight, Plus, Copy, ChevronUp, Trash2, ChevronDown, Check, PlusCircle,
  GripVertical, Type as TypeIcon, FileText, MousePointer, ImageIcon, Minus,
  Layout, Layers, Component, Search, ChevronDown as ChevronDownIcon, Info
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

// פונקציית עזר לאייקונים קטנים של אלמנטים בעץ
const getMiniElementIcon = (type: string) => {
  switch (type) {
    case 'heading':   return <TypeIcon size={10} />;
    case 'paragraph': return <FileText size={10} />;
    case 'button':    return <MousePointer size={10} />;
    case 'image':     return <ImageIcon size={10} />;
    case 'spacer':    return <Minus size={10} />;
    default:          return <Minus size={10} />;
  }
};

export const PagesPanel = ({
  pages, activePageKey, expandedPages, setExpandedPages, switchPage,
  setSelectedId, selectedId, unsavedChanges, duplicateSection, deleteSection,
  setShowAddModal, setSite, markChanged, selectedFlexElementId, setSelectedFlexElementId,
  addNewPage
}: any) => {

  const { lang } = useLanguage();
  const t = translations[lang as Language];

  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [customPageName, setCustomPageName] = useState('');

  const suggestedPagesList = ['Menu', 'Events', 'Branches', 'About', 'Contact', 'Gallery', 'Reviews', 'Team', 'FAQ'];

  // טיפול בגרירה וסידור מחדש של סקשנים
  const onSectionDragEnd = (result: DropResult, pKey: string) => {
    if (!result.destination) return;
    
    const items = Array.from(pages[pKey].sections || []);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setSite((prev: any) => ({
      ...prev,
      draft_data: {
        ...prev.draft_data,
        pages: {
          ...prev.draft_data.pages,
          [pKey]: { ...prev.draft_data.pages[pKey], sections: items }
        }
      }
    }));
    if (markChanged) markChanged('section', 'reorder');
  };

  const movePage = (pKey: string, direction: 'up' | 'down') => {
    const keys = Object.keys(pages);
    const idx = keys.indexOf(pKey);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === keys.length - 1)) return;
    
    const newKeys = [...keys];
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newKeys[idx], newKeys[targetIdx]] = [newKeys[targetIdx], newKeys[idx]];
    
    const newPages: any = {};
    newKeys.forEach(k => { newPages[k] = pages[k]; });
    
    setSite((prev: any) => ({
      ...prev,
      draft_data: { ...prev.draft_data, pages: newPages }
    }));
    if (markChanged) markChanged('page', 'reorder');
  };

  const handleAddCustomPage = () => {
    if (customPageName.trim()) {
      addNewPage(customPageName);
      setCustomPageName('');
    }
  };

  return (
    <div className="p-4 space-y-6 text-start" >
      
      {/* --- 1. PAGES SECTION --- */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 px-1">
          <Layout size={12} className="text-brand-main opacity-60" />
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-charcoal/40">{t.editor.structure.pagesPanel.pagesTitle}</span>
        </div>

        <div className="space-y-2">
          {Object.keys(pages).map((pKey) => (
            <div key={pKey} className="space-y-1">
              {/* Page Row */}
              <div 
                onClick={() => {
                  /* 🎯 שינוי: לחיצה על עמוד עוברת אליו ופותחת רק את האקורדיון שלו */
                  switchPage(pKey);
                  setExpandedPages([pKey]);
                }}
                className={`group p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${activePageKey === pKey ? 'border-brand-main bg-brand-mint/5 shadow-sm' : 'border-brand-mint/30 hover:border-brand-main bg-white'}`}
              >
                <div className="flex items-center gap-2 relative">
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      /* 🎯 שינוי: גם כפתור ה-Chevron סוגר עמודים אחרים אם נפתח חדש */
                      setExpandedPages((prev: string[]) => 
                        prev.includes(pKey) ? [] : [pKey]
                      ); 
                    }} 
                    className={`transition-transform ${expandedPages.includes(pKey) ? 'rotate-90' : ''}`}
                  >
                    <ChevronRight size={14} className="text-brand-charcoal/40" />
                  </button>
                  <div className="flex flex-col text-start">
                      <span className="text-[11px] font-black uppercase tracking-tight leading-none mb-1">{pages[pKey].name || pages[pKey].title}</span>
                      <span className="text-[8px] opacity-30 font-mono italic">/{pKey === 'home' ? '' : pKey}</span>
                  </div>
                  {unsavedChanges?.pages?.includes(pKey) && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-main rounded-full border-2 border-white" />}
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); movePage(pKey, 'up'); }} className="p-0.5 hover:text-brand-main"><ChevronUp size={10}/></button>
                    <button onClick={(e) => { e.stopPropagation(); movePage(pKey, 'down'); }} className="p-0.5 hover:text-brand-main"><ChevronDown size={10}/></button>
                </div>
              </div>

              {/* Expanded Page Content (Sections) */}
              {expandedPages.includes(pKey) && (
                <div className="ml-4 ps-3 py-2 border-s-2 border-brand-mint/20 space-y-3 text-start">
                  
                  {/* SECTIONS HEADER */}
                  <div className="flex items-center gap-2 px-1 opacity-40">
                    <Layers size={10} />
                    <span className="text-[8px] font-black uppercase tracking-widest">{t.editor.structure.pagesPanel.sectionsTitle}</span>
                  </div>

                  <DragDropContext onDragEnd={(res) => onSectionDragEnd(res, pKey)}>
                    <Droppable droppableId={`sections-${pKey}`}>
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-1">
                          {pages[pKey].sections?.map((s: any, idx: number) => {
                            const isSectionSelected = selectedId === s.id;
                            return (
                              <Draggable key={s.id} draggableId={s.id} index={idx}>
                                {(dragProv, snapshot) => (
                                  <div ref={dragProv.innerRef} {...dragProv.draggableProps} className="space-y-1">
                                    <div 
                                      onClick={() => { 
                                        switchPage(pKey); 
                                        setSelectedId(s.id); 
                                        if (typeof setSelectedFlexElementId === 'function') {
                                          setSelectedFlexElementId(null); 
                                        }
                                      }}
                                      className={`group p-2 rounded-lg border flex items-center justify-between transition-all cursor-pointer relative ${isSectionSelected ? 'bg-brand-main text-white border-brand-main shadow-md' : 'bg-white border-brand-mint/20 hover:border-brand-main shadow-sm'} ${snapshot.isDragging ? 'opacity-50' : ''}`}
                                    >
                                      <div className="flex items-center gap-2 overflow-hidden text-[9px] uppercase italic text-start">
                                        <div {...dragProv.dragHandleProps} className="opacity-30 hover:opacity-100 cursor-grab">
                                          <GripVertical size={12} />
                                        </div>
                                        <span className="opacity-40">{idx + 1}</span>
                                        <span className="font-bold truncate">{s.name || s.type} <span className={isSectionSelected ? 'text-white/60' : 'opacity-40'}>({s.type})</span></span>
                                      </div>
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button title="Duplicate" onClick={(e) => { e.stopPropagation(); duplicateSection(s.id); }} className="hover:text-brand-accent p-0.5"><Copy size={10}/></button>
                                        <button onClick={(e) => { e.stopPropagation(); deleteSection(s.id); }} className="hover:text-salmon p-0.5"><Trash2 size={10}/></button>
                                      </div>
                                    </div>

                                    {/* Full Element Tree */}
                                    {isSectionSelected && s.content?.elements && (
                                      <div className="ms-4 ps-3 border-s border-brand-main/20 space-y-2 py-2 animate-in fade-in slide-in-from-left-2 duration-200">
                                        
                                        {/* ELEMENTS HEADER */}
                                        <div className="flex items-center gap-2 px-1 opacity-30">
                                          <Component size={10} />
                                          <span className="text-[7px] font-black uppercase tracking-widest">{t.editor.structure.pagesPanel.elementsTitle}</span>
                                        </div>

                                        {s.content.elements.map((el: any) => {
                                          const isElSelected = selectedFlexElementId === el.id;
                                          return (
                                            <div 
                                              key={el.id}
                                              onClick={(e) => { e.stopPropagation(); setSelectedFlexElementId(el.id); }}
                                              className={`p-1.5 rounded-md flex items-center gap-2 text-[8px] font-medium transition-all cursor-pointer border ${isElSelected ? 'bg-brand-indigo text-white border-brand-indigo shadow-sm' : 'bg-brand-grey/30 border-transparent hover:bg-brand-mint/10'}`}
                                            >
                                              {getMiniElementIcon(el.type)}
                                              <span className="truncate uppercase tracking-tighter text-start">
                                                {el.text ? `"${el.text.substring(0, 15)}..."` : el.type}
                                              </span>
                                            </div>
                                          )
                                        })}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Draggable>
                            );
                          })}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation();
                      if (activePageKey !== pKey) {
                        switchPage(pKey);
                      }
                      setShowAddModal(true); 
                    }} 
                    className="w-full py-2 mt-2 border-2 border-dashed border-brand-mint/40 rounded-lg text-[9px] font-black text-brand-charcoal/40 hover:border-brand-main hover:text-brand-main transition-all flex items-center justify-center gap-2 group"
                  >
                    <Plus size={12} className="group-hover:rotate-90 transition-transform duration-300" /> 
                    <span>{t.editor.structure.pagesPanel.addSection}</span>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* --- 2. SUGGESTED PAGES (Styled Select) --- */}
      <div className="pt-4 border-t border-brand-mint/30 space-y-3" dir={lang === 'he' ? 'rtl' : 'ltr'}>
        <span className="text-[9px] font-black text-brand-charcoal/80 uppercase tracking-widest block px-1">{t.editor.structure.pagesPanel.suggestedPages}</span>
        
        <div className="relative">
          <button 
            onClick={() => setIsSelectOpen(!isSelectOpen)}
            className="w-full p-3 bg-white border border-brand-mint/30 rounded-xl flex items-center justify-between shadow-sm hover:border-brand-main transition-all"
          >
            <div className="flex items-center gap-2">
              <Search size={14} className="opacity-20" />
              <span className="text-[10px] font-bold text-brand-charcoal uppercase">{t.editor.structure.pagesPanel.quickAddPlaceholder}</span>
            </div>
            <ChevronDownIcon size={14} className={`opacity-40 transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} />
          </button>

          {isSelectOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-brand-mint/30 rounded-xl shadow-xl z-50 overflow-hidden max-h-60 overflow-y-auto animate-in fade-in slide-in-from-top-2">
              {suggestedPagesList.map(suggested => {
                const exists = Object.values(pages).some((ap: any) => (ap.name || ap.title)?.toLowerCase() === suggested.toLowerCase());
                return (
                  <button 
                    key={suggested} 
                    disabled={exists} 
                    onClick={() => { addNewPage(suggested); setIsSelectOpen(false); }}
                    className={`w-full  p-3 flex items-center justify-between border-b border-brand-mint/10 last:border-0 transition-colors ${exists ? 'bg-brand-grey/10 cursor-not-allowed opacity-50' : 'hover:bg-brand-mint/10'}`}
                  >
                    <span className={`text-[10px] font-bold uppercase ${exists ? 'text-brand-charcoal/30' : 'text-brand-charcoal/80'}`}>
                      {suggested}
                    </span>
                    {exists ? (
                      <Check size={14} className="text-new-crimson" />
                    ) : (
                      <Plus size={14} className="text-new-lightforest" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* --- 3. CUSTOM PAGES --- */}
      <div className="pt-4 border-t border-brand-mint/30 space-y-3" dir={lang === 'he' ? 'rtl' : 'ltr'}>
        <span className="text-[9px] font-black text-brand-charcoal/80 uppercase tracking-widest block px-1">{t.editor.structure.pagesPanel.customPagesTitle}</span>
        
        <div className="p-3 bg-brand-pearl/50 rounded-2xl border border-brand-mint/20 space-y-3">
          <div className="flex gap-2">
            <input 
              type="text"
              placeholder={t.editor.structure.pagesPanel.customPagePlaceholder}
              className="flex-1 bg-white border border-brand-mint/30 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-brand-main transition-all"
              value={customPageName}
              onChange={(e) => setCustomPageName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddCustomPage()}
            />
            <button 
              onClick={handleAddCustomPage}
              className="p-2 bg-brand-main text-white rounded-lg shadow-sm hover:bg-brand-main/90 transition-all"
            >
              <PlusCircle size={18}/>
            </button>
          </div>
          <div className="flex items-start gap-2 p-3 bg-brand-pearl rounded-xl border border-brand-lavender/50 text-[10px] text-brand-charcoal/80 leading-tight" dir={lang === 'he' ? 'rtl' : 'ltr'}>
                            <Info size={14} className="text-brand-indigo shrink-0" />
                            <p>
            {t.editor.structure.pagesPanel.customPageNote}
          </p></div>
        </div>
      </div>

    </div>
  );
};