"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Language, translations } from '@/lib/translations';
import { 
  Loader2, Save, Eye, Monitor, Smartphone, ChevronRight, X, Box, Layout, Minus, Image as ImageIcon, UtensilsCrossed 
} from 'lucide-react';

import HeroSection from '@/components/editor/sections/HeroSection';
import TextSection from '@/components/editor/sections/TextSection';
import GallerySection from '@/components/editor/sections/GallerySection';
import MenuSection from '@/components/editor/sections/MenuSection';
import FlexSection from '@/components/editor/sections/FlexSection';
import DividerSection from '@/components/editor/sections/DividerSection';

// יבוא הקומפוננטות שפיצלנו
import SectionProperties from '@/components/editor/SectionProperties';
import StructureSidebar from '@/components/editor/StructureSidebar';
import { WidgetButton } from '@/components/editor/EditorUI';

export default function EditorPage() {
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Refs
  const assetUploadRef = useRef<HTMLInputElement>(null);
  const menuJsonRef = useRef<HTMLInputElement>(null);
  
  // States
  const [site, setSite] = useState<any>(null);
  const [org, setOrg] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [activePanel, setActivePanel] = useState<'pages' | 'navbar' | 'settings' | 'assets'>('pages');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [assets, setAssets] = useState<any[]>([]);
  const [expandedPages, setExpandedPages] = useState<string[]>(['home']);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingAssetTarget, setPendingAssetTarget] = useState<any>(null);
  const [unsavedChanges, setUnsavedChanges] = useState<{sections: string[], pages: string[]}>({ sections: [], pages: [] });
  const [selectedFlexElementId, setSelectedFlexElementId] = useState<string | null>(null);

  // Effects
  useEffect(() => { loadEditorData(); }, [slug]);
  useEffect(() => { if (activePanel === 'assets' && site) fetchAssets(); }, [activePanel, site]);
  useEffect(() => {
  const favicon = site?.draft_data?.favicon;
  if (favicon) {
    let link: HTMLLinkElement | null = document.querySelector("link[rel~='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.getElementsByTagName('head')[0].appendChild(link);
    }
    link.href = favicon;
  }
}, [site?.draft_data?.favicon]);
  // Logic Functions
  const loadEditorData = async () => {
    setLoading(true);
    const { data: orgData } = await supabase.from('organizations').select('*').eq('slug', slug).single();
    if (!orgData) { router.push('/dashboard'); return; }
    setOrg(orgData);
    const { data: siteData } = await supabase.from('sites').select('*').eq('org_id', orgData.id).single();
    if (siteData && !siteData.draft_data.navbar) {
        siteData.draft_data.navbar = { 
          direction: 'rtl', bg_color: '#ffffff', text_color: '#1f2937', 
          use_image: false, hours: {}, address: '', show_waze: true, show_google: true 
        };
    }
    setSite(siteData);
    setLoading(false);
  };

  const fetchAssets = async () => {
    if (!site || !org) return;
    const { data } = await supabase.storage.from('site-assets').list(`${site.id}/gallery`);
    let assetList = data ? data.map(file => ({
        name: file.name,
        url: supabase.storage.from('site-assets').getPublicUrl(`${site.id}/gallery/${file.name}`).data.publicUrl
    })) : [];
    if (org.logo_small) assetList.unshift({ name: 'Logo Small', url: org.logo_small });
    setAssets(assetList);
  };

  const pages = site?.draft_data?.pages || {};
  const activePageKey = site?.draft_data?.active_page || 'home';
  const activePageData = pages[activePageKey] || { sections: [] };
  const sections = activePageData.sections || [];
  const selectedSection = sections.find((s: any) => s.id === selectedId);

  const markChanged = (type: 'section' | 'page', id: string) => {
    setUnsavedChanges(prev => {
        const key = type === 'section' ? 'sections' : 'pages';
        if (prev[key].includes(id)) return prev;
        return { ...prev, [key]: [...prev[key], id] };
    });
  };

  const handleSave = async (showPreview = false) => {
    if (!site) return;
    setSaving(true);
    const { error } = await supabase.from('sites').update({ draft_data: site.draft_data, theme_settings: site.theme_settings }).eq('id', site.id);
    if (error) { alert("Error: " + error.message); setSaving(false); return; }
    setUnsavedChanges({ sections: [], pages: [] });
    if (showPreview) window.open(`/sites/${org.slug}/${activePageKey === 'home' ? '' : activePageKey}`, '_blank');
    setTimeout(() => setSaving(false), 800);
  };

  const updateSectionContent = (id: string, newContent: any) => {
    const updatedSections = sections.map((s: any) => s.id === id ? { ...s, content: { ...s.content, ...newContent } } : s);
    setSite((prev: any) => ({ ...prev, draft_data: { ...prev.draft_data, pages: { ...prev.draft_data.pages, [activePageKey]: { ...activePageData, sections: updatedSections } } } }));
    markChanged('section', id);
  };

  const updateNavbar = (updates: any) => {
    setSite((prev: any) => ({ ...prev, draft_data: { ...prev.draft_data, navbar: { ...prev.draft_data.navbar, ...updates } } }));
    markChanged('page', 'navbar'); 
  };

  const updateTheme = (key: string, value: string) => {
    setSite((prev: any) => ({ ...prev, theme_settings: { ...prev.theme_settings, [key]: value } }));
    markChanged('page', 'branding');
  };

