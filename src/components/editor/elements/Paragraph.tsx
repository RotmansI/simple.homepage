"use client";
import React, { useState } from 'react';

export const Paragraph = ({ content }: { content: any }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!content) return null;

  const {
    text = 'Add your text content here...',
    font_size,
    text_color,
    font_weight,
    italic,
    // תמיכה בשני שמות שדות האליינמנט
    align,
    text_align,
    letter_spacing,
    line_height,
    // Decorations & Formatting
    underline,
    strike,
    bottom_line, // סנכרון עם הדינג
    overline,
    uppercase,
    // Box Model מורחב
    padding,
    padding_top,
    padding_bottom,
    padding_left,
    padding_right,
    margin_top,
    margin_bottom,
    opacity,
    // Frame/Stroke
    border_width,
    border_color,
    // Shadow & Outline
    outline_w,
    outline_c,
    shadow_intensity,
    shadow_c,
    shadow_color,
    shadow_type,
    shadow_blur,
    shadow_x,
    shadow_y,
    // Interactions
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

  // 1. Fake Stroke - יצירת בורדר לאותיות ללא חניקה
  const getSolidStroke = (isHover: boolean) => {
    const effectiveWidth = border_width || 0;
    const effectiveColor = (isHover && hover_enabled && hover_type === 'colors_swap') 
      ? (hover_border_color || border_color) 
      : (border_color || '#000000');
    
    if (effectiveWidth <= 0) return 'none';
    const w = effectiveWidth;
    const c = effectiveColor;
    return `
      ${w}px ${w}px 0 ${c}, -${w}px ${w}px 0 ${c}, 
      ${w}px -${w}px 0 ${c}, -${w}px -${w}px 0 ${c}, 
      0px ${w}px 0 ${c}, 0px -${w}px 0 ${c}, 
      ${w}px 0px 0 ${c}, -${w}px 0px 0 ${c}
    `;
  };

  // 2. Clean Outline
  const getCleanOutline = () => {
    if (!outline_w || outline_w <= 0) return 'none';
    const c = outline_c || '#000000';
    const w = outline_w;
    return `
      ${w}px ${w}px 0 ${c}, -${w}px ${w}px 0 ${c}, 
      ${w}px -${w}px 0 ${c}, -${w}px -${w}px 0 ${c}, 
      0px ${w}px 0 ${c}, 0px -${w}px 0 ${c}, 
      ${w}px 0px 0 ${c}, -${w}px 0px 0 ${c}
    `;
  };

  // 3. Drop Shadow דינמי (Intensity או חופשי) - תיקון לוגיקת הזרימה
  const getShadow = () => {
    const color = shadow_color || shadow_c || 'rgba(0,0,0,0.2)';
    
    // בדיקת אינטנסיביות (Presets)
    if (shadow_intensity !== undefined && Number(shadow_intensity) > 0) {
      switch (Number(shadow_intensity)) {
        case 1: return `0px 2px 4px ${color}`;   
        case 2: return `0px 4px 12px ${color}`;  
        case 3: return `0px 12px 24px ${color}`; 
      }
    }

    // בדיקת ערכים חופשיים (Custom) - עכשיו זה ירוץ גם אם אין אינטנסיביות
    if (shadow_blur !== undefined || shadow_x !== undefined || shadow_y !== undefined) {
      return `${shadow_x ?? 0}px ${shadow_y ?? 2}px ${shadow_blur ?? 4}px ${color}`;
    }

    // תאימות אחורה לסוגי צל ישנים
    if (shadow_type && shadow_type !== 'none') {
      const blur = shadow_blur ?? 3;
      if (shadow_type === 'soft') return `0px 2px ${blur}px ${color}`;
      if (shadow_type === 'medium') return `0px 4px ${blur * 2}px ${color}`;
      if (shadow_type === 'hard') return `${blur/2}px ${blur/2}px 0px ${color}`;
    }

    return 'none';
  };

  // 4. Glow Effect
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

  const style: React.CSSProperties = {
    color: finalTextColor,
    fontSize: font_size ? `${font_size}px` : '16px',
    fontWeight: font_weight || '400',
    fontStyle: italic ? 'italic' : 'normal',
    textAlign: (align || text_align || 'left') as any,
    textTransform: uppercase ? 'uppercase' : 'none',
    textDecoration: [
      underline ? 'underline' : '',
      (strike || bottom_line) ? 'line-through' : '',
      overline ? 'overline' : ''
    ].filter(Boolean).join(' ') || 'none',
    letterSpacing: letter_spacing ? `${letter_spacing}px` : 'normal',
    lineHeight: line_height || 1.6,
    textShadow: combinedShadow || 'none',
    
    // Box Model מלא
    paddingTop: `${padding_top ?? padding ?? 0}px`,
    paddingBottom: `${padding_bottom ?? padding ?? 0}px`,
    paddingLeft: `${padding_left ?? padding ?? 0}px`,
    paddingRight: `${padding_right ?? padding ?? 0}px`,
    marginTop: `${margin_top ?? 0}px`,
    marginBottom: `${margin_bottom ?? 0}px`,
    
    opacity: (opacity ?? 100) / 100,
    width: '100%',

    // Interactions
    cursor: link_enabled ? 'pointer' : 'default',
    transition: `all ${hover_transition || 0.3}s ease-in-out`,
    transform: (isHovered && hover_enabled && hover_type === 'scale_up') 
      ? `scale(${hover_scale || 1.05})` 
      : 'scale(1)',
    zIndex: isHovered ? 10 : 1,
    position: 'relative',
    border: 'none',
    borderRadius: '0px'
  };

  const ParagraphElement = (
    <p 
      style={style} 
      className="whitespace-pre-wrap break-words transition-all duration-300 relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Wrapping Lines Effect */}
      {hover_enabled && hover_type === 'wrapping_lines' && (
        <>
          <span 
            className={`absolute left-0 right-0 h-[1px] bg-current transition-all duration-500 opacity-0 -top-1 ${isHovered ? 'opacity-100 translate-y-0.5' : ''}`}
            style={{ backgroundColor: finalTextColor }}
          />
          <span 
            className={`absolute left-0 right-0 h-[1px] bg-current transition-all duration-500 opacity-0 -bottom-1 ${isHovered ? 'opacity-100 -translate-y-0.5' : ''}`}
            style={{ backgroundColor: finalTextColor }}
          />
        </>
      )}
      {text}
    </p>
  );

  if (link_enabled && link_url) {
    return (
      <a 
        href={link_url} 
        target={link_target_blank ? "_blank" : "_self"} 
        rel={link_target_blank ? "noopener noreferrer" : ""}
        style={{ display: 'block', width: '100%', textDecoration: 'none', color: 'inherit' }}
      >
        {ParagraphElement}
      </a>
    );
  }

  return ParagraphElement;
};