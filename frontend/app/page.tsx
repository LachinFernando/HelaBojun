'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useClientReady } from '@/hooks/use-client-ready'
import Header from '@/components/Header'
import PageLoader from '@/components/PageLoader'
import { Button } from '@/components/ui/button'
import { mockVendors, initializeDemoAccounts } from '@/lib/mockData'

export default function HomePage() {
  const router = useRouter()
  const { user, isLoading } = useAuth()
  const isClient = useClientReady()

  // Initialize demo accounts
  useEffect(() => {
    if (isClient) {
      initializeDemoAccounts()
    }
  }, [isClient])

  useEffect(() => {
    if (!isClient || isLoading) {
      return
    }

    if (!user) {
      router.replace('/login')
      return
    }

    if (user.isVendor) {
      router.replace('/vendor/dashboard')
    }
  }, [isClient, isLoading, router, user])

  if (!isClient || isLoading) {
    return <PageLoader />
  }

  if (!user || user.isVendor) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Order Your Favorite Food
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Browse delicious meals from top-rated vendors and get fast delivery right to your door
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link href="/browse">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6">
                Start Browsing
              </Button>
            </Link>
            <Link href="/sri-lankan-foods">
              <Button variant="outline" className="border-border text-lg px-8 py-6">
                Why Sri Lankan Food?
              </Button>
            </Link>
          </div>
        </div>

        {/* Featured Vendors Section */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-foreground mb-8">Popular Vendors</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockVendors.map((vendor) => (
              <Link key={vendor.id} href={`/vendor/${vendor.id}`}>
                <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="bg-gradient-to-br from-primary/10 to-accent/10 h-24 flex items-center justify-center text-6xl">
                    {vendor.logo}
                  </div>
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-foreground mb-2">{vendor.name}</h4>
                    <p className="text-sm text-muted-foreground mb-4">{vendor.description}</p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">{vendor.rating}</span>
                        <span className="text-xs text-muted-foreground">({vendor.reviews} reviews)</span>
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                        {vendor.cuisine}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>⏱️ {vendor.deliveryTime}</span>
                      <span>Min: LKR {vendor.minOrder}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <div className="text-3xl mb-2">⚡</div>
            <h4 className="text-lg font-bold text-foreground mb-2">Fast Delivery</h4>
            <p className="text-sm text-muted-foreground">Get your food within 30-45 minutes</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <div className="text-3xl mb-2">⭐</div>
            <h4 className="text-lg font-bold text-foreground mb-2">Quality Food</h4>
            <p className="text-sm text-muted-foreground">Verified vendors with top ratings</p>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 text-center">
            <div className="text-3xl mb-2">💳</div>
            <h4 className="text-lg font-bold text-foreground mb-2">Easy Payment</h4>
            <p className="text-sm text-muted-foreground">Multiple payment options available</p>
          </div>
        </div>
      </main>
    </div>
  )
}