const selectAssetForField = (sectionId: string | undefined, field: string, slideIndex?: number, callback?: (url: string) => void) => {
  setPendingAssetTarget({ 
    sectionId, 
    field, 
    isHeroSlide: slideIndex !== undefined, 
    slideIndex,
    callback // שומרים את ה-callback ב-state כדי להפעיל אותו אחר כך
  });
  setActivePanel('assets');
};

const handleAssetSelect = (url: string) => {
  if (!pendingAssetTarget) return;
  const { sectionId, field, isHeroSlide, slideIndex, callback } = pendingAssetTarget;

  // אם הועבר callback (מהלוגיקה החדשה של ה-Groups), נפעיל אותו ונסגור עניין
  if (callback) {
    callback(url);
    markChanged(sectionId ? 'section' : 'page', sectionId || activePageKey);
  } 
  // לוגיקת Fallback לשדות ישנים שעדיין לא עובדים עם callbacks
  else if (!sectionId) { 
    if (field === 'page_bg_image') {
      const currentPage = site.draft_data.pages[activePageKey];
      const newPages = { ...site.draft_data.pages, [activePageKey]: { ...currentPage, bg_image: url } };
      setSite((prev: any) => ({ ...prev, draft_data: { ...prev.draft_data, pages: newPages } }));
      markChanged('page', activePageKey);
    } else if (field === 'favicon') {
      setSite((prev: any) => ({ ...prev, draft_data: { ...prev.draft_data, favicon: url } }));
      markChanged('page', 'navbar'); 
    } else {
      updateNavbar({ [field]: url, use_image: true }); 
    }
  } else {
    // לוגיקה ישנה לסקשנים
    if (isHeroSlide) {
      const target = sections.find((s: any) => s.id === sectionId);
      const slides = [...(target.content.slider_images || [])]; // שים לב לסנכרון השם slider_images
      slides[slideIndex!] = url;
      updateSectionContent(sectionId, { slider_images: slides });
    } else {
      updateSectionContent(sectionId, { [field]: url });
    }
  }

  setPendingAssetTarget(null);
  const shouldGoToPages = sectionId || field === 'page_bg_image' || field === 'favicon';
  setActivePanel(shouldGoToPages ? 'pages' : 'navbar');
};

  const deleteAsset = async (fileName: string) => {
    if (!confirm('Delete this image permanently?')) return;
    const { error } = await supabase.storage.from('site-assets').remove([`${site.id}/gallery/${fileName}`]);
    if (error) alert("Error deleting asset");
    else fetchAssets();
  };

  const handleMenuJsonImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedId) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const json = JSON.parse(event.target?.result as string);
            const newCategories = json.map((cat: any) => ({
                id: cat.id || Math.random().toString(),
                title: cat.name,
                items: (cat.children || []).filter((child: any) => child.type === 'offer').map((item: any) => ({
                    id: item.id, name: item.name, price: item.price.toString(), description: item.description, image: item.image
                }))
            }));
            updateSectionContent(selectedId, { categories: [...(selectedSection.content.categories || []), ...newCategories] });
        } catch (err) { alert("Invalid JSON structure"); }
    };
    reader.readAsText(file);
  };

  const addMenuCategory = () => {
    if (!selectedId || selectedSection.type !== 'menu') return;
    updateSectionContent(selectedId, { 
      categories: [...(selectedSection.content.categories || []), { id: Date.now().toString(), title: '', items: [] }] 
    });
  };

  const addNewPage = (title: string) => {
    const pKey = title.toLowerCase().replace(/\s+/g, '-');
    if (pages[pKey]) { alert("Page already exists"); return; }
    const newPage = { title: title, name: title, sections: [] };
    setSite((prev: any) => ({ ...prev, draft_data: { ...prev.draft_data, pages: { ...prev.draft_data.pages, [pKey]: newPage } } }));
    switchPage(pKey);
    markChanged('page', 'navbar');
  };

  const deleteSection = (id: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    const updated = sections.filter((s: any) => s.id !== id);
    setSite((prev: any) => ({ ...prev, draft_data: { ...prev.draft_data, pages: { ...prev.draft_data.pages, [activePageKey]: { ...activePageData, sections: updated } } } }));
    setSelectedId(null);
    markChanged('page', activePageKey);
  };

  const duplicateSection = (id: string) => {
    const original = sections.find((s: any) => s.id === id);
    if (!original) return;
    const newId = Math.random().toString(36).substr(2, 9);
    const newSection = { ...JSON.parse(JSON.stringify(original)), id: newId, name: `${original.name || original.type} (Copy)`, isNew: true };
    const idx = sections.findIndex((s: any) => s.id === id);
    const newSections = [...sections];
    newSections.splice(idx + 1, 0, newSection);
    setSite((prev: any) => ({ ...prev, draft_data: { ...prev.draft_data, pages: { ...prev.draft_data.pages, [activePageKey]: { ...activePageData, sections: newSections } } } }));
    setSelectedId(newId);
    markChanged('page', activePageKey);
  };

  const deletePage = (pKey: string) => {
    if (pKey === 'home') { alert("Cannot delete home page"); return; }
    if (!confirm(`Delete page?`)) return;
    const newPages = { ...pages }; delete newPages[pKey];
    setSite((prev: any) => ({ ...prev, draft_data: { ...prev.draft_data, pages: newPages, active_page: 'home' } }));
    setSelectedId(null);
  };

  const addSection = (type: string) => {
    const id = Math.random().toString(36).substr(2, 9);
    const content = { title: '', subtitle: '', bg_type: 'solid', bg_color: '#000000' };
    setSite((prev: any) => ({ ...prev, draft_data: { ...prev.draft_data, pages: { ...prev.draft_data.pages, [activePageKey]: { ...activePageData, sections: [...sections, { id, type, content, name: `New ${type.toUpperCase()}` }] } } } }));
    setSelectedId(id);
    setShowAddModal(false);
    markChanged('page', activePageKey);
  };

  const moveSection = (direction: 'up' | 'down') => {
    const idx = sections.findIndex((s: any) => s.id === selectedId);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === sections.length - 1)) return;
    const newSections = [...sections];
    const target = direction === 'up' ? idx - 1 : idx + 1;
    [newSections[idx], newSections[target]] = [newSections[target], newSections[idx]];
    setSite((prev: any) => ({ ...prev, draft_data: { ...prev.draft_data, pages: { ...prev.draft_data.pages, [activePageKey]: { ...activePageData, sections: newSections } } } }));
  };

  const addFlexElement = (type: string) => {
    if (!selectedId || selectedSection.type !== 'flex') return;
    const newEl = { id: Date.now().toString(), type, text: '', size: 18, align: 'inherit' };
    updateSectionContent(selectedId, { elements: [...(selectedSection.content.elements || []), newEl] });
  };

  const updateFlexElement = (elId: string, updates: any) => {
    const updated = selectedSection.content.elements.map((el: any) => el.id === elId ? { ...el, ...updates } : el);
    updateSectionContent(selectedId!, { elements: updated });
  };

  const switchPage = (pageKey: string) => {
    setSelectedId(null);
    setSite((prev: any) => ({ ...prev, draft_data: { ...prev.draft_data, active_page: pageKey } }));
  };

  const handleAssetUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !site) return;
    setUploading(true);
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = `${site.id}/gallery/${fileName}`;
    await supabase.storage.from('site-assets').upload(filePath, file);
    fetchAssets();
    setUploading(false);
  };

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-brand-grey"><Loader2 className="animate-spin text-brand-main" size={48} /></div>;

  const primaryColor = site?.theme_settings?.primary_color || '#0B4440';

  return (
    <div className="h-screen flex flex-col bg-brand-grey overflow-hidden" dir="ltr">
        <header className="h-16 bg-white border-b border-brand-mint flex items-center justify-between px-6 z-[100] shadow-sm">
            <div className="flex items-center gap-4">
                <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-brand-grey rounded-xl transition-colors"><ChevronRight /></button>
                <h1 className="font-black text-brand-dark leading-none">{org?.name_he}</h1>
                <span className="text-[9px] font-black text-brand-main bg-brand-mint px-2 py-1 rounded uppercase font-mono">{activePageKey}</span>
            </div>
            <div className="flex bg-brand-grey p-1 rounded-xl border border-brand-mint shadow-inner">
                <button onClick={() => setPreviewMode('desktop')} className={`p-2 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-white shadow-sm text-brand-main' : 'text-brand-charcoal/30'}`}><Monitor size={18} /></button>
                <button onClick={() => setPreviewMode('mobile')} className={`p-2 rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-white shadow-sm text-brand-main' : 'text-brand-charcoal/30'}`}><Smartphone size={18} /></button>
            </div>
            <div className="flex items-center gap-3">
                <button onClick={() => handleSave(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-black text-brand-main hover:bg-brand-mint rounded-xl transition-all"><Eye size={16} /> Preview</button>
                <button onClick={() => handleSave(false)} disabled={saving} className="bg-brand-main text-white px-6 py-2.5 rounded-xl font-black shadow-lg flex items-center gap-2 min-w-[100px] justify-center">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save
                </button>
            </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
            <StructureSidebar 
              activePanel={activePanel} 
              setActivePanel={setActivePanel} 
              pages={pages} 
              activePageKey={activePageKey} 
              expandedPages={expandedPages} 
              setExpandedPages={setExpandedPages} 
              switchPage={switchPage} 
              setSelectedId={setSelectedId} 
              selectedId={selectedId} 
              unsavedChanges={unsavedChanges} 
              duplicateSection={duplicateSection} 
              moveSection={moveSection} 
              deleteSection={deleteSection} 
              setShowAddModal={setShowAddModal} 
              site={site} 
              updateNavbar={updateNavbar} 
              selectAssetForField={selectAssetForField} 
              updateTheme={updateTheme} 
              uploading={uploading} 
              assetUploadRef={assetUploadRef} 
              handleAssetUpload={handleAssetUpload} 
              assets={assets} 
              handleAssetSelect={handleAssetSelect} 
              deleteAsset={deleteAsset} 
              addNewPage={addNewPage}
              setSite={setSite} // הוספה קריטית
              markChanged={markChanged} // הוספה קריטית
              selectedFlexElementId={selectedFlexElementId}
              setSelectedFlexElementId={setSelectedFlexElementId}
            />

            {/* CANVAS AREA - Endless Scroll Implementation */}
{/* CANVAS AREA - Endless Scroll Implementation */}
<main className="flex-1 bg-brand-grey overflow-y-auto custom-scrollbar p-12 flex justify-center">
                <div 
                  className={`
                    shadow-2xl transition-all duration-500 relative flex flex-col h-fit
                    ${previewMode === 'desktop' ? 'w-full max-w-5xl' : 'w-[375px]'} 
                    rounded-t-[3rem] border border-brand-mint/30 mb-32 overflow-hidden
                  `}
                  style={{
                    // 1. צבע בסיס (השכבה הכי תחתונה)
                    backgroundColor: activePageData.bg_color || '#ffffff',
                    
                    // 2. שילוב של פילטר הצבע ותמונת הרקע (כמו ב-Public Page)
                    backgroundImage: `
                      ${activePageData.bg_filter_color 
                        ? `linear-gradient(
                            ${activePageData.bg_filter_color}${Math.round((activePageData.bg_filter_opacity ?? 50) * 2.55).toString(16).padStart(2, '0')}, 
                            ${activePageData.bg_filter_color}${Math.round((activePageData.bg_filter_opacity ?? 50) * 2.55).toString(16).padStart(2, '0')}
                          )` 
                        : 'linear-gradient(transparent, transparent)'},
                      ${activePageData.bg_image ? `url(${activePageData.bg_image})` : 'none'}
                    `,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'scroll',
                  }}
                >
                    {/* שכבת שקיפות לתמונה (כדי שצבע הבסיס יבצבץ מתחתיה) */}
                    {activePageData.bg_image && (
                      <div 
                        className="absolute inset-0 pointer-events-none transition-all duration-500"
                        style={{ 
                          backgroundColor: activePageData.bg_color || '#ffffff',
                          opacity: 1 - ((activePageData.bg_image_opacity ?? 100) / 100),
                          zIndex: 0
                        }}
                      />
                    )}

                    {/* Canvas Layer */}
{/* Canvas Layer */}
<div className="flex-1 flex flex-col min-h-screen relative z-10">
    {sections.map((s: any) => (
    <div 
        key={s.id} 
        onClick={() => setSelectedId(s.id)} 
        className={`relative transition-all border-x-4 ${selectedId === s.id ? 'border-brand-main bg-brand-mint/5 z-10' : 'border-transparent hover:border-brand-mint/30'}`}
    >
        {/* מעבר לשימוש ב-section={s} עבור הרכיבים החדשים שסונכרנו */}
        {s.type === 'hero' && (
            <HeroSection 
                section={s} 
                isSelected={selectedId === s.id} 
                updateContent={(updates: any) => updateSectionContent(s.id, updates)}
            />
        )}

        {s.type === 'flex' && (
            <FlexSection 
                section={s} 
                updateContent={(updates: any) => updateSectionContent(s.id, updates)}
            />
        )}

        {s.type === 'gallery' && (
            <GallerySection 
                section={s} 
                isEditor={true} 
                updateContent={(updates: any) => updateSectionContent(s.id, updates)}
            />
        )}
        
        {/* רכיבים ישנים שעדיין עובדים עם content */}
        {s.type === 'text' && <TextSection content={s.content} />}
        {s.type === 'menu' && <MenuSection content={s.content} />}
        {s.type === 'divider' && <DividerSection content={s.content} />}
    </div>
    ))}

    {sections.length === 0 && (
        <div className="flex-1 flex items-center justify-center py-40 border-2 border-dashed border-brand-mint/20 m-8 rounded-[2rem]">
            <p className="text-brand-charcoal/20 font-black uppercase tracking-widest text-xs">Your canvas is empty</p>
        </div>
    )}
</div>
                </div>

                {/* Modal הוספת סקשן - ללא שינוי לוגיקה, רק וידוא UI */}
                {showAddModal && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-brand-dark/20 backdrop-blur-sm" onClick={() => setShowAddModal(false)}>
                        <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-brand-mint" onClick={e => e.stopPropagation()}>
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="font-black uppercase tracking-tighter text-xl text-brand-dark">Add New Section</h3>
                                <button onClick={() => setShowAddModal(false)} className="hover:rotate-90 transition-transform">
                                  <X size={20} />
                                </button>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-start">
                                <WidgetButton onClick={() => addSection('flex')} icon={<Box size={24} />} label="Canvas" />
                                <WidgetButton onClick={() => addSection('hero')} icon={<Layout size={24} />} label="Hero" />
                                <WidgetButton onClick={() => addSection('divider')} icon={<Minus size={24} />} label="Divider" />
                                <WidgetButton onClick={() => addSection('gallery')} icon={<ImageIcon size={24} />} label="Gallery" />
                                <WidgetButton onClick={() => addSection('menu')} icon={<UtensilsCrossed size={24} />} label="Menu" />
                            </div>
                        </div>
                    </div>
                )}
            </main>

<SectionProperties 
    site={site as any} 
    activePageKey={activePageKey} 
    pages={pages} 
    sections={sections} 
    selectedId={selectedId} 
    setSelectedId={setSelectedId}
    selectedSection={selectedSection} 
    selectedFlexElementId={selectedFlexElementId}
    setSelectedFlexElementId={setSelectedFlexElementId}
    setSite={setSite}
    // כאן התיקון - וודא שהפונקציה עוברת בדיוק כך
    markChanged={markChanged}
    updateSectionContent={updateSectionContent} 
    deleteSection={deleteSection} 
    deletePage={deletePage} 
    addFlexElement={addFlexElement} 
    updateFlexElement={updateFlexElement} 
    selectAssetForField={selectAssetForField} 
    addMenuCategory={addMenuCategory} 
    menuJsonRef={menuJsonRef} 
    handleMenuJsonImport={handleMenuJsonImport} 
    primaryColor={primaryColor} 
/>
        </div>
    </div>
  );
}