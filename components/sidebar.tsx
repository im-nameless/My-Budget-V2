"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { DollarSign, Home, Plus, History, User, LogOut, Menu, Languages, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage, LanguageToggle } from "@/components/language-toggle"
import { CurrencyToggle } from "@/components/currency-toggle"
import { ThemeToggle } from "@/components/theme-toggle"

const navigation = [
  { name: "dashboard.title", href: "/", icon: Home },
  { name: "header.addTransaction", href: "/add-transaction", icon: Plus },
  { name: "transactions.title", href: "/transactions", icon: History },
  { name: "profile.title", href: "/profile", icon: User },
]

interface SidebarProps {
  children: React.ReactNode
}

export function Sidebar({ children }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { t } = useLanguage()

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-mustard rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-black" />
          </div>
          <span className="text-xl font-bold">{t("app.title")}</span>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user?.profilePicture || "/placeholder.svg"} alt={user?.name} />
            <AvatarFallback className="bg-mustard text-black">{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive ? "bg-mustard text-black" : "text-muted-foreground hover:text-foreground hover:bg-muted",
              )}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {t(item.name)}
            </Link>
          )
        })}
      </nav>

      {/* Settings Section */}
      <div className="p-4 border-t border-border">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{t("sidebar.preferences")}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Languages className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{t("sidebar.language")}</span>
            </div>
            <LanguageToggle />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{t("sidebar.currency")}</span>
            </div>
            <CurrencyToggle />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{t("sidebar.theme")}</span>
            </div>
            <ThemeToggle />
          </div>

          <Separator />

          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="mr-3 h-4 w-4" />
            {t("sidebar.logout")}
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 bg-card border-r border-border">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-border bg-card">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-mustard rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-black" />
            </div>
            <span className="text-xl font-bold">{t("app.title")}</span>
          </div>

          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.profilePicture || "/placeholder.svg"} alt={user?.name} />
            <AvatarFallback className="bg-mustard text-black text-sm">
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
