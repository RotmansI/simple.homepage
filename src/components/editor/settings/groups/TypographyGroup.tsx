"use client";

import React from 'react';
import { 
  Type, 
  AlignCenter, 
  AlignLeft, 
  AlignRight, 
  AlignJustify,
  Underline,
  Italic,
  ArrowUp,
  Minus,
  Type as FontIcon,
  List 
} from 'lucide-react';
import { SmartColorPicker } from '../controls/SmartColorPicker';

interface TypographyGroupProps {
  content: any;
  updateContent: (updates: any) => void;
  allSectionsContent?: any;
  site?: any; // הוספת site ל-Interface
  prefix?: string;
  showContentInput?: boolean; 
  isTextArea?: boolean;      
}

export const TypographyGroup = ({ 
  content, 
  updateContent, 
  allSectionsContent,
  site,
  prefix = "",
  showContentInput = true,
  isTextArea = false
}: TypographyGroupProps) => {
  
  const getVal = (key: string) => content[`${prefix}${key}`];
  const setVal = (key: string, val: any) => updateContent({ [`${prefix}${key}`]: val });

  // חילוץ צבעי המותג עבור הקולור פיקר
const themeSettings = site?.draft_data?.theme_settings || site?.theme_settings;

const themeColors = themeSettings ? [
  themeSettings.primary_color,
  themeSettings.secondary_color,
  themeSettings.accent_color,
  themeSettings.neutral_color,
  '#000000',
  '#ffffff'
].filter(Boolean) : ['#000000', '#ffffff'];

console.log("Site data in TypographyGroup:", site);
console.log("Extracted theme colors:", themeColors);

  return (
    <div className="space-y-6">
      {/* כותרת הגרופ */}
      <div className="flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6">
        <Type size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">Typography & Text</span>
      </div>

      <div className="space-y-4">
        {/* א. תוכן הטקסט */}
        {showContentInput && (
          <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-2">
            <span className="text-[9px] font-bold opacity-40 uppercase ml-1">Content</span>
            {isTextArea ? (
              <textarea 
                className="w-full bg-brand-pearl/50 border border-transparent focus:border-brand-indigo/30 rounded-xl px-4 py-3 text-[12px] font-medium outline-none transition-all shadow-inner min-h-[100px] resize-none"
                value={getVal('text') || ''}
                onChange={(e) => setVal('text', e.target.value)}
              />
            ) : (
              <input 
                type="text"
                className="w-full bg-brand-pearl/50 border border-transparent focus:border-brand-indigo/30 rounded-xl px-4 py-2.5 text-[12px] font-bold outline-none transition-all shadow-inner"
                value={getVal('text') || ''}
                onChange={(e) => setVal('text', e.target.value)}
              />
            )}
          </div>
        )}

{/* ב. גודל, משקל וצבע */}
        <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <span className="text-[8px] font-black opacity-40 uppercase ml-1 block">Font Size</span>
              <input 
                type="number"
                className="w-full bg-brand-pearl/50 border-none rounded-lg px-3 py-1.5 text-[11px] font-bold outline-none"
                value={getVal('font_size') || 16}
                onChange={(e) => setVal('font_size', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-1.5">
              <span className="text-[8px] font-black opacity-40 uppercase ml-1 block">Weight</span>
              <select 
                className="w-full bg-brand-pearl/50 border-none rounded-lg px-2 py-1.5 text-[11px] font-bold outline-none appearance-none"
                value={getVal('font_weight') || '400'}
                onChange={(e) => setVal('font_weight', e.target.value)}
              >
                <option value="300">Light</option>
                <option value="400">Regular</option>
                <option value="600">Semi Bold</option>
                <option value="700">Bold</option>
                <option value="900">Black</option>
              </select>
            </div>
          </div>

          {/* מציג את בחירת הצבע רק אם זה לא כפתור */}
          {content?.type !== 'button' && (
            <SmartColorPicker 
              label="Text Color"
              value={getVal('text_color') || '#000000'}
              onChange={(color) => setVal('text_color', color)}
              site={site}
              allSectionsContent={allSectionsContent}
            />
          )}
        </div>

        {/* ג. יישור ופורמטינג */}
        <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <span className="text-[8px] font-black opacity-40 uppercase">Alignment</span>
              <div className="flex bg-brand-pearl rounded-lg p-1 gap-1">
                {[
                  { id: 'left', icon: AlignLeft },
                  { id: 'center', icon: AlignCenter },
                  { id: 'right', icon: AlignRight },
                  { id: 'justify', icon: AlignJustify }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setVal('align', btn.id)}
                    className={`p-1.5 rounded-md transition-all ${getVal('align') === btn.id ? 'bg-white shadow-sm text-brand-indigo' : 'text-brand-midnight/40 hover:text-brand-midnight'}`}
                  >
                    <btn.icon size={14} />
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-brand-lavender/30">
              <span className="text-[8px] font-black opacity-40 uppercase">Formatting</span>
              <div className="flex gap-2">
                {[
                  { id: 'underline', icon: Underline },
                  { id: 'italic', icon: Italic },
                  { id: 'uppercase', icon: ArrowUp },
                  { id: 'bottom_line', icon: Minus }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    type="button"
                    onClick={() => setVal(btn.id, !getVal(btn.id))}
                    className={`p-2 rounded-lg border transition-all ${getVal(btn.id) ? 'bg-brand-indigo/10 border-brand-indigo/30 text-brand-indigo' : 'bg-white border-brand-lavender text-brand-midnight/40'}`}
                  >
                    <btn.icon size={14} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ד. ריווחים (Letter & Line) */}
        <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm space-y-6">
          <div className="space-y-3">
            <div className="flex justify-between px-1">
              <div className="flex items-center gap-2 opacity-40">
                <FontIcon size={10} />
                <span className="text-[8px] font-black uppercase">Letter Spacing</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-brand-indigo">{getVal('letter_spacing') ?? 0}px</span>
            </div>
            <input 
              type="range" min="-2" max="10" step="0.5"
              value={getVal('letter_spacing') ?? 0}
              onChange={(e) => setVal('letter_spacing', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
            />
          </div>

          <div className="space-y-3 pt-4 border-t border-brand-lavender/30">
            <div className="flex justify-between px-1">
              <div className="flex items-center gap-2 opacity-40">
                <List size={12} />
                <span className="text-[8px] font-black uppercase">Line Spacing</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-brand-indigo">{getVal('line_height') ?? 1.2}</span>
            </div>
            <input 
              type="range" min="0.8" max="2.5" step="0.1"
              value={getVal('line_height') ?? 1.2}
              onChange={(e) => setVal('line_height', parseFloat(e.target.value))}
              className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};