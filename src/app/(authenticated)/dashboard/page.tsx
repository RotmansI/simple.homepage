"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Language, translations } from '@/lib/translations';
import { 
  Building2, 
  TrendingUp, 
  Lightbulb, 
  Calendar, 
  Zap, 
  MessageSquare,
  ChevronLeft,
  LayoutTemplate,
  Search,
  ExternalLink,
  Edit3,
  PauseCircle,
  Users,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import CreateSiteWizard from '@/components/dashboard/CreateSiteWizard';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [userProfile, setUserProfile] = useState<any>(null);
  
  // State לניהול המודאל של הקמת אתר
  const [wizardOrg, setWizardOrg] = useState<any>(null);

  const lang = (searchParams.get('lang') as Language) || 'he'; 
  const t = translations[lang];
  const isRtl = lang === 'he';

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    setUserProfile(profile);

    let orgsQuery;

    // שליפת ארגונים כולל האתר המקושר (בדיקה אם קיים)
    if (profile?.role === 'system-admin' || profile?.role === 'operator') {
      orgsQuery = supabase.from('organizations').select(`
        *,
        sites(id, is_published),
        user_organizations(
          profiles(first_name, last_name)
        )
      `);
    } else {
      orgsQuery = supabase
        .from('user_organizations')
        .select(`
          organizations (*, sites(id, is_published), user_organizations(profiles(first_name, last_name)))
        `)
        .eq('user_id', user.id);
    }

    const { data: result } = await orgsQuery;
    
    // תיקון המיפוי: מוודאים ש-sites נשאר זמין באובייקט הארגון כפי שהוא מגיע מה-Response
    const formattedOrgs = profile?.role === 'system-admin' || profile?.role === 'operator'
      ? (result || [])
      : (result?.map((item: any) => ({
          ...item.organizations
        })) || []);

    setOrganizations(formattedOrgs);
    setLoading(false);
  };

  const filteredOrgs = organizations.filter(org => {
    const search = searchTerm.toLowerCase();
    const nameHe = org.name_he?.toLowerCase() || '';
    const nameEn = org.name_en?.toLowerCase() || '';
    const slug = org.slug?.toLowerCase() || '';
    const id = org.id?.toLowerCase() || '';
    
    const linkedUsers = org.user_organizations?.map((uo: any) => 
      `${uo.profiles?.first_name} ${uo.profiles?.last_name}`.toLowerCase()
    ).join(' ') || '';

    return (
      nameHe.includes(search) || 
      nameEn.includes(search) || 
      slug.includes(search) || 
      id.includes(search) ||
      linkedUsers.includes(search)
    );
  });

  const isAdmin = userProfile?.role === 'system-admin';
  const isOperator = userProfile?.role === 'operator';
  const isSystemStaff = isAdmin || isOperator;

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-brand-main">
      <div className="animate-spin"><Zap size={48} /></div>
    </div>
  );

  return (
    <main className="grid grid-cols-1 lg:grid-cols-12 gap-6" dir={t.dir}>
      
      <section className="lg:col-span-8 space-y-6">
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-brand-mint min-h-[500px] flex flex-col">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-black text-brand-dark flex items-center gap-2">
                <Building2 className="text-brand-main" size={24} />
                {t.myOrganizations}
              </h2>
              
              {isSystemStaff && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-brand-mint/40 rounded-lg border border-brand-mint animate-in zoom-in duration-300">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-electric"></span>
                  </span>
                  <span className="text-[9px] font-black text-brand-main uppercase tracking-tighter">
                    {isAdmin ? (isRtl ? 'ניהול מלא' : 'Full Admin') : (isRtl ? 'מצב אופרייטור' : 'Operator Mode')}
                  </span>
                </div>
              )}
            </div>

            <div className="relative w-full md:w-80">
              <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-brand-charcoal/30`} size={18} />
              <input 
                type="text"
                placeholder={isRtl ? "חיפוש לפי שם, סלאג, מזהה או משתמש..." : "Search by name, slug, ID or user..."}
                className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 rounded-xl bg-brand-grey border border-brand-mint outline-none focus:border-brand-main transition-all text-sm font-bold`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {organizations.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-brand-mint p-6 rounded-full mb-4">
                <MessageSquare size={40} className="text-brand-main" />
              </div>
              <h3 className="text-xl font-bold text-brand-dark mb-2">{t.noOrgsTitle}</h3>
              <p className="text-brand-charcoal/60 mb-8 max-w-sm">{t.noOrgsSub}</p>
              <button className="bg-brand-main text-white px-10 py-4 rounded-xl font-bold hover:bg-brand-dark transition-all shadow-lg cursor-pointer">
                {t.contactSales}
              </button>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden flex flex-col">
              <div className="overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
                <table className="w-full text-sm border-separate border-spacing-y-2">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr className="text-brand-charcoal/40 text-[10px] uppercase font-black tracking-widest text-start">
                      <th className="px-4 py-2">{isRtl ? 'ארגון' : 'Org'}</th>
                      <th className="px-4 py-2">Slug</th>
                      <th className="px-4 py-2 hidden md:table-cell"><Users size={14}/></th>
                      <th className="px-4 py-2 text-center">{isRtl ? 'פעולות' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrgs.map((org) => {
                      // בדיקה מותאמת ל-Response ששלחת: אובייקט או מערך
                      const hasSite = org.sites && (Array.isArray(org.sites) ? org.sites.length > 0 : !!org.sites.id);
                      
                      return (
                        <tr key={org.id} className="group hover:bg-brand-grey transition-colors">
                          <td className="px-4 py-2 bg-white group-hover:bg-brand-grey rounded-s-2xl border-y border-s border-brand-mint/30">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-brand-grey border border-brand-mint flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                                {org.logo_small ? (
                                  <img src={org.logo_small} className="w-full h-full object-contain" alt="" />
                                ) : (
                                  <Building2 size={16} className="text-brand-main" />
                                )}
                              </div>
                              <span className="font-bold text-brand-dark truncate max-w-[120px]">
                                {isRtl ? org.name_he : org.name_en}
                              </span>
                            </div>
                          </td>

                          <td className="px-4 py-2 bg-white group-hover:bg-brand-grey border-y border-brand-mint/30">
                            <a 
                              href={`https://${org.slug}.tabit.io`} 
                              target="_blank" 
                              rel="noreferrer"
                              className="flex items-center gap-1.5 font-mono text-[11px] text-brand-main hover:underline"
                            >
                              {org.slug}
                              <ExternalLink size={12} />
                            </a>
                          </td>

                          <td className="px-4 py-2 bg-white group-hover:bg-brand-grey border-y border-brand-mint/30 hidden md:table-cell">
                            <div className="flex -space-x-2 rtl:space-x-reverse overflow-hidden">
                              {org.user_organizations?.slice(0, 3).map((uo: any, i: number) => (
                                <div key={i} title={`${uo.profiles?.first_name} ${uo.profiles?.last_name}`} className="w-6 h-6 rounded-full bg-brand-mint border-2 border-white flex items-center justify-center text-[10px] font-bold text-brand-main">
                                  {uo.profiles?.first_name?.[0]}
                                </div>
                              ))}
                              {org.user_organizations?.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-brand-grey border-2 border-white flex items-center justify-center text-[8px] font-bold text-brand-charcoal">
                                  +{org.user_organizations.length - 3}
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="px-4 py-2 bg-white group-hover:bg-brand-grey rounded-e-2xl border-y border-e border-brand-mint/30 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {hasSite ? (
                                <>
                                  <Link 
                                    href={`/editor/${org.slug}?lang=${lang}`}
                                    className="p-2 bg-brand-main text-white rounded-lg hover:bg-brand-dark transition-all"
                                    title={isRtl ? "כניסה לעורך" : "Open Editor"}
                                  >
                                    <Edit3 size={14} />
                                  </Link>
                                  
                                  <a 
                                    href={`/sites/${org.slug}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 bg-brand-mint text-brand-main rounded-lg hover:bg-brand-main hover:text-white transition-all"
                                    title={isRtl ? "צפייה באתר" : "View Site"}
                                  >
                                    <ExternalLink size={14} />
                                  </a>

                                  {isAdmin && (
                                    <button 
                                      className="p-2 bg-salmon/10 text-salmon rounded-lg hover:bg-salmon hover:text-white transition-all cursor-pointer"
                                      title={isRtl ? "השהיית אתר" : "Pause Site"}
                                    >
                                      <PauseCircle size={14} />
                                    </button>
                                  )}
                                </>
                              ) : (
                                <button 
                                  onClick={() => setWizardOrg(org)}
                                  className="flex items-center gap-2 bg-brand-mint text-brand-main px-4 py-1.5 rounded-xl font-black text-[10px] hover:bg-brand-main hover:text-white transition-all border border-brand-main/20 shadow-sm cursor-pointer"
                                >
                                  <Sparkles size={14} /> {isRtl ? 'הקמת אתר' : 'Setup Site'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: t.stats_visits, value: '12,402', icon: TrendingUp, color: 'text-brand-main' },
            { label: t.stats_menu, value: '8,190', icon: LayoutTemplate, color: 'text-purple' },
            { label: t.stats_leads, value: '423', icon: MessageSquare, color: 'text-salmon' }
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-brand-mint shadow-sm hover:shadow-md transition-shadow">
              <stat.icon className={`${stat.color} mb-4`} size={28} />
              <p className="text-xs font-black text-brand-charcoal/40 uppercase tracking-widest mb-1">{stat.label}</p>
              <h4 className="text-2xl font-black text-brand-dark">{stat.value}</h4>
            </div>
          ))}
        </div>
      </section>

      <aside className="lg:col-span-4 space-y-6">
        <div className="bg-brand-main text-white rounded-[2rem] p-8 shadow-xl relative group overflow-hidden">
          <Lightbulb className="absolute -top-4 -right-4 w-28 h-28 opacity-10 rotate-12 group-hover:rotate-45 transition-transform duration-700" />
          <h3 className="text-lg font-black mb-4 flex items-center gap-2">
            <Lightbulb size={20} className="text-brand-accent" />
            {t.dailyInsight}
          </h3>
          <p className="text-sm leading-relaxed opacity-90 font-medium">{t.insightText}</p>
        </div>

        <div className="bg-white rounded-[2rem] p-7 shadow-sm border border-brand-mint">
          <h3 className="text-lg font-black text-brand-dark mb-6 flex items-center gap-2">
            <Calendar size={20} className="text-brand-main" />
            {t.whatsHappening}
          </h3>
          <div className="space-y-5">
            <div className={`flex items-center gap-4 ${isRtl ? 'border-r-4' : 'border-l-4'} border-electric pr-3 pl-3`}>
              <div className="text-sm">
                <p className="font-bold text-brand-dark">Independence Day</p>
                <p className="text-xs opacity-50">Thursday, April 14</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-brand-mint rounded-[2rem] p-7 border border-brand-accent/30">
          <h3 className="text-lg font-black text-brand-dark mb-6 flex items-center gap-2">
            <Zap className="text-brand-main fill-brand-main" size={20} />
            {t.upgrades}
          </h3>
          <div className="space-y-3">
            <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl flex justify-between items-center text-sm shadow-sm hover:bg-white transition-all">
              <span className="font-bold text-brand-dark">Wolt Integration</span>
              <button className="text-brand-main font-black underline cursor-pointer">{t.add}</button>
            </div>
          </div>
        </div>
      </aside>

      {/* ה-Wizard - יופיע כשבוחרים ארגון להקמה */}
      {wizardOrg && (
        <CreateSiteWizard 
          org={wizardOrg} 
          isRtl={isRtl} 
          onClose={() => setWizardOrg(null)} 
          onComplete={() => { setWizardOrg(null); fetchDashboardData(); }} 
        />
      )}
    </main>
  );
}