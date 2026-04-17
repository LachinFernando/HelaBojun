'use client'

import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import PageLoader from '@/components/PageLoader'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { Button } from '@/components/ui/button'
import { mockVendors, mockFoods } from '@/lib/mockData'
import FoodCard from '@/components/FoodCard'

interface VendorDetailPageProps {
  params: Promise<{ id: string }>
}

export default function VendorDetailPage({ params }: VendorDetailPageProps) {
  const router = useRouter()
  const { isClient, isLoading, isAuthorized } = useProtectedRoute('customer')
  const resolvedParams = params as any
  const vendorId = resolvedParams.id

  if (!isClient || isLoading) {
    return <PageLoader />
  }

  if (!isAuthorized) {
    return null
  }

  const vendor = mockVendors.find((v) => v.id === vendorId)
  const vendorFoods = mockFoods.filter((f) => f.vendorId === vendorId)

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12 text-center">
          <div className="text-4xl mb-4">🏪</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Vendor not found</h1>
          <Button
            onClick={() => router.push('/browse')}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Back to Browse
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Vendor Header */}
        <div className="mb-8 bg-card rounded-xl border border-border p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="text-7xl">{vendor.logo}</div>
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{vendor.name}</h1>
                <p className="text-muted-foreground mb-4 max-w-md">{vendor.description}</p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-foreground">{vendor.rating}</span>
                    <span className="text-muted-foreground ml-1">({vendor.reviews} reviews)</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">{vendor.cuisine}</span>
                    <span className="text-muted-foreground ml-1">Cuisine</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">⏱️ {vendor.deliveryTime}</span>
                  </div>
                  <div>
                    <span className="font-semibold text-foreground">Min: LKR {vendor.minOrder}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div
                className={`text-sm font-semibold px-4 py-2 rounded-lg ${
                  vendor.isOpen
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}
              >
                {vendor.isOpen ? '✓ Open' : '✗ Closed'}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-6">Menu</h2>
          {vendorFoods.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vendorFoods.map((food) => (
                <FoodCard key={food.id} food={food} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <div className="text-4xl mb-4">🍽️</div>
              <p className="text-muted-foreground">No menu items available</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
