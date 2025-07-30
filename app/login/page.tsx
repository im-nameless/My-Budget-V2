"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, Mail, Lock, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/components/language-toggle"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")

  const { login, isLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError(t("login.fillAllFields"))
      return
    }

    const success = await login(email, password)

    if (success) {
      router.push("/")
    } else {
      setError(t("login.invalidCredentials"))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mustard-dark/5 to-mustard-dark/10 p-4">
      <div className="w-full max-w-md space-y-6">
        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-mustard rounded-full flex items-center justify-center mb-4">
              <LogIn className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">{t("login.welcome")}</CardTitle>
            <CardDescription className="text-muted-foreground">{t("login.signInToContinue")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="danger">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t("login.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("login.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t("login.password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("login.passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-mustard hover:bg-mustard/90 text-white" disabled={isLoading}>
                {isLoading ? t("login.signingIn") : t("login.signIn")}
              </Button>
            </form>

            {/* Registration Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t("login.dontHaveAccount")}{" "}
                <Link href="/register" className="font-medium text-mustard hover:underline">
                  {t("login.createAccount")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Demo Credentials */}
        <Card className="border-0 bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-medium text-sm mb-3">{t("login.demoCredentials")}</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div>
                <strong>English:</strong> john@example.com / password123
              </div>
              <div>
                <strong>Português:</strong> maria@example.com / senha123
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
