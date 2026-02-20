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
  title: "NewCuscatlan.com",
  description: "Find properties",
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
