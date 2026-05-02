"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { Language, translations } from '@/lib/translations/index';
import { CloudSun, Globe } from 'lucide-react';
import UserMenu from '@/components/dashboard/UserMenu';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { LanguageProvider, useLanguage } from '@/context/LanguageContext';

// 1. קומפוננטת התוכן הפנימית
function AuthenticatedLayoutContent({ children }: { children: React.ReactNode }) {
  const { lang, setLang } = useLanguage();
  const [userProfile, setUserProfile] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // פתרון שגיאת ה-Index: הגדרה מפורשת של t לפי הטיפוס Language
  const t = translations[lang as Language];
  const isRtl = lang === 'he';

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      // שליפת פרופיל והגדרות משתמש במקביל לביצועים אופטימליים
      const [profileRes, settingsRes] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('user_settings').select('language').eq('user_id', user.id).maybeSingle()
      ]);

      if (profileRes.data) setUserProfile(profileRes.data);
      
      // אם יש שפה שמורה בדאטה-בייס, נעדכן את ה-Context
      if (settingsRes.data?.language) {
        setLang(settingsRes.data.language as Language);
      }
    };
    init();
  }, [router, setLang]);

  const toggleLang = async () => {
    const newLang = lang === 'en' ? 'he' : 'en';
    
    // 1. עדכון UI מיידי דרך ה-Context (כל המערכת תתעדכן)
    setLang(newLang); 

    if (userProfile?.id) {
      // 2. עדכון ה-Database עם Upsert
      const { error } = await supabase
        .from('user_settings')
        .upsert({ 
          user_id: userProfile.id, 
          language: newLang,
          updated_at: new Date().toISOString() 
        }, { onConflict: 'user_id' });
        
      if (error) console.error("Update failed:", error);
    }

    // 3. עדכון ה-URL בצורה שקטה (לסנכרון דפים שעדיין קוראים מה-URL)
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', newLang);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const getPageInfo = () => {
    const currentT = translations[lang as Language]; 
    if (pathname.includes('/admin/management')) {
      return { 
        title: currentT.admin?.title || (isRtl ? "ניהול מערכת" : "System Management"), 
        sub: currentT.admin?.subtitle || (isRtl ? "ניהול חשבונות ועסקים" : "Manage accounts and businesses")
      };
    }
    return { 
      title: currentT.dashboard || "Dashboard", 
      sub: currentT.welcomeBack || (isRtl ? "ברוך שובך" : "Welcome back")
    };
  };

  const pageInfo = getPageInfo();
  const isSystemStaff = userProfile?.role === 'system-admin' || userProfile?.role === 'operator';

  return (
    <div className="min-h-screen bg-brand-grey" dir={t.dir}>
      <nav className="bg-white border-b border-brand-mint sticky top-0 z-[100] px-6 py-4 shadow-sm" dir="ltr">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href={`/dashboard?lang=${lang}`} className="flex items-center gap-3 group">
            <img src="/simple-logo.png" alt="Simple" className="h-7 w-auto object-contain" />
            <span className="text-2xl font-black text-brand-dark tracking-tighter ml-1">Homepage</span>
          </Link>

          <div className="flex items-center gap-4">
             {isSystemStaff && (
               <div className="flex items-center gap-2 px-3 py-1.5 bg-brand-mint/30 rounded-full border border-brand-mint">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-electric"></span>
                  </span>
                  <span className="text-[10px] font-black text-brand-main uppercase tracking-wider">
                    {userProfile.role === 'system-admin' ? (isRtl ? 'מנהל מערכת' : 'System Admin') : (isRtl ? 'אופרייטור' : 'Operator')}
                  </span>
               </div>
             )}

             <button 
              onClick={toggleLang} 
              className="flex items-center gap-2 text-sm font-bold text-brand-main px-3 py-2 rounded-xl hover:bg-brand-mint transition-colors cursor-pointer"
             >
               <Globe size={18} />
               <span className="font-bold">{t.switchLang}</span>
             </button>

             <div className="hidden md:flex items-center gap-3 bg-brand-grey/50 px-4 py-2 rounded-2xl border border-brand-mint/50">
                <CloudSun className="text-brand-main" size={20} />
                <div className="text-sm">
                  <p className="font-bold leading-none mb-0.5">24°C</p>
                  <p className="text-[10px] opacity-60 leading-none">{t.city}, {t.temp}</p>
                </div>
             </div>

             {userProfile && <UserMenu profile={userProfile} />}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className={`mb-10 ${isRtl ? 'text-right' : 'text-left'}`}>
            <h2 className="text-4xl font-black text-brand-dark mb-2 tracking-tight">{pageInfo.title}</h2>
            <p className="text-brand-charcoal/50 font-bold text-lg">{pageInfo.sub}</p>
        </div>
        <div className="w-full">{children}</div>
      </main>
    </div>
  );
}

// 2. ה-Default Export הראשי
export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const initialLang = (searchParams.get('lang') as Language) || 'he';

  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-grey" />}>
      <LanguageProvider initialLang={initialLang}>
        <AuthenticatedLayoutContent>
          {children}
        </AuthenticatedLayoutContent>
      </LanguageProvider>
    </Suspense>
  );
}