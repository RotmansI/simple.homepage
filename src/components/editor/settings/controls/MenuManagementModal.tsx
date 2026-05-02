"use client";

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Upload, Plus, Save, FileJson, Trash2, LayoutGrid, 
  Utensils, DollarSign, Image as ImageIcon, Clock, Calendar, Link as LinkIcon 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Toast, { ToastType } from '@/components/ui/Toast';
import { useLanguage } from '@/context/LanguageContext';
import { Language, translations } from '@/lib/translations/index';

// הגדרת ה-Props לפי הסטנדרט של ה-Sidebar
interface MenuManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteId?: string;
  site?: any;
  setSite?: any;
}

interface MenuItem {
  id: string;
  name: string;
  price: string;
  description: string;
  image_url?: string;
}

interface MenuCategory {
  id: string;
  name: string;
  description: string;
  items: MenuItem[];
}

interface DayAvailability {
  active: boolean;
  start: string;
  end: string;
}

interface MenuAvailability {
  [key: string]: DayAvailability;
}

const DEFAULT_AVAILABILITY: MenuAvailability = {
  "Sunday": { active: true, start: "09:00", end: "22:00" },
  "Monday": { active: true, start: "09:00", end: "22:00" },
  "Tuesday": { active: true, start: "09:00", end: "22:00" },
  "Wednesday": { active: true, start: "09:00", end: "22:00" },
  "Thursday": { active: true, start: "09:00", end: "22:00" },
  "Friday": { active: true, start: "09:00", end: "22:00" },
  "Saturday": { active: true, start: "09:00", end: "22:00" }
};

export default function MenuManagementModal({ 
  isOpen, 
  onClose, 
  siteId, 
  site, 
  setSite 
}: MenuManagementModalProps) {
  const { lang } = useLanguage();
  const t = translations[lang as Language];
  const [mounted, setMounted] = useState(false);
  const [menus, setMenus] = useState<any[]>([]);
  const [activeMenu, setActiveMenu] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'availability'>('content');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const showToast = (message: string, type: ToastType = 'success') => setToast({ message, type });

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
        document.body.style.overflow = 'hidden';
        loadMenus();
    } else {
        document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen, siteId]);

