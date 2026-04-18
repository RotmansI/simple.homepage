"use client";

import React from 'react';

export function SidebarTab({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick} 
      className={`flex-1 py-3 flex flex-col items-center gap-1 transition-all rounded-xl ${
        active ? 'bg-white shadow-sm text-brand-main border-b-2 border-brand-main' : 'text-brand-charcoal/30 hover:text-brand-main'
      }`}
    >
      {icon} 
      <span className="text-[8px] font-black uppercase tracking-tighter">{label}</span>
    </button>
  );
}

export function WidgetButton({ icon, label, onClick }: any) {
  return (
    <button 
      onClick={onClick} 
      className="flex flex-col items-center justify-center p-6 bg-brand-grey/50 rounded-[2rem] border-2 border-transparent hover:border-brand-main hover:bg-white transition-all group shadow-sm"
    >
      <div className="text-brand-charcoal/40 group-hover:text-brand-main transition-all mb-3">{icon}</div>
      <span className="text-[11px] font-black text-brand-charcoal uppercase tracking-tighter">{label}</span>
    </button>
  );
}

export function PropertyInput({ label, value, onChange, isTextarea, placeholder }: any) {
  return (
    <div className="space-y-2">
      <span className="text-[10px] font-black uppercase text-brand-charcoal/40 tracking-widest">{label}</span>
      {isTextarea ? (
        <textarea 
          className="w-full bg-brand-grey p-3 rounded-xl border border-brand-mint outline-none focus:border-brand-main text-[12px] font-medium resize-none shadow-inner" 
          rows={4} 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder={placeholder || `Set ${label.toLowerCase()}...`}
        />
      ) : (
        <input 
          className="w-full bg-brand-grey p-3 rounded-xl border border-brand-mint outline-none focus:border-brand-main text-[12px] font-medium shadow-inner" 
          value={value || ''} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder={placeholder || `Type ${label.toLowerCase()}...`}
        />
      )}
    </div>
  );
}