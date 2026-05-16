"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Heading } from '../elements/Heading';
import { Paragraph } from '../elements/Paragraph';
import { ButtonElement } from '../elements/ButtonElement';
import { ImageElement } from '../elements/ImageElement';
import { SmartWrapper } from '../elements/SmartWrapper';

export default function HeroSection({ 
  section, 
  isSelected, 
  site, 
  updateContent,
  selectedFlexElementId, 
  setSelectedFlexElementId,
  onSelectElement,
  onOpenAssetManager 
}: any) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { content } = section;
  
  // 🎯 המנעול המרכזי: אם updateContent לא קיים, אנחנו באתר הציבורי.
  const isEditor = !!updateContent;

  const siteLanguage = site?.theme_settings?.site_language || 'en';
  const isRTL = siteLanguage === 'he';

  const activeSlides = (content.slider_images || []).filter((s: string) => s).slice(0, 5);

  useEffect(() => {
    if (activeSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlides.length]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);

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
    height: content.max_height ? `${content.max_height}px` : '100vh',
    minHeight: '400px',
    direction: isRTL ? 'rtl' : 'ltr'
  };

  return (
    <div 
      /* overflow-visible מאפשר לטולבר הצף להופיע מחוץ לגבולות הסקשן באדיטור */
      className={`relative flex items-center justify-center transition-all duration-500 
        ${isEditor && isSelected && !selectedFlexElementId ? 'ring-2 ring-brand-indigo ring-inset' : ''}
        ${isEditor && selectedFlexElementId ? 'overflow-visible' : 'overflow-hidden'} 
      `}
      style={containerStyle}
    >
      {/* 1. Background Slides */}
      {activeSlides.length > 0 ? (
        activeSlides.map((url: string, i: number) => (
          <div
            key={url + i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${i === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            style={{ backgroundImage: `url(${url})` }}
          />
        ))
      ) : (
        <div className="absolute inset-0 bg-brand-pearl flex items-center justify-center">
             <div className="flex flex-col items-center gap-2 opacity-20">
                <ImageIcon size={40} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {isRTL ? 'לא נמצאו שקופיות' : 'No Slides Found'}
                </span>
             </div>
        </div>
      )}

      {/* 2. Overlay Layer */}
      <div 
        className="absolute inset-0 z-10 transition-all duration-500" 
        style={{ 
          backgroundColor: content.slider_overlay_color || '#000000', 
          opacity: (content.slider_overlay_opacity ?? 40) / 100 
        }} 
      />

      {/* 3. Edge Effects */}
      {content.top_fade?.enabled && (
        <div 
          className="absolute top-0 left-0 w-full z-15 pointer-events-none transition-all duration-500"
          style={{ 
            height: `${content.top_fade.spread || 100}px`,
            background: `linear-gradient(to bottom, ${content.top_fade.color || '#ffffff'}, transparent)`,
            opacity: (content.top_fade.opacity ?? 100) / 100
          }} 
        />
      )}

      {content.bottom_fade?.enabled && (
        <div 
          className="absolute bottom-0 left-0 w-full z-15 pointer-events-none transition-all duration-500"
          style={{ 
            height: `${content.bottom_fade.spread || 100}px`,
            background: `linear-gradient(to top, ${content.bottom_fade.color || '#ffffff'}, transparent)`,
            opacity: (content.bottom_fade.opacity ?? 100) / 100
          }} 
        />
      )}

      {/* 4. Content Layer */}
      <div className="relative z-20 container mx-auto px-6 flex flex-col items-center justify-center py-20">
        <div 
          className={`w-full flex flex-col gap-2 ${content.content_width || 'max-w-5xl'} ${isRTL ? 'items-end text-right' : 'items-start text-left'}`}
        >
          {content.elements && content.elements.length > 0 ? (
            content.elements.map((el: any) => (
              <div 
                key={el.id} 
                className={`w-full ${isEditor && selectedFlexElementId === el.id ? 'z-[100] relative' : 'z-auto'}`}
              >
              <SmartWrapper
                id={el.id}
                type={el.type}
                content={el}
                site={site}
                isSelected={isEditor && selectedFlexElementId === el.id}
                
                // באדיטור שולחים פונקציות, באתר הציבורי undefined - מה שמעלים את ה-Wrapper
                setSelectedFlexElementId={isEditor ? (id: string | null) => {
                  if (typeof onSelectElement === 'function') {
                    onSelectElement(section.id, id);
                  } else if (typeof setSelectedFlexElementId === 'function') {
                    setSelectedFlexElementId(id);
                  }
                } : undefined}
                
                onUpdate={isEditor ? (updates: Record<string, any>) => handleElementUpdate(el.id, updates) : undefined}
              >
                {el.type === 'heading' && (
                  <Heading 
                    content={el} 
                    site={site} 
                    onUpdate={isEditor ? (updates: Record<string, any>) => handleElementUpdate(el.id, updates) : undefined} 
                  />
                )}
                {el.type === 'paragraph' && (
                  <Paragraph 
                    content={el} 
                    site={site} 
                    onUpdate={isEditor ? (updates: Record<string, any>) => handleElementUpdate(el.id, updates) : undefined} 
                  />
                )}
                {el.type === 'button' && (
                  <ButtonElement 
                    content={el} 
                    site={site} 
                    onUpdate={isEditor ? (updates: Record<string, any>) => handleElementUpdate(el.id, updates) : undefined} 
                  />
                )}
                {el.type === 'image' && (
                  <ImageElement 
                    content={el} 
                    site={site} 
                    onUpdate={isEditor ? (updates: Record<string, any>) => handleElementUpdate(el.id, updates) : undefined} 
                  />
                )}
              </SmartWrapper>

                {el.type === 'spacer' && (
                  <div 
                    style={{ 
                      height: `${el.spacer_height || el.height || 40}px`,
                      backgroundColor: el.spacer_transparent === false ? (el.spacer_color || '#000000') : 'transparent',
                      opacity: el.spacer_transparent === false ? (el.spacer_opacity ?? 100) / 100 : 1,
                      transition: 'all 0.3s ease-in-out'
                    }} 
                    className="w-full" 
                  />
                )}
              </div>
            ))
          ) : (
            isEditor && (
              <div className="py-20 opacity-20 border-2 border-dashed border-white rounded-3xl w-full flex items-center justify-center">
                 <span className="text-white font-black uppercase text-sm">
                   {isRTL ? 'קנבס הירו ריק' : 'Empty Hero Canvas'}
                 </span>
              </div>
            )
          )}
        </div>
      </div>

      {/* 5. Slider Navigation UI */}
      {activeSlides.length > 1 && (
        <>
          <button 
            onClick={isRTL ? nextSlide : prevSlide} 
            className={`absolute ${isRTL ? 'right-6' : 'left-6'} z-30 p-3 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all backdrop-blur-sm`}
          >
            {isRTL ? <ChevronRight size={32}/> : <ChevronLeft size={32}/>}
          </button>
          <button 
            onClick={isRTL ? prevSlide : nextSlide} 
            className={`absolute ${isRTL ? 'left-6' : 'right-6'} z-30 p-3 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all backdrop-blur-sm`}
          >
            {isRTL ? <ChevronLeft size={32}/> : <ChevronRight size={32}/>}
          </button>
          
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex gap-2.5">
            {activeSlides.map((_: any, i: number) => (
              <button 
                key={i} 
                onClick={() => setCurrentSlide(i)} 
                className={`transition-all duration-500 rounded-full ${i === currentSlide ? 'w-10 bg-white' : 'w-2.5 bg-white/30 hover:bg-white/50'} h-1.5`} 
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}