'use client'

import Link from 'next/link'
import Header from '@/components/Header'
import PageLoader from '@/components/PageLoader'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { Button } from '@/components/ui/button'

export default function OrdersPage() {
  const { user, isClient, isLoading, isAuthorized } = useProtectedRoute('customer')

  if (!isClient || isLoading) {
    return <PageLoader />
  }

  if (!isAuthorized || !user) {
    return null
  }

  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  const userOrders = orders.filter((order: any) => order.userId === user.id)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'confirmed':
        return 'bg-blue-100 text-blue-700'
      case 'preparing':
        return 'bg-purple-100 text-purple-700'
      case 'ready':
        return 'bg-green-100 text-green-700'
      case 'delivered':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return '⏳'
      case 'confirmed':
        return '✓'
      case 'preparing':
        return '👨‍🍳'
      case 'ready':
        return '📦'
      case 'delivered':
        return '✅'
      default:
        return '•'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Orders</h1>

        {userOrders.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <div className="text-5xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-foreground mb-4">No orders yet</h2>
            <p className="text-muted-foreground mb-8">Start ordering delicious food today!</p>
            <Link href="/browse">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Browse Food
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {userOrders
              .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((order: any) => (
                <div key={order.id} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-foreground">{order.vendorName}</h3>
                          <div className={`text-sm font-semibold px-3 py-1 rounded-full flex items-center gap-1 ${getStatusColor(order.status)}`}>
                            <span>{getStatusIcon(order.status)}</span>
                            <span className="capitalize">{order.status}</span>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Order ID: <span className="font-mono">{order.id}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">LKR {order.total.toLocaleString()}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-muted-foreground mb-2">Items:</p>
                      <div className="space-y-1">
                        {order.items.map((item: any, index: number) => (
                          <p key={index} className="text-sm text-foreground">
                            {item.foodName} x {item.quantity} - LKR {(item.price * item.quantity).toFixed(2)}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div>
                        <p className="text-muted-foreground">Delivery Address</p>
                        <p className="text-foreground font-medium">{order.deliveryAddress}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Estimated Delivery</p>
                        <p className="text-foreground font-medium">{order.deliveryTime}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link href={`/order-confirmation/${order.id}`} className="flex-1">
                        <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                          View Details
                        </Button>
                      </Link>
                      {order.status !== 'delivered' && (
                        <Link href="/browse" className="flex-1">
                          <Button variant="outline" className="w-full border-border">
                            Reorder
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </main>
    </div>
  )
}
