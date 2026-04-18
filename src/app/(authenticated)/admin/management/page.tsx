"use client";

import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Language, translations } from '@/lib/translations';
import { 
  Users, Building2, ShieldAlert, Search, 
  Trash2, ChevronRight, ChevronLeft, 
  X, Loader2, UserPlus, Power, Plus, Link2, Edit3, Globe, Image as ImageIcon, ExternalLink, Upload
} from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

type Tab = 'operators' | 'users' | 'orgs';

export default function AdminManagementPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>('operators');
  const lang = (searchParams.get('lang') as Language) || 'he';
  const t = translations[lang];
  const isRtl = lang === 'he';

  const [items, setItems] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<any>(null);
  const [isUserListOpen, setIsUserListOpen] = useState<any>(null);
  const [isOrgAssignOpen, setIsOrgAssignOpen] = useState<any>(null);

  // State לארגון חדש/עריכה
  const [orgData, setOrgData] = useState({
    slug: '',
    name_he: '',
    name_en: '',
    logo_small: '',
    logo_large: '',
    business_info: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [allOrgs, setAllOrgs] = useState<any[]>([]);

  const PAGE_SIZE = 10;

  useEffect(() => {
    fetchData();
    if (activeTab === 'users') fetchAllOrgs();
  }, [activeTab, currentPage, searchTerm]);

  const fetchData = async () => {
    setLoading(true);
    let query;
    if (activeTab === 'operators') {
      query = supabase.from('profiles').select(`*, updated_by_profile:updated_by(first_name, last_name)`, { count: 'exact' }).eq('role', 'operator');
    } else if (activeTab === 'users') {
      query = supabase.from('profiles').select(`*, user_organizations(org_id, organizations(name_he, name_en))`, { count: 'exact' }).not('role', 'in', '("operator","system-admin")');
    } else {
      query = supabase.from('organizations').select(`*, user_organizations(user_id, profiles(first_name, last_name, id))`, { count: 'exact' });
    }

    if (searchTerm) {
      if (activeTab === 'orgs') {
        query = query.or(`name_he.ilike.%${searchTerm}%,name_en.ilike.%${searchTerm}%,slug.ilike.%${searchTerm}%`);
      } else {
        query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);
      }
    }

    const sortColumn = activeTab === 'orgs' ? 'created_at' : 'updated_at';
    const { data, count } = await query
      .order(sortColumn, { ascending: false })
      .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1);

    setItems(data || []);
    setTotalCount(count || 0);
    setLoading(false);
  };

  const fetchAllOrgs = async () => {
    const { data } = await supabase.from('organizations').select('id, name_he, name_en');
    setAllOrgs(data || []);
  };

  const handleOrgSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orgData.slug) return alert("Slug is required");
    setIsSaving(true);
    
    const { error } = editingOrg 
      ? await supabase.from('organizations').update(orgData).eq('id', editingOrg.id)
      : await supabase.from('organizations').insert([orgData]);

    if (!error) {
      setIsAddModalOpen(false);
      setEditingOrg(null);
      setOrgData({ slug: '', name_he: '', name_en: '', logo_small: '', logo_large: '', business_info: '' });
      fetchData();
    } else {
      alert(error.message);
    }
    setIsSaving(false);
  };

  const uploadFile = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logo_small' | 'logo_large') => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!orgData.slug) {
      alert(isRtl ? "אנא הזן Slug לפני העלאת לוגו" : "Please enter a slug before uploading a logo");
      return;
    }

    setIsSaving(true);
    const fileExt = file.name.split('.').pop();
    const sizePrefix = field === 'logo_small' ? 'small' : 'large';
    const filePath = `logos/${orgData.slug}/${sizePrefix}_${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage.from('logos').upload(filePath, file, {
      upsert: true
    });

    if (!uploadError) {
      const { data } = supabase.storage.from('logos').getPublicUrl(filePath);
      setOrgData(prev => ({ ...prev, [field]: data.publicUrl }));
    } else {
      alert(uploadError.message);
    }
    setIsSaving(false);
  };

  const updateRole = async (userId: string, newRole: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    await supabase.from('profiles').update({ 
      role: newRole, 
      updated_by: user?.id,
      updated_at: new Date().toISOString()
    }).eq('id', userId);
    fetchData();
  };

  const toggleUserOrg = async (userId: string, org_id: string, isLinked: boolean) => {
    if (isLinked) {
      await supabase.from('user_organizations').delete().match({ user_id: userId, org_id });
    } else {
      await supabase.from('user_organizations').insert({ user_id: userId, org_id });
    }
    fetchData();
  };

  const handleEditClick = (org: any) => {
    setEditingOrg(org);
    setOrgData({
      slug: org.slug,
      name_he: org.name_he,
      name_en: org.name_en,
      logo_small: org.logo_small || '',
      logo_large: org.logo_large || '',
      business_info: org.business_info || ''
    });
    setIsAddModalOpen(true);
  };

  const handleGlobalSearch = async (val: string) => {
    setGlobalSearch(val);
    if (val.length < 2) { setSearchResults([]); return; }
    setSearchLoading(true);
    if (activeTab === 'operators') {
      const { data } = await supabase.from('profiles').select('*').neq('role', 'operator').or(`first_name.ilike.%${val}%,last_name.ilike.%${val}%,email.ilike.%${val}%`).limit(5);
      setSearchResults(data || []);
    } 
    setSearchLoading(false);
  };

  return (
    <div dir={t.dir} className="relative">
      <div className="flex gap-2 bg-white p-2 rounded-2xl shadow-sm border border-brand-mint mb-8 w-fit">
        <TabButton active={activeTab === 'operators'} onClick={() => {setActiveTab('operators'); setCurrentPage(1);}} icon={<ShieldAlert size={18}/>} label={t.admin.tabs.operators} />
        <TabButton active={activeTab === 'users'} onClick={() => {setActiveTab('users'); setCurrentPage(1);}} icon={<Users size={18}/>} label={t.admin.tabs.users} />
        <TabButton active={activeTab === 'orgs'} onClick={() => {setActiveTab('orgs'); setCurrentPage(1);}} icon={<Building2 size={18}/>} label={t.admin.tabs.orgs} />
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-brand-mint overflow-hidden min-h-[600px]">
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
            <span className="bg-brand-mint text-brand-main px-3 py-1 rounded-full text-xs font-black">
              {totalCount} {activeTab === 'orgs' ? t.admin.tabs.orgs : t.admin.operators.countSuffix}
            </span>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 text-brand-charcoal/30`} size={18} />
                <input 
                  type="text"
                  placeholder={t.admin.operators.searchPlaceholder}
                  className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 rounded-xl border border-brand-mint outline-none focus:border-brand-main text-sm font-bold`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              {/* תיקון: החזרת הכפתור גם לאופרייטורס וגם לארגונים */}
              {(activeTab === 'orgs' || activeTab === 'operators') && (
                <button 
                  onClick={() => {
                    if (activeTab === 'orgs') {
                      setEditingOrg(null); 
                      setOrgData({slug:'',name_he:'',name_en:'',logo_small:'',logo_large:'',business_info:''}); 
                    }
                    setIsAddModalOpen(true);
                  }}
                  className="bg-brand-main text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-brand-dark transition-all cursor-pointer shadow-md"
                >
                  {activeTab === 'orgs' ? <Plus size={18}/> : <UserPlus size={18} />}
                  {activeTab === 'orgs' ? t.admin.orgs.addBtn : t.admin.operators.addBtn}
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className={`w-full ${isRtl ? 'text-right' : 'text-left'}`}>
              <thead>
                <tr className="text-brand-charcoal/40 text-xs uppercase tracking-widest border-b border-brand-mint">
                  {activeTab === 'orgs' ? (
                    <>
                      <th className="pb-4 font-black">{t.admin.orgs.table.org}</th>
                      <th className="pb-4 font-black">{t.admin.orgs.table.slug}</th>
                      <th className="pb-4 font-black">{t.admin.orgs.table.users}</th>
                    </>
                  ) : (
                    <>
                      <th className="pb-4 font-black">{t.admin.operators.table.user}</th>
                      <th className="pb-4 font-black">{activeTab === 'users' ? t.admin.users.role : t.admin.operators.table.email}</th>
                      <th className="pb-4 font-black">{activeTab === 'users' ? t.admin.users.linkedOrgs : t.admin.operators.table.updatedAt}</th>
                    </>
                  )}
                  <th className={`pb-4 font-black ${isRtl ? 'text-left' : 'text-right'}`}>{t.admin.operators.table.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-mint/50">
                {loading ? (
                  <tr><td colSpan={5} className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-brand-main" size={40}/></td></tr>
                ) : items.map((item) => (
                  <tr key={item.id} className="group hover:bg-brand-grey/30 transition-colors">
                    {activeTab === 'orgs' ? (
                      <>
                        <td className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-brand-grey flex items-center justify-center overflow-hidden border border-brand-mint shadow-sm">
                              {/* הצגת לוגו עם פולבאק לאייקון */}
                              {item.logo_small ? (
                                <img src={item.logo_small} alt="" className="object-cover w-full h-full" />
                              ) : (
                                <Building2 size={20} className="text-brand-main" />
                              )}
                            </div>
                            <span className="font-bold text-brand-dark">{isRtl ? item.name_he : item.name_en}</span>
                          </div>
                        </td>
                        <td className="py-5">
                           <div className="flex items-center gap-2 font-mono text-xs text-brand-charcoal/60">
                              {item.slug}
                              <a href={`https://${item.slug}.tabit.io`} target="_blank" rel="noreferrer" className="text-brand-main hover:scale-110 transition-transform">
                                <ExternalLink size={14} />
                              </a>
                           </div>
                        </td>
                        <td className="py-5">
                          <button 
                            onClick={() => setIsUserListOpen(item)}
                            className="bg-brand-mint text-brand-main px-3 py-1 rounded-full text-xs font-black hover:bg-brand-main hover:text-white transition-colors cursor-pointer"
                          >
                            {item.user_organizations?.length || 0} {isRtl ? 'משתמשים' : 'Users'}
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-5">
                          <div className="flex items-center gap-3">
                            <img src={item.avatar_url} className="w-10 h-10 rounded-full border border-brand-mint p-0.5" alt="" />
                            <span className="font-bold text-brand-dark">{item.first_name} {item.last_name}</span>
                          </div>
                        </td>
                        <td className="py-5">
                          {activeTab === 'users' ? (
                            <select 
                              value={item.role} 
                              onChange={(e) => updateRole(item.id, e.target.value)}
                              className="bg-brand-grey px-2 py-1 rounded-lg text-xs font-bold outline-none border border-brand-mint focus:border-brand-main"
                            >
                              <option value="unassigned">{t.admin.users.unassigned}</option>
                              <option value="site-editor">{t.admin.users.siteEditor}</option>
                              <option value="site-admin">{t.admin.users.siteAdmin}</option>
                            </select>
                          ) : (
                            <span className="text-sm font-medium text-brand-charcoal/60">{item.email}</span>
                          )}
                        </td>
                        <td className="py-5">
                          {activeTab === 'users' ? (
                            <button 
                              onClick={() => setIsOrgAssignOpen(item)}
                              className="flex items-center gap-1 text-xs font-black text-brand-main hover:underline cursor-pointer"
                            >
                              <Link2 size={14} /> {item.user_organizations?.length || 0} {t.admin.tabs.orgs}
                            </button>
                          ) : (
                            <span className="text-sm text-brand-charcoal/60">{new Date(item.updated_at).toLocaleDateString(isRtl ? 'he-IL' : 'en-US')}</span>
                          )}
                        </td>
                      </>
                    )}
                    <td className={`py-5 ${isRtl ? 'text-left' : 'text-right'}`}>
                      <div className="flex justify-end gap-2">
                        {activeTab === 'orgs' ? (
                          <>
                            <button onClick={() => handleEditClick(item)} className="p-2 text-brand-main hover:bg-brand-mint rounded-lg cursor-pointer"><Edit3 size={18} /></button>
                            <button className="p-2 text-salmon hover:bg-salmon/10 rounded-lg cursor-pointer"><Power size={18} /></button>
                          </>
                        ) : (
                          <button onClick={() => updateRole(item.id, 'unassigned')} className="p-2 text-crimson hover:bg-crimson/10 rounded-lg cursor-pointer"><Trash2 size={18} /></button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={currentPage} totalCount={totalCount} pageSize={PAGE_SIZE} onPageChange={setCurrentPage} t={t} isRtl={isRtl} />
        </div>
      </div>

      {/* Org Modal (Create/Edit) */}
      {isAddModalOpen && activeTab === 'orgs' && (
        <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-brand-mint">
            <div className={`p-8 border-b border-brand-mint flex justify-between items-center bg-brand-grey/30 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
              <h3 className="text-2xl font-black text-brand-dark">{editingOrg ? (isRtl ? 'עריכת ארגון' : 'Edit Org') : t.admin.orgs.modal.title}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-brand-charcoal/30 hover:text-brand-dark cursor-pointer"><X size={24} /></button>
            </div>
            <form onSubmit={handleOrgSubmit} className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[80vh] overflow-y-auto">
              <div className="md:col-span-2">
                <label className="text-xs font-black text-brand-charcoal/40 uppercase mb-2 block">{t.admin.orgs.modal.slug}</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/30" size={18} />
                  <input required className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-mint outline-none focus:border-brand-main font-bold" value={orgData.slug} onChange={(e) => setOrgData({...orgData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})} placeholder="slug-name" />
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-brand-charcoal/40 uppercase mb-2 block">{t.admin.orgs.modal.nameHe}</label>
                <input required className="w-full px-4 py-3 rounded-xl border border-brand-mint outline-none focus:border-brand-main font-bold" value={orgData.name_he} onChange={(e) => setOrgData({...orgData, name_he: e.target.value})} />
              </div>
              <div>
                <label className="text-xs font-black text-brand-charcoal/40 uppercase mb-2 block">{t.admin.orgs.modal.nameEn}</label>
                <input required className="w-full px-4 py-3 rounded-xl border border-brand-mint outline-none focus:border-brand-main font-bold" value={orgData.name_en} onChange={(e) => setOrgData({...orgData, name_en: e.target.value})} />
              </div>
              
              <LogoUploadField label={t.admin.orgs.modal.logoSmall} value={orgData.logo_small} onChange={(val: string) => setOrgData({...orgData, logo_small: val})} onFileSelect={(e: any) => uploadFile(e, 'logo_small')} isSaving={isSaving} />
              <LogoUploadField label={t.admin.orgs.modal.logoLarge} value={orgData.logo_large} onChange={(val: string) => setOrgData({...orgData, logo_large: val})} onFileSelect={(e: any) => uploadFile(e, 'logo_large')} isSaving={isSaving} />

              <div className="md:col-span-2 flex gap-8 p-6 bg-brand-grey/30 rounded-3xl border border-dashed border-brand-mint justify-center">
                <div className="flex flex-col items-center gap-3">
                  <span className="text-[10px] font-black text-brand-charcoal/40 uppercase tracking-widest">Logo Small (150x150)</span>
                  <div className="relative w-[150px] h-[150px] rounded-2xl border-2 border-brand-mint overflow-hidden bg-white shadow-sm flex items-center justify-center">
                    {orgData.logo_small ? (
                      <>
                        <img src={orgData.logo_small} className="max-w-full max-h-full object-contain" alt="Small Preview" />
                        <button type="button" onClick={() => setOrgData({...orgData, logo_small: ''})} className="absolute top-2 right-2 bg-crimson text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer">
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <ImageIcon size={40} className="text-brand-charcoal/10" />
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-3">
                  <span className="text-[10px] font-black text-brand-charcoal/40 uppercase tracking-widest">Logo Large (150x150)</span>
                  <div className="relative w-[150px] h-[150px] rounded-2xl border-2 border-brand-mint overflow-hidden bg-white shadow-sm flex items-center justify-center">
                    {orgData.logo_large ? (
                      <>
                        <img src={orgData.logo_large} className="max-w-full max-h-full object-contain" alt="Large Preview" />
                        <button type="button" onClick={() => setOrgData({...orgData, logo_large: ''})} className="absolute top-2 right-2 bg-crimson text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer">
                          <X size={12} />
                        </button>
                      </>
                    ) : (
                      <ImageIcon size={40} className="text-brand-charcoal/10" />
                    )}
                  </div>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-black text-brand-charcoal/40 uppercase mb-2 block">{t.admin.orgs.modal.businessInfo}</label>
                <textarea rows={3} className="w-full px-4 py-3 rounded-xl border border-brand-mint outline-none focus:border-brand-main text-sm font-medium" value={orgData.business_info} onChange={(e) => setOrgData({...orgData, business_info: e.target.value})} />
              </div>
              <div className="md:col-span-2 flex gap-3 mt-4">
                <button type="submit" disabled={isSaving} className="flex-1 bg-brand-main text-white py-4 rounded-2xl font-black hover:bg-brand-dark transition-all disabled:opacity-50 shadow-lg">
                  {isSaving ? <Loader2 className="animate-spin mx-auto" /> : (editingOrg ? (isRtl ? 'שמור שינויים' : 'Save Changes') : t.admin.orgs.modal.save)}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User List Overlay */}
      {isUserListOpen && (
        <div className="fixed inset-0 bg-brand-dark/20 z-[250] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsUserListOpen(null)}>
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 border border-brand-mint" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center mb-6">
                <h4 className="font-black text-brand-dark">{isRtl ? 'משתמשים משויכים' : 'Linked Users'}</h4>
                <button onClick={() => setIsUserListOpen(null)}><X size={20}/></button>
             </div>
             <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {isUserListOpen.user_organizations?.map((uo: any) => (
                  <div key={uo.profiles.id} className="flex items-center justify-between p-2 hover:bg-brand-grey rounded-xl transition-colors">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand-mint rounded-full flex items-center justify-center text-brand-main text-xs font-bold">
                           {uo.profiles.first_name?.[0]}
                        </div>
                        <span className="text-sm font-bold text-brand-charcoal">{uo.profiles.first_name} {uo.profiles.last_name}</span>
                     </div>
                     <Link href={`/admin/profile/${uo.profiles.id}`} className="p-1.5 text-brand-main hover:bg-white rounded-lg">
                        <ExternalLink size={14} />
                     </Link>
                  </div>
                ))}
                {(!isUserListOpen.user_organizations || isUserListOpen.user_organizations.length === 0) && (
                  <p className="text-center text-xs text-brand-charcoal/40 py-4 italic">אין משתמשים משויכים</p>
                )}
             </div>
          </div>
        </div>
      )}

      {/* Org Assignment Modal for User */}
      {isOrgAssignOpen && (
        <div className="fixed inset-0 bg-brand-dark/20 z-[250] flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setIsOrgAssignOpen(null)}>
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 border border-brand-mint" onClick={e => e.stopPropagation()}>
             <div className="flex justify-between items-center mb-8">
                <div>
                  <h4 className="font-black text-brand-dark text-xl">{isRtl ? 'ניהול שיוך ארגונים' : 'Manage Org Links'}</h4>
                  <p className="text-xs text-brand-charcoal/40 font-bold">{isOrgAssignOpen.first_name} {isOrgAssignOpen.last_name}</p>
                </div>
                <button onClick={() => setIsOrgAssignOpen(null)}><X size={24}/></button>
             </div>
             <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                {allOrgs.map(org => {
                  const isLinked = isOrgAssignOpen.user_organizations?.some((uo: any) => uo.org_id === org.id);
                  return (
                    <div key={org.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${isLinked ? 'border-brand-main bg-brand-mint/10 shadow-sm' : 'border-brand-grey opacity-60'}`}>
                       <span className="font-bold text-sm">{isRtl ? org.name_he : org.name_en}</span>
                       <button 
                         onClick={() => toggleUserOrg(isOrgAssignOpen.id, org.id, isLinked)}
                         className={`p-2 rounded-xl transition-all cursor-pointer ${isLinked ? 'text-crimson bg-white shadow-sm hover:scale-105' : 'text-brand-main bg-white shadow-sm hover:scale-105'}`}
                       >
                         {isLinked ? <Trash2 size={18} /> : <Plus size={18} />}
                       </button>
                    </div>
                  )
                })}
             </div>
          </div>
        </div>
      )}

      {isAddModalOpen && activeTab === 'operators' && (
        <AddOperatorModal 
          t={t} 
          isRtl={isRtl} 
          globalSearch={globalSearch} 
          searchResults={searchResults} 
          searchLoading={searchLoading} 
          onSearch={handleGlobalSearch} 
          onClose={() => setIsAddModalOpen(false)} 
          onAdd={(uid: string) => updateRole(uid, 'operator')} 
        />
      )}
    </div>
  );
}

