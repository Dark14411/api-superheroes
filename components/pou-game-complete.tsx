"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  Zap,
  Apple,
  Sparkles,
  Bath,
  Bed,
  Shirt,
  Gamepad2,
  Home,
  ShoppingCart,
  Trophy,
  Settings,
  Volume2,
  VolumeX,
  Coins,
  Star,
  Gift,
  Camera,
  Palette,
  Crown,
  Gem,
  Clock,
  Target,
  Puzzle,
  Calculator,
  Music,
  Car,
  Plane,
  Utensils,
  Coffee,
  Candy,
  Cookie,
  IceCream,
  Cake,
  Pizza,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Check,
  X,
  Smile
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

// Interfaces del juego
interface PouStats {
  health: number
  happiness: number
  hunger: number
  energy: number
  cleanliness: number
  level: number
  experience: number
  coins: number
}

interface PouCustomization {
  body_color: string
  eyes: string
  mouth: string
  accessories: string[]
  room_background: string
  room_items: string[]
}

interface MiniGame {
  id: string
  name: string
  description: string
  icon: any
  difficulty: 'easy' | 'medium' | 'hard'
  reward_coins: number
  reward_xp: number
  unlocked_at_level: number
}

interface StoreItem {
  id: string
  name: string
  description: string
  price: number
  type: 'food' | 'accessory' | 'room' | 'potion'
  icon: any
  effect?: {
    health?: number
    happiness?: number
    hunger?: number
    energy?: number
    cleanliness?: number
  }
}

