"use client"

import { Footer, Hero, Navbar } from "@/components/landing";
import { supabase } from "@/config";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import router, { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
      const router = useRouter();
    const queryClient = useQueryClient();
      useEffect(() => {
          const exchangeCode = async () => {
              const searchParams = new URLSearchParams(window.location.search);
              const code = searchParams.get('code');
              router.replace('/properties');
  
              if (code) {
                  const { data, error } = await supabase.auth.exchangeCodeForSession(code);               
                  if (error || !data.user) {
                      return router.replace('/login?error=auth_failed');
                  }
                  try {
                      router.replace('/properties');
                  } catch (err) {
                      router.replace('/properties');
                  }
              } else {
                  router.replace('/login');
              }
          };
  
          exchangeCode();
      }, [router, queryClient]);
  return (
    <div className="bg-[#F8FAFC]">
      <Navbar/>
      <Hero/>
      <Footer/>
    </div>
  );
}
