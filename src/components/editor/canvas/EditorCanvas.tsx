"use client";

import React, { useState } from 'react';
import { X, Box, Layout, Minus, ImageIcon, UtensilsCrossed, Plus, Info } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';
import { analyzePage } from '@/utils/editor/pageAnalyzer';

// Sections Imports
import HeroSection from '../sections/HeroSection';
import FlexSection from '../sections/FlexSection';
import GallerySection from '../sections/GallerySection';
import MenuSection from '../sections/MenuSection';
import TextSection from '../sections/TextSection';
import DividerSection from '../sections/DividerSection';
import AddSectionModal from '@/components/editor/settings/controls/AddSectionModal';
import { CanvasSectionWrapper } from './CanvasSectionWrapper';

// Focus Mode Component
import { NavbarPreviewCanvas } from './NavbarPreviewCanvas';

// קומפוננטת עזר לנתונים בבר הסטטוס
const StatItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: number }) => (
  <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-brand-lavender/60 bg-white/50 shadow-sm hover:border-brand-main/30 hover:bg-white transition-all shrink-0">
    <div className="text-brand-main shrink-0">
      <Icon size={12} />
    </div>
    <div className="flex items-center gap-1.5 leading-none">
      <span className="text-[11px] font-black text-brand-midnight">{value}</span>
      <span className="text-[9px] font-bold text-brand-slate/50 uppercase tracking-tighter">{label}</span>
    </div>
  </div>
);