const loadMenus = async () => {
  if (!siteId) return;

  setLoading(true);
  try {
    const { data, error } = await supabase
      .from('organization_menus')
      .select('*')
      .eq('site_id', siteId) // שינוי שם העמודה
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    if (data) {
      setMenus(data);
      if (!activeMenu && data.length > 0) setActiveMenu(data[0]);
    }
  } catch (err) {
    console.error(t.editor.modals.menuManager.toasts.loadError, err);
    showToast(t.editor.modals.menuManager.toasts.loadError, "error");
  } finally {
    setLoading(false);
  }
};

  const handleCreateNew = async (customName?: string, customData?: any) => {
  if (!siteId) return;
  
  try {
    const newMenu = {
      name: customName || t.editor.modals.menuManager.defaults.newMenu,
      site_id: siteId, // שינוי שם העמודה
      menu_data: customData || { categories: [] },
      menu_availability: DEFAULT_AVAILABILITY 
    };
    
    const { data, error } = await supabase
      .from('organization_menus')
      .insert(newMenu)
      .select()
      .single();
    
    if (error) throw error;

      if (data) {
        setMenus(prev => [data, ...prev]);
        setActiveMenu(data);
        showToast(customName ? t.editor.modals.menuManager.toasts.importSuccess : t.editor.modals.menuManager.toasts.createSuccess);
        return data;
      }
    } catch (err) {
      showToast(t.editor.modals.menuManager.toasts.createError, "error");
      return null;
    }
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const rawJson = JSON.parse(event.target?.result as string);
        const parseExternalMenu = (data: any) => {
          const source = Array.isArray(data) ? data : (data.categories || []);
          return {
            categories: source.map((cat: any) => ({
              id: crypto.randomUUID(),
              name: cat.name || t.editor.modals.menuManager.defaults.unnamedCategory,
              description: cat.description || "",
              items: (cat.children || cat.items || []).map((item: any) => ({
                id: crypto.randomUUID(),
                name: item.name || t.editor.modals.menuManager.defaults.unnamedItem,
                price: item.price?.toString() || "0",
                description: item.description || "",
                image_url: item.image_url || item.imageUrl || item.image || ""
              }))
            }))
          };
        };

        const menuName = prompt(t.editor.modals.menuManager.placeholders.importPrompt, t.editor.modals.menuManager.placeholders.importedMenuDefault);
        if (menuName) {
          const formattedData = parseExternalMenu(rawJson);
          if (formattedData.categories.length === 0) {
            showToast(t.editor.modals.menuManager.toasts.noJsonData, "error");
            return;
          }
          const created = await handleCreateNew(menuName, formattedData);
          if (created && fileInputRef.current) fileInputRef.current.value = '';
        }
      } catch (err) {
        showToast(t.editor.modals.menuManager.toasts.parseError, "error");
      }
    };
    reader.readAsText(file);
  };

  const updateActiveMenuData = (newCategories: MenuCategory[]) => {
    setActiveMenu({
      ...activeMenu,
      menu_data: { ...activeMenu.menu_data, categories: newCategories }
    });
  };

  const addCategory = () => {
    const newCategory: MenuCategory = {
      id: crypto.randomUUID(),
      name: t.editor.modals.menuManager.defaults.newCategory,
      description: "",
      items: []
    };
    updateActiveMenuData([...activeMenu.menu_data.categories, newCategory]);
  };

  const addItem = (categoryId: string) => {
    const newItem: MenuItem = {
      id: crypto.randomUUID(),
      name: t.editor.modals.menuManager.defaults.newItem,
      price: "0",
      description: "",
      image_url: ""
    };
    const updatedCategories = activeMenu.menu_data.categories.map((cat: MenuCategory) => 
      cat.id === categoryId ? { ...cat, items: [...cat.items, newItem] } : cat
    );
    updateActiveMenuData(updatedCategories);
  };

  const saveToDatabase = async () => {
    if (!activeMenu) return;
    setLoading(true);
    const { error } = await supabase
      .from('organization_menus')
      .update({
        name: activeMenu.name,
        description: activeMenu.description,
        menu_data: activeMenu.menu_data,
        menu_availability: activeMenu.menu_availability 
      })
      .eq('id', activeMenu.id);

    if (!error) {
      showToast(t.editor.modals.menuManager.toasts.saveSuccess);
      await loadMenus();
    } else {
      showToast(t.editor.modals.menuManager.toasts.saveError, "error");
    }
    setLoading(false);
  };

  const deleteMenu = async (id: string) => {
    if (!confirm(t.editor.modals.menuManager.actions.deleteConfirm)) return;
    const { error } = await supabase.from('organization_menus').delete().eq('id', id);
    if (!error) {
      showToast(t.editor.modals.menuManager.toasts.deleteSuccess, "info");
      const updated = menus.filter(m => m.id !== id);
      setMenus(updated);
      setActiveMenu(updated[0] || null);
    }
  };

  const toggleDay = (day: string) => {
    const availability = activeMenu.menu_availability || DEFAULT_AVAILABILITY;
    const updated = {
      ...availability,
      [day]: { ...availability[day], active: !availability[day].active }
    };
    setActiveMenu({ ...activeMenu, menu_availability: updated });
  };

  const updateDayTime = (day: string, field: 'start' | 'end', value: string) => {
    const availability = activeMenu.menu_availability || DEFAULT_AVAILABILITY;
    const updated = {
      ...availability,
      [day]: { ...availability[day], [field]: value }
    };
    setActiveMenu({ ...activeMenu, menu_availability: updated });
  };

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div className="fixed inset-0 z-[1000] bg-brand-dark/40 backdrop-blur-sm flex items-start justify-center pt-[60px] pb-10 px-4 md:px-8 overflow-hidden animate-in fade-in duration-300" dir={lang === 'he' ? 'rtl' : 'ltr'}>
      
      {toast && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={() => setToast(null)} 
        />
      )}

      <div className="bg-[#FDFDFD] w-full max-w-7xl h-full max-h-[calc(100vh-140px)] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/40 animate-in zoom-in-95 duration-300 text-start font-sans">
        
        {/* Header */}
        <div className="p-6 bg-white border-b border-brand-lavender/30 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl font-black text-brand-dark tracking-tighter flex items-center gap-2">
              <Utensils className="text-brand-main" size={24} />
              {t.editor.modals.menuManager.title}
            </h2>
            <p className="text-[11px] font-bold text-brand-charcoal/50 uppercase tracking-widest">{t.editor.modals.menuManager.subtitle}</p>
          </div>
          <div className="flex items-center gap-3">
             <input type="file" ref={fileInputRef} onChange={handleImportJson} accept=".json" className="hidden" />
             <button 
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 bg-brand-grey text-brand-dark px-5 py-2.5 rounded-xl font-bold hover:bg-brand-mint/20 transition-all text-sm shadow-sm"
             >
               <FileJson size={18} /> {t.editor.modals.menuManager.actions.import}
             </button>
             <button 
                onClick={() => handleCreateNew()} 
                className="flex items-center gap-2 bg-brand-main text-white px-5 py-2.5 rounded-xl font-black hover:shadow-lg hover:shadow-brand-main/20 transition-all text-sm"
             >
               <Plus size={20} /> {t.editor.modals.menuManager.actions.create}
             </button>
             <div className="w-px h-8 bg-brand-lavender/30 mx-2" />
             <button onClick={onClose} className="p-2.5 bg-brand-grey hover:bg-red-50 hover:text-red-500 rounded-full transition-all">
               <X size={20} />
             </button>
          </div>
        </div>

        {/* שאר תוכן המודאל ללא שינוי פונקציונלי */}
        <div className="flex-1 flex overflow-hidden">
          <div className="w-64 bg-white border-r border-brand-lavender/20 p-5 overflow-y-auto space-y-2 custom-scrollbar">
            <p className="text-[10px] font-black text-brand-charcoal/20 uppercase tracking-widest px-2 mb-4">{t.editor.modals.menuManager.libraryLabel}</p>
            {menus.map(m => (
              <div key={m.id} className="group relative">
                <button 
                  onClick={() => { setActiveMenu(m); setActiveTab('content'); }}
                  className={`w-full text-end p-3.5 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${activeMenu?.id === m.id ? 'bg-brand-main/10 text-brand-main' : 'hover:bg-brand-grey text-brand-dark'}`}
                >
                  <div className={`w-2 h-2 rounded-full ${activeMenu?.id === m.id ? 'bg-brand-main animate-pulse' : 'bg-brand-lavender'}`} />
                  <span className="truncate">{m.name}</span>
                </button>
                <button 
                  onClick={() => deleteMenu(m.id)}
                  // שימוש בתנאי מפורש: בעברית הצמד לשמאל (left), באנגלית הצמד לימין (right)
                  className={`absolute ${lang === 'he' ? 'left-2' : 'right-2'} top-1/2 -translate-y-1/2 p-1.5 text-brand-charcoal/20 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-all`}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto bg-[#F8F9FB] relative custom-scrollbar">
            {activeMenu ? (
              <div className="p-10 max-w-5xl mx-auto space-y-6">
                {/* תוכן עריכה כפי שהיה */}
                <div className="flex gap-4 mb-4">
                  <button 
                    onClick={() => setActiveTab('content')}
                    className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'content' ? 'bg-brand-dark text-white' : 'bg-white text-brand-charcoal/40 hover:bg-brand-lavender/20'}`}
                  >
                    {t.editor.modals.menuManager.tabs.content}
                  </button>
                  <button 
                    onClick={() => setActiveTab('availability')}
                    className={`px-6 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all ${activeTab === 'availability' ? 'bg-brand-dark text-white' : 'bg-white text-brand-charcoal/40 hover:bg-brand-lavender/20'}`}
                  >
                    {t.editor.modals.menuManager.tabs.availability}
                  </button>
                </div>

                {activeTab === 'content' ? (
                  <>
                    <div className="bg-white p-8 rounded-[2rem] border border-brand-lavender/30 shadow-sm flex justify-between items-center text-start">
                      <div className="flex-1">
                        <input 
                          value={activeMenu.name}
                          onChange={e => setActiveMenu({...activeMenu, name: e.target.value})}
                          className="text-3xl font-black text-brand-dark bg-transparent border-none outline-none focus:text-brand-main w-full tracking-tighter"
                          placeholder={t.editor.modals.menuManager.placeholders.menuName}
                        />
                        <input 
                          value={activeMenu.description || ''}
                          onChange={e => setActiveMenu({...activeMenu, description: e.target.value})}
                          className="text-sm font-bold text-brand-charcoal/40 bg-transparent border-none outline-none w-full mt-1"
                          placeholder={t.editor.modals.menuManager.placeholders.description}
                        />
                      </div>
                      <button onClick={saveToDatabase} disabled={loading} className="flex items-center gap-2 bg-brand-main text-white px-8 py-3.5 rounded-2xl font-black hover:scale-105 transition-all shadow-lg shadow-brand-main/20">
                        {loading ? '...' : <><Save size={18} /> {loading ? t.editor.modals.menuManager.actions.saving : t.editor.modals.menuManager.actions.save}</>}
                      </button>
                    </div>

                    <div className="space-y-6 pb-20 text-start">
                      {activeMenu.menu_data?.categories?.map((category: MenuCategory, catIndex: number) => (
                        <div key={category.id} className="bg-white rounded-[2rem] border border-brand-lavender/30 overflow-hidden shadow-sm">
                          <div className="p-5 bg-brand-pearl/40 border-b border-brand-lavender/20 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                              <LayoutGrid size={18} className="text-brand-main" />
                              <input 
                                value={category.name}
                                onChange={e => {
                                  const updated = [...activeMenu.menu_data.categories];
                                  updated[catIndex].name = e.target.value;
                                  updateActiveMenuData(updated);
                                }}
                                className="bg-transparent font-black text-lg text-brand-dark outline-none"
                              />
                            </div>
                            <button onClick={() => updateActiveMenuData(activeMenu.menu_data.categories.filter((c: any) => c.id !== category.id))} className="text-brand-charcoal/20 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="p-6 space-y-4">
                            {category.items.map((item, itemIndex) => (
                              <div key={item.id} className="p-5 bg-white border border-brand-lavender/20 rounded-2xl space-y-4 hover:border-brand-main/30 transition-all shadow-sm">
                                <div className="flex gap-5 text-start">
                                  <div className="w-24 h-24 bg-brand-grey rounded-xl flex items-center justify-center text-brand-charcoal/20 shrink-0 overflow-hidden border border-brand-lavender/20 shadow-inner">
                                    {item.image_url ? <img src={item.image_url} className="w-full h-full object-cover" /> : <ImageIcon size={28} />}
                                  </div>
                                  <div className="flex-1 space-y-3">
                                    <div className="flex gap-4">
                                      <input 
                                        value={item.name}
                                        onChange={e => {
                                          const updated = [...activeMenu.menu_data.categories];
                                          updated[catIndex].items[itemIndex].name = e.target.value;
                                          updateActiveMenuData(updated);
                                        }}
                                        className="font-black text-brand-dark bg-transparent outline-none flex-1 text-lg"
                                        placeholder={t.editor.modals.menuManager.placeholders.dishName}
                                      />
                                      <div className="flex items-center gap-1 bg-brand-grey px-3 py-1.5 rounded-lg border border-brand-lavender/30 w-32 shadow-inner">
                                        <DollarSign size={14} className="text-brand-main" />
                                        <input 
                                          value={item.price}
                                          onChange={e => {
                                            const updated = [...activeMenu.menu_data.categories];
                                            updated[catIndex].items[itemIndex].price = e.target.value;
                                            updateActiveMenuData(updated);
                                          }}
                                          className="font-black text-brand-dark bg-transparent outline-none w-full text-sm"
                                        />
                                      </div>
                                      <button onClick={() => {
                                        const updated = [...activeMenu.menu_data.categories];
                                        updated[catIndex].items = category.items.filter(i => i.id !== item.id);
                                        updateActiveMenuData(updated);
                                      }} className="text-brand-charcoal/20 hover:text-red-500 transition-colors"><X size={20} /></button>
                                    </div>
                                    <textarea 
                                      value={item.description}
                                      onChange={e => {
                                        const updated = [...activeMenu.menu_data.categories];
                                        updated[catIndex].items[itemIndex].description = e.target.value;
                                        updateActiveMenuData(updated);
                                      }}
                                      className="text-xs font-bold text-brand-charcoal/40 bg-transparent outline-none w-full resize-none h-12"
                                      placeholder={t.editor.modals.menuManager.placeholders.dishDescription}
                                    />
                                    <div className="flex items-center gap-2 bg-brand-grey/50 p-2.5 rounded-lg border border-dashed border-brand-lavender/60">
                                      <LinkIcon size={12} className="text-brand-main" />
                                      <input 
                                        dir='ltr'
                                        value={item.image_url || ''}
                                        onChange={e => {
                                          const updated = [...activeMenu.menu_data.categories];
                                          updated[catIndex].items[itemIndex].image_url = e.target.value;
                                          updateActiveMenuData(updated);
                                        }}
                                        className="text-[10px] font-bold text-brand-charcoal/60 bg-transparent outline-none w-full"
                                        placeholder={t.editor.modals.menuManager.placeholders.imageUrl}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            <button onClick={() => addItem(category.id)} className="w-full py-3.5 border-2 border-dashed border-brand-lavender/40 rounded-xl text-brand-main/60 font-black flex items-center justify-center gap-2 hover:bg-brand-main/5 hover:border-brand-main/40 transition-all text-sm">
                              <Plus size={18} /> {t.editor.modals.menuManager.actions.addItem}
                            </button>
                          </div>
                        </div>
                      ))}
                      <button onClick={addCategory} className="w-full py-10 bg-white border-2 border-brand-main border-dashed rounded-[2.5rem] text-brand-main font-black flex flex-col items-center justify-center gap-2 hover:bg-brand-main/5 transition-all shadow-sm">
                        <div className="p-3 bg-brand-main/10 rounded-full"><Plus size={24} /></div>
                        <span className="text-sm">{t.editor.modals.menuManager.actions.addCategory}</span>
                      </button>
                    </div>
                  </>
                ) : (
<div className="space-y-4">
  {Object.keys(DEFAULT_AVAILABILITY).map((day) => {
    const dayData = (activeMenu.menu_availability || DEFAULT_AVAILABILITY)[day];
    
    // שליפת שם היום המתורגם מתוך ה-structure שקיים ב-t
    const translatedDay = t.editor.structure.settingsPanel.days[day as keyof typeof t.editor.structure.settingsPanel.days];

    return (
      <div 
        key={day} 
        className={`flex items-center gap-6 p-4 rounded-2xl border transition-all ${
          dayData.active 
            ? 'bg-brand-pearl/40 border-brand-main/20' 
            : 'bg-brand-grey/30 border-transparent opacity-60'
        }`}
      >
        <div className="flex items-center gap-4 w-32 shrink-0">
          <input 
            type="checkbox" 
            checked={dayData.active} 
            onChange={() => toggleDay(day)}
            className="w-5 h-5 rounded-md accent-brand-main cursor-pointer"
          />
          {/* שימוש בשם היום המתורגם */}
          <span className="font-black text-sm text-brand-dark">
            {translatedDay}
          </span>
        </div>

        {dayData.active && (
          <div className="flex items-center gap-4 flex-1 animate-in slide-in-from-left-2">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-[10px] font-black uppercase text-brand-charcoal/30">
                {t.editor.modals.menuManager.availability.from}
              </span>
              <input 
                type="time" 
                value={dayData.start}
                onChange={(e) => updateDayTime(day, 'start', e.target.value)}
                className="bg-white p-2 rounded-lg border border-brand-lavender/50 font-bold text-sm outline-none focus:border-brand-main"
              />
            </div>
            <div className="flex items-center gap-2 flex-1">
              <span className="text-[10px] font-black uppercase text-brand-charcoal/30">
                {t.editor.modals.menuManager.availability.until}
              </span>
              <input 
                type="time" 
                value={dayData.end}
                onChange={(e) => updateDayTime(day, 'end', e.target.value)}
                className="bg-white p-2 rounded-lg border border-brand-lavender/50 font-bold text-sm outline-none focus:border-brand-main"
              />
            </div>
          </div>
        )}
      </div>
    );
  })}
</div>
                )}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-10">
                 <div className="w-20 h-20 bg-brand-main/5 rounded-full flex items-center justify-center text-brand-main/20 mb-4">
                    <Utensils size={32} />
                 </div>
                 <h3 className="text-xl font-black text-brand-dark">{t.editor.modals.menuManager.emptyState.title}</h3>
                 <p className="text-sm font-bold text-brand-charcoal/30">{t.editor.modals.menuManager.emptyState.subtitle}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}