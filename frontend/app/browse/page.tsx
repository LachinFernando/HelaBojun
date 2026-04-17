'use client'

import Link from 'next/link'
import { useState } from 'react'
import Header from '@/components/Header'
import PageLoader from '@/components/PageLoader'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { mockFoods } from '@/lib/mockData'
import FoodCard from '@/components/FoodCard'

export default function BrowsePage() {
  const { isClient, isLoading, isAuthorized } = useProtectedRoute('customer')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  if (!isClient || isLoading) {
    return <PageLoader />
  }

  if (!isAuthorized) {
    return null
  }

  const categories = ['all', ...new Set(mockFoods.map((f) => f.category))]

  const filteredFoods = mockFoods.filter((food) => {
    const matchesSearch =
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      food.vendorName.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory === 'all' || food.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-6">Browse All Food</h1>

          <div className="mb-6 rounded-3xl border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/10 p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold text-primary mb-1">Spotlight</p>
                <h2 className="text-xl font-bold text-foreground mb-1">
                  Discover why Sri Lankan food is healthy and affordable
                </h2>
                <p className="text-muted-foreground">
                  Learn how local ingredients, spices, and traditional meals create strong value for customers.
                </p>
              </div>
              <Link href="/sri-lankan-foods">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  Explore the Story
                </Button>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Search for food or vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-lg"
            />

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                    selectedCategory === category
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Found {filteredFoods.length} item{filteredFoods.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Foods Grid */}
        {filteredFoods.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFoods.map((food) => (
              <FoodCard key={food.id} food={food} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters</p>
          </div>
        )}
      </main>
    </div>
  )
}
