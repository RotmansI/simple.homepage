"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Utensils } from 'lucide-react';

export default function MenuSection({ section }: any) {
  const [menus, setMenus] = useState<any[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // חילוץ הגדרות העיצוב מכל המקורות האפשריים (Direct settings או בתוך content)
  const settings = section?.settings || section?.content?.settings || {};
  const selectedMenuIds = settings.selectedMenuIds || [];
  
  // חישוב Scale ודינמיקה של גריד
  const scale = (settings.menuScale || 100) / 100;
  const useThreeColumns = scale < 0.85;

  // חוקיות Hover לבר הניווט (30% ו-70% אופסיטי) כפי שהוגדר
  const hoverBg = settings.activeNavBg ? `${settings.activeNavBg}4D` : 'rgba(0,0,0,0.1)'; 
  const hoverText = settings.activeNavText ? `${settings.activeNavText}B3` : 'rgba(255,255,255,0.7)';

  // הפיכת המערך למחרוזת לצורך השוואה יציבה ב-useEffect למניעת Maximum update depth exceeded
  const menuIdsString = JSON.stringify(selectedMenuIds);

  useEffect(() => {
    let isMounted = true;
    const ids = JSON.parse(menuIdsString);
    
    if (ids.length > 0) {
      fetchMenus(ids, isMounted);
    } else {
      setLoading(false);
      setMenus([]);
    }

    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [menuIdsString]);

  const fetchMenus = async (ids: string[], isMounted: boolean) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('organization_menus')
        .select('*')
        .in('id', ids);

      if (isMounted && data && !error) {
        const orderedMenus = ids
          .map((id: string) => data.find((m: any) => m.id === id))
          .filter(Boolean);
        
        setMenus(orderedMenus);
        if (orderedMenus.length > 0) {
          // שומרים על התפריט האקטיבי הנוכחי אם הוא עדיין קיים בבחירה החדשה
          if (!activeMenuId || !orderedMenus.find(m => m.id === activeMenuId)) {
            setActiveMenuId(orderedMenus[0].id);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching menus:", err);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  if (!section) return null;

  const activeMenu = menus.find(m => m.id === activeMenuId);

  if (loading) return (
    <div className="py-20 flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-main"></div>
    </div>
  );

  if (menus.length === 0) return (
    <div className="py-20 text-center bg-brand-grey/20 rounded-[3rem] border-2 border-dashed border-brand-mint">
      <Utensils className="mx-auto text-brand-charcoal/20 mb-4" size={48} />
      <p className="font-bold text-brand-charcoal/40 text-xl">Select a menu to display content</p>
    </div>
  );

  // עיבוד צבע רקע של הסקשן כולל אופסיטי
  const sectionBgColor = settings.bgColor 
    ? `${settings.bgColor}${Math.round((settings.bgOpacity ?? 100) * 2.55).toString(16).padStart(2, '0')}` 
    : 'transparent';

  return (
    <section 
      style={{ 
        backgroundColor: sectionBgColor,
        // אפקט Soft Edges (Fade) למעלה ולמטה
        maskImage: settings.softEdges ? 'linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)' : 'none',
        WebkitMaskImage: settings.softEdges ? 'linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)' : 'none',
      }}
      className="py-16 px-6 transition-all duration-500"
    >
      <div 
        className="max-w-7xl mx-auto transition-all duration-500"
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center',
          // פיצוי על הגובה שאבד בגלל ה-scale כדי שלא יווצרו חללים ריקים גדולים מדי
          marginBottom: scale < 1 ? `-${(1 - scale) * 80}%` : '0'
        }}
      >
        {/* Navigation Bar */}
        {menus.length > 1 && (
          <div className="flex justify-center mb-12">
            <div 
              style={{ backgroundColor: settings.navBg || 'rgba(0,0,0,0.05)' }}
              className="inline-flex p-1.5 rounded-2xl border border-black/5 backdrop-blur-sm"
            >
              {menus.map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => setActiveMenuId(menu.id)}
                  onMouseEnter={(e) => {
                    if (activeMenuId !== menu.id) {
                      e.currentTarget.style.backgroundColor = hoverBg;
                      e.currentTarget.style.color = hoverText;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeMenuId !== menu.id) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = settings.navText || 'inherit';
                    }
                  }}
                  style={{
                    backgroundColor: activeMenuId === menu.id ? (settings.activeNavBg || 'var(--brand-primary)') : 'transparent',
                    color: activeMenuId === menu.id ? (settings.activeNavText || '#ffffff') : (settings.navText || 'inherit'),
                  }}
                  className="px-8 py-3 rounded-xl font-black text-sm transition-all duration-300 shadow-sm"
                >
                  {menu.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu Header (Title & Description) */}
        {activeMenu && (
          <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4">
            <h3 
              style={{ color: settings.titleColor || 'inherit' }}
              className="text-5xl font-black tracking-tighter mb-4"
            >
              {activeMenu.name}<span className="text-brand-main">.</span>
            </h3>
            {activeMenu.description && (
              <p 
                style={{ color: settings.itemDescColor || 'inherit', opacity: 0.6 }}
                className="text-xl font-bold max-w-2xl mx-auto"
              >
                {activeMenu.description}
              </p>
            )}
          </div>
        )}

        {/* Categories & Items */}
        <div className="space-y-20">
          {activeMenu?.menu_data?.categories?.map((category: any) => (
            <div key={category.id} className="animate-in fade-in duration-700">
              {/* Category Header */}
              <div className="flex items-center gap-6 mb-10">
                <h4 
                  style={{ color: settings.categoryColor || 'inherit' }}
                  className="text-2xl font-black whitespace-nowrap uppercase tracking-widest"
                >
                  {category.name}
                </h4>
                <div 
                  className="h-[2px] w-full opacity-20" 
                  style={{ backgroundColor: settings.categoryColor || 'currentColor' }}
                />
              </div>

              {/* Items Grid - מגיב ל-Scale של המשתמש */}
              <div className={`grid gap-x-12 gap-y-10 ${useThreeColumns ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                {category.items?.map((item: any) => (
                  <div key={item.id} className="flex gap-6 group hover:translate-x-1 transition-transform duration-300">
                    {/* Item Image */}
                    <div className="w-24 h-24 shrink-0 bg-brand-grey rounded-2xl overflow-hidden border border-black/5 shadow-sm relative">
  {item.image_url || settings.defaultItemImage ? (
    <img 
      src={item.image_url || settings.defaultItemImage} 
      alt={item.name} 
      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center text-brand-mint opacity-40">
      <Utensils size={32} />
    </div>
  )}
</div>

                    {/* Item Content */}
                    <div className="flex-1 border-b border-black/5 pb-4">
                      <div className="flex justify-between items-start mb-1">
                        <h5 
                          style={{ color: settings.itemNameColor || 'inherit' }}
                          className="text-xl font-black"
                        >
                          {item.name}
                        </h5>
                        <span 
                          style={{ 
                            color: settings.priceColor || 'var(--brand-main)',
                            backgroundColor: settings.priceColor ? `${settings.priceColor}1A` : 'rgba(var(--brand-main-rgb), 0.1)'
                          }}
                          className="text-lg font-black px-3 py-1 rounded-xl"
                        >
                          ₪{item.price}
                        </span>
                      </div>
                      {item.description && (
                        <p 
                          style={{ color: settings.itemDescColor || 'inherit' }}
                          className="text-sm font-bold opacity-60 leading-relaxed"
                        >
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}