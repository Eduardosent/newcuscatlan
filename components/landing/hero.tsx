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
        <div className="text-center mb-6">
          <h1 className="text-white text-5xl md:text-7xl font-extrabold tracking-tight drop-shadow-2xl">
            {t('title')}
          </h1>
          <p className="text-white/90 text-xl md:text-2xl mt-6 font-light max-w-3xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Tags Traducidas */}
        <div className="mt-12 flex flex-wrap justify-center gap-4 text-white/80 text-sm font-medium">
          <span className="bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
            #{t('tags.houses')}
          </span>
          <span className="bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
            #{t('tags.apartments')}
          </span>
          <span className="bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 shadow-sm">
            #{t('tags.lands')}
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;