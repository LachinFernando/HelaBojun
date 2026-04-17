'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Header from '@/components/Header'
import PageLoader from '@/components/PageLoader'
import { useProtectedRoute } from '@/hooks/use-protected-route'

export default function ProfilePage() {
  const router = useRouter()
  const { user, isClient, isLoading, isAuthorized } = useProtectedRoute('customer')
  const { logout } = useAuth()

  if (!isClient || isLoading) {
    return <PageLoader />
  }

  if (!isAuthorized || !user) {
    return null
  }

  const users = JSON.parse(localStorage.getItem('users') || '{}')
  const userDetails = users[user.username]
  const orders = JSON.parse(localStorage.getItem('orders') || '[]')
  const userOrders = orders.filter((order: any) => order.userId === user.id)
  const totalSpent = userOrders.reduce((sum: number, order: any) => sum + order.total, 0)

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">My Profile</h1>

        {/* Profile Card */}
        <div className="bg-card rounded-xl border border-border p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center text-4xl mb-4">
                👤
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-1">{user.username}</h2>
              <p className="text-muted-foreground">{userDetails.email}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">User ID</p>
              <p className="text-lg font-mono text-foreground">{user.id}</p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <div className="grid grid-cols-3 gap-6 mb-8">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Orders</p>
                <p className="text-3xl font-bold text-primary">{userOrders.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Spent</p>
                <p className="text-3xl font-bold text-primary">LKR {totalSpent.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Member Since</p>
                <p className="text-lg font-medium text-foreground">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                className="w-full px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-6 py-2 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-card rounded-xl border border-border p-8 mb-8">
          <h3 className="text-xl font-bold text-foreground mb-6">Account Information</h3>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground mb-2">Username</p>
              <p className="text-foreground font-medium">{user.username}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Email Address</p>
              <p className="text-foreground font-medium">{userDetails.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Account Type</p>
              <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium">
                Customer
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-card rounded-xl border border-border p-8">
          <h3 className="text-xl font-bold text-foreground mb-6">Recent Orders</h3>
          {userOrders.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No orders yet</p>
              <button
                onClick={() => router.push('/browse')}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-medium transition-colors"
              >
                Browse Food
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {userOrders.slice(-3).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{order.vendorName}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">LKR {order.total.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
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
