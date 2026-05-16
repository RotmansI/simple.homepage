"use client";

import React, { useState, useEffect } from 'react';
import { 
  Plus, ListTree, Settings2, ChevronLeft, ChevronRight, GripVertical, Palette, Image as ImageIcon 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import MenuManagementModal from '@/components/editor/settings/controls/MenuManagementModal';
import { MenuLayoutGroup } from './settings/groups/MenuLayoutGroup';
import { MenuColorsGroup } from './settings/groups/MenuColorsGroup';
import { MenuItemDefaultImageGroup } from './settings/groups/MenuItemDefaultImageGroup';
import { ContentManagerGroup } from './settings/groups/ContentManagerGroup'; 
import { SettingsCollapse } from './settings/groups/SettingsCollapse';
import { ElementEditor } from './ElementEditor'; 
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

export default function MenuSectionSettings(props: any) {
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  
  const { 
    site, 
    updateSectionContent, 
    section, 
    setSite,
    selectedFlexElementId,
    setSelectedFlexElementId,
    updateFlexElement,
    selectAssetForField,
    selectedId,
    onBackToPage,
    pages,
    activePageKey
  } = props;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableMenus, setAvailableMenus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>([]);

  const content = section?.content || {};
  const currentElement = content.elements?.find((e: any) => e.id === selectedFlexElementId);

  useEffect(() => {
    const currentIds = section?.settings?.selectedMenuIds || section?.content?.settings?.selectedMenuIds || [];
    setLocalSelectedIds(currentIds);
  }, [section]);

  const fetchMenus = async () => {
    if (!site?.id) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('organization_menus')
        .select('id, name')
        .eq('site_id', site.id);
      
      if (error) console.error("❌ Supabase Error:", error.message);
      else setAvailableMenus(data || []);
    } catch (err) {
      console.error("❌ Unexpected Error during fetch:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const siteId = site?.id;
  useEffect(() => {
    fetchMenus();
  }, [siteId]);

  const handleSettingsUpdate = (updates: any) => {
    if (!section) return;
    const currentSettings = { ...(section.content?.settings || {}), ...(section.settings || {}) };
    const updatedSettings = { ...currentSettings, ...updates };

    updateSectionContent(section.id, {
      ...section.content,
      settings: updatedSettings
    });

    if (props.markChanged) props.markChanged('section', section.id);
  };

  const addMenuElement = (type: string) => {
    const primaryColor = site?.theme_settings?.primary_color || '#000000';
    const newEl: any = { 
      id: `${type}-${crypto.randomUUID()}`, 
      type, 
      text_align: 'center',
    };

    if (type === 'heading') { newEl.text = t.editor.sidebar.sections.defaults.title; newEl.font_size = 42; newEl.font_weight = '900'; }
    else if (type === 'paragraph') { newEl.text = t.editor.sidebar.sections.defaults.description; newEl.font_size = 18; }
    else if (type === 'button') { 
      newEl.text = t.editor.sidebar.sections.defaults.button; 
      newEl.bg_color = primaryColor; 
    }

    updateSectionContent(section.id, {
      ...content,
      elements: [...(content.elements || []), newEl]
    });
  };

  const toggleMenuSelection = (menuId: string) => {
    const newSelection = localSelectedIds.includes(menuId)
      ? localSelectedIds.filter((id: string) => id !== menuId)
      : [...localSelectedIds, menuId];
    setLocalSelectedIds(newSelection);
    handleSettingsUpdate({ selectedMenuIds: newSelection });
  };

  if (selectedFlexElementId && currentElement) {
    return (
      <div className="animate-in slide-in-from-left duration-300">
        <ElementEditor 
          site={site}
          el={currentElement}
          selectedId={section.id}
          updateFlexElement={updateFlexElement}
          selectAssetForField={selectAssetForField}
          onBack={() => setSelectedFlexElementId(null)}
          selectedSection={section}
        />
      </div>
    );
  }

  if (!section) return (
    <div className={`p-4 text-xs font-bold text-red-400 ${lang === 'he' ? 'text-right' : 'text-left'}`}>
      {t.editor.sidebar.sections.menu.errorMissing}
    </div>
  );

  const pageName = (pages && activePageKey && pages[activePageKey]?.name) || t.editor.sidebar.sections.page;
  const currentSettings = { ...(section.content?.settings || {}), ...(section.settings || {}) };

  return (
    <div 
      className={`space-y-6 animate-in fade-in duration-300 pb-20 ${
        lang === 'he' ? 'text-right slide-in-from-left-4' : 'text-left slide-in-from-right-4'
      }`} dir={lang === 'he' ? 'rtl' : 'ltr'}>
      
      {/* כפתור חזור לעמוד */}
      <button 
        onClick={onBackToPage}
        className="flex items-center gap-2 px-1 py-1 text-brand-indigo hover:text-brand-indigo/70 transition-all group mb-4"
      >
        {lang === 'he' ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        <span className="text-[10px] font-black uppercase tracking-tight">
          {t.editor.sidebar.sections.backToPage} <span className="underline decoration-brand-indigo/30 underline-offset-2">{pageName}</span>
        </span>
      </button>

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-black text-brand-dark flex items-center gap-2 text-sm uppercase tracking-tighter text-start">
          <ListTree size={18} className="text-brand-main" />
          {t.editor.sidebar.sections.menu.title}
        </h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-2 bg-brand-main/10 text-brand-main rounded-lg hover:bg-brand-main hover:text-white transition-all"
        >
          <ListTree size={18} />
        </button>
      </div>

      {/* Menu Selection List */}
      <div className="space-y-2 text-start">
        <p className="text-[10px] font-black text-brand-charcoal/30 uppercase tracking-widest px-1">
          {isLoading ? t.editor.sidebar.sections.menu.loading : t.editor.sidebar.sections.menu.displayLabel}
        </p>

        {availableMenus.length === 0 && !isLoading ? (
          <div className="p-4 border border-dashed border-brand-mint rounded-xl text-center">
            <p className="text-xs font-bold text-brand-charcoal/40">{t.editor.sidebar.sections.menu.noMenus}</p>
          </div>
        ) : (
          availableMenus.map((menu: any) => (
            <div 
              key={menu.id} 
              onClick={() => toggleMenuSelection(menu.id)}
              className="flex items-center justify-between p-4 bg-white border border-brand-lavender/40 rounded-2xl cursor-pointer hover:bg-brand-mint/5 transition-all group shadow-sm mb-2"
            >
              <span className="font-bold text-sm text-brand-dark group-hover:text-brand-main transition-colors">
                {menu.name}
              </span>
              <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                localSelectedIds.includes(menu.id) 
                ? 'bg-brand-main border-brand-main shadow-md shadow-brand-main/20' 
                : 'border-brand-lavender bg-white'
              }`}>
                {localSelectedIds.includes(menu.id) && <div className="w-2.5 h-2.5 bg-white rounded-sm" />}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="flex flex-col">
        {/* ניהול אלמנטים (הוספת כותרת/כפתור מעל התפריט) */}
        <SettingsCollapse id={`${selectedId}-elements`} label={t.editor.sidebar.sections.groups.elements} icon={<GripVertical size={14}/>}>
          <ContentManagerGroup 
            content={content}
            updateContent={(updates: any) => updateSectionContent(section.id, updates)}
            onAddElement={addMenuElement}
            onEditElement={(id: string) => setSelectedFlexElementId(id)}
            onRemoveElement={(id: string) => {
              const filtered = (content.elements || []).filter((e: any) => e.id !== id);
              updateSectionContent(section.id, { ...content, elements: filtered });
            }}
          />
        </SettingsCollapse>

        {/* Layout Group */}
        <SettingsCollapse id={`${selectedId}-layout`} label={t.editor.sidebar.sections.groups.dimensions} icon={<Settings2 size={14}/>}>
          <MenuLayoutGroup 
            settings={currentSettings} 
            onUpdate={handleSettingsUpdate}
            site={site}
          />
        </SettingsCollapse>

        {/* Colors Group */}
        <SettingsCollapse id={`${selectedId}-colors`} label={t.editor.sidebar.sections.groups.background} icon={<Palette size={14}/>}>
          <MenuColorsGroup 
            settings={currentSettings} 
            site={site}
            onUpdate={handleSettingsUpdate}
          />
        </SettingsCollapse>

        {/* Default Image Group */}
        <SettingsCollapse id={`${selectedId}-defaultImage`} label={t.editor.sidebar.sections.groups.galleryImages} icon={<ImageIcon size={14}/>}>
          <MenuItemDefaultImageGroup 
            settings={section.settings || {}} 
            onUpdate={handleSettingsUpdate}
            selectAssetForField={props.selectAssetForField}
            selectedId={props.selectedId}
            site={site}
          />
        </SettingsCollapse>
      </div>

      {/* Management Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full py-2 bg-brand-main text-white rounded-4xl font-black flex items-center justify-center gap-2 hover:bg-brand-accent transition-all shadow-lg shadow-brand-dark/10 mt-4"
      >
        <ListTree size={18} />
        {t.editor.sidebar.sections.menu.managerBtn}
      </button>

      <MenuManagementModal 
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); fetchMenus(); }}
        siteId={site?.id}
        site={site}
        setSite={setSite}
      />
    </div>
  );
}