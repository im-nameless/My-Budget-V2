"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import Cookies from "js-cookie";
import { useRouter } from "next/navigation"

interface User {
  id: string
  name: string
  email: string
  profilePicture?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const response = await fetch("api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim()
      }),
    });

    const data = (await response.json()).data;

    if (data.success) {
      console.log("Login successful", data.data);
      setUser(data.data)
      localStorage.setItem("user", JSON.stringify(data))

      Cookies.set("auth-token", JSON.stringify(data), {
        expires: 7,         // days
        path: "/",          // available everywhere
        secure: true,       // only over HTTPS
        sameSite: "lax",    // or "strict"
      });
      router.push("/")
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    router.push("/login")
    Cookies.remove("auth-token");
    localStorage.removeItem("user")
  }

  const updateProfile = async (updates: Partial<User>): Promise<boolean> => {
    if (!user) return false

    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    localStorage.setItem("user", JSON.stringify(updatedUser))

    setIsLoading(false)
    return true
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateProfile, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
