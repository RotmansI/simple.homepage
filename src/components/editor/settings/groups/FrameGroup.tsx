"use client";

import React from 'react';
import { Square, CornerUpLeft, Maximize } from 'lucide-react';
import { SmartColorPicker } from '../controls/SmartColorPicker';

interface FrameGroupProps {
  site: any;
  content: any;
  updateContent: (updates: any) => void;
  allSectionsContent?: any;
  prefix?: string; 
}

export const FrameGroup = ({ 
  site,
  content, 
  updateContent, 
  allSectionsContent,
  prefix = "" 
}: FrameGroupProps) => {
  
  const getVal = (key: string) => content[`${prefix}${key}`];
  const setVal = (key: string, val: any) => updateContent({ [`${prefix}${key}`]: val });

  const isTextElement = content.type === 'heading' || content.type === 'paragraph';

  const themeSettings = site?.draft_data?.theme_settings || site?.theme_settings;
  const themeColors = themeSettings ? [
    themeSettings.primary_color,
    themeSettings.secondary_color,
    themeSettings.accent_color,
    themeSettings.neutral_color,
    '#000000',
    '#ffffff'
  ].filter(Boolean) : undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6">
        <Maximize size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">
          {isTextElement ? 'Text Stroke' : 'Frame & Borders'}
        </span>
      </div>

      <div className="space-y-4">
        {/* Corner Radius - מוסתר בטקסט */}
        {!isTextElement && (
          <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-4">
            <div className="flex items-center gap-2 opacity-40 ml-1">
              <CornerUpLeft size={12} />
              <span className="text-[9px] font-bold uppercase">Corner Radius</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <div className="flex gap-1">
                  {[0, 8, 16, 99].map(r => (
                    <button 
                      key={r}
                      onClick={() => setVal('border_radius', r)}
                      className={`text-[8px] font-black px-2 py-1 rounded border transition-all ${getVal('border_radius') === r ? 'bg-brand-indigo text-white border-brand-indigo' : 'bg-brand-pearl text-brand-midnight/40 border-transparent hover:border-brand-lavender'}`}
                    >
                      {r === 99 ? 'FULL' : `${r}px`}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] font-mono font-bold text-brand-indigo bg-brand-indigo/5 px-2 py-0.5 rounded-md">
                  {getVal('border_radius') ?? 0}px
                </span>
              </div>
              <input 
                type="range" min="0" max="100" step="1"
                value={getVal('border_radius') ?? 0}
                onChange={(e) => setVal('border_radius', parseInt(e.target.value))}
                className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
              />
            </div>
          </div>
        )}

        {/* Border/Stroke Settings */}
        <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-5">
          <div className="flex items-center justify-between ml-1">
            <div className="flex items-center gap-2 opacity-40">
              <Square size={12} />
              <span className="text-[9px] font-bold uppercase">
                {isTextElement ? 'Stroke Style' : 'Border Style'}
              </span>
            </div>
            
            {/* מציג סלקט רק אם זה לא טקסט. בטקסט זה תמיד Solid */}
            {!isTextElement ? (
              <select 
                className="text-[9px] font-black uppercase bg-brand-pearl px-2 py-1 rounded-lg outline-none border-none text-brand-indigo cursor-pointer"
                value={getVal('border_style') || 'solid'}
                onChange={(e) => setVal('border_style', e.target.value)}
              >
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
              </select>
            ) : (
                <span className="text-[8px] font-black uppercase opacity-30">Solid</span>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <span className="text-[9px] font-bold opacity-40 uppercase">Width</span>
              <span className="text-[10px] font-mono font-bold text-brand-indigo">
                {getVal('border_width') ?? 0}px
              </span>
            </div>
            <input 
              type="range" min="0" max="15" step="0.5"
              value={getVal('border_width') ?? 0}
              onChange={(e) => setVal('border_width', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
            />
          </div>

          {(getVal('border_width') ?? 0) > 0 && (
            <div className="pt-4 border-t border-brand-lavender/30 animate-in fade-in duration-300">
              <SmartColorPicker 
                label={isTextElement ? "Stroke Color" : "Border Color"}
                value={getVal('border_color') || '#000000'}
                onChange={(color) => setVal('border_color', color)}
                site={site}
                allSectionsContent={allSectionsContent}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};