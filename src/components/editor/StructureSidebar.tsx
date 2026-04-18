"use client";

import React from 'react';
import { Layers, Navigation, Palette, HardDrive } from 'lucide-react';
import { SidebarTab } from './EditorUI';

// Imports of newly split panels
import { PagesPanel } from './panels/PagesPanel';
import { NavbarPanel } from './panels/NavbarPanel';
import { SettingsPanel } from './panels/SettingsPanel';
import { AssetsPanel } from './panels/AssetsPanel';

export default function StructureSidebar(props: any) {
  const { 
    activePanel, 
    setActivePanel, 
    selectedFlexElementId, 
    setSelectedFlexElementId 
  } = props;

  return (
    <aside className="w-72 bg-white border-e border-brand-mint flex flex-col z-40 shadow-sm text-start overflow-hidden">
      {/* Tabs Header */}
      <div className="grid grid-cols-4 border-b border-brand-mint p-1 bg-brand-grey/30">
        <SidebarTab active={activePanel === 'pages'} onClick={() => setActivePanel('pages')} icon={<Layers size={18} />} label="Pages" />
        <SidebarTab active={activePanel === 'navbar'} onClick={() => setActivePanel('navbar')} icon={<Navigation size={18} />} label="Nav" />
        <SidebarTab active={activePanel === 'settings'} onClick={() => setActivePanel('settings')} icon={<Palette size={18} />} label="Settings" />
        <SidebarTab active={activePanel === 'assets'} onClick={() => setActivePanel('assets')} icon={<HardDrive size={18} />} label="Assets" />
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {activePanel === 'pages' && <PagesPanel {...props} />}
        {activePanel === 'navbar' && <NavbarPanel {...props} />}
        {activePanel === 'settings' && <SettingsPanel {...props} />}
        {activePanel === 'assets' && <AssetsPanel {...props} />}
      </div>
    </aside>
  );
}