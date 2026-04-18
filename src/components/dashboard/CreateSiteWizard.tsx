"use client";

import React, { useState } from 'react';
import { X, Check, Palette, Layout, ArrowRight, ArrowLeft, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface CreateSiteWizardProps {
  org: any;
  isRtl: boolean;
  onClose: () => void;
  onComplete: () => void;
}

export default function CreateSiteWizard({ org, isRtl, onClose, onComplete }: CreateSiteWizardProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // בחירת צבעים (Primary, Secondary, Accent, Neutral)
  const [colors, setColors] = useState(['#0B4440', '#E5F2F1', '#F59E0B', '#1F2937']);
  
  // בחירת עמודים ראשוניים
  const [selectedPages, setSelectedPages] = useState(['home', 'menu', 'contact']);

  const pagesOptions = [
    { id: 'home', label: isRtl ? 'דף הבית' : 'Home', icon: Layout },
    { id: 'menu', label: isRtl ? 'תפריט' : 'Menu', icon: Palette },
    { id: 'contact', label: isRtl ? 'צור קשר' : 'Contact', icon: MessageSquare },
    { id: 'about', label: isRtl ? 'עלינו' : 'About', icon: Sparkles },
  ];

  const handleFinish = async () => {
    setLoading(true);
    
    // בניית מבנה הדפים הראשוני
    const initialPages: any = {};
    selectedPages.forEach(p => {
      initialPages[p] = {
        title: pagesOptions.find(opt => opt.id === p)?.label,
        sections: p === 'home' ? [{
          id: 'hero-init',
          type: 'hero',
          content: { 
            title: isRtl ? org.name_he : org.name_en, 
            subtitle: isRtl ? 'ברוכים הבאים למסעדה שלנו' : 'Welcome to our restaurant',
            bg_image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2000',
            overlay_opacity: 40
          }
        }] : []
      };
    });

    const { error } = await supabase.from('sites').insert([{
      org_id: org.id,
      theme_settings: {
        primary_color: colors[0],
        secondary_color: colors[1],
        accent_color: colors[2],
        neutral_color: colors[3],
        font_family: "Assistant"
      },
      draft_data: { 
        pages: initialPages,
        active_page: 'home'
      },
      is_published: false
    }]);

    if (!error) {
      onComplete();
      router.push(`/editor/${org.slug}?lang=${isRtl ? 'he' : 'en'}`);
    } else {
      alert("Error creating site: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-brand-dark/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in duration-300">
        
        {/* Header */}
        <div className="p-8 border-b border-brand-mint flex justify-between items-center bg-brand-grey/30">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-brand-main rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-main/20">
                <Sparkles size={20} />
             </div>
             <div>
                <h3 className="text-xl font-black text-brand-dark leading-none">
                   {isRtl ? 'הקמת אתר חדש' : 'Setup New Site'}
                </h3>
                <p className="text-[10px] font-bold text-brand-charcoal/40 mt-1 uppercase tracking-widest">{org.slug}</p>
             </div>
          </div>
          <button onClick={onClose} className="text-brand-charcoal/20 hover:text-brand-dark transition-colors cursor-pointer"><X size={24}/></button>
        </div>

        {/* Content */}
        <div className="flex-1 p-10">
          {step === 1 ? (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="text-center space-y-2">
                  <h4 className="text-2xl font-black text-brand-dark">{isRtl ? 'מהם צבעי המותג?' : 'Brand Colors'}</h4>
                  <p className="text-brand-charcoal/50 text-sm">{isRtl ? 'בחרו 4 צבעים שיובילו את העיצוב' : 'Select 4 colors to lead the design'}</p>
               </div>

               <div className="grid grid-cols-4 gap-4">
                  {colors.map((c, i) => (
                    <div key={i} className="space-y-3">
                       <div className="relative group">
                          <input 
                              type="color" 
                              value={c} 
                              onChange={(e) => {
                                const newCols = [...colors];
                                newCols[i] = e.target.value;
                                setColors(newCols);
                              }}
                              className="w-full h-20 rounded-2xl cursor-pointer border-4 border-brand-grey hover:scale-105 transition-transform appearance-none overflow-hidden"
                          />
                       </div>
                       <p className="text-[9px] font-black text-center text-brand-charcoal/40 uppercase tracking-tighter">
                          {i === 0 ? 'Primary' : i === 1 ? 'Secondary' : i === 2 ? 'Accent' : 'Neutral'}
                       </p>
                    </div>
                  ))}
               </div>

               {/* Live Preview Sample */}
               <div className="p-6 rounded-[2.5rem] bg-brand-grey/50 flex items-center justify-around border border-brand-mint/50">
                  <div className="text-center space-y-2">
                     <div className="px-6 py-2.5 rounded-full shadow-lg text-[10px] font-black text-white" style={{ backgroundColor: colors[0] }}>BUTTON</div>
                     <span className="text-[9px] font-bold text-brand-charcoal/30">Action</span>
                  </div>
                  <div className="text-center space-y-1">
                     <h5 className="text-lg font-black" style={{ color: colors[3] }}>Title Style</h5>
                     <div className="h-1.5 w-12 rounded-full mx-auto" style={{ backgroundColor: colors[2] }} />
                  </div>
               </div>
            </div>
          ) : (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
               <div className="text-center space-y-2">
                  <h4 className="text-2xl font-black text-brand-dark">{isRtl ? 'אילו עמודים תרצו?' : 'Choose Pages'}</h4>
                  <p className="text-brand-charcoal/50 text-sm">{isRtl ? 'אל דאגה, תוכלו להוסיף עוד עמודים בהמשך' : 'You can add more pages later'}</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  {pagesOptions.map((opt) => {
                    const isSelected = selectedPages.includes(opt.id);
                    return (
                      <button 
                        key={opt.id}
                        onClick={() => setSelectedPages(prev => isSelected ? prev.filter(id => id !== opt.id) : [...prev, opt.id])}
                        className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${isSelected ? 'border-brand-main bg-brand-mint/10 shadow-sm' : 'border-brand-mint bg-white hover:bg-brand-grey/30'}`}
                      >
                         <div className={`p-3 rounded-xl transition-colors ${isSelected ? 'bg-brand-main text-white' : 'bg-brand-grey text-brand-charcoal/30'}`}>
                            <opt.icon size={20} />
                         </div>
                         <span className={`font-black text-sm ${isSelected ? 'text-brand-dark' : 'text-brand-charcoal/40'}`}>{opt.label}</span>
                         {isSelected && <Check size={18} className="mr-auto text-brand-main" />}
                      </button>
                    );
                  })}
               </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-8 bg-brand-grey/30 border-t border-brand-mint flex justify-between gap-4">
          {step === 2 ? (
            <button 
              onClick={() => setStep(1)} 
              className="flex items-center gap-2 px-6 py-4 font-black text-brand-dark hover:bg-white rounded-2xl transition-all cursor-pointer"
            >
               {isRtl ? <ArrowRight size={18}/> : <ArrowLeft size={18}/>}
               {isRtl ? 'חזרה' : 'Back'}
            </button>
          ) : (
            <button onClick={onClose} className="px-6 py-4 font-black text-brand-charcoal/40 hover:text-brand-dark transition-colors cursor-pointer">
              {isRtl ? 'ביטול' : 'Cancel'}
            </button>
          )}

          <button 
            onClick={() => step === 1 ? setStep(2) : handleFinish()}
            disabled={loading}
            className="flex-1 max-w-[200px] bg-brand-main text-white py-4 rounded-2xl font-black shadow-xl hover:bg-brand-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin" size={20}/> : (step === 1 ? (isRtl ? 'המשך' : 'Continue') : (isRtl ? 'יצירת האתר' : 'Finish'))}
            {!loading && (step === 1 ? (isRtl ? <ArrowLeft size={18}/> : <ArrowRight size={18}/>) : <Check size={18}/>)}
          </button>
        </div>
      </div>
    </div>
  );
}