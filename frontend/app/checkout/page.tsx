'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import Header from '@/components/Header'
import PageLoader from '@/components/PageLoader'
import { useProtectedRoute } from '@/hooks/use-protected-route'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CheckoutPage() {
  const router = useRouter()
  const { user, isClient, isLoading, isAuthorized } = useProtectedRoute('customer')
  const { items, total, clearCart } = useCart()

  const [address, setAddress] = useState('')
  const [phone, setPhone] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (!isClient || isLoading || !isAuthorized) {
      return
    }

    if (items.length === 0) {
      router.replace('/cart')
    }
  }, [isAuthorized, isClient, isLoading, items.length, router])

  if (!isClient || isLoading) {
    return <PageLoader />
  }

  if (!isAuthorized || !user || items.length === 0) {
    return null
  }

  const subtotal = total
  const deliveryFee = 200
  const tax = Math.round(subtotal * 0.05)
  const grandTotal = subtotal + deliveryFee + tax

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!address || !phone) {
      alert('Please fill in all required fields')
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      // Save order to localStorage
      const orders = JSON.parse(localStorage.getItem('orders') || '[]')
      const newOrder = {
        id: `order_${Date.now()}`,
        userId: user.id,
        vendorId: items[0].vendorId,
        vendorName: items[0].vendorName,
        items: items.map((item) => ({
          foodId: item.foodId,
          foodName: item.foodName,
          quantity: item.quantity,
          price: item.price,
        })),
        total: grandTotal,
        status: 'pending' as const,
        createdAt: new Date(),
        deliveryAddress: address,
        phoneNumber: phone,
        deliveryTime: '30-45 mins',
      }

      orders.push(newOrder)
      localStorage.setItem('orders', JSON.stringify(orders))

      clearCart()
      setIsProcessing(false)
      router.push(`/order-confirmation/${newOrder.id}`)
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Delivery Address</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Full Address *
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your complete delivery address"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="10-digit phone number"
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">Payment Method</h2>

              <div className="space-y-3 mb-6">
                {['card', 'upi', 'wallet', 'cod'].map((method) => (
                  <label key={method} className="flex items-center p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer">
                    <input
                      type="radio"
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-medium text-foreground capitalize">{method}</span>
                  </label>
                ))}
              </div>

              {/* Card Details */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 pt-6 border-t border-border">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Card Number
                    </label>
                    <Input
                      type="text"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(e.target.value.replace(/\s/g, '').slice(0, 16))
                      }
                      placeholder="1234 5678 9012 3456"
                      className="w-full"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Expiry Date
                      </label>
                      <Input
                        type="text"
                        value={expiryDate}
                        onChange={(e) =>
                          setExpiryDate(e.target.value.slice(0, 5))
                        }
                        placeholder="MM/YY"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        CVV
                      </label>
                      <Input
                        type="text"
                        value={cvv}
                        onChange={(e) =>
                          setCvv(e.target.value.slice(0, 3))
                        }
                        placeholder="123"
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'cod' && (
                <div className="p-4 bg-accent/10 border border-accent rounded-lg">
                  <p className="text-sm text-foreground">
                    💳 Pay with Cash on Delivery when your order arrives
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-card rounded-xl border border-border p-6 h-fit sticky top-24">
            <h3 className="text-lg font-bold text-foreground mb-6">Order Summary</h3>

            <div className="space-y-3 mb-6 pb-6 border-b border-border max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    {item.foodName} x {item.quantity}
                  </span>
                  <span className="text-foreground font-medium">LKR {(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground font-medium">LKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="text-foreground font-medium">LKR {deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax (5%)</span>
                <span className="text-foreground font-medium">LKR {tax.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold mb-6 py-6 border-t border-b border-border text-foreground">
              <span>Total</span>
              <span className="text-primary">LKR {grandTotal.toLocaleString()}</span>
            </div>

            <Button
              onClick={handlePlaceOrder}
              disabled={isProcessing || !address || !phone}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-lg py-3"
            >
              {isProcessing ? 'Processing...' : 'Place Order'}
            </Button>

            <Button
              onClick={() => router.push('/cart')}
              variant="outline"
              className="w-full border-border mt-3"
            >
              Back to Cart
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
