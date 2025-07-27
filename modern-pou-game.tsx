"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  Zap,
  Sparkles,
  Droplet,
  Apple,
  Gamepad2,
  Bath,
  Moon,
  Palette,
  Trophy,
  Coins,
  Star,
  Settings,
  Volume2,
  VolumeX,
  Home,
  ShoppingBag,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  GameEngine,
  INITIAL_POU,
  INITIAL_PET,
  MODERN_COLORS,
  ACCESSORIES,
  PET_ACCESSORIES,
  type PouCharacter,
  type Pet,
} from "@/lib/game-engine"
import { RealisticPet } from "@/components/realistic-pet"

interface FloatingEffect {
  id: number
  x: number
  y: number
  type: "heart" | "star" | "coin" | "sparkle" | "level_up"
  value?: string
}

// Componente del personaje Pou moderno
const ModernPouCharacter = ({
  pou,
  isAnimating = false,
  size = "large",
  onClick,
}: {
  pou: PouCharacter
  isAnimating?: boolean
  size?: "small" | "medium" | "large"
  onClick?: () => void
}) => {
  const sizeClasses = {
    small: "w-20 h-20",
    medium: "w-32 h-32",
    large: "w-48 h-48",
  }

  const eyeSize = {
    small: "w-2 h-2",
    medium: "w-3 h-3",
    large: "w-4 h-4",
  }

  // Expresiones basadas en el estado de ánimo
  const getMoodExpression = () => {
    switch (pou.mood) {
      case "ecstatic":
        return { eyeScale: 1.2, mouthHeight: 16, mouthCurve: "0 0 40px 40px", bounce: true }
      case "happy":
        return { eyeScale: 1.1, mouthHeight: 12, mouthCurve: "0 0 30px 30px", bounce: false }
      case "content":
        return { eyeScale: 1, mouthHeight: 8, mouthCurve: "0 0 20px 20px", bounce: false }
      case "neutral":
        return { eyeScale: 1, mouthHeight: 4, mouthCurve: "20px 20px 20px 20px", bounce: false }
      case "sad":
        return { eyeScale: 0.8, mouthHeight: 6, mouthCurve: "20px 20px 0 0", bounce: false }
      case "tired":
        return { eyeScale: 0.6, mouthHeight: 4, mouthCurve: "20px 20px 0 0", bounce: false }
      case "sick":
        return { eyeScale: 0.5, mouthHeight: 4, mouthCurve: "20px 20px 0 0", bounce: false }
      default:
        return { eyeScale: 1, mouthHeight: 8, mouthCurve: "0 0 20px 20px", bounce: false }
    }
  }

  const expression = getMoodExpression()

  return (
    <motion.div
      className={`${sizeClasses[size]} relative cursor-pointer select-none`}
      animate={
        isAnimating
          ? {
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
              y: expression.bounce ? [0, -10, 0] : 0,
            }
          : {
              y: expression.bounce ? [0, -5, 0] : 0,
            }
      }
      transition={{
        duration: isAnimating ? 0.6 : 2,
        repeat: expression.bounce ? Number.POSITIVE_INFINITY : 0,
        ease: "easeInOut",
      }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Sombra suave */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-3/4 h-4 bg-black/10 rounded-full blur-sm" />

      {/* Cuerpo principal */}
      <motion.div
        className={`${sizeClasses[size]} rounded-full relative flex items-center justify-center shadow-2xl border-4 border-white/50`}
        style={{
          backgroundColor: pou.bodyColor,
          background: `linear-gradient(135deg, ${pou.bodyColor} 0%, ${pou.bodyColor}dd 100%)`,
        }}
        animate={{
          boxShadow:
            pou.mood === "ecstatic"
              ? "0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(255, 200, 0, 0.3)"
              : "0 20px 40px rgba(0, 0, 0, 0.15)",
        }}
      >
        {/* Brillo superior */}
        <div className="absolute top-4 left-1/3 w-1/3 h-1/4 bg-white/30 rounded-full blur-sm" />

        {/* Ojos */}
        <div className="absolute top-1/3 flex gap-4">
          <motion.div
            className="bg-white rounded-full flex items-center justify-center shadow-inner"
            style={{
              width: size === "large" ? "32px" : size === "medium" ? "24px" : "16px",
              height: size === "large" ? "32px" : size === "medium" ? "24px" : "16px",
            }}
            animate={{ scale: expression.eyeScale }}
          >
            <motion.div
              className={`${eyeSize[size]} rounded-full`}
              style={{ backgroundColor: pou.eyeColor }}
              animate={{
                y: pou.mood === "tired" ? 2 : pou.mood === "sad" ? 1 : 0,
              }}
            />
            {/* Brillo en los ojos */}
            <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full" />
          </motion.div>

          <motion.div
            className="bg-white rounded-full flex items-center justify-center shadow-inner"
            style={{
              width: size === "large" ? "32px" : size === "medium" ? "24px" : "16px",
              height: size === "large" ? "32px" : size === "medium" ? "24px" : "16px",
            }}
            animate={{ scale: expression.eyeScale }}
          >
            <motion.div
              className={`${eyeSize[size]} rounded-full`}
              style={{ backgroundColor: pou.eyeColor }}
              animate={{
                y: pou.mood === "tired" ? 2 : pou.mood === "sad" ? 1 : 0,
              }}
            />
            {/* Brillo en los ojos */}
            <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full" />
          </motion.div>
        </div>

        {/* Boca */}
        <motion.div
          className="absolute bottom-1/3"
          animate={{
            height: expression.mouthHeight,
            borderRadius: expression.mouthCurve,
            backgroundColor: pou.mood === "sick" ? "#ff6b6b" : "#ff4757",
          }}
          style={{
            width: size === "large" ? "40px" : size === "medium" ? "30px" : "20px",
            boxShadow: "inset 0 2px 4px rgba(0,0,0,0.2)",
          }}
        />

        {/* Mejillas (solo cuando está feliz) */}
        <AnimatePresence>
          {(pou.mood === "happy" || pou.mood === "ecstatic") && (
            <>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute left-2 top-1/2 w-4 h-4 bg-pink-300 rounded-full blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.6, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="absolute right-2 top-1/2 w-4 h-4 bg-pink-300 rounded-full blur-sm"
              />
            </>
          )}
        </AnimatePresence>

        {/* Accesorios */}
        {pou.accessories.hat && (
          <div className="absolute -top-6 text-4xl">
            {ACCESSORIES.hats.find((h) => h.id === pou.accessories.hat)?.icon}
          </div>
        )}

        {pou.accessories.glasses && (
          <div className="absolute top-1/3 text-2xl">
            {ACCESSORIES.glasses.find((g) => g.id === pou.accessories.glasses)?.icon}
          </div>
        )}
      </motion.div>

      {/* Partículas de felicidad */}
      <AnimatePresence>
        {pou.mood === "ecstatic" && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                initial={{
                  opacity: 0,
                  scale: 0,
                  x: 0,
                  y: 0,
                }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  x: Math.cos((i * 60 * Math.PI) / 180) * 60,
                  y: Math.sin((i * 60 * Math.PI) / 180) * 60,
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.2,
                }}
                style={{
                  left: "50%",
                  top: "50%",
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Componente principal del juego
export default function Component() {
  const [gameEngine] = useState(() => new GameEngine(INITIAL_POU, INITIAL_PET))
  const [pou, setPou] = useState<PouCharacter>(INITIAL_POU)
  const [pet, setPet] = useState<Pet>(INITIAL_PET)
  const [floatingEffects, setFloatingEffects] = useState<FloatingEffect[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPetAnimating, setIsPetAnimating] = useState(false)
  const [currentView, setCurrentView] = useState<"home" | "shop" | "achievements" | "settings">("home")
  const [showCustomization, setShowCustomization] = useState(false)
  const [showPetCustomization, setShowPetCustomization] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [selectedAccessoryType, setSelectedAccessoryType] = useState<"hats" | "glasses" | "outfits">("hats")
  const gameAreaRef = useRef<HTMLDivElement>(null)

  // Actualizar estado del juego
  useEffect(() => {
    const interval = setInterval(() => {
      setPou(gameEngine.getPou())
      setPet(gameEngine.getPet())
    }, 1000)

    return () => clearInterval(interval)
  }, [gameEngine])

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

  // Manejar acciones del juego
  const handleGameAction = useCallback(
    async (action: () => Promise<any>, effectType: FloatingEffect["type"] = "heart") => {
      setIsAnimating(true)

      try {
        const result = await action()

        if (result.result.coinsEarned) {
          addFloatingEffect("coin", `+${result.result.coinsEarned}`)
        }

        addFloatingEffect(effectType)

        // Sonido de éxito (simulado)
        if (soundEnabled) {
          console.log("🔊 Sonido de acción exitosa")
        }
      } catch (error) {
        console.error("Error en acción:", error)
      } finally {
        setTimeout(() => setIsAnimating(false), 600)
      }
    },
    [addFloatingEffect, soundEnabled],
  )

  // Acciones específicas
  const feedPou = () => handleGameAction(() => gameEngine.feedPou(), "heart")
  const playWithPou = () => handleGameAction(() => gameEngine.playWithPou(), "star")
  const cleanPou = () => handleGameAction(() => gameEngine.cleanPou(), "sparkle")
  const sleepPou = () => handleGameAction(() => gameEngine.sleepPou(), "sparkle")

  const playWithPet = async () => {
    setIsPetAnimating(true)
    await gameEngine.interactWithPet()
    addFloatingEffect("heart")
    addFloatingEffect("coin", "+3")
    setTimeout(() => setIsPetAnimating(false), 500)
  }

  // Obtener color de la barra según el valor
  const getStatColor = (value: number) => {
    if (value >= 80) return "bg-gradient-to-r from-green-400 to-green-500"
    if (value >= 60) return "bg-gradient-to-r from-yellow-400 to-yellow-500"
    if (value >= 40) return "bg-gradient-to-r from-orange-400 to-orange-500"
    return "bg-gradient-to-r from-red-400 to-red-500"
  }

  // Obtener emoji del estado de ánimo
  const getMoodEmoji = () => {
    switch (pou.mood) {
      case "ecstatic":
        return "🤩"
      case "happy":
        return "😊"
      case "content":
        return "😌"
      case "neutral":
        return "😐"
      case "sad":
        return "😢"
      case "tired":
        return "😴"
      case "sick":
        return "🤒"
      default:
        return "😊"
    }
  }

  if (currentView !== "home") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
        {/* Header de navegación */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => setCurrentView("home")}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
          >
            <Home className="w-5 h-5" />
            Volver
          </Button>

          <h1 className="text-2xl font-bold text-gray-800 capitalize">
            {currentView === "shop" && "🛍️ Tienda"}
            {currentView === "achievements" && "🏆 Logros"}
            {currentView === "settings" && "⚙️ Configuración"}
          </h1>

          <div className="flex items-center gap-2 text-yellow-600">
            <Coins className="w-5 h-5" />
            <span className="font-bold">{pou.coins}</span>
          </div>
        </div>

        {/* Contenido específico de cada vista */}
        {currentView === "shop" && (
          <div className="max-w-4xl mx-auto">
            <Tabs value={selectedAccessoryType} onValueChange={(value) => setSelectedAccessoryType(value as any)}>
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="hats">Sombreros</TabsTrigger>
                <TabsTrigger value="glasses">Lentes</TabsTrigger>
                <TabsTrigger value="outfits">Ropa</TabsTrigger>
              </TabsList>

              <TabsContent value="hats" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ACCESSORIES.hats.map((hat) => (
                  <Card key={hat.id} className="p-4 text-center hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-2">{hat.icon}</div>
                    <h3 className="font-semibold text-gray-800">{hat.name}</h3>
                    <div className="flex items-center justify-center gap-1 mt-2 text-yellow-600">
                      <Coins className="w-4 h-4" />
                      <span>{hat.price}</span>
                    </div>
                    <Button
                      className="w-full mt-3"
                      size="sm"
                      disabled={pou.coins < hat.price || pou.accessories.hat === hat.id}
                    >
                      {pou.accessories.hat === hat.id ? "Equipado" : "Comprar"}
                    </Button>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="glasses" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ACCESSORIES.glasses.map((glasses) => (
                  <Card key={glasses.id} className="p-4 text-center hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-2">{glasses.icon}</div>
                    <h3 className="font-semibold text-gray-800">{glasses.name}</h3>
                    <div className="flex items-center justify-center gap-1 mt-2 text-yellow-600">
                      <Coins className="w-4 h-4" />
                      <span>{glasses.price}</span>
                    </div>
                    <Button
                      className="w-full mt-3"
                      size="sm"
                      disabled={pou.coins < glasses.price || pou.accessories.glasses === glasses.id}
                    >
                      {pou.accessories.glasses === glasses.id ? "Equipado" : "Comprar"}
                    </Button>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="outfits" className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {ACCESSORIES.outfits.map((outfit) => (
                  <Card key={outfit.id} className="p-4 text-center hover:shadow-lg transition-shadow">
                    <div className="text-4xl mb-2">{outfit.icon}</div>
                    <h3 className="font-semibold text-gray-800">{outfit.name}</h3>
                    <div className="flex items-center justify-center gap-1 mt-2 text-yellow-600">
                      <Coins className="w-4 h-4" />
                      <span>{outfit.price}</span>
                    </div>
                    <Button
                      className="w-full mt-3"
                      size="sm"
                      disabled={pou.coins < outfit.price || pou.accessories.outfit === outfit.id}
                    >
                      {pou.accessories.outfit === outfit.id ? "Equipado" : "Comprar"}
                    </Button>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </div>
        )}

        {currentView === "achievements" && (
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pou.achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{achievement.icon}</div>
                    <div>
                      <h3 className="font-bold text-gray-800">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Desbloqueado: {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Logros no desbloqueados */}
              {pou.achievements.length < 8 && (
                <Card className="p-4 bg-gray-50 border-gray-200 opacity-60">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🔒</div>
                    <div>
                      <h3 className="font-bold text-gray-600">Logro Bloqueado</h3>
                      <p className="text-sm text-gray-500">¡Sigue jugando para desbloquearlo!</p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          </div>
        )}

        {currentView === "settings" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Configuración de Audio</h3>
              <div className="flex items-center justify-between">
                <span>Sonidos del juego</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={soundEnabled ? "text-green-600" : "text-gray-400"}
                >
                  {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  {soundEnabled ? "Activado" : "Desactivado"}
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Estadísticas del Juego</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Tiempo total jugado:</span>
                  <span className="font-semibold">{pou.totalPlayTime} sesiones</span>
                </div>
                <div className="flex justify-between">
                  <span>Nivel actual:</span>
                  <span className="font-semibold">{pou.level}</span>
                </div>
                <div className="flex justify-between">
                  <span>Logros desbloqueados:</span>
                  <span className="font-semibold">{pou.achievements.length}/8</span>
                </div>
                <div className="flex justify-between">
                  <span>Monedas totales:</span>
                  <span className="font-semibold">{pou.coins}</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    )
  }

  return (
    <div
      ref={gameAreaRef}
      className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 relative overflow-hidden"
    >
      {/* Fondo animado con formas suaves */}
      <div className="absolute inset-0 z-0">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              background: `linear-gradient(45deg, ${MODERN_COLORS.pouColors[i % MODERN_COLORS.pouColors.length]}, ${MODERN_COLORS.pouColors[(i + 1) % MODERN_COLORS.pouColors.length]})`,
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Header superior */}
      <div className="relative z-10 flex items-center justify-between p-4">
        <div className="flex items-center gap-4">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800">{pou.name}</h1>
            <div className="flex items-center gap-2 text-purple-600">
              <Star className="w-4 h-4" />
              <span className="font-semibold">Nivel {pou.level}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-2 shadow-lg">
            <Coins className="w-5 h-5 text-yellow-500" />
            <span className="font-bold text-gray-800">{pou.coins}</span>
          </div>

          <div className="text-2xl">{getMoodEmoji()}</div>
        </div>
      </div>

      {/* Área principal del personaje */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="relative flex items-center gap-8">
          {/* Personaje Pou */}
          <ModernPouCharacter pou={pou} isAnimating={isAnimating} onClick={() => addFloatingEffect("heart")} />

          {/* Mascota realista */}
          <div className="relative">
            <RealisticPet pet={pet} isAnimating={isPetAnimating} onClick={playWithPet} size="large" />

            {/* Botón de personalización de mascota */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setShowPetCustomization(true)}
              className="absolute -bottom-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white shadow-lg z-20"
            >
              <Palette className="w-4 h-4" />
            </motion.button>

            {/* Información de la mascota */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-center">
              <p className="text-sm font-semibold text-gray-700">{pet.name}</p>
              <Badge className="bg-gradient-to-r from-pink-400 to-pink-500 text-white text-xs">Nivel {pet.level}</Badge>
            </div>
          </div>
        </div>

        {/* Barra de experiencia */}
        <div className="mt-12 w-full max-w-xs">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-gray-700">Experiencia</span>
          </div>
          <Progress
            value={(pou.experience / pou.maxExperience) * 100}
            className="h-3 bg-yellow-100"
            indicatorClassName="bg-gradient-to-r from-yellow-400 to-yellow-500"
          />
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>{pou.experience} XP</span>
            <span>{pou.maxExperience} XP</span>
          </div>
        </div>
      </div>

      {/* Panel de estadísticas */}
      <div className="relative z-10 px-4 mb-6">
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl p-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
              <div className="text-xs text-gray-600 mb-1">Salud</div>
              <Progress value={pou.health} className="h-2 bg-red-100" indicatorClassName={getStatColor(pou.health)} />
              <div className="text-sm font-bold text-gray-800 mt-1">{pou.health}%</div>
            </div>

            <div className="text-center">
              <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-xs text-gray-600 mb-1">Energía</div>
              <Progress
                value={pou.energy}
                className="h-2 bg-yellow-100"
                indicatorClassName={getStatColor(pou.energy)}
              />
              <div className="text-sm font-bold text-gray-800 mt-1">{pou.energy}%</div>
            </div>

            <div className="text-center">
              <Sparkles className="w-6 h-6 text-purple-500 mx-auto mb-2" />
              <div className="text-xs text-gray-600 mb-1">Felicidad</div>
              <Progress
                value={pou.happiness}
                className="h-2 bg-purple-100"
                indicatorClassName={getStatColor(pou.happiness)}
              />
              <div className="text-sm font-bold text-gray-800 mt-1">{pou.happiness}%</div>
            </div>

            <div className="text-center">
              <Droplet className="w-6 h-6 text-blue-500 mx-auto mb-2" />
              <div className="text-xs text-gray-600 mb-1">Limpieza</div>
              <Progress
                value={pou.cleanliness}
                className="h-2 bg-blue-100"
                indicatorClassName={getStatColor(pou.cleanliness)}
              />
              <div className="text-sm font-bold text-gray-800 mt-1">{pou.cleanliness}%</div>
            </div>

            <div className="text-center">
              <Apple className="w-6 h-6 text-green-500 mx-auto mb-2" />
              <div className="text-xs text-gray-600 mb-1">Hambre</div>
              <Progress value={pou.hunger} className="h-2 bg-green-100" indicatorClassName={getStatColor(pou.hunger)} />
              <div className="text-sm font-bold text-gray-800 mt-1">{pou.hunger}%</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Botones de acción principales */}
      <div className="relative z-10 px-4 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={feedPou}
              className="w-full h-20 bg-gradient-to-r from-green-400 to-green-500 hover:from-green-500 hover:to-green-600 text-white border-0 rounded-2xl shadow-lg flex flex-col items-center gap-2"
            >
              <Apple className="w-6 h-6" />
              <span className="font-semibold">Alimentar</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={playWithPou}
              disabled={pou.energy < 15}
              className="w-full h-20 bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600 text-white border-0 rounded-2xl shadow-lg flex flex-col items-center gap-2 disabled:opacity-50"
            >
              <Gamepad2 className="w-6 h-6" />
              <span className="font-semibold">Jugar</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={cleanPou}
              disabled={pou.cleanliness > 90}
              className="w-full h-20 bg-gradient-to-r from-blue-400 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white border-0 rounded-2xl shadow-lg flex flex-col items-center gap-2 disabled:opacity-50"
            >
              <Bath className="w-6 h-6" />
              <span className="font-semibold">Bañar</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={sleepPou}
              disabled={pou.energy > 80}
              className="w-full h-20 bg-gradient-to-r from-indigo-400 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white border-0 rounded-2xl shadow-lg flex flex-col items-center gap-2 disabled:opacity-50"
            >
              <Moon className="w-6 h-6" />
              <span className="font-semibold">Dormir</span>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Navegación inferior */}
      <div className="relative z-10 px-4 pb-4">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl rounded-3xl p-4">
          <div className="grid grid-cols-4 gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowCustomization(true)}
              className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-purple-100"
            >
              <Palette className="w-5 h-5 text-purple-600" />
              <span className="text-xs text-purple-600 font-medium">Personalizar</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => setCurrentView("shop")}
              className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-blue-100"
            >
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">Tienda</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => setCurrentView("achievements")}
              className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-yellow-100"
            >
              <Trophy className="w-5 h-5 text-yellow-600" />
              <span className="text-xs text-yellow-600 font-medium">Logros</span>
              {pou.achievements.length > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs">
                  {pou.achievements.length}
                </Badge>
              )}
            </Button>

            <Button
              variant="ghost"
              onClick={() => setCurrentView("settings")}
              className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-gray-100"
            >
              <Settings className="w-5 h-5 text-gray-600" />
              <span className="text-xs text-gray-600 font-medium">Config</span>
            </Button>
          </div>
        </Card>
      </div>

      {/* Efectos flotantes */}
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
            {effect.type === "heart" && <Heart className="w-8 h-8 text-red-500" />}
            {effect.type === "star" && <Star className="w-8 h-8 text-yellow-500" />}
            {effect.type === "coin" && (
              <div className="flex items-center gap-1 bg-yellow-400 text-white px-2 py-1 rounded-full text-sm font-bold">
                <Coins className="w-4 h-4" />
                {effect.value}
              </div>
            )}
            {effect.type === "sparkle" && <Sparkles className="w-8 h-8 text-purple-500" />}
            {effect.type === "level_up" && (
              <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                ¡NIVEL {pou.level}!
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Modal de personalización */}
      <Dialog open={showCustomization} onOpenChange={setShowCustomization}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Personalizar a {pou.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Vista previa */}
            <div className="flex justify-center">
              <ModernPouCharacter pou={pou} size="medium" />
            </div>

            {/* Colores del cuerpo */}
            <div>
              <h4 className="font-semibold mb-3">Color del cuerpo</h4>
              <div className="grid grid-cols-4 gap-2">
                {MODERN_COLORS.pouColors.map((color) => (
                  <button
                    key={color}
                    className={`w-12 h-12 rounded-full border-4 transition-all ${
                      pou.bodyColor === color ? "border-purple-500 scale-110" : "border-white hover:border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setPou((prev) => ({ ...prev, bodyColor: color }))
                      addFloatingEffect("sparkle")
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Colores de ojos */}
            <div>
              <h4 className="font-semibold mb-3">Color de ojos</h4>
              <div className="grid grid-cols-5 gap-2">
                {MODERN_COLORS.eyeColors.map((color) => (
                  <button
                    key={color}
                    className={`w-10 h-10 rounded-full border-4 transition-all ${
                      pou.eyeColor === color ? "border-purple-500 scale-110" : "border-white hover:border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setPou((prev) => ({ ...prev, eyeColor: color }))
                      addFloatingEffect("sparkle")
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Nombre personalizado */}
            <div>
              <h4 className="font-semibold mb-3">Nombre</h4>
              <input
                type="text"
                value={pou.name}
                onChange={(e) => setPou((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Nombre de tu Pou"
                maxLength={15}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setShowCustomization(false)} variant="outline" className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  addFloatingEffect("sparkle")
                  setShowCustomization(false)
                }}
                className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600"
              >
                <Check className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de personalización de mascota */}
      <Dialog open={showPetCustomization} onOpenChange={setShowPetCustomization}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-500" />
              Personalizar a {pet.name}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Vista previa */}
            <div className="flex justify-center">
              <div className="relative">
                <RealisticPet pet={pet} size="medium" />
                <div className="mt-2 text-center">
                  <Badge className="bg-gradient-to-r from-pink-400 to-pink-500 text-white">Nivel {pet.level}</Badge>
                </div>
              </div>
            </div>

            {/* Tipo de mascota */}
            <div>
              <h4 className="font-semibold mb-3">Tipo de mascota</h4>
              <div className="grid grid-cols-4 gap-2">
                {["dog", "cat", "rabbit", "hamster"].map((type) => (
                  <button
                    key={type}
                    className={`p-3 rounded-xl border-2 transition-all text-lg font-semibold ${
                      pet.type === type
                        ? "border-pink-500 bg-pink-50 scale-105"
                        : "border-gray-200 hover:border-pink-300 hover:bg-pink-50"
                    }`}
                    onClick={() => {
                      setPet((prev) => ({ ...prev, type: type as Pet["type"] }))
                      addFloatingEffect("heart")
                    }}
                  >
                    {type === "dog" && "🐕"}
                    {type === "cat" && "🐱"}
                    {type === "rabbit" && "🐰"}
                    {type === "hamster" && "🐹"}
                    <div className="text-xs mt-1 capitalize">{type}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Colores de mascota */}
            <div>
              <h4 className="font-semibold mb-3">Color principal</h4>
              <div className="grid grid-cols-4 gap-2">
                {MODERN_COLORS.petColors[pet.type]?.map((color) => (
                  <button
                    key={color}
                    className={`w-12 h-12 rounded-full border-4 transition-all ${
                      pet.color === color ? "border-pink-500 scale-110" : "border-white hover:border-gray-300"
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      setPet((prev) => ({ ...prev, color }))
                      addFloatingEffect("sparkle")
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Accesorios */}
            <Tabs defaultValue="collars" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="collars">Collares</TabsTrigger>
                <TabsTrigger value="toys">Juguetes</TabsTrigger>
                <TabsTrigger value="hats">Sombreros</TabsTrigger>
              </TabsList>

              <TabsContent value="collars" className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {PET_ACCESSORIES.collars.map((collar) => (
                    <button
                      key={collar.id}
                      className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                        pet.accessories.collar === collar.id
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                      onClick={() => {
                        if (pou.coins >= collar.price || pet.accessories.collar === collar.id) {
                          setPet((prev) => ({
                            ...prev,
                            accessories: { ...prev.accessories, collar: collar.id },
                          }))
                          if (collar.price > 0 && pet.accessories.collar !== collar.id) {
                            setPou((prev) => ({ ...prev, coins: prev.coins - collar.price }))
                          }
                          addFloatingEffect("star")
                        }
                      }}
                      disabled={pou.coins < collar.price && pet.accessories.collar !== collar.id}
                    >
                      <div
                        className="w-6 h-6 rounded-full border-2 border-gray-400"
                        style={{ backgroundColor: collar.color }}
                      />
                      <div className="text-left">
                        <div className="text-sm font-medium">{collar.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Coins className="w-3 h-3" />
                          {collar.price}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="toys" className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {PET_ACCESSORIES.toys.map((toy) => (
                    <button
                      key={toy.id}
                      className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                        pet.accessories.toy === toy.id
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                      onClick={() => {
                        if (pou.coins >= toy.price || pet.accessories.toy === toy.id) {
                          setPet((prev) => ({
                            ...prev,
                            accessories: { ...prev.accessories, toy: toy.id },
                          }))
                          if (toy.price > 0 && pet.accessories.toy !== toy.id) {
                            setPou((prev) => ({ ...prev, coins: prev.coins - toy.price }))
                          }
                          addFloatingEffect("star")
                        }
                      }}
                      disabled={pou.coins < toy.price && pet.accessories.toy !== toy.id}
                    >
                      <span className="text-lg">
                        {toy.id === "ball" && "⚽"}
                        {toy.id === "bone" && "🦴"}
                        {toy.id === "mouse" && "🐭"}
                        {toy.id === "frisbee" && "🥏"}
                        {toy.id === "none" && "🚫"}
                      </span>
                      <div className="text-left">
                        <div className="text-sm font-medium">{toy.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Coins className="w-3 h-3" />
                          {toy.price}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="hats" className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  {PET_ACCESSORIES.hats.map((hat) => (
                    <button
                      key={hat.id}
                      className={`p-3 rounded-lg border-2 transition-all flex items-center gap-2 ${
                        pet.accessories.hat === hat.id
                          ? "border-pink-500 bg-pink-50"
                          : "border-gray-200 hover:border-pink-300"
                      }`}
                      onClick={() => {
                        if (pou.coins >= hat.price || pet.accessories.hat === hat.id) {
                          setPet((prev) => ({
                            ...prev,
                            accessories: { ...prev.accessories, hat: hat.id },
                          }))
                          if (hat.price > 0 && pet.accessories.hat !== hat.id) {
                            setPou((prev) => ({ ...prev, coins: prev.coins - hat.price }))
                          }
                          addFloatingEffect("star")
                        }
                      }}
                      disabled={pou.coins < hat.price && pet.accessories.hat !== hat.id}
                    >
                      <span className="text-lg">
                        {hat.id === "cap" && "🧢"}
                        {hat.id === "party" && "🎉"}
                        {hat.id === "crown" && "👑"}
                        {hat.id === "none" && "🚫"}
                      </span>
                      <div className="text-left">
                        <div className="text-sm font-medium">{hat.name}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Coins className="w-3 h-3" />
                          {hat.price}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </TabsContent>
            </Tabs>

            {/* Nombre personalizado */}
            <div>
              <h4 className="font-semibold mb-3">Nombre</h4>
              <input
                type="text"
                value={pet.name}
                onChange={(e) => setPet((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="Nombre de tu mascota"
                maxLength={15}
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={() => setShowPetCustomization(false)} variant="outline" className="flex-1">
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  addFloatingEffect("heart")
                  setShowPetCustomization(false)
                }}
                className="flex-1 bg-gradient-to-r from-pink-500 to-pink-600"
              >
                <Check className="w-4 h-4 mr-2" />
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
