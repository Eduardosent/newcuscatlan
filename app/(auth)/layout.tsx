'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-50 relative overflow-hidden">
      
      {/* Fondo decorativo superior */}
      <div className="absolute top-0 left-0 w-full h-[40vh] bg-primary-blue z-0" />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Branding */}
        <div className="flex justify-center mt-8 mb-10">
          <Link href="/">
            <Image 
              src="/nc-logo-white.png" 
              alt="New Cuscatlan" 
              width={120} 
              height={80} 
              priority 
              unoptimized
            />
          </Link>
        </div>
        {children}

        {/* Footer legal */}
        <div className="mt-10 text-center">
          <p className="text-grey text-[10px] font-bold uppercase tracking-[0.3em]">
            New Cuscatlán Real Estate © 2026
          </p>
        </div>
      </div>
    </main>
  );
}