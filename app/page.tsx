import { Footer, Hero, Navbar } from "@/components/landing";
import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-[#F8FAFC]">
      <Navbar/>
      <Hero/>
      <Footer/>
    </div>
  );
}
