"use client";

import React, { useState, useEffect } from 'react';
import { Layers, Navigation, Palette, LayoutGrid, ChevronRight, Wrench, HardDrive, ChevronLeft } from 'lucide-react';
import { SidebarTab } from './EditorUI';

// Panels
import { PagesPanel } from './panels/PagesPanel';
import { NavbarPanel } from './panels/NavbarPanel';
import { SettingsPanel } from './panels/SettingsPanel';
import { AssetsPanel } from './panels/AssetsPanel';
import { ToolsPanel } from './panels/ToolsPanel';

// Modals - הנתיבים המעודכנים שלך
import { AssetManagerModal } from './settings/controls/AssetManager/AssetManagerModal';
import MenuManagementModal from './settings/controls/MenuManagementModal';

export default function StructureSidebar(props: any) {
  const { 
    isCollapsed,
    toggleSidebar,
    activePanel, 
    setActivePanel, 
    site,
    setSite,
    assets
  } = props;

  // States לניהול מודאלים
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState(false);
  const [isMenuManagerOpen, setIsMenuManagerOpen] = useState(false);
  
  // ניהול חזרה מפאנל בחירת נכסים
  const [previousPanel, setPreviousPanel] = useState('pages');

  // מעקב אחרי הפאנל הקודם כדי שנדע לאן לחזור כשסוגרים את ה-Assets Selection
  useEffect(() => {
    if (activePanel !== 'assets') {
      setPreviousPanel(activePanel);
    }
  }, [activePanel]);

return (
    <div className="relative flex h-full">
      {/* 1. ה-Aside המקורי עם לוגיקת הקיפול */}
      <aside 
        className={`
          bg-white border-e border-brand-mint flex flex-col z-40 shadow-sm text-start overflow-hidden relative
          transition-all duration-500 ease-in-out shrink-0
          ${isCollapsed ? 'w-0 border-e-0 opacity-0' : 'w-72 opacity-100'}
        `}
      >
        {/* 2. Div פנימי ברוחב קבוע (w-72) למניעת קפיצות UI */}
        <div className="w-72 h-full flex flex-col">
          
          {/* Tabs Header Area */}
          <div className="border-b border-brand-mint bg-brand-grey/30 relative overflow-hidden min-h-[50px] shrink-0">
            
            {/* Standard Tabs */}
            <div className={`grid grid-cols-4 p-1 transition-all duration-300 ease-in-out ${activePanel === 'assets' ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
              <SidebarTab active={activePanel === 'pages'} onClick={() => setActivePanel('pages')} icon={<Layers size={18} />} label="Pages" />
              <SidebarTab active={activePanel === 'navbar'} onClick={() => setActivePanel('navbar')} icon={<Navigation size={18} />} label="Nav" />
              <SidebarTab active={activePanel === 'settings'} onClick={() => setActivePanel('settings')} icon={<Palette size={18} />} label="Settings" />
              <SidebarTab active={activePanel === 'tools'} onClick={() => setActivePanel('tools')} icon={<Wrench size={18} />} label="Tools" />
            </div>

            {/* Assets Selection Tool Header */}
            <div 
              className={`absolute inset-0 bg-brand-main flex items-center justify-between px-4 transition-all duration-300 ease-in-out ${activePanel === 'assets' ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
            >
              <div className="flex items-center gap-2 text-white">
                <LayoutGrid size={16} className="animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest">Assets Selection Tool</span>
              </div>
              
              <button 
                onClick={() => setActivePanel(previousPanel)}
                className="p-1.5 bg-white/20 hover:bg-white/40 text-white rounded-lg transition-all active:scale-95"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
          
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activePanel === 'pages' && <PagesPanel {...props} />}
            {activePanel === 'navbar' && <NavbarPanel {...props} />}
            {activePanel === 'settings' && <SettingsPanel {...props} />}
            
            {activePanel === 'tools' && (
              <ToolsPanel 
                openAssetManager={() => setIsAssetManagerOpen(true)}
                openMenuManager={() => setIsMenuManagerOpen(true)}
                {...props}
              />
            )}

            {activePanel === 'assets' && (
              <AssetsPanel 
                {...props} 
                openAssetManager={() => setIsAssetManagerOpen(true)} 
              />
            )}
          </div>

          {/* Modals Management */}
          {isAssetManagerOpen && (
            <AssetManagerModal 
              isOpen={isAssetManagerOpen}
              onClose={() => setIsAssetManagerOpen(false)}
              siteId={site?.id}
              allSections={site?.draft_data?.sections || []}
            />
          )}

          {isMenuManagerOpen && (
            <MenuManagementModal 
              isOpen={isMenuManagerOpen}
              onClose={() => setIsMenuManagerOpen(false)}
              siteId={site?.id}
              site={site}
              setSite={setSite}
            />
          )}
        </div>
      </aside>

      {/* 3. כפתור הרחבה צף (יופיע רק כשהסיידבר מקופל) */}
      <div className="absolute top-1/2 -right-4 -translate-y-1/2 z-50">
    <button 
      onClick={toggleSidebar}
      className="p-1 bg-brand-main hover:bg-brand-accent text-white rounded-2xl shadow-xl transition-all active:scale-90 group"
    >
      {/* אם מקופל - חץ ימינה (לפתוח), אם פתוח - חץ שמאלה (לסגור) */}
      {isCollapsed ? (
        <ChevronRight size={20} className="group-hover:scale-125 transition-transform" />
      ) : (
        <ChevronLeft size={20} className="group-hover:scale-125 transition-transform" />
      )}
    </button>
  </div>
    </div>
  );
}