"use client";

import React, { useState } from 'react';
import { 
  GripVertical, 
  Trash2, 
  Plus, 
  MousePointer2, 
  Type, 
  Layout, 
  Box,
  Copy,
  Image as ImageIcon
} from 'lucide-react';

// אייקון H מותאם אישית ל-Heading
const HeadingIcon = ({ size = 18 }: { size?: number }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <path d="M6 4v16M18 4v16M6 12h12" />
  </svg>
);

interface ContentManagerGroupProps {
  content: any;
  updateContent: (updates: any) => void;
  onAddElement: (type: string) => void;
  onEditElement?: (id: string) => void;
  onRemoveElement?: (id: string) => void;
  allowedElements?: string[];
}

export const ContentManagerGroup = ({ 
  content, 
  updateContent,
  onAddElement,
  onEditElement,
  onRemoveElement,
  allowedElements
}: ContentManagerGroupProps) => {

  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const elements = content.elements || [];

  const elementTypes = [
    { id: 'heading', label: 'Heading', icon: HeadingIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'paragraph', label: 'Text', icon: Type, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 'button', label: 'Button', icon: MousePointer2, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'image', label: 'Image', icon: Box, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'spacer', label: 'Spacer', icon: Layout, color: 'text-slate-400', bg: 'bg-slate-50' },
  ];

  const filteredAddOptions = allowedElements 
    ? elementTypes.filter(el => allowedElements.includes(el.id))
    : elementTypes;

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'gallery-content': return <ImageIcon size={14} />;
      case 'heading': return <HeadingIcon size={14} />;
      case 'paragraph': return <Type size={14} />;
      case 'button': return <MousePointer2 size={14} />;
      case 'image': return <ImageIcon size={14} />;
      case 'spacer': return <Layout size={14} />;
      default: return <Type size={14} />;
    }
  };

  // --- לוגיקת גרירה ושינוי מיקום ---
  const handleDragStart = (idx: number) => setDraggedIdx(idx);

  const handleDragOver = (e: React.DragEvent, targetIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === targetIdx) return;

    const newElements = [...elements];
    const draggedItem = newElements[draggedIdx];
    
    // הסרה והוספה מחדש במיקום החדש
    newElements.splice(draggedIdx, 1);
    newElements.splice(targetIdx, 0, draggedItem);
    
    setDraggedIdx(targetIdx);
    updateContent({ elements: newElements });
  };

  // --- פונקציית שכפול אלמנט ---
  const handleDuplicate = (el: any) => {
    const newEl = { 
      ...el, 
      id: `${el.type}-${crypto.randomUUID()}` 
    };
    updateContent({ elements: [...elements, newEl] });
  };

  return (
    <div className="space-y-8">
      
      {/* 1. הוספת אלמנט חדש */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6">
          <Plus size={14} className="text-brand-indigo" />
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">Add New Element</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-brand-lavender shadow-sm">
          <div className="grid grid-cols-3 gap-3">
            {filteredAddOptions.map((el) => (
              <button
                key={el.id}
                onClick={() => onAddElement(el.id)}
                className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl hover:bg-brand-pearl transition-all group border border-transparent hover:border-brand-lavender/50 shadow-sm"
              >
                <div className={`p-2.5 rounded-lg ${el.bg} ${el.color} group-hover:scale-110 transition-transform`}>
                  <el.icon size={18} />
                </div>
                <span className="text-[9px] font-black uppercase tracking-tight text-brand-midnight opacity-60">
                  {el.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. ניהול מבנה האלמנטים הקיימים */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1 border-t border-brand-lavender/30 pt-6">
          <GripVertical size={14} className="text-brand-indigo" />
          <span className="text-[10px] font-black uppercase tracking-widest text-brand-midnight">Elements Structure</span>
        </div>

        <div className="bg-white p-2 rounded-2xl border border-brand-lavender shadow-sm space-y-1">
{elements.map((el: any, idx: number) => {
            const isGallery = el.type === 'gallery-content';

            return (
              <div 
                key={el.id || idx}
                draggable
                onDragStart={() => handleDragStart(idx)}
                onDragOver={(e) => handleDragOver(e, idx)}
                onDragEnd={() => setDraggedIdx(null)}
                className={`flex items-center gap-3 p-3 hover:bg-brand-pearl/50 rounded-xl transition-all group border border-transparent hover:border-brand-lavender/30 ${
                  draggedIdx === idx ? 'opacity-30 bg-brand-indigo/5 scale-[0.98]' : 'opacity-100'
                }`}
              >
                <div className="cursor-grab active:cursor-grabbing opacity-20 group-hover:opacity-40 transition-opacity">
                  <GripVertical size={14} />
                </div>
                
                <div className="w-8 h-8 rounded-lg bg-brand-indigo/5 flex items-center justify-center text-brand-indigo/60">
                  {getElementIcon(el.type)}
                </div>

                <div 
                  className="flex-1 min-w-0 cursor-pointer" 
                  onClick={() => !isGallery && onEditElement?.(el.id)}
                >
                  <p className="text-[11px] font-bold truncate text-brand-midnight lowercase">
                    {isGallery ? 'Gallery Layout' : (el.text || el.type)}
                  </p>
                  <p className="text-[8px] opacity-40 uppercase font-black tracking-tighter">
                    {isGallery ? 'Core Element' : el.type}
                  </p>
                </div>

                {/* כפתורי פעולה: שכפול ומחיקה */}
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                  {!isGallery && (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDuplicate(el); }}
                        className="p-2 text-brand-midnight/40 hover:text-brand-indigo hover:bg-brand-indigo/10 rounded-lg transition-all"
                        title="Duplicate"
                      >
                        <Copy size={13} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onRemoveElement?.(el.id); }}
                        className="p-2 text-brand-coral hover:bg-brand-coral/10 rounded-lg transition-all"
                        title="Remove"
                      >
                        <Trash2 size={13} />
                      </button>
                    </>
                  )}
                  
                  {isGallery && (
                    <div className="px-2 py-1 bg-brand-indigo/5 rounded-md">
                      <span className="text-[7px] font-black text-brand-indigo uppercase opacity-40">Fixed</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {elements.length === 0 && (
            <div className="py-10 text-center border-2 border-dashed border-brand-lavender/50 m-2 rounded-xl bg-brand-pearl/20">
              <p className="text-[10px] font-bold uppercase opacity-30 tracking-widest">Canvas is empty</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};