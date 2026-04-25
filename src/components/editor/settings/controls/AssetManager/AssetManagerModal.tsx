"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ImageIcon, RefreshCw, FolderPlus, Upload, ChevronRight, Home } from 'lucide-react';
import { fetchSiteAssets } from '@/services/assets';
import { AssetGrid } from './AssetGrid';
import { UploadPreviewOverlay } from './UploadPreviewOverlay';
import { AssetDetailView } from './AssetDetailView';
import { CreateFolderOverlay } from './CreateFolderOverlay';
import Toast, { ToastType } from '@/components/ui/Toast';

export const AssetManagerModal = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  siteId, 
  mode = 'manage', 
  allSections = [] 
}: any) => {
  const [mounted, setMounted] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState<string>("");
  
  const [pendingUpload, setPendingUpload] = useState<any>(null);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    setMounted(true);
    if (isOpen && siteId) {
      loadAssets();
    }
  }, [isOpen, siteId, currentPath]);

  const loadAssets = async () => {
    setLoading(true);
    try {
      const data = await fetchSiteAssets(siteId, currentPath);
      setAssets(data);
    } catch (error) {
      showToast("Failed to load assets", "error");
    } finally {
      setLoading(false);
    }
  };

  // פונקציית הטיפול בבחירת קובץ להעלאה
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // יצירת אובייקט להעלאה שכולל את הקובץ, תצוגה מקדימה ושם ראשוני
      setPendingUpload({ 
        file: file, 
        preview: URL.createObjectURL(file), 
        name: file.name.split('.')[0] 
      });
    }
  };

  const closeUploadOverlay = () => {
    setPendingUpload(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (!isOpen || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] bg-brand-dark/40 backdrop-blur-sm flex items-start justify-center pt-[60px] pb-10 px-4 md:px-8 overflow-hidden animate-in fade-in duration-300">
      
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-[1100] p-3 bg-white text-brand-dark rounded-full shadow-2xl hover:bg-red-50 hover:text-red-500 transition-all active:scale-95"
      >
        <X size={24} />
      </button>

      <div className="bg-[#FDFDFD] w-full max-w-7xl h-full max-h-[calc(100vh-100px)] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/40 relative animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="p-6 bg-white border-b border-brand-lavender/30 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-black text-brand-dark tracking-tighter flex items-center gap-2 text-start">
              <ImageIcon className="text-brand-main" size={24} />
              Asset Manager
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="text-[10px] font-black bg-brand-main/10 text-brand-main px-2 py-0.5 rounded uppercase tracking-wider">
                 {mode === 'select' ? 'Selection' : 'Admin'}
               </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
                onClick={loadAssets} 
                className="p-2.5 bg-brand-grey text-brand-charcoal/40 hover:text-brand-main rounded-xl transition-all"
             >
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
             </button>

             {!editingAsset && (
               <div className="flex gap-2 bg-brand-grey p-1.5 rounded-2xl text-start">
                  <button 
                    onClick={() => setIsCreatingFolder(true)}
                    className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-brand-charcoal/60 hover:text-brand-dark hover:bg-white transition-all shadow-sm border border-transparent"
                  >
                    <FolderPlus size={14} /> New Folder
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2.5 bg-brand-main text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-brand-main/20 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <Upload size={14} /> Upload Assets
                  </button>
               </div>
             )}
             
             <button 
               onClick={onClose} 
               className="p-2.5 bg-brand-grey hover:bg-red-50 hover:text-red-500 rounded-full transition-all ml-2"
             >
               <X size={20} />
             </button>
          </div>
        </div>

        {/* hidden file input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          onChange={handleFileChange}
          accept="image/*" 
        />

        {/* Main Content Area */}
        <div className="flex-1 relative bg-[#F8F9FB] overflow-hidden flex flex-col"> 
          
          {!editingAsset && (
            <div className="px-8 pt-6 pb-2 shrink-0">
              <nav className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-xl border border-brand-lavender/10 w-fit backdrop-blur-sm">
                <button 
                  onClick={() => setCurrentPath("")}
                  className={`flex items-center justify-center p-1 rounded-md transition-colors ${!currentPath ? 'text-brand-main bg-white shadow-sm' : 'text-brand-charcoal/40 hover:text-brand-main'}`}
                >
                  <Home size={14} />
                </button>
                
                {currentPath && currentPath.split('/').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    <ChevronRight size={12} className="text-brand-charcoal/20" />
                    <button 
                      onClick={() => setCurrentPath(arr.slice(0, i + 1).join('/'))}
                      className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded transition-all ${
                        i === arr.length - 1 
                        ? 'text-brand-dark bg-white shadow-sm' 
                        : 'text-brand-charcoal/40 hover:text-brand-main'
                      }`}
                    >
                      {part}
                    </button>
                  </React.Fragment>
                ))}
              </nav>
            </div>
          )}

          <div className="flex-1 overflow-y-auto custom-scrollbar h-full relative">
            {!editingAsset ? (
                <AssetGrid 
                    assets={assets} 
                    loading={loading}
                    currentPath={currentPath}
                    setCurrentPath={setCurrentPath}
                    onEditAsset={(asset: any) => setEditingAsset(asset)}
                    mode={mode}
                    allSections={allSections}
                    showToast={showToast}
                    siteId={siteId}
                    onRefresh={loadAssets}
                />
              ) : (
                <AssetDetailView 
                    asset={editingAsset}
                    siteId={siteId}
                    currentPath={currentPath}
                    allSections={allSections}
                    onBack={() => setEditingAsset(null)}
                    onDeleted={() => { setEditingAsset(null); loadAssets(); }}
                    onUpdated={() => { setEditingAsset(null); loadAssets(); }}
                    showToast={showToast}
                />
              )}

            {/* Overlays */}
            {isCreatingFolder && (
              <CreateFolderOverlay 
                siteId={siteId}
                currentPath={currentPath}
                onClose={() => setIsCreatingFolder(false)}
                showToast={showToast}
                onComplete={() => {
                  setIsCreatingFolder(false);
                  loadAssets();
                }}
              />
            )}

            {pendingUpload && (
              <UploadPreviewOverlay 
                pendingUpload={pendingUpload} 
                siteId={siteId}
                currentPath={currentPath}
                onClose={closeUploadOverlay}
                showToast={showToast} 
                onComplete={() => { 
                  closeUploadOverlay(); 
                  loadAssets();
                }}
              />
            )}
          </div>
        </div>
      </div>

      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>,
    document.body
  );
};