"use client";

import React from 'react';

interface TextProps {
  section: any;
  site?: any;
}

export default function TextSection({ section, site }: TextProps) {
  const { content } = section;
  
  // חילוץ שפת האתר וקביעת כיווניות
  const siteLanguage = site?.theme_settings?.site_language || 'en';
  const isRTL = siteLanguage === 'he';

  // קביעת היישור: עדיפות להגדרה מפורשת, אחרת לפי שפת האתר
  const finalAlign = content.align || (isRTL ? 'right' : 'left');

  return (
    <div 
      className="py-24 px-8 md:px-20 bg-[var(--brand-secondary)]/10" 
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div 
        className="max-w-4xl mx-auto transition-all duration-500" 
        style={{ textAlign: finalAlign }}
      >
        {content.title && (
          <div className="inline-block mb-8">
            <h2 
              className="text-3xl md:text-5xl font-black transition-colors" 
              style={{ color: 'var(--brand-neutral)' }}
            >
              {content.title}
            </h2>
            {/* קו דקורטיבי - מתיישר לצד הנכון בזכות ה-dir של האבא */}
            <div 
              className="h-2 w-1/2 mt-2 rounded-full" 
              style={{ backgroundColor: 'var(--brand-accent)' }} 
            />
          </div>
        )}
        
        <div 
          className="text-lg md:text-2xl leading-relaxed whitespace-pre-wrap opacity-80"
          style={{ 
            color: 'var(--brand-neutral)',
            // הבטחת כיווניות הטקסט בתוך הבלוק
            direction: isRTL ? 'rtl' : 'ltr'
          }}
        >
          {content.body}
        </div>
      </div>
    </div>
  );
}