import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function proxy(req: NextRequest) {
  let res = NextResponse.next({
    request: { headers: req.headers },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value))
          res = NextResponse.next({ request: req })
          cookiesToSet.forEach(({ name, value, options }) =>
            res.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  
  const isAuthPage = req.nextUrl.pathname.startsWith('/login')
  // Agregamos /my-properties como la ruta base a proteger
  const isAdminPage = req.nextUrl.pathname.startsWith('/my-properties')

  // 1. Si está logueado e intenta ir al Login -> Al listado de sus propiedades
  if (session && isAuthPage) {
    return NextResponse.redirect(new URL('/my-properties', req.url))
  }

  // 2. Si NO está logueado e intenta ir a sus propiedades -> Al login
  if (!session && isAdminPage) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

// El matcher debe estar pendiente de /my-properties
export const config = {
  matcher: ['/my-properties/:path*', '/login'],
}