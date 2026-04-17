'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import PageLoader from '@/components/PageLoader'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { Button } from '@/components/ui/button'

interface OrderConfirmationPageProps {
  params: Promise<{ id: string }>
}

export default function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const router = useRouter()
  const { isClient, isLoading, isAuthorized } = useProtectedRoute('customer')
  const resolvedParams = params as any
  const orderId = resolvedParams.id

  if (!isClient || isLoading) {
    return <PageLoader />
  }

  if (!isAuthorized) {
    return null
  }

  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  const order = orders.find((o: any) => o.id === orderId)

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="text-4xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Order not found</h1>
          <Button
            onClick={() => router.push('/orders')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4"
          >
            View Orders
          </Button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-card rounded-xl border border-border p-8 text-center mb-8">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-6">
            Thank you for your order. Your food will be delivered soon.
          </p>

          <div className="bg-primary/10 rounded-lg p-4 mb-8">
            <p className="text-sm text-muted-foreground mb-1">Order ID</p>
            <p className="text-xl font-bold text-foreground font-mono">{order.id}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8 text-left">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
              <p className="text-lg font-semibold text-foreground">30-45 mins</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
              <p className="text-lg font-semibold text-primary">LKR {order.total.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Vendor</p>
              <p className="text-lg font-semibold text-foreground">{order.vendorName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Status</p>
              <div className="inline-block px-3 py-1 bg-accent/10 text-accent-foreground rounded-full text-sm font-medium capitalize">
                {order.status}
              </div>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Order Items</h2>
          <div className="divide-y divide-border">
            {order.items.map((item: any, index: number) => (
              <div key={index} className="py-3 flex justify-between">
                <div>
                  <p className="font-medium text-foreground">{item.foodName}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-foreground">LKR {(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery Address */}
        <div className="bg-card rounded-xl border border-border p-6 mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Delivery Details</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Delivery Address</p>
              <p className="text-foreground">{order.deliveryAddress}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Contact Number</p>
              <p className="text-foreground">{order.phoneNumber}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Link href="/orders" className="flex-1">
            <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
              Track Order
            </Button>
          </Link>
          <Link href="/browse" className="flex-1">
            <Button variant="outline" className="w-full border-border">
              Order More
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
