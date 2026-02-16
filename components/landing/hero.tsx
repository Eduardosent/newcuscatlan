'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

export const Hero = () => {
  // Accedemos a las traducciones del Hero
  const t = useTranslations('Landing.Hero');

  return (
    <section className="relative w-full min-h-[600px] overflow-hidden flex items-center justify-center py-20 md:py-32">
      
      {/* 1. Video de Fondo */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 w-full h-full object-cover"
      >
        <source src="/hero.mp4" type="video/mp4" />
      </video>

      {/* 2. Overlay Gradiente */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-black/60"></div>

      {/* 3. Contenido Principal */}
      <div className="relative z-20 w-full max-w-5xl px-6 pt-4">
        <div className="text-center mb-10">
          <h1 className="text-white text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-2xl">
            {t('title')}
          </h1>
          <p className="text-white/90 text-xl md:text-2xl mt-4 font-light">
            {t('subtitle')}
          </p>
        </div>

        {/* Buscador */}
        <div className="bg-white/10 backdrop-blur-xl p-2 rounded-3xl border border-white/30 shadow-2xl mx-auto max-w-4xl">
          <div className="flex flex-col md:flex-row items-center gap-2">
            
            <div className="relative w-full">
               <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                 <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                 </svg>
               </div>
               <input 
                 type="text" 
                 placeholder={t('searchPlaceholder')} 
                 className="w-full pl-12 pr-4 py-5 rounded-2xl bg-white text-gray-800 text-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
               />
            </div>

            <button className="w-full md:w-auto bg-[#0047AB] hover:bg-blue-600 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all active:scale-95 shadow-lg">
                {t('searchButton')}
            </button>
          </div>
        </div>

        {/* Tags Traducidas */}
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-white/70 text-sm font-medium">
          <span className="bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
            #{t('tags.houses')}
          </span>
          <span className="bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
            #{t('tags.apartments')}
          </span>
          <span className="bg-black/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
            #{t('tags.lands')}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;