"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Trophy, 
  Star, 
  Coins, 
  Heart, 
  Zap, 
  Gamepad2,
  ShoppingBag,
  Palette,
  Clock,
  Target,
  Crown,
  Gift,
  Check,
  Lock
} from "lucide-react"

// Tipos para logros
interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  category: 'care' | 'games' | 'shopping' | 'customization' | 'special'
  type: 'single' | 'progressive'
  target: number
  current: number
  reward: {
    coins: number
    items?: string[]
  }
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlocked: boolean
}

// Datos de logros predefinidos
const achievementsData: Achievement[] = [
  // Logros de cuidado
  {
    id: 'first_click',
    title: 'Primer Toque',
    description: 'Interactúa con tu Pou por primera vez',
    icon: '👋',
    category: 'care',
    type: 'single',
    target: 1,
    current: 0,
    reward: { coins: 50 },
    rarity: 'common',
    unlocked: false
  },
  {
    id: 'happy_pou',
    title: 'Pou Feliz',
    description: 'Mantén la felicidad de tu Pou en 90% o más',
    icon: '😊',
    category: 'care',
    type: 'single',
    target: 1,
    current: 0,
    reward: { coins: 100 },
    rarity: 'common',
    unlocked: false
  },
  {
    id: 'click_master',
    title: 'Maestro del Click',
    description: 'Haz click en tu Pou 100 veces',
    icon: '👆',
    category: 'care',
    type: 'progressive',
    target: 100,
    current: 0,
    reward: { coins: 200 },
    rarity: 'rare',
    unlocked: false
  },
  {
    id: 'perfect_stats',
    title: 'Perfección Total',
    description: 'Alcanza 100% en salud, felicidad y energía',
    icon: '💯',
    category: 'care',
    type: 'single',
    target: 1,
    current: 0,
    reward: { coins: 500 },
    rarity: 'epic',
    unlocked: false
  },

  // Logros de juegos
  {
    id: 'first_game',
    title: 'Primer Jugador',
    description: 'Completa tu primer mini-juego',
    icon: '🎮',
    category: 'games',
    type: 'single',
    target: 1,
    current: 0,
    reward: { coins: 75 },
    rarity: 'common',
    unlocked: false
  },
  {
    id: 'memory_expert',
    title: 'Experto en Memoria',
    description: 'Completa el juego de memoria sin errores',
    icon: '🧠',
    category: 'games',
    type: 'single',
    target: 1,
    current: 0,
    reward: { coins: 150 },
    rarity: 'rare',
    unlocked: false
  },
  {
    id: 'jumping_champion',
    title: 'Campeón de Saltos',
    description: 'Alcanza 500 puntos en el juego de saltos',
    icon: '🦘',
    category: 'games',
    type: 'single',
    target: 500,
    current: 0,
    reward: { coins: 200 },
    rarity: 'rare',
    unlocked: false
  },
  {
    id: 'speed_demon',
    title: 'Demonio de Velocidad',
    description: 'Consigue 20 aciertos en el juego de velocidad',
    icon: '⚡',
    category: 'games',
    type: 'single',
    target: 20,
    current: 0,
    reward: { coins: 175 },
    rarity: 'rare',
    unlocked: false
  },

  // Logros de compras
  {
    id: 'first_purchase',
    title: 'Primera Compra',
    description: 'Compra tu primer item en la tienda',
    icon: '🛒',
    category: 'shopping',
    type: 'single',
    target: 1,
    current: 0,
    reward: { coins: 100 },
    rarity: 'common',
    unlocked: false
  },
  {
    id: 'big_spender',
    title: 'Gran Gastador',
    description: 'Gasta 1000 monedas en total',
    icon: '💰',
    category: 'shopping',
    type: 'progressive',
    target: 1000,
    current: 0,
    reward: { coins: 300 },
    rarity: 'epic',
    unlocked: false
  },
  {
    id: 'collector',
    title: 'Coleccionista',
    description: 'Posee 10 items diferentes',
    icon: '📦',
    category: 'shopping',
    type: 'progressive',
    target: 10,
    current: 0,
    reward: { coins: 250 },
    rarity: 'rare',
    unlocked: false
  },

  // Logros de personalización
  {
    id: 'style_guru',
    title: 'Gurú del Estilo',
    description: 'Cambia el color de tu Pou por primera vez',
    icon: '🎨',
    category: 'customization',
    type: 'single',
    target: 1,
    current: 0,
    reward: { coins: 80 },
    rarity: 'common',
    unlocked: false
  },
  {
    id: 'rainbow_master',
    title: 'Maestro Arcoíris',
    description: 'Usa todos los colores disponibles',
    icon: '🌈',
    category: 'customization',
    type: 'progressive',
    target: 8,
    current: 0,
    reward: { coins: 400 },
    rarity: 'epic',
    unlocked: false
  },

  // Logros especiales
  {
    id: 'millionaire',
    title: 'Millonario',
    description: 'Acumula 5000 monedas',
    icon: '💎',
    category: 'special',
    type: 'single',
    target: 5000,
    current: 0,
    reward: { coins: 1000 },
    rarity: 'legendary',
    unlocked: false
  },
  {
    id: 'completionist',
    title: 'Completista',
    description: 'Desbloquea todos los demás logros',
    icon: '👑',
    category: 'special',
    type: 'single',
    target: 1,
    current: 0,
    reward: { coins: 2000, items: ['crown'] },
    rarity: 'legendary',
    unlocked: false
  }
]

