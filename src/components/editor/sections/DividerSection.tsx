"use client";

import React from 'react';

export default function DividerSection({ content }: any) {
  const containerStyle = {
    backgroundColor: content.bg_color || 'transparent',
    height: `${content.height || 100}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    padding: '0 20px'
  };

  const lineStyle = {
    height: `${content.weight || 2}px`,
    backgroundColor: content.color || 'var(--brand-secondary)',
    flex: 1,
    border: 'none',
    borderRadius: '100px',
    // לוגיקה לצורות שונות (קו רגיל או פייד)
    background: content.style === 'fade' 
      ? `linear-gradient(to right, transparent, ${content.color || 'var(--brand-secondary)'}, transparent)` 
      : content.color || 'var(--brand-secondary)'
  };

  return (
    <div style={containerStyle}>
      <div style={lineStyle} />
      {content.text && (
        <span className="px-6 font-black uppercase tracking-widest text-[10px] whitespace-nowrap"
              style={{ color: content.color || 'var(--brand-neutral)' }}>
          {content.text}
        </span>
      )}
      <div style={lineStyle} />
    </div>
  );
}