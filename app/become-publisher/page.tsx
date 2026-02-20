'use client';

import Link from 'next/link';
import { MessageCircle, LogIn, ArrowLeft, ShieldCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function BecomePublisherPage() {
  const t = useTranslations('BecomePublisher');

  // Configuración de WhatsApp
  const WHATSAPP_NUMBER = "50370000000"; // Tu número de admin
  const message = "Hola, me interesa publicar mis propiedades en NewCuscatlan.com. ¿Me podrían ayudar a crear una cuenta de Publisher?";
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  return (
    <div className="min-h-screen bg-[#1D4ED8] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Círculos decorativos de fondo */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl" />

      {/* Botón Volver */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 text-white/80 hover:text-white flex items-center gap-2 transition-all z-10 font-bold"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Volver</span>
      </Link>

      <div className="max-w-5xl w-full z-10">
        <div className="text-center mb-10 text-white">
          <h1 className="text-4xl md:text-5xl font-black mb-4">¿Quieres publicar?</h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto italic">
            Para garantizar la seguridad de nuestra comunidad, solo usuarios verificados pueden subir propiedades.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          
          {/* OPCIÓN 1: YA ES PUBLISHER */}
          <div className="bg-white rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl transition-transform hover:scale-[1.02]">
            <div className="bg-blue-100 p-5 rounded-2xl text-[#1D4ED8] mb-6">
              <LogIn className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-4">Ya soy Publisher</h2>
            <p className="text-gray-500 mb-8 flex-grow">
              Si ya tienes una cuenta autorizada por nuestro equipo administrativo, inicia sesión para subir y gestionar tus inmuebles.
            </p>
            <Link 
              href="/login" 
              className="w-full py-5 bg-[#1D4ED8] text-white rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Ingresar al Panel
            </Link>
          </div>

          {/* OPCIÓN 2: SOLICITAR ACCESO */}
          <div className="bg-white rounded-3xl p-10 flex flex-col items-center text-center shadow-2xl transition-transform hover:scale-[1.02]">
            <div className="bg-green-100 p-5 rounded-2xl text-green-600 mb-6">
              <MessageCircle className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-black text-gray-800 mb-4">Solicitar Acceso</h2>
            <p className="text-gray-500 mb-8 flex-grow">
              ¿Eres dueño o agente y quieres publicar? Contáctanos vía WhatsApp para verificar tu identidad y promover tu perfil.
            </p>
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-5 bg-[#25D366] text-white rounded-2xl font-black hover:bg-green-600 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              Hablar con Admin
            </a>
          </div>

        </div>

        {/* Nota al pie */}
        <div className="mt-12 flex items-center justify-center gap-2 text-white/70 text-sm font-medium">
          <ShieldCheck className="w-4 h-4" />
          <span>Tu cuenta pasará de "Client" a "Publisher" tras la verificación.</span>
        </div>
      </div>
    </div>
  );
}