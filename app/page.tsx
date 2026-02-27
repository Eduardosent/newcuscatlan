import { Footer, Hero, Navbar } from "@/components/landing";
import { supabase } from "@/config";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import router, { useRouter } from "next/router";
import { useEffect } from "react";

export default function Home() {
  return (
    <div className="bg-[#F8FAFC]">
      <Navbar/>
      <Hero/>
      <Footer/>
    </div>
  );
}
