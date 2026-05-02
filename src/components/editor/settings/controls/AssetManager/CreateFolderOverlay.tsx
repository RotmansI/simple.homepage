"use client";

import React, { useState } from 'react';
import { X, Folder, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

interface CreateFolderOverlayProps {
  siteId: string;
  currentPath: string;
  onClose: () => void;
  onComplete: () => void;
  showToast: (message: string, type: any) => void;
}

export const CreateFolderOverlay = ({ 
  siteId, 
  currentPath, 
  onClose, 
  onComplete, 
  showToast 
}: CreateFolderOverlayProps) => {

  const { lang } = useLanguage();
  const t = translations[lang as Language];
  
  const [loading, setLoading] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleCreate = async () => {
    if (!folderName.trim()) return;

    setLoading(true);
    try {
      // ניקוי שם התיקייה מתווים לא חוקיים
      const safeName = folderName.replace(/[^a-zA-Z0-9\s-_]/g, '').trim();
      
      // בניית הנתיב: siteId / currentPath / newFolder / .keep
      const folderPath = currentPath ? `${currentPath}/${safeName}` : safeName;
      const fullPath = `${siteId}/${folderPath}/.keep`;

      // יצירת קובץ דמי כדי ש-Supabase יכיר בתיקייה
      const { error } = await supabase.storage
        .from('site-assets')
        .upload(fullPath, new Blob(['']), { upsert: true });

      if (error) throw error;

      showToast(`${t.editor.modals.assetManager.createFolder.success}`, "success");
      onComplete();
    } catch (err: any) {
      showToast(err.message || t.editor.modals.assetManager.createFolder.error, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[1050] bg-[#FDFDFD]/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-200">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-brand-lavender/20 w-full max-w-sm text-start animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-2xl font-black text-brand-dark tracking-tighter">{t.editor.modals.assetManager.createFolder.title}</h3>
            <p className="text-[10px] font-bold text-brand-charcoal/30 uppercase tracking-widest mt-1">{t.editor.modals.assetManager.createFolder.subtitle}</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-brand-grey rounded-full transition-all text-brand-charcoal/30"
          >
            <X size={20} />
          </button>
        </div>

        {/* Input Area */}
        <div className="space-y-6">
<div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-brand-charcoal/40 ml-1 tracking-widest">
              {t.editor.modals.assetManager.createFolder.label}
            </label>
            
            <input 
              autoFocus
              value={folderName}
              dir='ltr'
              onChange={(e) => {
                // מאפשר רק אותיות באנגלית ומקף
                const value = e.target.value.replace(/[^a-zA-Z-]/g, '');
                setFolderName(value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              className="w-full bg-brand-grey/50 p-5 rounded-[1.5rem] font-bold text-sm text-brand-dark outline-none focus:ring-2 ring-brand-main transition-all border-none"
              placeholder={t.editor.modals.assetManager.createFolder.placeholder}
            />

            {/* תיבת המידע החדשה */}
            <div className="flex items-start gap-2 px-2 mt-1">
              <div className="w-1 h-1 rounded-full bg-brand-main mt-1.5 shrink-0" />
              <p className="text-[9px] font-bold text-brand-charcoal/40 leading-tight italic">
                {t.editor.modals.assetManager.createFolder.validationNote}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 px-2 py-3 bg-brand-grey/30 rounded-2xl">
            <Folder size={14} className="text-brand-main" />
            <div className="flex flex-col">
                <span className="text-[8px] font-black text-brand-charcoal/30 uppercase leading-none mb-1">{t.editor.modals.assetManager.createFolder.locationLabel}</span>
                <span className="text-[10px] font-bold text-brand-dark truncate max-w-[220px]">
                    {currentPath ? `${t.editor.modals.assetManager.createFolder.filesPrefix} / ${currentPath}` : t.editor.modals.assetManager.createFolder.rootLocation}
                </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-10">
          <button 
            onClick={onClose}
            className="flex-1 py-4 bg-brand-grey text-brand-charcoal/60 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-lavender/20 transition-all"
          >
            {t.editor.modals.assetManager.createFolder.cancel}
          </button>
          <button 
            onClick={handleCreate}
            disabled={loading || !folderName.trim()}
            className="flex-[2] py-4 bg-brand-main text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-brand-main/20 disabled:opacity-50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : t.editor.modals.assetManager.createFolder.create}
          </button>
        </div>
      </div>
    </div>
  );
};