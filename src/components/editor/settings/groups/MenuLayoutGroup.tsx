"use client";

import React from 'react';
import { Maximize, Layers, Square } from 'lucide-react';

export function MenuLayoutGroup({ settings, onUpdate }: any) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Layers size={14} className="text-brand-main" />
        <span className="text-[10px] font-black uppercase text-brand-midnight tracking-widest">Menu Scale</span>
      </div>


      {/* Menu Scale Slider */}
      <div className="space-y-3 bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm">
        <div className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Maximize size={14} className="text-brand-main" />
            <span className="text-[11px] font-bold text-brand-midnight">Menu Scale</span>
          </div>
          <span className="text-[10px] font-black text-brand-main">{settings.menuScale ?? 100}%</span>
        </div>
        <input 
          type="range" min="50" max="150" step="5"
          value={settings.menuScale ?? 100}
          onChange={(e) => onUpdate({ menuScale: parseInt(e.target.value) })}
          className="w-full accent-brand-main"
        />
        <p className="text-[9px] font-medium text-brand-slate/60 text-center italic">
          Smaller scale allows more items per row
        </p>
      </div>
    </div>
  );
}