"use client";

import React from 'react';
import { Clock, Palette, ChevronRight } from 'lucide-react';

export const SettingsPanel = ({ site, updateNavbar, updateTheme }: any) => {
  const navData = site?.draft_data?.navbar || {};

  return (
    <div className="p-4 space-y-4 text-start animate-in fade-in duration-300">
      {/* Opening Hours */}
      <details open className="group border border-brand-mint/30 rounded-xl overflow-hidden shadow-sm">
        <summary className="list-none p-3 bg-brand-grey/30 cursor-pointer flex items-center justify-between font-black uppercase text-[10px]">
          <span className="flex items-center gap-2"><Clock size={14} className="text-brand-main"/> Opening Hours</span>
          <ChevronRight size={14} className="group-open:rotate-90 transition-transform"/>
        </summary>
        <div className="p-3 space-y-2 bg-white">
          {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
            <div key={day} className="flex items-center gap-2">
              <span className="text-[8px] font-bold w-14 opacity-50 uppercase">{day}</span>
              <input className="flex-1 bg-brand-grey p-1.5 rounded text-[9px] font-mono outline-none border border-transparent focus:border-brand-mint" placeholder="12:00-23:00" value={navData.hours?.[day] || ''} onChange={(e) => {
                const h = { ...(navData.hours || {}) }; h[day] = e.target.value; updateNavbar({ hours: h });
              }} />
            </div>
          ))}
        </div>
      </details>

      {/* Branding Colors */}
      <details className="group border border-brand-mint/30 rounded-xl overflow-hidden shadow-sm">
        <summary className="list-none p-3 bg-brand-grey/30 cursor-pointer flex items-center justify-between font-black uppercase text-[10px]">
          <span className="flex items-center gap-2"><Palette size={14} className="text-brand-main"/> Branding</span>
          <ChevronRight size={14} className="group-open:rotate-90 transition-transform"/>
        </summary>
        <div className="p-4 space-y-4 bg-white">
          {['primary_color', 'secondary_color', 'accent_color', 'neutral_color'].map((key) => (
            <div key={key} className="space-y-1">
              <span className="text-[9px] font-bold text-brand-charcoal/40 uppercase">{key.replace('_', ' ')}</span>
              <div className="flex gap-2 items-center bg-brand-grey p-1.5 rounded-xl border border-brand-mint shadow-inner">
                <input type="color" value={site?.theme_settings?.[key] || '#ffffff'} onChange={(e) => updateTheme(key, e.target.value)} className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" />
                <input type="text" value={site?.theme_settings?.[key] || ''} onChange={(e) => updateTheme(key, e.target.value)} className="flex-1 bg-transparent text-[10px] font-mono outline-none uppercase" />
              </div>
            </div>
          ))}
        </div>
      </details>
    </div>
  );
};