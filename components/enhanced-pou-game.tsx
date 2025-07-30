"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  Zap,
  Apple,
  Gamepad2,
  Bath,
  Moon,
  Sparkles,
  Coins,
  Star,
  Gift,
  Droplet,
  Coffee,
  Pill,
  Smile,
  Loader2,
  Volume2,
  VolumeX,
  RotateCcw,
  ShoppingCart,
} from "lucide-react"
import GameStore from "./game-store"
import MiniGames from "./mini-games"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// Tipos para efectos visuales
interface FloatingEffect {
  id: number
  x: number
  y: number
  type: "heart" | "star" | "coin" | "sparkle" | "level_up" | "food" | "toy" | "magic"
  value?: string
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  type: "sparkle" | "bubble" | "dust"
  color: string
}

// Tipos para Pou
interface PouStats {
  health: number
  happiness: number
  energy: number
  hunger: number
  cleanliness: number
  level: number
  experience: number
  mood: string
}

// Componente del personaje Pou interactivo
const InteractivePou = ({
  stats,
  isAnimating = false,
  animation = "idle",
  onClick,
  onMouseMove,
  onMouseEnter,
  onMouseLeave,
}: {
  stats: PouStats
  isAnimating?: boolean
  animation?: "idle" | "eating" | "playing" | "sleeping" | "bathing" | "happy" | "sad" | "dancing" | "surprised"
  onClick?: () => void
  onMouseMove?: (e: React.MouseEvent) => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}) => {
  const getMoodColor = () => {
    switch (stats.mood) {
      case "happy": return "from-yellow-400 to-orange-400"
      case "content": return "from-green-400 to-emerald-400"
      case "sad": return "from-gray-400 to-slate-400"
      default: return "from-yellow-400 to-orange-400"
    }
  }

  const getAnimation = () => {
    switch (animation) {
      case "eating":
        return { scale: [1, 1.05, 1], y: [0, -2, 0] }
      case "playing":
        return { rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }
      case "sleeping":
        return { y: [0, -5, 0] }
      case "bathing":
        return { scale: [1, 0.95, 1] }
      case "happy":
        return { y: [0, -10, 0], scale: [1, 1.1, 1] }
      case "sad":
        return { y: [0, 2, 0] }
      case "dancing":
        return { 
          rotate: [0, 15, -15, 0], 
          scale: [1, 1.15, 1],
          y: [0, -8, 0]
        }
      case "surprised":
        return { 
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        }
      default:
        return isAnimating ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] } : {}
    }
  }

  const getEyeExpression = () => {
    switch (stats.mood) {
      case "happy": return { scale: 1.2, sparkle: true }
      case "sad": return { scale: 0.8, sparkle: false }
      default: return { scale: 1, sparkle: false }
    }
  }

  const eyeExpr = getEyeExpression()

  return (
    <motion.div
      className="relative w-40 h-40 cursor-pointer"
      animate={getAnimation()}
      transition={{ duration: 1, repeat: animation !== "idle" ? 3 : (isAnimating ? Number.POSITIVE_INFINITY : 0) }}
      onClick={onClick}
      onMouseMove={onMouseMove}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Sombra */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-black opacity-20 rounded-full blur-sm" />
      
      {/* Cuerpo principal */}
      <div className={`w-40 h-40 bg-gradient-to-br ${getMoodColor()} rounded-full relative flex items-center justify-center shadow-2xl border-4 border-white`}>
        
        {/* Brillo */}
        <div className="absolute top-6 left-8 w-6 h-6 bg-white rounded-full opacity-40" />
        
        {/* Ojos */}
        <div className="absolute top-12 flex gap-6">
          <motion.div
            className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
            animate={{ scale: eyeExpr.scale }}
          >
            <div className="w-3 h-3 bg-black rounded-full" />
            {eyeExpr.sparkle && (
              <motion.div
                className="absolute -top-1 -right-1 text-yellow-400 text-xs"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
              >
                ✨
              </motion.div>
            )}
          </motion.div>
          <motion.div
            className="w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md"
            animate={{ scale: eyeExpr.scale }}
          >
            <div className="w-3 h-3 bg-black rounded-full" />
            {eyeExpr.sparkle && (
              <motion.div
                className="absolute -top-1 -right-1 text-yellow-400 text-xs"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
              >
                ✨
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Boca */}
        <motion.div
          className={`absolute bottom-12 w-10 h-5 border-b-4 rounded-b-full ${
            stats.mood === "happy" ? "border-pink-500" :
            stats.mood === "sad" ? "border-gray-500" : "border-black"
          }`}
          animate={stats.mood === "happy" ? { scaleX: [1, 1.2, 1] } : {}}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Mejillas (cuando está feliz) */}
        {stats.mood === "happy" && (
          <>
            <motion.div
              className="absolute left-4 top-16 w-4 h-4 bg-pink-300 rounded-full opacity-60"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute right-4 top-16 w-4 h-4 bg-pink-300 rounded-full opacity-60"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
            />
          </>
        )}

        {/* Efectos especiales según animación */}
        {animation === "eating" && (
          <motion.div
            className="absolute top-8 right-8 text-2xl"
            animate={{ y: [0, -20], opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY }}
          >
            🍎
          </motion.div>
        )}

        {animation === "playing" && (
          <motion.div
            className="absolute -top-4 -right-4 text-xl"
            animate={{ rotate: [0, 360], scale: [1, 1.5, 1] }}
            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
          >
            ⚽
          </motion.div>
        )}

        {animation === "bathing" && (
          <>
            <motion.div
              className="absolute top-4 left-6 text-blue-400 text-sm"
              animate={{ y: [0, -15], opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0 }}
            >
              💧
            </motion.div>
            <motion.div
              className="absolute top-6 right-8 text-blue-400 text-sm"
              animate={{ y: [0, -15], opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.3 }}
            >
              💧
            </motion.div>
          </>
        )}

        {animation === "sleeping" && (
          <motion.div
            className="absolute -top-2 right-8 text-blue-300 text-lg"
            animate={{ x: [0, 10, 0], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            💤
          </motion.div>
        )}
      </div>

      {/* Indicador de nivel */}
      <div className="absolute -bottom-2 -left-2 bg-purple-600 text-white text-sm rounded-full w-10 h-10 flex items-center justify-center font-bold shadow-lg">
        {stats.level}
      </div>

               {/* Indicador de estado de ánimo */}
         <div className="absolute -top-2 -right-2 text-2xl">
           {stats.mood === "happy" ? "😊" : 
            stats.mood === "content" ? "😌" :
            stats.mood === "sad" ? "😢" : "😐"}
         </div>

         {/* Indicadores de estado */}
         {stats.hunger < 30 && (
           <motion.div
             className="absolute -top-2 -left-2 text-xl"
             animate={{ scale: [1, 1.2, 1] }}
             transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY }}
           >
             🍽️
           </motion.div>
         )}
         
         {stats.energy < 20 && (
           <motion.div
             className="absolute -bottom-2 -right-2 text-xl"
             animate={{ scale: [1, 1.2, 1] }}
             transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
           >
             ⚡
           </motion.div>
         )}
         
         {stats.cleanliness < 30 && (
           <motion.div
             className="absolute top-2 -left-2 text-lg"
             animate={{ scale: [1, 1.2, 1] }}
             transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
           >
             🧼
           </motion.div>
         )}
    </motion.div>
  )
}

