"use client";
import React, { useState, useEffect } from 'react';

interface HeadingProps {
  content: any;
  site?: any;
  onUpdate?: (updates: Record<string, any>) => void;
}

export const Heading = ({ content, site, onUpdate }: HeadingProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tempText, setTempText] = useState(content?.text || '');
  
  // המנעול: עריכה תתאפשר רק אם קיבלנו פונקציית עדכון (מצב אדיטור)
  const isEditable = !!onUpdate && typeof onUpdate === 'function';

  useEffect(() => {
    if (content?.text) setTempText(content.text);
  }, [content?.text]);

  if (!content) return null;

  const siteLanguage = site?.theme_settings?.site_language || 'en';
  const isRTL = siteLanguage === 'he';

  const {
    text = 'New Heading',
    font_size,
    text_color,
    font_weight,
    italic,
    align,
    text_align,
    underline,
    uppercase,
    bottom_line,
    line_height,
    letter_spacing,
    padding,
    margin_top,
    margin_bottom,
    padding_top,
    padding_bottom,
    padding_left,
    padding_right,
    border_width,
    border_color,
    outline_w,
    outline_c,
    shadow_intensity,
    shadow_c,
    shadow_color,
    shadow_blur,
    shadow_x,
    shadow_y,
    opacity,
    hover_enabled,
    hover_type,
    hover_scale,
    hover_transition,
    hover_text_color,
    hover_border_color,
    hover_glow_color,
    link_enabled,
    link_url,
    link_target_blank
  } = content;

  // --- לוגיקת עיצוב (משוחזרת במלואה מהקוד המקורי שלך) ---
  const getSolidStroke = (isHover: boolean) => {
    const effectiveWidth = border_width || 0;
    const effectiveColor = (isHover && hover_enabled && hover_type === 'colors_swap') 
      ? (hover_border_color || border_color) 
      : (border_color || '#000000');
    if (effectiveWidth <= 0) return 'none';
    const w = effectiveWidth;
    const c = effectiveColor;
    return `${w}px ${w}px 0 ${c}, -${w}px ${w}px 0 ${c}, ${w}px -${w}px 0 ${c}, -${w}px -${w}px 0 ${c}, 0px ${w}px 0 ${c}, 0px -${w}px 0 ${c}, ${w}px 0px 0 ${c}, -${w}px 0px 0 ${c}`;
  };

  const getCleanOutline = () => {
    if (!outline_w || outline_w <= 0) return 'none';
    const c = outline_c || '#000000';
    const w = outline_w;
    return `${w}px ${w}px 0 ${c}, -${w}px ${w}px 0 ${c}, ${w}px -${w}px 0 ${c}, -${w}px -${w}px 0 ${c}, 0px ${w}px 0 ${c}, 0px -${w}px 0 ${c}, ${w}px 0px 0 ${c}, -${w}px 0px 0 ${c}`;
  };

  const getShadow = () => {
    const color = shadow_color || shadow_c || 'rgba(0,0,0,0.2)';
    if (shadow_intensity !== undefined && shadow_intensity > 0) {
      switch (shadow_intensity) {
        case 1: return `0px 2px 4px ${color}`;   
        case 2: return `0px 4px 12px ${color}`;  
        case 3: return `0px 12px 24px ${color}`; 
        default: return 'none';
      }
    }
    if (shadow_blur !== undefined || shadow_x !== undefined || shadow_y !== undefined) {
      return `${shadow_x ?? 0}px ${shadow_y ?? 2}px ${shadow_blur ?? 4}px ${color}`;
    }
    return 'none';
  };

  const getGlowShadow = (isHover: boolean) => {
    if (isHover && hover_enabled && hover_type === 'glow') {
      const c = hover_glow_color || '#6366f1';
      return `0px 0px 15px ${c}, 0px 0px 30px ${c}`;
    }
    return 'none';
  };

  const combinedShadow = [
    getSolidStroke(isHovered), 
    getCleanOutline(), 
    getShadow(),
    getGlowShadow(isHovered)
  ].filter(s => s !== 'none').join(', ');

  const finalTextColor = (isHovered && hover_enabled && hover_type === 'colors_swap')
    ? hover_text_color
    : (text_color || 'inherit');

  const finalTextAlign = align || text_align || (isRTL ? 'right' : 'left');

  const style: React.CSSProperties = {
    color: finalTextColor,
    fontSize: font_size ? `${font_size}px` : 'inherit',
    fontWeight: font_weight || '400',
    fontStyle: italic ? 'italic' : 'normal',
    textAlign: finalTextAlign as any,
    textTransform: uppercase ? 'uppercase' : 'none',
    textDecoration: [
      underline ? 'underline' : '',
      bottom_line ? 'line-through' : ''
    ].filter(Boolean).join(' ') || 'none',
    lineHeight: line_height || '1.2',
    letterSpacing: letter_spacing ? `${letter_spacing}px` : 'normal',
    textShadow: combinedShadow || 'none',
    paddingTop: `${padding_top ?? padding ?? 0}px`,
    paddingBottom: `${padding_bottom ?? padding ?? 0}px`,
    paddingLeft: `${padding_left ?? padding ?? 0}px`,
    paddingRight: `${padding_right ?? padding ?? 0}px`,
    marginTop: `${margin_top ?? 0}px`,
    marginBottom: `${margin_bottom ?? 0}px`,
    opacity: (opacity ?? 100) / 100,
    width: '100%',
    cursor: isEditable ? 'text' : (link_enabled ? 'pointer' : 'default'),
    transition: `all ${hover_transition || 0.3}s ease-in-out`,
    transform: (isHovered && hover_enabled && hover_type === 'scale_up') 
      ? `scale(${hover_scale || 1.1})` 
      : 'scale(1)',
    position: 'relative',
    direction: isRTL ? 'rtl' : 'ltr',
    outline: 'none'
  };

  const handleBlur = (e: React.FocusEvent<HTMLHeadingElement>) => {
    if (isEditable) {
      const newText = e.currentTarget.innerText;
      if (newText !== text) {
        onUpdate({ text: newText });
      }
    }
  };

  const HeadingElement = (
    <h2 
      style={style} 
      className="whitespace-pre-wrap break-words"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // 🎯 כאן קורה הקסם: עריכה ישירה על האלמנט
      contentEditable={isEditable}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    >
      {/* אפקט ה-wrapping lines נשאר כחלק מהעיצוב */}
      {hover_enabled && hover_type === 'wrapping_lines' && (
        <>
          <span 
            className={`absolute left-0 right-0 h-[2px] bg-current transition-all duration-500 opacity-0 -top-2 ${isHovered ? 'opacity-100 translate-y-1' : ''}`}
            style={{ backgroundColor: finalTextColor }}
          />
          <span 
            className={`absolute left-0 right-0 h-[2px] bg-current transition-all duration-500 opacity-0 -bottom-2 ${isHovered ? 'opacity-100 -translate-y-1' : ''}`}
            style={{ backgroundColor: finalTextColor }}
          />
        </>
      )}
      {tempText}
    </h2>
  );

  // הלינק פעיל רק באתר הציבורי
  if (link_enabled && link_url && !isEditable) {
    return (
      <a 
        href={link_url} 
        target={link_target_blank ? "_blank" : "_self"} 
        rel={link_target_blank ? "noopener noreferrer" : ""}
        style={{ display: 'block', width: '100%', textDecoration: 'none' }}
      >
        {HeadingElement}
      </a>
    );
  }

  return HeadingElement;
};