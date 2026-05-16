"use client";

import React, { useState } from 'react';
import { ElementToolbar } from './ElementToolbar';

interface SmartWrapperProps {
  id: string;
  type: 'heading' | 'paragraph' | 'button' | 'image' | 'spacer';
  content: any;
  site: any;
  isSelected: boolean;
  setSelectedFlexElementId?: (id: string | null) => void;
  onUpdate?: (updates: Record<string, any>) => void;
  children: React.ReactNode;
}

export const SmartWrapper = ({ 
  id, 
  type, 
  content, 
  site, 
  isSelected, 
  setSelectedFlexElementId, 
  onUpdate, 
  children 
}: SmartWrapperProps) => {
  const [isHovered, setIsHovered] = useState(false);

  /* 🎯 המנעול ההרמטי: 
     אם אחת מהפונקציות הקריטיות חסרה, אנחנו בטוח באתר הציבורי.
     במצב כזה, אנחנו מחזירים רק את הילדים (children) נקיים לגמרי בלי שום DIV עוטף.
  */
  const isEditorMode = typeof setSelectedFlexElementId === 'function' && typeof onUpdate === 'function';

  if (!isEditorMode) {
    return <>{children}</>;
  }

  // --- כל מה שמתחת לזה ירוץ אך ורק באדיטור ---

  const isRTL = site?.theme_settings?.site_language === 'he';
  const isActive = isSelected || isHovered;

  const textAlign = content?.text_align || content?.align || (isRTL ? 'right' : 'left');
  const alignmentClass = textAlign === 'center' ? 'items-center text-center' : textAlign === 'right' ? 'items-end text-right' : 'items-start text-left';

  // חישוב רוחב: אם זו תמונה משתמשים ברוחב שהוגדר, אחרת 100%
  const elementWidth = content?.width 
    ? (content.width.toString().includes('%') || content.width.toString().includes('px') ? content.width : `${content.width}px`)
    : (type === 'image' ? '200px' : '100%');

  return (
    <div 
      className={`relative flex flex-col w-full transition-all duration-300 group/smart mb-1 ${alignmentClass}
        ${isSelected ? 'z-[500]' : 'z-10'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 🎯 הטולבר הצף - ממוקם כאן כדי להיות תמיד במרכז ה-Canvas (ביחס ל-w-full) */}
      {isSelected && onUpdate && (
        <ElementToolbar 
          type={type} 
          content={content} 
          onUpdate={onUpdate}
          site={site}
          isRTL={isRTL}
        />
      )}

      <div 
        onClickCapture={() => {
          if (typeof setSelectedFlexElementId === 'function') {
            setSelectedFlexElementId(id);
          }
        }}
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={`relative transition-all duration-300 rounded-lg
          ${isSelected 
            ? 'ring-1 ring-brand-lime ring-offset-1 ring-offset-transparent shadow-xl bg-brand-lime/[0.02]' 
            : 'hover:ring-1 hover:ring-brand-lime/30'
          }
          ${isSelected ? 'cursor-text' : 'cursor-pointer'}
        `}
        style={{ 
          width: type === 'image' ? elementWidth : '100%',
          maxWidth: '100%',
          padding: isActive ? '4px 8px' : '0px',
          margin: isActive ? '-4px -8px' : '0px',
        }}
      >
        {/* 🎯 הלייבל החדש: פינה שמאלית תחתונה, בתוך המסגרת */}
        {isActive && (
          <div className={`absolute bottom-2 left-2 
            ${isSelected ? 'bg-brand-coral opacity-100 shadow-md' : 'bg-brand-midnight/40 text-white/80'} 
            text-black text-[7px] font-black uppercase px-1.5 py-0.5 rounded-sm z-[70] pointer-events-none transition-all duration-300`}
          >
            {type}
          </div>
        )}

        {/* התוכן האמיתי של האלמנט */}
        <div className="relative w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
};