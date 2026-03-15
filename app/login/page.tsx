'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { validateLogin } from '@/lib/auth'
import { useAuth } from '@/app/auth-provider'
import { Lock, Mail, Eye, EyeOff, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const result = validateLogin(username, password)

    if (result.success && result.user) {
      login(result.user)
      router.push('/')
    } else {
      setError(result.error || 'Đăng nhập thất bại')
    }

    setIsLoading(false)
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=900&fit=crop")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay sáng hơn để text readable */}
      <div className="absolute inset-0 bg-black/10 backdrop-blur-none" />
      {/* Overlay gradient nhẹ */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-sky-400/5" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-sky-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-sky-300/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-sky-400/30 backdrop-blur-md mb-4 border border-white/50">
            <Lock className="w-8 h-8 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-2">ĐĂNG NHẬP HỆ THỐNG</h1>
        </div>

        {/* Login Card with glassmorphism */}
        <Card className="bg-white/15 backdrop-blur-xl border border-white/30 shadow-2xl">
          <CardHeader>
            {/* <CardTitle className="text-white">Thông tin đăng nhập</CardTitle> */}
            {/* <CardDescription className="text-white/70">Nhập tài khoản admin để vào hệ thống</CardDescription> */}
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Alert */}
              {error && (
                <div className="flex gap-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg backdrop-blur">
                  <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              {/* Username Field */}
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-white">
                  Tên đăng nhập
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-white/50" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value)
                      setError('')
                    }}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white/50 focus:border-white/30 backdrop-blur"
                    disabled={isLoading}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-white/50" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value)
                      setError('')
                    }}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:ring-white/50 focus:border-white/30 backdrop-blur"
                    disabled={isLoading}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-white/50 hover:text-white"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-white hover:bg-white/90 text-black font-semibold h-10 shadow-lg"
                disabled={isLoading || !username || !password}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Đang đăng nhập...
                  </>
                ) : (
                  'Đăng nhập'
                )}
              </Button>

              {/* Demo Credentials Info
              <div className="pt-4 border-t border-white/10">
                <p className="text-xs text-white/70 mb-2 font-medium">Tài khoản demo:</p>
                <div className="space-y-1 text-xs text-white/60">
                  <p>
                    <span className="font-medium text-white/80">Tên:</span> admin
                  </p>
                  <p>
                    <span className="font-medium text-white/80">Mật khẩu:</span> admin@123
                  </p>
                </div>
              </div> */}
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-white/60">
            © 2026 Bản quyền thuộc về UBND Đặc khu Phú Quốc
          </p>
        </div>
      </div>
    </div>
  )
}
