import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import { useTranslations } from 'next-intl';

export const Footer = () => {
  const t = useTranslations('Landing.Footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#1D4ED8] text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-white/10 pb-10">
          
          {/* Parte Izquierda: Logo y Slogan */}
          <div className="flex flex-col space-y-4">
            <Link href="/">
              <Image 
                src="/nc-logo-white.png" 
                alt="New Cuscatlan Logo"
                width={100} 
                height={75}
                priority
                unoptimized
                className="bg-transparent"
              />
            </Link>
            <p className="text-blue-100 text-sm max-w-xs font-medium">
              {t("slogan")}
            </p>
          </div>

          {/* Parte Derecha: Redes Sociales */}
          <div className="flex flex-col space-y-4">
            <h3 className="text-lg font-bold">{t("socialTitle")}</h3>
            <div className="flex space-x-5">
              <Link href="#" className="hover:text-[#D4AF37] transition-colors">
                <Facebook className="w-6 h-6" />
              </Link>
              <Link href="#" className="hover:text-[#D4AF37] transition-colors">
                <Instagram className="w-6 h-6" />
              </Link>
              <Link href="#" className="hover:text-[#D4AF37] transition-colors">
                <Twitter className="w-6 h-6" />
              </Link>
              <Link href="#" className="hover:text-[#D4AF37] transition-colors">
                <Linkedin className="w-6 h-6" />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-sm text-blue-200/70">
          <p>© {currentYear} {t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
};