"use client";

import React, { useState } from 'react';
import { X, Folder, Check, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const UploadPreviewOverlay = ({ pendingUpload, siteId, currentPath, onClose, onComplete, showToast }: any) => {
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState(pendingUpload.name);

  const executeUpload = async () => {
    if (!name.trim()) {
      showToast("Please enter a file name", "error");
      return;
    }

    setUploading(true);
    try {
      const fileExt = pendingUpload.file.name.split('.').pop();
      // ניקוי שם הקובץ מתווים בעייתיים
      const safeName = name.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${Date.now()}_${safeName}.${fileExt}`;
      
      const uploadPath = currentPath ? `${siteId}/${currentPath}/${fileName}` : `${siteId}/${fileName}`;

      const { error } = await supabase.storage
        .from('site-assets')
        .upload(uploadPath, pendingUpload.file);

      if (error) throw error;

      // הצלחה - קריאה לפונקציית הסיום ב"מוח המרכזי"
      onComplete();
    } catch (err: any) {
      showToast(err.message || "Upload failed", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="absolute inset-0 z-[1050] bg-white flex animate-in slide-in-from-bottom duration-500">
      {/* צד שמאל - תצוגה מקדימה */}
      <div className="flex-1 bg-[#F8F9FB] p-12 flex items-center justify-center relative">
        <img 
          src={pendingUpload.preview} 
          className="max-w-full max-h-[70vh] rounded-[3rem] shadow-2xl object-contain border-[12px] border-white bg-white" 
          alt="Upload Preview"
        />
      </div>

      {/* צד ימין - הגדרות אישור */}
      <div className="w-[400px] bg-white border-l border-brand-lavender/20 p-10 flex flex-col text-start shadow-[-20px_0_50px_rgba(0,0,0,0.02)]">
        <div className="mb-10 flex justify-between items-start">
          <div>
            <h3 className="text-xl font-black text-brand-dark tracking-tighter">Confirm Upload</h3>
            <p className="text-[11px] font-bold text-brand-charcoal/30 uppercase tracking-widest mt-1 leading-none">Adding to your library</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-brand-grey rounded-full transition-all text-brand-charcoal/30">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-8 flex-1">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-brand-charcoal/40 ml-1 tracking-widest">Destination Folder</label>
            <div className="flex items-center gap-3 bg-brand-grey/50 p-4 rounded-2xl text-[11px] font-bold text-brand-charcoal/60">
              <Folder size={16} className="text-brand-main" /> {currentPath || 'Root Library'}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-brand-charcoal/40 ml-1 tracking-widest">Asset Name</label>
            <input 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-brand-grey/50 p-4 rounded-2xl font-bold text-brand-dark outline-none focus:ring-2 ring-brand-main transition-all"
              placeholder="Give this file a name..."
            />
          </div>
        </div>

        <div className="pt-8">
          <button 
            onClick={executeUpload}
            disabled={uploading}
            className="w-full py-5 bg-brand-main text-white rounded-[2rem] font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-brand-main/20 transition-all flex items-center justify-center gap-2"
          >
            {uploading ? <Loader2 className="animate-spin" /> : <><Check size={18} /> Finish & Upload</>}
          </button>
        </div>
      </div>
    </div>
  );
};