"use client";

import React, { useState, useEffect } from 'react';
import { 
  Phone, ImageIcon, Trash2, Plus, Type, Bold, Italic, 
  Palette, MousePointer2, Info, MapPin, MessageCircle, Navigation,
  Paintbrush, ChevronDown, ChevronUp, MessageSquare, AlignRight, AlignLeft,
  ExternalLink, Calendar, ShoppingBag
} from 'lucide-react';
import { FaInstagram, FaFacebook, FaWhatsapp, FaWaze } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { SmartColorPicker } from '../settings/controls/SmartColorPicker';

export const NavbarPanel = ({ site, updateNavbar, selectAssetForField }: any) => {
  const navData = site?.draft_data?.navbar || {};
  const [openSection, setOpenSection] = useState<string | null>('brand');
  
  // State עבור ה-SmartColorPicker החדש
  const [activeColorKey, setActiveColorKey] = useState('bg_color');

  const brandColors = [
    site?.theme_settings?.primary_color || '#0B4440',
    site?.theme_settings?.secondary_color || '#E5F2F1',
    '#000000',
    '#FFFFFF'
  ];

  // רשימת הגדרות הצבע לעריכה
  const colorSettings = [
    { key: 'bg_color', label: 'Navbar Background', value: navData.bg_color || '#000000' },
    { key: 'link_color', label: 'Link Color (Default)', value: navData.link_color || '#ffffff' },
    { key: 'link_hover_color', label: 'Link Color (Hover)', value: navData.link_hover_color || '#ffffff' },
    { key: 'link_active_color', label: 'Link Color (Active)', value: navData.link_active_color || '#0B4440' },
  ];

  const currentActiveColor = colorSettings.find(c => c.key === activeColorKey);

  const getContrastYIQ = (hexcolor: string) => {
    if (!hexcolor) return 'light';
    const hex = hexcolor.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq > 180) ? 'dark' : 'light'; 
  };

  const previewTheme = getContrastYIQ(navData.text_color || '#1A1A1A');

  const fontOptions = [
    { name: 'Sans', value: 'var(--font-sans)' },
    { name: 'Serif', value: 'var(--font-serif)' },
    { name: 'Mono', value: 'var(--font-mono)' },
    { name: 'Heebo', value: 'Heebo, sans-serif' },
    { name: 'Assistant', value: 'Assistant, sans-serif' }
  ];

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="p-4 space-y-3 text-start animate-in fade-in duration-300 custom-scrollbar overflow-y-auto max-h-screen pb-24">
      
      {/* 1. HEADER TITLE */}
      <div className="px-1 py-2 mb-2">
        <h1 className="text-[14px] font-black uppercase text-brand-midnight tracking-tighter flex items-center gap-2">
          <Navigation size={18} className="text-brand-main" />
          Navigation Bar Settings
        </h1>
        <p className="text-[10px] text-brand-slate font-medium opacity-60 uppercase tracking-widest mt-1">Configure layout, colors and links</p>
      </div>

      {/* 2. BRAND IDENTITY SECTION */}
      <div className="border border-brand-lavender/50 rounded-2xl overflow-hidden bg-white shadow-sm">
        <button 
          onClick={() => toggleSection('brand')}
          className="w-full flex items-center justify-between p-4 bg-brand-pearl/20 hover:bg-brand-pearl/40 transition-all"
        >
          <div className="flex items-center gap-2">
            <MousePointer2 size={14} className="text-brand-main" />
            <span className="text-[10px] font-black uppercase text-brand-charcoal tracking-widest">Brand Identity</span>
          </div>
          {openSection === 'brand' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {openSection === 'brand' && (
          <div className="p-4 space-y-4 animate-in slide-in-from-top-2">
            <div className="bg-brand-pearl/50 p-1 rounded-xl border border-brand-mint/20 flex gap-1 shadow-sm">
              <button 
                onClick={() => updateNavbar({ use_image: false })} 
                className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all flex items-center justify-center gap-2 ${!navData.use_image ? 'bg-white text-brand-indigo shadow-sm' : 'text-brand-charcoal/40 hover:bg-white/50'}`}
              >
                <Type size={14} /> TEXT
              </button>
              <button 
                onClick={() => updateNavbar({ use_image: true })} 
                className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all flex items-center justify-center gap-2 ${navData.use_image ? 'bg-white text-brand-indigo shadow-sm' : 'text-brand-charcoal/40 hover:bg-white/50'}`}
              >
                <ImageIcon size={14} /> LOGO
              </button>
            </div>
            
            {navData.use_image ? (
              <div className="space-y-3">
                <div className="group relative h-24 bg-white rounded-2xl border-2 border-dashed border-brand-lavender flex items-center justify-center overflow-hidden shadow-inner transition-all hover:border-brand-main">
                  {navData.brand_image ? (
                    <>
                      <img src={navData.brand_image} className="max-h-full p-4 object-contain" alt="Logo preview" />
                      <div className="absolute inset-0 bg-brand-midnight/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <button onClick={() => updateNavbar({ brand_image: null })} className="p-2 bg-salmon text-white rounded-full shadow-lg hover:scale-110 transition-transform"><Trash2 size={14}/></button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center space-y-1 opacity-20">
                      <ImageIcon size={32} className="mx-auto" />
                      <span className="text-[8px] font-black block uppercase">No Logo Set</span>
                    </div>
                  )}
                </div>
                <button onClick={() => selectAssetForField(undefined, 'brand_image')} className="w-full py-3 bg-brand-indigo text-white rounded-xl text-[10px] font-black flex items-center justify-center gap-2 shadow-sm hover:bg-brand-indigo/90 transition-all">
                  <Plus size={14}/> {navData.brand_image ? 'CHANGE LOGO' : 'SELECT LOGO'}
                </button>
                <div className="flex items-start gap-2 p-3 bg-brand-pearl rounded-xl border border-brand-lavender/50 text-[10px] text-brand-charcoal/60 leading-tight">
                  <Info size={14} className="text-brand-indigo shrink-0" />
                  <p><strong>Recommended: </strong>PNG with transparent background. <strong>Height:</strong> 120px.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div 
                  className={`p-6 rounded-2xl border transition-colors duration-500 shadow-inner text-center min-h-[80px] flex items-center justify-center ${previewTheme === 'dark' ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-brand-lavender'}`}
                  style={{
                    fontFamily: navData.text_font || 'inherit',
                    fontWeight: navData.text_bold ? '900' : '400',
                    fontStyle: navData.text_italic ? 'italic' : 'normal',
                    color: navData.text_color || '#1A1A1A',
                    fontSize: '20px'
                  }}
                >
                  {navData.brand_text || 'Simple. Homepage'}
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black opacity-40 uppercase ml-1 block">Brand Name</span>
                    <input 
                      className="w-full bg-white p-3 rounded-xl text-[12px] font-bold border border-brand-lavender outline-none focus:border-brand-indigo shadow-inner"
                      value={navData.brand_text || ''}
                      onChange={(e) => updateNavbar({ brand_text: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex bg-brand-pearl p-1 rounded-lg border border-brand-lavender">
                      <button onClick={() => updateNavbar({ text_bold: !navData.text_bold })} className={`flex-1 p-2 rounded-md flex items-center justify-center transition-all ${navData.text_bold ? 'bg-white text-brand-indigo shadow-sm' : 'text-brand-charcoal/40 hover:bg-white/50'}`}><Bold size={14} /></button>
                      <button onClick={() => updateNavbar({ text_italic: !navData.text_italic })} className={`flex-1 p-2 rounded-md flex items-center justify-center transition-all ${navData.text_italic ? 'bg-white text-brand-indigo shadow-sm' : 'text-brand-charcoal/40 hover:bg-white/50'}`}><Italic size={14} /></button>
                    </div>
                    <div className="flex items-center gap-2 bg-brand-pearl p-1 px-2 rounded-lg border border-brand-lavender">
                      <Palette size={14} className="text-brand-charcoal/40" />
                      <input type="color" className="w-full h-6 rounded cursor-pointer border-none bg-transparent" value={navData.text_color || '#1A1A1A'} onChange={(e) => updateNavbar({ text_color: e.target.value })} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[8px] font-black opacity-40 uppercase ml-1 block">Typography</span>
                    <select className="w-full bg-white p-3 rounded-xl text-[10px] font-bold border border-brand-lavender outline-none focus:border-brand-indigo shadow-sm" value={navData.text_font || ''} onChange={(e) => updateNavbar({ text_font: e.target.value })}>
                      {fontOptions.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

{/* 3. NAVIGATION THEME SECTION */}
<div className="border border-brand-lavender/50 rounded-2xl overflow-hidden bg-white shadow-sm">
  <button 
    onClick={() => toggleSection('theme')}
    className="w-full flex items-center justify-between p-4 bg-brand-pearl/20 hover:bg-brand-pearl/40 transition-all"
  >
    <div className="flex items-center gap-2">
      <Paintbrush size={14} className="text-brand-main" />
      <span className="text-[10px] font-black uppercase text-brand-charcoal tracking-widest">Navigation Theme</span>
    </div>
    {openSection === 'theme' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
  </button>

  {openSection === 'theme' && (
    <div className="p-4 space-y-5 animate-in slide-in-from-top-2">
      
      {/* Smart Selector & Internal SmartColorPicker Component */}
      <div className="space-y-4 p-4 bg-brand-pearl/30 rounded-2xl border border-brand-lavender/30">
        <div className="space-y-1">
          <span className="text-[8px] font-black opacity-40 uppercase ml-1 block">Select Element to Edit</span>
          <select 
            className="w-full bg-white p-3 rounded-xl text-[10px] font-bold border border-brand-lavender outline-none focus:border-brand-indigo shadow-sm transition-all"
            value={activeColorKey}
            onChange={(e) => setActiveColorKey(e.target.value)}
          >
            {colorSettings.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
          </select>
        </div>

        {/* הקומפוננטה המקורית שלך - מחליפה את האינפוט הישן */}
        <SmartColorPicker 
          label={`Color for: ${colorSettings.find(c => c.key === activeColorKey)?.label}`}
          value={navData[activeColorKey] || (activeColorKey === 'bg_color' ? '#000000' : '#ffffff')}
          onChange={(val: string) => updateNavbar({ [activeColorKey]: val })}
          site={site}
        />
      </div>

      {/* Color Legend - מאפשר מעבר מהיר בלחיצה על השורה */}
      <div className="space-y-2">
        <span className="text-[8px] font-black opacity-30 uppercase ml-1 block">Active Colors Legend</span>
        <div className="grid grid-cols-1 gap-1.5">
          {colorSettings.map((c) => {
            const currentValue = navData[c.key] || (c.key === 'bg_color' ? '#000000' : '#ffffff');
            return (
              <button 
                key={c.key}
                onClick={() => setActiveColorKey(c.key)}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${activeColorKey === c.key ? 'bg-brand-indigo/5 border-brand-indigo/30 ring-1 ring-brand-indigo/10' : 'bg-white border-brand-lavender hover:bg-brand-pearl/40'}`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded-full border border-black/5 shadow-sm transition-transform duration-300" 
                    style={{ backgroundColor: currentValue }} 
                  />
                  <span className={`text-[9px] font-bold ${activeColorKey === c.key ? 'text-brand-indigo' : 'text-brand-charcoal'}`}>
                    {c.label}
                  </span>
                </div>
                <span className="text-[8px] font-mono opacity-40 uppercase">{currentValue}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  )}
</div>

      {/* 4. ACTION BUTTONS SECTION (NEW) */}
      <div className="border border-brand-lavender/50 rounded-2xl overflow-hidden bg-white shadow-sm">
        <button 
          onClick={() => toggleSection('actions')}
          className="w-full flex items-center justify-between p-4 bg-brand-pearl/20 hover:bg-brand-pearl/40 transition-all"
        >
          <div className="flex items-center gap-2">
            <ExternalLink size={14} className="text-brand-main" />
            <span className="text-[10px] font-black uppercase text-brand-charcoal tracking-widest">Action Buttons</span>
          </div>
          {openSection === 'actions' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {openSection === 'actions' && (
          <div className="p-4 space-y-4 animate-in slide-in-from-top-2">
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2 ml-1">
                  <Calendar size={12} className="text-brand-indigo" />
                  <span className="text-[8px] font-black opacity-40 uppercase block">Booking URL</span>
                </div>
                <input 
                  className="w-full bg-white p-3 rounded-xl text-[10px] font-medium border border-brand-lavender outline-none focus:border-brand-main shadow-sm"
                  placeholder="https://book-a-table.com/..."
                  value={navData.booking_url || ''}
                  onChange={(e) => updateNavbar({ booking_url: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 ml-1">
                  <ShoppingBag size={12} className="text-brand-indigo" />
                  <span className="text-[8px] font-black opacity-40 uppercase block">Delivery & Takeout URL</span>
                </div>
                <input 
                  className="w-full bg-white p-3 rounded-xl text-[10px] font-medium border border-brand-lavender outline-none focus:border-brand-main shadow-sm"
                  placeholder="https://order-now.com/..."
                  value={navData.delivery_url || ''}
                  onChange={(e) => updateNavbar({ delivery_url: e.target.value })}
                />
              </div>
            </div>
            
            <div className="flex items-start gap-2 p-3 bg-brand-pearl rounded-xl border border-brand-lavender/50 text-[9px] text-brand-charcoal/60 leading-tight italic">
              <Info size={14} className="text-brand-indigo shrink-0" />
              <p>Buttons will only appear on the live site if a URL is provided.</p>
            </div>
          </div>
        )}
      </div>

      {/* 5. CONTACT CHANNELS SECTION */}
      <div className="border border-brand-lavender/50 rounded-2xl overflow-hidden bg-white shadow-sm">
        <button 
          onClick={() => toggleSection('contact')}
          className="w-full flex items-center justify-between p-4 bg-brand-pearl/20 hover:bg-brand-pearl/40 transition-all"
        >
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-brand-main" />
            <span className="text-[10px] font-black uppercase text-brand-charcoal tracking-widest">Contact Channels</span>
          </div>
          {openSection === 'contact' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {openSection === 'contact' && (
          <div className="p-4 space-y-3 animate-in slide-in-from-top-2">
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-brand-lavender shadow-sm focus-within:border-brand-main transition-all">
              <Phone size={14} className="text-brand-indigo" />
              <input className="bg-transparent text-[11px] outline-none flex-1 font-bold" placeholder="Main Business Phone" value={navData.phone || ''} onChange={(e) => updateNavbar({ phone: e.target.value })} />
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-brand-lavender shadow-sm focus-within:border-brand-main transition-all">
              <FaInstagram size={14} className="text-brand-indigo" />
              <input className="bg-transparent text-[10px] outline-none flex-1 font-medium" placeholder="Instagram Profile Link" value={navData.instagram || ''} onChange={(e) => updateNavbar({ instagram: e.target.value })} />
            </div>
            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-brand-lavender shadow-sm focus-within:border-brand-main transition-all">
              <FaFacebook size={14} className="text-brand-indigo" />
              <input className="bg-transparent text-[10px] outline-none flex-1 font-medium" placeholder="Facebook Business Page" value={navData.facebook || ''} onChange={(e) => updateNavbar({ facebook: e.target.value })} />
            </div>

            <div className="mt-4 p-4 bg-brand-pearl/30 rounded-2xl border border-brand-lavender/50 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#25D366]/10 rounded-lg"><FaWhatsapp size={16} className="text-[#25D366]"/></div>
                  <span className="text-[10px] font-black uppercase tracking-tight">Enable WhatsApp</span>
                </div>
                <button onClick={() => updateNavbar({ whatsapp: !navData.whatsapp })} className={`w-10 h-5 rounded-full transition-all relative ${navData.whatsapp ? 'bg-[#25D366]' : 'bg-brand-lavender'}`}>
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${navData.whatsapp ? 'right-1' : 'left-1'}`} />
                </button>
              </div>

              {navData.whatsapp && (
                <div className="animate-in slide-in-from-top-2 space-y-4 pt-1">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black opacity-30 uppercase ml-1 block">WhatsApp Phone Number</span>
                    <input className="w-full bg-white p-3 rounded-xl text-[10px] font-mono border border-[#25D366]/30 shadow-inner outline-none focus:border-[#25D366]" placeholder="972XXXXXXXXX" value={navData.whatsapp_phone || ''} onChange={(e) => updateNavbar({ whatsapp_phone: e.target.value })} />
                    <div className="flex items-start gap-2 p-3 bg-brand-pearl rounded-xl border border-brand-lavender/50 text-[10px] text-brand-charcoal/60 leading-tight">
                      <Info size={14} className="text-brand-indigo shrink-0" />
                      <p>Leave blank if same as contact number.</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-brand-lavender/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageSquare size={14} className="text-brand-main" />
                        <span className="text-[10px] font-black uppercase tracking-tight">Enable Floating Icon</span>
                      </div>
                      <button onClick={() => updateNavbar({ whatsapp_floating: !navData.whatsapp_floating })} className={`w-8 h-4 rounded-full transition-all relative ${navData.whatsapp_floating ? 'bg-brand-main' : 'bg-brand-lavender'}`}>
                        <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${navData.whatsapp_floating ? 'right-0.5' : 'left-0.5'}`} />
                      </button>
                    </div>

                    {navData.whatsapp_floating && (
                      <div className="flex items-center justify-between p-2 bg-white rounded-xl border border-brand-lavender shadow-sm animate-in zoom-in-95">
                        <span className="text-[9px] font-black uppercase opacity-40 ml-1">Icon Position</span>
                        <div className="flex bg-brand-pearl p-1 rounded-lg">
                           <button 
                            onClick={() => updateNavbar({ whatsapp_float_pos: 'left' })}
                            className={`p-2 rounded-md transition-all ${navData.whatsapp_float_pos === 'left' ? 'bg-white text-brand-main shadow-sm' : 'text-brand-charcoal/30 hover:bg-white/50'}`}
                           >
                            <AlignLeft size={14} />
                           </button>
                           <button 
                            onClick={() => updateNavbar({ whatsapp_float_pos: 'right' })}
                            className={`p-2 rounded-md transition-all ${navData.whatsapp_float_pos !== 'left' ? 'bg-white text-brand-main shadow-sm' : 'text-brand-charcoal/30 hover:bg-white/50'}`}
                           >
                            <AlignRight size={14} />
                           </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 6. LOCATION & NAVIGATION SECTION */}
      <div className="border border-brand-lavender/50 rounded-2xl overflow-hidden bg-white shadow-sm">
        <button 
          onClick={() => toggleSection('location')}
          className="w-full flex items-center justify-between p-4 bg-brand-pearl/20 hover:bg-brand-pearl/40 transition-all"
        >
          <div className="flex items-center gap-2">
            <Navigation size={14} className="text-brand-main" />
            <span className="text-[10px] font-black uppercase text-brand-charcoal tracking-widest">Location & Navigation</span>
          </div>
          {openSection === 'location' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {openSection === 'location' && (
          <div className="p-4 space-y-4 animate-in slide-in-from-top-2">
            <div className="space-y-3">
              <span className="text-[8px] font-black opacity-30 uppercase ml-1 block">Physical Address</span>
              <textarea className="w-full bg-white p-3 rounded-xl text-[10px] font-medium resize-none border border-brand-lavender outline-none focus:border-brand-main shadow-sm" rows={2} placeholder="Physical Business Address" value={navData.address || ''} onChange={(e) => updateNavbar({ address: e.target.value })} />
              
              <span className="text-[8px] font-black opacity-30 uppercase ml-1 block">Navigation Shortcuts</span>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => updateNavbar({ show_waze: !navData.show_waze })} className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-[9px] font-black transition-all ${navData.show_waze ? 'bg-[#33CCFF] text-white border-[#33CCFF] shadow-md' : 'bg-white border-brand-lavender opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}>
                  <FaWaze size={14} className={navData.show_waze ? 'text-white' : 'text-[#33CCFF]'} /> WAZE
                </button>
                <button onClick={() => updateNavbar({ show_google: !navData.show_google })} className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-[9px] font-black transition-all ${navData.show_google ? 'bg-white text-brand-midnight border-brand-lavender shadow-md' : 'bg-white border-brand-lavender opacity-40 grayscale hover:opacity-100 hover:grayscale-0'}`}>
                  <FcGoogle size={14} /> MAPS
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};