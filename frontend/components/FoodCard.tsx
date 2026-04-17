'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Food } from '@/lib/mockData'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/button'

interface FoodCardProps {
  food: Food
}

export default function FoodCard({ food }: FoodCardProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    addItem({
      foodId: food.id,
      foodName: food.name,
      vendorId: food.vendorId,
      vendorName: food.vendorName,
      price: food.price,
      quantity,
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow">
      <div className="bg-gradient-to-br from-primary/10 to-accent/10 h-32 flex items-center justify-center text-5xl">
        {food.image}
      </div>

      <div className="p-6">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-foreground mb-1">{food.name}</h3>
          <p className="text-sm text-muted-foreground">{food.description}</p>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-foreground">{food.rating}</span>
            <span className="text-xs text-muted-foreground">({food.reviews} reviews)</span>
          </div>
          <Link href={`/vendor/${food.vendorId}`}>
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 cursor-pointer">
              {food.vendorName}
            </span>
          </Link>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-primary">LKR {food.price.toLocaleString()}</span>
          <span className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded">
            {food.category}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-3 py-1 bg-muted text-muted-foreground rounded hover:bg-muted/80"
          >
            −
          </button>
          <span className="flex-1 text-center font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="px-3 py-1 bg-muted text-muted-foreground rounded hover:bg-muted/80"
          >
            +
          </button>
        </div>

        <Button
          onClick={handleAddToCart}
          className={`w-full font-medium transition-all ${
            isAdded
              ? 'bg-green-600 text-white hover:bg-green-600'
              : 'bg-primary text-primary-foreground hover:bg-primary/90'
          }`}
        >
          {isAdded ? '✓ Added to Cart' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  )
}
