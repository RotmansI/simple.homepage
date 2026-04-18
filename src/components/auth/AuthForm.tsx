"use client";

import React, { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { translations, Language } from '@/lib/translations';
import { Loader2, Globe, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';

const AVATAR_OPTIONS = [
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
  "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo"
];

export default function AuthForm({ mode }: { mode: 'login' | 'register' }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [lang, setLang] = useState<Language>((searchParams.get('lang') as Language) || 'en');
  const t = translations[lang];
  const isRtl = lang === 'he';

  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState<string | undefined>();
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  const validatePassword = (pass: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(pass);
  };

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!validateEmail(email)) {
      setMessage(lang === 'he' ? "כתובת אימייל לא תקינה" : "Invalid email address");
      return;
    }

    if (!isLogin) {
      if (!validatePassword(password)) {
        setMessage(lang === 'he' ? "הסיסמה חלשה מדי" : "Password is too weak");
        return;
      }
    }

    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/dashboard');
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              phone: phone,
              avatar_url: selectedAvatar,
            }
          }
        });
        if (error) throw error;
        setMessage(t.checkEmail);
      }
    } catch (error: any) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-pearl flex flex-col items-center justify-center p-6 relative overflow-hidden" dir={t.dir}>
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-brand-indigo/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-brand-coral/5 rounded-full blur-3xl" />

      {/* Language Switcher */}
      <button 
        type="button"
        onClick={() => setLang(lang === 'en' ? 'he' : 'en')}
        className="absolute top-8 right-8 flex items-center gap-2 text-sm font-black text-brand-indigo bg-white px-5 py-2.5 rounded-full shadow-sm border border-brand-lavender z-10 hover:bg-brand-pearl transition-colors"
      >
        <Globe size={16} />
        {lang === 'en' ? 'עברית' : 'English'}
      </button>

      {/* Logo Section */}
      <Link href="/" className="flex flex-col items-center gap-2 mb-10 group">
        <img 
          src="/simple-header.png" 
          alt="Simple." 
          className="h-16 w-auto object-contain transition-transform group-hover:scale-105"
        />
      </Link>

      <div className="bg-white p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(79,70,229,0.1)] w-full max-w-lg border border-brand-lavender relative z-10">
        <h2 className="text-4xl font-black text-brand-midnight mb-2 text-center tracking-tight">
          {isLogin ? t.login : t.register}
          <span className="text-brand-coral">.</span>
        </h2>
        <p className="text-brand-slate text-center text-sm font-medium mb-8">
          {isLogin ? (lang === 'he' ? 'שמחים שחזרת!' : 'Welcome back!') : (lang === 'he' ? 'בואו נקים את האתר הבא שלכם' : 'Lets build your next site')}
        </p>
        
        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <>
              <div className="flex justify-center gap-3 mb-8">
                {AVATAR_OPTIONS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedAvatar(url)}
                    className={`w-14 h-14 rounded-full border-4 transition-all overflow-hidden ${selectedAvatar === url ? 'border-brand-indigo scale-110 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'}`}
                  >
                    <img src={url} alt="avatar" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  placeholder={t.firstName}
                  className="px-5 py-4 rounded-2xl border border-brand-lavender outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/5 bg-brand-pearl/50 w-full font-bold transition-all"
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
                <input
                  placeholder={t.lastName}
                  className="px-5 py-4 rounded-2xl border border-brand-lavender outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/5 bg-brand-pearl/50 w-full font-bold transition-all"
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
              
              <div className="phone-input-wrapper flex items-center px-5 py-1.5 rounded-2xl border border-brand-lavender focus-within:border-brand-indigo focus-within:ring-4 focus-within:ring-brand-indigo/5 bg-brand-pearl/50 transition-all">
                <PhoneInput
                  international
                  defaultCountry="IL"
                  placeholder={t.phone}
                  value={phone}
                  onChange={setPhone}
                  className="w-full custom-phone-input font-bold"
                />
              </div>
            </>
          )}

          <input
            type="email"
            placeholder={t.email}
            className="w-full px-5 py-4 rounded-2xl border border-brand-lavender outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/5 bg-brand-pearl/50 font-bold transition-all"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder={t.password}
            className="w-full px-5 py-4 rounded-2xl border border-brand-lavender outline-none focus:border-brand-indigo focus:ring-4 focus:ring-brand-indigo/5 bg-brand-pearl/50 font-bold transition-all"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {message && (
            <div className={`p-5 rounded-2xl text-sm font-black animate-in fade-in slide-in-from-top-1 ${
              message.includes('Check') || message.includes('בדוק') 
              ? 'bg-brand-lime/20 text-brand-indigo' 
              : 'bg-brand-coral/10 text-brand-coral'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-indigo text-white py-5 rounded-[1.5rem] font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-brand-indigo/20 flex items-center justify-center gap-3 disabled:opacity-50 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : (isLogin ? t.login : t.register)}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setIsLogin(!isLogin);
            setMessage('');
          }}
          className="w-full mt-8 text-sm font-black text-brand-indigo hover:underline text-center cursor-pointer uppercase tracking-widest"
        >
          {isLogin ? t.noAccount : t.hasAccount}
        </button>
      </div>

      {/* Back to Home Link */}
      <Link href="/" className="mt-8 flex items-center gap-2 text-brand-slate font-bold hover:text-brand-indigo transition-colors group">
        <ChevronLeft size={16} className={`${isRtl ? 'rotate-180' : ''} group-hover:-translate-x-1 transition-transform`} />
        {lang === 'he' ? 'חזרה לדף הבית' : 'Back to Home'}
      </Link>
    </div>
  );
}