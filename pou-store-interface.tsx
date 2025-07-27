"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  Zap,
  Shield,
  Star,
  Sparkles,
  Plus,
  Eye,
  X,
  Flame,
  Droplet,
  Wind,
  Gamepad2,
  Award,
  TrendingUp,
  Apple,
  Dumbbell,
  Palette,
  Coffee,
  AlertCircle,
  CheckCircle,
  Loader2,
  Clock,
  Trophy,
  Package,
  ShoppingBag,
  Search,
  Filter,
  Coins,
  Gift,
  Crown,
  Sword,
  Armor,
  Wand,
  BookOpen,
  Music,
  Camera,
  Home,
  Settings,
  Volume2,
  VolumeX,
  Bath,
  Moon,
  Settings2,
  ChevronLeft,
  ChevronRight,
  Minus,
  Check,
  Lock,
  Unlock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import unifiedApiClient, { StoreItem } from "@/lib/unified-api-client"

// Tipos adicionales para la tienda

interface CartItem extends StoreItem {
  quantity: number
}

// Datos de la tienda
const STORE_ITEMS: StoreItem[] = [
  {
    id: "sword-1",
    name: "Espada de Fuego",
    description: "Una espada legendaria que arde con fuego eterno",
    price: 1500,
    category: "weapon",
    rarity: "legendary",
    image: "🔥⚔️",
    stats: { attack: 50, speed: 10 },
    effects: ["Quema enemigos", "Aumenta ataque crítico"],
    available: true,
  },
  {
    id: "armor-1",
    name: "Armadura de Diamante",
    description: "Armadura impenetrable forjada en diamante puro",
    price: 2000,
    category: "armor",
    rarity: "epic",
    image: "💎🛡️",
    stats: { defense: 60, health: 30 },
    effects: ["Resistencia a magia", "Refleja daño"],
    available: true,
  },
  {
    id: "pet-1",
    name: "Dragón Bebé",
    description: "Un adorable dragón que crece con tu héroe",
    price: 3000,
    category: "pet",
    rarity: "legendary",
    image: "🐉",
    stats: { attack: 20, defense: 15, health: 25 },
    effects: ["Vuela contigo", "Escupe fuego"],
    available: true,
  },
  {
    id: "potion-1",
    name: "Poción de Vida",
    description: "Restaura completamente la salud",
    price: 200,
    category: "potion",
    rarity: "common",
    image: "🧪❤️",
    effects: ["Curación completa"],
    available: true,
  },
  {
    id: "food-1",
    name: "Manzana Dorada",
    description: "Fruta mágica que aumenta temporalmente las estadísticas",
    price: 100,
    category: "food",
    rarity: "rare",
    image: "🍎✨",
    effects: ["+20% estadísticas por 1 hora"],
    available: true,
  },
  {
    id: "accessory-1",
    name: "Corona Real",
    description: "Corona que otorga autoridad y poder",
    price: 5000,
    category: "accessory",
    rarity: "legendary",
    image: "👑",
    stats: { attack: 10, defense: 10, health: 20 },
    effects: ["Aura de liderazgo", "Descuento en tienda"],
    available: true,
  },
  {
    id: "cosmetic-1",
    name: "Capa Arcoíris",
    description: "Capa mágica que cambia de color",
    price: 800,
    category: "cosmetic",
    rarity: "rare",
    image: "🌈",
    effects: ["Cambio de colores", "Efectos visuales"],
    available: true,
  },
  {
    id: "weapon-2",
    name: "Arco de Hielo",
    description: "Arco que dispara flechas de hielo",
    price: 1200,
    category: "weapon",
    rarity: "epic",
    image: "🏹❄️",
    stats: { attack: 40, speed: 15 },
    effects: ["Congela enemigos", "Disparo múltiple"],
    available: true,
  },
]

