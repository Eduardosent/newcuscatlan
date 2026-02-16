'use server'

import { cookies, headers } from 'next/headers'
import fs from 'fs'
import path from 'path'

// Idiomas disponibles leyendo automáticamente /messages
const MESSAGES_DIR = path.join(process.cwd(), 'messages')
const AVAILABLE_LOCALES = fs.readdirSync(MESSAGES_DIR)
  .map(file => file.replace('.json', '').toLowerCase())

const DEFAULT_LOCALE = 'en'

export async function getUserLocale() {
  // 1. Cookie
  const cookieStore = await cookies()
  const saved = cookieStore.get('NEXT_LOCALE')?.value
  if (saved && AVAILABLE_LOCALES.includes(saved)) {
    return saved
  }

  // 2. Header accept-language
  const h = await headers()
  const accept = h.get('accept-language')

  if (accept) {
    // “es-ES,es;q=0.9,en-US;q=0.8,fr;q=0.7”
    const parts = accept.split(',')

    for (const p of parts) {
      const lang = p.split(';')[0].trim().toLowerCase()

      // lang → "es-es" → base "es"
      const base = lang.split('-')[0]

      // Si coincide idioma completo:
      if (AVAILABLE_LOCALES.includes(lang)) return lang

      // Si coincide idioma base:
      if (AVAILABLE_LOCALES.includes(base)) return base
    }
  }

  // 3. Fallback final
  return DEFAULT_LOCALE
}

export async function getAppMessages(locale: string) {
  try {
    return (await import(`../messages/${locale}.json`)).default
  } catch {
    return (await import(`../messages/${DEFAULT_LOCALE}.json`)).default
  }
}
