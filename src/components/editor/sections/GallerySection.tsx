"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { ImageIcon, X, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectCoverflow } from 'swiper/modules';

// Elements
import { Heading } from '../elements/Heading';
import { Paragraph } from '../elements/Paragraph';
import { ButtonElement } from '../elements/ButtonElement';
import { ImageElement } from '../elements/ImageElement';
import { SmartWrapper } from '../elements/SmartWrapper';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

export default function GallerySection({ 
  section, 
  updateContent, 
  site,
  isSelected,
  selectedFlexElementId,
  setSelectedFlexElementId,
  onSelectElement,
  onOpenAssetManager 
}: any) {
  const { content } = section;
  const settings = content.gallery_settings || {};
  const elements = content.elements || [];
  const rawImages = settings.images || []; 
  const scale = settings.component_scale || 1;
  
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [domLoaded, setDomLoaded] = useState(false);

  /* 🎯 המנעול המרכזי: האם אנחנו במצב עריכה? */
  const isEditable = !!updateContent;

  const siteLanguage = site?.theme_settings?.site_language || 'en';
  const isRTL = siteLanguage === 'he';
  
  useEffect(() => {
    setDomLoaded(true);

    if (isEditable) {
      const hasGalleryElement = elements.some((e: any) => e.type === 'gallery-content');
      if (!hasGalleryElement) {
        const galleryElement = { 
          id: `gal-root-${Math.random().toString(36).substr(2, 9)}`, 
          type: 'gallery-content' 
        };
        updateContent({
          elements: [galleryElement, ...elements]
        });
      }
    }
  }, [isEditable, elements, updateContent]);

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

  const isCarousel = settings.layout === 'carousel';
  const hasMinImages = rawImages.length >= 10;
  const shouldShowCarousel = isCarousel && (hasMinImages || isEditable);

  const carouselImages = useMemo(() => {
    if (isCarousel && rawImages.length > 0 && rawImages.length < 20) {
      return [...rawImages, ...rawImages]; 
    }
    return rawImages;
  }, [rawImages, isCarousel]);

  const sectionStyle: React.CSSProperties = {
    backgroundColor: content.is_transparent ? 'transparent' : (content.bg_color || '#ffffff'),
    backgroundImage: (!content.is_transparent && content.bg_image) ? `url(${content.bg_image})` : 'none',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
    minHeight: '400px',
    transition: 'all 0.5s ease-in-out',
    direction: isRTL ? 'rtl' : 'ltr'
  };

  const getImageStyle = (isActive: boolean) => {
    const shadowIntensity = settings.shadow_intensity || 0;
    const shadowColor = settings.shadow_color || 'rgba(0,0,0,0.1)';
    const shadowMap: any = {
      0: 'none',
      1: `0 ${4 * scale}px ${12 * scale}px ${shadowColor}`,
      2: `0 ${12 * scale}px ${24 * scale}px ${shadowColor}`,
      3: `0 ${20 * scale}px ${40 * scale}px ${shadowColor}`
    };

    return {
      borderRadius: `${(settings.border_radius || 0) * scale}px`,
      border: `${(settings.border_width || 0) * scale}px solid ${settings.border_color || 'transparent'}`,
      boxShadow: shadowMap[shadowIntensity],
      transition: 'all 0.5s ease-in-out',
      cursor: 'pointer'
    };
  };

  const renderGalleryGrid = () => {
    if (rawImages.length === 0) {
      if (!isEditable) return null;
      return (
        <div className="aspect-video w-full rounded-[2rem] border-2 border-dashed flex flex-col items-center justify-center bg-brand-pearl/20 border-brand-lavender text-brand-midnight/30">
          <ImageIcon size={32} className="mb-2 opacity-20" />
          <p className="font-bold uppercase tracking-widest text-[10px]">
            {isRTL ? 'הגלריה ריקה' : 'Gallery is empty'}
          </p>
        </div>
      );
    }

    if (isCarousel) {
      if (!shouldShowCarousel || !domLoaded) return <div className="h-[400px]" />;

      return (
        <div className="w-full py-12 overflow-visible relative min-h-[500px]">
          {!hasMinImages && isEditable && (
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-[50] bg-brand-indigo text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-xl animate-bounce">
              <AlertCircle size={14} /> Editor View (Min 10 imgs for Loop)
            </div>
          )}
          <Swiper
            key={`swiper-${carouselImages.length}-${scale}-${isRTL ? 'rtl' : 'ltr'}`}
            effect={'coverflow'}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={'auto'}
            loop={hasMinImages}
            dir={isRTL ? 'rtl' : 'ltr'}
            loopAdditionalSlides={5}
            coverflowEffect={{ rotate: 0, stretch: 0, depth: 150 * scale, modifier: 2.5, slideShadows: false }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            modules={[EffectCoverflow, Autoplay, Pagination, Navigation]}
            className="gallery-swiper-main !overflow-visible"
          >
            {carouselImages.map((img: string, idx: number) => (
              <SwiperSlide key={`slide-${idx}`} style={{ width: `${450 * scale}px` }}>
                {({ isActive }) => (
                  <div 
                    onClick={() => setLightboxIndex(idx % rawImages.length)}
                    className={`relative gallery-item-group transition-all duration-500 ${
                      isActive ? 'scale-100 opacity-100 z-10' : 'scale-90 opacity-40 blur-[0.5px]'
                    }`}
                    style={getImageStyle(isActive)}
                  >
                    <img 
                      src={img} 
                      className="w-full aspect-[4/5] object-cover" 
                      style={{ borderRadius: `${(settings.border_radius || 0) * scale}px` }}
                      alt=""
                    />
                    {isActive && settings.hover_effect === 'border' && (
                      <div className="hover-border-overlay absolute inset-0 border-[4px] border-transparent transition-all pointer-events-none" style={{ borderRadius: `${(settings.border_radius || 0) * scale}px` }} />
                    )}
                  </div>
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      );
    }

    const gridCols = { 3: 'md:grid-cols-3', 6: 'md:grid-cols-6', 10: 'md:grid-cols-10' }[settings.columns_desktop as 3 | 6 | 10] || 'md:grid-cols-3';
    
    return (
      <div className={`grid gap-6 grid-cols-2 ${gridCols} w-full`} style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
        {rawImages.map((img: string, idx: number) => {
          const isMosaicLarge = settings.layout === 'mosaic' && (idx % 7 === 0 || idx % 7 === 4);
          return (
            <div 
              key={`grid-${idx}`} 
              onClick={() => setLightboxIndex(idx)}
              className={`relative overflow-hidden gallery-item-group transition-all duration-500 ${isMosaicLarge ? 'md:col-span-2 md:row-span-2' : ''}`} 
              style={getImageStyle(false)}
            >
              <img src={img} className={`w-full h-full object-cover transition-all duration-700 ${settings.hover_effect === 'scale' ? 'hover:scale-105' : ''} ${settings.hover_effect === 'zoom' ? 'hover:scale-110' : ''}`} alt="" />
              {settings.hover_effect === 'border' && (
                <div className="hover-border-overlay absolute inset-0 border-[4px] border-transparent transition-all pointer-events-none" style={{ borderRadius: `${(settings.border_radius || 0) * scale}px` }} />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section 
      className={`relative py-24 px-8 md:px-20 flex items-center justify-center transition-all duration-500
        ${isEditable && isSelected && !selectedFlexElementId ? 'ring-2 ring-brand-indigo ring-inset' : ''}
        ${isEditable && selectedFlexElementId ? 'overflow-visible' : 'overflow-hidden'}
      `} 
      style={sectionStyle}
    >
      {!content.is_transparent && (
        <div 
          className="absolute inset-0 pointer-events-none transition-all duration-500" 
          style={{ 
            backgroundColor: content.slider_overlay_color || 'black', 
            opacity: content.is_transparent ? 0 : (content.slider_overlay_opacity ?? content.bg_opacity ?? 0) / 100,
            zIndex: 1
          }} 
        />
      )}

      <div 
        className={`mx-auto flex flex-col z-10 w-full ${isRTL ? 'items-end text-right' : 'items-start text-left'}`}
        style={{ width: `${settings.width_percent || 100}%`, maxWidth: content.max_width ? `${content.max_width}px` : '1400px' }}
      >
        <div className="flex flex-col w-full gap-4">
          {elements.map((el: any) => {
            const key = el.id;
            const elementOnUpdate = isEditable ? (u: any) => handleElementUpdate(el.id, u) : undefined;

            if (el.type === 'gallery-content') {
              return <div key={key} className="w-full my-8">{renderGalleryGrid()}</div>;
            }

            if (el.type === 'spacer') {
              return (
                <div key={key} style={{ 
                  height: `${el.spacer_height || el.height || 40}px`,
                  backgroundColor: el.spacer_transparent === false ? (el.spacer_color || '#000000') : 'transparent',
                  opacity: el.spacer_transparent === false ? (el.spacer_opacity ?? 100) / 100 : 1,
                }} className="w-full" />
              );
            }

            const elementNode = (
              <>
                {el.type === 'heading' && <Heading content={el} site={site} onUpdate={elementOnUpdate} />}
                {el.type === 'paragraph' && <Paragraph content={el} site={site} onUpdate={elementOnUpdate} />}
                {el.type === 'button' && <ButtonElement content={el} site={site} onUpdate={elementOnUpdate} />}
                {el.type === 'image' && <ImageElement content={el} site={site} onUpdate={elementOnUpdate} />}
              </>
            );

            return (
              <div key={key} className={`w-full ${isEditable && selectedFlexElementId === el.id ? 'z-[100] relative' : 'z-auto'}`}>
                {isEditable ? (
                  <SmartWrapper
                    id={el.id}
                    type={el.type}
                    content={el}
                    site={site}
                    isSelected={selectedFlexElementId === el.id}
                    /* 🎯 התיקון: שינוי הטיפוס מ-string ל-string | null */
                    setSelectedFlexElementId={(id: string | null) => {
                      if (id && typeof onSelectElement === 'function') {
                        onSelectElement(section.id, id);
                      } else if (typeof setSelectedFlexElementId === 'function') {
                        setSelectedFlexElementId(id);
                      }
                    }}
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

      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[1000] bg-black/95 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300" onClick={() => setLightboxIndex(null)}>
          <button className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors z-[1010]"><X size={40} /></button>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => prev! > 0 ? prev! - 1 : rawImages.length - 1); }} className="absolute left-6 text-white/30 hover:text-white transition-all hover:scale-110 z-[1010]">
            {isRTL ? <ChevronRight size={60} strokeWidth={1} /> : <ChevronLeft size={60} strokeWidth={1} />}
          </button>
          <div className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            <img src={rawImages[lightboxIndex]} className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-500" alt="" />
            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/40 font-mono text-sm tracking-widest uppercase italic">
              {lightboxIndex + 1} / {rawImages.length}
            </div>
          </div>
          <button onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => prev! < rawImages.length - 1 ? prev! + 1 : 0); }} className="absolute right-6 text-white/30 hover:text-white transition-all hover:scale-110 z-[1010]">
            {isRTL ? <ChevronLeft size={60} strokeWidth={1} /> : <ChevronRight size={60} strokeWidth={1} />}
          </button>
        </div>
      )}

      <style jsx global>{`
        .gallery-swiper-main .swiper-button-next, 
        .gallery-swiper-main .swiper-button-prev {
          color: ${settings.nav_btn_color || '#000'} !important;
          background: ${settings.nav_btn_bg || '#ffffff'};
          width: ${38 * scale}px !important;
          height: ${38 * scale}px !important;
          border-radius: 50% !important;
          z-index: 50;
        }
        .gallery-swiper-main .swiper-pagination-bullet-active {
          background: ${settings.nav_btn_color || '#000'} !important;
        }
        .gallery-item-group:hover .hover-border-overlay {
          border-color: ${settings.hover_border_color || '#ffffff'} !important;
        }
      `}</style>
    </section>
  );
}