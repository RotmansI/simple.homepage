"use client";

import React from 'react';
import { 
  Phone, ImageIcon, Trash2, Plus, Type, Bold, Italic, 
  Palette, MousePointer2, Info, MapPin, MessageCircle, Navigation,
  Paintbrush
} from 'lucide-react';
import { FaInstagram, FaFacebook, FaWhatsapp, FaWaze } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

export const NavbarPanel = ({ site, updateNavbar, selectAssetForField }: any) => {
  const navData = site?.draft_data?.navbar || {};

  // פונקציית עזר לחישוב בהירות הצבע (Luminance) כדי לקבוע רקע ל-Preview
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

  return (
    <div className="p-4 space-y-6 text-start animate-in fade-in duration-300 custom-scrollbar overflow-y-auto max-h-screen pb-10">
      
      {/* 1. BRAND IDENTITY SECTION */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-1">
          <MousePointer2 size={12} className="text-brand-main opacity-60" />
          <span className="text-[10px] font-black uppercase text-brand-charcoal/40 tracking-widest">Brand Identity</span>
        </div>

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
        
        {/* --- LOGO EDITOR --- */}
        {navData.use_image ? (
          <div className="space-y-3 animate-in slide-in-from-top-2">
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
              <p><strong>Recommended: </strong>PNG with transparent background. 
              <strong> Height:</strong> Up to 120px. 
              <strong> Width:</strong> Up to 400px.</p>
            </div>
          </div>
        ) : (
          /* --- TEXT IDENTITY EDITOR --- */
          <div className="space-y-4 animate-in slide-in-from-top-2">
            <div 
              className={`p-6 rounded-2xl border transition-colors duration-500 shadow-inner text-center min-h-[80px] flex items-center justify-center overflow-hidden ${previewTheme === 'dark' ? 'bg-[#1A1A1A] border-white/10' : 'bg-white border-brand-lavender'}`}
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
                  placeholder="Enter Business Name"
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
                <select className="w-full bg-white p-3 rounded-xl text-[10px] font-bold border border-brand-lavender outline-none focus:border-brand-indigo appearance-none shadow-sm" value={navData.text_font || ''} onChange={(e) => updateNavbar({ text_font: e.target.value })}>
                  {fontOptions.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. NAVIGATION THEME (New Section) */}
      <div className="space-y-4 border-t border-brand-lavender pt-6">
        <div className="flex items-center gap-2 px-1">
          <Paintbrush size={12} className="text-brand-main opacity-60" />
          <span className="text-[10px] font-black uppercase text-brand-charcoal/40 tracking-widest">Navigation Theme</span>
        </div>

        <div className="bg-brand-pearl/30 p-4 rounded-2xl border border-brand-lavender/50 space-y-4">
          <div className="space-y-2">
            <span className="text-[8px] font-black opacity-40 uppercase ml-1 block">Navbar Background</span>
            <div className="flex items-center gap-3 bg-white p-2 rounded-xl border border-brand-lavender">
              <input type="color" className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent" value={navData.bg_color || '#000000'} onChange={(e) => updateNavbar({ bg_color: e.target.value })} />
              <span className="text-[10px] font-mono font-bold opacity-60 uppercase">{navData.bg_color || '#000000'}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
             <div className="space-y-2">
                <span className="text-[8px] font-black opacity-40 uppercase ml-1 block">Menu Link Colors</span>
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col gap-1 items-center">
                    <input type="color" className="w-full h-10 rounded-xl cursor-pointer border-brand-lavender" value={navData.link_color || '#ffffff'} onChange={(e) => updateNavbar({ link_color: e.target.value })} />
                    <span className="text-[7px] font-black opacity-40 uppercase">Default</span>
                  </div>
                  <div className="flex flex-col gap-1 items-center">
                    <input type="color" className="w-full h-10 rounded-xl cursor-pointer border-brand-lavender" value={navData.link_hover_color || '#ffffff'} onChange={(e) => updateNavbar({ link_hover_color: e.target.value })} />
                    <span className="text-[7px] font-black opacity-40 uppercase">Hover</span>
                  </div>
                  <div className="flex flex-col gap-1 items-center">
                    <input type="color" className="w-full h-10 rounded-xl cursor-pointer border-brand-lavender" value={navData.link_active_color || '#0B4440'} onChange={(e) => updateNavbar({ link_active_color: e.target.value })} />
                    <span className="text-[7px] font-black opacity-40 uppercase">Active</span>
                  </div>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 3. CONTACT CHANNELS SECTION */}
      <div className="space-y-4 border-t border-brand-lavender pt-6">
        <div className="flex items-center gap-2 px-1">
          <Phone size={12} className="text-brand-main opacity-60" />
          <span className="text-[10px] font-black uppercase text-brand-charcoal/40 tracking-widest">Contact Channels</span>
        </div>

        <div className="space-y-2">
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

          <div className="mt-4 p-4 bg-brand-pearl/30 rounded-2xl border border-brand-lavender/50 space-y-4 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-[#25D366]/10 rounded-lg"><FaWhatsapp size={16} className="text-[#25D366]"/></div>
                <span className="text-[10px] font-black uppercase">Enable WhatsApp</span>
              </div>
              <button onClick={() => updateNavbar({ whatsapp: !navData.whatsapp })} className={`w-10 h-5 rounded-full transition-all relative ${navData.whatsapp ? 'bg-[#25D366]' : 'bg-brand-lavender'}`}>
                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${navData.whatsapp ? 'right-1' : 'left-1'}`} />
              </button>
            </div>

            {navData.whatsapp && (
              <div className="animate-in slide-in-from-top-2 pt-1">
                <span className="text-[8px] font-black opacity-30 uppercase ml-1 block mb-1">WhatsApp Phone Number</span>
                <input className="w-full bg-white p-3 rounded-xl text-[10px] font-mono border border-[#25D366]/30 shadow-inner outline-none focus:border-[#25D366]" placeholder="972XXXXXXXXX" value={navData.whatsapp_phone || ''} onChange={(e) => updateNavbar({ whatsapp_phone: e.target.value })} />
              </div>
            )}
            <div className="flex items-start gap-2 p-3 bg-brand-pearl rounded-xl border border-brand-lavender/50 text-[10px] text-brand-charcoal/60 leading-tight">
              <Info size={14} className="text-brand-indigo shrink-0" />
              <p>Leave blank if same as contact number.</p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. LOCATION & NAVIGATION SECTION */}
      <div className="space-y-4 border-t border-brand-lavender pt-6">
        <div className="flex items-center gap-2 px-1">
          <Navigation size={12} className="text-brand-main opacity-60" />
          <span className="text-[10px] font-black uppercase text-brand-charcoal/40 tracking-widest">Location & Navigation</span>
        </div>

        <div className="bg-brand-pearl/30 p-4 rounded-2xl border border-brand-lavender/50 space-y-4 shadow-sm">
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
                        <div className="flex items-start gap-2 p-3 bg-brand-pearl rounded-xl border border-brand-lavender/50 text-[10px] text-brand-charcoal/60 leading-tight">
              <Info size={14} className="text-brand-indigo shrink-0" />
              <p>Tap to toggle visibility of navigation button to the address</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};