"use client";

import React from 'react';
import { 
  ChevronRight, Trash2, Type as TypeIcon, 
  FileText, MousePointer, ImageIcon, Minus, ChevronLeft 
} from 'lucide-react';

// ייבוא הקבוצות והסקשנים
import { HeroSettings } from './HeroSettings';
import { FlexSettings } from './FlexSettings';
import { GallerySettings } from './GallerySettings';
import { SectionBackgroundGroup } from './settings/groups/SectionBackgroundGroup';
import MenuSectionSettings from './MenuSectionSettings'; // וודא שהנתיב תואם למיקום הקובץ אצלך

// הגדרת טיפוס ה-Callback כדי למנוע שגיאות "implicitly any"
type AssetCallback = (url: string) => void;

interface SectionPropertiesProps {
  site: any;
  selectedSection: any;
  activePageKey: string;
  pages: any;
  sections: any[];
  selectedId: string | null;
  selectedFlexElementId: string | null;
  primaryColor: string;
  updateSectionContent: (id: string, content: any) => void;
  deleteSection: (id: string) => void;
  deletePage: (pKey: string) => void;
  markChanged: (type: 'section' | 'page' | 'site', id: string) => void;
  setSite: React.Dispatch<React.SetStateAction<any>>;
  setSelectedId: (id: string | null) => void;
  setSelectedFlexElementId: (id: string | null) => void;
  selectAssetForField: (
    sectionId: string | undefined, 
    field: string, 
    slideIndex?: number, 
    callback?: AssetCallback
  ) => void;
  addFlexElement: (type: string) => void;
  updateFlexElement: (elId: string, updates: any) => void;
  addMenuCategory: () => void;
  menuJsonRef: any;
  handleMenuJsonImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SectionProperties(props: SectionPropertiesProps) {
  // חילוץ ה-site מה-props יחד עם שאר המשתנים
  const {
    site,
    selectedSection, 
    activePageKey, 
    pages, 
    selectedId,
    deleteSection, 
    markChanged, 
    setSite, 
    selectedFlexElementId, 
    setSelectedFlexElementId, 
    setSelectedId,
    deletePage,
    selectAssetForField,
  } = props;

  const handleBackToPage = () => {
    setSelectedId(null);
    setSelectedFlexElementId(null);
  };

  // --- מצב 1: עריכת הגדרות דף כלליות ---
  if (!selectedSection) {
    const currentPage = pages[activePageKey];

    const updatePage = (updates: any) => {
      const newPages = { ...pages, [activePageKey]: { ...currentPage, ...updates } };
      setSite((prev: any) => ({ ...prev, draft_data: { ...prev.draft_data, pages: newPages } }));
      markChanged('page', activePageKey);
    };

    return (
      <aside className="w-80 bg-white border-s border-brand-lavender flex flex-col z-40 shadow-sm text-start animate-in fade-in duration-300">
        <div className="p-6 border-b border-brand-lavender bg-brand-pearl/30">
          <div className="flex flex-col text-start">
            <span className="text-[10px] font-black uppercase text-brand-slate tracking-widest leading-none mb-1">General</span>
            <h2 className="text-[12px] font-black uppercase text-brand-midnight">Page Settings</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar text-start pb-20">
          <div className="space-y-4">
            <PropertyInput 
              label="Internal Page Name" 
              value={currentPage?.name || ''} 
              onChange={(val: string) => updatePage({ name: val })} 
            />

            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-brand-midnight/40 ml-1">URL Slug</span>
              <div className="flex items-center bg-brand-pearl rounded-xl border border-brand-lavender/50 overflow-hidden shadow-inner">
                <span className="pl-3 text-[10px] font-bold text-brand-slate/40 select-none">/</span>
                <input 
                  type="text"
                  disabled={activePageKey === 'home'} 
                  className={`w-full bg-transparent p-3 pl-1 text-[11px] font-bold outline-none transition-all ${activePageKey === 'home' ? 'opacity-50' : 'text-brand-indigo'}`}
                  value={activePageKey === 'home' ? '' : (currentPage?.slug || activePageKey)}
                  onChange={(e) => updatePage({ slug: e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') })}
                />
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-brand-lavender space-y-2">
            <span className="text-[10px] font-black uppercase text-brand-midnight tracking-widest block mb-2">Page Appearance</span>
            <SectionBackgroundGroup 
                content={currentPage || {}} 
                updateContent={updatePage}
                onOpenAssetManager={(cb: AssetCallback) => selectAssetForField(undefined, 'page_bg_image', undefined, cb)}
                site={site}
            />
          </div>

          {activePageKey !== 'home' && (
            <div className="pt-10 border-t border-brand-lavender">
              <button 
                onClick={() => { if (window.confirm(`Delete page?`)) deletePage(activePageKey); }}
                className="w-full py-2.5 bg-brand-coral/5 border border-brand-coral/30 rounded-xl text-brand-coral text-[10px] font-black hover:bg-brand-coral hover:text-white transition-all flex items-center justify-center gap-2"
              >
                <Trash2 size={14} /> DELETE PAGE
              </button>
            </div>
          )}
        </div>
      </aside>
    );
  }

  // --- מצב 2: עריכת סקשן או אלמנט ---
  const currentElement = selectedSection?.content?.elements?.find((e: any) => e.id === selectedFlexElementId);
  const elementTypeName = currentElement?.type ? currentElement.type.toUpperCase() : 'ELEMENT';

  return (
    <aside className="w-80 bg-white border-s border-brand-lavender flex flex-col z-40 shadow-sm text-start">
      <div className="p-6 border-b border-brand-lavender bg-brand-pearl/20">
        <div className="flex items-center gap-1.5 text-[9px] font-black text-brand-slate uppercase tracking-widest mb-1 overflow-hidden">
          <button onClick={handleBackToPage} className="opacity-50 hover:opacity-100 truncate hover:text-brand-indigo transition-all">
            {pages[activePageKey]?.name || activePageKey}
          </button>
          <ChevronRight size={10} className="opacity-30 flex-shrink-0" />
          <button 
            onClick={() => setSelectedFlexElementId(null)}
            className={`truncate ${selectedFlexElementId ? 'text-brand-indigo hover:opacity-70 underline decoration-brand-indigo/30 underline-offset-2' : 'text-brand-indigo pointer-events-none'}`}
          >
            {selectedSection.name || selectedSection.type}
          </button>
          {selectedFlexElementId && (
            <>
              <ChevronRight size={10} className="opacity-30 flex-shrink-0" />
              <span className="text-brand-indigo truncate">{elementTypeName}</span>
            </>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <h2 className="text-[12px] font-black uppercase text-brand-midnight">
            {selectedFlexElementId ? `${elementTypeName} Settings` : 'Section Settings'}
          </h2>
          {!selectedFlexElementId && (
            <button 
              onClick={() => deleteSection(selectedSection.id)} 
              className="p-2 rounded-xl border border-brand-coral/20 text-brand-coral hover:bg-brand-coral hover:text-white transition-all"
            >
              <Trash2 size={16}/>
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar text-start pb-20">
        {selectedSection.type === 'hero' && (
          <HeroSettings 
            {...props}
            site={site} // העברת ה-site בצורה מפורשת
            selectedId={selectedId!} 
            onBackToPage={handleBackToPage}
          />
        )}

        {selectedSection.type === 'flex' && (
          <FlexSettings 
            {...props} 
            site={site} // העברת ה-site בצורה מפורשת
            selectedId={selectedId!} 
            onBackToPage={handleBackToPage}
          />
        )}

        {selectedSection.type === 'gallery' && (
          <GallerySettings 
            {...props}
            site={site} // העברת ה-site בצורה מפורשת
            content={selectedSection.content}
            selectedId={selectedId!}
            onBackToPage={handleBackToPage}
          />
        )}

{selectedSection.type === 'menu' && (
          <MenuSectionSettings 
            {...props}
            site={site}
            section={selectedSection} // הוספנו את זה כאן
            selectedId={selectedId!}
            onBackToPage={handleBackToPage}
          />
        )}
      </div>
    </aside>
  );
}

export function PropertyInput({ label, value, onChange, isTextarea }: any) {
  return (
    <div className="space-y-2 text-start">
      <span className="text-[10px] font-black uppercase text-brand-slate/40 tracking-widest">{label}</span>
      {isTextarea ? (
        <textarea 
          className="w-full bg-brand-pearl p-3 rounded-xl border border-brand-lavender outline-none focus:border-brand-indigo text-[12px] font-medium resize-none shadow-inner" 
          rows={4} 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
        />
      ) : (
        <input 
          className="w-full bg-brand-pearl p-3 rounded-xl border border-brand-lavender outline-none focus:border-brand-indigo text-[12px] font-medium shadow-inner" 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
        />
      )}
    </div>
  );
}