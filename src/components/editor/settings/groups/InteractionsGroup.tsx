"use client";

import React from 'react';
import { 
  MousePointer2, Link as LinkIcon, ExternalLink, 
  Maximize, ZoomIn, Palette, Image as ImageIcon, 
  Type, Sparkles, ChevronRight, Plus, Trash2 
} from 'lucide-react';
import { SmartColorPicker } from '../controls/SmartColorPicker';

interface InteractionsGroupProps {
  site: any;
  content: any;
  updateContent: (updates: any) => void;
  selectAssetForField?: (sectionId: string | undefined, field: string, extra?: any, callback?: (url: string) => void) => void;
  allSectionsContent?: any;
}

export const InteractionsGroup = ({ 
  site, 
  content, 
  updateContent, 
  selectAssetForField,
  allSectionsContent 
}: InteractionsGroupProps) => {
  
  const getVal = (key: string) => content[key];
  const setVal = (key: string, val: any) => updateContent({ [key]: val });

  const elType = content.type;

  const themeSettings = site?.draft_data?.theme_settings || site?.theme_settings;
  const themeColors = themeSettings ? [
    themeSettings.primary_color,
    themeSettings.secondary_color,
    themeSettings.accent_color,
    themeSettings.neutral_color,
    '#000000',
    '#ffffff'
  ].filter(Boolean) : undefined;

  const hoverEffects = [
    { id: 'scale_up', label: 'Scale Up', icon: Maximize, allowed: elType !== 'spacer' },
    { id: 'zoom_in', label: 'Zoom In', icon: ZoomIn, allowed: elType === 'image' },
    { id: 'colors_swap', label: 'Colors Swap', icon: Palette, allowed: elType !== 'image' && elType !== 'spacer' },
    { id: 'image_swap', label: 'Image Swap', icon: ImageIcon, allowed: elType === 'image' },
    { id: 'wrapping_lines', label: 'Wrapping Lines', icon: Type, allowed: ['heading', 'paragraph', 'button'].includes(elType) },
    { id: 'glow', label: 'Glow Effect', icon: Sparkles, allowed: elType !== 'spacer' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6">
        <MousePointer2 size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">Interactions</span>
      </div>

      {/* --- SECTION 1: HOVER EFFECTS --- */}
      <div className="bg-white rounded-2xl border border-brand-lavender shadow-sm overflow-hidden">
        <div className="p-4 border-b border-brand-lavender/50 flex items-center justify-between bg-brand-pearl/20">
          <div className="flex items-center gap-2">
            <MousePointer2 size={14} className="text-brand-indigo" />
            <span className="text-[11px] font-black uppercase tracking-tight">Hover Effect</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={getVal('hover_enabled') || false}
              onChange={(e) => setVal('hover_enabled', e.target.checked)}
            />
            <div className="w-8 h-4 bg-brand-lavender peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-indigo"></div>
          </label>
        </div>

        {getVal('hover_enabled') && (
          <div className="p-4 space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-2 gap-2">
              {hoverEffects.filter(eff => eff.allowed).map((eff) => (
                <button
                  key={eff.id}
                  onClick={() => setVal('hover_type', eff.id)}
                  className={`flex items-center gap-2 p-3 rounded-xl border transition-all text-start ${getVal('hover_type') === eff.id ? 'border-brand-indigo bg-brand-indigo/5 text-brand-indigo shadow-sm' : 'border-brand-lavender hover:border-brand-indigo/30 text-brand-midnight/60'}`}
                >
                  <eff.icon size={14} />
                  <span className="text-[9px] font-black uppercase tracking-tight leading-none">{eff.label}</span>
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-brand-lavender/30 space-y-4">
              {getVal('hover_type') === 'scale_up' && (
                <div className="space-y-4">
                  <RangeControl label="Max Scale" val={getVal('hover_scale') || 1.1} min={1} max={1.5} step={0.01} suffix="x" onChange={(v: number) => setVal('hover_scale', v)} />
                  <RangeControl label="Transition Time" val={getVal('hover_transition') || 0.3} min={0.1} max={1} step={0.1} suffix="s" onChange={(v: number) => setVal('hover_transition', v)} />
                </div>
              )}

              {getVal('hover_type') === 'zoom_in' && (
                <div className="space-y-4">
                  <RangeControl label="Zoom Level" val={getVal('hover_zoom') || 1.2} min={1} max={2} step={0.1} suffix="x" onChange={(v: number) => setVal('hover_zoom', v)} />
                  <RangeControl label="Transition Time" val={getVal('hover_transition') || 0.4} min={0.1} max={1} step={0.1} suffix="s" onChange={(v: number) => setVal('hover_transition', v)} />
                </div>
              )}

              {getVal('hover_type') === 'colors_swap' && (
                <div className="space-y-4">
                  <SmartColorPicker label="Hover Text Color" value={getVal('hover_text_color') || '#000000'} onChange={(c) => setVal('hover_text_color', c)} site={site} />
                  <SmartColorPicker label="Hover Border Color" value={getVal('hover_border_color') || '#000000'} onChange={(c) => setVal('hover_border_color', c)} site={site} />
                  {elType === 'button' && (
                    <SmartColorPicker label="Hover Background Color" value={getVal('hover_bg_color') || '#000000'} onChange={(c) => setVal('hover_bg_color', c)} site={site} />
                  )}
                </div>
              )}

{/* InteractionsGroup.tsx - Image Swap Section */}

{getVal('hover_type') === 'image_swap' && (
  <div className="space-y-4 text-start animate-in fade-in duration-300">
    <span className="text-[9px] font-black uppercase opacity-40 ml-1">Hover Image Asset</span>
    
    <div className="relative group">
      <div 
        onClick={() => {
          if (selectAssetForField) {
            selectAssetForField(
              content.id,
              'hover_image_url',
              getVal('hover_image_url'),
              (url: string) => setVal('hover_image_url', url)
            );
          }
        }}
        className="aspect-video bg-brand-pearl rounded-xl border-2 border-dashed border-brand-lavender/50 overflow-hidden relative shadow-inner cursor-pointer hover:border-brand-indigo/30 transition-all"
      >
        {getVal('hover_image_url') ? (
          <div className="relative w-full h-full">
            <img src={getVal('hover_image_url')} className="w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-brand-midnight/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px] gap-3">
              <div className="bg-white/50 p-2 rounded-full text-brand-midnight shadow-xl flex items-center gap-2 px-3 hover:bg-white/90">
                <Plus size={12}/>
                <span className="text-[9px] font-bold uppercase">Replace</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-500">
            <div className="w-8 h-8 rounded-full bg-brand-lavender/20 flex items-center justify-center text-brand-indigo/40 group-hover:bg-brand-indigo/10 group-hover:text-brand-indigo transition-colors">
              <ImageIcon size={16} />
            </div>
            <span className="text-[8px] font-black uppercase tracking-tighter text-brand-midnight/40">Select Hover Media</span>
          </div>
        )}
      </div>

      {/* כפתור מחיקת תמונת ההובר - מופיע רק אם יש תמונה */}
      {getVal('hover_image_url') && (
        <button 
          onClick={(e) => { e.stopPropagation(); setVal('hover_image_url', null); }}
          className="absolute -top-2 -right-2 p-1.5 bg-white border border-brand-lavender text-brand-midnight rounded-full shadow-md hover:bg-brand-coral transition-all"
        >
          <Trash2 size={12} />
        </button>
      )}
    </div>

    {/* בחירת סוג אנימציה כולל אפשרות לביטול (None) */}
    <div className="space-y-2">
      <span className="text-[9px] font-black uppercase opacity-40 ml-1">Swap Animation</span>
      <div className="flex gap-1 bg-brand-pearl p-1 rounded-xl border border-brand-lavender/30">
        {[
          { id: 'none', label: 'Simple' },
          { id: 'fade', label: 'Fade' },
          { id: 'slide', label: 'Slide' }
        ].map(mode => (
          <button 
            key={mode.id} 
            onClick={() => setVal('hover_swap_mode', mode.id)} 
            className={`flex-1 py-1.5 text-[8px] font-black uppercase rounded-lg transition-all ${
              (getVal('hover_swap_mode') || 'none') === mode.id 
                ? 'bg-white text-brand-indigo shadow-sm border border-brand-lavender/50' 
                : 'text-brand-midnight/40 hover:text-brand-midnight'
            }`}
          >
            {mode.label}
          </button>
        ))}
      </div>
    </div>
  </div>
)}

              {getVal('hover_type') === 'glow' && (
                <SmartColorPicker label="Glow Color" value={getVal('hover_glow_color') || themeColors?.[2] || '#6366f1'} onChange={(c) => setVal('hover_glow_color', c)} site={site} />
              )}
            </div>
          </div>
        )}
      </div>

      {/* --- SECTION 2: LINK INTERACTION --- */}
      <div className="bg-white rounded-2xl border border-brand-lavender shadow-sm overflow-hidden">
        <div className="p-4 border-b border-brand-lavender/50 flex items-center justify-between bg-brand-pearl/20">
          <div className="flex items-center gap-2">
            <LinkIcon size={14} className="text-brand-indigo" />
            <span className="text-[11px] font-black uppercase tracking-tight">Click Action (Link)</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={getVal('link_enabled') || false}
              onChange={(e) => setVal('link_enabled', e.target.checked)}
            />
            <div className="w-8 h-4 bg-brand-lavender peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-brand-indigo"></div>
          </label>
        </div>

        {getVal('link_enabled') && (
          <div className="p-4 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300 text-start">
            <div className="space-y-1.5">
              <span className="text-[9px] font-black uppercase opacity-40 ml-1">Destination URL</span>
              <div className="flex items-center bg-brand-pearl rounded-xl border border-brand-lavender overflow-hidden">
                <div className="pl-3 text-brand-midnight/30"><ExternalLink size={12} /></div>
                <input 
                  type="text" 
                  placeholder="https://..."
                  className="w-full bg-transparent p-3 text-[11px] font-bold outline-none"
                  value={getVal('link_url') || ''}
                  onChange={(e) => setVal('link_url', e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-1">
              <span className="text-[9px] font-black uppercase opacity-40">Open in new tab</span>
              <button 
                onClick={() => setVal('link_target_blank', !getVal('link_target_blank'))}
                className={`w-10 h-5 rounded-full transition-all relative ${getVal('link_target_blank') ? 'bg-brand-indigo' : 'bg-brand-lavender'}`}
              >
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${getVal('link_target_blank') ? 'left-6' : 'left-1'}`} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface RangeControlProps {
  label: string;
  val: number;
  min: number;
  max: number;
  step: number;
  suffix: string;
  onChange: (value: number) => void;
}

const RangeControl = ({ label, val, min, max, step, suffix, onChange }: RangeControlProps) => (
  <div className="space-y-2 text-start">
    <div className="flex justify-between items-center px-1">
      <span className="text-[9px] font-bold uppercase opacity-40">{label}</span>
      <span className="text-[10px] font-mono font-bold text-brand-indigo">{val}{suffix}</span>
    </div>
    <input 
      type="range" min={min} max={max} step={step} value={val} 
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-1 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-indigo"
    />
  </div>
);

const PlusIcon = () => (
  <div className="flex flex-col items-center gap-1 opacity-20">
    <ImageIcon size={20} />
    <span className="text-[8px] font-black uppercase">Select Image</span>
  </div>
);