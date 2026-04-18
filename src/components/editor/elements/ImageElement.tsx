"use client";
import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

export const ImageElement = ({ content }: { content: any }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!content) return null;

  const {
    url,
    width,
    // Box Model
    padding, padding_top, padding_bottom, padding_left, padding_right,
    margin_top, margin_bottom,
    // Frame & Border
    border_width, border_color, border_style, border_radius,
    // Shadow
    shadow_intensity, shadow_color, shadow_c,
    shadow_blur, shadow_x, shadow_y,
    opacity,
    text_align,
    // Interactions
    hover_enabled,
    hover_type,
    hover_scale,
    hover_zoom,
    hover_transition,
    hover_border_color,
    hover_glow_color,
    hover_image_url,
    hover_swap_mode,
    link_enabled,
    link_url,
    link_target_blank
  } = content;

  // פתרון היישור (Alignment)
  const alignmentClass = text_align === 'center' ? 'justify-center' : text_align === 'right' ? 'justify-end' : 'justify-start';

  // חישוב צל (תומך ב-Intensity ובערכים חופשיים)
  const getShadow = () => {
    const c = shadow_color || shadow_c || 'rgba(0,0,0,0.15)';
    if (shadow_intensity && shadow_intensity > 0) {
      switch (shadow_intensity) {
        case 1: return `0 2px 4px ${c}`;
        case 2: return `0 8px 16px ${c}`;
        case 3: return `0 16px 32px ${c}`;
        default: return 'none';
      }
    }
    if (shadow_blur !== undefined) {
      return `${shadow_x || 0}px ${shadow_y || 4}px ${shadow_blur}px ${c}`;
    }
    return 'none';
  };

  // עיצוב הקונטיינר החיצוני (אחראי על צללים, גלואו ומיקום)
  const containerStyle: React.CSSProperties = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : '200px',
    maxWidth: '100%',
    marginTop: `${margin_top || 0}px`,
    marginBottom: `${margin_bottom || 0}px`,
    paddingTop: `${padding_top ?? padding ?? 0}px`,
    paddingBottom: `${padding_bottom ?? padding ?? 0}px`,
    paddingLeft: `${padding_left ?? padding ?? 0}px`,
    paddingRight: `${padding_right ?? padding ?? 0}px`,
    opacity: (opacity ?? 100) / 100,
    transition: `all ${hover_transition || 0.4}s cubic-bezier(0.4, 0, 0.2, 1)`,
    transform: (isHovered && hover_enabled && hover_type === 'scale_up') 
      ? `scale(${hover_scale || 1.1})` 
      : 'scale(1)',
    zIndex: isHovered ? 10 : 1,
    position: 'relative',
    // החלת גלואו או צל רגיל
    boxShadow: (isHovered && hover_enabled && hover_type === 'glow') 
      ? `0 0 20px 2px ${hover_glow_color || '#6366f1'}` 
      : getShadow(),
    borderRadius: `${border_radius ?? 0}px`,
  };

  // עיצוב המעטפת הפנימית (אחראית על בורדר ו-Overflow לחיתוך תמונות)
  const innerWrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 'inherit', // יורש מהקונטיינר
    borderWidth: border_width ? `${border_width}px` : '0px',
    borderColor: (isHovered && hover_enabled && hover_type === 'colors_swap') 
      ? (hover_border_color || border_color || '#000000') 
      : (border_color || 'transparent'),
    borderStyle: border_style || 'solid',
    backgroundColor: 'transparent',
    transition: `border-color ${hover_transition || 0.4}s ease`,
  };

  const imageMarkup = (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={containerStyle}
      className="cursor-pointer transition-all"
    >
      <div style={innerWrapperStyle}>
        {url ? (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* תמונה ראשית */}
            <img 
              src={url} 
              alt="" 
              style={{
                transform: (isHovered && hover_enabled && hover_type === 'zoom_in') ? `scale(${hover_zoom || 1.2})` : 'scale(1)',
                opacity: (isHovered && hover_enabled && hover_type === 'image_swap' && hover_swap_mode === 'fade' && hover_image_url) ? 0 : 1,
                transition: `all ${hover_transition || 0.7}s ease-in-out`
              }}
              className="w-full h-auto block object-cover" 
            />
            
            {/* תמונת Swap (מופיעה רק ב-Hover במידה והוגדרה) */}
            {hover_enabled && hover_type === 'image_swap' && hover_image_url && (
              <img 
                src={hover_image_url}
                alt=""
                style={{
                  opacity: isHovered ? 1 : 0,
                  transform: hover_swap_mode === 'slide' ? (isHovered ? 'translateY(0)' : 'translateY(100%)') : 'none',
                  transition: `all ${hover_transition || 0.5}s ease-in-out`
                }}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>
        ) : (
          /* פלייסהולדר מינימליסטי */
          <div className="w-full py-8 bg-white/5 backdrop-blur-[4px] border border-white/10 flex flex-col items-center justify-center gap-2 group">
            <div className="p-2.5 rounded-full bg-white/5 text-white/20 group-hover:text-white/40 transition-colors">
              <ImageIcon size={16} strokeWidth={2} />
            </div>
            <span className="text-[7px] font-black uppercase tracking-[0.25em] text-white/30">
              Empty Media
            </span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`w-full flex ${alignmentClass}`}>
      {link_enabled && link_url ? (
        <a 
          href={link_url} 
          target={link_target_blank ? "_blank" : "_self"} 
          rel="noopener noreferrer"
          className="contents"
        >
          {imageMarkup}
        </a>
      ) : (
        imageMarkup
      )}
    </div>
  );
};