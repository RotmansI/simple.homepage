"use client";

import React, { useState, useEffect } from 'react';
import { Pipette, History, Palette as PaletteIcon } from 'lucide-react';

interface SmartColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
  brandingColors?: string[]; // כאן יעברו הצבעים מה-Site
  allSectionsContent?: any;   
}

export const SmartColorPicker = ({ 
  label, 
  value, 
  onChange, 
  // נשאיר את אלו כ-Fallback בלבד אם לא הועבר כלום
  brandingColors = ['#000000', '#ffffff'], 
  allSectionsContent 
}: SmartColorPickerProps) => {
  
  const [recentColors, setRecentColors] = useState<string[]>([]);

  useEffect(() => {
    if (allSectionsContent) {
      const extractedColors = new Set<string>();
      const searchColors = (obj: any) => {
        for (const key in obj) {
          if (typeof obj[key] === 'string' && obj[key].startsWith('#')) {
            extractedColors.add(obj[key].toUpperCase());
          } else if (typeof obj[key] === 'object' && obj[key] !== null) {
            searchColors(obj[key]);
          }
        }
      };
      searchColors(allSectionsContent);
      setRecentColors(Array.from(extractedColors).slice(0, 10));
    }
  }, [allSectionsContent]);

  const openEyeDropper = async () => {
    if (!(window as any).EyeDropper) {
      alert("Your browser does not support the EyeDropper API");
      return;
    }
    const eyeDropper = new (window as any).EyeDropper();
    try {
      const result = await eyeDropper.open();
      onChange(result.sRGBHex);
    } catch (e) {
      console.log("EyeDropper was cancelled");
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <span className="text-[9px] font-black uppercase text-brand-midnight opacity-40 tracking-wider">{label}</span>
        <button 
          onClick={openEyeDropper}
          className="p-1.5 hover:bg-brand-pearl rounded-md transition-colors text-brand-indigo"
          title="Pick color from screen"
        >
          <Pipette size={14} />
        </button>
      </div>

      <div className="bg-white p-3 rounded-2xl border border-brand-lavender shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl border border-brand-lavender shadow-inner relative overflow-hidden"
            style={{ backgroundColor: value || '#ffffff' }}
          >
            <input 
              type="color" 
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              value={value || '#ffffff'} 
              onChange={(e) => onChange(e.target.value)}
            />
          </div>
          <input 
            type="text"
            className="flex-1 bg-brand-pearl/50 border-none rounded-lg px-3 py-2 text-[11px] font-mono font-bold uppercase outline-none focus:ring-1 focus:ring-brand-indigo"
            value={value || '#FFFFFF'}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>

        {/* Branding Colors - עכשיו מציג את מה שבאמת מוגדר ב-Site */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 opacity-30">
            <PaletteIcon size={10} />
            <span className="text-[8px] font-bold uppercase">Branding</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {brandingColors.map((c) => (
              <button 
                key={c}
                onClick={() => onChange(c)}
                className={`w-5 h-5 rounded-full border border-black/5 transition-transform hover:scale-110 ${value?.toUpperCase() === c?.toUpperCase() ? 'ring-2 ring-brand-indigo ring-offset-1' : ''}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {recentColors.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-brand-lavender/40">
            <div className="flex items-center gap-1.5 opacity-30">
              <History size={10} />
              <span className="text-[8px] font-bold uppercase">Used in Page</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {recentColors.map((c) => (
                <button 
                  key={c}
                  onClick={() => onChange(c)}
                  className={`w-5 h-5 rounded-md border border-black/5 transition-transform hover:scale-110 ${value?.toUpperCase() === c?.toUpperCase() ? 'ring-2 ring-brand-indigo ring-offset-1' : ''}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};