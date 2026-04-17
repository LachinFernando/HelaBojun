'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import PageLoader from '@/components/PageLoader'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { Button } from '@/components/ui/button'

export default function VendorOrdersPage() {
  const router = useRouter()
  const { user, isClient, isLoading, isAuthorized } = useProtectedRoute('vendor')
  const [selectedStatus, setSelectedStatus] = useState('all')

  if (!isClient || isLoading) {
    return <PageLoader />
  }

  if (!isAuthorized || !user) {
    return null
  }

  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  const vendorOrders = orders.filter((order: any) => order.vendorId === user.vendorId)

  const filteredOrders = vendorOrders.filter((order: any) => {
    if (selectedStatus === 'all') return true
    return order.status === selectedStatus
  })

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    const updatedOrders = orders.map((order: any) =>
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    localStorage.setItem('orders', JSON.stringify(updatedOrders))
    window.location.reload()
  }

  const getStatusOptions = (currentStatus: string) => {
    const statusFlow = ['pending', 'confirmed', 'preparing', 'ready', 'delivered']
    const currentIndex = statusFlow.indexOf(currentStatus)
    return statusFlow.slice(currentIndex + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground">Order Management</h1>
          <Button
            onClick={() => router.push('/vendor/dashboard')}
            variant="outline"
            className="border-border"
          >
            Back to Dashboard
          </Button>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['all', 'pending', 'confirmed', 'preparing', 'ready', 'delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors capitalize ${
                selectedStatus === status
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <div className="text-4xl mb-4">📭</div>
            <h2 className="text-xl font-bold text-foreground mb-2">No orders</h2>
            <p className="text-muted-foreground">No orders found for this status</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders
              .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((order: any) => (
                <div key={order.id} className="bg-card rounded-xl border border-border overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-foreground mb-1">Order #{order.id.slice(-8)}</h3>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">LKR {order.total.toLocaleString()}</p>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize block mt-2 ${getStatusBadgeColor(order.status)}`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="bg-muted/50 rounded-lg p-4 mb-4">
                      <p className="text-sm font-semibold text-foreground mb-3">Items:</p>
                      <div className="space-y-2">
                        {order.items.map((item: any, index: number) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span className="text-foreground">{item.foodName} x {item.quantity}</span>
                            <span className="text-foreground font-medium">LKR {(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Info */}
                    <div className="border-t border-border pt-4 mb-4">
                      <p className="text-sm font-semibold text-foreground mb-2">Delivery Details:</p>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>📍 {order.deliveryAddress}</p>
                        <p>📞 {order.phoneNumber}</p>
                        <p>⏱️ {order.deliveryTime}</p>
                      </div>
                    </div>

                    {/* Status Update */}
                    {order.status !== 'delivered' && (
                      <div className="flex gap-2">
                        {getStatusOptions(order.status).map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order.id, status)}
                            className={`flex-1 px-4 py-2 rounded-lg font-medium text-sm transition-colors capitalize ${
                              status === 'confirmed'
                                ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                                : status === 'preparing'
                                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                : status === 'ready'
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : status === 'delivered'
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : ''
                            }`}
                          >
                            Mark as {status}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
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
