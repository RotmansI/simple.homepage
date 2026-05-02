"use client";

import React from 'react';

export default function DividerSection({ content, site }: any) {
  // חילוץ שפת האתר מתוך הגדרות העיצוב (ברירת מחדל: אנגלית)
  const siteLanguage = site?.theme_settings?.site_language || 'en';
  const isRTL = siteLanguage === 'he';

  const containerStyle = {
    backgroundColor: content.bg_color || 'transparent',
    height: `${content.height || 100}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    padding: '0 20px',
    // הבטחת כיווניות נכונה לסידור הטקסט והקווים
    flexDirection: isRTL ? 'row-reverse' as const : 'row' as const
  };

  // התאמת ה-Gradient לסגנון fade בהתאם לכיוון האתר
  const getLineBackground = () => {
    const color = content.color || 'var(--brand-secondary)';
    if (content.style === 'fade') {
      // ב-RTL אנחנו רוצים שהגרדיאנט יזרום נכון, למרות שב-fade סימטרי זה פחות קריטי, 
      // זה חשוב לתאימות דפדפנים ועיצובים עתידיים
      const direction = isRTL ? 'to left' : 'to right';
      return `linear-gradient(${direction}, transparent, ${color}, transparent)`;
    }
    return color;
  };

  const lineStyle = {
    height: `${content.weight || 2}px`,
    backgroundColor: content.color || 'var(--brand-secondary)',
    flex: 1,
    border: 'none',
    borderRadius: '100px',
    background: getLineBackground()
  };

  return (
    <div style={containerStyle} dir={isRTL ? 'rtl' : 'ltr'}>
      <div style={lineStyle} />
      
      {content.text && (
        <span 
          className="px-6 font-black uppercase tracking-widest text-[10px] whitespace-nowrap"
          style={{ 
            color: content.color || 'var(--brand-neutral)',
            // היפוך כיוון הכתיבה בתוך הספאן במידת הצורך
            direction: isRTL ? 'rtl' : 'ltr'
          }}
        >
          {content.text}
        </span>
      )}
      
      <div style={lineStyle} />
    </div>
  );
}