'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import Header from '@/components/Header'
import PageLoader from '@/components/PageLoader'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { Button } from '@/components/ui/button'

export default function CartPage() {
  const router = useRouter()
  const { isClient, isLoading, isAuthorized } = useProtectedRoute('customer')
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()

  if (!isClient || isLoading) {
    return <PageLoader />
  }

  if (!isAuthorized) {
    return null
  }

  const itemsByVendor = items.reduce(
    (acc, item) => {
      if (!acc[item.vendorId]) {
        acc[item.vendorId] = {
          vendorName: item.vendorName,
          items: [],
        }
      }
      acc[item.vendorId].items.push(item)
      return acc
    },
    {} as Record<string, { vendorName: string; items: typeof items }>
  )

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            {items.length === 0 ? (
              <div className="bg-card rounded-xl border border-border p-12 text-center">
                <div className="text-5xl mb-4">🛒</div>
                <h2 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h2>
                <p className="text-muted-foreground mb-8">Start adding delicious food items!</p>
                <Link href="/browse">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                    Continue Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(itemsByVendor).map(([vendorId, { vendorName, items: vendorItems }]) => (
                  <div key={vendorId} className="bg-card rounded-xl border border-border overflow-hidden">
                    <div className="bg-primary/10 px-6 py-4 border-b border-border">
                      <Link href={`/vendor/${vendorId}`}>
                        <h3 className="font-bold text-foreground hover:text-primary cursor-pointer">
                          {vendorName}
                        </h3>
                      </Link>
                    </div>

                    <div className="divide-y divide-border">
                      {vendorItems.map((item) => (
                        <div key={item.id} className="p-6 flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground mb-1">{item.foodName}</h4>
                            <p className="text-sm text-muted-foreground">LKR {item.price.toLocaleString()} per item</p>
                          </div>

                          <div className="flex items-center gap-4 ml-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() =>
                                  updateQuantity(item.foodId, item.quantity - 1)
                                }
                                className="px-3 py-1 bg-muted text-muted-foreground rounded hover:bg-muted/80"
                              >
                                −
                              </button>
                              <span className="w-8 text-center font-medium">{item.quantity}</span>
                              <button
                                onClick={() =>
                                  updateQuantity(item.foodId, item.quantity + 1)
                                }
                                className="px-3 py-1 bg-muted text-muted-foreground rounded hover:bg-muted/80"
                              >
                                +
                              </button>
                            </div>

                            <div className="w-24 text-right">
                              <p className="font-semibold text-foreground">
                                LKR {(item.price * item.quantity).toLocaleString()}
                              </p>
                            </div>

                            <button
                              onClick={() => removeItem(item.foodId)}
                              className="text-destructive hover:text-destructive/80 font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Order Summary */}
          {items.length > 0 && (
            <div className="bg-card rounded-xl border border-border p-6 h-fit sticky top-24">
              <h3 className="text-lg font-bold text-foreground mb-6">Order Summary</h3>

              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="text-foreground font-medium">LKR {total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery Fee</span>
                  <span className="text-foreground font-medium">LKR 200</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (5%)</span>
                  <span className="text-foreground font-medium">LKR {Math.round(total * 0.05).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold mb-6 text-foreground">
                <span>Total</span>
                <span className="text-primary">
                  LKR {Math.round(total + 200 + total * 0.05).toLocaleString()}
                </span>
              </div>

              <Button
                onClick={() => router.push('/checkout')}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3 mb-3"
              >
                Proceed to Checkout
              </Button>

              <Button
                onClick={clearCart}
                variant="outline"
                className="w-full border-border"
              >
                Clear Cart
              </Button>

              <Link href="/browse" className="block mt-4">
                <Button variant="outline" className="w-full border-border">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
