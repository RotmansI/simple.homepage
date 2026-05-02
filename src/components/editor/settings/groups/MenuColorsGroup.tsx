"use client";

import React, { useState, useMemo } from 'react';
import { Palette, ChevronDown, Check } from 'lucide-react';
import { SmartColorPicker } from '../controls/SmartColorPicker';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

interface MenuColorsGroupProps {
  settings: any;
  onUpdate: (updates: any) => void;
  site: any;
}

export function MenuColorsGroup({ settings, onUpdate, site }: MenuColorsGroupProps) {
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  const isRTL = lang === 'he';

  // יצירת רשימת השדות עם תוויות מתורגמות
  const colorFields = useMemo(() => [
    { id: 'bgColor', label: t?.editor?.groups?.menuColors?.fields?.bgColor || 'Section Background' },
    { id: 'navBg', label: t?.editor?.groups?.menuColors?.fields?.navBg || 'Navigation Bar' },
    { id: 'activeNavBg', label: t?.editor?.groups?.menuColors?.fields?.activeNavBg || 'Active Tab Background' },
    { id: 'activeNavText', label: t?.editor?.groups?.menuColors?.fields?.activeNavText || 'Active Tab Text' },
    { id: 'navText', label: t?.editor?.groups?.menuColors?.fields?.navText || 'Inactive Tab Text' },
    { id: 'titleColor', label: t?.editor?.groups?.menuColors?.fields?.titleColor || 'Menu Title' },
    { id: 'categoryColor', label: t?.editor?.groups?.menuColors?.fields?.categoryColor || 'Category Names' },
    { id: 'itemNameColor', label: t?.editor?.groups?.menuColors?.fields?.itemNameColor || 'Dish Name' },
    { id: 'itemDescColor', label: t?.editor?.groups?.menuColors?.fields?.itemDescColor || 'Dish Description' },
    { id: 'priceColor', label: t?.editor?.groups?.menuColors?.fields?.priceColor || 'Price Tag' },
  ], [t]);

  const [selectedFieldId, setSelectedFieldId] = useState(colorFields[0].id);
  
  const currentField = colorFields.find(f => f.id === selectedFieldId) || colorFields[0];

  const handleColorChange = (newColor: string) => {
    onUpdate({ [selectedFieldId]: newColor });
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className={`flex items-center gap-2 px-1 ${isRTL ? 'text-right' : 'text-left'}`}>
        <Palette size={16} className="text-brand-main" />
        <h4 className="text-[11px] font-black uppercase text-brand-midnight tracking-widest">
          {t?.editor?.groups?.menuColors?.title || "Menu Color Palette"}
        </h4>
      </div>

      {/* Selector & Master Picker */}
      <div className="space-y-4">
        <div className="relative group">
          <label className={`text-[9px] font-black uppercase text-brand-charcoal/40 mb-1 block ${isRTL ? 'mr-1' : 'ml-1'}`}>
            {t?.editor?.groups?.menuColors?.selectLabel || "Select Element to Color"}
          </label>
          <div className="relative">
            <select 
              value={selectedFieldId}
              onChange={(e) => setSelectedFieldId(e.target.value)}
              className={`w-full bg-white border border-brand-lavender rounded-xl px-4 py-3 text-xs font-bold text-brand-dark appearance-none cursor-pointer focus:ring-2 focus:ring-brand-main/20 outline-none transition-all shadow-sm ${isRTL ? 'pl-10 pr-4' : 'pr-10 pl-4'}`}
            >
              {colorFields.map(field => (
                <option key={field.id} value={field.id}>{field.label}</option>
              ))}
            </select>
            <ChevronDown size={14} className={`absolute top-1/2 -translate-y-1/2 text-brand-charcoal/30 pointer-events-none ${isRTL ? 'left-4' : 'right-4'}`} />
          </div>
        </div>

        {/* The Smart Picker */}
        <div className="animate-in fade-in zoom-in-95 duration-300">
          <SmartColorPicker 
            label={(t?.editor?.groups?.menuColors?.adjusting || "Adjusting: {label}").replace('{label}', currentField.label)}
            value={settings[selectedFieldId] || '#000000'}
            onChange={handleColorChange}
            site={site}
          />
        </div>

        {/* Opacity Slider */}
        {selectedFieldId === 'bgColor' && (
          <div className="bg-brand-pearl/50 p-4 rounded-2xl border border-brand-lavender/50 space-y-3 animate-in slide-in-from-top-2 duration-300">
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="flex items-center gap-2 text-brand-midnight/60">
                <span className="text-[9px] font-black uppercase tracking-wider">
                  {t?.editor?.groups?.menuColors?.opacity || "Background Opacity"}
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-brand-main">
                {settings.bgOpacity ?? 100}%
              </span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              step="1"
              value={settings.bgOpacity ?? 100}
              onChange={(e) => onUpdate({ bgOpacity: parseInt(e.target.value) || 0 })}
              className="w-full h-1.5 bg-brand-lavender rounded-lg appearance-none cursor-pointer accent-brand-main"
            />
          </div>
        )}
      </div>

      {/* Visual Quick-View List */}
      <div className="pt-4 border-t border-brand-lavender/50">
        <span className={`text-[9px] font-black uppercase text-brand-charcoal/30 mb-3 block px-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          {t?.editor?.groups?.menuColors?.quickView || "Quick Overview"}
        </span>
        <div className="grid grid-cols-2 gap-2">
          {colorFields.map(field => {
            const colorValue = settings[field.id] || '#000000';
            const isActive = selectedFieldId === field.id;

            return (
              <button
                key={field.id}
                onClick={() => setSelectedFieldId(field.id)}
                className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${isRTL ? 'text-right' : 'text-left'} ${
                  isActive 
                  ? 'bg-brand-main/5 border-brand-main shadow-sm' 
                  : 'bg-white border-brand-lavender/40 hover:border-brand-lavender'
                }`}
              >
                <div 
                  className="w-5 h-5 rounded-lg border border-black/5 shrink-0 shadow-inner flex items-center justify-center relative"
                  style={{ backgroundColor: colorValue }}
                >
                  {field.id === 'bgColor' && (
                    <div 
                      className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-lg" 
                      style={{ opacity: (settings.bgOpacity ?? 100) / 100 }}
                    />
                  )}
                  {isActive && <Check size={10} className={isDark(colorValue) ? 'text-white' : 'text-black'} />}
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-black text-brand-dark truncate leading-none uppercase">
                    {field.label.replace('רקע ה', '').replace('שמות ', '').replace('שם ה', '').replace('תיאור ה', '')}
                  </p>
                  <p className="text-[8px] font-mono text-brand-charcoal/40 uppercase">
                    {colorValue}{field.id === 'bgColor' ? ` (${settings.bgOpacity ?? 100}%)` : ''}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function isDark(color: string) {
  const hex = (color || '#ffffff').replace('#', '');
  if (hex.length < 6) return false;
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return brightness < 128;
}