export interface Food {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  vendorId: string
  vendorName: string
  rating: number
  reviews: number
}

export interface Vendor {
  id: string
  name: string
  description: string
  logo: string
  rating: number
  reviews: number
  cuisine: string
  deliveryTime: string
  minOrder: number
  isOpen: boolean
}

export interface Order {
  id: string
  userId: string
  vendorId: string
  vendorName: string
  items: Array<{
    foodId: string
    foodName: string
    quantity: number
    price: number
  }>
  total: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered'
  createdAt: Date
  deliveryTime?: string
}

export interface VendorAnalytics {
  vendorId: string
  totalOrders: number
  totalRevenue: number
  averageOrderValue: number
  ordersByDay: Array<{
    day: string
    orders: number
    revenue: number
  }>
  topItems: Array<{
    foodId: string
    foodName: string
    quantity: number
  }>
}

// Mock vendors
export const mockVendors: Vendor[] = [
  {
    id: 'vendor_1',
    name: 'Colombo Traditional Kitchen',
    description: 'Authentic Sri Lankan rice and curry dishes',
    logo: '🍛',
    rating: 4.8,
    reviews: 245,
    cuisine: 'Sri Lankan',
    deliveryTime: '30-45 mins',
    minOrder: 800,
    isOpen: true,
  },
  {
    id: 'vendor_2',
    name: 'Laksha Breakfast House',
    description: 'Traditional Sri Lankan breakfast and street food',
    logo: '🥘',
    rating: 4.6,
    reviews: 189,
    cuisine: 'Sri Lankan Breakfast',
    deliveryTime: '20-35 mins',
    minOrder: 500,
    isOpen: true,
  },
  {
    id: 'vendor_3',
    name: 'Kandy Sweets & Bakery',
    description: 'Traditional Sri Lankan sweets and baked goods',
    logo: '🍪',
    rating: 4.9,
    reviews: 321,
    cuisine: 'Sri Lankan Sweets',
    deliveryTime: '25-40 mins',
    minOrder: 600,
    isOpen: true,
  },
  {
    id: 'vendor_4',
    name: 'Galle Seafood Corner',
    description: 'Fresh seafood curry and traditional fish dishes',
    logo: '🐟',
    rating: 4.7,
    reviews: 412,
    cuisine: 'Sri Lankan Seafood',
    deliveryTime: '25-40 mins',
    minOrder: 1000,
    isOpen: true,
  },
  {
    id: 'vendor_5',
    name: 'Nuwara Eliya Herbal Kitchen',
    description: 'Traditional herbal porridge and health foods',
    logo: '🌿',
    rating: 4.5,
    reviews: 156,
    cuisine: 'Sri Lankan Herbal',
    deliveryTime: '30-45 mins',
    minOrder: 700,
    isOpen: true,
  },
]

