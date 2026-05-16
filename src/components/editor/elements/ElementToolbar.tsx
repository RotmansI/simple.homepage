"use client";

import React, { useState } from 'react';
import { 
  Bold, Italic, AlignLeft, AlignCenter, AlignRight, 
  Trash2, Copy, Plus, Minus, RefreshCw, Palette,
  ChevronUp, ChevronDown, Maximize2, Minimize2
} from 'lucide-react';
import {SmartColorPicker} from '@/components/editor/settings/controls/SmartColorPicker';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

interface ElementToolbarProps {
  type: 'heading' | 'paragraph' | 'button' | 'image' | 'spacer';
  content: any;
  onUpdate: (updates: Record<string, any>) => void;
  site: any;
  isRTL: boolean;
}

export const ElementToolbar = ({ type, content, onUpdate, site, isRTL }: ElementToolbarProps) => {
  const [showWeightSelector, setShowWeightSelector] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const { lang } = useLanguage();
  const t = translations[lang as Language];

  const updateWeight = (weight: number) => {
    onUpdate({ font_weight: weight.toString() });
    setShowWeightSelector(false);
  };

  const adjustSize = (delta: number) => {
    const currentSize = parseInt(content.font_size || (type === 'heading' ? '36' : '16'));
    onUpdate({ font_size: (currentSize + delta).toString() });
  };

  // 🎯 עדכון: קפיצות של 10px לתמונה
  const adjustImageWidth = (delta: number) => {
    const currentWidth = parseInt(content.width || '200');
    onUpdate({ width: (currentWidth + delta).toString() });
  };

  const getWeightLabel = (w: string | number) => {
    const weight = Number(w);
    if (weight >= 900) return 'X';
    if (weight >= 700) return 'B';
    return 'L';
  };

  const selectedColor = content.text_color || '#ffffff';

  return (
    <div 
      /* 🎯 שינוי קריטי: left-1/2 ו- -translate-x-1/2 מבטיחים מרכוז תמידי בקנבס */
      className={`absolute -top-16 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-brand-midnight/95 backdrop-blur-md text-white p-1.5 rounded-xl shadow-2xl z-[900] animate-in fade-in zoom-in-95 duration-200 border border-white/40 whitespace-nowrap`}
      onClick={(e) => e.stopPropagation()}
    >
      
      {/* --- 1. Move Controls --- */}
      <div className="flex items-center  pr-1 gap-0.5">
        <button onClick={() => onUpdate({ _moveUp: true })} className="p-1.5 hover:bg-white/10 text-white/60 hover:text-white transition-all rounded-md">
          <ChevronUp size={14} />
        </button>
        <button onClick={() => onUpdate({ _moveDown: true })} className="p-1.5 hover:bg-white/10 text-white/60 hover:text-white transition-all rounded-md">
          <ChevronDown size={14} />
        </button>
      </div>

      {/* --- 2. Image Specific Controls --- */}
      {type === 'image' && (
        <>
        <div className="flex items-center gap-0.5 border-r border-white/20 pr-1 mr-1">
          <button
            onClick={() => onUpdate({ _triggerAssetManager: true })}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-lg transition-all group mr-1"
          >
            <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-[10px] font-black uppercase tracking-tight">
              {lang === 'he' ? 'החלפה' : 'Replace'}
            </span>
          </button>
          </div>

          {/* 🎯 שינוי גודל תמונה בקפיצות של 10px */}
          <div className="flex items-center border-r border-white/20 pr-1 mr-1 gap-0.5">
            <button onClick={() => adjustImageWidth(-10)} className="p-1.5 hover:bg-white/10 rounded-md">
              <Minimize2 size={14} className="opacity-60" />
            </button>
            <span className="text-[9px] font-mono font-bold w-10 text-center opacity-80">
              {content.width || '200'}px
            </span>
            <button onClick={() => adjustImageWidth(10)} className="p-1.5 hover:bg-white/10 rounded-md">
              <Maximize2 size={14} className="opacity-60" />
            </button>
          </div>

          {/* יישור תמונה */}
          <div className="flex items-center gap-0.5 border-r border-white/20 pr-1 mr-1">
            {[
              { val: 'left', icon: <AlignLeft size={14} /> },
              { val: 'center', icon: <AlignCenter size={14} /> },
              { val: 'right', icon: <AlignRight size={14} /> }
            ].map((align) => (
              <button
                key={align.val}
                onClick={() => onUpdate({ text_align: align.val, align: align.val })}
                className={`p-1.5 rounded-md transition-all ${content.text_align === align.val ? 'bg-brand-main text-white' : 'hover:bg-white/10 opacity-40'}`}
              >
                {align.icon}
              </button>
            ))}
          </div>
        </>
      )}

      {/* --- 3. Text Controls --- */}
      {(type === 'heading' || type === 'paragraph' || type === 'button') && (
        <>
          <div className="relative border-r border-white/20 pr-1 mr-1">
            <button onClick={() => setShowWeightSelector(!showWeightSelector)} className={`w-8 h-8 flex items-center justify-center rounded-lg font-black text-sm transition-all ${showWeightSelector ? 'bg-brand-main text-white' : 'hover:bg-white/10 opacity-80'}`}>
              {getWeightLabel(content.font_weight || 400)}
            </button>
            {showWeightSelector && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-brand-midnight border border-white/20 rounded-lg shadow-xl flex flex-col p-1 min-w-[80px] z-[120]">
                {[400, 700, 900].map((w) => (
                  <button key={w} onClick={() => updateWeight(w)} className={`p-2 text-[10px] font-black text-left hover:bg-white/10 rounded-md transition-all ${content.font_weight == w ? 'text-brand-main' : 'text-white/60'}`}>
                    {w === 400 ? 'Light' : w === 700 ? 'Bold' : 'Black'}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={() => onUpdate({ italic: !content.italic })} className={`p-2 rounded-lg transition-all ${content.italic ? 'bg-brand-main text-white' : 'hover:bg-white/10 opacity-60'}`}>
            <Italic size={14} />
          </button>

          <div className="flex items-center border-r border-white/20 pr-1 mr-1 gap-0.5">
            <button onClick={() => adjustSize(-2)} className="p-1.5 hover:bg-white/10 rounded-md opacity-60 hover:opacity-100">
              <Minus size={12} />
            </button>
            <span className="text-[10px] font-mono font-bold w-5 text-center">{content.font_size || (type === 'heading' ? '36' : '16')}</span>
            <button onClick={() => adjustSize(2)} className="p-1.5 hover:bg-white/10 rounded-md opacity-60 hover:opacity-100">
              <Plus size={12} />
            </button>
          </div>

          <div className="relative border-r border-white/20 pr-1 mr-1">
            <button onClick={() => setShowColorPicker(!showColorPicker)} className="relative p-2 hover:bg-white/10 rounded-lg transition-all text-white">
              <Palette size={14} />
              <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full border border-white shadow-md" style={{ backgroundColor: selectedColor }} />
            </button>
            {showColorPicker && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 z-[110] bg-white p-2 rounded-2xl shadow-2xl animate-in fade-in zoom-in-95">
                <SmartColorPicker label={lang === 'he' ? 'צבע טקסט' : 'Text Color'} value={content.text_color || '#000000'} onChange={(color: string) => onUpdate({ text_color: color })} site={site} />
              </div>
            )}
          </div>

          <div className="flex items-center gap-0.5 border-r border-white/20 pr-1 mr-1">
            {[
              { val: 'left', icon: <AlignLeft size={14} /> },
              { val: 'center', icon: <AlignCenter size={14} /> },
              { val: 'right', icon: <AlignRight size={14} /> }
            ].map((align) => (
              <button key={align.val} onClick={() => onUpdate({ text_align: align.val, align: align.val })} className={`p-1.5 rounded-md transition-all ${content.text_align === align.val ? 'bg-brand-main' : 'hover:bg-white/10 opacity-50'}`}>
                {align.icon}
              </button>
            ))}
          </div>
        </>
      )}

      {/* --- 4. Management Controls --- */}
      <div className="flex items-center border-r border-white/20 pr-1 mr-1 gap-0.5 ml-1">
        <button onClick={() => onUpdate({ _duplicate: true })} className="p-1.5 hover:bg-white/10 text-white/40 hover:text-white transition-all rounded-md">
          <Copy size={14} />
        </button>
        <button onClick={() => onUpdate({ _delete: true })} className="p-1.5 hover:bg-brand-coral/20 text-brand-coral transition-all rounded-md">
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
};