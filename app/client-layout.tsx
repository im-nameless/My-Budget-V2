"use client"

import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { CurrencyProvider } from "@/components/currency-toggle"
import { LanguageProvider } from "@/components/language-toggle"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { Sidebar } from "@/components/sidebar"
import { usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

function AppContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-mustard" />
          <span className="text-lg">Loading...</span>
        </div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!user && !isLoginPage) {
    return children // This will redirect to login in the middleware
  }

  // Show login page without sidebar
  if (isLoginPage) {
    return children
  }

  // Show app with sidebar for authenticated users
  return <Sidebar>{children}</Sidebar>
}

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <AuthProvider>
          <AppContent>{children}</AppContent>
        </AuthProvider>
      </CurrencyProvider>
    </LanguageProvider>
  )
}
