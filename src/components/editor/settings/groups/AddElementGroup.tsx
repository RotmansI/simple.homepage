"use client";

import React from 'react';
import { 
  Plus, 
  Type, 
  Type as ParagraphIcon, 
  MousePointer2, 
  Square, 
  Layout, 
  Box
} from 'lucide-react';

interface AddElementGroupProps {
  onAddElement: (type: string) => void;
  allowedElements?: string[]; // אופציונלי: להגביל אלמנטים לפי סוג סקשן
}

export const AddElementGroup = ({ onAddElement, allowedElements }: AddElementGroupProps) => {
  
  // הגדרת סוגי האלמנטים הזמינים
  const elementTypes = [
    { id: 'heading', label: 'Heading', icon: Type, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'paragraph', label: 'Text', icon: ParagraphIcon, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'button', label: 'Button', icon: MousePointer2, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'spacer', label: 'Spacer', icon: Layout, color: 'text-slate-400', bg: 'bg-slate-50' },
    { id: 'image', label: 'Image', icon: Box, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'divider', label: 'Divider', icon: Square, color: 'text-rose-400', bg: 'bg-rose-50' },
  ];

  // סינון אלמנטים אם הוגדרה רשימה מותרת
  const filteredElements = allowedElements 
    ? elementTypes.filter(el => allowedElements.includes(el.id))
    : elementTypes;

  return (
    <div className="space-y-4">
      {/* כותרת הקבוצה */}
      <div className="flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6">
        <Plus size={14} className="text-brand-indigo" />
        <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">Add Element</span>
      </div>

      {/* Grid של אלמנטים */}
      <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm">
        <div className="grid grid-cols-3 gap-3">
          {filteredElements.map((el) => (
            <button
              key={el.id}
              onClick={() => onAddElement(el.id)}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl hover:bg-brand-pearl transition-all group border border-transparent hover:border-brand-lavender/50 shadow-sm hover:shadow-md"
            >
              <div className={`p-2.5 rounded-lg ${el.bg} ${el.color} group-hover:scale-110 transition-transform`}>
                <el.icon size={18} strokeWidth={2.5} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-tight text-brand-midnight opacity-60 group-hover:opacity-100">
                {el.label}
              </span>
            </button>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-brand-lavender/30">
          <p className="text-[8px] opacity-40 italic text-center leading-relaxed px-4 uppercase font-bold">
            Click an element to inject it into your section
          </p>
        </div>
      </div>
    </div>
  );
};