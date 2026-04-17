'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'

export default function Header() {
  const router = useRouter()
  const { user, logout } = useAuth()
  const { items } = useCart()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href={user ? '/' : '/login'} className="flex items-center gap-2">
          <span className="text-3xl">🍽️</span>
          <div>
            <h1 className="text-xl font-bold text-foreground">Hela Bojun Hala</h1>
            <p className="text-xs text-muted-foreground">Food Delivery</p>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          {!user ? (
            <>
              <Button
                onClick={() => router.push('/login')}
                variant="outline"
                className="border-border"
              >
                Sign In
              </Button>
              <Button
                onClick={() => router.push('/register')}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Sign Up
              </Button>
            </>
          ) : user.isVendor ? (
            <>
              <Button
                onClick={() => router.push('/vendor/dashboard')}
                variant="outline"
                className="border-border"
              >
                Dashboard
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-border"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/browse" className="text-foreground hover:text-primary font-medium">
                Browse
              </Link>
              <Link href="/sri-lankan-foods" className="text-foreground hover:text-primary font-medium">
                Sri Lankan Foods
              </Link>
              <Link href="/orders" className="text-foreground hover:text-primary font-medium">
                Orders
              </Link>
              <Link href="/profile" className="text-foreground hover:text-primary font-medium">
                Profile
              </Link>
              <Button
                onClick={() => router.push('/cart')}
                className="relative bg-accent text-accent-foreground hover:bg-accent/90"
              >
                Cart
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {items.length}
                  </span>
                )}
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-border"
              >
                Logout
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
