import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import SiteRenderer from '@/components/sites/SiteRenderer';
import SiteNavbar from '@/components/sites/SiteNavbar';
import { ShieldCheck, FileText, Eye, Globe } from 'lucide-react';

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

  // 2. חילוץ נתוני האתר (המשתמש רואה את ה-draft_data כרגע או את ה-live_data בהתאם להחלטתך)
  const { data: site, error: siteError } = await supabase
    .from('sites')
    .select('*')
    .eq('org_id', org.id)
    .single();

  if (siteError || !site) return notFound();

  // שימוש ב-draft_data (או live_data אם כבר הטמעת לוגיקת Publish)
  const siteData = site.draft_data || {};
  const pages = siteData.pages || {};
  const currentPage = pages[pageName];

  if (!currentPage) return notFound();

  const siteDirection = siteData.navbar?.direction || 'rtl';

  // המרת אופסיטי ל-Hex Alpha עבור ה-Linear Gradient
  const getAlphaHex = (opacity: number) => {
    const alpha = Math.round((opacity ?? 50) * 2.55);
    return alpha.toString(16).padStart(2, '0');
  };

  return (
    <div 
      dir={siteDirection} 
      className="min-h-screen flex flex-col relative"
    >
      {/* שכבת הרקע הגלובלית של הדף */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {/* א) צבע בסיס */}
        <div 
          className="absolute inset-0" 
          style={{ backgroundColor: currentPage.bg_color || '#ffffff' }} 
        />
        
        {/* ב) תמונת רקע עם שקיפות מול צבע הבסיס */}
        {currentPage.bg_image && (
          <img 
            src={currentPage.bg_image} 
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: (currentPage.bg_image_opacity ?? 100) / 100 }}
            alt=""
          />
        )}

        {/* ג) פילטר צבע עליון (Overlay) */}
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
        
        {/* Footer הקבוע שלך */}
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