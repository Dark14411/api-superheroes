"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  Zap,
  Shield,
  Sparkles,
  Droplet,
  Apple,
  ShoppingBag,
  Package,
  Star,
  Coins,
  Settings,
  Home,
  PlusCircle,
  Play,
  Stethoscope,
  Bath,
  Crown,
  Users,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { SuperheroAvatar } from "@/components/superhero-avatar"
import { ModernPet } from "@/components/modern-pet"
import { EnhancedProgress } from "@/components/enhanced-progress"
import { ActionButton } from "@/components/action-button"
import unifiedApiClient, { type Hero, type Mascota as Pet, type GameItem } from "@/lib/unified-api-client"

interface FloatingEffect {
  id: number
  x: number
  y: number
  type: "heart" | "star" | "coin" | "sparkle" | "level_up" | "success" | "error"
  value?: string
}

interface ActionState {
  [key: string]: boolean
}

// Toast notification system
const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
  const toast = document.createElement("div")
  toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white font-medium max-w-sm shadow-lg ${
    type === "success" ? "bg-green-500" : type === "error" ? "bg-red-500" : "bg-blue-500"
  }`
  toast.textContent = message
  document.body.appendChild(toast)

  // Auto remove
  setTimeout(() => {
    if (document.body.contains(toast)) {
      document.body.removeChild(toast)
    }
  }, 4000)
}

// Componente de Item de la Tienda
const ShopItem = ({
  item,
  hero,
  onPurchase,
  isPurchasing,
}: {
  item: GameItem
  hero: Hero
  onPurchase: (itemId: string) => void
  isPurchasing: boolean
}) => {
  const canAfford = hero.coins >= item.price || item.isFree
  const rarityColors = {
    common: "from-gray-400 to-gray-500",
    rare: "from-blue-400 to-blue-500",
    epic: "from-purple-400 to-purple-500",
    legendary: "from-yellow-400 to-yellow-500",
  }

  return (
    <motion.div
      whileHover={{ scale: canAfford ? 1.02 : 1 }}
      whileTap={{ scale: canAfford ? 0.98 : 1 }}
      className="relative"
    >
      <Card
        className={`p-4 border-2 transition-all duration-200 ${
          canAfford ? "border-green-200 hover:border-green-300 hover:shadow-lg" : "border-red-200 opacity-60"
        }`}
      >
        {/* Indicador de rareza */}
        <div
          className={`absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r ${rarityColors[item.rarity]} rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg`}
        >
          {item.rarity === "legendary" && "★"}
          {item.rarity === "epic" && "◆"}
          {item.rarity === "rare" && "●"}
          {item.rarity === "common" && "○"}
        </div>

        {/* Icono del item */}
        <div className="text-4xl mb-2 text-center">{item.icon}</div>

        {/* Información del item */}
        <h3 className="font-bold text-gray-800 text-center mb-1">{item.name}</h3>
        <p className="text-xs text-gray-600 text-center mb-3 h-8">{item.description}</p>

        {/* Efectos */}
        <div className="flex flex-wrap gap-1 mb-3 justify-center">
          {Object.entries(item.effects).map(([stat, value]) => (
            <Badge key={stat} variant="secondary" className="text-xs">
              {stat === "hunger" && "🍽️"}
              {stat === "health" && "❤️"}
              {stat === "happiness" && "😊"}
              {stat === "energy" && "⚡"}
              {stat === "cleanliness" && "🛁"}
              {stat === "experience" && "⭐"}
              {value > 0 ? `+${value}` : value}
            </Badge>
          ))}
        </div>

        {/* Precio */}
        <div className="flex items-center justify-center gap-2 mb-3">
          {item.isFree ? (
            <Badge className="bg-green-500 text-white">GRATIS</Badge>
          ) : (
            <>
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className={`font-bold ${canAfford ? "text-green-600" : "text-red-500"}`}>{item.price}</span>
            </>
          )}
        </div>

        {/* Botón de compra */}
        <Button
          onClick={() => onPurchase(item.id)}
          disabled={!canAfford || isPurchasing}
          className={`w-full ${
            item.isFree
              ? "bg-green-500 hover:bg-green-600"
              : canAfford
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-gray-400"
          }`}
          size="sm"
        >
          {isPurchasing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : item.isFree ? (
            "Obtener Gratis"
          ) : canAfford ? (
            "Comprar"
          ) : (
            "Sin Monedas"
          )}
        </Button>
      </Card>
    </motion.div>
  )
}

// Componente de Item del Inventario
const InventoryItemComponent = ({
  item,
  inventoryItem,
  onUse,
  isUsing,
  disabled = false,
}: {
  item: GameItem
  inventoryItem: InventoryItem
  onUse: (itemId: string) => void
  isUsing: boolean
  disabled?: boolean
}) => {
  const getTooltipMessage = () => {
    if (disabled) return "Necesitas una mascota para usar este item"
    if (inventoryItem.quantity <= 0) return "No tienes más de este item"
    return `Usar ${item.name}`
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
            className={`relative ${disabled ? "opacity-50" : ""}`}
          >
            <Card className="p-3 border hover:border-blue-300 transition-all">
              {/* Cantidad */}
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
                {inventoryItem.quantity}
              </div>

              {/* Icono */}
              <div className="text-3xl mb-2 text-center">{item.icon}</div>

              {/* Nombre */}
              <h4 className="font-semibold text-sm text-center mb-2">{item.name}</h4>

              {/* Efectos */}
              <div className="flex flex-wrap gap-1 mb-2 justify-center">
                {Object.entries(item.effects)
                  .slice(0, 2)
                  .map(([stat, value]) => (
                    <Badge key={stat} variant="outline" className="text-xs">
                      {stat === "hunger" && "🍽️"}
                      {stat === "health" && "❤️"}
                      {stat === "happiness" && "😊"}
                      {stat === "energy" && "⚡"}
                      {stat === "cleanliness" && "🛁"}
                      {value > 0 ? `+${value}` : value}
                    </Badge>
                  ))}
              </div>

              {/* Botón de uso */}
              <Button
                onClick={() => onUse(item.id)}
                disabled={disabled || isUsing || inventoryItem.quantity <= 0}
                className="w-full"
                size="sm"
                variant="outline"
              >
                {isUsing ? <Loader2 className="w-4 h-4 animate-spin" /> : "Usar"}
              </Button>
            </Card>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{getTooltipMessage()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Componente principal del juego
export default function Component() {
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null)
  const [heroPet, setHeroPet] = useState<Pet | null>(null)
  const [availablePets, setAvailablePets] = useState<Pet[]>([])
  const [shopItems, setShopItems] = useState<GameItem[]>([])
  const [floatingEffects, setFloatingEffects] = useState<FloatingEffect[]>([])
  const [actionStates, setActionStates] = useState<ActionState>({})
  const [currentView, setCurrentView] = useState<"home" | "shop" | "adoption" | "inventory" | "create">("home")
  const [loading, setLoading] = useState(true)

  // Estados de modales
  const [showHeroCreation, setShowHeroCreation] = useState(false)
  const [showPetCustomization, setShowPetCustomization] = useState(false)
  const [showHeroCustomization, setShowHeroCustomization] = useState(false)

  // Estados de creación de héroe
  const [newHero, setNewHero] = useState({
    name: "",
    superpower: "Super Strength",
    bodyColor: "#4F46E5",
    capeColor: "#DC2626",
    maskColor: "#1F2937",
    symbol: "⭐",
    costume: "classic",
  })

  // Agregar efecto flotante
  const addFloatingEffect = useCallback((type: FloatingEffect["type"], value?: string) => {
    const newEffect: FloatingEffect = {
      id: Date.now() + Math.random(),
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      type,
      value,
    }
    setFloatingEffects((prev) => [...prev, newEffect])
    setTimeout(() => {
      setFloatingEffects((prev) => prev.filter((effect) => effect.id !== newEffect.id))
    }, 2000)
  }, [])

  // Manejar acciones con loading y feedback mejorado
  const handleAction = useCallback(
    async (actionKey: string, apiCall: () => Promise<any>, effectType: FloatingEffect["type"] = "success") => {
      if (actionStates[actionKey]) return

      setActionStates((prev) => ({ ...prev, [actionKey]: true }))

      try {
        const response = await apiCall()

        if (response.success) {
          // Efectos visuales inmediatos
          addFloatingEffect(effectType, response.effects?.coins ? `+${response.effects.coins}` : undefined)
          showToast(response.message, "success")

          // Actualizar datos según el tipo de respuesta
          if (response.data?.hero) {
            setSelectedHero(response.data.hero)
            setHeroes((prev) => prev.map((h) => (h.id === response.data.hero.id ? response.data.hero : h)))
          }
          if (response.data?.pet) {
            setHeroPet(response.data.pet)
          }
          if (response.data && !response.data.hero && !response.data.pet) {
            // Es un héroe o mascota directamente
            if (response.data.superpower) {
              setSelectedHero(response.data)
              setHeroes((prev) => prev.map((h) => (h.id === response.data.id ? response.data : h)))
            } else if (response.data.type) {
              setHeroPet(response.data)
            }
          }

          // Efectos adicionales basados en los cambios
          if (response.effects) {
            Object.entries(response.effects).forEach(([stat, value]) => {
              if (value > 0) {
                setTimeout(() => addFloatingEffect("success", `+${value} ${stat}`), 200)
              }
            })
          }
        } else {
          addFloatingEffect("error")
          showToast(response.message, "error")
        }
      } catch (error) {
        addFloatingEffect("error")
        showToast("¡Algo salió mal! Inténtalo de nuevo.", "error")
      } finally {
        setActionStates((prev) => ({ ...prev, [actionKey]: false }))
      }
    },
    [actionStates, addFloatingEffect],
  )

  // Crear nuevo héroe
  const createHero = async () => {
    if (!newHero.name.trim()) {
      showToast("Por favor ingresa un nombre para tu héroe", "error")
      return
    }

    await handleAction("create-hero", () => heroAPI.createHero(newHero), "level_up")
    setShowHeroCreation(false)
    setNewHero({
      name: "",
      superpower: "Super Strength",
      bodyColor: "#4F46E5",
      capeColor: "#DC2626",
      maskColor: "#1F2937",
      symbol: "⭐",
      costume: "classic",
    })
  }

  // Comprar item
  const purchaseItem = async (itemId: string) => {
    if (!selectedHero) return
    await handleAction(`purchase-${itemId}`, () => itemAPI.purchaseItem(selectedHero.id, itemId), "coin")
  }

  // Usar item
  const useItem = async (itemId: string) => {
    if (!selectedHero || !heroPet) return
    await handleAction(`use-${itemId}`, () => itemAPI.useItem(selectedHero.id, heroPet.id, itemId), "heart")
  }

  // Adoptar mascota
  const adoptPet = async (petId: string) => {
    if (!selectedHero) return
    await handleAction(
      `adopt-${petId}`,
      async () => {
        const response = await petAPI.adoptPet(selectedHero.id, petId)
        if (response.success) {
          // Actualizar lista de mascotas disponibles
          setAvailablePets((prev) => prev.filter((p) => p.id !== petId))
          // Asociar mascota al héroe
          await heroAPI.associatePet(selectedHero.id, petId)
        }
        return response
      },
      "heart",
    )
  }

  // Acciones SIEMPRE disponibles con tooltips contextuales
  const getActionTooltip = (action: string, pet: Pet) => {
    switch (action) {
      case "feed":
        return pet.hunger >= 95
          ? "Tu mascota ya está muy satisfecha, pero siempre disfruta la comida"
          : "Alimentar a tu mascota"
      case "play":
        return pet.energy <= 10
          ? "Tu mascota está cansada, pero siempre tiene energía para jugar contigo"
          : "Jugar con tu mascota"
      case "heal":
        return pet.health >= 95
          ? "Tu mascota ya está muy sana, pero el cuidado extra siempre es bueno"
          : "Curar a tu mascota"
      case "clean":
        return pet.cleanliness >= 95 ? "Tu mascota ya está muy limpia, pero disfruta el baño" : "Bañar a tu mascota"
      default:
        return ""
    }
  }

  // Alimentar mascota - SIEMPRE disponible
  const feedPet = async (itemId = "basic-food") => {
    if (!heroPet) return
    await handleAction(`feed-${itemId}`, () => petAPI.feedPet(heroPet.id, itemId), "heart")
  }

  // Jugar con mascota - SIEMPRE disponible
  const playWithPet = async (itemId?: string) => {
    if (!heroPet) return
    await handleAction(`play-${itemId || "basic"}`, () => petAPI.playWithPet(heroPet.id, itemId), "star")
  }

  // Curar mascota - SIEMPRE disponible
  const healPet = async (itemId = "health-potion") => {
    if (!heroPet) return
    await handleAction(`heal-${itemId}`, () => petAPI.healPet(heroPet.id, itemId), "sparkle")
  }

  // Limpiar mascota - SIEMPRE disponible
  const cleanPet = async (itemId = "soap") => {
    if (!heroPet) return
    await handleAction(`clean-${itemId}`, () => petAPI.cleanPet(heroPet.id, itemId), "sparkle")
  }

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [heroesRes, petsRes, itemsRes] = await Promise.all([
          heroAPI.getHeroes(),
          petAPI.getAvailablePets(),
          itemAPI.getItems(),
        ])

        if (heroesRes.success && heroesRes.data) {
          setHeroes(heroesRes.data)
          if (heroesRes.data.length > 0) {
            const firstHero = heroesRes.data[0]
            setSelectedHero(firstHero)

            // Cargar mascota del héroe si tiene una
            if (firstHero.petId) {
              const petRes = await petAPI.getPets()
              if (petRes.success && petRes.data) {
                const pet = petRes.data.find((p) => p.id === firstHero.petId)
                if (pet) setHeroPet(pet)
              }
            }
          }
        }

        if (petsRes.success && petsRes.data) {
          setAvailablePets(petsRes.data)
        }

        if (itemsRes.success && itemsRes.data) {
          setShopItems(itemsRes.data)
        }
      } catch (error) {
        console.error("Error loading initial data:", error)
        showToast("Error al cargar los datos", "error")
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4" />
          </motion.div>
          <p className="text-lg text-gray-600">Cargando Academia de Superhéroes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 relative overflow-hidden">
      {/* Fondo animado mejorado */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-10"
            style={{
              background: `linear-gradient(45deg, #4F46E5, #DC2626)`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
              rotate: [0, 360],
            }}
            transition={{
              duration: 15 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Header mejorado */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <motion.h1
            className="text-3xl font-bold text-gray-800"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
          >
            🦸‍♂️ Academia de Superhéroes
          </motion.h1>
          {selectedHero && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
              {selectedHero.name} - Nivel {selectedHero.level}
            </Badge>
          )}
        </div>

        <div className="flex items-center gap-3">
          {selectedHero && (
            <motion.div
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg"
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            >
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-bold text-gray-800">{selectedHero.coins}</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Navegación mejorada */}
      <div className="relative z-10 px-4 mb-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl p-4">
          <div className="flex justify-center gap-2">
            {[
              { key: "home", icon: Home, label: "Inicio" },
              { key: "shop", icon: ShoppingBag, label: "Tienda" },
              { key: "adoption", icon: Heart, label: "Adopción" },
              { key: "inventory", icon: Package, label: "Inventario" },
              { key: "create", icon: PlusCircle, label: "Crear Héroe" },
            ].map(({ key, icon: Icon, label }) => (
              <Button
                key={key}
                variant={currentView === key ? "default" : "ghost"}
                onClick={() => setCurrentView(key as any)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      {/* Vista Principal */}
      {currentView === "home" && selectedHero && (
        <div className="relative z-10 px-4">
          {/* Área del personaje principal */}
          <div className="flex justify-center items-center mb-8">
            <div className="flex items-center gap-12">
              {/* Superhéroe */}
              <div className="text-center">
                <SuperheroAvatar
                  hero={selectedHero}
                  size="large"
                  isAnimating={Object.values(actionStates).some(Boolean)}
                  onClick={() => setShowHeroCustomization(true)}
                />
                <Button variant="outline" size="sm" onClick={() => setShowHeroCustomization(true)} className="mt-4">
                  <Settings className="w-4 h-4 mr-2" />
                  Personalizar
                </Button>
              </div>

              {/* Mascota */}
              {heroPet ? (
                <div className="text-center">
                  <ModernPet
                    pet={heroPet}
                    size="large"
                    isAnimating={Object.values(actionStates).some(Boolean)}
                    onClick={() => setShowPetCustomization(true)}
                  />
                  <Button variant="outline" size="sm" onClick={() => setShowPetCustomization(true)} className="mt-4">
                    <Crown className="w-4 h-4 mr-2" />
                    Personalizar
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-32 h-32 border-4 border-dashed border-gray-300 rounded-full flex items-center justify-center mb-4">
                    <div className="text-center">
                      <Users className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">Sin Mascota</p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setCurrentView("adoption")}
                    className="bg-gradient-to-r from-pink-500 to-pink-600"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Adoptar
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Estadísticas del héroe */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl p-6 mb-6">
            <h3 className="text-xl font-bold text-center mb-4">Estadísticas de {selectedHero.name}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: Heart, label: "Salud", value: selectedHero.health, color: "text-red-500" },
                { icon: Zap, label: "Energía", value: selectedHero.energy, color: "text-yellow-500" },
                { icon: Shield, label: "Fuerza", value: selectedHero.strength, color: "text-blue-500" },
                { icon: Sparkles, label: "Felicidad", value: selectedHero.happiness, color: "text-purple-500" },
              ].map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="text-center">
                  <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
                  <div className="text-xs text-gray-600 mb-1">{label}</div>
                  <EnhancedProgress value={value} className="mb-1" />
                  <div className="text-sm font-bold text-gray-800">{value}%</div>
                </div>
              ))}
            </div>
          </Card>

          {/* Estadísticas de la mascota */}
          {heroPet && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl p-6 mb-6">
              <h3 className="text-xl font-bold text-center mb-4">Estado de {heroPet.name}</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { icon: Heart, label: "Salud", value: heroPet.health, color: "text-red-500" },
                  { icon: Zap, label: "Energía", value: heroPet.energy, color: "text-yellow-500" },
                  { icon: Sparkles, label: "Felicidad", value: heroPet.happiness, color: "text-purple-500" },
                  { icon: Apple, label: "Hambre", value: heroPet.hunger, color: "text-green-500" },
                  { icon: Droplet, label: "Limpieza", value: heroPet.cleanliness, color: "text-blue-500" },
                ].map(({ icon: Icon, label, value, color }) => (
                  <div key={label} className="text-center">
                    <Icon className={`w-6 h-6 ${color} mx-auto mb-2`} />
                    <div className="text-xs text-gray-600 mb-1">{label}</div>
                    <EnhancedProgress value={value} className="mb-1" />
                    <div className="text-sm font-bold text-gray-800">{value}%</div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Acciones rápidas SIEMPRE disponibles */}
          {heroPet && (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl p-6">
              <h3 className="text-xl font-bold text-center mb-4">Acciones Rápidas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <ActionButton
                  icon={Apple}
                  label="Alimentar"
                  onClick={() => feedPet()}
                  loading={actionStates["feed-basic-food"]}
                  variant="success"
                  tooltip={getActionTooltip("feed", heroPet)}
                />

                <ActionButton
                  icon={Play}
                  label="Jugar"
                  onClick={() => playWithPet()}
                  loading={actionStates["play-basic"]}
                  variant="primary"
                  tooltip={getActionTooltip("play", heroPet)}
                />

                <ActionButton
                  icon={Stethoscope}
                  label="Curar"
                  onClick={() => healPet()}
                  loading={actionStates["heal-health-potion"]}
                  variant="warning"
                  tooltip={getActionTooltip("heal", heroPet)}
                />

                <ActionButton
                  icon={Bath}
                  label="Bañar"
                  onClick={() => cleanPet()}
                  loading={actionStates["clean-soap"]}
                  variant="secondary"
                  tooltip={getActionTooltip("clean", heroPet)}
                />
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Vista de Tienda */}
      {currentView === "shop" && (
        <div className="relative z-10 px-4">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-center mb-6">🛍️ Tienda de Items</h2>

            <Tabs defaultValue="Alimentación" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="Alimentación">Comida</TabsTrigger>
                <TabsTrigger value="Medicina">Medicina</TabsTrigger>
                <TabsTrigger value="Juguetes">Juguetes</TabsTrigger>
                <TabsTrigger value="Limpieza">Limpieza</TabsTrigger>
              </TabsList>

              {["Alimentación", "Medicina", "Juguetes", "Limpieza"].map((category) => (
                <TabsContent key={category} value={category}>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {shopItems
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <ShopItem
                          key={item.id}
                          item={item}
                          hero={selectedHero!}
                          onPurchase={purchaseItem}
                          isPurchasing={actionStates[`purchase-${item.id}`] || false}
                        />
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </Card>
        </div>
      )}

      {/* Vista de Adopción */}
      {currentView === "adoption" && (
        <div className="relative z-10 px-4">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-center mb-6">🏠 Centro de Adopción</h2>

            {availablePets.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600">No hay mascotas disponibles para adopción</p>
                <p className="text-sm text-gray-500">¡Vuelve pronto para ver nuevos compañeros!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {availablePets.map((pet) => (
                  <motion.div key={pet.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Card className="p-6 border-2 border-pink-200 hover:border-pink-300 transition-all">
                      <div className="text-center mb-4">
                        <ModernPet pet={pet} size="medium" />
                      </div>

                      <h3 className="text-lg font-bold text-center mb-2">{pet.name}</h3>
                      <p className="text-sm text-gray-600 text-center mb-2 capitalize">{pet.breed}</p>
                      <Badge className="w-full justify-center mb-4">Nivel {pet.level}</Badge>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <EnhancedProgress value={pet.health} className="flex-1" />
                          <span className="text-xs">{pet.health}%</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          <EnhancedProgress value={pet.happiness} className="flex-1" />
                          <span className="text-xs">{pet.happiness}%</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 mb-4">
                        <Coins className="w-5 h-5 text-yellow-500" />
                        <span className="text-lg font-bold text-yellow-600">{pet.price}</span>
                      </div>

                      <Button
                        onClick={() => adoptPet(pet.id)}
                        disabled={!selectedHero || selectedHero.coins < pet.price || actionStates[`adopt-${pet.id}`]}
                        className="w-full bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700"
                      >
                        {actionStates[`adopt-${pet.id}`] ? (
                          <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Heart className="w-4 h-4 mr-2" />
                        )}
                        Adoptar
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Vista de Inventario */}
      {currentView === "inventory" && selectedHero && (
        <div className="relative z-10 px-4">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl p-6">
            <h2 className="text-2xl font-bold text-center mb-6">🎒 Inventario</h2>

            {selectedHero.items.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600">Tu inventario está vacío</p>
                <p className="text-sm text-gray-500">¡Ve a la tienda para comprar items!</p>
                <Button
                  onClick={() => setCurrentView("shop")}
                  className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Ir a la Tienda
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {selectedHero.items.map((inventoryItem) => {
                  const item = shopItems.find((i) => i.id === inventoryItem.itemId)
                  if (!item) return null

                  return (
                    <InventoryItemComponent
                      key={inventoryItem.itemId}
                      item={item}
                      inventoryItem={inventoryItem}
                      onUse={useItem}
                      isUsing={actionStates[`use-${item.id}`] || false}
                      disabled={!heroPet}
                    />
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Vista de Creación de Héroe */}
      {currentView === "create" && (
        <div className="relative z-10 px-4">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-6">🦸‍♂️ Crear Nuevo Héroe</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Vista previa */}
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4">Vista Previa</h3>
                <SuperheroAvatar
                  hero={{
                    ...newHero,
                    id: "preview",
                    level: 1,
                    health: 100,
                    energy: 100,
                    strength: 50,
                    happiness: 80,
                    experience: 0,
                    maxExperience: 100,
                    coins: 500,
                    items: [],
                    achievements: [],
                    lastActive: "Ahora",
                    totalPlayTime: 0,
                    createdAt: new Date().toISOString(),
                  }}
                  size="large"
                />
              </div>

              {/* Formulario */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="heroName">Nombre del Héroe</Label>
                  <Input
                    id="heroName"
                    value={newHero.name}
                    onChange={(e) => setNewHero((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Captain Thunder"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="superpower">Superpoder</Label>
                  <Select
                    value={newHero.superpower}
                    onValueChange={(value) => setNewHero((prev) => ({ ...prev, superpower: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Super Strength">Super Fuerza</SelectItem>
                      <SelectItem value="Lightning Control">Control de Rayos</SelectItem>
                      <SelectItem value="Fire Control">Control de Fuego</SelectItem>
                      <SelectItem value="Ice Powers">Poderes de Hielo</SelectItem>
                      <SelectItem value="Telekinesis">Telequinesis</SelectItem>
                      <SelectItem value="Super Speed">Súper Velocidad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Color del Traje</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {["#4F46E5", "#DC2626", "#059669", "#7C2D12", "#7C3AED", "#DB2777"].map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-12 h-12 rounded-full border-4 ${
                          newHero.bodyColor === color ? "border-gray-800" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewHero((prev) => ({ ...prev, bodyColor: color }))}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Color de la Capa</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {["#DC2626", "#059669", "#7C2D12", "#4F46E5", "#7C3AED", "#DB2777"].map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-12 h-12 rounded-full border-4 ${
                          newHero.capeColor === color ? "border-gray-800" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewHero((prev) => ({ ...prev, capeColor: color }))}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Símbolo</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {["⭐", "⚡", "🔥", "❄️", "💎", "🛡️"].map((symbol) => (
                      <motion.button
                        key={symbol}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-12 h-12 rounded-lg border-2 text-2xl ${
                          newHero.symbol === symbol ? "border-blue-500 bg-blue-50" : "border-gray-300"
                        }`}
                        onClick={() => setNewHero((prev) => ({ ...prev, symbol }))}
                      >
                        {symbol}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={createHero}
                  disabled={!newHero.name.trim() || actionStates["create-hero"]}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-12"
                >
                  {actionStates["create-hero"] ? (
                    <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  ) : (
                    <PlusCircle className="w-5 h-5 mr-2" />
                  )}
                  Crear Héroe
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Efectos flotantes mejorados */}
      <AnimatePresence>
        {floatingEffects.map((effect) => (
          <motion.div
            key={effect.id}
            className="fixed pointer-events-none z-50"
            initial={{
              x: `${effect.x}%`,
              y: `${effect.y}%`,
              opacity: 1,
              scale: 0,
            }}
            animate={{
              y: `${effect.y - 30}%`,
              opacity: 0,
              scale: 1.5,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            {effect.type === "heart" && <Heart className="w-8 h-8 text-red-500 drop-shadow-lg" />}
            {effect.type === "star" && <Star className="w-8 h-8 text-yellow-500 drop-shadow-lg" />}
            {effect.type === "coin" && (
              <div className="flex items-center gap-1 bg-yellow-400 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
                <Coins className="w-4 h-4" />
                {effect.value}
              </div>
            )}
            {effect.type === "sparkle" && <Sparkles className="w-8 h-8 text-purple-500 drop-shadow-lg" />}
            {effect.type === "success" && <CheckCircle className="w-8 h-8 text-green-500 drop-shadow-lg" />}
            {effect.type === "error" && <AlertCircle className="w-8 h-8 text-red-500 drop-shadow-lg" />}
            {effect.type === "level_up" && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                ¡NIVEL UP!
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Modales de personalización */}
      <Dialog open={showHeroCustomization} onOpenChange={setShowHeroCustomization}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>🦸‍♂️ Personalizar Héroe</DialogTitle>
          </DialogHeader>

          {selectedHero && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <SuperheroAvatar hero={selectedHero} size="large" />
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Color del Traje</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["#4F46E5", "#DC2626", "#059669", "#7C2D12", "#7C3AED", "#DB2777"].map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-12 h-12 rounded-full border-4 ${
                          selectedHero.bodyColor === color ? "border-gray-800" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setSelectedHero((prev) => (prev ? { ...prev, bodyColor: color } : null))
                          addFloatingEffect("sparkle")
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Color de la Capa</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["#DC2626", "#059669", "#7C2D12", "#4F46E5", "#7C3AED", "#DB2777"].map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-12 h-12 rounded-full border-4 ${
                          selectedHero.capeColor === color ? "border-gray-800" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setSelectedHero((prev) => (prev ? { ...prev, capeColor: color } : null))
                          addFloatingEffect("sparkle")
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Símbolo</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {["⭐", "⚡", "🔥", "❄️", "💎", "🛡️"].map((symbol) => (
                      <motion.button
                        key={symbol}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-12 h-12 rounded-lg border-2 text-2xl ${
                          selectedHero.symbol === symbol ? "border-blue-500 bg-blue-50" : "border-gray-300"
                        }`}
                        onClick={() => {
                          setSelectedHero((prev) => (prev ? { ...prev, symbol } : null))
                          addFloatingEffect("star")
                        }}
                      >
                        {symbol}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={() => setShowHeroCustomization(false)}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showPetCustomization} onOpenChange={setShowPetCustomization}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>🐕 Personalizar Mascota</DialogTitle>
          </DialogHeader>

          {heroPet && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center">
                <ModernPet pet={heroPet} size="large" />
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="petName">Nombre</Label>
                  <Input
                    id="petName"
                    value={heroPet.name}
                    onChange={(e) => setHeroPet((prev) => (prev ? { ...prev, name: e.target.value } : null))}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label>Color Principal</Label>
                  <div className="grid grid-cols-4 gap-2 mt-2">
                    {["#D2691E", "#8B4513", "#F5DEB3", "#FFFFFF", "#000000", "#CD853F"].map((color) => (
                      <motion.button
                        key={color}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`w-12 h-12 rounded-full border-4 ${
                          heroPet.primaryColor === color ? "border-gray-800" : "border-gray-300"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => {
                          setHeroPet((prev) => (prev ? { ...prev, primaryColor: color } : null))
                          addFloatingEffect("heart")
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Accesorios</Label>
                  <div className="space-y-3 mt-2">
                    <div>
                      <Label className="text-sm">Collar</Label>
                      <Select
                        value={heroPet.accessories.collar || "none"}
                        onValueChange={(value) => {
                          setHeroPet((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  accessories: { ...prev.accessories, collar: value === "none" ? undefined : value },
                                }
                              : null,
                          )
                          addFloatingEffect("star")
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin collar</SelectItem>
                          <SelectItem value="basic-collar">Collar básico</SelectItem>
                          <SelectItem value="lightning-collar">Collar relámpago</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="text-sm">Sombrero</Label>
                      <Select
                        value={heroPet.accessories.hat || "none"}
                        onValueChange={(value) => {
                          setHeroPet((prev) =>
                            prev
                              ? {
                                  ...prev,
                                  accessories: { ...prev.accessories, hat: value === "none" ? undefined : value },
                                }
                              : null,
                          )
                          addFloatingEffect("star")
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Sin sombrero</SelectItem>
                          <SelectItem value="superhero-cap">Gorra de superhéroe</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => setShowPetCustomization(false)}
                  className="w-full bg-gradient-to-r from-pink-500 to-pink-600"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
