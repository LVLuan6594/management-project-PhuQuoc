'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/app/auth-provider'

const PUBLIC_ROUTES = ['/login']

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, pathname, router])

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4 animate-pulse">
            <div className="w-6 h-6 bg-primary rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated (except on public routes)
  if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
    return null
  }

  return <>{children}</>
}