// Componente del personaje Pou
const PouCharacter = ({
  isAnimating = false,
  mood = "happy",
  onClick,
}: {
  isAnimating?: boolean
  mood?: "happy" | "sad" | "excited" | "sleepy"
  onClick?: () => void
}) => {
  const getMoodExpression = () => {
    switch (mood) {
      case "excited":
        return { eyeScale: 1.2, mouthHeight: 16, mouthCurve: "0 0 40px 40px", bounce: true }
      case "happy":
        return { eyeScale: 1.1, mouthHeight: 12, mouthCurve: "0 0 30px 30px", bounce: false }
      case "sleepy":
        return { eyeScale: 0.6, mouthHeight: 4, mouthCurve: "20px 20px 0 0", bounce: false }
      case "sad":
        return { eyeScale: 0.8, mouthHeight: 6, mouthCurve: "20px 20px 0 0", bounce: false }
      default:
        return { eyeScale: 1, mouthHeight: 8, mouthCurve: "0 0 20px 20px", bounce: false }
    }
  }

  const expression = getMoodExpression()

  return (
    <motion.div
      className="w-32 h-32 relative cursor-pointer"
      animate={isAnimating ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
      transition={{ duration: 0.6 }}
      onClick={onClick}
    >
      {/* Cuerpo de Pou */}
      <motion.div
        className="w-32 h-32 bg-yellow-400 rounded-full relative flex items-center justify-center shadow-lg border-4 border-yellow-300"
        animate={expression.bounce ? { y: [0, -5, 0] } : {}}
        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
      >
        {/* Ojos */}
        <div className="absolute top-8 flex gap-4">
          <motion.div
            className="w-4 h-4 bg-white rounded-full flex items-center justify-center"
            animate={{ scale: expression.eyeScale }}
          >
            <div className="w-2 h-2 bg-black rounded-full" />
          </motion.div>
          <motion.div
            className="w-4 h-4 bg-white rounded-full flex items-center justify-center"
            animate={{ scale: expression.eyeScale }}
          >
            <div className="w-2 h-2 bg-black rounded-full" />
          </motion.div>
        </div>

        {/* Boca */}
        <motion.div
          className="absolute bottom-8 w-12 h-6 border-b-4 border-black rounded-b-full"
          style={{ 
            height: expression.mouthHeight,
            borderRadius: expression.mouthCurve
          }}
          animate={isAnimating ? { scaleX: [1, 1.2, 1] } : {}}
        />
      </motion.div>
    </motion.div>
  )
}

// Componente de item de la tienda
const StoreItemCard = ({
  item,
  onAddToCart,
  onViewDetails,
}: {
  item: StoreItem
  onAddToCart: (item: StoreItem) => void
  onViewDetails: (item: StoreItem) => void
}) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "bg-yellow-500 text-yellow-900"
      case "epic": return "bg-purple-500 text-white"
      case "rare": return "bg-blue-500 text-white"
      case "common": return "bg-gray-500 text-white"
      default: return "bg-gray-500 text-white"
    }
  }

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 hover:border-yellow-300 transition-all">
        {/* Badge de rareza */}
        <Badge className={`absolute top-2 right-2 ${getRarityColor(item.rarity)}`}>
          {item.rarity.toUpperCase()}
        </Badge>

        {/* Imagen del item */}
        <div className="text-4xl text-center mb-3">{item.image}</div>

        {/* Nombre */}
        <h3 className="font-bold text-lg text-gray-800 mb-2">{item.name}</h3>

        {/* Descripción */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

        {/* Estadísticas */}
        {item.stats && (
          <div className="mb-3">
            {Object.entries(item.stats).map(([stat, value]) => (
              <div key={stat} className="flex justify-between text-xs">
                <span className="capitalize">{stat}:</span>
                <span className="font-bold text-green-600">+{value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Efectos */}
        {item.effects && (
          <div className="mb-3">
            {item.effects.map((effect, index) => (
              <div key={index} className="text-xs text-blue-600 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {effect}
              </div>
            ))}
          </div>
        )}

        {/* Precio */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Coins className="w-4 h-4 text-yellow-600" />
            <span className="font-bold text-lg">{item.price}</span>
          </div>
          {item.discount && (
            <Badge className="bg-red-500 text-white">
              -{item.discount}%
            </Badge>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={() => onViewDetails(item)}
          >
            <Eye className="w-4 h-4 mr-1" />
            Ver
          </Button>
          <Button
            size="sm"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            onClick={() => onAddToCart(item)}
            disabled={!item.available}
          >
            <ShoppingBag className="w-4 h-4 mr-1" />
            Comprar
          </Button>
        </div>
      </Card>
    </motion.div>
  )
}

// Componente principal de la tienda
export default function PouStoreInterface() {
  const [storeItems, setStoreItems] = useState<StoreItem[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null)
  const [showCart, setShowCart] = useState(false)
  const [showItemDetails, setShowItemDetails] = useState(false)
  const [pouMood, setPouMood] = useState<"happy" | "sad" | "excited" | "sleepy">("happy")
  const [coins, setCoins] = useState(10000)
  const [isPouAnimating, setIsPouAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Cargar datos de la tienda
  useEffect(() => {
    const loadStoreData = async () => {
      setIsLoading(true)
      try {
        const items = await unifiedApiClient.getStoreItems()
        setStoreItems(items)
      } catch (error) {
        console.error("Error loading store data:", error)
        // Fallback con items por defecto
        setStoreItems(STORE_ITEMS)
      } finally {
        setIsLoading(false)
      }
    }
    loadStoreData()
  }, [])

  // Filtrar items
  const filteredItems = storeItems.filter(item => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Agregar al carrito
  const addToCart = (item: StoreItem) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id)
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
    
    // Animación de Pou
    setIsPouAnimating(true)
    setPouMood("excited")
    setTimeout(() => {
      setIsPouAnimating(false)
      setPouMood("happy")
    }, 1000)
  }

  // Ver detalles del item
  const viewItemDetails = (item: StoreItem) => {
    setSelectedItem(item)
    setShowItemDetails(true)
  }

  // Calcular total del carrito
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0)

  // Comprar items
  const purchaseItems = async () => {
    if (coins >= cartTotal) {
      setIsLoading(true)
      try {
        // Procesar cada item del carrito
        for (const item of cart) {
          await unifiedApiClient.purchaseItem(item.id, item.quantity)
        }
        
        setCoins(prev => prev - cartTotal)
        setCart([])
        setShowCart(false)
        setPouMood("excited")
        setIsPouAnimating(true)
        
        setTimeout(() => {
          setIsPouAnimating(false)
          setPouMood("happy")
        }, 2000)
      } catch (error) {
        console.error("Error purchasing items:", error)
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Remover del carrito
  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId))
  }

  // Actualizar cantidad
  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart(prev => prev.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100 p-4">
      {/* Header con Pou */}
      <div className="max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <PouCharacter
                isAnimating={isPouAnimating}
                mood={pouMood}
                onClick={() => setIsPouAnimating(true)}
              />
              <div>
                <h1 className="text-3xl font-bold text-white">Tienda de Pou</h1>
                <p className="text-yellow-100">¡Encuentra todo lo que necesitas!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Monedas */}
              <div className="bg-yellow-500 rounded-full px-4 py-2 flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-900" />
                <span className="font-bold text-yellow-900">{coins}</span>
              </div>
              
              {/* Carrito */}
              <Button
                onClick={() => setShowCart(true)}
                className="bg-white text-orange-500 hover:bg-orange-50"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Carrito ({cart.length})
              </Button>
            </div>
          </div>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-lg">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="weapon">Armas</SelectItem>
                <SelectItem value="armor">Armaduras</SelectItem>
                <SelectItem value="accessory">Accesorios</SelectItem>
                <SelectItem value="pet">Mascotas</SelectItem>
                <SelectItem value="food">Comida</SelectItem>
                <SelectItem value="potion">Pociones</SelectItem>
                <SelectItem value="cosmetic">Cosméticos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Grid de items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <StoreItemCard
              key={item.id}
              item={item}
              onAddToCart={addToCart}
              onViewDetails={viewItemDetails}
            />
          ))}
        </div>

        {/* Mensaje si no hay items */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-600 mb-2">No se encontraron items</h3>
            <p className="text-gray-500">Intenta con otros filtros o términos de búsqueda</p>
          </div>
        )}
      </div>

      {/* Modal del carrito */}
      <Dialog open={showCart} onOpenChange={setShowCart}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Carrito de Compras
            </DialogTitle>
          </DialogHeader>
          
          <div className="max-h-96 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">🛒</div>
                <p className="text-gray-500">Tu carrito está vacío</p>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{item.image}</div>
                    <div className="flex-1">
                      <h4 className="font-bold">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="text-right">
                      <div className="font-bold">{item.price * item.quantity}</div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cart.length > 0 && (
            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold">Total:</span>
                <span className="text-2xl font-bold text-green-600">{cartTotal}</span>
              </div>
              <Button
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={purchaseItems}
                disabled={coins < cartTotal}
              >
                <Check className="w-4 h-4 mr-2" />
                Comprar ({cartTotal} monedas)
              </Button>
              {coins < cartTotal && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  No tienes suficientes monedas
                </p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de detalles del item */}
      <Dialog open={showItemDetails} onOpenChange={setShowItemDetails}>
        <DialogContent className="max-w-md">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  {selectedItem.image}
                  {selectedItem.name}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="text-center text-6xl">{selectedItem.image}</div>
                <p className="text-gray-600">{selectedItem.description}</p>
                
                {selectedItem.stats && (
                  <div>
                    <h4 className="font-bold mb-2">Estadísticas:</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(selectedItem.stats).map(([stat, value]) => (
                        <div key={stat} className="flex justify-between">
                          <span className="capitalize">{stat}:</span>
                          <span className="font-bold text-green-600">+{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedItem.effects && (
                  <div>
                    <h4 className="font-bold mb-2">Efectos:</h4>
                    <div className="space-y-1">
                      {selectedItem.effects.map((effect, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Sparkles className="w-3 h-3 text-blue-500" />
                          {effect}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-5 h-5 text-yellow-600" />
                    <span className="text-xl font-bold">{selectedItem.price}</span>
                  </div>
                  <Button
                    onClick={() => {
                      addToCart(selectedItem)
                      setShowItemDetails(false)
                    }}
                    disabled={!selectedItem.available}
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Agregar al carrito
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 