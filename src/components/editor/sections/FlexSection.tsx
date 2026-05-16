"use client";

import React from 'react';
import { Heading } from '../elements/Heading';
import { Paragraph } from '../elements/Paragraph';
import { ButtonElement } from '../elements/ButtonElement';
import { ImageElement } from '../elements/ImageElement';
import { SmartWrapper } from '../elements/SmartWrapper';

export default function FlexSection({ 
  section, 
  isSelected, 
  site,
  updateContent,
  selectedFlexElementId,
  setSelectedFlexElementId,
  onSelectElement,
  onOpenAssetManager
}: { 
  section: any, 
  isSelected?: boolean, 
  site?: any,
  updateContent?: (updates: any) => void,
  selectedFlexElementId?: string | null,
  setSelectedFlexElementId?: (id: string | null) => void,
  onSelectElement?: (sectionId: string, elementId: string) => void,
  onOpenAssetManager?: (elementId: string) => void
}) {
  const { content } = section;
  
  // 🎯 המנעול המרכזי: האם אנחנו באדיטור?
  const isEditor = !!updateContent;

  if (!content) return null;

  const siteLanguage = site?.theme_settings?.site_language || 'en';
  const isRTL = siteLanguage === 'he';

  // פונקציית עדכון אלמנט ספציפי
const handleElementUpdate = (elementId: string, updates: Record<string, any>) => {
    if (!updateContent) return;

    // 1. פתיחת ניהול מדיה
    if (updates._triggerAssetManager && onOpenAssetManager) {
      onOpenAssetManager(elementId);
      return;
    }

    let newElements = [...(content.elements || [])];
    const index = newElements.findIndex(el => el.id === elementId);
    if (index === -1) return;

    // 2. מחיקה
    if (updates._delete) {
      newElements = newElements.filter(el => el.id !== elementId);
      if (typeof setSelectedFlexElementId === 'function') setSelectedFlexElementId(null);
    } 
    // 3. שכפול
    else if (updates._duplicate) {
      const elementToCopy = newElements[index];
      const newElement = { 
        ...elementToCopy, 
        id: `${elementToCopy.type}-${Math.random().toString(36).substr(2, 9)}` 
      };
      newElements.splice(index + 1, 0, newElement);
    } 
    // 4. הזזה למעלה
    else if (updates._moveUp && index > 0) {
      const temp = newElements[index];
      newElements[index] = newElements[index - 1];
      newElements[index - 1] = temp;
    } 
    // 5. הזזה למטה
    else if (updates._moveDown && index < newElements.length - 1) {
      const temp = newElements[index];
      newElements[index] = newElements[index + 1];
      newElements[index + 1] = temp;
    }
    // 6. עדכון רגיל
    else {
      newElements = newElements.map((el: any) => 
        el.id === elementId ? { ...el, ...updates } : el
      );
    }

    updateContent({ elements: newElements });
  };
  
  const containerStyle: React.CSSProperties = {
    backgroundColor: content.is_transparent ? 'transparent' : (content.bg_color || '#ffffff'),
    backgroundImage: (!content.is_transparent && content.bg_image) ? `url(${content.bg_image})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    minHeight: '100px', 
    height: content.max_height ? `${content.max_height}px` : 'auto', 
    transition: 'all 0.5s ease-in-out',
    direction: isRTL ? 'rtl' : 'ltr'
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    backgroundColor: content.slider_overlay_color || '#000000',
    opacity: content.is_transparent ? 0 : (content.slider_overlay_opacity ?? 0) / 100,
    pointerEvents: 'none',
    zIndex: 1,
    transition: 'all 0.5s ease'
  };

  return (
    <section 
      style={containerStyle} 
      className={`w-full relative group flex flex-col items-center transition-all 
        ${isEditor && isSelected && !selectedFlexElementId ? 'ring-2 ring-brand-indigo ring-inset' : ''}
        ${isEditor && selectedFlexElementId ? 'overflow-visible' : 'overflow-hidden'}
      `}
    >
      <div style={overlayStyle} />

      {/* Edge Effects (Fades) */}
      {content.top_fade?.enabled && (
        <div 
          className="absolute top-0 left-0 w-full z-[5] pointer-events-none transition-all duration-500"
          style={{ 
            height: `${content.top_fade.spread || 100}px`,
            background: `linear-gradient(to bottom, ${content.top_fade.color || '#ffffff'}, transparent)`,
            opacity: (content.top_fade.opacity ?? 100) / 100
          }} 
        />
      )}

      {content.bottom_fade?.enabled && (
        <div 
          className="absolute bottom-0 left-0 w-full z-[5] pointer-events-none transition-all duration-500"
          style={{ 
            height: `${content.bottom_fade.spread || 100}px`,
            background: `linear-gradient(to top, ${content.bottom_fade.color || '#ffffff'}, transparent)`,
            opacity: (content.bottom_fade.opacity ?? 100) / 100
          }} 
        />
      )}
      
      {/* Content Layer */}
      <div 
        className={`container mx-auto px-6 relative z-10 flex flex-col transition-all duration-500 ${isRTL ? 'items-start text-right' : 'items-start text-left'}`}
        style={{
          paddingTop: `${content.padding_v || 80}px`,
          paddingBottom: `${content.padding_v || 80}px`,
          maxWidth: content.content_width || '1200px'
        }}
      >
        <div 
          className="flex flex-col w-full gap-2"
          style={{ alignItems: isRTL ? 'flex-start' : 'flex-start' }}
        >
          {content.elements?.map((el: any) => {
            const key = el.id;
            
            // הגדרת פונקציית עדכון מותנית
            const elementOnUpdate = isEditor ? (u: any) => handleElementUpdate(el.id, u) : undefined;

            // רינדור האלמנט הנקי
            const elementNode = (() => {
              switch (el.type) {
                case 'heading':   
                  return <Heading content={el} site={site} onUpdate={elementOnUpdate} />;
                case 'paragraph': 
                  return <Paragraph content={el} site={site} onUpdate={elementOnUpdate} />;
                case 'button':    
                  return <ButtonElement content={el} site={site} onUpdate={elementOnUpdate} />;
                case 'image':     
                  return <ImageElement content={el} site={site} onUpdate={elementOnUpdate} />;
                case 'spacer':    
                  return (
                    <div 
                      style={{ 
                        height: `${el.spacer_height || el.height || 40}px`, 
                        backgroundColor: el.spacer_transparent === false 
                          ? (el.spacer_color || el.bg_color || '#F3F4F6') 
                          : 'transparent',
                        opacity: el.spacer_transparent === false ? (el.spacer_opacity ?? 100) / 100 : 1,
                        borderRadius: `${el.border_radius || 0}px`,
                        marginTop: `${el.margin_top || 0}px`,
                        marginBottom: `${el.margin_bottom || 0}px`,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }} 
                      className="w-full" 
                    />
                  );
                default: return null;
              }
            })();

            if (!elementNode) return null;

            // החזרת התוצאה: באדיטור עוטפים ב-SmartWrapper, בחוץ מרנדרים נקי
            return (
              <div key={key} className={`w-full ${isEditor && selectedFlexElementId === el.id ? 'z-[100] relative' : 'z-auto'}`}>
                {isEditor && el.type !== 'spacer' ? (
                  <SmartWrapper
                    id={el.id}
                    type={el.type}
                    content={el}
                    site={site}
                    isSelected={selectedFlexElementId === el.id}
                    setSelectedFlexElementId={isEditor ? (id: string | null) => {
                      if (typeof onSelectElement === 'function') {
                        onSelectElement(section.id, id!);
                      } else if (typeof setSelectedFlexElementId === 'function') {
                        setSelectedFlexElementId(id);
                      }
                    } : undefined}
                    onUpdate={elementOnUpdate}
                  >
                    {elementNode}
                  </SmartWrapper>
                ) : (
                  elementNode
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}