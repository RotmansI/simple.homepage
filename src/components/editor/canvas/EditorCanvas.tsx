"use client";

import React from 'react';
import { X, Box, Layout, Minus, ImageIcon, UtensilsCrossed } from 'lucide-react';

// Sections Imports - מעודכן ל-Default Exports
import HeroSection from '../sections/HeroSection';
import FlexSection from '../sections/FlexSection';
import GallerySection from '../sections/GallerySection';
import MenuSection from '../sections/MenuSection';
import TextSection from '../sections/TextSection';
import DividerSection from '../sections/DividerSection';
import AddSectionModal from '@/components/editor/settings/controls/AddSectionModal';

// Focus Mode Component
import { NavbarPreviewCanvas } from './NavbarPreviewCanvas';

export const EditorCanvas = (props: any) => {
  const { 
    isSidebarsCollapsed,
    activePanel, 
    previewMode, 
    activePageData, 
    sections, 
    selectedId, 
    setSelectedId, 
    updateSectionContent,
    showAddModal,
    setShowAddModal,
    addSection,
    site
  } = props;

  const WidgetButton = ({ onClick, icon, label }: any) => (
    <button 
      onClick={onClick}
      className="p-6 bg-brand-grey/50 rounded-[2rem] border border-brand-lavender/30 flex flex-col items-center gap-3 hover:bg-brand-main hover:text-white hover:scale-105 transition-all group"
    >
      <div className="text-brand-main group-hover:text-white transition-colors">{icon}</div>
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );

  // Switcher ל-Focus Mode
  if (activePanel === 'navbar') {
    return <NavbarPreviewCanvas site={site} previewMode={previewMode} />;
  }

return (
    <main 
      className={`
        flex-1 bg-brand-grey overflow-y-auto custom-scrollbar flex justify-center transition-all duration-500
        ${isSidebarsCollapsed ? 'p-3' : 'p-3'} 
        ${activePanel === 'navbar' ? 'pt-0' : 'pt-3'}
      `}
    >
      <div 
        className={`
          shadow-2xl transition-all canvas-preview-area duration-500 relative flex flex-col h-fit
          ${previewMode === 'desktop' 
            ? (isSidebarsCollapsed ? 'w-full max-w-[100%]' : 'w-full ') 
            : 'w-[375px]'} 
          rounded-t-[3rem] border border-brand-mint/30 mb-32 overflow-hidden
        `}
        style={{
          backgroundColor: activePageData.bg_color || '#ffffff',
          backgroundImage: `
            ${activePageData.bg_filter_color 
              ? `linear-gradient(
                  ${activePageData.bg_filter_color}${Math.round((activePageData.bg_filter_opacity ?? 50) * 2.55).toString(16).padStart(2, '0')}, 
                  ${activePageData.bg_filter_color}${Math.round((activePageData.bg_filter_opacity ?? 50) * 2.55).toString(16).padStart(2, '0')}
                )` 
              : 'linear-gradient(transparent, transparent)'},
            ${activePageData.bg_image ? `url(${activePageData.bg_image})` : 'none'}
          `,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'scroll',
        }}
      >
        {activePageData.bg_image && (
          <div 
            className="absolute inset-0 pointer-events-none transition-all duration-500"
            style={{ 
              backgroundColor: activePageData.bg_color || '#ffffff',
              opacity: 1 - ((activePageData.bg_image_opacity ?? 100) / 100),
              zIndex: 0
            }}
          />
        )}

        <div className="flex-1 flex flex-col min-h-screen relative z-10">
          {sections.map((s: any) => (
            <div 
              key={s.id} 
              onClick={() => setSelectedId(s.id)} 
              className={`relative transition-all border-x-4 ${selectedId === s.id ? 'border-brand-main bg-brand-mint/5 z-10' : 'border-transparent hover:border-brand-mint/30'}`}
            >
              {s.type === 'hero' && <HeroSection section={s} isSelected={selectedId === s.id} updateContent={(updates: any) => updateSectionContent(s.id, updates)} />}
              {s.type === 'flex' && <FlexSection section={s} updateContent={(updates: any) => updateSectionContent(s.id, updates)} />}
              {s.type === 'gallery' && <GallerySection section={s} isEditor={true} updateContent={(updates: any) => updateSectionContent(s.id, updates)} />}
              {s.type === 'menu' && <MenuSection section={s} />}
              {s.type === 'text' && <TextSection content={s.content} />}
              {s.type === 'divider' && <DividerSection content={s.content} />}
            </div>
          ))}

          {sections.length === 0 && (
            <div className="flex-1 flex items-center justify-center py-40 border-2 border-dashed border-brand-mint/20 m-8 rounded-[2rem]">
              <p className="text-brand-charcoal/20 font-black uppercase tracking-widest text-xs">Your canvas is empty</p>
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