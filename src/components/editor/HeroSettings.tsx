"use client";

import React from 'react';
import { 
  ChevronLeft, 
  Maximize2, 
  ImageIcon, 
  Layers, 
  GripVertical 
} from 'lucide-react';
import { ElementEditor } from './ElementEditor';
import { SettingsCollapse } from './settings/groups/SettingsCollapse';
import { SectionBasicGroup } from './settings/groups/SectionBasicGroup';
import { DimensionsGroup } from './settings/groups/DimensionsGroup';
import { HeroSliderGroup } from './settings/groups/HeroSliderGroup';
import { EdgeEffectsGroup } from './settings/groups/EdgeEffectsGroup';
import { ContentManagerGroup } from './settings/groups/ContentManagerGroup';

interface HeroSettingsProps {
  site: any; 
  selectedSection: any;
  selectedId: string;
  updateSectionContent: (id: string, content: any) => void;
  selectAssetForField: (sectionId: string | undefined, field: string, slideIndex?: number, callback?: (url: string) => void) => void; 
  selectedFlexElementId: string | null;
  setSelectedFlexElementId: (id: string | null) => void;
  updateFlexElement: (elId: string, updates: any) => void;
  PropertyInput?: any;
  onBackToPage: () => void;
  activePageKey: string;
  pages: any;
}

export const HeroSettings = ({
  site, 
  selectedSection, 
  selectedId, 
  updateSectionContent, 
  selectAssetForField,
  selectedFlexElementId, 
  setSelectedFlexElementId, 
  updateFlexElement,
  onBackToPage, 
  activePageKey, 
  pages
}: HeroSettingsProps) => {
  
  const content = selectedSection.content;
  const currentElement = content.elements?.find((e: any) => e.id === selectedFlexElementId);

  const primaryColor = site?.theme_settings?.primary_color || '#000000';

  const updateContent = (updates: any) => {
    updateSectionContent(selectedId, { ...content, ...updates });
  };

  const addHeroElement = (type: string) => {
    const newEl: any = { 
      id: `${type}-${crypto.randomUUID()}`, 
      type, 
      align: 'center',
      text_color: primaryColor, 
      font_size: type === 'heading' ? 48 : 18,
      font_weight: type === 'heading' ? '800' : '400',
      line_height: 1.2,
      letter_spacing: 0
    };

    if (type === 'heading') { 
        newEl.text = 'New Hero Title'; 
    }
    else if (type === 'paragraph') { 
        newEl.text = 'New description text...'; 
    }
    else if (type === 'button') { 
        newEl.text = 'Click Me'; 
        newEl.bg_color = primaryColor; 
    }

    const updatedElements = [...(content.elements || []), newEl];
    updateContent({ elements: updatedElements });
  };

  if (selectedFlexElementId && currentElement) {
    return (
      <ElementEditor 
        site={site}
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

  return (
    <div className="space-y-2 text-start animate-in fade-in duration-300 pb-20">
      <button 
        onClick={onBackToPage}
        className="flex items-center gap-2 px-1 py-1 text-brand-indigo hover:text-brand-indigo/70 transition-all group mb-4"
      >
        <ChevronLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-tight">
          Back to <span className="underline decoration-brand-indigo/30 underline-offset-2">{pageName}</span>
        </span>
      </button>

      <div className="mb-6">
        <SectionBasicGroup 
          content={selectedSection} 
          updateContent={(updates) => updateSectionContent(selectedId, updates)} 
          
        />
      </div>

      <div className="flex flex-col">
        <SettingsCollapse label="Dimensions" icon={<Maximize2 size={14}/>}>
          <DimensionsGroup content={content} updateContent={updateContent} site={site}/>
        </SettingsCollapse>

        <SettingsCollapse label="Background Slider" icon={<ImageIcon size={14}/>} defaultOpen={true}>
          <HeroSliderGroup 
            content={content}
            updateContent={updateContent}
            site={site} // הועבר לכאן כ-Prop תקין
            onOpenAssetManager={(callback) => {
              selectAssetForField(selectedId, 'hero_slide', undefined, callback);
            }}
          />
        </SettingsCollapse>

        <SettingsCollapse label="Edge Effects" icon={<Layers size={14}/>}>
          <EdgeEffectsGroup content={content} updateContent={updateContent} site={site}/>
        </SettingsCollapse>

        <SettingsCollapse label="Section Elements" icon={<GripVertical size={14}/>} defaultOpen={true}>
          <ContentManagerGroup 
            content={content}
            updateContent={updateContent}
            onAddElement={addHeroElement}
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