// Componente para mostrar un logro individual
const AchievementCard = ({ 
  achievement, 
  onClaim 
}: { 
  achievement: Achievement
  onClaim: (achievement: Achievement) => void
}) => {
  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return 'from-yellow-400 to-orange-500'
      case 'epic': return 'from-purple-400 to-pink-500'
      case 'rare': return 'from-blue-400 to-cyan-500'
      default: return 'from-gray-400 to-slate-500'
    }
  }

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return { text: 'Legendario', color: 'bg-yellow-500' }
      case 'epic': return { text: 'Épico', color: 'bg-purple-500' }
      case 'rare': return { text: 'Raro', color: 'bg-blue-500' }
      default: return { text: 'Común', color: 'bg-gray-500' }
    }
  }

  const progress = achievement.type === 'progressive' ? 
    Math.min(100, (achievement.current / achievement.target) * 100) : 
    achievement.unlocked ? 100 : 0

  const isCompleted = achievement.type === 'single' ? 
    achievement.unlocked : 
    achievement.current >= achievement.target

  const rarityBadge = getRarityBadge(achievement.rarity)

  return (
    <motion.div
      className="relative"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className={`p-4 ${isCompleted ? `bg-gradient-to-br ${getRarityColor(achievement.rarity)} text-white` : 'bg-white opacity-70'}`}>
        <div className="flex items-start gap-3">
          <div className="text-3xl flex-shrink-0">
            {isCompleted ? achievement.icon : '🔒'}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-bold ${isCompleted ? 'text-white' : 'text-gray-800'}`}>
                {achievement.title}
              </h3>
              <Badge className={`${rarityBadge.color} text-white text-xs`}>
                {rarityBadge.text}
              </Badge>
            </div>
            
            <p className={`text-sm mb-3 ${isCompleted ? 'text-white/90' : 'text-gray-600'}`}>
              {achievement.description}
            </p>

            {/* Progreso */}
            {achievement.type === 'progressive' && (
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className={isCompleted ? 'text-white/90' : 'text-gray-600'}>
                    Progreso
                  </span>
                  <span className={isCompleted ? 'text-white' : 'text-gray-800'}>
                    {achievement.current}/{achievement.target}
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {/* Recompensa */}
            <div className="flex items-center gap-2">
              <Coins className={`w-4 h-4 ${isCompleted ? 'text-yellow-200' : 'text-yellow-500'}`} />
              <span className={`text-sm font-medium ${isCompleted ? 'text-white' : 'text-gray-700'}`}>
                +{achievement.reward.coins} monedas
              </span>
              {achievement.reward.items && achievement.reward.items.length > 0 && (
                <Badge variant="secondary" className="text-xs">
                  +{achievement.reward.items.length} items
                </Badge>
              )}
            </div>
          </div>

          {/* Estado */}
          <div className="flex-shrink-0">
            {isCompleted ? (
              achievement.unlocked ? (
                <Badge className="bg-green-500">
                  <Check className="w-3 h-3 mr-1" />
                  Reclamado
                </Badge>
              ) : (
                <Button
                  size="sm"
                  onClick={() => onClaim(achievement)}
                  className="bg-green-500 hover:bg-green-600"
                >
                  ¡Reclamar!
                </Button>
              )
            ) : (
              <Lock className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Componente principal de logros
export default function Achievements({ 
  gameState,
  onClaimReward 
}: { 
  gameState: any
  onClaimReward: (coins: number, items?: string[]) => void
}) {
  const [achievements, setAchievements] = useState<Achievement[]>(achievementsData)
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [showClaimAnimation, setShowClaimAnimation] = useState<Achievement | null>(null)

  // Actualizar progreso de logros basado en el estado del juego
  useEffect(() => {
    setAchievements(prev => prev.map(achievement => {
      let newCurrent = achievement.current

      switch (achievement.id) {
        case 'happy_pou':
          newCurrent = gameState.pouStats.happiness >= 90 ? 1 : 0
          break
        case 'perfect_stats':
          newCurrent = (gameState.pouStats.health >= 100 && 
                       gameState.pouStats.happiness >= 100 && 
                       gameState.pouStats.energy >= 100) ? 1 : 0
          break
        case 'millionaire':
          newCurrent = gameState.coins >= 5000 ? 1 : 0
          break
        case 'collector':
          newCurrent = gameState.inventory?.length || 0
          break
        // Agregar más lógica según sea necesario
      }

      return { ...achievement, current: newCurrent }
    }))
  }, [gameState])

  const handleClaimAchievement = (achievement: Achievement) => {
    setAchievements(prev => prev.map(a => 
      a.id === achievement.id ? { ...a, unlocked: true } : a
    ))

    onClaimReward(achievement.reward.coins, achievement.reward.items)
    setShowClaimAnimation(achievement)
    setTimeout(() => setShowClaimAnimation(null), 3000)
  }

  const categories = [
    { id: 'all', name: 'Todos', icon: Trophy },
    { id: 'care', name: 'Cuidado', icon: Heart },
    { id: 'games', name: 'Juegos', icon: Gamepad2 },
    { id: 'shopping', name: 'Compras', icon: ShoppingBag },
    { id: 'customization', name: 'Personalización', icon: Palette },
    { id: 'special', name: 'Especiales', icon: Crown }
  ]

  const filteredAchievements = selectedCategory === 'all' ? 
    achievements : 
    achievements.filter(a => a.category === selectedCategory)

  const totalAchievements = achievements.length
  const unlockedAchievements = achievements.filter(a => a.unlocked).length
  const completedAchievements = achievements.filter(a => 
    a.type === 'single' ? a.current >= a.target : a.current >= a.target
  ).length

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">🏆 Logros</h2>
        <p className="text-gray-600 mb-4 sm:mb-6 px-4">
          Completa desafíos y gana recompensas increíbles
        </p>
        
        {/* Estadísticas de progreso */}
        <div className="grid grid-cols-3 gap-4 mb-6 max-w-md mx-auto">
          <Card className="p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{unlockedAchievements}</div>
            <div className="text-xs text-gray-600">Reclamados</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{completedAchievements}</div>
            <div className="text-xs text-gray-600">Completados</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-2xl font-bold text-purple-600">{totalAchievements}</div>
            <div className="text-xs text-gray-600">Total</div>
          </Card>
        </div>
      </div>

      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
          {categories.map((category) => (
            <TabsTrigger 
              key={category.id} 
              value={category.id} 
              className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
            >
              <category.icon className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredAchievements.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              onClaim={handleClaimAchievement}
            />
          ))}
        </div>
      </Tabs>

      {/* Animación de logro reclamado */}
      <AnimatePresence>
        {showClaimAnimation && (
          <motion.div
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
          >
            <Card className="p-8 bg-gradient-to-br from-yellow-400 to-orange-500 text-white text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-2xl font-bold mb-2">¡Logro Desbloqueado!</h3>
              <p className="text-xl mb-4">{showClaimAnimation.title}</p>
              <div className="flex items-center justify-center gap-2">
                <Coins className="w-6 h-6" />
                <span className="text-lg font-bold">+{showClaimAnimation.reward.coins} monedas</span>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 