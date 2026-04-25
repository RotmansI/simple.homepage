"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { X, Trash2, Calendar, HardDrive, Save, ArrowLeft, Move, Loader2, ExternalLink, Info, Check, Link as LinkIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const AssetDetailView = ({ 
  asset, 
  onBack, 
  onDeleted, 
  onUpdated, 
  siteId, 
  currentPath, 
  showToast,
  allSections = [] 
}: any) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [name, setName] = useState("");
  const [targetPath, setTargetPath] = useState("");

  useEffect(() => {
    if (asset) {
      const nameParts = asset.name.split('.');
      nameParts.pop();
      setName(nameParts.join('.'));
      setTargetPath(currentPath);
    }
  }, [asset, currentPath]);

  // לוגיקת זיהוי שימושים
  const usageLocations = useMemo(() => {
    if (!asset.url) return [];
    const urlBase = asset.url.split('?')[0];
    const fileName = asset.name;

    return allSections.filter((section: any) => {
      const sectionString = JSON.stringify(section);
      return sectionString.includes(urlBase) || sectionString.includes(fileName);
    }).map((section: any) => ({
      id: section.id,
      type: section.type,
      name: section.content?.title || section.content?.heading || `Section: ${section.type}`
    }));
  }, [asset.url, asset.name, allSections]);

  const handleSave = async () => {
    if (!name.trim()) {
      showToast("File name cannot be empty", "error");
      return;
    }

    setIsSaving(true);
    try {
      const fileExt = asset.name.split('.').pop();
      const newFileName = `${name.replace(/[^a-zA-Z0-9]/g, '_')}.${fileExt}`;
      const oldStoragePath = `${siteId}/${currentPath ? currentPath + '/' : ''}${asset.name}`;
      const newStoragePath = `${siteId}/${targetPath ? targetPath + '/' : ''}${newFileName}`;

      if (oldStoragePath !== newStoragePath) {
        const { error: copyError } = await supabase.storage.from('site-assets').copy(oldStoragePath, newStoragePath);
        if (copyError) throw copyError;
        const { error: deleteError } = await supabase.storage.from('site-assets').remove([oldStoragePath]);
        if (deleteError) console.error("Cleanup error:", deleteError);
      }

      showToast("Asset updated successfully", "success");
      onUpdated(); 
    } catch (err: any) {
      showToast(err.message || "Update failed", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to permanently delete "${asset.name}"?`)) return;
    setIsDeleting(true);
    try {
      const storagePath = `${siteId}/${currentPath ? currentPath + '/' : ''}${asset.name}`;
      const { error } = await supabase.storage.from('site-assets').remove([storagePath]);
      if (error) throw error;
      showToast("Asset deleted permanently", "success");
      onDeleted();
    } catch (err: any) {
      showToast(err.message || "Failed to delete", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-white z-50 flex animate-in slide-in-from-right duration-300">
      
      {/* אזור התצוגה המקדימה - Preview Section */}
      <div className="flex-1 bg-[#F8F9FB] flex flex-col relative overflow-hidden h-full">
        
        {/* Header פנימי מהודק - מבטיח שהתמונה לא תעלה על הכפתורים */}
        <div className="w-full px-6 py-4 z-20 flex justify-between items-center shrink-0">
            <button 
                onClick={onBack} 
                className="flex items-center gap-2 text-[10px] font-black uppercase text-brand-dark bg-white px-4 py-2.5 rounded-xl shadow-md hover:text-brand-main transition-all border border-brand-lavender/10 group active:scale-95"
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
                Back to Library
            </button>

            <button 
                onClick={() => window.open(asset.url, '_blank')}
                className="p-2.5 bg-white text-brand-charcoal/40 hover:text-brand-main rounded-xl shadow-md border border-brand-lavender/10 transition-all active:scale-95"
                title="Open original"
            >
                <ExternalLink size={16} />
            </button>
        </div>
        
        {/* Image Container - שימוש ב-Padding ו-object-contain למניעת חיתוך */}
        <div className="flex-1 px-8 pb-8 flex items-center justify-center overflow-hidden">
           <div className="relative w-full h-full flex items-center justify-center">
                <img 
                    src={asset.url} 
                    className="max-w-full max-h-full rounded-[2rem] shadow-2xl object-contain border-[8px] border-white bg-white animate-in zoom-in-95 duration-500" 
                    alt={asset.name} 
                    style={{ maxHeight: 'calc(100% - 20px)', maxWidth: 'calc(100% - 20px)' }}
                />
           </div>
        </div>
      </div>

      {/* פאנל הגדרות - צומצם ל-400px כדי לפנות מקום לתמונה */}
      <div className="w-[400px] border-l border-brand-lavender/20 p-8 flex flex-col text-start overflow-y-auto custom-scrollbar bg-white shadow-[-10px_0_30px_rgba(0,0,0,0.01)] z-30 shrink-0">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-black text-brand-dark tracking-tighter">Asset Control</h3>
            <p className="text-[10px] font-bold text-brand-charcoal/30 uppercase mt-1 tracking-widest leading-none">Metadata & Live Status</p>
          </div>
          <button onClick={onBack} className="p-2 hover:bg-brand-grey rounded-full transition-all text-brand-charcoal/20">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 flex-1">
          {/* עריכת קובץ */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-brand-charcoal/40 ml-1 tracking-widest">Rename File</label>
              <input 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-brand-grey/50 p-4 rounded-xl font-bold text-sm text-brand-dark outline-none focus:ring-2 ring-brand-main transition-all border-none"
                placeholder="Enter new name..."
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-brand-charcoal/40 ml-1 tracking-widest">Move Path</label>
              <div className="relative">
                <input 
                  value={targetPath}
                  onChange={(e) => setTargetPath(e.target.value)}
                  className="w-full bg-brand-grey/50 p-4 pl-12 rounded-xl font-bold text-[10px] text-brand-dark outline-none focus:ring-2 ring-brand-main transition-all border-none"
                />
                <Move size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-main" />
              </div>
            </div>
          </div>

          {/* מעקב שימושים */}
          <div className="pt-6 border-t border-brand-lavender/10">
            <div className="flex items-center justify-between mb-4">
                <label className="text-[9px] font-black uppercase text-brand-charcoal/40 flex items-center gap-2 tracking-widest">
                    <LinkIcon size={12} className="text-brand-main" /> Usage Locations
                </label>
                <span className="bg-brand-main/10 text-brand-main text-[8px] font-black px-2 py-0.5 rounded-full uppercase">
                    {usageLocations.length} Hits
                </span>
            </div>
            
            {usageLocations.length > 0 ? (
              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {usageLocations.map((loc: any, idx: number) => (
                  <div key={`${loc.id}-${idx}`} className="flex items-center justify-between p-3.5 bg-brand-mint/5 border border-brand-mint/10 rounded-2xl animate-in fade-in slide-in-from-right duration-300" style={{ animationDelay: `${idx * 50}ms` }}>
                    <div className="flex flex-col">
                      <span className="text-[8px] font-black text-brand-mint uppercase tracking-widest">{loc.type}</span>
                      <span className="text-[11px] font-bold text-brand-dark opacity-70 truncate max-w-[200px]">{loc.name}</span>
                    </div>
                    <div className="w-7 h-7 rounded-full bg-brand-mint/20 flex items-center justify-center text-brand-mint">
                        <Check size={12} strokeWidth={3} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-brand-grey rounded-[2rem] flex flex-col items-center justify-center text-center">
                <Info size={20} className="text-brand-charcoal/20 mb-2" />
                <p className="text-[9px] font-bold text-brand-charcoal/40 uppercase tracking-widest leading-relaxed">
                    Not in use<br/>on your site.
                </p>
              </div>
            )}
          </div>

          {/* פרטים טכניים */}
          <div className="grid grid-cols-2 gap-4 pt-4">
             <div className="bg-brand-grey/30 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <Calendar size={14} className="text-brand-main mb-2" />
                <p className="text-[8px] font-black text-brand-charcoal/40 uppercase tracking-widest mb-1">Uploaded</p>
                <p className="text-[10px] font-bold text-brand-dark">{new Date(asset.created_at).toLocaleDateString()}</p>
             </div>
             <div className="bg-brand-grey/30 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                <HardDrive size={14} className="text-brand-main mb-2" />
                <p className="text-[8px] font-black text-brand-charcoal/40 uppercase tracking-widest mb-1">Format</p>
                <p className="text-[10px] font-bold text-brand-dark uppercase">{asset.name.split('.').pop()}</p>
             </div>
          </div>
        </div>

        {/* פעולות */}
        <div className="pt-8 space-y-3 shrink-0">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-4 bg-brand-main text-white rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-brand-main/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            {isSaving ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Update Asset</>}
          </button>
          
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="w-full py-4 bg-red-50 text-red-500 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <><Trash2 size={16} /> Delete Asset</>}
          </button>
        </div>
      </div>
    </div>
  );
};