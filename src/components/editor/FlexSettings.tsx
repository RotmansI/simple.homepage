"use client";

import React from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Maximize2, 
  Palette, 
  Layers, 
  GripVertical 
} from 'lucide-react';
import { ElementEditor } from './ElementEditor';

// ייבוא הקבוצות המעודכנות
import { SectionBasicGroup } from './settings/groups/SectionBasicGroup';
import { DimensionsGroup } from './settings/groups/DimensionsGroup';
import { SectionBackgroundGroup } from './settings/groups/SectionBackgroundGroup';
import { EdgeEffectsGroup } from './settings/groups/EdgeEffectsGroup';
import { ContentManagerGroup } from './settings/groups/ContentManagerGroup'; 
import { SettingsCollapse } from './settings/groups/SettingsCollapse';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

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
  site, 
  selectedSection, 
  selectedId, 
  updateSectionContent, 
  addFlexElement,
  updateFlexElement, 
  selectAssetForField, 
  selectedFlexElementId,
  setSelectedFlexElementId, 
  onBackToPage, 
  activePageKey, 
  pages
}: FlexSettingsProps) => {

  const { lang } = useLanguage();
  const t = translations[lang as Language];

  const content = selectedSection.content;
  const currentElement = content.elements?.find((e: any) => e.id === selectedFlexElementId);

  // פונקציית עזר לעדכון תוכן הסקשן
  const updateContent = (updates: any) => {
    updateSectionContent(selectedId, { ...content, ...updates });
  };

  /**
   * השרשרת: מצב עריכת אלמנט (Element Focus)
   * אם נבחר אלמנט ספציפי, עוברים לעורך האלמנטים
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

  const pageName = pages[activePageKey]?.name || t.editor.sidebar.sections.page;
  const allSectionsContent = site?.draft_data?.content || site?.content;

  return (
    <div className="space-y-2 text-start animate-in fade-in duration-300 pb-20" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      
      {/* כפתור חזרה לעמוד הראשי */}
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

      {/* 1. הגדרות בסיסיות (זהות הסקשן) */}
      <div className="mb-6">
        <SectionBasicGroup 
          content={selectedSection} 
          updateContent={(updates) => updateSectionContent(selectedId, updates)} 
        />
      </div>

      <div className="flex flex-col">
        {/* 2. גובה, רוחב ומימדים */}
        <SettingsCollapse 
          id={`${selectedId}-dimensions`}
          label={t.editor.sidebar.sections.groups.dimensions} 
          icon={<Maximize2 size={14}/>}
        >
          <DimensionsGroup 
            content={content} 
            updateContent={updateContent} 
            site={site} 
          />
        </SettingsCollapse>

        {/* 3. רקע (צבע/תמונה/אוברליי) */}
        <SettingsCollapse 
          id={`${selectedId}-background`}
          label={t.editor.sidebar.sections.groups.background} 
          icon={<Palette size={14}/>}
        >
          <SectionBackgroundGroup 
            content={content}
            updateContent={updateContent}
            site={site}
            allSectionsContent={allSectionsContent}
            onOpenAssetManager={(callback) => selectAssetForField(selectedId, 'bg_image', undefined, callback)}
          />
        </SettingsCollapse>

        {/* 4. אפקטי קצוות ופיידים */}
        <SettingsCollapse 
          id={`${selectedId}-effects`}
          label={t.editor.sidebar.sections.groups.effects} 
          icon={<Layers size={14}/>}
        >
          <EdgeEffectsGroup 
            content={content}
            updateContent={updateContent}
            site={site}
            allSectionsContent={allSectionsContent}
          />
        </SettingsCollapse>

        {/* 5. ניהול אלמנטים (Content Manager) */}
        <SettingsCollapse 
          id={`${selectedId}-elements`}
          label={t.editor.sidebar.sections.groups.elements} 
          icon={<GripVertical size={14}/>}
        >
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