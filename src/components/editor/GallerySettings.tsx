"use client";

import React from 'react';
import { 
  ChevronLeft, ChevronRight, LayoutGrid, MoveVertical, Grid3X3, Maximize2, 
  CheckCircle2, AlertCircle, Trash2, Plus, GripVertical, Palette, Box, Layers
} from 'lucide-react';
import { ElementEditor } from './ElementEditor';

// ייבוא הקבוצות המעודכנות
import { SectionBasicGroup } from './settings/groups/SectionBasicGroup';
import { SectionBackgroundGroup } from './settings/groups/SectionBackgroundGroup';
import { ContentManagerGroup } from './settings/groups/ContentManagerGroup';
import { FrameGroup } from './settings/groups/FrameGroup';
import { ShadowGroup } from './settings/groups/ShadowGroup';
import { SettingsCollapse } from './settings/groups/SettingsCollapse';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

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

  const { lang } = useLanguage();
  const t = translations[lang as Language];
  const gallerySettings = content.gallery_settings || {};
  const imageCount = gallerySettings.images?.length || 0;
  const isCarousel = gallerySettings.layout === 'carousel';
  const hasMinImages = imageCount >= 10;
  
  // מציאת האלמנט הנבחר בשרשרת
  const currentElement = content.elements?.find((e: any) => e.id === selectedFlexElementId);

  // פונקציות עזר לעדכון
  const updateContent = (updates: any) => updateSectionContent(selectedId, { ...content, ...updates });
  const updateGallery = (updates: any) => updateContent({ gallery_settings: { ...gallerySettings, ...updates } });

  // פונקציית הוספת אלמנטים (כותרות/כפתורים מעל הגלריה)
  const addGalleryElement = (type: string) => {
    const primaryColor = site?.theme_settings?.primary_color || '#000000';
    
    const newEl: any = { 
      id: `${type}-${crypto.randomUUID()}`, 
      type, 
      text_align: 'center',
    };

    if (type === 'heading') { 
        newEl.text = t.editor.sidebar.sections.defaults.title; 
        newEl.font_size = 36; 
        newEl.font_weight = '800';
    }
    else if (type === 'paragraph') { 
        newEl.text = t.editor.sidebar.sections.defaults.description; 
        newEl.font_size = 16; 
    }
    else if (type === 'button') { 
        newEl.text = t.editor.sidebar.sections.defaults.button; 
        newEl.font_size = 14; 
        newEl.bg_color = primaryColor;
    }

    updateContent({ elements: [...(content.elements || []), newEl] });
  };

  /**
   * השרשרת: מצב עריכת אלמנט (Element Focus)
   * אם נבחר אלמנט ספציפי, הסיידבר מחליף את פניו
   */
  if (selectedFlexElementId && currentElement) {
    return (
      <div className="animate-in slide-in-from-left duration-300">
        <ElementEditor 
          site={site}
          el={currentElement}
          selectedId={selectedId}
          updateFlexElement={updateFlexElement}
          selectAssetForField={selectAssetForField}
          onBack={() => setSelectedFlexElementId(null)}
          selectedSection={selectedSection}
        />
      </div>
    );
  }

  const pageName = (pages && activePageKey && pages[activePageKey]?.name) || t.editor.sidebar.sections.page;
  const allSectionsContent = site?.draft_data?.content || site?.content;

  return (
    <div 
      className={`space-y-2 animate-in duration-300 pb-20 text-brand-midnight ${
        lang === 'he' ? 'text-right slide-in-from-left-4' : 'text-left slide-in-from-right-4'
      }`}
      dir={lang === 'he' ? 'rtl' : 'ltr'}
    >
      
      {/* כפתור חזרה לעמוד */}
      <button 
        onClick={onBackToPage}
        className="flex items-center gap-2 px-1 py-1 text-brand-indigo hover:text-brand-indigo/70 transition-all group mb-4"
      >
        {lang === 'he' ? (
          <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        ) : (
          <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        )}
        <span className="text-[10px] font-black uppercase tracking-tight">
          {t.editor.sidebar.sections.backToPage} <span className="underline decoration-brand-indigo/30 underline-offset-2">{pageName}</span>
        </span>
      </button>

      {/* 1. זהות הסקשן */}
      <div className="mb-6">
        <SectionBasicGroup 
          content={selectedSection} 
          updateContent={(updates) => updateSectionContent(selectedId, updates)} 
        />
      </div>

      <div className="flex flex-col">
        
        {/* הגדרות רקע הסקשן */}
        <SettingsCollapse 
          id={`${selectedId}-background`}
          label={t.editor.sidebar.sections.groups.background} 
          icon={<Palette size={14}/>}
        >
            <SectionBackgroundGroup 
                content={content} 
                updateContent={updateContent} 
                onOpenAssetManager={(callback) => selectAssetForField(selectedId, 'bg_image', undefined, callback)} 
                site={site}
                allSectionsContent={allSectionsContent}
            />
        </SettingsCollapse>

        {/* ניהול אלמנטים מעל הגלריה (כותרות, פסקאות, כפתורים) */}
        <SettingsCollapse 
          id={`${selectedId}-content`}
          label={t.editor.sidebar.sections.groups.galleryContent} 
          icon={<GripVertical size={14}/>}
        >
          <ContentManagerGroup 
            content={content} 
            updateContent={updateContent} 
            onAddElement={addGalleryElement}
            onEditElement={(id) => setSelectedFlexElementId(id)} 
            onRemoveElement={(id) => updateContent({ elements: content.elements.filter((e: any) => e.id !== id) })} 
          />
        </SettingsCollapse>

        {/* עיצוב מבנה הגלריה (Layout & Scale) */}
        <SettingsCollapse 
          id={`${selectedId}-designer`}
          label={t.editor.sidebar.sections.groups.galleryDesigner} 
          icon={<Grid3X3 size={14}/>}
        >
          <div className="space-y-6 pt-2">
            {/* בחירת Layout */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'classic', label: t.editor.sidebar.sections.gallery.layouts.classic, icon: <LayoutGrid size={16} /> },
                { id: 'carousel', label: t.editor.sidebar.sections.gallery.layouts.carousel, icon: <MoveVertical size={16} className="rotate-90" /> },
                { id: 'mosaic', label: t.editor.sidebar.sections.gallery.layouts.mosaic, icon: <Grid3X3 size={16} /> }
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

            {/* חיווי סטטוס קרוסלה */}
            {isCarousel && (
              <div className={`p-4 rounded-2xl border-2 transition-all ${hasMinImages ? 'bg-brand-mint/10 border-brand-mint/30 text-brand-mint' : 'bg-brand-coral/5 border-brand-coral/30 text-brand-coral'}`}>
                <div className="flex items-start gap-3">
                  {hasMinImages ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase tracking-tight">{t.editor.sidebar.sections.gallery.carouselStatus.title}</p>
                    <p className="text-[9px] opacity-70 font-medium leading-tight">
                      {hasMinImages ? t.editor.sidebar.sections.gallery.carouselStatus.active : t.editor.sidebar.sections.gallery.carouselStatus.needed.replace('{count}', (10 - imageCount).toString())}
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
                  <span className="text-[9px] font-bold uppercase">{t.editor.sidebar.sections.gallery.scale}</span>
                </div>
                <span className="text-[10px] font-mono font-bold text-brand-indigo">x{gallerySettings.component_scale ?? 1}</span>
              </div>
              <input 
                type="range" min="0.4" max="1.2" step="0.05" 
                className="w-full accent-brand-indigo h-1.5 cursor-pointer appearance-none bg-brand-lavender rounded-lg" 
                value={gallerySettings.component_scale ?? 1} 
                onChange={(e) => updateGallery({ component_scale: parseFloat(e.target.value) })} 
              />
            </div>
          </div>
        </SettingsCollapse>

        {/* ניהול תמונות הגלריה */}
        <SettingsCollapse 
          id={`${selectedId}-images`}
          label={t.editor.sidebar.sections.groups.galleryImages} 
          icon={<Box size={14}/>}
        >
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-4 gap-2">
              {gallerySettings.images?.map((img: string, idx: number) => (
                <div key={idx} className="relative aspect-square rounded-xl border border-brand-lavender overflow-hidden group bg-brand-pearl shadow-sm">
                   <img src={img} className="w-full h-full object-cover" alt="" />
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
            <p className="text-[8px] opacity-40 italic text-center uppercase font-bold">{t.editor.sidebar.sections.gallery.maxImages}</p>
          </div>
        </SettingsCollapse>

        {/* מסגרות (Frames) */}
        <SettingsCollapse 
          id={`${selectedId}-frames`}
          label={t.editor.sidebar.sections.groups.frames} 
          icon={<Layers size={14}/>}
        >
            <FrameGroup 
              site={site} 
              content={gallerySettings} 
              updateContent={updateGallery} 
            />
        </SettingsCollapse>

        {/* צללים (Shadows) */}
        <SettingsCollapse 
          id={`${selectedId}-shadows`}
          label={t.editor.sidebar.sections.groups.shadows} 
          icon={<Layers size={14}/>}
        >
            <ShadowGroup 
              site={site} 
              content={gallerySettings} 
              updateContent={updateGallery} 
            />
        </SettingsCollapse>

      </div>
    </div>
  );
};