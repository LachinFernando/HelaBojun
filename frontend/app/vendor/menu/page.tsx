'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import PageLoader from '@/components/PageLoader'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockFoods } from '@/lib/mockData'

export default function VendorMenuPage() {
  const router = useRouter()
  const { user, isClient, isLoading, isAuthorized } = useProtectedRoute('vendor')
  const [isEditing, setIsEditing] = useState(false)

  if (!isClient || isLoading) {
    return <PageLoader />
  }

  if (!isAuthorized || !user) {
    return null
  }

  const vendorFoods = mockFoods.filter((f) => f.vendorId === user.vendorId)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Menu Management</h1>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push('/vendor/dashboard')}
              variant="outline"
              className="border-border"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Add Item Section */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Add New Item</h2>
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Food Name
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Butter Chicken"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Price (LKR)
                </label>
                <Input
                  type="number"
                  placeholder="e.g., 350"
                  className="w-full"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                placeholder="Describe your food item..."
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Category
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Main Course"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Emoji/Image
                </label>
                <Input
                  type="text"
                  placeholder="e.g., 🍛"
                  className="w-full"
                  maxLength={5}
                />
              </div>
            </div>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full">
              Add Item to Menu
            </Button>
          </form>
        </div>

        {/* Current Menu */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Current Menu</h2>

          {vendorFoods.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-4xl mb-4">🍽️</div>
              <p className="text-muted-foreground">No menu items yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {vendorFoods.map((food) => (
                <div key={food.id} className="border border-border rounded-lg p-4 hover:bg-muted/50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{food.image}</span>
                      <div>
                        <h3 className="font-bold text-foreground">{food.name}</h3>
                        <p className="text-sm text-muted-foreground">{food.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Price</p>
                      <p className="text-lg font-bold text-primary">LKR {food.price}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Category</p>
                      <span className="inline-block px-3 py-1 bg-secondary/50 text-secondary-foreground rounded text-sm font-medium">
                        {food.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 border-border text-sm">
                      Edit
                    </Button>
                    <Button variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive/10 text-sm">
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
