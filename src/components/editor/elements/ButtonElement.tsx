"use client";
import React, { useState, useEffect } from 'react';

// פונקציית עזר לחישוב ניגודיות - נשארת ללא שינוי
const getContrastColor = (hexColor: string) => {
  if (!hexColor || hexColor === 'transparent') return '#ffffff';
  const hex = hexColor.replace('#', '');
  if (hex.length < 6) return '#ffffff';
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return (yiq >= 128) ? '#000000' : '#ffffff';
};

interface ButtonElementProps {
  content: any;
  site?: any;
  onUpdate?: (updates: any) => void;
}

export const ButtonElement = ({ content, site, onUpdate }: ButtonElementProps) => {
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
    text = 'Click Me',
    link,
    font_size,
    text_color,
    font_weight,
    italic,
    uppercase,
    font_family,
    letter_spacing,
    line_height,
    underline,
    strike,
    bottom_line,
    bg_color,
    opacity,
    align, 
    text_align, 
    border_radius,
    border_width,
    border_color,
    border_style,
    padding, padding_top, padding_bottom, padding_left, padding_right,
    margin_top, margin_bottom,
    hover_enabled,
    hover_type,
    hover_scale,
    hover_transition,
    hover_bg_color,
    hover_text_color,
    hover_border_color,
    hover_glow_color,
    link_enabled,
    link_url,
    link_target_blank,
    is_outline
  } = content;

  const finalAlign = align || text_align || (isRTL ? 'right' : 'left');
  const defaultBg = '#4F46E5'; 
  const currentBgColor = bg_color || defaultBg;

  // --- לוגיקת צבעים (ללא שינוי) ---
  let baseBg, baseTextColor, baseBorderColor, baseBorderW;
  if (is_outline) {
    baseBg = currentBgColor.startsWith('#') ? `${currentBgColor}44` : currentBgColor;
    baseTextColor = currentBgColor;
    baseBorderColor = currentBgColor;
    baseBorderW = border_width || 2;
  } else {
    baseBg = currentBgColor;
    baseTextColor = text_color || getContrastColor(currentBgColor);
    baseBorderColor = border_color || 'transparent';
    baseBorderW = border_width || 0;
  }

  let currentBg = baseBg;
  let currentTextColor = baseTextColor;
  let currentBorderColor = baseBorderColor;

  if (isHovered && hover_enabled && hover_type === 'colors_swap') {
    if (is_outline) {
      currentBg = hover_bg_color || (currentBgColor.startsWith('#') ? `${currentBgColor}88` : currentBgColor);
      currentTextColor = hover_text_color || baseTextColor;
      currentBorderColor = hover_border_color || baseBorderColor;
    } else {
      currentBg = hover_bg_color || '#000000';
      currentTextColor = hover_text_color || getContrastColor(currentBg);
      currentBorderColor = hover_border_color || currentBg;
    }
  }

  const style: React.CSSProperties = {
    backgroundColor: currentBg,
    color: currentTextColor,
    borderRadius: `${border_radius ?? 12}px`,
    borderWidth: `${baseBorderW}px`,
    borderColor: currentBorderColor,
    borderStyle: (border_style as any) || 'solid',
    fontSize: font_size ? `${font_size}px` : '16px',
    fontWeight: font_weight || '600',
    fontStyle: italic ? 'italic' : 'normal',
    textTransform: uppercase ? 'uppercase' : 'none',
    textDecoration: [underline ? 'underline' : '', (strike || bottom_line) ? 'line-through' : ''].filter(Boolean).join(' ') || 'none',
    letterSpacing: letter_spacing ? `${letter_spacing}px` : 'normal',
    lineHeight: line_height || '1',
    paddingTop: `${padding_top ?? padding ?? 12}px`,
    paddingBottom: `${padding_bottom ?? padding ?? 12}px`,
    paddingLeft: `${padding_left ?? padding ?? 24}px`,
    paddingRight: `${padding_right ?? padding ?? 24}px`,
    marginTop: `${margin_top || 0}px`,
    marginBottom: `${margin_bottom || 0}px`,
    transition: `all ${hover_transition || 0.3}s cubic-bezier(0.4, 0, 0.2, 1)`,
    transform: (isHovered && hover_enabled && hover_type === 'scale_up') ? `scale(${hover_scale || 1.05})` : 'scale(1)',
    boxShadow: (isHovered && hover_enabled && hover_type === 'glow') ? `0 0 15px ${hover_glow_color || currentBg || '#6366f1'}` : 'none',
    opacity: (opacity ?? 100) / 100,
    cursor: isEditable ? 'text' : 'pointer',
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    boxSizing: 'border-box',
    direction: isRTL ? 'rtl' : 'ltr'
  };

  const familyClass = font_family === 'serif' ? 'font-serif' : font_family === 'mono' ? 'font-mono' : 'font-sans';

  const handleBlur = (e: React.FocusEvent<HTMLSpanElement>) => {
    if (isEditable) {
      const newText = e.currentTarget.innerText;
      if (newText !== text) {
        onUpdate({ text: newText });
      }
    }
  };

  const handleAction = (e: React.MouseEvent) => {
    // באדיטור אנחנו מונעים את הלינק כדי לאפשר עריכה ובחירה
    if (isEditable) {
      e.preventDefault();
      return;
    }

    const targetUrl = link_enabled ? link_url : link;
    if (!targetUrl) return;
    const finalUrl = targetUrl.startsWith('http') ? targetUrl : `https://${targetUrl}`;
    window.open(finalUrl, (link_enabled ? link_target_blank : true) ? '_blank' : '_self');
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        width: '100%', 
        justifyContent: finalAlign === 'center' ? 'center' : finalAlign === 'right' ? 'flex-end' : 'flex-start' 
      }}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <button
        style={style}
        className={`${familyClass} shadow-sm active:scale-95 transition-all group overflow-visible`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleAction}
      >
        <span 
          className="relative flex items-center justify-center outline-none"
          // 🎯 עריכה ישירה על ה-span שבתוך הכפתור
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
          {tempText || (isRTL ? 'לחץ כאן' : 'Click Me')}
          
          {/* אפקט הקווים נשאר כחלק מהעיצוב */}
          {hover_enabled && hover_type === 'wrapping_lines' && (
            <>
              <div 
                className={`absolute -top-1.5 left-0 w-full h-[1.5px] transition-all duration-500 transform origin-left
                  ${isHovered ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}
                style={{ backgroundColor: currentTextColor }}
              />
              <div 
                className={`absolute -bottom-1.5 left-0 w-full h-[1.5px] transition-all duration-500 transform origin-right
                  ${isHovered ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0'}`}
                style={{ backgroundColor: currentTextColor }}
              />
            </>
          )}
        </span>
      </button>
    </div>
  );
};