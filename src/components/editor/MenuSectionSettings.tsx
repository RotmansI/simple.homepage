"use client";

import React, { useState, useEffect } from 'react';
import { Plus, ListTree, Settings2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import MenuManagementModal from '@/components/editor/settings/controls/MenuManagementModal';
import { MenuLayoutGroup } from './settings/groups/MenuLayoutGroup';
import { MenuColorsGroup } from './settings/groups/MenuColorsGroup';
import { MenuItemDefaultImageGroup } from './settings/groups/MenuItemDefaultImageGroup';

export default function MenuSectionSettings(props: any) {
  const { site, updateSectionContent, section, setSite } = props; // הוספתי setSite ליתר ביטחון
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [availableMenus, setAvailableMenus] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [localSelectedIds, setLocalSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    const currentIds = section?.settings?.selectedMenuIds || section?.content?.settings?.selectedMenuIds || [];
    setLocalSelectedIds(currentIds);
  }, [section]);

  // פונקציית שליפת התפריטים - עכשיו עם פילטר לפי האתר הספציפי
  const fetchMenus = async () => {
    if (!site?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('organization_menus')
        .select('id, name')
        .eq('site_id', site.id); // פילטר קריטי כדי לעבור את ה-RLS ולראות רק מה שרלוונטי
      
      if (error) {
        console.error("❌ Supabase Error:", error.message);
      } else {
        setAvailableMenus(data || []);
      }
    } catch (err) {
      console.error("❌ Unexpected Error during fetch:", err);
    } finally {
      setIsLoading(false);
    }
  };

const siteId = site?.id; // חילוץ למשתנה מחוץ ל-Hook

useEffect(() => {
  fetchMenus();
}, [siteId]); // עכשיו המערך תמיד בגודל 1, פעם אחת עם undefined ופעם אחת עם ה-ID

  const handleSettingsUpdate = (updates: any) => {
    if (!section) return;

    const currentSettings = {
      ...(section.content?.settings || {}),
      ...(section.settings || {})
    };

    const updatedSettings = {
      ...currentSettings,
      ...updates
    };

    updateSectionContent(section.id, {
      ...section.content,
      settings: updatedSettings
    });

    if (props.markChanged) {
      props.markChanged('section', section.id);
    }
  };

  const toggleMenuSelection = (menuId: string) => {
    const newSelection = localSelectedIds.includes(menuId)
      ? localSelectedIds.filter((id: string) => id !== menuId)
      : [...localSelectedIds, menuId];
    
    setLocalSelectedIds(newSelection);
    handleSettingsUpdate({ selectedMenuIds: newSelection });
  };

  if (!section) return <div className="p-4 text-xs font-bold text-red-400 text-start">Settings missing section ref</div>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-black text-brand-dark flex items-center gap-2 text-sm uppercase tracking-tighter text-start">
          <ListTree size={18} className="text-brand-main" />
          Menu Selection
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
          {isLoading ? "Loading menus..." : "Display in this section:"}
        </p>

        {availableMenus.length === 0 && !isLoading ? (
          <div className="p-4 border border-dashed border-brand-mint rounded-xl text-center">
            <p className="text-xs font-bold text-brand-charcoal/40">No menus found for this site</p>
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
                {localSelectedIds.includes(menu.id) && (
                  <div className="w-2.5 h-2.5 bg-white rounded-sm" />
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <hr className="border-brand-lavender/50 my-6" />

      {/* Layout Group */}
      <MenuLayoutGroup 
        settings={{
          ...(section.content?.settings || {}),
          ...(section.settings || {})
        }} 
        onUpdate={handleSettingsUpdate}
        site={site}
      />

      <hr className="border-brand-lavender/50 my-6" />

      {/* Colors Group */}
      <MenuColorsGroup 
        settings={{
          ...(section.content?.settings || {}),
          ...(section.settings || {})
        }} 
        site={site}
        onUpdate={handleSettingsUpdate}
      />

      <hr className="border-brand-lavender/50 my-6" />

      <MenuItemDefaultImageGroup 
        settings={section.settings || {}} 
        onUpdate={handleSettingsUpdate}
        selectAssetForField={props.selectAssetForField}
        selectedId={props.selectedId}
        site={site}
      />

      {/* Management Buttons */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full py-2 bg-brand-main text-white rounded-4xl font-black flex items-center justify-center gap-2 hover:bg-brand-accent transition-all shadow-lg shadow-brand-dark/10 mt-4"
      >
        <ListTree size={18} />
        Menu Manager Tool
      </button>

      {/* עדכון המודאל עם ה-Props החדשים */}
      <MenuManagementModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchMenus(); 
        }}
        siteId={site?.id}
        site={site}
        setSite={setSite}
      />
    </div>
  );
}