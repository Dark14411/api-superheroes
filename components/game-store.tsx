"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  ShoppingCart,
  Coins,
  Palette,
  Shirt,
  Crown,
  Star,
  Heart,
  Zap,
  Apple,
  Bath,
  Gamepad2,
  Sparkles,
  Gift,
  Lock,
  Check,
  TrendingUp,
  Clock,
  Package,
  Filter,
  Search,
  SortAsc,
  SortDesc,
  Award,
  Target,
  Users,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Tipos para items de la tienda
interface StoreItem {
  id: string
  name: string
  description: string
  price: number
  category: "color" | "accessory" | "food" | "toy" | "medicine" | "special"
  icon: string
  effect?: {
    health?: number
    happiness?: number
    energy?: number
    hunger?: number
    cleanliness?: number
  }
  rarity: "common" | "rare" | "epic" | "legendary"
  owned: boolean
  equipped?: boolean
}

// Tipos para personalización
interface Customization {
  bodyColor: string
  eyeColor: string
  accessory: string | null
  crown: string | null
  specialEffect: string | null
}

export default function GameStore({ 
  coins, 
  onPurchase, 
  onCustomize,
  currentCustomization 
}: {
  coins: number
  onPurchase: (item: StoreItem) => void
  onCustomize: (customization: Customization) => void
  currentCustomization: Customization
}) {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedItem, setSelectedItem] = useState<StoreItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"price" | "rarity" | "name">("name")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [showOwnedOnly, setShowOwnedOnly] = useState(false)
  const [showOffers, setShowOffers] = useState(false)

  // Items de la tienda
  const storeItems: StoreItem[] = [
    // Colores del cuerpo
    {
      id: "body_blue",
      name: "Azul Cielo",
      description: "Color azul brillante para el cuerpo",
      price: 50,
      category: "color",
      icon: "🔵",
      rarity: "common",
      owned: false
    },
    {
      id: "body_purple",
      name: "Púrpura Mágico",
      description: "Color púrpura místico",
      price: 75,
      category: "color",
      icon: "🟣",
      rarity: "rare",
      owned: false
    },
    {
      id: "body_gold",
      name: "Dorado Real",
      description: "Color dorado elegante",
      price: 150,
      category: "color",
      icon: "🟡",
      rarity: "epic",
      owned: false
    },
    {
      id: "body_rainbow",
      name: "Arcoíris",
      description: "Color arcoíris mágico",
      price: 300,
      category: "color",
      icon: "🌈",
      rarity: "legendary",
      owned: false
    },
    {
      id: "body_neon",
      name: "Neón Verde",
      description: "Color neón verde brillante",
      price: 200,
      category: "color",
      icon: "💚",
      rarity: "epic",
      owned: false
    },
    {
      id: "body_galaxy",
      name: "Galaxia",
      description: "Color galaxia con estrellas",
      price: 500,
      category: "color",
      icon: "🌌",
      rarity: "legendary",
      owned: false
    },

    // Accesorios
    {
      id: "hat_crown",
      name: "Corona Real",
      description: "Corona dorada para tu Pou",
      price: 200,
      category: "accessory",
      icon: "👑",
      rarity: "epic",
      owned: false
    },
    {
      id: "hat_wizard",
      name: "Sombrero de Mago",
      description: "Sombrero mágico con estrellas",
      price: 120,
      category: "accessory",
      icon: "🎩",
      rarity: "rare",
      owned: false
    },
    {
      id: "hat_party",
      name: "Gorro de Fiesta",
      description: "Gorro colorido para celebraciones",
      price: 80,
      category: "accessory",
      icon: "🎉",
      rarity: "common",
      owned: false
    },
    {
      id: "hat_santa",
      name: "Gorro de Santa",
      description: "Gorro navideño festivo",
      price: 100,
      category: "accessory",
      icon: "🎅",
      rarity: "rare",
      owned: false
    },
    {
      id: "hat_cowboy",
      name: "Sombrero de Vaquero",
      description: "Sombrero de vaquero clásico",
      price: 90,
      category: "accessory",
      icon: "🤠",
      rarity: "common",
      owned: false
    },
    {
      id: "hat_pirate",
      name: "Sombrero de Pirata",
      description: "Sombrero pirata con calavera",
      price: 150,
      category: "accessory",
      icon: "🏴‍☠️",
      rarity: "epic",
      owned: false
    },
    {
      id: "glasses_sun",
      name: "Gafas de Sol",
      description: "Gafas de sol estilosas",
      price: 60,
      category: "accessory",
      icon: "🕶️",
      rarity: "common",
      owned: false
    },
    {
      id: "glasses_nerd",
      name: "Gafas de Estudiante",
      description: "Gafas de estudiante inteligente",
      price: 70,
      category: "accessory",
      icon: "🤓",
      rarity: "common",
      owned: false
    },
    {
      id: "bow_tie",
      name: "Corbata de Moño",
      description: "Corbata elegante para ocasiones especiales",
      price: 85,
      category: "accessory",
      icon: "🎀",
      rarity: "rare",
      owned: false
    },

    // Comida especial
    {
      id: "food_super",
      name: "Súper Comida",
      description: "Comida que restaura +50 hambre y +20 felicidad",
      price: 100,
      category: "food",
      icon: "🍕",
      effect: { hunger: 50, happiness: 20 },
      rarity: "rare",
      owned: false
    },
    {
      id: "food_energy",
      name: "Bebida Energética",
      description: "Restaura +40 energía y +15 salud",
      price: 120,
      category: "food",
      icon: "🥤",
      effect: { energy: 40, health: 15 },
      rarity: "rare",
      owned: false
    },
    {
      id: "food_healing",
      name: "Poción de Curación",
      description: "Restaura +60 salud y +30 felicidad",
      price: 150,
      category: "food",
      icon: "🧪",
      effect: { health: 60, happiness: 30 },
      rarity: "epic",
      owned: false
    },
    {
      id: "food_cake",
      name: "Pastel de Cumpleaños",
      description: "Pastel que restaura +80 felicidad y +40 hambre",
      price: 200,
      category: "food",
      icon: "🎂",
      effect: { happiness: 80, hunger: 40 },
      rarity: "epic",
      owned: false
    },
    {
      id: "food_icecream",
      name: "Helado Mágico",
      description: "Helado que restaura +30 felicidad y +20 hambre",
      price: 80,
      category: "food",
      icon: "🍦",
      effect: { happiness: 30, hunger: 20 },
      rarity: "common",
      owned: false
    },
    {
      id: "food_sushi",
      name: "Sushi Premium",
      description: "Sushi que restaura +45 hambre y +25 felicidad",
      price: 130,
      category: "food",
      icon: "🍣",
      effect: { hunger: 45, happiness: 25 },
      rarity: "rare",
      owned: false
    },
    {
      id: "food_chocolate",
      name: "Chocolate Mágico",
      description: "Chocolate que restaura +35 felicidad y +15 energía",
      price: 95,
      category: "food",
      icon: "🍫",
      effect: { happiness: 35, energy: 15 },
      rarity: "rare",
      owned: false
    },

    // Juguetes
    {
      id: "toy_ball",
      name: "Pelota Mágica",
      description: "Pelota que aumenta +30 felicidad",
      price: 80,
      category: "toy",
      icon: "⚽",
      effect: { happiness: 30 },
      rarity: "common",
      owned: false
    },
    {
      id: "toy_puzzle",
      name: "Rompecabezas",
      description: "Aumenta +25 felicidad y +15 energía",
      price: 100,
      category: "toy",
      icon: "🧩",
      effect: { happiness: 25, energy: 15 },
      rarity: "rare",
      owned: false
    },
    {
      id: "toy_teddy",
      name: "Osito de Peluche",
      description: "Osito que aumenta +40 felicidad",
      price: 120,
      category: "toy",
      icon: "🧸",
      effect: { happiness: 40 },
      rarity: "rare",
      owned: false
    },
    {
      id: "toy_blocks",
      name: "Bloques de Construcción",
      description: "Bloques que aumentan +20 felicidad y +25 energía",
      price: 110,
      category: "toy",
      icon: "🧱",
      effect: { happiness: 20, energy: 25 },
      rarity: "common",
      owned: false
    },
    {
      id: "toy_robot",
      name: "Robot Mecánico",
      description: "Robot que aumenta +50 felicidad y +30 energía",
      price: 250,
      category: "toy",
      icon: "🤖",
      effect: { happiness: 50, energy: 30 },
      rarity: "epic",
      owned: false
    },
    {
      id: "toy_dragon",
      name: "Dragón de Juguete",
      description: "Dragón que aumenta +60 felicidad",
      price: 300,
      category: "toy",
      icon: "🐉",
      effect: { happiness: 60 },
      rarity: "legendary",
      owned: false
    },

    // Medicina
    {
      id: "medicine_vitamin",
      name: "Vitaminas",
      description: "Vitaminas que aumentan +20 salud y +10 energía",
      price: 90,
      category: "medicine",
      icon: "💊",
      effect: { health: 20, energy: 10 },
      rarity: "common",
      owned: false
    },
    {
      id: "medicine_super",
      name: "Súper Medicina",
      description: "Medicina que restaura +80 salud y +40 felicidad",
      price: 180,
      category: "medicine",
      icon: "🏥",
      effect: { health: 80, happiness: 40 },
      rarity: "epic",
      owned: false
    },
    {
      id: "medicine_elixir",
      name: "Elixir de Vida",
      description: "Elixir que restaura +100 salud y +50 felicidad",
      price: 350,
      category: "medicine",
      icon: "🧬",
      effect: { health: 100, happiness: 50 },
      rarity: "legendary",
      owned: false
    },

    // Efectos especiales
    {
      id: "effect_sparkles",
      name: "Efecto Brillante",
      description: "Añade brillos mágicos a tu Pou",
      price: 250,
      category: "special",
      icon: "✨",
      rarity: "epic",
      owned: false
    },
    {
      id: "effect_rainbow",
      name: "Arcoíris Mágico",
      description: "Efecto arcoíris especial",
      price: 400,
      category: "special",
      icon: "🌈",
      rarity: "legendary",
      owned: false
    },
    {
      id: "effect_fire",
      name: "Efecto de Fuego",
      description: "Añade llamas mágicas a tu Pou",
      price: 300,
      category: "special",
      icon: "🔥",
      rarity: "epic",
      owned: false
    },
    {
      id: "effect_ice",
      name: "Efecto de Hielo",
      description: "Añade cristales de hielo a tu Pou",
      price: 280,
      category: "special",
      icon: "❄️",
      rarity: "epic",
      owned: false
    },
    {
      id: "effect_lightning",
      name: "Efecto de Rayos",
      description: "Añade rayos eléctricos a tu Pou",
      price: 350,
      category: "special",
      icon: "⚡",
      rarity: "legendary",
      owned: false
    },
    {
      id: "effect_galaxy",
      name: "Efecto Galaxia",
      description: "Añade estrellas y galaxias a tu Pou",
      price: 500,
      category: "special",
      icon: "🌌",
      rarity: "legendary",
      owned: false
    }
  ]

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-500"
      case "rare": return "bg-blue-500"
      case "epic": return "bg-purple-500"
      case "legendary": return "bg-yellow-500"
      default: return "bg-gray-500"
    }
  }

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case "common": return "Común"
      case "rare": return "Raro"
      case "epic": return "Épico"
      case "legendary": return "Legendario"
      default: return "Común"
    }
  }

  // Ofertas especiales (items con descuento)
  const specialOffers = storeItems.filter(item => 
    item.price > 200 && Math.random() > 0.7
  ).map(item => ({
    ...item,
    originalPrice: item.price,
    price: Math.floor(item.price * 0.7), // 30% descuento
    isOffer: true
  }))

  // Filtrar y ordenar items
  let filteredItems = selectedCategory === "all" 
    ? storeItems 
    : storeItems.filter(item => item.category === selectedCategory)

  // Aplicar búsqueda
  if (searchTerm) {
    filteredItems = filteredItems.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }

  // Mostrar solo items comprados
  if (showOwnedOnly) {
    filteredItems = filteredItems.filter(item => item.owned)
  }

  // Mostrar ofertas especiales
  if (showOffers) {
    filteredItems = specialOffers
  }

  // Ordenar items
  filteredItems.sort((a, b) => {
    let comparison = 0
    
    switch (sortBy) {
      case "price":
        comparison = a.price - b.price
        break
      case "rarity":
        const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 }
        comparison = rarityOrder[a.rarity] - rarityOrder[b.rarity]
        break
      case "name":
        comparison = a.name.localeCompare(b.name)
        break
    }
    
    return sortOrder === "asc" ? comparison : -comparison
  })

  const handlePurchase = (item: StoreItem) => {
    if (coins >= item.price) {
      onPurchase(item)
      setSelectedItem(null)
    }
  }

  const handleCustomize = (item: StoreItem) => {
    if (item.category === "color") {
      const newCustomization = { ...currentCustomization, bodyColor: item.id }
      onCustomize(newCustomization)
    } else if (item.category === "accessory") {
      const newCustomization = { ...currentCustomization, accessory: item.id }
      onCustomize(newCustomization)
    } else if (item.category === "special") {
      const newCustomization = { ...currentCustomization, specialEffect: item.id }
      onCustomize(newCustomization)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header de la tienda */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
          <ShoppingCart className="w-8 h-8 text-blue-600" />
          Tienda del Juego
        </h1>
        <p className="text-gray-600 mb-4">Compra items para tus héroes y mascotas</p>
        
        {/* Monedas */}
        <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-lg">
          <Coins className="w-6 h-6 text-yellow-600" />
          <span className="text-xl font-bold text-yellow-700">{coins}</span>
          <span className="text-gray-600">monedas</span>
        </div>
      </div>

      <Tabs defaultValue="store" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="store">Tienda</TabsTrigger>
          <TabsTrigger value="customize">Personalizar</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-6">
          {/* Barra de búsqueda y filtros avanzados */}
          <div className="space-y-4">
            {/* Búsqueda */}
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <Button
                variant={showOffers ? "default" : "outline"}
                onClick={() => setShowOffers(!showOffers)}
                className="flex items-center gap-2"
              >
                <TrendingUp className="w-4 h-4" />
                Ofertas
              </Button>
              <Button
                variant={showOwnedOnly ? "default" : "outline"}
                onClick={() => setShowOwnedOnly(!showOwnedOnly)}
                className="flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Mis Items
              </Button>
            </div>

            {/* Ordenamiento */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Ordenar por:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "price" | "rarity" | "name")}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="name">Nombre</option>
                <option value="price">Precio</option>
                <option value="rarity">Rareza</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex items-center gap-1"
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>

            {/* Filtros de categoría */}
            <div className="flex flex-wrap gap-2 justify-center">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("all")}
              >
                Todos
              </Button>
              <Button
                variant={selectedCategory === "color" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("color")}
                className="flex items-center gap-2"
              >
                <Palette className="w-4 h-4" />
                Colores
              </Button>
              <Button
                variant={selectedCategory === "accessory" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("accessory")}
                className="flex items-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Accesorios
              </Button>
              <Button
                variant={selectedCategory === "food" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("food")}
                className="flex items-center gap-2"
              >
                <Apple className="w-4 h-4" />
                Comida
              </Button>
              <Button
                variant={selectedCategory === "toy" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("toy")}
                className="flex items-center gap-2"
              >
                <Gamepad2 className="w-4 h-4" />
                Juguetes
              </Button>
              <Button
                variant={selectedCategory === "medicine" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("medicine")}
                className="flex items-center gap-2"
              >
                <Heart className="w-4 h-4" />
                Medicina
              </Button>
              <Button
                variant={selectedCategory === "special" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("special")}
                className="flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Especiales
              </Button>
            </div>
          </div>

          {/* Grid de items */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="p-4 cursor-pointer hover:shadow-lg transition-shadow">
                  <div className="text-center space-y-3">
                    {/* Icono y rareza */}
                    <div className="relative">
                      <div className="text-4xl mb-2">{item.icon}</div>
                      <Badge 
                        className={`absolute -top-2 -right-2 ${getRarityColor(item.rarity)}`}
                        variant="secondary"
                      >
                        {getRarityText(item.rarity)}
                      </Badge>
                    </div>

                    {/* Información del item */}
                    <div>
                      <h3 className="font-bold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                    </div>

                    {/* Efectos si los tiene */}
                    {item.effect && (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {item.effect.health && (
                          <Badge variant="outline" className="text-xs">
                            <Heart className="w-3 h-3 mr-1" />
                            +{item.effect.health}
                          </Badge>
                        )}
                        {item.effect.happiness && (
                          <Badge variant="outline" className="text-xs">
                            <Star className="w-3 h-3 mr-1" />
                            +{item.effect.happiness}
                          </Badge>
                        )}
                        {item.effect.energy && (
                          <Badge variant="outline" className="text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            +{item.effect.energy}
                          </Badge>
                        )}
                        {item.effect.hunger && (
                          <Badge variant="outline" className="text-xs">
                            <Apple className="w-3 h-3 mr-1" />
                            +{item.effect.hunger}
                          </Badge>
                        )}
                        {item.effect.cleanliness && (
                          <Badge variant="outline" className="text-xs">
                            <Bath className="w-3 h-3 mr-1" />
                            +{item.effect.cleanliness}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Precio y botón */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {(item as any).isOffer ? (
                          <div className="flex items-center gap-1">
                            <span className="text-sm line-through text-gray-400">
                              {(item as any).originalPrice}
                            </span>
                            <Coins className="w-4 h-4 text-red-600" />
                            <span className="font-bold text-red-700">{item.price}</span>
                            <Badge variant="destructive" className="text-xs">
                              -30%
                            </Badge>
                          </div>
                        ) : (
                          <>
                            <Coins className="w-4 h-4 text-yellow-600" />
                            <span className="font-bold text-yellow-700">{item.price}</span>
                          </>
                        )}
                      </div>
                      
                      {item.owned ? (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="flex items-center gap-1"
                        >
                          <Check className="w-4 h-4" />
                          Comprado
                        </Button>
                      ) : coins >= item.price ? (
                        <Button
                          size="sm"
                          onClick={() => handlePurchase(item)}
                          className="flex items-center gap-1"
                        >
                          <ShoppingCart className="w-4 h-4" />
                          Comprar
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled
                          className="flex items-center gap-1"
                        >
                          <Lock className="w-4 h-4" />
                          Sin monedas
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="customize" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Personalizar Pou</h2>
            <p className="text-gray-600">Personaliza la apariencia de tu mascota virtual</p>
          </div>

          {/* Vista previa del personaje personalizado */}
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Vista Previa</h3>
            <div className="flex justify-center">
              <div className="relative w-32 h-32">
                {/* Cuerpo con color personalizado */}
                <div 
                  className={`w-32 h-32 rounded-full border-4 border-white shadow-2xl ${
                    currentCustomization.bodyColor === "body_blue" ? "bg-blue-400" :
                    currentCustomization.bodyColor === "body_purple" ? "bg-purple-400" :
                    currentCustomization.bodyColor === "body_gold" ? "bg-yellow-400" :
                    currentCustomization.bodyColor === "body_rainbow" ? "bg-gradient-to-r from-red-400 via-yellow-400 to-purple-400" :
                    "bg-gradient-to-br from-yellow-400 to-orange-400"
                  }`}
                />
                
                {/* Accesorios */}
                {currentCustomization.accessory && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-2xl">
                    {currentCustomization.accessory === "hat_crown" && "👑"}
                    {currentCustomization.accessory === "hat_wizard" && "🎩"}
                    {currentCustomization.accessory === "hat_party" && "🎉"}
                  </div>
                )}

                {/* Efectos especiales */}
                {currentCustomization.specialEffect && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    {currentCustomization.specialEffect === "effect_sparkles" && (
                      <div className="text-2xl animate-pulse">✨</div>
                    )}
                    {currentCustomization.specialEffect === "effect_rainbow" && (
                      <div className="text-2xl animate-bounce">🌈</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Opciones de personalización */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colores */}
            <Card className="p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Colores del Cuerpo
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {storeItems.filter(item => item.category === "color").map((item) => (
                  <Button
                    key={item.id}
                    variant={currentCustomization.bodyColor === item.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCustomize(item)}
                    className="flex items-center gap-2"
                  >
                    <span>{item.icon}</span>
                    <span className="text-xs">{item.name}</span>
                    {currentCustomization.bodyColor === item.id && (
                      <Check className="w-3 h-3" />
                    )}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Accesorios */}
            <Card className="p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Crown className="w-5 h-5" />
                Accesorios
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {storeItems.filter(item => item.category === "accessory").map((item) => (
                  <Button
                    key={item.id}
                    variant={currentCustomization.accessory === item.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCustomize(item)}
                    className="flex items-center gap-2"
                  >
                    <span>{item.icon}</span>
                    <span className="text-xs">{item.name}</span>
                    {currentCustomization.accessory === item.id && (
                      <Check className="w-3 h-3" />
                    )}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Efectos especiales */}
            <Card className="p-4">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Efectos Especiales
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {storeItems.filter(item => item.category === "special").map((item) => (
                  <Button
                    key={item.id}
                    variant={currentCustomization.specialEffect === item.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleCustomize(item)}
                    className="flex items-center gap-2"
                  >
                    <span>{item.icon}</span>
                    <span className="text-xs">{item.name}</span>
                    {currentCustomization.specialEffect === item.id && (
                      <Check className="w-3 h-3" />
                    )}
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Estadísticas de la Tienda</h2>
            <p className="text-gray-600">Revisa tu progreso y logros en la tienda</p>
          </div>

          {/* Estadísticas generales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {storeItems.filter(item => item.owned).length}
              </div>
              <div className="text-sm text-gray-600">Items Comprados</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {storeItems.filter(item => item.rarity === "legendary" && item.owned).length}
              </div>
              <div className="text-sm text-gray-600">Items Legendarios</div>
            </Card>
            <Card className="p-4 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {storeItems.filter(item => item.category === "special" && item.owned).length}
              </div>
              <div className="text-sm text-gray-600">Efectos Especiales</div>
            </Card>
          </div>

          {/* Progreso por categoría */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Progreso por Categoría</h3>
            <div className="space-y-3">
              {["color", "accessory", "food", "toy", "medicine", "special"].map(category => {
                const categoryItems = storeItems.filter(item => item.category === category)
                const ownedItems = categoryItems.filter(item => item.owned)
                const percentage = Math.round((ownedItems.length / categoryItems.length) * 100)
                
                return (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700 capitalize">
                        {category === "color" ? "Colores" :
                         category === "accessory" ? "Accesorios" :
                         category === "food" ? "Comida" :
                         category === "toy" ? "Juguetes" :
                         category === "medicine" ? "Medicina" : "Efectos Especiales"}
                      </span>
                      <span className="text-sm text-gray-600">
                        {ownedItems.length}/{categoryItems.length} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Logros */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Logros de Comprador</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "Primer Comprador",
                  description: "Compra tu primer item",
                  icon: "🎉",
                  achieved: storeItems.filter(item => item.owned).length >= 1,
                  requirement: "1 item"
                },
                {
                  title: "Coleccionista",
                  description: "Compra 10 items diferentes",
                  icon: "📦",
                  achieved: storeItems.filter(item => item.owned).length >= 10,
                  requirement: "10 items"
                },
                {
                  title: "Maestro de la Moda",
                  description: "Compra todos los accesorios",
                  icon: "👑",
                  achieved: storeItems.filter(item => item.category === "accessory" && item.owned).length === 
                           storeItems.filter(item => item.category === "accessory").length,
                  requirement: "Todos los accesorios"
                },
                {
                  title: "Chef Gourmet",
                  description: "Compra toda la comida especial",
                  icon: "🍕",
                  achieved: storeItems.filter(item => item.category === "food" && item.owned).length === 
                           storeItems.filter(item => item.category === "food").length,
                  requirement: "Toda la comida"
                },
                {
                  title: "Leyenda",
                  description: "Compra un item legendario",
                  icon: "⭐",
                  achieved: storeItems.filter(item => item.rarity === "legendary" && item.owned).length >= 1,
                  requirement: "1 item legendario"
                },
                {
                  title: "Mago de Efectos",
                  description: "Compra todos los efectos especiales",
                  icon: "✨",
                  achieved: storeItems.filter(item => item.category === "special" && item.owned).length === 
                           storeItems.filter(item => item.category === "special").length,
                  requirement: "Todos los efectos"
                }
              ].map((achievement, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    achievement.achieved 
                      ? "border-green-500 bg-green-50" 
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <h4 className={`font-bold ${
                        achievement.achieved ? "text-green-700" : "text-gray-700"
                      }`}>
                        {achievement.title}
                      </h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Requisito: {achievement.requirement}
                      </p>
                    </div>
                    {achievement.achieved && (
                      <Award className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 