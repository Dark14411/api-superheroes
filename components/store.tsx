"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ShoppingBag, 
  Coins, 
  Star, 
  Heart, 
  Zap, 
  Sparkles,
  Check,
  X,
  Crown,
  Shirt,
  Palette,
  Apple,
  Cookie,
  Pill,
  Bath,
  Gift
} from "lucide-react"

// Tipos para los items de la tienda
interface StoreItem {
  id: string
  name: string
  description: string
  price: number
  category: 'cosmetic' | 'food' | 'care'
  icon: string
  effect?: {
    health?: number
    happiness?: number
    energy?: number
  }
  rarity?: 'common' | 'rare' | 'epic' | 'legendary'
}

// Datos de la tienda
const storeItems: StoreItem[] = [
  // Cosméticos
  {
    id: 'crown',
    name: 'Corona Real',
    description: 'Una corona dorada para tu Pou',
    price: 500,
    category: 'cosmetic',
    icon: '👑',
    rarity: 'epic'
  },
  {
    id: 'sunglasses',
    name: 'Gafas de Sol',
    description: 'Gafas cool para tu Pou',
    price: 200,
    category: 'cosmetic',
    icon: '🕶️',
    rarity: 'common'
  },
  {
    id: 'bowtie',
    name: 'Corbata',
    description: 'Una elegante corbata',
    price: 300,
    category: 'cosmetic',
    icon: '🎀',
    rarity: 'rare'
  },
  {
    id: 'hat',
    name: 'Sombrero',
    description: 'Un sombrero mágico',
    price: 150,
    category: 'cosmetic',
    icon: '🎩',
    rarity: 'common'
  },
  {
    id: 'wings',
    name: 'Alas de Ángel',
    description: 'Alas mágicas para volar',
    price: 1000,
    category: 'cosmetic',
    icon: '👼',
    rarity: 'legendary'
  },
  {
    id: 'cap',
    name: 'Gorra',
    description: 'Gorra deportiva moderna',
    price: 120,
    category: 'cosmetic',
    icon: '🧢',
    rarity: 'common'
  },
  {
    id: 'mask',
    name: 'Máscara',
    description: 'Máscara misteriosa',
    price: 250,
    category: 'cosmetic',
    icon: '🎭',
    rarity: 'rare'
  },
  {
    id: 'flower',
    name: 'Flor',
    description: 'Hermosa flor decorativa',
    price: 80,
    category: 'cosmetic',
    icon: '🌸',
    rarity: 'common'
  },
  {
    id: 'badge',
    name: 'Insignia',
    description: 'Insignia de campeón',
    price: 350,
    category: 'cosmetic',
    icon: '🏅',
    rarity: 'rare'
  },
  {
    id: 'diamond',
    name: 'Diamante',
    description: 'Diamante brillante premium',
    price: 800,
    category: 'cosmetic',
    icon: '💎',
    rarity: 'epic'
  },

  // Alimentos
  {
    id: 'apple',
    name: 'Manzana',
    description: 'Manzana saludable y nutritiva',
    price: 50,
    category: 'food',
    icon: '🍎',
    effect: { health: 10, happiness: 5 }
  },
  {
    id: 'pizza',
    name: 'Pizza',
    description: 'Pizza deliciosa italiana',
    price: 100,
    category: 'food',
    icon: '🍕',
    effect: { health: 5, happiness: 15, energy: 10 }
  },
  {
    id: 'icecream',
    name: 'Helado',
    description: 'Helado cremoso refrescante',
    price: 75,
    category: 'food',
    icon: '🍦',
    effect: { happiness: 20, energy: 5 }
  },
  {
    id: 'cake',
    name: 'Pastel',
    description: 'Pastel de cumpleaños especial',
    price: 200,
    category: 'food',
    icon: '🎂',
    effect: { health: 10, happiness: 25, energy: 15 }
  },
  {
    id: 'smoothie',
    name: 'Batido',
    description: 'Batido energético natural',
    price: 120,
    category: 'food',
    icon: '🥤',
    effect: { health: 15, energy: 20 }
  },
  {
    id: 'burger',
    name: 'Hamburguesa',
    description: 'Hamburguesa jugosa',
    price: 90,
    category: 'food',
    icon: '🍔',
    effect: { health: 8, happiness: 12, energy: 15 }
  },
  {
    id: 'donut',
    name: 'Dona',
    description: 'Dona dulce glaseada',
    price: 60,
    category: 'food',
    icon: '🍩',
    effect: { happiness: 18, energy: 8 }
  },
  {
    id: 'cookie',
    name: 'Galleta',
    description: 'Galleta crujiente casera',
    price: 40,
    category: 'food',
    icon: '🍪',
    effect: { happiness: 10, energy: 6 }
  },

  // Artículos de cuidado
  {
    id: 'medicine',
    name: 'Medicina',
    description: 'Cura enfermedades rápidamente',
    price: 150,
    category: 'care',
    icon: '💊',
    effect: { health: 30 }
  },
  {
    id: 'vitamins',
    name: 'Vitaminas',
    description: 'Vitaminas para la salud',
    price: 100,
    category: 'care',
    icon: '💊',
    effect: { health: 20, energy: 10 }
  },
  {
    id: 'soap',
    name: 'Jabón',
    description: 'Para mantener limpio',
    price: 80,
    category: 'care',
    icon: '🧼',
    effect: { health: 10 }
  },
  {
    id: 'brush',
    name: 'Cepillo',
    description: 'Para cepillar el pelo',
    price: 60,
    category: 'care',
    icon: '🪮',
    effect: { happiness: 10 }
  },
  {
    id: 'toy',
    name: 'Juguete',
    description: 'Juguete divertido',
    price: 90,
    category: 'care',
    icon: '🧸',
    effect: { happiness: 15, energy: 5 }
  },
  {
    id: 'shampoo',
    name: 'Champú',
    description: 'Champú premium para el baño',
    price: 70,
    category: 'care',
    icon: '🧴',
    effect: { health: 12, happiness: 8 }
  },
  {
    id: 'towel',
    name: 'Toalla',
    description: 'Toalla suave y cómoda',
    price: 50,
    category: 'care',
    icon: '🏮',
    effect: { happiness: 12 }
  },
  {
    id: 'perfume',
    name: 'Perfume',
    description: 'Perfume con aroma floral',
    price: 120,
    category: 'care',
    icon: '🌺',
    effect: { happiness: 20 }
  },
  {
    id: 'energy_drink',
    name: 'Bebida Energética',
    description: 'Bebida que restaura energía',
    price: 110,
    category: 'care',
    icon: '⚡',
    effect: { energy: 25, health: 5 }
  },
  {
    id: 'first_aid',
    name: 'Botiquín',
    description: 'Kit de primeros auxilios',
    price: 200,
    category: 'care',
    icon: '🩹',
    effect: { health: 40, energy: 10 }
  }
]

