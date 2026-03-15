import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/app/auth-provider"
import { ProtectedRoute } from "@/app/protected-route"
import "./globals.css"

export const metadata: Metadata = {
  title: "Quản lý Dự án - Phú Quốc",
  description: "Created with Le Vu Luan",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="antialiased">
      <body>
        <AuthProvider>
          <ProtectedRoute>
            {children}
          </ProtectedRoute>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}