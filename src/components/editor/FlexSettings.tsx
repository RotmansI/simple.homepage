"use client";

import React from 'react';
import { ChevronLeft, Maximize2, Palette, Layers, GripVertical } from 'lucide-react';
import { ElementEditor } from './ElementEditor';

// ייבוא הקבוצות המעודכנות
import { SectionBasicGroup } from './settings/groups/SectionBasicGroup';
import { DimensionsGroup } from './settings/groups/DimensionsGroup';
import { SectionBackgroundGroup } from './settings/groups/SectionBackgroundGroup';
import { EdgeEffectsGroup } from './settings/groups/EdgeEffectsGroup';
import { ContentManagerGroup } from './settings/groups/ContentManagerGroup'; 
import { SettingsCollapse } from './settings/groups/SettingsCollapse';

interface FlexSettingsProps {
  site: any;
  selectedSection: any;
  selectedId: string;
  updateSectionContent: (id: string, content: any) => void;
  addFlexElement: (type: string) => void;
  updateFlexElement: (elId: string, updates: any) => void;
  selectAssetForField: (id: string | undefined, field: string, slideIndex?: number, callback?: (url: string) => void) => void;
  selectedFlexElementId: string | null;
  setSelectedFlexElementId: (id: string | null) => void;
  PropertyInput?: any;
  onBackToPage: () => void;
  activePageKey: string;
  pages: any;
}

export const FlexSettings = ({
  site, selectedSection, selectedId, updateSectionContent, addFlexElement,
  updateFlexElement, selectAssetForField, selectedFlexElementId,
  setSelectedFlexElementId, onBackToPage, activePageKey, pages
}: FlexSettingsProps) => {

  const content = selectedSection.content;
  const currentElement = content.elements?.find((e: any) => e.id === selectedFlexElementId);

  const updateContent = (updates: any) => {
    updateSectionContent(selectedId, { ...content, ...updates });
  };

  if (selectedFlexElementId && currentElement) {
    return (
      <ElementEditor 
        site={site} // וודא שזה עובר לאלמנט אדיטור עבור צבעי הברנד באלמנטים
        el={currentElement}
        selectedId={selectedId}
        updateFlexElement={updateFlexElement}
        selectAssetForField={selectAssetForField}
        onBack={() => setSelectedFlexElementId(null)}
        selectedSection={selectedSection}
      />
    );
  }

  const pageName = pages[activePageKey]?.name || "Page";
  const allSectionsContent = site?.draft_data?.content || site?.content;

  return (
    <div className="space-y-2 text-start animate-in fade-in duration-300 pb-20">
      
      {/* כפתור חזרה */}
      <button 
        onClick={onBackToPage}
        className="flex items-center gap-2 px-1 py-1 text-brand-indigo hover:text-brand-indigo/70 transition-all group mb-4"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-tight">
          Back to <span className="underline decoration-brand-indigo/30 underline-offset-2">{pageName}</span>
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
        {/* 2. גובה ומימדים */}
        <SettingsCollapse label="Dimensions" icon={<Maximize2 size={14}/>}>
          <DimensionsGroup 
            content={content} 
            updateContent={updateContent} 
            site={site} // הזרקת ה-site עבור צבעים במידה ויש פיקר במימדים
          />
        </SettingsCollapse>

        {/* 3. רקע (צבע/תמונה/שקיפות) */}
        <SettingsCollapse label="Background & Styles" icon={<Palette size={14}/>} defaultOpen={true}>
          <SectionBackgroundGroup 
            content={content}
            updateContent={updateContent}
            site={site} // קריטי עבור צבעי הברנד בפיקר הרקע
            allSectionsContent={allSectionsContent}
            onOpenAssetManager={(callback) => selectAssetForField(selectedId, 'bg_image', undefined, callback)}
          />
        </SettingsCollapse>

        {/* 4. אפקטי קצוות */}
        <SettingsCollapse label="Edge Effects" icon={<Layers size={14}/>}>
          <EdgeEffectsGroup 
            content={content}
            updateContent={updateContent}
            site={site} // קריטי עבור צבעי ה-Fade (Top/Bottom)
            allSectionsContent={allSectionsContent}
          />
        </SettingsCollapse>

        {/* 5. ניהול והוספת אלמנטים */}
        <SettingsCollapse label="Section Elements" icon={<GripVertical size={14}/>} defaultOpen={true}>
          <ContentManagerGroup 
            content={content}
            updateContent={updateContent}
            onAddElement={addFlexElement}
            onEditElement={(id) => setSelectedFlexElementId(id)}
            onRemoveElement={(id) => {
              const filtered = content.elements.filter((e: any) => e.id !== id);
              updateContent({ elements: filtered });
            }}
          />
        </SettingsCollapse>
      </div>
    </div>
  );
};