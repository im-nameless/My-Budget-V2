"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Loader2, User, Calendar, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/components/language-toggle"
import { format } from "date-fns"

export default function ProfilePage() {
  const { user, updateProfile, isLoading } = useAuth()
  const { t } = useLanguage()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setMessage({ type: "error", text: t("profile.invalidFileType") })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: "error", text: t("profile.fileTooLarge") })
      return
    }

    try {
      // Convert to base64 for demo purposes
      const reader = new FileReader()
      reader.onload = async (event) => {
        const imageUrl = event.target?.result as string
        const success = await updateProfile({ profilePicture: imageUrl })
        if (success) {
          setMessage({ type: "success", text: t("profile.pictureUpdated") })
        } else {
          setMessage({ type: "error", text: t("profile.updateError") })
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      setMessage({ type: "error", text: t("profile.uploadError") })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      const success = await updateProfile(formData)
      if (success) {
        setMessage({ type: "success", text: t("profile.profileUpdated") })
      } else {
        setMessage({ type: "error", text: t("profile.updateError") })
      }
    } catch (error) {
      setMessage({ type: "error", text: t("profile.updateError") })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("profile.title")}</h1>
        <p className="text-muted-foreground">{t("profile.description")}</p>
      </div>

      {message && (
        <Alert className={`mb-6 ${message.type === "error" ? "border-destructive" : "border-mustard"}`}>
          <AlertDescription className={message.type === "error" ? "text-destructive" : "text-mustard"}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {/* Profile Picture */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Camera className="w-5 h-5" />
              <span>{t("profile.profilePicture")}</span>
            </CardTitle>
            <CardDescription>{t("profile.pictureDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.profilePicture || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback className="bg-mustard text-black text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="space-y-2">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()} disabled={isLoading}>
                  <Camera className="w-4 h-4 mr-2" />
                  {t("profile.changePicture")}
                </Button>
                <p className="text-xs text-muted-foreground">{t("profile.pictureRequirements")}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>{t("profile.personalInfo")}</span>
            </CardTitle>
            <CardDescription>{t("profile.personalInfoDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("profile.fullName")}</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder={t("profile.namePlaceholder")}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("profile.emailAddress")}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t("profile.emailPlaceholder")}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label>{t("profile.memberSince")}</Label>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{format(new Date(user.createdAt), "MMMM dd, yyyy")}</span>
                </div>
              </div>

              <Button type="submit" className="bg-mustard hover:bg-mustard-dark text-black" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("profile.updating")}
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {t("profile.saveChanges")}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account Statistics */}
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.accountStats")}</CardTitle>
            <CardDescription>{t("profile.accountStatsDescription")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-mustard">8</div>
                <div className="text-sm text-muted-foreground">{t("profile.totalTransactions")}</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-mustard">6</div>
                <div className="text-sm text-muted-foreground">{t("profile.monthsActive")}</div>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-mustard">R$ 4,474</div>
                <div className="text-sm text-muted-foreground">{t("profile.currentBalance")}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
