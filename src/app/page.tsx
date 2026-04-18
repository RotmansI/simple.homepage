"use client";

import React, { useState } from 'react';
import { translations, Language } from '@/lib/translations';
import { ChevronRight, Globe } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const [lang, setLang] = useState<Language>('en');
  const t = translations[lang];
  const isRtl = lang === 'he';

  const toggleLanguage = () => {
    setLang(lang === 'en' ? 'he' : 'en');
  };

  return (
    <div className={`min-h-screen bg-brand-pearl text-brand-dark transition-all duration-300`} dir={t.dir}>
      
      {/* Navigation */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-brand-lavender sticky top-0 z-50">
        <div className="flex items-center gap-3">
          {/* שימוש בלוגו החדש */}
          <img 
            src="/simple-logo.png" 
            alt="Simple." 
            className="h-10 w-auto object-contain"
          />
        </div>

        <div className="flex items-center gap-4 md:gap-8">
          <button 
            onClick={toggleLanguage}
            className="flex items-center gap-2 text-sm font-black text-brand-indigo hover:bg-brand-lavender/50 px-3 py-2 rounded-xl transition-all"
          >
            <Globe size={18} />
            {t.switchLang}
          </button>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/auth/login" className="text-sm font-black text-brand-midnight hover:text-brand-indigo transition-colors uppercase tracking-tight">
              {t.login}
            </Link>
            <Link href="/auth/register" className="bg-brand-indigo text-white px-8 py-3 rounded-full font-black text-sm hover:scale-105 transition-all shadow-lg shadow-brand-indigo/20 uppercase tracking-tight">
              {t.register}
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-8 text-start">
            <div className="inline-flex items-center gap-2 bg-brand-lime text-brand-midnight px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-midnight/5 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-indigo opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-indigo"></span>
              </span>
              {t.multi}
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black text-brand-indigo leading-[0.95] tracking-tighter">
              Simple<span className="text-brand-midnight">.</span>
            </h1>
            <h2 className="text-4xl md:text-5xl font-black text-brand-midnight/90 leading-tight tracking-tight">
              {t.welcome}
            </h2>
            
            <p className="text-xl text-brand-slate leading-relaxed max-w-xl font-medium">
              {t.subtitle}
            </p>
            
            <div className="flex flex-col sm:row gap-4 pt-4">
              <Link href="/auth/register" className="flex items-center justify-center gap-3 bg-brand-indigo text-white px-10 py-5 rounded-2xl font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-brand-indigo/30">
                {t.register}
                <ChevronRight className={`${isRtl ? 'rotate-180' : ''} w-6 h-6`} />
              </Link>
              <button className="px-10 py-5 rounded-2xl font-black text-lg border-4 border-brand-indigo text-brand-indigo hover:bg-brand-indigo hover:text-white transition-all">
                {t.demo}
              </button>
            </div>
          </div>

          {/* Visual Mockup - Updated with new colors */}
          <div className="relative">
            <div className="relative z-10 w-full aspect-[4/3] bg-brand-midnight rounded-[3.5rem] shadow-[0_32px_80px_-20px_rgba(59,7,100,0.4)] overflow-hidden border-[16px] border-white">
              <div className="absolute inset-0 bg-brand-pearl m-2 rounded-[2.5rem] overflow-hidden flex flex-col">
                <div className="h-12 bg-white border-b border-brand-lavender flex items-center px-6 gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-coral/40" />
                  <div className="w-3 h-3 rounded-full bg-brand-lime" />
                  <div className="w-3 h-3 rounded-full bg-brand-indigo/40" />
                </div>
                <div className="p-8 space-y-6">
                  <div className="h-6 w-1/3 bg-brand-lavender rounded-full" />
                  <div className="h-40 w-full bg-white rounded-3xl shadow-sm border border-brand-lavender/50" />
                  <div className="grid grid-cols-2 gap-6">
                    <div className="h-28 bg-brand-indigo/5 rounded-2xl border-2 border-dashed border-brand-indigo/20" />
                    <div className="h-28 bg-brand-lime/20 rounded-2xl" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 z-20 bg-brand-lime text-brand-midnight px-8 py-5 rounded-[2rem] shadow-2xl font-black rotate-[-6deg] border-4 border-white text-xl">
              {t.noCode} ✨
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}