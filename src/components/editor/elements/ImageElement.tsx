"use client";
import React, { useState } from 'react';
import { ImageIcon } from 'lucide-react';

interface ImageElementProps {
  content: any;
  site?: any;
  onUpdate?: (updates: any) => void;
}

export const ImageElement = ({ content, site, onUpdate }: ImageElementProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // המנעול: מצב עריכה פעיל רק אם יש פונקציית עדכון
  const isEditable = !!onUpdate && typeof onUpdate === 'function';

  if (!content) return null;

  // אם אין תמונה ואנחנו באתר החי - פשוט לא מרנדרים כלום
  if (!content.url && !isEditable) return null;

  const siteLanguage = site?.theme_settings?.site_language || 'en';
  const isRTL = siteLanguage === 'he';

  const {
    url,
    width,
    padding, padding_top, padding_bottom, padding_left, padding_right,
    margin_top, margin_bottom,
    border_width, border_color, border_style, border_radius,
    shadow_intensity, shadow_color, shadow_c,
    shadow_blur, shadow_x, shadow_y,
    opacity,
    text_align,
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

  const finalAlign = text_align || (isRTL ? 'right' : 'left');
  const alignmentClass = finalAlign === 'center' ? 'justify-center' : finalAlign === 'right' ? 'justify-end' : 'justify-start';

  // 🎯 התיקון הקריטי: וידוא יחידות מידה (px) לרוחב התמונה
  const finalWidth = width 
    ? (width.toString().includes('%') || width.toString().includes('px') ? width : `${width}px`)
    : '200px';

  // לוגיקת הצללים
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

  const containerStyle: React.CSSProperties = {
    width: finalWidth, // שימוש ברוחב המעובד
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
    boxShadow: (isHovered && hover_enabled && hover_type === 'glow') 
      ? `0 0 20px 2px ${hover_glow_color || '#6366f1'}` 
      : getShadow(),
    borderRadius: `${border_radius ?? 0}px`,
    direction: isRTL ? 'rtl' : 'ltr',
    cursor: isEditable ? 'pointer' : (link_enabled ? 'pointer' : 'default')
  };

  const innerWrapperStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    overflow: 'hidden',
    borderRadius: 'inherit',
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
      className="group/img transition-all"
    >
      <div style={innerWrapperStyle}>
        {url ? (
          <div className="relative w-full h-full flex items-center justify-center">
            <img 
              src={(isHovered && hover_enabled && hover_type === 'image_swap' && hover_image_url) ? hover_image_url : url} 
              alt="" 
              style={{
                transform: (isHovered && hover_enabled && hover_type === 'zoom_in') ? `scale(${hover_zoom || 1.2})` : 'scale(1)',
                transition: `all ${hover_transition || 0.7}s ease-in-out`
              }}
              className="w-full h-auto block object-cover" 
            />
          </div>
        ) : (
          isEditable && (
            <div className="w-full py-8 bg-white/5 backdrop-blur-[4px] border border-white/10 flex flex-col items-center justify-center gap-2 group">
              <div className="p-2.5 rounded-full bg-white/5 text-white/20 group-hover:text-white/40 transition-colors">
                <ImageIcon size={16} strokeWidth={2} />
              </div>
              <span className="text-[7px] font-black uppercase tracking-[0.25em] text-white/30">
                {isRTL ? 'מדיה ריקה' : 'Empty Media'}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );

  if (link_enabled && link_url && !isEditable) {
    return (
      <div className={`w-full flex ${alignmentClass}`}>
        <a 
          href={link_url} 
          target={link_target_blank ? "_blank" : "_self"} 
          rel="noopener noreferrer"
          className="contents"
        >
          {imageMarkup}
        </a>
      </div>
    );
  }

  return (
    <div className={`w-full flex ${alignmentClass}`}>
      {imageMarkup}
    </div>
  );
};