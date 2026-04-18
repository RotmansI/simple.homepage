"use client";

import React from 'react';
import { Heading } from '../elements/Heading';
import { Paragraph } from '../elements/Paragraph';
import { ButtonElement } from '../elements/ButtonElement';
import { ImageElement } from '../elements/ImageElement';

export default function FlexSection({ 
  section, 
  isSelected, 
  updateContent: _updateContent // שימוש בקו תחתון למניעת שגיאת 'never read'
}: { 
  section: any, 
  isSelected?: boolean, 
  updateContent?: (updates: any) => void 
}) {
  const { content } = section;
  
  if (!content) return null;

  // 1. הגדרות הקונטיינר הראשי - סנכרון עם DimensionsGroup
  const containerStyle: React.CSSProperties = {
    backgroundColor: content.is_transparent ? 'transparent' : (content.bg_color || '#ffffff'),
    backgroundImage: (!content.is_transparent && content.bg_image) ? `url(${content.bg_image})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    minHeight: '100px', 
    height: content.max_height ? `${content.max_height}px` : 'auto', 
    overflow: 'hidden',
    transition: 'all 0.5s ease-in-out'
  };

  // 2. שכבת ה-Overlay - תיקון לוגיקה לסנכרון עם Hero (Slider Overlay)
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
      className={`w-full relative group flex flex-col items-center transition-all ${isSelected ? 'ring-2 ring-brand-indigo ring-inset' : ''}`}
    >
      {/* שכבת האופסיטי/פילטר */}
      <div style={overlayStyle} />

      {/* 3. Edge Effects (Fades) - סנכרון מלא עם Hero */}
      
      {/* Top Fade */}
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

      {/* Bottom Fade */}
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
      
      {/* 4. Content Layer */}
      <div 
        className="container mx-auto px-6 relative z-10 flex flex-col transition-all duration-500"
        style={{
          paddingTop: `${content.padding_v || 80}px`,
          paddingBottom: `${content.padding_v || 80}px`,
          maxWidth: content.content_width || '1200px' 
        }}
      >
        <div className="flex flex-col w-full gap-2">
          {content.elements?.map((el: any) => {
            const key = el.id;

            switch (el.type) {
              case 'heading':   
                return <Heading key={key} content={el} />;
              
              case 'paragraph': 
                return <Paragraph key={key} content={el} />;
              
              case 'button':    
                return <ButtonElement key={key} content={el} />;
              
              case 'image':     
                return <ImageElement key={key} content={el} />;

              case 'spacer':    
                return (
                  <div 
                    key={key} 
                    style={{ 
                      height: `${el.spacer_height || el.height || 40}px`, 
                      backgroundColor: el.spacer_transparent === false 
                        ? (el.spacer_color || el.bg_color || '#F3F4F6') 
                        : 'transparent',
                      opacity: el.spacer_transparent === false 
                        ? (el.spacer_opacity ?? 100) / 100 
                        : 1,
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
          })}
        </div>
      </div>
    </section>
  );
}