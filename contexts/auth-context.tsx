"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import Cookies from "js-cookie";
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
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  updateProfile: (updates: Partial<User>) => Promise<boolean>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user data for demonstration
const mockUsers = [
  {
    id: "1",
    name: "Giovanni Alves",
    email: "john@example.com",
    password: "password123",
    profilePicture: "/placeholder.svg?height=100&width=100",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Maria Silva",
    email: "maria@example.com",
    password: "senha123",
    profilePicture: "/placeholder.svg?height=100&width=100",
    createdAt: "2024-01-01T00:00:00.000Z",
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    // Check for saved user session
    const savedUser = localStorage.getItem("user")
    console.log(savedUser)
    if (savedUser) {
      console.log("Found saved user in localStorage")
      try {
        setUser(JSON.parse(savedUser))
      } catch (error) {
        console.error("Error parsing saved user:", error)
        localStorage.removeItem("user")
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const foundUser = mockUsers.find((u) => u.email === email && u.password === password)
    console.log("Login attempt:", { email, password, foundUser })
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser
      setUser(userWithoutPassword)
      localStorage.setItem("user", JSON.stringify(userWithoutPassword))
      Cookies.set("user", JSON.stringify(user), {
        expires: 7,         // days
        path: "/",          // available everywhere
        secure: true,       // only over HTTPS
        sameSite: "lax",    // or "strict"
      });
      setIsLoading(false)
      return true
    }

    setIsLoading(false)
    return false
  }

  const register = async (
    name: string,
    email: string,
    password: string,
  ): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      setIsLoading(false)
      return { success: false, error: "User with this email already exists" }
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      profilePicture: "/placeholder.svg?height=100&width=100",
      createdAt: new Date().toISOString(),
    }

    // Add to mock users array
    mockUsers.push(newUser)

    // Log in the new user
    const { password: _, ...userWithoutPassword } = newUser
    setUser(userWithoutPassword)
    localStorage.setItem("user", JSON.stringify(userWithoutPassword))

    setIsLoading(false)
    return { success: true }
  }

  const logout = () => {
    setUser(null)
    Cookies.remove("user");
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
    <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>
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
