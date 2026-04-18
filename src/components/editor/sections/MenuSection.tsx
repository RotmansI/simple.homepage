"use client";

import React from 'react';

export default function MenuSection({ content }: any) {
  const categories = content.categories || [];

  return (
    <div className="py-24 px-8 md:px-20 bg-white">
      <div className="max-w-5xl mx-auto">
        {content.title && (
          <h2 className="text-5xl font-black mb-20 text-center uppercase tracking-tighter" 
              style={{ color: 'var(--brand-neutral)' }}>
            {content.title}
          </h2>
        )}

        <div className="space-y-24">
          {categories.map((cat: any) => (
            <div key={cat.id} className="group">
              <div className="flex items-center gap-6 mb-12">
                <h3 className="text-3xl font-black whitespace-nowrap italic" 
                    style={{ color: 'var(--brand-primary)' }}>
                  {cat.title}
                </h3>
                <div className="h-px flex-1" style={{ backgroundColor: 'var(--brand-secondary)' }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
                {cat.items?.map((item: any) => (
                  <div key={item.id} className="relative pb-6 border-b border-[var(--brand-secondary)]/30 group/item">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <h4 className="font-black text-xl transition-colors group-hover/item:text-[var(--brand-primary)]" 
                          style={{ color: 'var(--brand-neutral)' }}>
                        {item.name}
                      </h4>
                      <span className="font-black text-xl px-3 py-1 rounded-lg" 
                            style={{ backgroundColor: 'var(--brand-secondary)', color: 'var(--brand-primary)' }}>
                        ₪{item.price}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed opacity-60 font-medium" 
                       style={{ color: 'var(--brand-neutral)' }}>
                      {item.description}
                    </p>
                    {/* אלמנט עיצובי קטן */}
                    <div className="absolute bottom-0 right-0 h-0.5 w-0 group-hover/item:w-full transition-all duration-500" 
                         style={{ backgroundColor: 'var(--brand-accent)' }} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}