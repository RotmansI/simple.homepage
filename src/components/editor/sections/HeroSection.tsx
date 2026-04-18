"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { Heading } from '../elements/Heading';
import { Paragraph } from '../elements/Paragraph';
import { ButtonElement } from '../elements/ButtonElement';
import { ImageElement } from '../elements/ImageElement';

export default function HeroSection({ section, isSelected }: any) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { content } = section;
  
  // סנכרון עם הסיידבר: שימוש ב-slider_images במקום slides
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

  // הגדרות גובה ומימדים
  const containerStyle: React.CSSProperties = {
    height: content.max_height ? `${content.max_height}px` : '100vh',
    minHeight: '400px',
  };

  return (
    <div 
      className={`relative overflow-hidden flex items-center justify-center transition-all duration-500 ${isSelected ? 'ring-2 ring-brand-indigo ring-inset' : ''}`}
      style={containerStyle}
    >
      {/* 1. Background Slides */}
      {activeSlides.length > 0 ? (
        activeSlides.map((url: string, i: number) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out ${i === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}`}
            style={{ backgroundImage: `url(${url})` }}
          />
        ))
      ) : (
        <div className="absolute inset-0 bg-brand-pearl flex items-center justify-center">
             <div className="flex flex-col items-center gap-2 opacity-20">
                <ImageIcon size={40} />
                <span className="text-[10px] font-black uppercase tracking-widest">No Slides Found</span>
             </div>
        </div>
      )}

      {/* 2. Overlay Layer - סנכרון שדות עם הסיידבר */}
      <div 
        className="absolute inset-0 z-10 transition-all duration-500" 
        style={{ 
          backgroundColor: content.slider_overlay_color || '#000000', 
          opacity: (content.slider_overlay_opacity ?? 40) / 100 
        }} 
      />

{/* 3. Edge Effects (Dynamic Logic) */}
      
      {/* Top Fade */}
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

      {/* Bottom Fade */}
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
        <div className={`w-full flex flex-col gap-2 ${content.content_width || 'max-w-5xl'}`}>
          {content.elements && content.elements.length > 0 ? (
            content.elements.map((el: any) => (
              <div key={el.id} className="w-full">
                {el.type === 'heading' && <Heading content={el} />}
                {el.type === 'paragraph' && <Paragraph content={el} />}
                {el.type === 'button' && <ButtonElement content={el} />}
                {el.type === 'image' && <ImageElement content={el} />}
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
            <div className="py-20 opacity-20 border-2 border-dashed border-white rounded-3xl w-full flex items-center justify-center">
               <span className="text-white font-black uppercase text-sm">Empty Hero Canvas</span>
            </div>
          )}
        </div>
      </div>

      {/* 5. Slider Navigation UI */}
      {activeSlides.length > 1 && (
        <>
          <button onClick={prevSlide} className="absolute left-6 z-30 p-3 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all backdrop-blur-sm">
            <ChevronLeft size={32}/>
          </button>
          <button onClick={nextSlide} className="absolute right-6 z-30 p-3 text-white/30 hover:text-white hover:bg-white/10 rounded-full transition-all backdrop-blur-sm">
            <ChevronRight size={32}/>
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