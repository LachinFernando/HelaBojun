'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useClientReady } from '@/hooks/use-client-ready'

type ProtectedRole = 'customer' | 'vendor'

export function useProtectedRoute(role: ProtectedRole) {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const isClient = useClientReady()

  const isAuthorized = Boolean(user) && (role === 'customer' ? !user.isVendor : user.isVendor)

  useEffect(() => {
    if (!isClient || isLoading) {
      return
    }

    if (!user) {
      router.replace('/login')
      return
    }

    if (role === 'customer' && user.isVendor) {
      router.replace('/login')
      return
    }

    if (role === 'vendor' && !user.isVendor) {
      router.replace('/login')
    }
  }, [isClient, isLoading, role, router, user])

  return {
    user,
    isLoading,
    isClient,
    isAuthorized,
  }
}