export default function PouGameComplete() {
  // Estados principales del Pou
  const [pouStats, setPouStats] = useState<PouStats>({
    health: 80,
    happiness: 75,
    hunger: 60,
    energy: 70,
    cleanliness: 85,
    level: 3,
    experience: 45,
    coins: 250
  })

  const [pouCustomization, setPouCustomization] = useState<PouCustomization>({
    body_color: '#8B5CF6',
    eyes: 'happy',
    mouth: 'smile',
    accessories: [],
    room_background: 'default',
    room_items: ['bed', 'plant']
  })

  // Estados de la interfaz
  const [activeTab, setActiveTab] = useState('home')
  const [currentRoom, setCurrentRoom] = useState('living_room')
  const [isPlaying, setIsPlaying] = useState(false)
  const [selectedMiniGame, setSelectedMiniGame] = useState<MiniGame | null>(null)
  const [gameTimer, setGameTimer] = useState(0)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showStore, setShowStore] = useState(false)
  const [inventory, setInventory] = useState<string[]>(['apple', 'soap', 'energy_drink'])

  // Estados del mini-juego activo
  const [gameState, setGameState] = useState<any>({})

  // Timer para decrementar stats
  const statsTimer = useRef<NodeJS.Timeout>()

  // Datos del juego
  const rooms = [
    { id: 'living_room', name: 'Sala', icon: Home, bg: 'from-blue-100 to-blue-200' },
    { id: 'kitchen', name: 'Cocina', icon: Utensils, bg: 'from-yellow-100 to-yellow-200' },
    { id: 'bathroom', name: 'Baño', icon: Bath, bg: 'from-cyan-100 to-cyan-200' },
    { id: 'bedroom', name: 'Dormitorio', icon: Bed, bg: 'from-purple-100 to-purple-200' },
    { id: 'game_room', name: 'Juegos', icon: Gamepad2, bg: 'from-green-100 to-green-200' }
  ]

  const foods: StoreItem[] = [
    { id: 'apple', name: 'Manzana', description: 'Comida saludable', price: 10, type: 'food', icon: Apple, effect: { hunger: 15, health: 5 } },
    { id: 'pizza', name: 'Pizza', description: 'Comida deliciosa', price: 25, type: 'food', icon: Pizza, effect: { hunger: 30, happiness: 10 } },
    { id: 'cake', name: 'Pastel', description: 'Postre especial', price: 40, type: 'food', icon: Cake, effect: { hunger: 20, happiness: 25 } },
    { id: 'candy', name: 'Dulces', description: 'Golosinas coloridas', price: 15, type: 'food', icon: Candy, effect: { hunger: 10, happiness: 15 } },
    { id: 'ice_cream', name: 'Helado', description: 'Refrescante y dulce', price: 20, type: 'food', icon: IceCream, effect: { hunger: 15, happiness: 20 } },
    { id: 'cookie', name: 'Galletas', description: 'Crujientes y dulces', price: 12, type: 'food', icon: Cookie, effect: { hunger: 12, happiness: 8 } }
  ]

  const potions: StoreItem[] = [
    { id: 'soap', name: 'Jabón', description: 'Para limpiar a Pou', price: 15, type: 'potion', icon: Sparkles, effect: { cleanliness: 40 } },
    { id: 'energy_drink', name: 'Bebida Energética', description: 'Restaura energía', price: 30, type: 'potion', icon: Zap, effect: { energy: 50 } },
    { id: 'medicine', name: 'Medicina', description: 'Cura a Pou', price: 50, type: 'potion', icon: Heart, effect: { health: 80 } },
    { id: 'happiness_potion', name: 'Poción de Felicidad', description: 'Hace feliz a Pou', price: 35, type: 'potion', icon: Star, effect: { happiness: 60 } }
  ]

  const accessories: StoreItem[] = [
    { id: 'hat', name: 'Sombrero', description: 'Sombrero genial', price: 100, type: 'accessory', icon: Crown },
    { id: 'glasses', name: 'Lentes', description: 'Lentes cool', price: 80, type: 'accessory', icon: Gem },
    { id: 'bow_tie', name: 'Corbatín', description: 'Elegante corbatín', price: 60, type: 'accessory', icon: Gift }
  ]

  const miniGames: MiniGame[] = [
    { id: 'memory', name: 'Memoria', description: 'Encuentra las parejas', icon: Puzzle, difficulty: 'easy', reward_coins: 20, reward_xp: 10, unlocked_at_level: 1 },
    { id: 'math', name: 'Matemáticas', description: 'Resuelve operaciones', icon: Calculator, difficulty: 'medium', reward_coins: 30, reward_xp: 15, unlocked_at_level: 2 },
    { id: 'reaction', name: 'Reacción', description: 'Toca cuando aparezca', icon: Target, difficulty: 'hard', reward_coins: 50, reward_xp: 25, unlocked_at_level: 3 },
    { id: 'music', name: 'Música', description: 'Sigue el ritmo', icon: Music, difficulty: 'medium', reward_coins: 35, reward_xp: 18, unlocked_at_level: 2 },
    { id: 'driving', name: 'Conducir', description: 'Evita obstáculos', icon: Car, difficulty: 'hard', reward_coins: 45, reward_xp: 22, unlocked_at_level: 4 },
    { id: 'flying', name: 'Volar', description: 'Esquiva las nubes', icon: Plane, difficulty: 'hard', reward_coins: 55, reward_xp: 28, unlocked_at_level: 5 }
  ]

  // Efecto para decrementar stats con el tiempo
  useEffect(() => {
    statsTimer.current = setInterval(() => {
      setPouStats(prev => ({
        ...prev,
        hunger: Math.max(0, prev.hunger - 0.5),
        energy: Math.max(0, prev.energy - 0.3),
        happiness: prev.hunger < 20 ? Math.max(0, prev.happiness - 0.4) : prev.happiness,
        cleanliness: Math.max(0, prev.cleanliness - 0.2),
        health: prev.hunger < 10 || prev.cleanliness < 10 ? Math.max(0, prev.health - 0.6) : Math.min(100, prev.health + 0.1)
      }))
    }, 2000) // Cada 2 segundos

    return () => {
      if (statsTimer.current) clearInterval(statsTimer.current)
    }
  }, [])

  // Funciones de interacción con Pou
  const feedPou = useCallback((food: StoreItem) => {
    if (!food.effect || pouStats.coins < food.price) return

    setPouStats(prev => ({
      ...prev,
      hunger: Math.min(100, prev.hunger + (food.effect?.hunger || 0)),
      happiness: Math.min(100, prev.happiness + (food.effect?.happiness || 0)),
      health: Math.min(100, prev.health + (food.effect?.health || 0)),
      coins: prev.coins - food.price,
      experience: prev.experience + 5
    }))

    toast.success(`¡Pou comió ${food.name}!`)
    checkLevelUp()
  }, [pouStats.coins])

  const usePotionOnPou = useCallback((potion: StoreItem) => {
    if (!potion.effect || pouStats.coins < potion.price) return

    setPouStats(prev => ({
      ...prev,
      cleanliness: Math.min(100, prev.cleanliness + (potion.effect?.cleanliness || 0)),
      energy: Math.min(100, prev.energy + (potion.effect?.energy || 0)),
      health: Math.min(100, prev.health + (potion.effect?.health || 0)),
      happiness: Math.min(100, prev.happiness + (potion.effect?.happiness || 0)),
      coins: prev.coins - potion.price,
      experience: prev.experience + 3
    }))

    toast.success(`¡Usaste ${potion.name} en Pou!`)
    checkLevelUp()
  }, [pouStats.coins])

  const petPou = () => {
    setPouStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + 5),
      experience: prev.experience + 2
    }))
    toast.success("¡Pou está feliz!")
  }

  const putPouToSleep = () => {
    if (currentRoom !== 'bedroom') {
      toast.error("Lleva a Pou al dormitorio para dormir")
      return
    }
    
    setPouStats(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 30),
      happiness: Math.min(100, prev.happiness + 10),
      experience: prev.experience + 8
    }))
    toast.success("¡Pou durmió bien!")
  }

  const checkLevelUp = () => {
    const expNeeded = pouStats.level * 50
    if (pouStats.experience >= expNeeded) {
      setPouStats(prev => ({
        ...prev,
        level: prev.level + 1,
        experience: prev.experience - expNeeded,
        coins: prev.coins + prev.level * 20
      }))
      toast.success(`¡Pou subió al nivel ${pouStats.level + 1}!`)
    }
  }

  // Componente del Pou animado
  const AnimatedPou = () => {
    const getEmoticon = () => {
      if (pouStats.health < 20) return "😵"
      if (pouStats.hunger < 20) return "😋"
      if (pouStats.happiness > 80) return "😄"
      if (pouStats.energy < 20) return "😴"
      if (pouStats.cleanliness < 20) return "🤢"
      return "😊"
    }

    const getPouSize = () => {
      return 80 + (pouStats.level * 5) // Pou crece con el nivel
    }

    return (
      <motion.div
        className="relative flex items-center justify-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={petPou}
        animate={{
          y: [0, -10, 0],
        }}
        transition={{
          y: {
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }}
      >
        {/* Cuerpo de Pou */}
        <div
          className="rounded-full relative cursor-pointer shadow-lg"
          style={{
            width: getPouSize(),
            height: getPouSize(),
            backgroundColor: pouCustomization.body_color,
            background: `linear-gradient(45deg, ${pouCustomization.body_color}, ${pouCustomization.body_color}99)`
          }}
        >
          {/* Ojos */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 flex gap-2">
            <div className="w-3 h-3 bg-black rounded-full"></div>
            <div className="w-3 h-3 bg-black rounded-full"></div>
          </div>
          
          {/* Boca */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2">
            <div className="text-2xl">{getEmoticon()}</div>
          </div>

          {/* Accesorios */}
          {pouCustomization.accessories.includes('hat') && (
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <Crown className="w-6 h-6 text-yellow-500" />
            </div>
          )}

          {/* Efectos de estado */}
          {pouStats.happiness > 90 && (
            <motion.div
              className="absolute -top-4 -right-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </motion.div>
          )}

          {pouStats.health < 20 && (
            <motion.div
              className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-red-500"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>

        {/* Nombre y nivel */}
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="font-bold text-lg">Pou</div>
          <Badge variant="secondary">Nivel {pouStats.level}</Badge>
        </div>
      </motion.div>
    )
  }

  // Componente de estadísticas
  const StatsPanel = () => (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500" />
          Estado de Pou
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Heart className="w-4 h-4 text-red-500" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Salud</span>
                <span className="text-sm font-medium">{Math.round(pouStats.health)}%</span>
              </div>
              <Progress value={pouStats.health} className="h-2" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Smile className="w-4 h-4 text-green-500" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Felicidad</span>
                <span className="text-sm font-medium">{Math.round(pouStats.happiness)}%</span>
              </div>
              <Progress value={pouStats.happiness} className="h-2" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Apple className="w-4 h-4 text-orange-500" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Hambre</span>
                <span className="text-sm font-medium">{Math.round(pouStats.hunger)}%</span>
              </div>
              <Progress value={pouStats.hunger} className="h-2" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Zap className="w-4 h-4 text-yellow-500" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Energía</span>
                <span className="text-sm font-medium">{Math.round(pouStats.energy)}%</span>
              </div>
              <Progress value={pouStats.energy} className="h-2" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Sparkles className="w-4 h-4 text-blue-500" />
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm">Limpieza</span>
                <span className="text-sm font-medium">{Math.round(pouStats.cleanliness)}%</span>
              </div>
              <Progress value={pouStats.cleanliness} className="h-2" />
            </div>
          </div>
        </div>

        {/* XP y monedas */}
        <div className="pt-3 border-t">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm">Experiencia</span>
            <span className="text-sm font-medium">{pouStats.experience}/{pouStats.level * 50} XP</span>
          </div>
          <Progress value={(pouStats.experience / (pouStats.level * 50)) * 100} className="h-2 mb-3" />
          
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-yellow-500" />
              <span className="font-bold">{pouStats.coins}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-blue-500" />
              <span className="font-bold">Nivel {pouStats.level}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Componente de habitación
  const RoomView = () => {
    const room = rooms.find(r => r.id === currentRoom)
    if (!room) return null

    return (
      <Card className="flex-1">
        <CardContent className="p-8">
          <div className={`min-h-[400px] rounded-xl bg-gradient-to-br ${room.bg} relative flex items-center justify-center`}>
            {/* Decoración de habitación */}
            <div className="absolute inset-0 opacity-20">
              {currentRoom === 'bedroom' && (
                <div className="absolute bottom-4 left-4">
                  <Bed className="w-16 h-16 text-purple-600" />
                </div>
              )}
              {currentRoom === 'kitchen' && (
                <div className="absolute bottom-4 right-4">
                  <Coffee className="w-16 h-16 text-brown-600" />
                </div>
              )}
              {currentRoom === 'bathroom' && (
                <div className="absolute bottom-4 left-4">
                  <Bath className="w-16 h-16 text-cyan-600" />
                </div>
              )}
            </div>

            {/* Pou en el centro */}
            <AnimatedPou />

            {/* Acciones específicas de la habitación */}
            <div className="absolute bottom-4 right-4 flex gap-2">
              {currentRoom === 'bedroom' && (
                <Button onClick={putPouToSleep} size="sm">
                  <Bed className="w-4 h-4 mr-1" />
                  Dormir
                </Button>
              )}
              {currentRoom === 'bathroom' && pouStats.coins >= 15 && (
                <Button onClick={() => usePotionOnPou(potions[0])} size="sm">
                  <Bath className="w-4 h-4 mr-1" />
                  Limpiar
                </Button>
              )}
              {currentRoom === 'kitchen' && (
                <Button onClick={() => setShowStore(true)} size="sm">
                  <Apple className="w-4 h-4 mr-1" />
                  Alimentar
                </Button>
              )}
            </div>
          </div>

          {/* Navegación de habitaciones */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentIndex = rooms.findIndex(r => r.id === currentRoom)
                const prevIndex = currentIndex > 0 ? currentIndex - 1 : rooms.length - 1
                setCurrentRoom(rooms[prevIndex].id)
              }}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex items-center gap-2">
              <room.icon className="w-5 h-5" />
              <span className="font-medium">{room.name}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const currentIndex = rooms.findIndex(r => r.id === currentRoom)
                const nextIndex = currentIndex < rooms.length - 1 ? currentIndex + 1 : 0
                setCurrentRoom(rooms[nextIndex].id)
              }}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Componente de mini-juegos
  const MiniGamesView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {miniGames.map((game) => (
        <Card key={game.id} className={`cursor-pointer transition-all hover:shadow-lg ${pouStats.level >= game.unlocked_at_level ? '' : 'opacity-50'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <game.icon className="w-5 h-5" />
              {game.name}
              {pouStats.level < game.unlocked_at_level && (
                <Badge variant="secondary">Nivel {game.unlocked_at_level}</Badge>
              )}
            </CardTitle>
            <CardDescription>{game.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-3">
              <Badge variant={game.difficulty === 'easy' ? 'default' : game.difficulty === 'medium' ? 'secondary' : 'destructive'}>
                {game.difficulty}
              </Badge>
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className="text-sm">{game.reward_coins}</span>
                <Star className="w-4 h-4 text-blue-500" />
                <span className="text-sm">{game.reward_xp}</span>
              </div>
            </div>
            <Button
              className="w-full"
              disabled={pouStats.level < game.unlocked_at_level}
              onClick={() => setSelectedMiniGame(game)}
            >
              <Play className="w-4 h-4 mr-1" />
              Jugar
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  // Componente de tienda
  const StoreView = () => (
    <Dialog open={showStore} onOpenChange={setShowStore}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Tienda de Pou
          </DialogTitle>
          <DialogDescription>
            Compra comida y objetos para cuidar a tu Pou
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="food" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="food">Comida</TabsTrigger>
            <TabsTrigger value="potions">Pociones</TabsTrigger>
            <TabsTrigger value="accessories">Accesorios</TabsTrigger>
          </TabsList>

          <TabsContent value="food" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {foods.map((food) => (
                <Card key={food.id} className="cursor-pointer hover:shadow-lg">
                  <CardContent className="p-4 text-center">
                    <food.icon className="w-12 h-12 mx-auto mb-2 text-orange-500" />
                    <h3 className="font-semibold">{food.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{food.description}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-yellow-600">{food.price} 🪙</span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={pouStats.coins < food.price}
                      onClick={() => feedPou(food)}
                    >
                      Comprar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="potions" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {potions.map((potion) => (
                <Card key={potion.id} className="cursor-pointer hover:shadow-lg">
                  <CardContent className="p-4 text-center">
                    <potion.icon className="w-12 h-12 mx-auto mb-2 text-blue-500" />
                    <h3 className="font-semibold">{potion.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{potion.description}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-yellow-600">{potion.price} 🪙</span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={pouStats.coins < potion.price}
                      onClick={() => usePotionOnPou(potion)}
                    >
                      Usar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="accessories" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {accessories.map((accessory) => (
                <Card key={accessory.id} className="cursor-pointer hover:shadow-lg">
                  <CardContent className="p-4 text-center">
                    <accessory.icon className="w-12 h-12 mx-auto mb-2 text-purple-500" />
                    <h3 className="font-semibold">{accessory.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{accessory.description}</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-yellow-600">{accessory.price} 🪙</span>
                    </div>
                    <Button
                      size="sm"
                      className="w-full"
                      disabled={pouStats.coins < accessory.price || pouCustomization.accessories.includes(accessory.id)}
                    >
                      {pouCustomization.accessories.includes(accessory.id) ? 'Equipado' : 'Comprar'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <span className="text-2xl">🐾</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Mi Pou
                </h1>
                <p className="text-gray-600">¡Cuida a tu mascota virtual!</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                <Coins className="w-4 h-4 text-yellow-600" />
                <span className="font-bold">{pouStats.coins}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs principales */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="home" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Casa
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Juegos
            </TabsTrigger>
            <TabsTrigger value="store" className="flex items-center gap-2">
              <ShoppingCart className="w-4 h-4" />
              Tienda
            </TabsTrigger>
            <TabsTrigger value="customize" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Personalizar
            </TabsTrigger>
          </TabsList>

          {/* Tab Casa */}
          <TabsContent value="home" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <RoomView />
              </div>
              <div>
                <StatsPanel />
              </div>
            </div>
          </TabsContent>

          {/* Tab Juegos */}
          <TabsContent value="games" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gamepad2 className="w-5 h-5" />
                  Mini-Juegos
                </CardTitle>
                <CardDescription>
                  Juega para ganar monedas y experiencia
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MiniGamesView />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Tienda */}
          <TabsContent value="store" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Tienda
                </CardTitle>
                <CardDescription>
                  Compra todo lo que necesita tu Pou
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setShowStore(true)} className="w-full" size="lg">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Abrir Tienda
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Personalizar */}
          <TabsContent value="customize" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Personalización
                </CardTitle>
                <CardDescription>
                  Cambia la apariencia de tu Pou
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Color de Pou</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {['#8B5CF6', '#EF4444', '#10B981', '#F59E0B', '#3B82F6', '#EC4899'].map((color) => (
                        <button
                          key={color}
                          className={`w-12 h-12 rounded-full border-4 ${pouCustomization.body_color === color ? 'border-gray-800' : 'border-gray-300'}`}
                          style={{ backgroundColor: color }}
                          onClick={() => setPouCustomization(prev => ({ ...prev, body_color: color }))}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-center">
                    <AnimatedPou />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Modal de tienda */}
        <StoreView />

        {/* Modal de mini-juego */}
        {selectedMiniGame && (
          <Dialog open={!!selectedMiniGame} onOpenChange={() => setSelectedMiniGame(null)}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <selectedMiniGame.icon className="w-5 h-5" />
                  {selectedMiniGame.name}
                </DialogTitle>
                <DialogDescription>
                  {selectedMiniGame.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="text-center py-8">
                <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                  <selectedMiniGame.icon className="w-12 h-12 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">¡Próximamente!</h3>
                <p className="text-gray-600 mb-4">
                  Este mini-juego se implementará en la siguiente actualización
                </p>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Coins className="w-4 h-4 text-yellow-500" />
                    <span>+{selectedMiniGame.reward_coins} monedas</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-blue-500" />
                    <span>+{selectedMiniGame.reward_xp} XP</span>
                  </div>
                </div>
                <Button onClick={() => setSelectedMiniGame(null)}>
                  Cerrar
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  )
} 