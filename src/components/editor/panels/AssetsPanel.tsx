"use client";

import React, { useState } from 'react';
import { Loader2, Plus, FolderPlus, Check, Trash2, X, ImageIcon, Tag } from 'lucide-react';

export const AssetsPanel = ({ 
  site, assets, uploading, assetUploadRef, handleAssetUpload, handleAssetSelect, 
  deleteAsset, setSite, markChanged 
}: any) => {
  const [assetFolder, setAssetFolder] = useState<string>('all');
  const [selectedAssetForEdit, setSelectedAssetForEdit] = useState<any>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

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

  const addAssetCategory = () => {
    if (!newCategoryName) return;
    const updatedCategories = [...userCategories, newCategoryName.toLowerCase()];
    setSite((prev: any) => ({ ...prev, draft_data: { ...prev.draft_data, asset_categories: updatedCategories } }));
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  const assetsWithCategories = (assets || []).map((asset: any) => ({
    ...asset,
    category: site?.draft_data?.asset_mappings?.[asset.name] || asset.category || ''
  }));
  
  const filteredAssets = assetFolder === 'all' 
    ? assetsWithCategories 
    : assetsWithCategories.filter((a: any) => a.category === assetFolder);

  return (
    <div className="p-4 space-y-4 text-start animate-in fade-in duration-300">
      <div className="flex gap-2">
        <button onClick={() => assetUploadRef.current?.click()} className="flex-1 py-3 bg-brand-main text-white rounded-xl font-black text-[10px] shadow-lg flex items-center justify-center gap-2">
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />} UPLOAD
        </button>
        <button onClick={() => setIsAddingCategory(true)} className="p-3 bg-brand-grey rounded-xl text-brand-charcoal/40 hover:text-brand-main transition-colors shadow-sm"><FolderPlus size={18}/></button>
      </div>

      {isAddingCategory && (
        <div className="flex gap-1 p-2 bg-brand-mint/10 rounded-xl animate-in zoom-in-95 border border-brand-mint/30">
          <input autoFocus className="flex-1 bg-white p-1.5 rounded-lg text-[10px] font-bold outline-none border border-brand-mint" placeholder="New category..." value={newCategoryName} onChange={e => setNewCategoryName(e.target.value)} />
          <button onClick={addAssetCategory} className="bg-brand-main text-white p-1.5 rounded-lg"><Check size={14}/></button>
          <button onClick={() => setIsAddingCategory(false)} className="bg-white text-salmon p-1.5 rounded-lg border border-salmon/20"><X size={14}/></button>
        </div>
      )}
      
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar border-b border-brand-mint/20">
        <button onClick={() => setAssetFolder('all')} className={`px-3 py-1 rounded-full text-[9px] font-black uppercase whitespace-nowrap transition-all ${assetFolder === 'all' ? 'bg-brand-main text-white shadow-md' : 'bg-brand-grey text-brand-charcoal/40'}`}>all</button>
        {userCategories.map((f: string) => (
          <button key={f} onClick={() => setAssetFolder(f)} className={`px-3 py-1 rounded-full text-[9px] font-black uppercase whitespace-nowrap transition-all ${assetFolder === f ? 'bg-brand-main text-white shadow-md' : 'bg-brand-grey text-brand-charcoal/40'}`}>
            {f}
          </button>
        ))}
      </div>

      <input type="file" ref={assetUploadRef} className="hidden" onChange={handleAssetUpload} />
      
      <div className="grid grid-cols-2 gap-2 mt-4">
        {filteredAssets.map((asset: any, i: number) => (
          <div key={i} className="group relative aspect-square bg-brand-grey rounded-xl border border-brand-mint overflow-hidden shadow-sm hover:border-brand-main transition-all">
            <img src={asset.url} onClick={() => setSelectedAssetForEdit(asset)} className="w-full h-full object-cover cursor-pointer" alt="asset" />
            <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 pointer-events-none">
              <div className="flex justify-end gap-1 pointer-events-auto">
                <button onClick={() => deleteAsset(asset.name)} className="p-1.5 bg-white/20 hover:bg-salmon text-white rounded-md backdrop-blur-md transition-colors"><Trash2 size={12}/></button>
              </div>
              <div className="flex justify-center pointer-events-auto">
                <button onClick={() => handleAssetSelect(asset.url)} className="p-2 bg-brand-main text-white rounded-full shadow-lg"><Check size={14}/></button>
              </div>
            </div>
            {asset.category && <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/60 text-white text-[7px] font-black uppercase rounded tracking-tighter">{asset.category}</div>}
          </div>
        ))}
      </div>

      {/* ASSET EDIT MODAL */}
      {selectedAssetForEdit && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-brand-dark/40 backdrop-blur-md p-6">
          <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col border border-brand-mint animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-brand-mint flex justify-between items-center bg-brand-grey/30">
              <h3 className="font-black uppercase tracking-tighter text-xl flex items-center gap-2"><ImageIcon size={20}/> Asset Details</h3>
              <button onClick={() => setSelectedAssetForEdit(null)} className="p-2 hover:bg-brand-mint rounded-full transition-all text-brand-charcoal/40"><X/></button>
            </div>
            <div className="p-8 flex flex-col items-center gap-6">
              <div className="w-full aspect-video bg-brand-grey rounded-[2rem] overflow-hidden border border-brand-mint shadow-inner flex items-center justify-center p-4">
                <img src={selectedAssetForEdit.url} className="max-h-full max-w-full object-contain drop-shadow-xl" alt="preview" />
              </div>
              <div className="w-full space-y-4">
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase text-brand-charcoal/40 tracking-widest flex items-center gap-2"><Tag size={12} className="text-brand-main"/> Select Category</span>
                  <div className="flex flex-wrap gap-2">
                    {['all', ...userCategories].map((cat: string) => {
                      const currentCat = site?.draft_data?.asset_mappings?.[selectedAssetForEdit.name] || '';
                      const isActive = (cat === 'all' && !currentCat) || (cat === currentCat);
                      return (
                        <button key={cat} onClick={() => handleUpdateAssetCategory(selectedAssetForEdit.name, cat === 'all' ? '' : cat)} className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${isActive ? 'bg-brand-main border-brand-main text-white shadow-md' : 'bg-brand-grey border-transparent text-brand-charcoal/40 hover:border-brand-mint'}`}>{cat}</button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 bg-brand-grey/30 border-t border-brand-mint flex gap-3">
              <button onClick={() => { handleAssetSelect(selectedAssetForEdit.url); setSelectedAssetForEdit(null); }} className="flex-1 py-4 bg-brand-main text-white rounded-2xl font-black text-xs shadow-lg flex items-center justify-center gap-2 uppercase"><Check size={16}/> Select Image</button>
              <button onClick={() => { deleteAsset(selectedAssetForEdit.name); setSelectedAssetForEdit(null); }} className="px-6 py-4 bg-salmon/10 text-salmon rounded-2xl font-black text-xs hover:bg-salmon hover:text-white transition-all uppercase"><Trash2 size={16}/></button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};