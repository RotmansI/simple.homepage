"use client";

import React, { useState } from 'react';
import { Folder, Check, Edit3, Trash2, Loader2, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const AssetGrid = ({ 
  assets, 
  loading, 
  currentPath, 
  setCurrentPath, 
  onEditAsset, 
  mode, 
  getUsageLocations,
  siteId, // וודא שזה עובר מהאבא
  showToast,
  onRefresh
}: any) => {

  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleFolderClick = (folderName: string) => {
    setCurrentPath(currentPath ? `${currentPath}/${folderName}` : folderName);
  };

  const handleDeleteFolder = async (e: React.MouseEvent, folderName: string) => {
    e.stopPropagation();
    
    const confirmDelete = window.confirm(`Are you sure you want to delete the folder "${folderName}"?`);
    if (!confirmDelete) return;

    setIsDeleting(folderName);
    try {
      // בניית הנתיב המדויק לקובץ ה-.keep
      // מבנה: siteId / folder (or path/folder) / .keep
      const folderPath = currentPath ? `${currentPath}/${folderName}` : folderName;
      const fullKeepFilePath = `${siteId}/${folderPath}/.keep`;

      console.log("Attempting to delete keep file at:", fullKeepFilePath);

      // מחיקת קובץ ה-keep. ברגע שהוא נמחק, התיקייה "נעלמת" מהרשימה
      const { data, error } = await supabase.storage
        .from('site-assets')
        .remove([fullKeepFilePath]);

      if (error) throw error;

      // בדיקה אם הקובץ באמת נמחק (סופהבייס לא תמיד זורק שגיאה אם הקובץ לא נמצא)
      if (data && data.length > 0) {
        showToast(`Folder "${folderName}" deleted successfully`, "success");
        if (onRefresh) onRefresh();
      } else {
        // אם התיקייה קיימת אבל ה-.keep לא שם, אולי יש בה קובץ דמי אחר?
        showToast("Folder structure is inconsistent, could not find .keep file", "error");
      }

    } catch (err: any) {
      console.error("Delete folder error:", err);
      showToast(err.message || "Failed to delete folder", "error");
    } finally {
      setIsDeleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 opacity-40">
        <Loader2 className="animate-spin mb-4" size={32} />
        <p className="text-xs font-black uppercase tracking-widest">Scanning Library...</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-32">
        {assets.map((asset: any) => {
          const isFolder = asset.isFolder;
          const usage = !isFolder && getUsageLocations ? getUsageLocations(asset.url) : [];
          const inUse = usage.length > 0;
          
          // תיקייה נחשבת ריקה אם אין בה אייטמים (חוץ מה-.keep)
          const isEmptyFolder = isFolder && (asset.itemCount === 0 || !asset.itemCount);
          
          return (
            <div key={asset.id} className="group relative">
              <div 
                onClick={() => isFolder ? handleFolderClick(asset.name) : onEditAsset(asset)}
                className="relative aspect-square bg-white rounded-[2.5rem] border-2 border-transparent hover:border-brand-lavender/50 transition-all overflow-hidden shadow-sm cursor-pointer flex flex-col"
              >
                {isFolder ? (
                  <div className="flex-1 flex flex-col items-center justify-center relative bg-gradient-to-br from-white to-brand-lavender/5">
                    <div className="mb-2 text-brand-main group-hover:scale-110 transition-transform duration-300">
                      <Folder size={40} fill="currentColor" className="opacity-20" />
                    </div>
                    
                    {/* כפתור מחיקה לתיקיות ריקות בלבד */}
                    {isEmptyFolder && mode === 'manage' && (
                      <button 
                        onClick={(e) => handleDeleteFolder(e, asset.name)}
                        className="absolute top-4 right-4 p-2.5 bg-red-50 text-red-500 rounded-xl opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white z-20 shadow-sm"
                      >
                        {isDeleting === asset.name ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </button>
                    )}

                    <div className="absolute bottom-0 left-0 right-0 p-5 pt-0 flex flex-col items-center">
                      <span className="text-[10px] font-black text-brand-dark uppercase tracking-tighter truncate w-full text-center">
                        {asset.name}
                      </span>
                      <span className="text-[9px] font-bold text-brand-charcoal/30 uppercase mt-1">
                        {asset.itemCount || 0} Items
                      </span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 overflow-hidden relative">
                      <img src={asset.url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={asset.name} />
                      {inUse && (
                        <div className="absolute top-3 left-3 bg-brand-mint text-white p-1.5 rounded-lg shadow-lg z-10">
                          <Check size={12} strokeWidth={4} />
                        </div>
                      )}
                      {mode === 'manage' && (
                        <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Edit3 size={20} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div className="bg-white p-4 pt-2 flex flex-col items-center">
                      <p className="text-[10px] font-black text-brand-dark truncate w-full text-center">{asset.name}</p>
                      <p className="text-[8px] font-bold text-brand-charcoal/30 uppercase mt-0.5">
                        {inUse ? `${usage.length} Uses` : 'Available'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};