"use client";
import React, { useState, useEffect } from 'react';

interface ParagraphProps {
  content: any;
  site?: any;
  onUpdate?: (updates: any) => void;
}

export const Paragraph = ({ content, site, onUpdate }: ParagraphProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tempText, setTempText] = useState(content?.text || '');

  // המנעול: מצב עריכה פעיל רק אם יש פונקציית עדכון
  const isEditable = !!onUpdate && typeof onUpdate === 'function';

  useEffect(() => {
    if (content?.text) setTempText(content.text);
  }, [content?.text]);

  if (!content) return null;

  const siteLanguage = site?.theme_settings?.site_language || 'en';
  const isRTL = siteLanguage === 'he';

  const {
    text = 'Add your text content here...',
    font_size,
    text_color,
    font_weight,
    italic,
    align,
    text_align,
    letter_spacing,
    line_height,
    underline,
    strike,
    bottom_line,
    overline,
    uppercase,
    padding,
    padding_top,
    padding_bottom,
    padding_left,
    padding_right,
    margin_top,
    margin_bottom,
    opacity,
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

  // --- לוגיקת עיצוב (משוחזרת במלואה) ---
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
    if (shadow_intensity !== undefined && Number(shadow_intensity) > 0) {
      switch (Number(shadow_intensity)) {
        case 1: return `0px 2px 4px ${color}`;   
        case 2: return `0px 4px 12px ${color}`;  
        case 3: return `0px 12px 24px ${color}`; 
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
    fontSize: font_size ? `${font_size}px` : '16px',
    fontWeight: font_weight || '400',
    fontStyle: italic ? 'italic' : 'normal',
    textAlign: finalTextAlign as any,
    textTransform: uppercase ? 'uppercase' : 'none',
    textDecoration: [
      underline ? 'underline' : '',
      (strike || bottom_line) ? 'line-through' : '',
      overline ? 'overline' : ''
    ].filter(Boolean).join(' ') || 'none',
    letterSpacing: letter_spacing ? `${letter_spacing}px` : 'normal',
    lineHeight: line_height || 1.6,
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
      ? `scale(${hover_scale || 1.05})` 
      : 'scale(1)',
    position: 'relative',
    direction: isRTL ? 'rtl' : 'ltr',
    outline: 'none'
  };

  const handleBlur = (e: React.FocusEvent<HTMLParagraphElement>) => {
    if (isEditable) {
      const newText = e.currentTarget.innerText;
      if (newText !== text) {
        onUpdate({ text: newText });
      }
    }
  };

  const ParagraphElement = (
    <p 
      style={style} 
      className="whitespace-pre-wrap break-words"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      // 🎯 עריכה ישירה
      contentEditable={isEditable}
      suppressContentEditableWarning={true}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        // ב-Paragraph אנחנו מאפשרים Enter לשורות חדשות, לכן לא מונעים אותו כברירת מחדל
        if (e.key === 'Escape') {
          e.currentTarget.blur();
        }
      }}
    >
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
      {tempText}
    </p>
  );

  if (link_enabled && link_url && !isEditable) {
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