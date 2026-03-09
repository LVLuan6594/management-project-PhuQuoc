import type { Metadata } from "next"
import { Analytics } from "@vercel/analytics/next"
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
        {children}
        <Analytics />
      </body>
    </html>
  )
}