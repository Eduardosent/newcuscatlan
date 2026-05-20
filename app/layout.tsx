import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl'
import { Geist, Geist_Mono, Inter, Poppins, Montserrat, Roboto } from "next/font/google";
import { getUserLocale, getAppMessages } from '@/config/locale'
import { AuthProvider, ReactQueryProvider } from "@/providers";
import { Toaster } from "sonner";
import "./globals.css";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const roboto = Roboto({ subsets: ['latin'], weight: ['400','500','700'] });
// const montserrat = Montserrat({ subsets: ['latin'], weight: ['600','700','800'] });
const poppins = Poppins({ subsets: ['latin'], weight: ['400','500','600','700','800'] });
// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  // Título: Enfocado en la venta de propiedades, el sector inmobiliario y la ubicación clave en El Salvador
  title: "New Cuscatlan | Venta de Propiedades y Bienes Raíces en El Salvador",
  
  // Descripción: Ataca directamente la venta de terrenos, casas y proyectos residenciales en la zona de Nuevo Cuscatlán
  description: "Venta de propiedades exclusivas, casas y terrenos en Nuevo Cuscatlán, El Salvador. Encuentra las mejores opciones de bienes raíces para invertir o vivir.",
  
  // Palabras clave estratégicas para indexar rápido en el nicho inmobiliario local
  keywords: [
    "New Cuscatlan propiedades",
    "Venta de casas en Nuevo Cuscatlan",
    "Terrenos en Nuevo Cuscatlán El Salvador",
    "Bienes raíces El Salvador",
    "Inmobiliaria Nuevo Cuscatlan",
    "Comprar casa en El Salvador",
    "Proyectos residenciales El Salvador"
  ],

  // Open Graph optimizado para que al compartir el link en redes se vea profesional y comercial
  openGraph: {
    title: "New Cuscatlan | Venta de Propiedades y Bienes Raíces",
    description: "Explora la venta de casas, terrenos y propiedades exclusivas en Nuevo Cuscatlán, El Salvador.",
    url: "https://newcuscatlan.com",
    siteName: "New Cuscatlan",
    locale: "es_SV",
    type: "website",
    images: [
      {
        url: "/nc-logo.png", 
        width: 500,
        height: 500,
        alt: "New Cuscatlan - Bienes Raíces en El Salvador",
      },
    ],
  },

  // Twitter Card para asegurar el renderizado correcto en plataformas sociales
  twitter: {
    card: "summary_large_image",
    title: "New Cuscatlan | Bienes Raíces en El Salvador",
    description: "Venta de casas y terrenos en la zona con mayor plusvalía de Nuevo Cuscatlán.",
    images: ["/nc-logo.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const locale = await getUserLocale();
  const messages = await getAppMessages(locale);
  return (
    <html lang={locale}>
      <body
        className={`${poppins.className} antialiased !bg-[#F8FAFC]`}
      >
        <ReactQueryProvider>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </AuthProvider>
        </NextIntlClientProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
