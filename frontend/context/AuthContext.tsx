'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export interface User {
  id: string
  username: string
  email: string
  isVendor: boolean
  vendorId?: string
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string, isVendor: boolean) => Promise<void>
  register: (username: string, email: string, password: string, isVendor: boolean) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const login = async (username: string, password: string, isVendor: boolean) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}')
    const user = users[username]

    if (!user || user.password !== password) {
      throw new Error('Invalid username or password')
    }

    if (isVendor && !user.isVendor) {
      throw new Error('This account is not a vendor account')
    }

    if (!isVendor && user.isVendor) {
      throw new Error('Please use the vendor login')
    }

    const loggedInUser: User = {
      id: user.id,
      username: user.username,
      email: user.email,
      isVendor: user.isVendor,
      vendorId: user.vendorId,
    }

    setUser(loggedInUser)
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser))
  }

  const register = async (username: string, email: string, password: string, isVendor: boolean) => {
    const users = JSON.parse(localStorage.getItem('users') || '{}')

    if (users[username]) {
      throw new Error('Username already exists')
    }

    const newUser = {
      id: Date.now().toString(),
      username,
      email,
      password, // Note: In production, this should be hashed
      isVendor,
      vendorId: isVendor ? `vendor_${Date.now()}` : undefined,
    }

    users[username] = newUser

    localStorage.setItem('users', JSON.stringify(users))

    const loggedInUser: User = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      isVendor: newUser.isVendor,
      vendorId: newUser.vendorId,
    }

    setUser(loggedInUser)
    localStorage.setItem('currentUser', JSON.stringify(loggedInUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