// --- Helper Components ---

function LogoUploadField({ label, value, onChange, onFileSelect, isSaving }: any) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-2">
      <label className="text-xs font-black text-brand-charcoal/40 uppercase block">{label}</label>
      <div className="flex flex-col gap-2">
        <div className="relative">
          <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-charcoal/30" size={18} />
          <input className="w-full pl-12 pr-4 py-3 rounded-xl border border-brand-mint outline-none focus:border-brand-main text-sm" value={value} onChange={(e) => onChange(e.target.value)} placeholder="URL או העלה..." />
        </div>
        <button type="button" disabled={isSaving} onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center gap-2 bg-brand-grey py-2.5 rounded-xl text-xs font-black text-brand-charcoal/60 hover:bg-brand-mint hover:text-brand-main transition-all cursor-pointer border border-dashed border-brand-mint disabled:opacity-50">
          <Upload size={14} /> {isSaving ? 'מעלה...' : 'בחירת קובץ'}
        </button>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={onFileSelect} />
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all cursor-pointer ${active ? 'bg-brand-main text-white shadow-md' : 'text-brand-charcoal/40 hover:text-brand-dark'}`}>
      {icon} {label}
    </button>
  );
}

function Pagination({ currentPage, totalCount, pageSize, onPageChange, t, isRtl }: any) {
  const maxPage = Math.ceil(totalCount / pageSize);
  if (maxPage <= 1) return null;
  return (
    <div className="flex justify-between items-center mt-8 pt-6 border-t border-brand-mint">
      <span className="text-xs font-bold text-brand-charcoal/40">
        {isRtl ? 'מציג' : 'Showing'} {(currentPage - 1) * pageSize + 1} {isRtl ? 'עד' : 'to'} {Math.min(currentPage * pageSize, totalCount)} {isRtl ? 'מתוך' : 'of'} {totalCount}
      </span>
      <div className="flex gap-2">
        <button disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className="p-2 rounded-lg border border-brand-mint disabled:opacity-30 cursor-pointer hover:bg-brand-grey transition-colors">
          {isRtl ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        <button disabled={currentPage >= maxPage} onClick={() => onPageChange(currentPage + 1)} className="p-2 rounded-lg border border-brand-mint disabled:opacity-30 cursor-pointer hover:bg-brand-grey transition-colors">
          {isRtl ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </div>
  );
}

interface AddOperatorModalProps {
  t: any;
  isRtl: boolean;
  globalSearch: string;
  searchResults: any[];
  searchLoading: boolean;
  onSearch: (val: string) => void;
  onClose: () => void;
  onAdd: (uid: string) => void;
}

function AddOperatorModal({ t, isRtl, globalSearch, searchResults, searchLoading, onSearch, onClose, onAdd }: AddOperatorModalProps) {
  return (
    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden border border-brand-mint">
        <div className={`p-8 border-b border-brand-mint flex justify-between items-center bg-brand-grey/30 ${isRtl ? 'flex-row' : 'flex-row-reverse'}`}>
          <h3 className="text-2xl font-black text-brand-dark">{t.admin.operators.modal.title}</h3>
          <button onClick={onClose} className="text-brand-charcoal/30 hover:text-brand-dark cursor-pointer"><X size={24} /></button>
        </div>
        <div className="p-8">
          <div className="relative mb-6">
            <Search className={`absolute ${isRtl ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-brand-charcoal/30`} size={20} />
            <input type="text" autoFocus placeholder={t.admin.operators.modal.searchPlaceholder} className={`w-full ${isRtl ? 'pr-12 pl-4' : 'pl-12 pr-4'} py-4 rounded-2xl border-2 border-brand-mint outline-none focus:border-brand-main text-lg font-bold`} value={globalSearch} onChange={(e) => onSearch(e.target.value)} />
          </div>
          <div className="space-y-3 min-h-[200px]">
            {searchLoading ? <div className="flex justify-center py-10"><Loader2 className="animate-spin text-brand-main" /></div> : searchResults.length > 0 ? searchResults.map((user: any) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-brand-grey/50 rounded-2xl border border-transparent hover:border-brand-main transition-all">
                <div className="flex items-center gap-3">
                  <img src={user.avatar_url} className="w-10 h-10 rounded-full border border-brand-mint" alt="" />
                  <div><p className="font-bold text-brand-dark leading-tight">{user.first_name} {user.last_name}</p><p className="text-xs text-brand-charcoal/50 font-medium">{user.email}</p></div>
                </div>
                <button onClick={() => onAdd(user.id)} className="bg-brand-main text-white px-4 py-2 rounded-xl text-sm font-black hover:bg-brand-dark cursor-pointer shadow-sm">{t.admin.operators.modal.add}</button>
              </div>
            )) : globalSearch.length > 1 ? (
              <p className="text-center py-10 text-brand-charcoal/40 font-bold">{t.admin.operators.modal.noResults}</p>
            ) : (
              <p className="text-center py-10 text-brand-charcoal/40 text-sm italic font-medium">{t.admin.operators.modal.typeToSearch}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}