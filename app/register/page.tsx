"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Eye, EyeOff, User, Mail, Lock, ArrowLeft, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/components/language-toggle"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [phone, setPhone] = useState("")
  const [birthdate, setBirthdate] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const { register, isLoading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (!name.trim()) {
      errors.name = t("register.nameRequired")
    } else if (name.trim().length < 2) {
      errors.name = t("register.nameMinLength")
    }

    if (!email.trim()) {
      errors.email = t("register.emailRequired")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = t("register.emailInvalid")
    }

    if (!password) {
      errors.password = t("register.passwordRequired")
    } else if (password.length < 6) {
      errors.password = t("register.passwordMinLength")
    }

    if (!confirmPassword) {
      errors.confirmPassword = t("register.confirmPasswordRequired")
    } else if (password !== confirmPassword) {
      errors.confirmPassword = t("register.passwordMismatch")
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    const result = await register(name.trim(), email.trim(), password)

    if (result.success) {
      router.push("/")
    } else {
      setError(result.error || t("register.registrationError"))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-mustard/5 to-mustard/10 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Login Link */}
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("register.backToLogin")}
        </Link>

        <Card className="border-0 shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <div className="mx-auto w-12 h-12 bg-mustard rounded-full flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold">{t("register.createAccount")}</CardTitle>
            <CardDescription className="text-muted-foreground">
              {t("register.createAccountDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="name">{t("register.fullName")}</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    type="text"
                    placeholder={t("register.namePlaceholder")}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`pl-10 ${validationErrors.name ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {validationErrors.name && <p className="text-sm text-red-500">{validationErrors.name}</p>}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">{t("register.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder={t("register.emailPlaceholder")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 ${validationErrors.email ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {validationErrors.email && <p className="text-sm text-red-500">{validationErrors.email}</p>}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">{t("register.phone")}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder={t("register.phonePlaceholder")}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={`pl-10 ${validationErrors.phone ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                </div>
                {validationErrors.phone && <p className="text-sm text-red-500">{validationErrors.phone}</p>}
              </div>

              {/* Birthdate */}
              <div className="space-y-2">
                <Label htmlFor="birthdate">{t("register.birthdate")}</Label>
                <div className="relative">
                  <Input
                    id="birthdate"
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {validationErrors.birthdate && <p className="text-sm text-red-500">{validationErrors.birthdate}</p>}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">{t("register.password")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={t("register.passwordPlaceholder")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`pl-10 pr-10 ${validationErrors.password ? "border-red-500" : ""}`}
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
                {validationErrors.password && <p className="text-sm text-red-500">{validationErrors.password}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("register.confirmPassword")}</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder={t("register.confirmPasswordPlaceholder")}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 ${validationErrors.confirmPassword ? "border-red-500" : ""}`}
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="text-sm text-red-500">{validationErrors.confirmPassword}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full bg-mustard hover:bg-mustard/90 text-white" disabled={isLoading}>
                {isLoading ? t("register.creatingAccount") : t("register.createAccount")}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {t("register.alreadyHaveAccount")}{" "}
                <Link href="/login" className="font-medium text-mustard hover:underline">
                  {t("register.signIn")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Password Requirements */}
        <Card className="border-0 bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-medium text-sm mb-3">{t("register.passwordRequirements")}</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li className="flex items-center">
                <div
                  className={`w-1.5 h-1.5 rounded-full mr-2 ${password.length >= 6 ? "bg-green-500" : "bg-muted-foreground"}`}
                />
                {t("register.passwordMinLengthReq")}
              </li>
              <li className="flex items-center">
                <div
                  className={`w-1.5 h-1.5 rounded-full mr-2 ${password === confirmPassword && password.length > 0 ? "bg-green-500" : "bg-muted-foreground"}`}
                />
                {t("register.passwordMatchReq")}
              </li>
              <li className="flex items-center">
                <div
                  className={`w-1.5 h-1.5 rounded-full mr-2 ${/[!@#$%^&*(),.?":{}|<>]/.test(password) && /\d/.test(password) && /[A-Z]/.test(password) ? "bg-green-500" : "bg-muted-foreground"}`}
                />
                {t("register.passwordSpecialCharacters")}
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
