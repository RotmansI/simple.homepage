"use client";

import React, { useState } from 'react';
import { Clock, Palette, Settings, ChevronDown, Type, Languages, Info } from 'lucide-react';
import { SmartColorPicker } from '../settings/controls/SmartColorPicker';
import { GoogleFontPicker } from '../settings/controls/GoogleFontPicker';
import { AssetManagerModal } from '../settings/controls/AssetManager/AssetManagerModal';
import MenuManagementModal from '../settings/controls/MenuManagementModal';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

export const SettingsPanel = ({ site, updateNavbar, updateTheme, allSectionsContent, onClose }: any) => {
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  const [isAssetManagerOpen, setIsAssetManagerOpen] = useState(false);
  const [isMenuManagerOpen, setIsMenuManagerOpen] = useState(false);
  
  const navData = site?.draft_data?.navbar || {};
  const themeSettings = site?.theme_settings || {};
  
  // קיצור דרך לנתיב ההגדרות בפאנל
  const panelT = t.editor.structure.settingsPanel;
  const isRTL = lang === 'he';

  return (
    <div className="p-4 space-y-4 text-start animate-in fade-in duration-300" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* 0. HEADER TITLE */}
      <div className="px-1 py-2 mb-2">
        <h1 className="text-[14px] font-black uppercase text-brand-midnight tracking-tighter flex items-center gap-2">
          <Settings size={18} className="text-brand-main" />
          {panelT.sections.title}
        </h1>
        <p className="text-[10px] text-brand-slate font-medium opacity-60 uppercase tracking-widest mt-1">
          {panelT.sections.subtitle}
        </p>
      </div>

      {/* 1. Site Language Settings */}
      <details className="group border border-brand-lavender/30 rounded-xl overflow-hidden shadow-sm">
        <summary className="list-none p-3 bg-brand-pearl/20 hover:bg-brand-pearl/50 cursor-pointer flex items-center justify-between font-black uppercase text-[10px]">
          <span className="flex items-center gap-2 text-brand-charcoal">
            <Languages size={14} className="text-brand-main"/> 
            {panelT.sections.sitelang}
          </span>
          <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
        </summary>
        <div className="p-4 space-y-4 bg-white">
          {/* הסבר על השפעת השפה */}
          <div className="flex gap-2 p-3 rounded-lg bg-brand-indigo/5 border border-brand-indigo/10">
            <Info size={14} className="text-brand-indigo shrink-0 mt-0.5" />
            <p className="text-[9px] leading-relaxed text-brand-midnight/70 font-medium">
              {panelT.siteLanguage.description}
            </p>
          </div>

          <div className="space-y-1.5 text-start">
            <label className="text-[9px] font-bold opacity-40 uppercase px-1">
              {panelT.siteLanguage.label}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'en', label: panelT.siteLanguage.languages.en },
                { id: 'he', label: panelT.siteLanguage.languages.he }
              ].map((l) => (
                <button
                  key={l.id}
                  onClick={() => updateTheme('site_language', l.id)}
                  className={`py-2 px-3 rounded-xl border text-[10px] font-black transition-all ${
                    (themeSettings.site_language || 'en') === l.id
                      ? 'bg-brand-indigo text-white border-brand-indigo shadow-md'
                      : 'bg-brand-pearl border-brand-lavender text-brand-midnight/40 hover:border-brand-indigo/30'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </details>

      {/* 2. Typography Settings */}
      <details className="group border border-brand-lavender/30 rounded-xl overflow-hidden shadow-sm">
        <summary className="list-none p-3 bg-brand-pearl/20 hover:bg-brand-pearl/50 cursor-pointer flex items-center justify-between font-black uppercase text-[10px]">
          <span className="flex items-center gap-2 text-brand-charcoal">
            <Type size={14} className="text-brand-main"/> 
            {panelT.sections.typography}
          </span>
          <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
        </summary>
        <div className="p-4 space-y-6 bg-white">
          <GoogleFontPicker 
            label={panelT.typography.primaryLabel}
            value={themeSettings.primary_font || 'Assistant'}
            onChange={(font: string) => updateTheme('primary_font', font)}
          />
          
          <div className="h-px bg-brand-lavender/30" />

          <GoogleFontPicker 
            label={panelT.typography.secondaryLabel}
            value={themeSettings.secondary_font || 'Heebo'}
            onChange={(font: string) => updateTheme('secondary_font', font)}
          />
        </div>
      </details>

      {/* 3. Branding Colors */}
      <details className="group border border-brand-lavender/30 rounded-xl overflow-hidden shadow-sm">
        <summary className="list-none p-3 bg-brand-pearl/20 hover:bg-brand-pearl/50 cursor-pointer flex items-center justify-between font-black uppercase text-[10px]">
          <span className="flex items-center gap-2 text-brand-charcoal">
            <Palette size={14} className="text-brand-main"/> 
            {panelT.sections.branding}
          </span>
          <ChevronDown size={14} className="group-open:rotate-180 transition-transform"/>
        </summary>
        <div className="p-4 space-y-4 bg-white">
          {['primary_color', 'secondary_color', 'accent_color', 'neutral_color'].map((key) => (
            <SmartColorPicker 
              key={key}
              label={panelT.branding[key as keyof typeof panelT.branding]}
              value={themeSettings[key] || '#ffffff'}
              onChange={(color) => updateTheme(key, color)}
              site={site}
              allSectionsContent={allSectionsContent}
            />
          ))}
        </div>
      </details>

      {/* 4. Opening Hours */}
      <details className="group border border-brand-lavender/30 rounded-xl overflow-hidden shadow-sm">
        <summary className="list-none p-3 bg-brand-pearl/20 hover:bg-brand-pearl/50 cursor-pointer flex items-center justify-between font-black uppercase text-[10px]">
          <span className="flex items-center gap-2 text-brand-charcoal">
            <Clock size={14} className="text-brand-main"/> 
            {panelT.sections.openingHours}
          </span>
          <ChevronDown size={14} className="group-open:rotate-180 transition-transform"/>
        </summary>
        <div className="p-3 space-y-2 bg-white">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
            <div key={day} className="flex items-center gap-2">
              <span className="text-[8px] font-bold w-14 opacity-50 uppercase">
                {panelT.days[day as keyof typeof panelT.days]}
              </span>
              <input 
                className={`flex-1 bg-brand-grey/50 p-2 rounded-lg text-[9px] font-mono outline-none border border-transparent focus:border-brand-main transition-all ${isRTL ? 'text-right' : 'text-left'}`} 
                placeholder={panelT.hoursPlaceholder} 
                value={navData.hours?.[day] || ''} 
                onChange={(e) => {
                  const h = { ...(navData.hours || {}) }; 
                  h[day] = e.target.value; 
                  updateNavbar({ hours: h });
                }} 
              />
            </div>
          ))}
        </div>
      </details>

      {/* Modals */}
      <AssetManagerModal 
        isOpen={isAssetManagerOpen}
        onClose={() => setIsAssetManagerOpen(false)}
        siteId={site?.id}
        onSelect={(url: string) => setIsAssetManagerOpen(false)}
        site={site}
      />

      <MenuManagementModal 
        isOpen={isMenuManagerOpen}
        onClose={() => setIsMenuManagerOpen(false)} 
      />
    </div>
  );
};