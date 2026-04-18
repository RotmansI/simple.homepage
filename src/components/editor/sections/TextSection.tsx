"use client";

import React from 'react';

interface TextProps {
  content: {
    title: string;
    body: string;
    align: 'right' | 'center' | 'left';
  };
}

export default function TextSection({ content }: TextProps) {
  return (
    <div className="py-24 px-8 md:px-20 bg-[var(--brand-secondary)]/10">
      <div className="max-w-4xl mx-auto" style={{ textAlign: content.align || 'right' }}>
        {content.title && (
          <div className="inline-block mb-8">
            <h2 className="text-3xl md:text-5xl font-black" style={{ color: 'var(--brand-neutral)' }}>
              {content.title}
            </h2>
            <div className="h-2 w-1/2 mt-2 rounded-full" style={{ backgroundColor: 'var(--brand-accent)' }} />
          </div>
        )}
        <div 
          className="text-lg md:text-2xl leading-relaxed whitespace-pre-wrap opacity-80"
          style={{ color: 'var(--brand-neutral)' }}
        >
          {content.body}
        </div>
      </div>
    </div>
  );
}