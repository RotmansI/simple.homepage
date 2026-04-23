"use client";

import React from 'react';
import { 
  ChevronLeft, LayoutGrid, MoveVertical, Grid3X3, Maximize2, 
  CheckCircle2, AlertCircle, Trash2, Plus, GripVertical, Palette, Box, Layers, MousePointer2
} from 'lucide-react';
import { ElementEditor } from './ElementEditor';

// ייבוא הקבוצות המעודכנות
import { SectionBasicGroup } from './settings/groups/SectionBasicGroup';
import { SectionBackgroundGroup } from './settings/groups/SectionBackgroundGroup';
import { ContentManagerGroup } from './settings/groups/ContentManagerGroup';
import { FrameGroup } from './settings/groups/FrameGroup';
import { ShadowGroup } from './settings/groups/ShadowGroup';
import { InteractionsGroup } from './settings/groups/InteractionsGroup';
import { SettingsCollapse } from './settings/groups/SettingsCollapse';

export const GallerySettings = ({
  site,
  content,
  updateSectionContent,
  selectAssetForField,
  onBackToPage,
  selectedId,
  selectedFlexElementId,
  setSelectedFlexElementId,
  updateFlexElement,
  selectedSection,
  pages,
  activePageKey
}: any) => {

  const gallerySettings = content.gallery_settings || {};
  const imageCount = gallerySettings.images?.length || 0;
  const isCarousel = gallerySettings.layout === 'carousel';
  const hasMinImages = imageCount >= 10;
  const currentElement = content.elements?.find((e: any) => e.id === selectedFlexElementId);

  // פונקציות עזר לעדכון
  const updateContent = (updates: any) => updateSectionContent(selectedId, { ...content, ...updates });
  const updateGallery = (updates: any) => updateContent({ gallery_settings: { ...gallerySettings, ...updates } });

  // פונקציית הוספת אלמנטים (כותרות/כפתורים מעל הגלריה)
  const addGalleryElement = (type: string) => {
    const newEl: any = { 
      id: `${type}-${crypto.randomUUID()}`, 
      type, 
      text_align: 'center',
    };
    if (type === 'heading') { newEl.text = 'Gallery Title'; newEl.font_size = 36; }
    else if (type === 'paragraph') { newEl.text = 'Our latest works...'; newEl.font_size = 16; }
    else if (type === 'button') { newEl.text = 'View All'; newEl.font_size = 14; }

    updateContent({ elements: [...(content.elements || []), newEl] });
  };

  // מצב עריכת אלמנט ספציפי
  if (selectedFlexElementId && currentElement) {
    return (
      <ElementEditor 
        site={site} // העברת ה-site לאלמנט אדיטור
        el={currentElement}
        selectedId={selectedId}
        updateFlexElement={updateFlexElement}
        selectAssetForField={selectAssetForField}
        onBack={() => setSelectedFlexElementId(null)}
        selectedSection={selectedSection}
      />
    );
  }

  return (
    <div className="space-y-2 animate-in slide-in-from-right-4 duration-300 pb-20 text-start text-brand-midnight">
      
      {/* כפתור חזרה */}
      <button 
        onClick={onBackToPage}
        className="flex items-center gap-2 px-1 py-1 text-brand-indigo hover:text-brand-indigo/70 transition-all group mb-4"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-tight">
          Back to <span className="underline decoration-brand-indigo/30 underline-offset-2">{(pages && activePageKey && pages[activePageKey]?.name) || 'Page'}</span>
        </span>
      </button>

      {/* 1. זהות ורקע הסקשן */}
      <div className="mb-6">
        <SectionBasicGroup content={selectedSection} updateContent={(updates) => updateSectionContent(selectedId, updates)} />
      </div>

      <div className="flex flex-col">
        
        {/* הגדרות רקע הסקשן */}
        <SettingsCollapse label="Background & Styles" icon={<Palette size={14}/>}>
            <SectionBackgroundGroup 
                content={content} 
                updateContent={updateContent} 
                onOpenAssetManager={(callback) => selectAssetForField(selectedId, 'bg_image', undefined, callback)} 
                site={site}
            />
        </SettingsCollapse>

        {/* ניהול אלמנטים מעל הגלריה (המאוחד) */}
        <SettingsCollapse label="Gallery Content" icon={<GripVertical size={14}/>}>
          <ContentManagerGroup 
            content={content} 
            updateContent={updateContent} 
            onAddElement={addGalleryElement}
            onEditElement={setSelectedFlexElementId} 
            onRemoveElement={(id) => updateContent({ elements: content.elements.filter((e: any) => e.id !== id) })} 
          />
        </SettingsCollapse>

        {/* עיצוב מבנה הגלריה */}
        <SettingsCollapse label="Gallery Designer" icon={<Grid3X3 size={14}/>} defaultOpen={true}>
          <div className="space-y-6 pt-2">
            {/* בחירת Layout */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'classic', label: 'Classic', icon: <LayoutGrid size={16} /> },
                { id: 'carousel', label: 'Carousel', icon: <MoveVertical size={16} className="rotate-90" /> },
                { id: 'mosaic', label: 'Mosaic', icon: <Grid3X3 size={16} /> }
              ].map(layout => (
                <button 
                    key={layout.id} 
                    onClick={() => updateGallery({ layout: layout.id })} 
                    className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${gallerySettings.layout === layout.id ? 'bg-brand-indigo text-white border-brand-indigo shadow-md' : 'bg-white text-brand-slate border-brand-lavender hover:border-brand-indigo shadow-sm'}`}
                >
                  {layout.icon}
                  <span className="text-[8px] font-black uppercase">{layout.label}</span>
                </button>
              ))}
            </div>

            {/* חיווי קרוסלה */}
            {isCarousel && (
              <div className={`p-4 rounded-2xl border-2 transition-all ${hasMinImages ? 'bg-brand-mint/10 border-brand-mint/30 text-brand-mint' : 'bg-brand-coral/5 border-brand-coral/30 text-brand-coral'}`}>
                <div className="flex items-start gap-3">
                  {hasMinImages ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-tight">Carousel Status</p>
                    <p className="text-[9px] opacity-70 font-medium leading-tight">
                      {hasMinImages ? 'Loop mode active' : `Add ${10 - imageCount} more images for loop`}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* קנה מידה (Scale) */}
            <div className="p-4 bg-white rounded-2xl border border-brand-lavender shadow-sm space-y-3">
              <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2 opacity-40">
                  <Maximize2 size={12} />
                  <span className="text-[9px] font-bold uppercase">Component Scale</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-brand-indigo">x{gallerySettings.component_scale ?? 1}</span>
              </div>
              <input type="range" min="0.4" max="1.2" step="0.05" className="w-full accent-brand-indigo h-1.5 cursor-pointer appearance-none bg-brand-lavender rounded-lg" value={gallerySettings.component_scale ?? 1} onChange={(e) => updateGallery({ component_scale: parseFloat(e.target.value) })} />
            </div>
          </div>
        </SettingsCollapse>

        {/* ניהול Assets (תמונות הגלריה) */}
        <SettingsCollapse label="Gallery Images" icon={<Box size={14}/>} defaultOpen={true}>
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-4 gap-2">
              {gallerySettings.images?.map((img: string, idx: number) => (
                <div key={idx} className="relative aspect-square rounded-xl border border-brand-lavender overflow-hidden group bg-brand-pearl shadow-sm">
                   <img src={img} className="w-full h-full object-cover" />
                   <button 
                    onClick={() => {
                        const newImgs = [...gallerySettings.images];
                        newImgs.splice(idx, 1);
                        updateGallery({ images: newImgs });
                    }} 
                    className="absolute inset-0 bg-brand-coral/90 text-white opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center"
                   >
                     <Trash2 size={14} />
                   </button>
                </div>
              ))}
              {imageCount < 30 && (
                <button 
                  onClick={() => selectAssetForField(selectedId, 'gallery_add_image', undefined, (url: string) => {
                      const currentImages = gallerySettings.images || [];
                      updateGallery({ images: [...currentImages, url] });
                  })}
                    className="aspect-square rounded-xl border-2 border-dashed border-brand-lavender flex items-center justify-center text-brand-slate hover:border-brand-indigo hover:text-brand-indigo transition-all bg-brand-pearl/30 hover:bg-white"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>
            <p className="text-[8px] opacity-40 italic text-center uppercase font-bold">Max 30 images per gallery</p>
          </div>
        </SettingsCollapse>

        {/* עיצובים נוספים (Frames, Shadows, Hover) */}
        <SettingsCollapse label="Frames & Borders" icon={<Layers size={14}/>}>
            <FrameGroup 
              site={site} // העברת ה-site לצבעי מותג בבורדר
              content={gallerySettings} 
              updateContent={updateGallery} 
            />
        </SettingsCollapse>

        <SettingsCollapse label="Shadow Effects" icon={<Layers size={14}/>}>
            <ShadowGroup 
              site={site} // העברת ה-site לצבעי מותג בצל
              content={gallerySettings} 
              updateContent={updateGallery} 
            />
        </SettingsCollapse>

      </div>
    </div>
  );
};