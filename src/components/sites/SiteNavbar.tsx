"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Menu, X, Clock, MapPin, Phone, 
  ShoppingBag, Calendar, Copy, Utensils, PhoneCall
} from 'lucide-react';

// שימוש ב-Font Awesome ללוגואים של אפליקציות ורשתות חברתיות
import { 
  FaInstagram, FaFacebook, FaWhatsapp, FaWaze, FaGoogle 
} from 'react-icons/fa';

export default function SiteNavbar({ pages, slug, activePage, settings, orgName, theme }: any) {
  const [activePopup, setActivePopup] = useState<'hours' | 'nav' | 'phone' | null>(null);
  const [isHoursLocked, setIsHoursLocked] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const navSettings = settings?.navbar || {};
  const isEn = navSettings.direction === 'ltr';
  
  // צבעים מהתמה ומהגדרות הנאב
  const primaryColor = theme?.primary_color || '#0B4440';
  const bgColor = navSettings.bg_color || '#000000';
  
  // צבעי טקסט וקישורים
  const brandTextColor = navSettings.text_color || '#ffffff';
  const linkColor = navSettings.link_color || '#ffffff';
  const linkHoverColor = navSettings.link_hover_color || '#ffffff';
  const linkActiveColor = navSettings.link_active_color || primaryColor;

  const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayMapHe: any = {
    'Sunday': 'ראשון', 'Monday': 'שני', 'Tuesday': 'שלישי', 
    'Wednesday': 'רביעי', 'Thursday': 'חמישי', 'Friday': 'שישי', 'Saturday': 'שבת'
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.nav-popup-container')) {
        setActivePopup(null);
        setIsHoursLocked(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyToClipboard = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    alert(`${label} ${isEn ? 'copied!' : 'הועתק!'}`);
  };

  const getPageTitle = (pKey: string, originalTitle: string) => {
    if (!isEn) return originalTitle;
    const translations: any = {
      'home': 'Home', 'menu': 'Menu', 'about': 'About', 
      'gallery': 'Gallery', 'contact': 'Contact', 'order': 'Order'
    };
    return translations[pKey.toLowerCase()] || originalTitle;
  };

  const actionButtonClass = `flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black transition-all hover:scale-105 active:scale-95 shadow-lg`;

  return (
    <header className="sticky top-0 z-[100] w-full flex flex-col shadow-xl" dir={isEn ? 'ltr' : 'rtl'}>
      
      {/* שכבה עליונה */}
      <div className="h-20 px-6 md:px-20 flex items-center justify-between border-b border-white/10" style={{ backgroundColor: bgColor, color: linkColor }}>
        
        <Link href={`/sites/${slug}/home`} className="flex items-center shrink-0 lg:w-1/4">
          {navSettings.use_image && navSettings.brand_image ? (
            <img src={navSettings.brand_image} alt={orgName} className="h-10 md:h-14 w-auto object-contain" />
          ) : (
            <div 
              className="text-2xl tracking-tighter leading-none"
              style={{
                fontFamily: navSettings.text_font || 'inherit',
                fontWeight: navSettings.text_bold ? '900' : '400',
                fontStyle: navSettings.text_italic ? 'italic' : 'normal',
                color: brandTextColor
              }}
            >
              {navSettings.brand_text || orgName}
            </div>
          )}
        </Link>

        {/* כפתורי פעולה */}
        <div className="hidden lg:flex items-center justify-center gap-4 flex-1">
          {navSettings.booking_url && (
            <a href={navSettings.booking_url} target="_blank" className={actionButtonClass} style={{ backgroundColor: primaryColor, color: '#fff' }}>
               <Utensils size={14}/> {isEn ? 'Book a Table' : 'הזמנת שולחן'}
            </a>
          )}
          {navSettings.delivery_url && (
            <a href={navSettings.delivery_url} target="_blank" className={actionButtonClass} style={{ backgroundColor: primaryColor, color: '#fff' }}>
               <ShoppingBag size={14}/> {isEn ? 'Delivery / TA' : 'איסוף / משלוח'}
            </a>
          )}
        </div>

        {/* אייקונים בצד ימין */}
        <div className="hidden md:flex items-center justify-end gap-1 lg:w-1/4">
          <div className="relative nav-popup-container">
            <button onClick={() => setActivePopup(activePopup === 'nav' ? null : 'nav')} className="p-2.5 rounded-full transition-all" style={{ color: linkColor }}>
              <MapPin size={22} />
            </button>
            {activePopup === 'nav' && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white shadow-2xl p-6 rounded-3xl text-brand-dark w-80 z-[120] border border-brand-mint/20 animate-in fade-in zoom-in-95">
                <div className="font-black mb-3 text-sm text-gray-800">{isEn ? 'Our Location' : 'המיקום שלנו'}</div>
                <button onClick={() => copyToClipboard(navSettings.address, isEn ? 'Address' : 'כתובת')} className="w-full mb-4 p-4 bg-gray-50 rounded-2xl flex items-center justify-between group hover:bg-brand-mint/5 transition-all text-start border border-gray-100">
                  <span className="text-[11px] font-bold leading-relaxed break-words flex-1 ml-2 text-gray-600">{navSettings.address}</span>
                  <Copy size={16} className="text-gray-300 group-hover:text-brand-main shrink-0" />
                </button>
                <div className="grid grid-cols-2 gap-3">
                  {navSettings.show_waze !== false && (
                    <a href={`https://waze.com/ul?q=${encodeURIComponent(navSettings.address || '')}`} target="_blank" className="flex items-center justify-center gap-2 p-3 bg-[#33CCFF] text-white rounded-xl font-bold text-xs hover:scale-105 transition-transform">
                      <FaWaze size={16} /> Waze
                    </a>
                  )}
                  {navSettings.show_google !== false && (
                    <a href={`http://maps.google.com/?q=${encodeURIComponent(navSettings.address || '')}`} target="_blank" className="flex items-center justify-center gap-2 p-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold text-xs hover:scale-105 transition-transform">
                      <FaGoogle className="text-[#4285F4]" size={14} /> Maps
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="relative nav-popup-container" onMouseEnter={() => !isHoursLocked && setActivePopup('hours')} onMouseLeave={() => !isHoursLocked && setActivePopup(null)}>
            <button onClick={(e) => { e.stopPropagation(); setIsHoursLocked(!isHoursLocked); setActivePopup('hours'); }} className={`p-2.5 rounded-full transition-all ${isHoursLocked || activePopup === 'hours' ? 'bg-white/20' : ''}`} style={{ color: linkColor }}>
              <Clock size={22} />
            </button>
            {activePopup === 'hours' && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white shadow-2xl p-6 rounded-3xl text-brand-dark w-64 z-[120] border border-brand-mint/20 animate-in fade-in zoom-in-95">
                <div className="font-black mb-4 flex items-center gap-2 border-b border-gray-100 pb-2 text-gray-800"><Clock size={16} className="text-brand-main" /> {isEn ? 'Opening Hours' : 'שעות פעילות'}</div>
                <div className="space-y-2.5">
                  {dayOrder.map((day) => (
                    <div key={day} className="flex justify-between items-center text-xs text-gray-700">
                      <span className="font-bold opacity-60">{isEn ? day : dayMapHe[day]}</span>
                      <span className="font-mono font-bold">{navSettings.hours?.[day] || (isEn ? 'Closed' : 'סגור')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="relative nav-popup-container">
            <button onClick={() => setActivePopup(activePopup === 'phone' ? null : 'phone')} className="p-2.5 rounded-full transition-all" style={{ color: linkColor }}>
              <Phone size={22} />
            </button>
            {activePopup === 'phone' && (
              <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-white shadow-2xl p-6 rounded-3xl text-brand-dark w-64 z-[120] border border-brand-mint/20 animate-in fade-in zoom-in-95">
                <div className="font-black mb-4 text-center text-gray-800">{isEn ? 'Contact Us' : 'יצירת קשר'}</div>
                <button onClick={() => copyToClipboard(navSettings.phone, isEn ? 'Phone' : 'מספר טלפון')} className="w-full mb-4 p-3 bg-gray-50 rounded-xl flex items-center justify-center gap-3 font-mono font-bold text-sm text-gray-700 border border-gray-100">
                  {navSettings.phone} <Copy size={14} className="text-gray-300" />
                </button>
                <div className="flex flex-col gap-2">
                  <a href={`tel:${navSettings.phone}`} className="flex items-center justify-center gap-2 p-3 text-white rounded-xl font-black text-xs transition-transform active:scale-95 shadow-sm" style={{ backgroundColor: primaryColor }}>
                    <PhoneCall size={14} /> {isEn ? 'Call Now' : 'חיוג למסעדה'}
                  </a>
                  {navSettings.whatsapp && (
                    <a href={`https://wa.me/${(navSettings.whatsapp_phone || navSettings.phone)?.replace(/\D/g,'')}`} target="_blank" className="flex items-center justify-center gap-2 p-3 bg-[#25D366] text-white rounded-xl font-black text-xs transition-transform active:scale-95 shadow-sm">
                      <FaWhatsapp size={16} /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-white/20 mx-1" />
          <div className="flex items-center gap-1" style={{ color: linkColor }}>
            {navSettings.instagram && <a href={navSettings.instagram} target="_blank" className="p-2 hover:opacity-70 transition-all"><FaInstagram size={22} /></a>}
            {navSettings.facebook && <a href={navSettings.facebook} target="_blank" className="p-2 hover:opacity-70 transition-all"><FaFacebook size={22} /></a>}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)} style={{ color: linkColor }}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* שכבה תחתונה: בר תפריט עם אפקט Hover Slide */}
      <div className="backdrop-blur-md border-b border-white/5 overflow-x-auto no-scrollbar scroll-smooth h-12 flex items-center" style={{ backgroundColor: bgColor }}>
        <div className="container mx-auto px-6 md:px-20 flex items-center justify-center gap-8 h-full">
          {Object.keys(pages).map((pKey) => {
            const isActive = activePage === pKey;
            return (
              <Link 
                key={pKey} 
                href={`/sites/${slug}/${pKey === 'home' ? '' : pKey}`}
                className={`
                  relative font-bold text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap px-1 h-full flex items-center
                  after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:transition-transform after:duration-300
                  ${isActive ? 'after:scale-x-100' : 'after:scale-x-0 hover:after:scale-x-100'}
                `}
                style={{ 
                   // @ts-ignore
                  '--hover-color': linkHoverColor,
                  color: isActive ? linkActiveColor : linkColor,
                } as React.CSSProperties}
              >
                <span 
                  className="transition-colors duration-300"
                  style={{ 
                    // שימוש ב-inline hover דרך style ידני אם Tailwind לא תופס
                    color: isActive ? linkActiveColor : undefined 
                  }}
                  onMouseEnter={(e) => { if(!isActive) e.currentTarget.style.color = linkHoverColor }}
                  onMouseLeave={(e) => { if(!isActive) e.currentTarget.style.color = linkColor }}
                >
                  {getPageTitle(pKey, pages[pKey].name || pages[pKey].title)}
                </span>
                
                {/* הקו התחתון */}
                <div 
                  className={`absolute bottom-0 left-0 w-full h-[3px] transition-transform duration-300 origin-center ${isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}
                  style={{ 
                    backgroundColor: isActive ? linkActiveColor : linkHoverColor,
                    // הוספת לוגיקה שה-Div יגיב ל-Hover של ה-Link האב
                  }}
                />
                
                {/* תיקון קו תחתון ב-Hover באמצעות CSS Variable */}
                <style dangerouslySetInnerHTML={{ __html: `
                  a[href*="${pKey}"]:hover div { transform: scaleX(1); }
                  a[href*="${pKey}"]:hover span { color: ${linkHoverColor} !important; }
                `}} />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 top-0 bg-white z-[200] p-8 flex flex-col gap-6 animate-in slide-in-from-top-5 md:hidden text-gray-900" dir={isEn ? 'ltr' : 'rtl'}>
          <div className="flex justify-between items-center mb-8">
             <div className="text-xl" style={{ fontFamily: navSettings.text_font || 'inherit', fontWeight: navSettings.text_bold ? '900' : '400', fontStyle: navSettings.text_italic ? 'italic' : 'normal', color: navSettings.text_color || '#1A1A1A' }}>{navSettings.brand_text || orgName}</div>
             <button onClick={() => setIsOpen(false)}><X size={32}/></button>
          </div>
          {Object.keys(pages).map((pKey) => (
            <Link key={pKey} href={`/sites/${slug}/${pKey === 'home' ? '' : pKey}`} onClick={() => setIsOpen(false)} className="text-3xl font-black border-b border-gray-100 pb-4">
              {getPageTitle(pKey, pages[pKey].name || pages[pKey].title)}
            </Link>
          ))}
          <div className="mt-auto flex justify-center gap-10" style={{ color: primaryColor }}>
             {navSettings.instagram && <a href={navSettings.instagram} target="_blank"><FaInstagram size={32} /></a>}
             {navSettings.facebook && <a href={navSettings.facebook} target="_blank"><FaFacebook size={32} /></a>}
             {navSettings.phone && <a href={`tel:${navSettings.phone}`}><PhoneCall size={32} /></a>}
          </div>
        </div>
      )}

      {(activePopup || isHoursLocked) && <div className="fixed inset-0 z-[110]" />}
    </header>
  );
}