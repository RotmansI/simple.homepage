"use client";

import React, { useState, useMemo } from 'react';
import { Loader2, Check, Trash2, X, ImageIcon, Tag, LayoutGrid, MapPin, ExternalLink, Columns, Grid3X3, Search, HardDrive } from 'lucide-react';

export const AssetsPanel = ({ 
  site, assets, uploading, assetUploadRef, handleAssetSelect, 
  deleteAsset, setSite, markChanged,
  openAssetManager 
}: any) => {
  const [selectedAssetForEdit, setSelectedAssetForEdit] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [cols, setCols] = useState<2 | 3>(3); // ברירת מחדל 3 עמודות

  // לוגיקת קטגוריות
  const userCategories = site?.draft_data?.asset_categories || ['logos', 'menu', 'gallery'];

  const handleUpdateAssetCategory = (assetName: string, category: string) => {
    setSelectedAssetForEdit((prev: any) => ({ ...prev, category }));
    setSite((prev: any) => {
      const currentDraft = prev?.draft_data || {};
      const currentMappings = currentDraft.asset_mappings || {};
      return {
        ...prev,
        draft_data: { ...currentDraft, asset_mappings: { ...currentMappings, [assetName]: category } }
      };
    });
    if (markChanged) markChanged('site', 'asset_category');
  };

  // פילטור אייטמים לפי חיפוש (שם או נתיב) והתעלמות מתיקיות
  const filteredAssets = useMemo(() => {
    const allItems = (assets || []).filter((a: any) => !a.isFolder && a.name !== '.keep');
    if (!searchQuery) return allItems;
    
    return allItems.filter((asset: any) => 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (asset.path && asset.path.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [assets, searchQuery]);

  return (
    <div className="p-4 space-y-5 text-start animate-in fade-in duration-300 h-full flex flex-col overflow-hidden">
      
      {/* Action Area */}
      <div className="space-y-3 shrink-0">
        <button 
          onClick={() => openAssetManager && openAssetManager()} 
          className="w-full py-4 bg-brand-main text-white rounded-2xl font-black text-[11px] shadow-lg shadow-brand-main/20 flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all uppercase tracking-[0.2em]"
        >
          <HardDrive size={16} /> Open Asset Manager
        </button>

        {/* Search Field */}
        <div className="relative group">
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-brand-grey/50 p-4 pl-12 rounded-2xl font-bold text-[11px] text-brand-dark outline-none focus:ring-2 ring-brand-main transition-all border border-transparent"
            placeholder="SEARCH ASSETS..."
          />
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/30 group-focus-within:text-brand-main transition-colors" />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-charcoal/20 hover:text-brand-dark">
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Grid Controls */}
      <div className="flex justify-between items-end px-1 shrink-0">
        <div className="text-start">
          <h3 className="text-brand-dark font-black text-[11px] tracking-tighter uppercase leading-none">Select Asset</h3>
          <p className="text-[8px] font-bold text-brand-charcoal/30 uppercase tracking-widest mt-1">
            {filteredAssets.length} Items Available
          </p>
        </div>

        <div className="flex bg-brand-grey p-1 rounded-xl border border-brand-lavender/10">
          <button 
            onClick={() => setCols(2)}
            className={`p-1.5 rounded-lg transition-all ${cols === 2 ? 'bg-white shadow-sm text-brand-main' : 'text-brand-charcoal/30 hover:text-brand-charcoal'}`}
          >
            <Columns size={14} />
          </button>
          <button 
            onClick={() => setCols(3)}
            className={`p-1.5 rounded-lg transition-all ${cols === 3 ? 'bg-white shadow-sm text-brand-main' : 'text-brand-charcoal/30 hover:text-brand-charcoal'}`}
          >
            <Grid3X3 size={14} />
          </button>
        </div>
      </div>

      {/* Main Selection Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2">
        <div className={`grid ${cols === 2 ? 'grid-cols-2' : 'grid-cols-3'} gap-3 pb-32`}>
          {filteredAssets.map((asset: any, i: number) => {
            // חילוץ הנתיב מתוך ה-Path המלא (בלי שם הקובץ)
            const displayPath = asset.path ? asset.path.split('/').slice(0, -1).join('/') || 'Root' : 'Root';
            
            return (
              <div 
                key={asset.id || i} 
                className="group relative bg-white rounded-2xl border border-brand-lavender/20 overflow-hidden shadow-sm hover:shadow-md hover:border-brand-main transition-all flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-brand-grey/30 border-b border-brand-lavender/5">
                  <img 
                    src={asset.url} 
                    className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-110" 
                    alt={asset.name} 
                    onClick={() => handleAssetSelect(asset.url)}
                  />
                  
                  <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                    <button 
                      onClick={() => handleAssetSelect(asset.url)} 
                      className="p-2 bg-brand-mint text-white rounded-full shadow-xl hover:scale-110 transition-transform"
                    >
                      <Check size={14} strokeWidth={4} />
                    </button>
                    <button 
                      onClick={() => setSelectedAssetForEdit(asset)} 
                      className="p-2 bg-white text-brand-dark rounded-full shadow-xl hover:scale-110 transition-transform"
                    >
                      <ExternalLink size={14} strokeWidth={3} />
                    </button>
                  </div>
                </div>

                <div className="p-2 text-start flex flex-col gap-0.5">
                  <p className="text-[9px] font-black text-brand-dark truncate leading-tight uppercase">
                    {asset.name}
                  </p>
                  <div className="flex items-center gap-1 opacity-40">
                    <MapPin size={8} />
                    <span className="text-[7px] font-bold uppercase truncate tracking-tighter">
                      {displayPath}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredAssets.length === 0 && (
            <div className="col-span-full py-20 flex flex-col items-center justify-center opacity-30 text-center">
              <ImageIcon size={40} className="mb-4 text-brand-charcoal/20" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-relaxed">No matching assets<br/>found in library</p>
            </div>
          )}
        </div>
      </div>

      {/* ASSET EDIT MODAL */}
      {selectedAssetForEdit && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-brand-dark/40 backdrop-blur-md p-6">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-brand-lavender/20 animate-in zoom-in-95 duration-200 text-start">
            <div className="p-6 border-b border-brand-lavender/20 flex justify-between items-center bg-brand-grey/30">
              <h3 className="font-black uppercase tracking-tighter text-xl flex items-center gap-2"><ImageIcon size={20}/> Asset Details</h3>
              <button onClick={() => setSelectedAssetForEdit(null)} className="p-2 hover:bg-brand-lavender/50 rounded-full transition-all text-brand-charcoal/40"><X/></button>
            </div>
            <div className="p-8 flex flex-col items-center gap-6">
              <div className="w-full aspect-video bg-brand-grey rounded-[2rem] overflow-hidden border border-brand-lavender/20 shadow-inner flex items-center justify-center p-4">
                <img src={selectedAssetForEdit.url} className="max-h-full max-w-full object-contain drop-shadow-xl" alt="preview" />
              </div>
              <div className="w-full space-y-4">
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase text-brand-charcoal/40 tracking-widest flex items-center gap-2"><Tag size={12} className="text-brand-main"/> Category Mapping</span>
                  <div className="flex flex-wrap gap-2">
                    {['all', ...userCategories].map((cat: string) => {
                      const currentCat = site?.draft_data?.asset_mappings?.[selectedAssetForEdit.name] || '';
                      const isActive = (cat === 'all' && !currentCat) || (cat === currentCat);
                      return (
                        <button 
                          key={cat} 
                          onClick={() => handleUpdateAssetCategory(selectedAssetForEdit.name, cat === 'all' ? '' : cat)} 
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${isActive ? 'bg-brand-main border-brand-main text-white shadow-md' : 'bg-brand-grey border-transparent text-brand-charcoal/40 hover:border-brand-lavender/50'}`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-brand-grey/30 border-t border-brand-lavender/20 flex gap-3">
              <button onClick={() => { handleAssetSelect(selectedAssetForEdit.url); setSelectedAssetForEdit(null); }} className="flex-1 py-4 bg-brand-main text-white rounded-2xl font-black text-xs shadow-lg flex items-center justify-center gap-2 uppercase tracking-widest"><Check size={16}/> Select Image</button>
              <button onClick={() => { deleteAsset(selectedAssetForEdit.name); setSelectedAssetForEdit(null); }} className="px-6 py-4 bg-red-50 text-red-500 rounded-2xl font-black text-xs hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest"><Trash2 size={16}/></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};