export const EditorCanvas = (props: any) => {
  const { 
    isSidebarsCollapsed,
    activePanel, 
    previewMode, 
    activePageData, 
    sections, 
    selectedId, 
    setSelectedId, 
    selectedFlexElementId,
    setSelectedFlexElementId,
    updateSectionContent,
    showAddModal,
    setShowAddModal,
    addSection,
    site,
    deleteSection,
    duplicateSection,
    moveSection,
    pages,
    activePageKey,
    selectAssetForField
  } = props;

  const { lang } = useLanguage();
  const t = translations[lang as Language];
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const siteLanguage = site?.theme_settings?.site_language || 'en';
  const isRTL = siteLanguage === 'he';
  
  const stats = analyzePage(sections, site, activePageKey);
  const pageName = (pages && activePageKey) ? (pages[activePageKey]?.name || activePageKey) : '';
  
  const handleSelectElement = (sectionId: string, elementId: string) => {
    setSelectedId(sectionId);
    if (typeof setSelectedFlexElementId === 'function') {
      setSelectedFlexElementId(elementId);
    }
  };

  /**
   * 🎯 מנוע החלפת המדיה הגנרי
   * יוצר פונקציית Callback עבור כל סקשן כדי לעדכן אלמנטים פנימיים
   */
  const createAssetOpener = (section: any) => (elementId: string) => {
    if (typeof selectAssetForField !== 'function') return;

    // פתיחת ה-Asset Manager עם Callback שיודע לעדכן את המערך
    selectAssetForField(section.id, 'elements', undefined, (url: string) => {
      const currentElements = section.content?.elements || [];
      const updatedElements = currentElements.map((el: any) => 
        el.id === elementId ? { ...el, url: url } : el
      );
      
      updateSectionContent(section.id, { elements: updatedElements });
    });
  };

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedId(null);
      setSelectedFlexElementId(null);
    }
  };

  if (activePanel === 'navbar') {
    return <NavbarPreviewCanvas site={site} previewMode={previewMode} />;
  }

  return (
    <main 
      className="flex-1 bg-brand-grey overflow-y-auto overflow-x-hidden custom-scrollbar flex flex-col transition-all duration-500 relative"
      dir={isRTL ? 'rtl' : 'ltr'}
      onClick={handleCanvasClick}
    >
      {/* 1. שורת סטטוס עמוד */}
      {activePanel !== 'navbar' && (
        <div className="w-full bg-white/95 backdrop-blur-md border-b border-brand-lavender/40 px-6 py-2 flex items-center justify-between sticky top-0 z-[100] shadow-sm">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-brand-indigo/5 border border-brand-indigo/10 shrink-0">
              <span className="text-[8px] font-black text-brand-indigo/40 uppercase tracking-tighter leading-none">
                {t.editor.canvas.statusBar.pageName}
              </span>
              <div className="flex items-center gap-1.5">
                <Layout size={11} className="text-brand-indigo" />
                <span className="text-[10px] font-black text-brand-indigo truncate max-w-[100px]">
                  {pageName}
                </span>
              </div>
            </div>

            <div className="h-4 w-px bg-brand-lavender/50 shrink-0" />

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <StatItem icon={Box} label={t.editor.canvas.statusBar.sections} value={stats.sectionCount} />
              <StatItem icon={UtensilsCrossed} label={t.editor.canvas.statusBar.elements} value={stats.elementCount} />
              <StatItem icon={ImageIcon} label={t.editor.canvas.statusBar.images} value={stats.imageCount} />
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white px-3 py-1 rounded-full border border-brand-lavender/60 shadow-sm shrink-0 relative group/health">
            <div className="flex flex-col items-end leading-none">
              <div className="flex items-center gap-1">
                {stats.isOverloaded && (
                  <div className="text-amber-500 cursor-help animate-pulse" title={t.editor.canvas.statusBar.overloadTooltip}>
                    <Info size={10} />
                  </div>
                )}
                <span className="text-[7px] font-black text-brand-slate/40 uppercase tracking-tighter mb-0.5">
                  {t.editor.canvas.statusBar.pageHealth}
                </span>
              </div>
              <span className={`text-[8px] font-black uppercase ${stats.score > 70 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {stats.score > 70 ? t.editor.canvas.statusBar.healthLevels.good : t.editor.canvas.statusBar.healthLevels.poor}
              </span>
            </div>
            
            <div className="relative w-12 h-1 bg-brand-grey rounded-full overflow-hidden shadow-inner border border-black/[0.03]">
              <div 
                className={`absolute inset-y-0 ${isRTL ? 'right-0' : 'left-0'} transition-all duration-1000 ease-out ${
                  stats.score > 70 ? 'bg-emerald-500' : stats.score > 40 ? 'bg-amber-500' : 'bg-rose-500'
                }`}
                style={{ width: `${stats.score}%` }}
              />
            </div>
            <span className="text-[10px] font-black text-brand-indigo w-6 text-center">{stats.score}%</span>
          </div>
        </div>
      )}

      {/* 2. אזור הקנבס */}
      <div 
        className={`flex-1 w-full max-w-full flex justify-center ${activePanel === 'navbar' ? 'pt-0' : 'pt-14'} transition-all duration-500`}
      >
        <div 
          className={`
            shadow-2xl transition-all canvas-preview-area duration-500 relative flex flex-col h-fit
            ${previewMode === 'desktop' ? 'w-full' : 'w-[375px]'} 
            rounded-t-[0.5rem] border border-brand-main/20 mb-32 overflow-visible
          `}
          style={{
            backgroundColor: activePageData.bg_color || '#ffffff',
            backgroundImage: `
              ${activePageData.bg_filter_color 
                ? `linear-gradient(${activePageData.bg_filter_color}${Math.round((activePageData.bg_filter_opacity ?? 50) * 2.55).toString(16).padStart(2, '0')}, ${activePageData.bg_filter_color}${Math.round((activePageData.bg_filter_opacity ?? 50) * 2.55).toString(16).padStart(2, '0')})` 
                : 'linear-gradient(transparent, transparent)'},
              ${activePageData.bg_image ? `url(${activePageData.bg_image})` : 'none'}
            `,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="flex-1 flex flex-col min-h-screen relative z-10">
          {sections.map((s: any) => (
            <CanvasSectionWrapper
              key={s.id}
              id={s.id}
              isRTL={isRTL}
              isSelected={selectedId === s.id}
              isHovered={hoveredId === s.id}
              onSelect={(sectionId) => {
                setSelectedId(sectionId);
                if (typeof setSelectedFlexElementId === 'function') {
                  setSelectedFlexElementId(null);
                }
              }}
              onHover={setHoveredId}
              onDelete={deleteSection}
              onDuplicate={duplicateSection}
              onMove={moveSection}
            >
              {s.type === 'hero' && (
                <HeroSection 
                  section={s} 
                  site={site}
                  isSelected={selectedId === s.id} 
                  updateContent={(updates: any) => updateSectionContent(s.id, updates)}
                  selectedFlexElementId={selectedFlexElementId}
                  setSelectedFlexElementId={setSelectedFlexElementId}
                  onSelectElement={handleSelectElement}
                  // 🎯 שימוש במנוע הגנרי
                  onOpenAssetManager={createAssetOpener(s)}
                />
              )}
              {s.type === 'flex' && (
                <FlexSection 
                  section={s} 
                  site={site}
                  isSelected={selectedId === s.id}
                  updateContent={(updates: any) => updateSectionContent(s.id, updates)}
                  selectedFlexElementId={selectedFlexElementId}
                  setSelectedFlexElementId={setSelectedFlexElementId}
                  onSelectElement={handleSelectElement}
                  // 🎯 החלה גם על FlexSection
                  onOpenAssetManager={createAssetOpener(s)}
                />
              )}
              {s.type === 'gallery' && (
                <GallerySection 
                  section={s} 
                  isEditor={true} 
                  updateContent={(updates: any) => updateSectionContent(s.id, updates)} 
                  site={site} 
                  isSelected={selectedId === s.id} 
                  selectedFlexElementId={selectedFlexElementId} 
                  setSelectedFlexElementId={setSelectedFlexElementId}
                  // 🎯 החלה גם על GallerySection
                  onOpenAssetManager={createAssetOpener(s)}
                />
              )}
              {s.type === 'menu' && <MenuSection section={s} site={site} isSelected={selectedId === s.id} selectedFlexElementId={selectedFlexElementId} setSelectedFlexElementId={setSelectedFlexElementId} />}
              {s.type === 'text' && <TextSection section={s} site={site} />}
              {s.type === 'divider' && <DividerSection content={s.content} site={site} />}
            </CanvasSectionWrapper>
          ))}

            <div 
              onClick={(e) => { e.stopPropagation(); setShowAddModal(true); }}
              className="m-8 py-12 border-2 border-dashed border-brand-mint/40 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 bg-white/40 hover:bg-white hover:border-brand-main hover:shadow-xl transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-full bg-brand-mint text-brand-main flex items-center justify-center group-hover:scale-110 transition-all shadow-md">
                <Plus size={24} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight opacity-40 group-hover:opacity-100">
                {t.editor.canvas.addNewSection}
              </span>
            </div>
          </div>

          {sections.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <p className="text-brand-charcoal/10 font-black uppercase tracking-widest text-sm">
                {t.editor.canvas.emptyState}
              </p>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddSectionModal 
          isOpen={showAddModal} 
          onClose={() => setShowAddModal(false)} 
          onAddSection={addSection} 
        />
      )}
    </main>
  );
};