"use client";

import React from 'react';
import { ChevronLeft, ImageIcon, Trash2, Plus } from 'lucide-react';
import { TypographyGroup } from './settings/groups/TypographyGroup';
import { FrameGroup } from './settings/groups/FrameGroup';
import { ShadowGroup } from './settings/groups/ShadowGroup';
import { InteractionsGroup } from './settings/groups/InteractionsGroup';
import { BoxModelGroup } from './settings/groups/BoxModelGroup';
import { VisualExtrasGroup } from './settings/groups/VisualExtrasGroup';
import { SpacerGroup } from './settings/groups/SpacerGroup';
import { ImageLayoutGroup } from './settings/groups/ImageLayoutGroup';

interface ElementEditorProps {
  site: any;
  el: any;
  updateFlexElement: (id: string, updates: any) => void;
  // שינינו את הפרמטר השלישי ל-any כדי לתמוך גם ב-slideIndex וגם ב-currentVal
  selectAssetForField: (sectionId: string | undefined, field: string, extra?: any, callback?: (url: string) => void) => void;
  onBack: () => void;
  selectedId: string;
  PropertyInput?: any; 
  selectedSection?: any;
}

export const ElementEditor = ({ 
  site,
  el, 
  updateFlexElement, 
  selectAssetForField, 
  onBack, 
  selectedId, 
  selectedSection 
}: ElementEditorProps) => {
  if (!el) return null;

  const sectionTitle = selectedSection?.name || selectedSection?.type || 'Section';
  const update = (updates: any) => updateFlexElement(el.id, updates);

  return (
    <div className="space-y-2 animate-in slide-in-from-right-4 duration-300 text-start pb-20">
      
      <button 
        onClick={onBack}
        className="flex items-center gap-1 px-1 py-1 text-brand-indigo hover:text-brand-indigo/70 transition-all group mb-4"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-tight">
          Back to <span className="underline decoration-brand-indigo/30 underline-offset-2">{sectionTitle}</span> Settings
        </span>
      </button>

      {/* --- HEADING & PARAGRAPH --- */}
      {(el.type === 'heading' || el.type === 'paragraph') && (
        <>
          <TypographyGroup content={el} updateContent={update} site={site} isTextArea={el.type === 'paragraph'} />
          <FrameGroup content={el} updateContent={update} site={site} />
          <BoxModelGroup content={el} updateContent={update} />
          <ShadowGroup content={el} updateContent={update} site={site} />
          <InteractionsGroup content={el} updateContent={update} site={site} selectAssetForField={selectAssetForField} />
        </>
      )}

      {/* --- BUTTON --- */}
      {el.type === 'button' && (
        <>
          <div className="p-4 bg-white rounded-2xl border border-brand-lavender shadow-sm mb-4">
             <span className="text-[9px] font-black uppercase text-brand-midnight opacity-40 block mb-3">Button Content</span>
             <div className="space-y-3">
               <input 
                  type="text"
                  placeholder="Button label"
                  className="w-full bg-brand-pearl p-3 rounded-xl border border-brand-lavender outline-none text-[12px] font-bold focus:border-brand-indigo/30 transition-all shadow-inner" 
                  value={el.text || ''} 
                  onChange={(e) => update({ text: e.target.value })} 
                />
             </div>
          </div>
          <TypographyGroup content={el} updateContent={update} site={site} showContentInput={false} />
          <VisualExtrasGroup content={el} updateContent={update} site={site}/>
          <FrameGroup content={el} updateContent={update} site={site} />
          <BoxModelGroup content={el} updateContent={update} />
          <InteractionsGroup content={el} updateContent={update} site={site} selectAssetForField={selectAssetForField}/>
        </>
      )}

{/* --- IMAGE --- */}
      {el.type === 'image' && (
        <>
          <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm mb-4 space-y-4">
            <span className="text-[9px] font-black uppercase text-brand-midnight opacity-40 block">Image Asset</span>
            <div 
              onClick={() => selectAssetForField(selectedId, 'flex_element_image', el.url, (url) => update({ url }))}
              className="aspect-video bg-brand-pearl rounded-xl border-2 border-dashed border-brand-lavender/50 overflow-hidden relative group shadow-inner cursor-pointer hover:border-brand-indigo/30 transition-all"
            >
              {el.url ? (
                <div className="relative w-full h-full">
                  <img src={el.url} className="w-full h-full object-cover" alt="" />
                  <div className="absolute inset-0 bg-brand-midnight/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
                    <div className="bg-white/90 p-2 rounded-full text-brand-midnight shadow-xl">
                      <Plus size={16}/>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3 group-hover:scale-105 transition-transform duration-500">
                  <div className="w-10 h-10 rounded-full bg-brand-lavender/20 flex items-center justify-center text-brand-indigo/40 group-hover:bg-brand-indigo/10 group-hover:text-brand-indigo transition-colors">
                    <ImageIcon size={20} />
                  </div>
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-tighter block text-brand-midnight/60">Select Media</span>
                    <span className="text-[8px] font-medium text-brand-midnight/30 block uppercase tracking-widest">Click to browse assets</span>
                  </div>
                </div>
              )}
            </div>
            {el.url && (
              <button 
                onClick={(e) => { e.stopPropagation(); update({ url: null }); }}
                className="w-full py-2 flex items-center justify-center gap-2 text-[9px] font-black uppercase text-brand-coral bg-brand-coral/5 hover:bg-brand-coral/10 rounded-lg transition-all border border-brand-coral/10"
              >
                <Trash2 size={12} /> Remove Asset
              </button>
            )}
          </div>

          {/* הקבוצה החדשה שמטפלת ביישור וגודל התמונה בלבד */}
          <ImageLayoutGroup content={el} updateContent={update} />

          <FrameGroup content={el} updateContent={update} site={site} />
          <ShadowGroup content={el} updateContent={update} site={site} />
          <InteractionsGroup content={el} updateContent={update} site={site} selectAssetForField={selectAssetForField}/>
          <BoxModelGroup content={el} updateContent={update} />
        </>
      )}

      {/* --- SPACER --- */}
      {el.type === 'spacer' && <SpacerGroup content={el} updateContent={update} site={site} />}
    </div>
  );
};