// Componente de item de la tienda
const StoreItemCard = ({ 
  item, 
  onBuy, 
  canAfford, 
  isOwned 
}: { 
  item: StoreItem
  onBuy: (item: StoreItem) => void
  canAfford: boolean
  isOwned: boolean
}) => {
  const getRarityColor = (rarity?: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500'
      case 'epic': return 'from-purple-400 to-pink-500'
      case 'rare': return 'from-blue-400 to-cyan-500'
      default: return 'from-gray-400 to-slate-500'
    }
  }

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`p-3 sm:p-4 cursor-pointer transition-all touch-manipulation ${
        item.rarity ? `bg-gradient-to-br ${getRarityColor(item.rarity)} text-white` : 'bg-white'
      }`}>
        <div className="text-center">
          <div className="text-3xl sm:text-4xl mb-2">{item.icon}</div>
          <h3 className="font-bold mb-1 text-sm sm:text-base">{item.name}</h3>
          <p className={`text-xs sm:text-sm mb-3 line-clamp-2 ${item.rarity ? 'text-white/80' : 'text-gray-600'}`}>
            {item.description}
          </p>
          
          {item.effect && (
            <div className="flex justify-center gap-1 sm:gap-2 mb-3 flex-wrap">
              {item.effect.health && (
                <Badge variant="secondary" className="text-xs px-1 sm:px-2">
                  <Heart className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                  +{item.effect.health}
                </Badge>
              )}
              {item.effect.happiness && (
                <Badge variant="secondary" className="text-xs px-1 sm:px-2">
                  <Star className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                  +{item.effect.happiness}
                </Badge>
              )}
              {item.effect.energy && (
                <Badge variant="secondary" className="text-xs px-1 sm:px-2">
                  <Zap className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
                  +{item.effect.energy}
                </Badge>
              )}
            </div>
          )}
          
          <div className="flex items-center justify-center gap-2">
            <Coins className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-bold text-sm sm:text-base">{item.price}</span>
          </div>
        </div>
      </Card>
      
      {isOwned && (
        <div className="absolute top-1 sm:top-2 right-1 sm:right-2">
          <Badge className="bg-green-500 text-xs">
            <Check className="w-2 h-2 sm:w-3 sm:h-3 mr-1" />
            <span className="hidden sm:inline">Comprado</span>
            <span className="sm:hidden">✓</span>
          </Badge>
        </div>
      )}
      
      {!isOwned && (
        <Button
          className={`w-full mt-2 h-10 sm:h-auto text-xs sm:text-sm touch-manipulation ${
            canAfford 
              ? 'bg-green-500 hover:bg-green-600 active:bg-green-700' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={() => canAfford && onBuy(item)}
          disabled={!canAfford}
        >
          {canAfford ? (
            <>
              <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Comprar
            </>
          ) : (
            <>
              <X className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Sin fondos</span>
              <span className="sm:hidden">Sin $</span>
            </>
          )}
        </Button>
      )}
    </motion.div>
  )
}

// Componente principal de la tienda
export default function Store({ 
  coins, 
  onPurchase, 
  ownedItems 
}: { 
  coins: number
  onPurchase: (item: StoreItem) => void
  ownedItems: string[]
}) {
  const [selectedCategory, setSelectedCategory] = useState<'cosmetic' | 'food' | 'care'>('cosmetic')
  const [showPurchaseAnimation, setShowPurchaseAnimation] = useState<string | null>(null)

  const handlePurchase = (item: StoreItem) => {
    if (coins >= item.price) {
      onPurchase(item)
      setShowPurchaseAnimation(item.id)
      setTimeout(() => setShowPurchaseAnimation(null), 2000)
    }
  }

  const filteredItems = storeItems.filter(item => item.category === selectedCategory)

  const categories = [
    { id: 'cosmetic', name: 'Cosméticos', icon: Crown },
    { id: 'food', name: 'Alimentos', icon: Apple },
    { id: 'care', name: 'Cuidado', icon: Bath }
  ]

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">🛒 Tienda de Pou</h2>
        <p className="text-gray-600 mb-4 sm:mb-6 px-4">Compra items para tu mascota virtual</p>
        
        <div className="flex items-center justify-center gap-4 mb-4 sm:mb-6">
          <div className="bg-yellow-500 rounded-full px-3 sm:px-4 py-2 flex items-center gap-2">
            <Coins className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-900" />
            <span className="font-bold text-yellow-900 text-sm sm:text-base">{coins}</span>
          </div>
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
        <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8 h-12 sm:h-auto">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm touch-manipulation">
              <category.icon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{category.name}</span>
              <span className="sm:hidden">{category.name.slice(0, 4)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
              {filteredItems.map((item) => (
                <StoreItemCard
                  key={item.id}
                  item={item}
                  onBuy={handlePurchase}
                  canAfford={coins >= item.price}
                  isOwned={ownedItems.includes(item.id)}
                />
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Animación de compra */}
      <AnimatePresence>
        {showPurchaseAnimation && (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <div className="bg-green-500 text-white rounded-full p-8 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🎉</div>
                <div className="text-2xl font-bold">¡Compra exitosa!</div>
                <div className="text-lg">Item agregado a tu inventario</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 