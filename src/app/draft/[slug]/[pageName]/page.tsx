import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import SiteRenderer from '@/components/sites/SiteRenderer';
import SiteNavbar from '@/components/sites/SiteNavbar';
import { ShieldCheck, FileText, Globe, Eye } from 'lucide-react';
import { getGoogleFontsUrl } from '@/utils/fonts';

export default async function AuthenticatedDraftPage({ 
  params 
}: { 
  params: Promise<{ slug: string; pageName: string }> 
}) {
  const { slug, pageName } = await params;

  // 1. חילוץ נתוני הארגון
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .select('id, name_he, name_en')
    .eq('slug', slug)
    .single();

  if (orgError || !org) return notFound();

  // 2. חילוץ נתוני האתר המלאים
  const { data: site, error: siteError } = await supabase
    .from('sites')
    .select('*')
    .eq('org_id', org.id)
    .single();

  if (siteError || !site) return notFound();

  // 🎯 כאן ההבדל המרכזי: הנתונים נשלפים מהטיוטה (Draft) ומהתמה העדכנית באדיטור
  const siteData = site.draft_data || {};
  const themeSettings = site.theme_settings || {};
  const pages = siteData.pages || {};
  const currentPage = pages[pageName];

  if (!currentPage) return notFound();

  const siteDirection = siteData.navbar?.direction || 'rtl';
  
  // הכנת ה-URL של הפונטים שנבחרו באדיטור
  const fontsUrl = getGoogleFontsUrl(
    themeSettings?.primary_font, 
    themeSettings?.secondary_font
  );

  return (
    <div 
      dir={siteDirection} 
      className="min-h-screen flex flex-col relative"
    >
      {/* אינדיקטור ויזואלי עדין בחלק העליון והתחתון שמבהיר שאנחנו במצב Preview */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-brand-main z-[200] animate-pulse" />
      <div className="fixed bottom-12 left-4 z-[200] bg-brand-main text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase flex items-center gap-2 shadow-xl opacity-90 select-none">
        <Eye size={12} />
        <span>Draft Preview</span>
      </div>

      {/* הזרקת הפונטים מהאדיטור */}
      {fontsUrl && <link rel="stylesheet" href={fontsUrl} />}

      {/* שכבת הרקע הגלובלית של הדף */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: currentPage.bg_color || '#ffffff' }} 
        />
        
        {currentPage.bg_image && (
          <img 
            src={currentPage.bg_image} 
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: (currentPage.bg_image_opacity ?? 100) / 100 }}
            alt=""
          />
        )}

        {currentPage.bg_filter_color && (
          <div 
            className="absolute inset-0"
            style={{ 
              backgroundColor: currentPage.bg_filter_color,
              opacity: (currentPage.bg_filter_opacity ?? 50) / 100
            }}
          />
        )}
      </div>

      {/* שכבת התוכן */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <header className="sticky top-0 z-[100]">
          <SiteNavbar 
            pages={pages} 
            slug={slug} 
            activePage={pageName} 
            theme={themeSettings} 
            settings={siteData}
            orgName={org.name_he || org.name_en}
            isDraft={true}
          />
        </header>
        
        <main className="flex-1">
          <SiteRenderer 
            sections={currentPage.sections || []} 
            theme={themeSettings} 
          />
        </main>
        
        <footer className="h-[30px] border-t border-brand-lavender/30 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-2">
            <Globe size={12} className="text-brand-main" />
            <p className="text-[10px] font-bold text-brand-midnight/60">
              Draft Preview Mode <span className="text-brand-main uppercase tracking-wider">Simple. Homepage</span>
            </p>
          </div>

          <div className="flex items-center gap-4 hidden md:flex opacity-40 pointer-events-none">
            <span className="text-[9px] font-black uppercase tracking-tight">Terms</span>
            <span className="text-[9px] font-black uppercase tracking-tight">Privacy</span>
          </div>
        </footer>
      </div>
    </div>
  );
}