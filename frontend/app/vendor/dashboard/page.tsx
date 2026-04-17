'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import Header from '@/components/Header'
import PageLoader from '@/components/PageLoader'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { Button } from '@/components/ui/button'
import { mockFoods } from '@/lib/mockData'

export default function VendorDashboardPage() {
  const router = useRouter()
  const { user, isClient, isLoading, isAuthorized } = useProtectedRoute('vendor')
  const { logout } = useAuth()

  if (!isClient || isLoading) {
    return <PageLoader />
  }

  if (!isAuthorized || !user) {
    return null
  }

  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  const vendorOrders = orders.filter((order: any) => order.vendorId === user.vendorId)
  const vendorFoods = mockFoods.filter((f) => f.vendorId === user.vendorId)

  const analytics = {
    totalOrders: vendorOrders.length,
    totalRevenue: vendorOrders.reduce((sum: number, order: any) => sum + order.total, 0),
    pendingOrders: vendorOrders.filter((o: any) => o.status === 'pending').length,
    activeOrders: vendorOrders.filter((o: any) =>
      ['confirmed', 'preparing', 'ready'].includes(o.status)
    ).length,
    deliveredOrders: vendorOrders.filter((o: any) => o.status === 'delivered').length,
    topItems: vendorFoods
      .map((food) => {
        const quantity = vendorOrders.reduce((sum: number, order: any) => {
          const item = order.items.find((i: any) => i.foodId === food.id)
          return sum + (item ? item.quantity : 0)
        }, 0)
        return { ...food, quantity }
      })
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5),
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Vendor Dashboard</h1>
            <p className="text-muted-foreground">Welcome, {user.username}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-border"
          >
            Logout
          </Button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Orders</p>
            <p className="text-3xl font-bold text-foreground">{analytics.totalOrders}</p>
            <p className="text-xs text-muted-foreground mt-2">All time</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-primary">LKR {analytics.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">All time</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{analytics.pendingOrders}</p>
            <p className="text-xs text-muted-foreground mt-2">Awaiting confirmation</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Active</p>
            <p className="text-3xl font-bold text-blue-600">{analytics.activeOrders}</p>
            <p className="text-xs text-muted-foreground mt-2">Being prepared</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Delivered</p>
            <p className="text-3xl font-bold text-green-600">{analytics.deliveredOrders}</p>
            <p className="text-xs text-muted-foreground mt-2">Completed</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl border border-border p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
                <Link href="/vendor/orders">
                  <Button variant="outline" className="border-border text-sm">
                    View All
                  </Button>
                </Link>
              </div>

              {vendorOrders.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {vendorOrders
                    .slice(-5)
                    .reverse()
                    .map((order: any) => (
                      <div key={order.id} className="border border-border rounded-lg p-4 hover:bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-medium text-foreground">{order.id}</p>
                          <span className={`text-xs font-semibold px-2 py-1 rounded capitalize ${getStatusBadgeColor(order.status)}`}>
                            {order.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {order.items.length} items
                          </span>
                          <span className="font-semibold text-primary">LKR {order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Menu Management */}
            <div className="bg-card rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Your Menu</h2>
                <Link href="/vendor/menu">
                  <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-sm">
                    Manage Menu
                  </Button>
                </Link>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                Total items: {vendorFoods.length}
              </p>

              <div className="space-y-2">
                {vendorFoods.map((food) => (
                  <div key={food.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{food.image}</span>
                      <div>
                        <p className="font-medium text-foreground">{food.name}</p>
                        <p className="text-xs text-muted-foreground">LKR {food.price}</p>
                      </div>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {food.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Analytics Sidebar */}
          <div>
            {/* Top Items */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Top Items</h3>
              <div className="space-y-3">
                {analytics.topItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No sales yet</p>
                ) : (
                  analytics.topItems.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground text-sm">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity} sold</p>
                      </div>
                      <span className="text-lg font-bold text-primary">{item.quantity}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function getStatusBadgeColor(status: string) {
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
