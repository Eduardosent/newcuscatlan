import Image from "next/image"
import { useAuth } from "@/hooks"

export const GoogleButton = () => {
  const { signInWithGoogle } = useAuth()

  return (
    <div className="w-full">
      <button 
        type="button" 
        onClick={() => signInWithGoogle()}
        className="cursor-pointer group relative flex w-full items-center justify-center gap-3 rounded-xl bg-[#18181B] px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#27272A] active:scale-[0.98] border border-white/10"
      >
        {/* Contenedor del logo para asegurar que no herede fondos extraños */}
        <div className="flex h-5 w-5 items-center justify-center bg-transparent">
          <Image 
            src="/google-logo.png" 
            alt="Google" 
            width={20} 
            height={20} 
            priority
            className="object-contain mix-blend-normal" 
          />
        </div>
        <span>Continuar con Google</span>
      </button>
    </div>
  )
}