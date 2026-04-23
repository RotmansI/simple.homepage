import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import SiteRenderer from '@/components/sites/SiteRenderer';
import SiteNavbar from '@/components/sites/SiteNavbar';
import { ShieldCheck, FileText, Globe } from 'lucide-react';
import { getGoogleFontsUrl } from '@/utils/fonts'; // ייבוא ה-Utility

export default async function PublicSitePage({ 
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

  // 2. חילוץ נתוני האתר - כולל theme_settings
  const { data: site, error: siteError } = await supabase
    .from('sites')
    .select('*')
    .eq('org_id', org.id)
    .single();

  if (siteError || !site) return notFound();

  const siteData = site.draft_data || {};
  const pages = siteData.pages || {};
  const currentPage = pages[pageName];

  if (!currentPage) return notFound();

  const siteDirection = siteData.navbar?.direction || 'rtl';
  
  // הכנת ה-URL של הפונטים כבר ברמת השרת
  const fontsUrl = getGoogleFontsUrl(
    site.theme_settings?.primary_font, 
    site.theme_settings?.secondary_font
  );

  return (
    <div 
      dir={siteDirection} 
      className="min-h-screen flex flex-col relative"
    >
      {/* הזרקת הפונטים ב-Head של הדף הציבורי למניעת Layout Shift */}
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
            theme={site.theme_settings} 
            settings={siteData}
            orgName={org.name_he || org.name_en}
          />
        </header>
        
        <main className="flex-1">
          <SiteRenderer 
            sections={currentPage.sections || []} 
            theme={site.theme_settings} 
          />
        </main>
        
        <footer className="h-[30px] border-t border-brand-lavender/30 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 z-20">
          <div className="flex items-center gap-2">
            <Globe size={12} className="text-brand-indigo" />
            <p className="text-[10px] font-bold text-brand-midnight/60">
              Powered by <span className="text-brand-indigo uppercase tracking-wider">Simple. Homepage</span>
            </p>
          </div>

          <div className="flex items-center gap-4 hidden md:flex">
            <a href="#" className="flex items-center gap-1.5 text-brand-midnight/50 hover:text-brand-indigo transition-colors">
              <FileText size={10} />
              <span className="text-[9px] font-black uppercase tracking-tight">Terms</span>
            </a>
            <a href="#" className="flex items-center gap-1.5 text-brand-midnight/50 hover:text-brand-indigo transition-colors">
              <ShieldCheck size={10} />
              <span className="text-[9px] font-black uppercase tracking-tight">Privacy</span>
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}