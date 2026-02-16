'use client'

import { useState, useEffect } from 'react'
import { getCookie, setCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { LANGUAGES, LanguageCode } from '@/constants/languages'

export const LanguageSwitch = () => {
  const router = useRouter()
  const [currentLang, setCurrentLang] = useState<LanguageCode>('es')

  // 1. Sincronizar el estado inicial con la cookie al montar el componente
  useEffect(() => {
    const saved = getCookie('NEXT_LOCALE') as LanguageCode
    if (saved && LANGUAGES.some(l => l.code === saved)) {
      setCurrentLang(saved)
    }
  }, [])

  const toggleLanguage = () => {
    // Definimos el siguiente idioma
    const nextLang: LanguageCode = currentLang === 'es' ? 'en' : 'es'
    
    // 1. Guardamos en la cookie (como en tu ejemplo)
    setCookie('NEXT_LOCALE', nextLang, { maxAge: 60 * 60 * 24 * 365 })
    
    // 2. Actualizamos el estado local para la animación
    setCurrentLang(nextLang)
    
    // 3. Refrescamos para que el servidor aplique los cambios de i18n
    router.refresh()
  }

  const isEnglish = currentLang === 'en'

  return (
    <div className="flex items-center">
      <button 
        onClick={toggleLanguage}
        className="relative w-14 h-7 flex items-center bg-white/20 backdrop-blur-md rounded-full px-1 border border-white/30 transition-all duration-300 hover:bg-white/30 active:scale-95"
      >
        {/* Textos de fondo (Visual) */}
        <div className="absolute inset-0 flex justify-between items-center px-2 text-[10px] font-black text-white uppercase select-none pointer-events-none">
          <span className={isEnglish ? 'opacity-100' : 'opacity-30'}>en</span>
          <span className={!isEnglish ? 'opacity-100' : 'opacity-30'}>es</span>
        </div>

        {/* Círculo deslizante */}
        <div 
          className={`bg-white w-5 h-5 rounded-full shadow-[0_0_10px_rgba(0,0,0,0.2)] transform transition-transform duration-300 ease-in-out ${
            isEnglish ? 'translate-x-0' : 'translate-x-7'
          }`}
        />
      </button>
    </div>
  )
}