"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, DollarSign, Loader2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle, useLanguage } from "@/components/language-toggle"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { login } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const success = await login(email, password)
      if (success) {
        router.push("/")
      } else {
        setError(t("login.invalidCredentials"))
      }
    } catch (err) {
      setError(t("login.loginError"))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Theme and Language toggles in top right */}
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-mustard rounded-lg flex items-center justify-center mx-auto mb-4">
            <DollarSign className="w-6 h-6 text-black" />
          </div>
          <CardTitle className="text-2xl font-bold">{t("login.welcome")}</CardTitle>
          <CardDescription>{t("login.signInToContinue")}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert className="border-destructive">
                <AlertDescription className="text-destructive">{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{t("login.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("login.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{t("login.password")}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("login.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-mustard hover:bg-mustard-dark text-black"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("login.signingIn")}
                </>
              ) : (
                t("login.signIn")
              )}
            </Button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg">
            <p className="text-sm font-medium text-muted-foreground mb-2">{t("login.demoCredentials")}:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>
                <strong>English:</strong> giovanni.teixeira@hotmail.com / senha123
              </p>
              <p>
                <strong>Português:</strong> maria@example.com / senha123
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
