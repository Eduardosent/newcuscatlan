'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react'; // Importamos X para cerrar
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { LanguageSwitch } from '../ui';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations('Landing.Navbar');

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#1D4ED8] shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo a la izquierda */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" onClick={() => setIsOpen(false)}>
              <Image 
                src="/nc-logo-white.png" 
                alt="new cuscatlan logo"
                width={80} 
                height={60}
                className="bg-transparent"
                priority
                unoptimized 
              />
            </Link>
          </div>

          {/* Enlaces Centrales - Desktop */}
          <div className="hidden md:flex space-x-10 items-center">
            <Link href="/venta" className="text-[#F8FAFC] hover:text-[#D4AF37] font-bold transition-all">
              {t('sale')}
            </Link>
            <Link href="/alquilar" className="text-[#F8FAFC] hover:text-[#D4AF37] font-bold transition-all">
              {t('rent')}
            </Link>
          </div>

          {/* Botones de Acción y Switch de Idioma */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            
            <LanguageSwitch />

            {/* Botón Publicar Propiedad - Visible en Desktop */}
            <Link 
              href="/my-properties" 
              className="hidden md:block bg-[#F8FAFC] text-[#1D4ED8] w-[150px] text-center py-2.5 rounded-lg text-sm font-bold hover:bg-[#D4AF37] hover:text-white transition-all duration-300 shadow-md"
            >
              {t('postProperty')}
            </Link>

            {/* Menú Móvil - Botón Hamburguesa */}
            <button 
              onClick={() => setIsOpen(!isOpen)} 
              className="md:hidden p-2 text-[#F8FAFC]"
            >
              {isOpen ? <X className="w-8 h-8" /> : <Menu className="w-8 h-8" />}
            </button>
          </div>
        </div>
      </div>

      {/* Panel Móvil Desplegable */}
      <div className={`
        md:hidden fixed left-0 w-full bg-[#1D4ED8] transition-all duration-300 ease-in-out border-t border-white/10
        ${isOpen ? 'top-20 opacity-100 visible' : 'top-[-100%] opacity-0 invisible'}
      `}>
        <div className="flex flex-col p-6 space-y-6">
          <Link 
            href="/venta" 
            onClick={() => setIsOpen(false)}
            className="text-[#F8FAFC] text-lg font-bold border-b border-white/5 pb-2"
          >
            {t('sale')}
          </Link>
          <Link 
            href="/alquilar" 
            onClick={() => setIsOpen(false)}
            className="text-[#F8FAFC] text-lg font-bold border-b border-white/5 pb-2"
          >
            {t('rent')}
          </Link>
          <Link 
            href="/my-properties" 
            onClick={() => setIsOpen(false)}
            className="bg-[#F8FAFC] text-[#1D4ED8] w-full text-center py-4 rounded-lg font-black"
          >
            {t('postProperty')}
          </Link>
        </div>
      </div>
    </nav>
  );
};