"use client";

import React, { useState, useRef, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Language, translations } from '@/lib/translations';
import { 
  User, Settings, Sparkles, MessageCircle, 
  ShieldCheck, Users, LogOut, ChevronDown 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface UserMenuProps {
  profile: any;
  lang: Language;
}

export default function UserMenu({ profile, lang }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = translations[lang].userMenu;
  const isRtl = lang === 'he';

  // סגירת התפריט בלחיצה מחוץ לרכיב
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  const isAdmin = profile?.role === 'system-admin';

  return (
    <div className="relative inline-block" ref={menuRef}>
      {/* Avatar Trigger - הוספת z-index גבוה כדי שלא ייחבא תחת אלמנטים אחרים */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 p-1.5 rounded-full transition-all cursor-pointer border-2 shadow-sm relative z-50
          ${isOpen ? 'border-brand-main bg-brand-mint' : 'border-brand-mint bg-white hover:border-brand-main'}`}
      >
        <div className="relative">
          <img 
            src={profile?.avatar_url} 
            className="w-9 h-9 rounded-full object-cover" 
            alt="User" 
          />
          {/* Online Indicator */}
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-electric border-2 border-white rounded-full"></div>
        </div>
        <ChevronDown 
          size={14} 
          className={`text-brand-main transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            /* תיקון קריטי: הצמדה לימין (right-0) מבטיחה שהתפריט יגדל שמאלה ולא ייחתך בשום שפה */
            className={`absolute top-14 right-0 w-72 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(11,68,64,0.2)] border border-brand-mint overflow-hidden z-[999]`}
            dir={isRtl ? 'rtl' : 'ltr'}
          >
            {/* Header המשתמש */}
            <div className="p-6 bg-brand-grey/50 border-b border-brand-mint">
              <p className="font-black text-brand-dark text-lg leading-tight truncate">
                {profile?.first_name} {profile?.last_name}
              </p>
              <p className="text-xs text-brand-charcoal/50 font-medium mb-3 truncate">{profile?.email}</p>
              <span className="px-2.5 py-1 bg-brand-main text-white text-[10px] font-black rounded-lg uppercase tracking-wider">
                {profile?.role}
              </span>
            </div>

            {/* רשימת האפשרויות */}
            <div className="p-2">
              <MenuItem icon={<User size={18} />} label={t.profile} isRtl={isRtl} />
              <MenuItem icon={<Settings size={18} />} label={t.settings} isRtl={isRtl} />
              
              <div className="h-px bg-brand-mint my-2 mx-4" />
              
              <MenuItem icon={<Sparkles size={18} className="text-purple" />} label={t.whatsNew} isRtl={isRtl} />
              <MenuItem icon={<MessageCircle size={18} />} label={t.contact} isRtl={isRtl} />

              {isAdmin && (
                <>
                  <div className="h-px bg-brand-mint my-2 mx-4" />
                  <p className={`px-4 py-1 text-[10px] font-black text-brand-charcoal/30 uppercase tracking-widest ${isRtl ? 'text-right' : 'text-left'}`}>
                    {t.adminArea}
                  </p>
                  <MenuItem 
                    icon={<ShieldCheck size={18} className="text-crimson" />} 
                    label={t.systemAdmin} 
                    isRtl={isRtl}
                    onClick={() => window.location.href = '/admin/system'} 
                  />
                  <MenuItem 
                    icon={<Users size={18} className="text-crimson" />} 
                    label={t.userOrgMgmt} 
                    isRtl={isRtl}
                    onClick={() => window.location.href = '/admin/management'} 
                  />
                </>
              )}

              <div className="h-px bg-brand-mint my-2 mx-4" />
              
              <MenuItem 
                icon={<LogOut size={18} className="text-salmon" />} 
                label={t.logout} 
                isRtl={isRtl}
                onClick={handleLogout} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  isRtl: boolean;
  onClick?: () => void;
}

function MenuItem({ icon, label, isRtl, onClick }: MenuItemProps) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-brand-mint/40 text-sm font-bold text-brand-charcoal transition-all group cursor-pointer ${isRtl ? 'text-right' : 'text-left'}`}
    >
      <span className="text-brand-main opacity-70 group-hover:opacity-100 transition-opacity flex-shrink-0">
        {icon}
      </span>
      <span className="truncate">{label}</span>
    </button>
  );
}