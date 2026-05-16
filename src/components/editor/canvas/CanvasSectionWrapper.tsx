"use client";

import React from 'react';
import { Trash2, Copy, ChevronUp, ChevronDown, GripVertical, LayoutTemplate} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';
import { ToastType } from '@/components/ui/Toast';

// עדכון ה-Interface כך שיכיל את כל מה שנשלח מהקנבס
interface CanvasSectionWrapperProps {
  id: string;
  isSelected: boolean;
  isHovered: boolean;
  isRTL: boolean; // הוספנו את השורה הזו כדי לפתור את השגיאה
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  children: React.ReactNode;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
  onMove?: (direction: 'up' | 'down') => void;
}

export const CanvasSectionWrapper = ({
  id,
  isSelected,
  isHovered,
  isRTL, // עכשיו TypeScript מכיר בזה
  onSelect,
  onHover,
  children,
  onDelete,
  onDuplicate,
  onMove
}: CanvasSectionWrapperProps) => {
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  
  // שימוש ב-isRTL שהגיע מה-Props כדי להבטיח עקביות עם הקנבס
  const directionClass = isRTL ? 'right-0' : 'left-0';

  return (
    <div 
      className="relative group/section transition-all duration-300"
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover(null)}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(id);
      }}
    >
      {/* 1. מסגרת ריחוף (Hover) */}
      {isHovered && !isSelected && (
        <div className="absolute inset-0 border-5 border-dashed border-brand-main/20 pointer-events-none z-10 animate-in fade-in duration-200 rounded-sm" />
      )}

      {/* 2. מסגרת בחירה (Selection) */}
      {isSelected && (
        <>
          {/* מסגרת חיצונית דקה למניעת Layout Shift */}
          <div className="absolute inset-0 border-[3px] border-brand-main pointer-events-none z-20 shadow-[0_0_0_9999px_rgba(255,255,255,0.02)]" />
          
          {/* סרגל כלים צף מהיר (Quick Toolbar) */}
          <div 
            className={`
              absolute -top-11 flex items-center gap-1 bg-brand-main text-white p-1 rounded-xl shadow-xl z-[30] 
              animate-in slide-in-from-bottom-2 duration-300
              ${directionClass}
            `}
          >
            {/* ידית גרירה ויזואלית */}
            <div className="flex items-center px-1 border-s border-white/20 mr-1">
               <LayoutTemplate size={14} className="opacity-80" />
            </div>
            
            {/* כפתורי תנועה */}
            <button 
              onClick={(e) => { e.stopPropagation(); onMove?.('up'); }}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" 
              title={t.editor.canvas.actions.moveUp}
            >
              <ChevronUp size={16} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onMove?.('down'); }}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" 
              title={t.editor.canvas.actions.moveDown}
            >
              <ChevronDown size={16} />
            </button>
            
            {/* קו מפריד עיצובי */}
            <div className="w-px h-4 bg-white/20 mx-1" />
            
            {/* כפתורי ניהול תוכן */}
            <button 
              onClick={(e) => { e.stopPropagation(); onDuplicate?.(id); }}
              className="p-1.5 hover:bg-white/20 rounded-lg transition-colors" 
              title={t.editor.canvas.actions.duplicate}
            >
              <Copy size={14} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete?.(id); }}
              className="p-1.5 hover:bg-rose-500 rounded-lg transition-colors" 
              title={t.editor.canvas.actions.delete}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </>
      )}

      {/* 3. שכבת התוכן */}
      <div className={`relative z-0 ${isSelected ? 'bg-brand-main/[0.01]' : ''}`}>
        {children}
      </div>
    </div>
  );
};