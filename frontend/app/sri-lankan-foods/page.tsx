'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import PageLoader from '@/components/PageLoader'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { Button } from '@/components/ui/button'
import { mockFoods, mockVendors } from '@/lib/mockData'

const affordableFoods = [...mockFoods].sort((a, b) => a.price - b.price).slice(0, 6)

const healthHighlights = [
  {
    title: 'Naturally Balanced Meals',
    description:
      'Many Sri Lankan plates combine rice, curry, lentils, greens, coconut, and spices, giving customers a satisfying mix of fiber, protein, and energy in a single meal.',
    icon: '🥗',
  },
  {
    title: 'Spices With Everyday Benefits',
    description:
      'Turmeric, ginger, pepper, curry leaves, cinnamon, and cardamom are deeply rooted in local cooking and help make meals flavorful without depending on heavy processed sauces.',
    icon: '🌿',
  },
  {
    title: 'Affordable Good Food',
    description:
      'Traditional dishes are built around local ingredients, which helps keep prices lower while still offering filling, nutrient-rich meals for students, families, and office workers.',
    icon: '💸',
  },
]

const wellnessPillars = [
  'Lentil-based dishes like dhal curry are budget friendly and rich in plant protein.',
  'Herbal foods such as kola kanda connect the menu to traditional wellness practices.',
  'Fresh coconut, seafood, vegetables, and grains create strong local variety.',
  'Portions are filling, making Sri Lankan food a good value for daily ordering.',
]

export default function SriLankanFoodsPage() {
  const { isClient, isLoading, isAuthorized } = useProtectedRoute('customer')

  if (!isClient || isLoading) {
    return <PageLoader />
  }

  if (!isAuthorized) {
    return null
  }

  const averagePrice = Math.round(
    mockFoods.reduce((sum, food) => sum + food.price, 0) / mockFoods.length
  )
  const openVendors = mockVendors.filter((vendor) => vendor.isOpen).length

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-10">
        <section className="rounded-[2rem] border border-border bg-gradient-to-br from-primary/10 via-card to-accent/10 p-8 md:p-12 mb-10 overflow-hidden">
          <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-4 py-2 text-sm font-medium text-primary mb-5">
                <span>🇱🇰</span>
                <span>Eat Local, Eat Better</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-5 text-balance">
                Sri Lankan food is flavorful, healthy, and still kind to your budget
              </h1>

              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                Hela Bojun Hala brings together traditional meals that feel comforting and
                practical for everyday life. Customers get spice-rich dishes, nourishing
                ingredients, and satisfying portions without paying premium restaurant prices.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/browse">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-5">
                    Browse Sri Lankan Meals
                  </Button>
                </Link>
                <Link href="/orders">
                  <Button variant="outline" className="border-border px-6 py-5">
                    View My Orders
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-3xl bg-card border border-border p-5 shadow-sm">
                <p className="text-sm text-muted-foreground mb-2">Average Menu Price</p>
                <p className="text-3xl font-bold text-primary">LKR {averagePrice}</p>
                <p className="text-sm text-muted-foreground mt-2">Accessible for everyday meals</p>
              </div>
              <div className="rounded-3xl bg-card border border-border p-5 shadow-sm">
                <p className="text-sm text-muted-foreground mb-2">Open Vendors</p>
                <p className="text-3xl font-bold text-foreground">{openVendors}</p>
                <p className="text-sm text-muted-foreground mt-2">Serving local favorites today</p>
              </div>
              <div className="col-span-2 rounded-3xl border border-primary/15 bg-primary/8 p-6">
                <p className="text-sm font-medium text-primary mb-2">Why this matters</p>
                <p className="text-foreground leading-7">
                  This cuisine naturally supports a strong value story: local ingredients,
                  traditional preparation, wholesome staples, and dishes that stay satisfying
                  without becoming expensive.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Why customers feel good ordering Sri Lankan food
            </h2>
            <p className="text-muted-foreground max-w-3xl">
              This is not just comfort food. It is a cuisine with everyday nutritional value,
              deep cultural familiarity, and strong affordability for repeat orders.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {healthHighlights.map((item) => (
              <div key={item.title} className="rounded-3xl border border-border bg-card p-6">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-7">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] mb-10">
          <div className="rounded-3xl border border-border bg-card p-7">
            <h2 className="text-2xl font-bold text-foreground mb-5">Health and value pillars</h2>
            <div className="space-y-4">
              {wellnessPillars.map((pillar) => (
                <div key={pillar} className="flex items-start gap-3 rounded-2xl bg-muted/40 p-4">
                  <span className="text-xl mt-0.5">✓</span>
                  <p className="text-foreground leading-7">{pillar}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-gradient-to-br from-secondary/40 to-accent/10 p-7">
            <h2 className="text-2xl font-bold text-foreground mb-5">Ideal messages to emphasize</h2>
            <div className="space-y-4 text-foreground">
              <div className="rounded-2xl bg-background/85 border border-border p-4">
                <p className="font-semibold mb-1">Healthy by tradition</p>
                <p className="text-muted-foreground">
                  Meals often rely on vegetables, lentils, herbs, and spices rather than heavily processed ingredients.
                </p>
              </div>
              <div className="rounded-2xl bg-background/85 border border-border p-4">
                <p className="font-semibold mb-1">Low cost, high satisfaction</p>
                <p className="text-muted-foreground">
                  Customers can enjoy filling food at approachable prices, which is perfect for frequent ordering.
                </p>
              </div>
              <div className="rounded-2xl bg-background/85 border border-border p-4">
                <p className="font-semibold mb-1">Local ingredients, local pride</p>
                <p className="text-muted-foreground">
                  Ordering Sri Lankan food helps promote local producers, cooking traditions, and regional identity.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10">
          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Affordable picks already on the menu
              </h2>
              <p className="text-muted-foreground">
                A few examples showing how approachable the pricing already is.
              </p>
            </div>
            <Link href="/browse" className="text-primary font-medium hover:text-primary/90">
              See all food
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {affordableFoods.map((food) => (
              <div key={food.id} className="rounded-3xl border border-border bg-card p-6">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="text-5xl">{food.image}</div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                    LKR {food.price}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{food.name}</h3>
                <p className="text-muted-foreground mb-4 leading-7">{food.description}</p>
                <div className="flex items-center justify-between text-sm">
                  <span className="rounded-full bg-secondary/60 px-3 py-1 text-secondary-foreground">
                    {food.category}
                  </span>
                  <Link href={`/vendor/${food.vendorId}`} className="text-primary font-medium">
                    {food.vendorName}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-border bg-card p-8 md:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
                Promote Sri Lankan food as everyday wellness, not just nostalgia
              </h2>
              <p className="text-muted-foreground max-w-3xl leading-7">
                Customers respond strongly when food feels both emotionally familiar and
                practically valuable. Position these meals as wholesome daily choices:
                nourishing, spice-rich, affordable, and proudly local.
              </p>
            </div>
            <Link href="/browse">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90 px-7 py-5 text-base">
                Start Ordering
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </div>
  )
}
