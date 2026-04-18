"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { Language, translations } from '@/lib/translations';
import { CloudSun, Globe } from 'lucide-react';
import UserMenu from '@/components/dashboard/UserMenu';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function AuthenticatedLayoutContent({ children }: { children: React.ReactNode }) {
  const [userProfile, setUserProfile] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentLang = (searchParams.get('lang') as Language) || 'he';
  const [lang, setLang] = useState<Language>(currentLang);
  
  const t = translations[lang] || translations.he;
  const isRtl = lang === 'he';

  useEffect(() => {
    setLang(currentLang);
  }, [currentLang]);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setUserProfile(data);
    };
    fetchProfile();
  }, [router]);

  const toggleLang = () => {
    const newLang = lang === 'en' ? 'he' : 'en';
    const params = new URLSearchParams(searchParams.toString());
    params.set('lang', newLang);
    router.push(`${pathname}?${params.toString()}`);
  };

  const getPageInfo = () => {
    if (pathname.includes('/admin/management')) {
      return { 
        title: isRtl ? translations.he.admin.title : translations.en.admin.title, 
        sub: isRtl ? translations.he.admin.subtitle : translations.en.admin.subtitle 
      };
    }
    return { 
      title: isRtl ? t.dashboard : "Dashboard", 
      sub: t.welcomeBack 
    };
  };

  const pageInfo = getPageInfo();
  const isSystemStaff = userProfile?.role === 'system-admin' || userProfile?.role === 'operator';

  return (
    <div className="min-h-screen bg-brand-grey transition-all duration-500" dir={t.dir}>
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

             <button onClick={toggleLang} className="flex items-center gap-2 text-sm font-bold text-brand-main px-3 py-2 rounded-xl hover:bg-brand-mint transition-colors cursor-pointer">
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

             {userProfile && <UserMenu profile={userProfile} lang={lang} />}
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

// העטיפה שפותרת את השגיאה של Netlify
export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-grey" />}>
      <AuthenticatedLayoutContent>{children}</AuthenticatedLayoutContent>
    </Suspense>
  );
}