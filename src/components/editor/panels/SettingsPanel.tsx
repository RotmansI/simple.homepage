"use client";

import React from 'react';
import { Clock, Palette, ChevronRight, Type } from 'lucide-react';
import { SmartColorPicker } from '../settings/controls/SmartColorPicker';
import { GoogleFontPicker } from '../settings/controls/GoogleFontPicker';

export const SettingsPanel = ({ site, updateNavbar, updateTheme, allSectionsContent }: any) => {
  const navData = site?.draft_data?.navbar || {};
  const themeSettings = site?.theme_settings || {};

  return (
    <div className="p-4 space-y-4 text-start animate-in fade-in duration-300">
      
      {/* 1. Typography Settings - הסקציה החדשה */}
      <details className="group border border-brand-lavender/30 rounded-xl overflow-hidden shadow-sm">
        <summary className="list-none p-3 bg-brand-grey/30 cursor-pointer flex items-center justify-between font-black uppercase text-[10px]">
          <span className="flex items-center gap-2">
            <Type size={14} className="text-brand-main"/> Typography
          </span>
          <ChevronRight size={14} className="group-open:rotate-90 transition-transform"/>
        </summary>
        <div className="p-4 space-y-6 bg-white">
<GoogleFontPicker 
            label="Primary Font (Headings)"
            value={themeSettings.primary_font || 'Assistant'}
            // הוספת הטיפוס string כאן פותרת את השגיאה
            onChange={(font: string) => updateTheme('primary_font', font)}
          />
          
          <div className="h-px bg-brand-lavender/30" />

          <GoogleFontPicker 
            label="Secondary Font (Body)"
            value={themeSettings.secondary_font || 'Heebo'}
            // גם כאן אותו דבר
            onChange={(font: string) => updateTheme('secondary_font', font)}
          />
        </div>
      </details>

      {/* 2. Branding Colors - שדרוג ל-SmartColorPicker */}
      <details className="group border border-brand-lavender/30 rounded-xl overflow-hidden shadow-sm">
        <summary className="list-none p-3 bg-brand-grey/30 cursor-pointer flex items-center justify-between font-black uppercase text-[10px]">
          <span className="flex items-center gap-2">
            <Palette size={14} className="text-brand-main"/> Branding
          </span>
          <ChevronRight size={14} className="group-open:rotate-90 transition-transform"/>
        </summary>
        <div className="p-4 space-y-4 bg-white">
          {['primary_color', 'secondary_color', 'accent_color', 'neutral_color'].map((key) => (
            <SmartColorPicker 
              key={key}
              label={key.replace('_', ' ')}
              value={themeSettings[key] || '#ffffff'}
              onChange={(color) => updateTheme(key, color)}
              site={site}
              allSectionsContent={allSectionsContent}
            />
          ))}
        </div>
      </details>

      {/* 3. Opening Hours - נשאר כפי שהיה עם שיפור עיצובי קל */}
      <details className="group border border-brand-lavender/30 rounded-xl overflow-hidden shadow-sm">
        <summary className="list-none p-3 bg-brand-grey/30 cursor-pointer flex items-center justify-between font-black uppercase text-[10px]">
          <span className="flex items-center gap-2">
            <Clock size={14} className="text-brand-main"/> Opening Hours
          </span>
          <ChevronRight size={14} className="group-open:rotate-90 transition-transform"/>
        </summary>
        <div className="p-3 space-y-2 bg-white">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
            <div key={day} className="flex items-center gap-2">
              <span className="text-[8px] font-bold w-14 opacity-50 uppercase">{day}</span>
              <input 
                className="flex-1 bg-brand-grey/50 p-2 rounded-lg text-[9px] font-mono outline-none border border-transparent focus:border-brand-main transition-all" 
                placeholder="12:00-23:00" 
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
    </div>
  );
};