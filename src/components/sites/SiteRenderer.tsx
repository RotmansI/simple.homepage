"use client";

import React from 'react';
import HeroSection from '@/components/editor/sections/HeroSection';
import GallerySection from '@/components/editor/sections/GallerySection';
import FlexSection from '@/components/editor/sections/FlexSection';
import TextSection from '@/components/editor/sections/TextSection';
import MenuSection from '@/components/editor/sections/MenuSection';
import DividerSection from '@/components/editor/sections/DividerSection';
import { getGoogleFontsUrl } from '@/utils/fonts';

export default function SiteRenderer({ sections, theme }: { sections: any[], theme: any }) {
  if (!sections || sections.length === 0) return null;

  // חילוץ שפת האתר וקביעת כיווניות
  const siteLanguage = theme?.site_language || 'en';
  const isRTL = siteLanguage === 'he';

  // יצירת אובייקט קונטקסט עבור הסקשנים כדי שיזהו את השפה
  const siteContext = {
    theme_settings: theme
  };

  // הפקת ה-URL של הפונטים מגוגל
  const googleFontsLink = getGoogleFontsUrl(theme?.primary_font, theme?.secondary_font);

  return (
    <>
      {/* הזרקת הפונטים מגוגל */}
      {googleFontsLink && <link rel="stylesheet" href={googleFontsLink} />}

      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --brand-primary: ${theme?.primary_color || '#0B4440'};
          --brand-secondary: ${theme?.secondary_color || '#E5F2F1'};
          --brand-accent: ${theme?.accent_color || '#F59E0B'};
          --brand-neutral: ${theme?.neutral_color || '#1F2937'};
          
          /* הגדרת משתני הפונטים */
          --font-primary: '${theme?.primary_font || 'Assistant'}', sans-serif;
          --font-secondary: '${theme?.secondary_font || 'Heebo'}', sans-serif;
        }

        /* החלה גלובלית על כל האתר הציבורי */
        body {
          direction: ${isRTL ? 'rtl' : 'ltr'};
          text-align: ${isRTL ? 'right' : 'left'};
        }

        h1, h2, h3, h4, h5, h6, .font-primary {
          font-family: var(--font-primary) !important;
        }

        body, p, span, div, button, input, .font-secondary {
          font-family: var(--font-secondary) !important;
        }
      `}} />
      
      <div className="flex flex-col" dir={isRTL ? 'rtl' : 'ltr'}>
        {sections.map((s: any) => {
          // העברת siteContext לכל סקשן כדי שידע להתנהג בהתאם לשפה
          switch (s.type) {
            case 'hero': 
              return <HeroSection key={s.id} section={s} isSelected={false} site={siteContext} />;
            
            case 'flex': 
              return <FlexSection key={s.id} section={s} site={siteContext} />;
            
            case 'gallery': 
              return <GallerySection key={s.id} section={s} isEditor={false} site={siteContext} />;

            case 'menu': 
              return <MenuSection key={s.id} section={s} site={siteContext} />;

            case 'text': 
              // תיקון השגיאה: העברת section במקום content
              return <TextSection key={s.id} section={s} site={siteContext} />;
            
            case 'divider':
              return <DividerSection key={s.id} content={s.content || {}} site={siteContext} />;
            
            default: 
              return null;
          }
        })}
      </div>
    </>
  );
}