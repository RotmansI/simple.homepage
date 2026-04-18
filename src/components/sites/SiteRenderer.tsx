"use client";

import React from 'react';
import HeroSection from '@/components/editor/sections/HeroSection';
import GallerySection from '@/components/editor/sections/GallerySection';
import FlexSection from '@/components/editor/sections/FlexSection';
// אם יש סקשנים שעדיין לא עדכנו לרמת "Section Object", נשאיר אותם כרגע עם content
import TextSection from '@/components/editor/sections/TextSection';
import MenuSection from '@/components/editor/sections/MenuSection';
import DividerSection from '@/components/editor/sections/DividerSection';

export default function SiteRenderer({ sections, theme }: { sections: any[], theme: any }) {
  if (!sections || sections.length === 0) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --brand-primary: ${theme?.primary_color || '#0B4440'};
          --brand-secondary: ${theme?.secondary_color || '#E5F2F1'};
          --brand-accent: ${theme?.accent_color || '#F59E0B'};
          --brand-neutral: ${theme?.neutral_color || '#1F2937'};
        }
      `}} />
      
      <div className="flex flex-col">
        {sections.map((s: any) => {
          // בגלל שעדכנו את הרינדור, אנחנו מעבירים את ה-section המלא (s) 
          // ולא רק את ה-content שלו עבור הסקשנים החדשים
          
          switch (s.type) {
            case 'hero': 
              return <HeroSection key={s.id} section={s} isSelected={false} />;
            
            case 'flex': 
              return <FlexSection key={s.id} section={s} />;
            
            case 'gallery': 
              return <GallerySection key={s.id} section={s} isEditor={false} />;

            // סקשנים שטרם עברו הסבה למבנה החדש - ממשיכים לקבל content
            case 'text': 
              return <TextSection key={s.id} content={s.content || {}} />;
            
            case 'menu': 
              return <MenuSection key={s.id} content={s.content || {}} />;
            
            case 'divider':
              return <DividerSection key={s.id} content={s.content || {}} />;
            
            default: 
              return null;
          }
        })}
      </div>
    </>
  );
}