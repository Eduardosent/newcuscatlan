'use client'

import { useState } from 'react'
import { Link, Check } from 'lucide-react'
import { APP_URL } from '@/config'

export const CopyLinkButton = ({ id }: { id: string }) => {
  const [copied, setCopied] = useState(false)
  const shareUrl = `${APP_URL}/properties/${id}`

  const handleCopy = async () => {
    if (copied) return
    
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error al copiar:', err)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 border font-bold text-sm
        ${copied 
          ? 'bg-green-50 border-green-200 text-green-600' 
          : 'bg-blue-50/50 border-blue-100 text-blue-600 hover:bg-blue-50 hover:border-blue-200 shadow-sm'
        }
      `}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 animate-in zoom-in duration-300" />
          <span>¡Enlace copiado!</span>
        </>
      ) : (
        <>
          <Link className="w-4 h-4" />
          <span>Copiar enlace</span>
        </>
      )}
    </button>
  )
}