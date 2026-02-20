'use client'

import React, { useState, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { 
  Home, Heart, LogOut, ChevronLeft, ChevronRight,
  PlusCircle, LayoutDashboard, Users, Menu, X, Store
} from 'lucide-react';
import { useAuth } from '@/hooks';
import { useRouter } from 'next/navigation';
import { useProfile } from '@/hooks/queries';

interface RootLayoutProps { children: ReactNode; }

export default function RootLayout({ children }: RootLayoutProps) {
  const t = useTranslations('Layout');
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const pathname = usePathname();
  
  const { user, signOut } = useAuth(); 
  const { data: profile } = useProfile(); 
  const isActive = (path: string) => pathname.startsWith(path);

  const handleBottomButton = async () => {
    user ? await signOut() : router.replace('/login');
  };
  console.log(profile?.role)

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans overflow-hidden">
      
      {/* --- SIDEBAR (Desktop) --- */}
      {/* flex-none y shrink-0 aseguran que el ancho sea inamovible */}
      <aside className={`
        hidden md:flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ease-in-out sticky top-0 h-screen z-50
        ${isExpanded ? 'w-64' : 'w-20'}
        flex-none shrink-0 overflow-x-hidden
      `}>
        <div className="h-20 flex items-center px-6 mb-4 relative shrink-0">
          <div className="flex items-center min-w-0">
            <div className="relative min-w-[32px] h-8 shrink-0">
              <Image src="/nc-logo.png" alt="Logo" fill className="object-contain" priority />
            </div>
            <span className={`
              ml-3 font-black text-xl tracking-tighter text-primary-blue transition-all duration-300 whitespace-nowrap
              ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}>
              NEWCUSCATLÁN
            </span>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-full p-1 hover:text-primary-blue shadow-sm z-50"
          >
            {isExpanded ? <ChevronLeft size={14}/> : <ChevronRight size={14}/>}
          </button>
        </div>

        <nav className="flex-grow px-4 space-y-6 overflow-y-auto scrollbar-hide">
          {profile?.role === 'admin' && (
            <div className="space-y-1">
              {isExpanded && <p className="px-4 text-[10px] font-black text-red-500 uppercase tracking-widest mb-2">{t('sections.admin')}</p>}
              {/* <NavItem icon={<LayoutDashboard size={22}/>} label={t('menu.dashboard')} href="/admin" expanded={isExpanded} active={isActive('/admin')} /> */}
              <NavItem icon={<Users size={22}/>} label={t('menu.users')} href="/users" expanded={isExpanded} active={isActive('/users')} />
            </div>
          )}

          {(profile?.role === 'admin' || profile?.role === 'publisher') && (
            <div className="space-y-1">
              {isExpanded && <p className="px-4 text-[10px] font-black text-amber-500 uppercase tracking-widest mb-2">{t('sections.publisher')}</p>}
              {/* <NavItem icon={<Store size={22}/>} label={t('menu.myProperties')} href="/my-properties" expanded={isExpanded} active={isActive('/my-properties')} /> */}
              <NavItem icon={<PlusCircle size={22}/>} label={t('menu.publish')} href="/publish" expanded={isExpanded} active={isActive('/publish')} />
            </div>
          )}

          <div className="space-y-1">
            {isExpanded && <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">{t('sections.explore')}</p>}
            <NavItem icon={<Home size={22}/>} label={t('menu.properties')} href="/properties" expanded={isExpanded} active={isActive('/properties')} />
            {/* <NavItem icon={<Heart size={22}/>} label={t('menu.favorites')} href="/favorites" expanded={isExpanded} active={isActive('/favorites')} /> */}
          </div>
        </nav>

        <div className="p-4 border-t border-gray-100 shrink-0">
          <button
            onClick={handleBottomButton}
            className="flex items-center gap-4 w-full px-4 py-3 text-gray-400 hover:text-red-500 transition-colors"
          >
            <LogOut size={22} className="shrink-0" />
            <span className={`text-xs font-black uppercase tracking-widest whitespace-nowrap transition-opacity duration-300 ${isExpanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
              {user ? t('menu.logout') : t('menu.login')}
            </span>
          </button>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      {/* flex-1 y min-w-0 permiten que el contenido se ajuste sin empujar al sidebar */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="md:hidden flex justify-between items-center p-4 bg-white border-b border-gray-200 shrink-0">
          <div className="relative w-8 h-8">
             <Image src="/nc-logo.png" alt="Logo" fill className="object-contain" />
          </div>
          <button onClick={() => setIsDrawerOpen(true)} className="p-2 text-primary-blue bg-blue-50 rounded-xl">
            <Menu size={24}/>
          </button>
        </header>
        
        <main className="flex-1 p-4 md:p-8 overflow-y-auto min-w-0 bg-gray-50/50">
          <div className="max-w-[1600px] mx-auto w-full">
            {children}
          </div>
        </main>
      </div>

      {/* --- MOBILE DRAWER --- */}
      {isDrawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-[100] backdrop-blur-sm" onClick={() => setIsDrawerOpen(false)} />
          <div className="fixed inset-y-0 right-0 w-[85%] bg-white z-[110] p-6 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex justify-between items-center mb-8 shrink-0">
              <span className="font-black text-primary-blue tracking-tighter text-xl">{t('menu.mobileTitle')}</span>
              <button onClick={() => setIsDrawerOpen(false)} className="p-2 bg-gray-100 rounded-full"><X size={24}/></button>
            </div>
            
            <nav className="flex-grow space-y-8 overflow-y-auto pr-2 scrollbar-hide">
              {profile?.role === 'admin' && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-red-500 uppercase tracking-widest px-2">{t('sections.admin')}</p>
                  {/* <MobileItem label={t('menu.dashboard')} href="/admin" active={isActive('/admin')} onClick={() => setIsDrawerOpen(false)} /> */}
                  <MobileItem label={t('menu.users')} href="/users" active={isActive('/users')} onClick={() => setIsDrawerOpen(false)} />
                </div>
              )}

              {(profile?.role === 'admin' || profile?.role === 'publisher') && (
                <div className="space-y-3">
                  <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest px-2">{t('sections.publisher')}</p>
                  <MobileItem label={t('menu.myProperties')} href="/my-properties" active={isActive('/my-properties')} onClick={() => setIsDrawerOpen(false)} />
                  {/* <MobileItem label={t('menu.publish')} href="/publish" active={isActive('/publish')} onClick={() => setIsDrawerOpen(false)} /> */}
                </div>
              )}

              <div className="space-y-3">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">{t('sections.explore')}</p>
                <MobileItem label={t('menu.properties')} href="/properties" active={isActive('/properties')} onClick={() => setIsDrawerOpen(false)} />
                {/* <MobileItem label={t('menu.favorites')} href="/favorites" active={isActive('/favorites')} onClick={() => setIsDrawerOpen(false)} /> */}
              </div>
            </nav>

            <div className="mt-auto pt-6 border-t border-gray-100">
              <button
                onClick={handleBottomButton}
                className="w-full py-4 bg-primary-blue text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-blue-100"
              >
                {user ? t('menu.logout') : t('menu.login')}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function NavItem({ icon, label, href, expanded, active }: any) {
  return (
    <Link href={href} className={`flex items-center px-4 py-3 rounded-xl transition-all group overflow-hidden ${active ? 'bg-primary-blue text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-gray-50'}`}>
      <span className="min-w-[22px] flex shrink-0">{icon}</span>
      <span className={`ml-4 text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${expanded ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        {label}
      </span>
    </Link>
  );
}

function MobileItem({ label, href, active, onClick }: any) {
  return (
    <Link 
      href={href} 
      onClick={onClick} 
      className={`block w-full px-5 py-4 rounded-2xl font-bold text-sm transition-all ${active ? 'bg-primary-blue text-white shadow-md' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
    >
      {label}
    </Link>
  );
}