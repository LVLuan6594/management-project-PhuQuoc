'use client'

import { useAuth } from '@/app/auth-provider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LogOut, User } from 'lucide-react'

export function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  if (!user) return null

  return (
    <div className="fixed top-0 right-0 p-4 flex items-center gap-3 z-40">
      <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg">
        <User size={16} className="text-secondary-foreground" />
        <span className="text-sm font-medium text-secondary-foreground capitalize">
          {user.username}
        </span>
      </div>
      <Button
        onClick={handleLogout}
        variant="outline"
        size="sm"
        className="gap-2 border-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive"
      >
        <LogOut size={16} />
        Đăng xuất
      </Button>
    </div>
  )
}