// Componente de barras de estadísticas
const StatBar = ({ 
  label, 
  value, 
  maxValue = 100, 
  color, 
  icon: Icon 
}: { 
  label: string
  value: number
  maxValue?: number
  color: string
  icon: any 
}) => {
  const percentage = (value / maxValue) * 100
  
  // Determinar el color de la barra basado en el valor
  const getBarColor = () => {
    if (value < 20) return "bg-red-500"
    if (value < 40) return "bg-orange-500"
    if (value < 60) return "bg-yellow-500"
    return "bg-green-500"
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${color}`} />
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {value < 30 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5, repeat: Number.POSITIVE_INFINITY }}
            >
              ⚠️
            </motion.div>
          )}
        </div>
        <span className={`text-sm font-bold ${value < 30 ? 'text-red-600' : 'text-gray-600'}`}>
          {value}%
        </span>
      </div>
      <Progress value={percentage} className={`h-2 ${getBarColor()}`} />
    </div>
  )
}

// Componente principal del juego Pou mejorado
export default function EnhancedPouGame() {
  const [pouStats, setPouStats] = useState<PouStats>({
    health: 85,
    happiness: 90,
    energy: 75,
    hunger: 60,
    cleanliness: 80,
    level: 1,
    experience: 0,
    mood: "happy",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [floatingEffects, setFloatingEffects] = useState<FloatingEffect[]>([])
  const [particles, setParticles] = useState<Particle[]>([])
  const [currentAnimation, setCurrentAnimation] = useState<string>("idle")
  const [coins, setCoins] = useState(100)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showStatsDialog, setShowStatsDialog] = useState(false)
  const [clickCount, setClickCount] = useState(0)
  const [lastClickTime, setLastClickTime] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  // Estado para tienda y personalización
  const [showStore, setShowStore] = useState(false)
  const [showMiniGames, setShowMiniGames] = useState(false)
  const [customization, setCustomization] = useState({
    bodyColor: "default",
    eyeColor: "default",
    accessory: null,
    crown: null,
    specialEffect: null
  })
  const [inventory, setInventory] = useState<any[]>([])

  // Sistema de degradación automática más realista y efectos de exceso
  useEffect(() => {
    const interval = setInterval(() => {
      setParticles(prev => prev.filter(particle => particle.life > 0))
      
      // Sistema de degradación más agresivo y realista
      setPouStats(prev => {
        const newStats = { ...prev }
        
        // Reducir hambre más rápido (cada 5 segundos)
        newStats.hunger = Math.max(0, prev.hunger - 3)
        
        // Reducir energía gradualmente
        newStats.energy = Math.max(0, prev.energy - 2)
        
        // Reducir limpieza gradualmente
        newStats.cleanliness = Math.max(0, prev.cleanliness - 2)
        
        // Efectos de exceso - si las estadísticas están muy altas, pueden causar problemas
        if (prev.hunger > 95) {
          newStats.health = Math.max(0, prev.health - 2) // Demasiada comida enferma
          newStats.happiness = Math.max(0, prev.happiness - 3) // Se siente mal
        }
        
        if (prev.energy > 95) {
          newStats.happiness = Math.max(0, prev.happiness - 2) // Demasiada energía = hiperactivo
        }
        
        if (prev.cleanliness > 95) {
          newStats.happiness = Math.max(0, prev.happiness - 1) // Demasiada limpieza = obsesivo
        }
        
        // Reducir felicidad si las necesidades básicas están bajas
        if (prev.hunger < 30 || prev.energy < 20 || prev.cleanliness < 30) {
          newStats.happiness = Math.max(0, prev.happiness - 1)
        }
        
        // Reducir salud si las necesidades están muy bajas
        if (prev.hunger < 15 || prev.energy < 10 || prev.cleanliness < 15) {
          newStats.health = Math.max(0, prev.health - 1)
        }
        
        // Actualizar estado de ánimo basado en las estadísticas
        const avgStats = (newStats.hunger + newStats.energy + newStats.cleanliness + newStats.happiness) / 4
        if (avgStats > 80 && newStats.hunger < 90 && newStats.energy < 90 && newStats.cleanliness < 90) {
          newStats.mood = "happy"
        } else if (avgStats > 50) {
          newStats.mood = "content"
        } else {
          newStats.mood = "sad"
        }
        
        return newStats
      })
    }, 5000) // Cada 5 segundos para que sea más visible

    return () => clearInterval(interval)
  }, [])

  // Crear efecto flotante
  const createFloatingEffect = (type: FloatingEffect["type"], value?: string) => {
    const effect: FloatingEffect = {
      id: Date.now() + Math.random(),
      x: Math.random() * 200 + 100,
      y: Math.random() * 100 + 150,
      type,
      value,
    }

    setFloatingEffects(prev => [...prev, effect])

    // Remover efecto después de 3 segundos
    setTimeout(() => {
      setFloatingEffects(prev => prev.filter(e => e.id !== effect.id))
    }, 3000)
  }

  // Crear partículas
  const createParticle = (x: number, y: number, type: Particle["type"] = "sparkle") => {
    const newParticle: Particle = {
      id: Date.now() + Math.random(),
      x,
      y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4 - 2,
      life: 1,
      type,
      color: type === "sparkle" ? "#FFD700" : type === "bubble" ? "#87CEEB" : "#D3D3D3"
    }
    setParticles(prev => [...prev, newParticle])
  }

  // Manejar click en Pou
  const handlePouClick = () => {
    const now = Date.now()
    setClickCount(prev => prev + 1)
    setLastClickTime(now)

    // Efectos visuales al hacer click
    createFloatingEffect("heart", "+1")
    createParticle(mousePosition.x, mousePosition.y, "sparkle")
    
    // Animación de sorpresa
    setCurrentAnimation("surprised")
    setTimeout(() => setCurrentAnimation("idle"), 500)

    // Combo de clicks
    if (now - lastClickTime < 1000) {
      setCurrentAnimation("dancing")
      setTimeout(() => setCurrentAnimation("idle"), 1000)
      createFloatingEffect("star", "Combo!")
      setCoins(prev => prev + 5)
    }

    // Mensaje aleatorio
    const messages = [
      "¡Hola!", "¡Me encantas!", "¡Más!", "¡Divertido!", "¡Genial!"
    ]
    setMessage(messages[Math.floor(Math.random() * messages.length)])
    setTimeout(() => setMessage(""), 2000)
  }

  // Manejar movimiento del mouse
  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }

  // Manejar hover
  const handleMouseEnter = () => {
    setIsHovering(true)
    setCurrentAnimation("happy")
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    setCurrentAnimation("idle")
  }

  // Acción: Alimentar Pou
  const feedPou = async () => {
    setIsLoading(true)
    setCurrentAnimation("eating")
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPouStats(prev => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + 25), // AUMENTAR hambre (satisfacción) - menos poderoso
        happiness: Math.min(100, prev.happiness + 8), // Menos felicidad
        health: Math.min(100, prev.health + 3) // Menos salud
      }))
      setMessage("¡Pou está comiendo feliz!")
      createFloatingEffect("heart")
      createFloatingEffect("coin", "+8")
      setCoins(prev => prev + 8)
    } catch (error) {
      setMessage("Error al alimentar a Pou")
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setCurrentAnimation("idle")
        setMessage("")
      }, 3000)
    }
  }

  // Acción: Jugar con Pou
  const playWithPou = async () => {
    setIsLoading(true)
    setCurrentAnimation("playing")
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPouStats(prev => ({
        ...prev,
        energy: Math.max(0, prev.energy - 20), // Más energía gastada por jugar
        happiness: Math.min(100, prev.happiness + 15), // Menos felicidad
        health: Math.min(100, prev.health + 2), // Menos salud
        hunger: Math.max(0, prev.hunger - 8) // Más hambre por el ejercicio
      }))
      setMessage("¡Pou está jugando!")
      createFloatingEffect("star")
      createFloatingEffect("coin", "+12")
      setCoins(prev => prev + 12)
    } catch (error) {
      setMessage("Error al jugar con Pou")
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setCurrentAnimation("idle")
        setMessage("")
      }, 3000)
    }
  }

  // Acción: Curar Pou
  const healPou = async () => {
    setIsLoading(true)
    setCurrentAnimation("happy")
    
    try {
      // Simular API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPouStats(prev => ({
        ...prev,
        health: Math.min(100, prev.health + 20), // Menos salud recuperada
        happiness: Math.min(100, prev.happiness + 4), // Menos felicidad
        energy: Math.max(0, prev.energy - 3) // Gastar un poco de energía
      }))
      setMessage("¡Pou se siente mejor!")
      createFloatingEffect("sparkle")
      createFloatingEffect("coin", "+4")
      setCoins(prev => prev + 4)
    } catch (error) {
      setMessage("Error al curar a Pou")
    } finally {
      setIsLoading(false)
      setTimeout(() => {
        setCurrentAnimation("idle")
        setMessage("")
      }, 3000)
    }
  }

  // Acción: Limpiar Pou
  const cleanPou = () => {
    setCurrentAnimation("bathing")
    setPouStats(prev => ({
      ...prev,
      cleanliness: Math.min(100, prev.cleanliness + 18), // Menos limpieza
      happiness: Math.min(100, prev.happiness + 6), // Un poco más de felicidad
      energy: Math.max(0, prev.energy - 5) // Gastar un poco de energía
    }))
    setMessage("¡Pou está limpio y brillante!")
    createFloatingEffect("sparkle")
    setCoins(prev => prev + 6)
    
    setTimeout(() => {
      setCurrentAnimation("idle")
      setMessage("")
    }, 3000)
  }

  // Acción: Dormir
  const putPouToSleep = () => {
    setCurrentAnimation("sleeping")
    setPouStats(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 25), // Menos energía recuperada
      health: Math.min(100, prev.health + 8), // Menos salud recuperada
      hunger: Math.max(0, prev.hunger - 3) // Un poco de hambre por dormir
    }))
    setMessage("¡Pou está descansando!")
    createFloatingEffect("star")
    setCoins(prev => prev + 10)
    
    setTimeout(() => {
      setCurrentAnimation("idle")
      setMessage("")
    }, 4000)
  }

  // Funciones para tienda y mini-juegos
  const handlePurchase = (item: any) => {
    setCoins(prev => prev - item.price)
    setInventory(prev => [...prev, item])
    setMessage(`¡Compraste ${item.name}!`)
    
    // Si es comida o juguete, aplicarlo automáticamente
    if (item.category === "food" && item.effect) {
      setPouStats(prev => ({
        ...prev,
        hunger: Math.min(100, prev.hunger + (item.effect.hunger || 0)),
        happiness: Math.min(100, prev.happiness + (item.effect.happiness || 0)),
        health: Math.min(100, prev.health + (item.effect.health || 0)),
        energy: Math.min(100, prev.energy + (item.effect.energy || 0)),
        cleanliness: Math.min(100, prev.cleanliness + (item.effect.cleanliness || 0))
      }))
    }
  }

  const handleCustomize = (newCustomization: any) => {
    setCustomization(newCustomization)
    setMessage("¡Personalización aplicada!")
  }

  const handleGameComplete = (rewards: any) => {
    setCoins(prev => prev + rewards.coins)
    setPouStats(prev => ({
      ...prev,
      happiness: Math.min(100, prev.happiness + (rewards.happiness || 0)),
      energy: Math.max(0, prev.energy + (rewards.energy || 0))
    }))
    setMessage(`¡Ganaste ${rewards.coins} monedas!`)
  }

  const handleGameFail = (penalties: any) => {
    setPouStats(prev => ({
      ...prev,
      happiness: Math.max(0, prev.happiness + (penalties.happiness || 0)),
      energy: Math.max(0, prev.energy + (penalties.energy || 0))
    }))
    setMessage("¡Mejor suerte la próxima vez!")
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Mi Pou Virtual</h1>
        <p className="text-gray-600">Cuida a tu mascota virtual y hazla feliz</p>
      </div>

      {/* Stats principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center bg-gradient-to-br from-red-50 to-pink-50">
          <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-red-600">{pouStats.health}%</div>
          <div className="text-sm text-gray-600">Salud</div>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-to-br from-yellow-50 to-orange-50">
          <Smile className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-yellow-600">{pouStats.happiness}%</div>
          <div className="text-sm text-gray-600">Felicidad</div>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-cyan-50">
          <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">{pouStats.energy}%</div>
          <div className="text-sm text-gray-600">Energía</div>
        </Card>
        
        <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50">
          <Coins className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">{coins}</div>
          <div className="text-sm text-gray-600">Monedas</div>
        </Card>
      </div>

      {/* Área principal del juego */}
      <Card className="p-8 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 relative overflow-hidden">
        <div className="text-center relative">
          {/* Personaje Pou */}
          <InteractivePou
            stats={pouStats}
            isAnimating={currentAnimation === "idle"}
            animation={currentAnimation as any}
            onClick={handlePouClick}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />

          {/* Efectos flotantes */}
          <AnimatePresence>
            {floatingEffects.map((effect) => (
              <motion.div
                key={effect.id}
                className="absolute pointer-events-none text-2xl"
                style={{ left: effect.x, top: effect.y }}
                initial={{ y: 0, opacity: 1, scale: 1 }}
                animate={{ y: -50, opacity: 0, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 3 }}
              >
                {effect.type === "heart" && "💖"}
                {effect.type === "star" && "⭐"}
                {effect.type === "coin" && (effect.value ? `${effect.value} 💰` : "💰")}
                {effect.type === "sparkle" && "✨"}
                {effect.type === "level_up" && "🎉"}
                {effect.type === "food" && "🍎"}
                {effect.type === "toy" && "🎾"}
                {effect.type === "magic" && "🔮"}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Sistema de partículas */}
          <AnimatePresence>
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="absolute pointer-events-none"
                style={{ 
                  left: particle.x, 
                  top: particle.y,
                  color: particle.color
                }}
                initial={{ 
                  opacity: 1, 
                  scale: 1,
                  x: 0,
                  y: 0
                }}
                animate={{ 
                  opacity: 0,
                  scale: 0,
                  x: particle.vx * 50,
                  y: particle.vy * 50
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 }}
              >
                {particle.type === "sparkle" && "✨"}
                {particle.type === "bubble" && "💧"}
                {particle.type === "dust" && "✨"}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Contador de clicks */}
          {clickCount > 0 && (
            <motion.div
              className="absolute top-4 right-4 bg-white/90 rounded-full px-3 py-1 shadow-md"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <span className="text-sm font-bold text-purple-600">
                Clicks: {clickCount}
              </span>
            </motion.div>
          )}

          {/* Mensaje de estado */}
          {message && (
            <motion.div
              className="mt-4 p-3 bg-white/80 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <p className="text-gray-700 font-medium">{message}</p>
            </motion.div>
          )}
        </div>
      </Card>

             {/* Botones de acción */}
       <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        <Button
          onClick={feedPou}
          disabled={isLoading}
          className="h-20 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
        >
          <div className="text-center">
            {isLoading && currentAnimation === "eating" ? (
              <Loader2 className="w-6 h-6 mx-auto mb-1 animate-spin" />
            ) : (
              <Apple className="w-6 h-6 mx-auto mb-1" />
            )}
            <div className="text-sm">Alimentar</div>
          </div>
        </Button>

        <Button
          onClick={playWithPou}
          disabled={isLoading}
          className="h-20 bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
        >
          <div className="text-center">
            {isLoading && currentAnimation === "playing" ? (
              <Loader2 className="w-6 h-6 mx-auto mb-1 animate-spin" />
            ) : (
              <Gamepad2 className="w-6 h-6 mx-auto mb-1" />
            )}
            <div className="text-sm">Jugar</div>
          </div>
        </Button>

        <Button
          onClick={cleanPou}
          disabled={isLoading}
          className="h-20 bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
        >
          <div className="text-center">
            {isLoading && currentAnimation === "bathing" ? (
              <Loader2 className="w-6 h-6 mx-auto mb-1 animate-spin" />
            ) : (
              <Bath className="w-6 h-6 mx-auto mb-1" />
            )}
            <div className="text-sm">Limpiar</div>
          </div>
        </Button>

        <Button
          onClick={putPouToSleep}
          disabled={isLoading}
          className="h-20 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
        >
          <div className="text-center">
            {isLoading && currentAnimation === "sleeping" ? (
              <Loader2 className="w-6 h-6 mx-auto mb-1 animate-spin" />
            ) : (
              <Moon className="w-6 h-6 mx-auto mb-1" />
            )}
            <div className="text-sm">Dormir</div>
          </div>
        </Button>

        <Button
          onClick={healPou}
          disabled={isLoading}
          className="h-20 bg-gradient-to-br from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
        >
          <div className="text-center">
            {isLoading && currentAnimation === "happy" ? (
              <Loader2 className="w-6 h-6 mx-auto mb-1 animate-spin" />
            ) : (
              <Pill className="w-6 h-6 mx-auto mb-1" />
            )}
            <div className="text-sm">Curar</div>
          </div>
        </Button>

                 <Button
           onClick={() => {
             setCurrentAnimation("dancing")
             createFloatingEffect("magic", "¡Sorpresa!")
             createFloatingEffect("star", "✨")
             createFloatingEffect("star", "✨")
             createFloatingEffect("star", "✨")
             setCoins(prev => prev + 20)
             setMessage("¡Sorpresa mágica! +20 monedas")
             setTimeout(() => {
               setCurrentAnimation("idle")
               setMessage("")
             }, 2000)
           }}
           className="h-20 bg-gradient-to-br from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
         >
           <div className="text-center">
             <Sparkles className="w-6 h-6 mx-auto mb-1" />
             <div className="text-sm">Sorpresa</div>
           </div>
         </Button>

         <Button
           onClick={() => setShowStore(true)}
           className="h-20 bg-gradient-to-br from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700"
         >
           <div className="text-center">
             <ShoppingCart className="w-6 h-6 mx-auto mb-1" />
             <div className="text-sm">Tienda</div>
           </div>
         </Button>

         <Button
           onClick={() => setShowMiniGames(true)}
           className="h-20 bg-gradient-to-br from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700"
         >
           <div className="text-center">
             <Gamepad2 className="w-6 h-6 mx-auto mb-1" />
             <div className="text-sm">Juegos</div>
           </div>
         </Button>
       </div>

      {/* Barras de estadísticas detalladas */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Estadísticas Detalladas</h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSoundEnabled(!soundEnabled)}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
                         <Button
               variant="outline"
               size="icon"
               onClick={() => {
                 setPouStats({
                   health: 85,
                   happiness: 90,
                   energy: 75,
                   hunger: 60,
                   cleanliness: 80,
                   level: 1,
                   experience: 0,
                   mood: "happy",
                 })
                 setCoins(100)
                 setClickCount(0)
                 setMessage("¡Estadísticas reseteadas!")
               }}
               disabled={isLoading}
             >
               <RotateCcw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
             </Button>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <StatBar
              label="Salud"
              value={pouStats.health}
              color="text-red-500"
              icon={Heart}
            />
            <StatBar
              label="Felicidad"
              value={pouStats.happiness}
              color="text-yellow-500"
              icon={Smile}
            />
            <StatBar
              label="Energía"
              value={pouStats.energy}
              color="text-blue-500"
              icon={Zap}
            />
          </div>
          
          <div className="space-y-4">
            <StatBar
              label="Hambre"
              value={pouStats.hunger}
              color="text-green-500"
              icon={Apple}
            />
            <StatBar
              label="Limpieza"
              value={pouStats.cleanliness}
              color="text-cyan-500"
              icon={Bath}
            />
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Nivel: {pouStats.level}</span>
              <span className="text-sm font-medium text-gray-700">Exp: {pouStats.experience}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Información del estado de ánimo */}
      <Card className="p-4 bg-gradient-to-r from-purple-100 to-pink-100">
        <div className="flex items-center gap-3">
          <div className="text-3xl">
            {pouStats.mood === "happy" ? "😊" : 
             pouStats.mood === "content" ? "😌" :
             pouStats.mood === "sad" ? "😢" : "😐"}
          </div>
          <div>
            <h4 className="font-bold text-purple-800">Estado de Ánimo</h4>
            <p className="text-purple-600 capitalize">
              Tu Pou se siente {pouStats.mood === "happy" ? "muy feliz" : 
                               pouStats.mood === "content" ? "contento" :
                               pouStats.mood === "sad" ? "triste" : "normal"}
            </p>
          </div>
                 </div>
       </Card>

       {/* Modal de Tienda */}
       {showStore && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
             <div className="p-4 border-b flex justify-between items-center">
               <h2 className="text-2xl font-bold">Tienda del Juego</h2>
               <Button
                 variant="outline"
                 onClick={() => setShowStore(false)}
               >
                 ✕
               </Button>
             </div>
             <div className="p-4">
               <GameStore
                 coins={coins}
                 onPurchase={handlePurchase}
                 onCustomize={handleCustomize}
                 currentCustomization={customization}
               />
             </div>
           </div>
         </div>
       )}

       {/* Modal de Mini-Juegos */}
       {showMiniGames && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
           <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
             <div className="p-4 border-b flex justify-between items-center">
               <h2 className="text-2xl font-bold">Mini-Juegos</h2>
               <Button
                 variant="outline"
                 onClick={() => setShowMiniGames(false)}
               >
                 ✕
               </Button>
             </div>
             <div className="p-4">
               <MiniGames
                 onGameComplete={handleGameComplete}
                 onGameFail={handleGameFail}
                 coins={coins}
               />
             </div>
           </div>
         </div>
       )}
     </div>
   )
 } 