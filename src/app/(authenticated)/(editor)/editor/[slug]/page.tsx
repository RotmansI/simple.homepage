"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Language, translations } from '@/lib/translations';
import { 
  Loader2, Save, Eye, Monitor, Smartphone, ChevronRight, X, Box, Layout, Minus, Image as ImageIcon, UtensilsCrossed, 
  ChevronLeft, Maximize2, Minimize2
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
import { getGoogleFontsUrl } from '@/utils/fonts'; // וודא שהנתיב תואם למיקום הקובץ אצלך
import { EditorCanvas } from '@/components/editor/canvas/EditorCanvas';


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
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

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

useEffect(() => {
  if (activePanel === 'navbar') {
    setLeftCollapsed(false); // חייב להישאר פתוח ב-NAV
    setRightCollapsed(true); // תמיד סגור ב-NAV
  } else {
    // כשחוזרים ל-Pages, נפתח את שניהם כברירת מחדל
    setLeftCollapsed(false);
    setRightCollapsed(false);
  }
}, [activePanel]);


  // Logic Functions
const toggleZenMode = () => {
  if (activePanel === 'navbar') return; // חסימה במצב NAV

  if (!leftCollapsed || !rightCollapsed) {
    setLeftCollapsed(true);
    setRightCollapsed(true);
  } else {
    setLeftCollapsed(false);
    setRightCollapsed(false);
  }
};

const isZenModeActive = leftCollapsed && rightCollapsed;

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

const updateTheme = async (key: string, value: string) => {
  // 1. יצירת האובייקט המעודכן
  const updatedSettings = { 
    ...site.theme_settings, 
    [key]: value 
  };

  // 2. עדכון סטייט מקומי (בשביל מהירות ב-UI)
  setSite((prev: any) => ({ 
    ...prev, 
    theme_settings: updatedSettings 
  }));

  // 3. סימון שהיה שינוי (לשמירה הכללית של הדף)
  markChanged('page', 'branding');

  // 4. שמירה ישירה של ה-Theme ל-Database
  try {
    const { error } = await supabase
      .from('sites')
      .update({ theme_settings: updatedSettings })
      .eq('id', site.id);

    if (error) throw error;
  } catch (err) {
    console.error("Failed to sync theme to DB:", err);
    // אופציונלי: להציג Toast שגיאה כאן
  }
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
                <button onClick={() => router.push('/dashboard')} className="p-2 hover:bg-brand-grey rounded-xl transition-colors"><ChevronLeft /></button>
                <h1 className="font-black text-brand-dark leading-none">{org?.name_he}</h1>
                <span className="text-[9px] font-black text-brand-main bg-brand-mint px-2 py-1 rounded uppercase font-mono">{activePageKey}</span>
            </div>
<div className="flex items-center gap-3">
    {/* קבוצה 1: מצבי תצוגה */}
    <div className="flex bg-brand-grey p-1 rounded-xl border border-brand-mint shadow-inner">
        <button 
            onClick={() => setPreviewMode('desktop')} 
            className={`p-2 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-white shadow-sm text-brand-main' : 'text-brand-charcoal/30'}`}
            title="Desktop View"
        >
            <Monitor size={18} />
        </button>
        <button 
            onClick={() => setPreviewMode('mobile')} 
            className={`p-2 rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-white shadow-sm text-brand-main' : 'text-brand-charcoal/30'}`}
            title="Mobile View"
        >
            <Smartphone size={18} />
        </button>
    </div>

    {/* קו מפריד (Divider) */}
    <div className="w-px h-6 bg-brand-lavender/50 mx-1" />

    {/* קבוצה 2: ניהול סיידברים (Zen Mode) */}
    <div className="flex bg-brand-grey p-1 rounded-xl border border-brand-mint shadow-inner">
        <button 
            onClick={toggleZenMode}
            disabled={activePanel === 'navbar'} 
            className={`p-2 rounded-lg transition-all flex items-center justify-center ${
                activePanel === 'navbar' 
                ? 'opacity-20 cursor-not-allowed' 
                : isZenModeActive 
                    ? 'bg-brand-main text-white shadow-md' 
                    : 'bg-white/50 text-brand-charcoal/40 hover:bg-white hover:text-brand-main'
            }`}
            title={activePanel === 'navbar' ? "Cannot collapse in Nav mode" : "Zen Mode"}
        >
            {isZenModeActive ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
        </button>
    </div>
</div>
            <div className="flex items-center gap-3">
                <button onClick={() => handleSave(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-black text-brand-main hover:bg-brand-mint rounded-xl transition-all"><Eye size={16} /> Preview</button>
                <button onClick={() => handleSave(false)} disabled={saving} className="bg-brand-main text-white px-6 py-2.5 rounded-xl font-black shadow-lg flex items-center gap-2 min-w-[100px] justify-center">
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save
                </button>
            </div>
        </header>

        <div className="flex-1 flex h-screen overflow-hidden">
            <StructureSidebar 
      // ה-Prop החדש ששולט בקיפול
              isCollapsed={leftCollapsed}
              toggleSidebar={() => setLeftCollapsed(!leftCollapsed)}  
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
{/* שלב 3: הזרקת פונטים ו-CSS Variables לקנבס */}
{site?.theme_settings && (
  <>
    {/* טעינת הפונטים מגוגל באמצעות ה-Utility */}
    <link 
      rel="stylesheet" 
      href={getGoogleFontsUrl(site.theme_settings.primary_font, site.theme_settings.secondary_font)} 
    />

    {/* הזרקת המשתנים ל-Style Tag כדי שכל הסקשנים יכירו אותם */}
    <style>{`
      :root {
        --site-primary-font: '${site.theme_settings.primary_font || 'Assistant'}', sans-serif;
        --site-secondary-font: '${site.theme_settings.secondary_font || 'Heebo'}', sans-serif;
      }
      
      /* החלה דינמית על הקנבס בלבד (כדי לא להרוס את האדיטור) */
      .canvas-preview-area h1, 
      .canvas-preview-area h2, 
      .canvas-preview-area h3, 
      .canvas-preview-area h4,
      .canvas-preview-area .font-primary {
        font-family: var(--site-primary-font) !important;
      }

      .canvas-preview-area p, 
      .canvas-preview-area span, 
      .canvas-preview-area div, 
      .canvas-preview-area button,
      .canvas-preview-area .font-secondary {
        font-family: var(--site-secondary-font) !important;
      }
    `}</style>
  </>
)}
<main className="flex-1 bg-brand-grey overflow-y-auto custom-scrollbar pt-2 flex justify-center">
<EditorCanvas 
  activePanel={activePanel}
  previewMode={previewMode}
  activePageData={activePageData}
  sections={sections}
  selectedId={selectedId}
  setSelectedId={setSelectedId}
  updateSectionContent={updateSectionContent}
  showAddModal={showAddModal}
  setShowAddModal={setShowAddModal}
  addSection={addSection}
  site={site}
/>
</main>

<SectionProperties 
    isCollapsed={rightCollapsed}
    toggleSidebar={() => setRightCollapsed(!rightCollapsed)}
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