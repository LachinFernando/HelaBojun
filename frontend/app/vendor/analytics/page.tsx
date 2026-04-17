'use client'

import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import PageLoader from '@/components/PageLoader'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { Button } from '@/components/ui/button'

export default function VendorAnalyticsPage() {
  const router = useRouter()
  const { user, isClient, isLoading, isAuthorized } = useProtectedRoute('vendor')

  if (!isClient || isLoading) {
    return <PageLoader />
  }

  if (!isAuthorized || !user) {
    return null
  }

  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  const vendorOrders = orders.filter((order: any) => order.vendorId === user.vendorId)
  const totalRevenue = vendorOrders.reduce((sum: number, order: any) => sum + order.total, 0)
  const totalOrders = vendorOrders.length
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  const dailyData: Record<string, { orders: number; revenue: number }> = {}
  vendorOrders.forEach((order: any) => {
    const date = new Date(order.createdAt).toLocaleDateString()
    if (!dailyData[date]) {
      dailyData[date] = { orders: 0, revenue: 0 }
    }
    dailyData[date].orders += 1
    dailyData[date].revenue += order.total
  })

  const itemStats: Record<string, { name: string; quantity: number; revenue: number }> = {}
  vendorOrders.forEach((order: any) => {
    order.items.forEach((item: any) => {
      if (!itemStats[item.foodId]) {
        itemStats[item.foodId] = {
          name: item.foodName,
          quantity: 0,
          revenue: 0,
        }
      }
      itemStats[item.foodId].quantity += item.quantity
      itemStats[item.foodId].revenue += item.price * item.quantity
    })
  })

  const analytics = {
    totalRevenue,
    totalOrders,
    averageOrderValue,
    dailyData: Object.entries(dailyData)
      .sort(([dateA], [dateB]) => new Date(dateA).getTime() - new Date(dateB).getTime())
      .slice(-7)
      .map(([date, data]) => ({
        date,
        orders: data.orders,
        revenue: data.revenue,
      })),
    topItems: Object.values(itemStats)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10),
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Analytics & Reports</h1>
          <Button
            onClick={() => router.push('/vendor/dashboard')}
            variant="outline"
            className="border-border"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
            <p className="text-4xl font-bold text-primary mb-2">
              LKR {analytics.totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">All time</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Total Orders</p>
            <p className="text-4xl font-bold text-foreground mb-2">
              {analytics.totalOrders}
            </p>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </div>

          <div className="bg-card rounded-xl border border-border p-6">
            <p className="text-sm text-muted-foreground mb-2">Average Order Value</p>
            <p className="text-4xl font-bold text-accent mb-2">
              LKR {Math.round(analytics.averageOrderValue).toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Per order</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Last 7 Days */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Last 7 Days</h2>

            {analytics.dailyData.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No data available</p>
            ) : (
              <div className="space-y-4">
                {analytics.dailyData.map((day) => (
                  <div key={day.date}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">{day.date}</span>
                      <span className="font-semibold text-foreground">LKR {day.revenue.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            (day.revenue / Math.max(...analytics.dailyData.map((d) => d.revenue))) *
                              100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{day.orders} order(s)</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Top Items */}
          <div className="bg-card rounded-xl border border-border p-6">
            <h2 className="text-xl font-bold text-foreground mb-6">Top Performing Items</h2>

            {analytics.topItems.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No sales yet</p>
            ) : (
              <div className="space-y-3">
                {analytics.topItems.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-muted-foreground w-6 text-right">
                        #{index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.quantity} sold</p>
                      </div>
                    </div>
                    <span className="font-bold text-primary">
                      LKR {item.revenue.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Order Status Breakdown */}
        <div className="bg-card rounded-xl border border-border p-6 mt-8">
          <h2 className="text-xl font-bold text-foreground mb-6">Order Status Distribution</h2>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['pending', 'confirmed', 'preparing', 'ready', 'delivered'].map((status) => {
              const count = vendorOrders.filter((o: any) => o.status === status).length
              const percentage = vendorOrders.length > 0 ? (count / vendorOrders.length) * 100 : 0

              return (
                <div key={status} className="text-center">
                  <p className="text-sm font-medium text-muted-foreground capitalize mb-2">
                    {status}
                  </p>
                  <p className="text-2xl font-bold text-foreground">{count}</p>
                  <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                </div>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  )
}