// Mock foods
export const mockFoods: Food[] = [
  // Colombo Traditional Kitchen
  {
    id: 'food_1',
    name: 'Chicken Curry with Rice',
    description: 'Aromatic chicken curry with traditional spices served with steamed rice',
    price: 950,
    image: '🍛',
    category: 'Main Course',
    vendorId: 'vendor_1',
    vendorName: 'Colombo Traditional Kitchen',
    rating: 4.8,
    reviews: 124,
  },
  {
    id: 'food_2',
    name: 'Fish Curry with Roti',
    description: 'Fresh fish in spiced coconut curry with soft roti bread',
    price: 1100,
    image: '🐟',
    category: 'Main Course',
    vendorId: 'vendor_1',
    vendorName: 'Colombo Traditional Kitchen',
    rating: 4.7,
    reviews: 98,
  },
  {
    id: 'food_3',
    name: 'Dhal Curry',
    description: 'Traditional lentil curry with coconut milk and spices',
    price: 650,
    image: '🫘',
    category: 'Curry',
    vendorId: 'vendor_1',
    vendorName: 'Colombo Traditional Kitchen',
    rating: 4.9,
    reviews: 156,
  },
  // Laksha Breakfast House
  {
    id: 'food_4',
    name: 'String Hoppers with Curry',
    description: 'Fine rice noodles with chicken or vegetable curry',
    price: 450,
    image: '🍝',
    category: 'Breakfast',
    vendorId: 'vendor_2',
    vendorName: 'Laksha Breakfast House',
    rating: 4.7,
    reviews: 89,
  },
  {
    id: 'food_5',
    name: 'Milk Rice (Kiribath)',
    description: 'Traditional sweet milk rice served with jaggery and banana curry',
    price: 380,
    image: '🍚',
    category: 'Breakfast',
    vendorId: 'vendor_2',
    vendorName: 'Laksha Breakfast House',
    rating: 4.8,
    reviews: 134,
  },
  {
    id: 'food_6',
    name: 'Hoppers',
    description: 'Crispy bowl-shaped pancakes served with curry or eggs',
    price: 420,
    image: '🥣',
    category: 'Breakfast',
    vendorId: 'vendor_2',
    vendorName: 'Laksha Breakfast House',
    rating: 4.6,
    reviews: 201,
  },
  // Kandy Sweets & Bakery
  {
    id: 'food_7',
    name: 'Kavum',
    description: 'Traditional golden diamond-shaped sweet treats with jaggery filling',
    price: 280,
    image: '🍪',
    category: 'Sweets',
    vendorId: 'vendor_3',
    vendorName: 'Kandy Sweets & Bakery',
    rating: 4.9,
    reviews: 167,
  },
  {
    id: 'food_8',
    name: 'Kokis',
    description: 'Crispy spiral-shaped traditional sweet snack',
    price: 320,
    image: '🍪',
    category: 'Sweets',
    vendorId: 'vendor_3',
    vendorName: 'Kandy Sweets & Bakery',
    rating: 5.0,
    reviews: 89,
  },
  {
    id: 'food_9',
    name: 'Aasmi',
    description: 'Sweet boiled rice cakes with jaggery and grated coconut',
    price: 250,
    image: '🍮',
    category: 'Sweets',
    vendorId: 'vendor_3',
    vendorName: 'Kandy Sweets & Bakery',
    rating: 4.8,
    reviews: 234,
  },
  // Galle Seafood Corner
  {
    id: 'food_10',
    name: 'Devilled Fish',
    description: 'Spicy fried fish with onions, green chillies and lime',
    price: 1200,
    image: '🐟',
    category: 'Seafood',
    vendorId: 'vendor_4',
    vendorName: 'Galle Seafood Corner',
    rating: 4.7,
    reviews: 312,
  },
  {
    id: 'food_11',
    name: 'Manioc Curry',
    description: 'Tender cassava in coconut milk with traditional spices',
    price: 750,
    image: '🥔',
    category: 'Vegetable Curry',
    vendorId: 'vendor_4',
    vendorName: 'Galle Seafood Corner',
    rating: 4.6,
    reviews: 145,
  },
  // Nuwara Eliya Herbal Kitchen
  {
    id: 'food_12',
    name: 'Kola Kanda (Herbal Porridge)',
    description: 'Traditional medicinal herbal porridge with rice flour and spices',
    price: 550,
    image: '🌿',
    category: 'Herbal',
    vendorId: 'vendor_5',
    vendorName: 'Nuwara Eliya Herbal Kitchen',
    rating: 4.7,
    reviews: 92,
  },
]

// Initialize demo accounts in localStorage if they don't exist
export function initializeDemoAccounts() {
  const existingUsers = localStorage.getItem('users')
  if (!existingUsers) {
    const users: Record<string, any> = {
      username: {
        id: 'user_1',
        username: 'username',
        email: 'customer@demo.com',
        password: 'password',
        isVendor: false,
      },
      vendor1: {
        id: 'vendor_1',
        username: 'vendor1',
        email: 'vendor@demo.com',
        password: 'password',
        isVendor: true,
        vendorId: 'vendor_1',
      },
    }
    localStorage.setItem('users', JSON.stringify(users))
  }
}
