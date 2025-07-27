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
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import unifiedApiClient, { type Hero, type Mascota as Pet } from "@/lib/unified-api-client"

interface FloatingEffect {
  id: number
  x: number
  y: number
  type: "heart" | "star" | "energy" | "sparkle" | "success" | "error" | "levelup"
  heroId: string
}

interface ActionState {
  [key: string]: boolean
}

// Hero Avatar Component
const HeroAvatar = ({
  hero,
  size = "large",
  isAnimating = false,
  onClick,
}: {
  hero: Hero
  size?: "small" | "large"
  isAnimating?: boolean
  onClick?: () => void
}) => {
  const avatarSize = size === "large" ? "w-24 h-24" : "w-16 h-16"
  const eyeSize = size === "large" ? "w-3 h-3" : "w-2 h-2"

  return (
    <motion.div
      className={`${avatarSize} relative cursor-pointer`}
      animate={isAnimating ? { scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] } : {}}
      transition={{ duration: 0.6 }}
      onClick={onClick}
    >
      {/* Cape */}
      <motion.div
        className="absolute -top-2 -left-2 w-8 h-16 rounded-t-full opacity-80"
        style={{ backgroundColor: hero.capeColor }}
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />

      {/* Body */}
      <div
        className={`${avatarSize} rounded-full relative flex items-center justify-center shadow-lg border-4 border-white`}
        style={{ backgroundColor: hero.bodyColor }}
      >
        {/* Eyes */}
        <div className="absolute top-6 flex gap-3">
          <div className={`${eyeSize} bg-white rounded-full flex items-center justify-center`}>
            <div className="w-1 h-1 bg-black rounded-full" />
          </div>
          <div className={`${eyeSize} bg-white rounded-full flex items-center justify-center`}>
            <div className="w-1 h-1 bg-black rounded-full" />
          </div>
        </div>

        {/* Smile */}
        <motion.div
          className="absolute bottom-6 w-8 h-4 border-b-2 border-white rounded-b-full"
          animate={isAnimating ? { scaleX: [1, 1.2, 1] } : {}}
        />

        {/* Hero Symbol */}
        <div className="absolute bottom-2 right-2">
          {hero.superpower === "Cosmic Energy" && <Star className="w-4 h-4 text-yellow-300" />}
          {hero.superpower === "Fire Control" && <Flame className="w-4 h-4 text-orange-300" />}
          {hero.superpower === "Water Mastery" && <Droplet className="w-4 h-4 text-blue-300" />}
          {hero.superpower === "Air Control" && <Wind className="w-4 h-4 text-green-300" />}
        </div>
      </div>
    </motion.div>
  )
}

// Pet Avatar Component
const PetAvatar = ({
  pet,
  size = "small",
  isAnimating = false,
  onClick,
}: {
  pet: Pet
  size?: "small" | "medium"
  isAnimating?: boolean
  onClick?: () => void
}) => {
  const petSize = size === "medium" ? "w-16 h-16" : "w-12 h-12"

  return (
    <motion.div
      className={`${petSize} rounded-full relative flex items-center justify-center shadow-md border-2 border-white cursor-pointer`}
      style={{ backgroundColor: pet.color }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={isAnimating ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
      transition={{ duration: 0.5 }}
      onClick={onClick}
    >
      {/* Pet Features based on type */}
      {pet.type === "dragon" && (
        <>
          <div className="absolute top-2 flex gap-1">
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
          <div className="absolute bottom-2 w-4 h-2 border-b border-white rounded-b-full" />
          <Flame className="w-3 h-3 text-orange-200 absolute bottom-1 right-1" />
        </>
      )}
      {pet.type === "phoenix" && (
        <>
          <div className="absolute top-2 flex gap-1">
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
          <Sparkles className="w-3 h-3 text-yellow-200 absolute top-1 right-1" />
        </>
      )}
      {pet.type === "wolf" && (
        <>
          <div className="absolute top-2 flex gap-1">
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
          <div className="absolute top-1 left-1 w-1 h-2 bg-white rounded-full transform -rotate-12" />
          <div className="absolute top-1 right-1 w-1 h-2 bg-white rounded-full transform rotate-12" />
        </>
      )}
      {pet.type === "eagle" && (
        <>
          <div className="absolute top-2 flex gap-1">
            <div className="w-1 h-1 bg-white rounded-full" />
            <div className="w-1 h-1 bg-white rounded-full" />
          </div>
          <div className="absolute bottom-2 w-2 h-1 bg-white rounded-full" />
          <Wind className="w-3 h-3 text-blue-200 absolute bottom-1 right-1" />
        </>
      )}
    </motion.div>
  )
}

// Action Button Component
const ActionButton = ({
  icon: Icon,
  label,
  onClick,
  disabled = false,
  loading = false,
  variant = "primary",
  size = "sm",
}: {
  icon: any
  label: string
  onClick: () => void
  disabled?: boolean
  loading?: boolean
  variant?: "primary" | "secondary" | "success" | "warning" | "danger"
  size?: "sm" | "xs"
}) => {
  const variants = {
    primary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    secondary: "bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700",
    success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    warning: "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700",
  }

  const sizes = {
    sm: "px-3 py-2 text-xs",
    xs: "px-2 py-1 text-xs",
  }

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${variants[variant]} ${sizes[size]}
        text-white border-0 rounded-lg font-medium
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center gap-1 transition-all duration-200
        shadow-md hover:shadow-lg
      `}
    >
      {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Icon className="w-3 h-3" />}
      {size === "sm" && <span>{label}</span>}
    </motion.button>
  )
}

// Toast notification system
const showToast = (message: string, type: "success" | "error" = "success") => {
  // Simple toast implementation - in a real app you'd use a proper toast library
  const toast = document.createElement("div")
  toast.className = `fixed top-4 right-4 z-50 p-4 rounded-lg text-white font-medium ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  }`
  toast.textContent = message
  document.body.appendChild(toast)

  setTimeout(() => {
    document.body.removeChild(toast)
  }, 3000)
}

export default function Component() {
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null)
  const [floatingEffects, setFloatingEffects] = useState<FloatingEffect[]>([])
  const [actionStates, setActionStates] = useState<ActionState>({})
  const [animatingHeroes, setAnimatingHeroes] = useState<Set<string>>(new Set())
  const [animatingPets, setAnimatingPets] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  // Load heroes on component mount
  useEffect(() => {
    const loadHeroes = async () => {
      try {
        const response = await heroAPI.getHeroes()
        if (response.success && response.data) {
          setHeroes(response.data)
        }
      } catch (error) {
        showToast("Error al cargar los héroes", "error")
      } finally {
        setLoading(false)
      }
    }

    loadHeroes()
  }, [])

  // Add floating effect
  const addFloatingEffect = useCallback((type: FloatingEffect["type"], heroId: string) => {
    const newEffect: FloatingEffect = {
      id: Date.now() + Math.random(),
      x: Math.random() * 100,
      y: Math.random() * 100,
      type,
      heroId,
    }
    setFloatingEffects((prev) => [...prev, newEffect])
    setTimeout(() => {
      setFloatingEffects((prev) => prev.filter((effect) => effect.id !== newEffect.id))
    }, 2000)
  }, [])

  // Update hero in state
  const updateHero = useCallback(
    (updatedHero: Hero) => {
      setHeroes((prev) => prev.map((hero) => (hero.id === updatedHero.id ? updatedHero : hero)))
      if (selectedHero && selectedHero.id === updatedHero.id) {
        setSelectedHero(updatedHero)
      }
    },
    [selectedHero],
  )

  // Generic action handler
  const handleAction = useCallback(
    async (
      heroId: string,
      actionKey: string,
      apiCall: () => Promise<any>,
      effectType: FloatingEffect["type"] = "success",
    ) => {
      if (actionStates[actionKey]) return

      setActionStates((prev) => ({ ...prev, [actionKey]: true }))
      setAnimatingHeroes((prev) => new Set([...prev, heroId]))

      try {
        const response = await apiCall()

        if (response.success && response.data) {
          updateHero(response.data)
          addFloatingEffect(effectType, heroId)
          showToast(response.message, "success")

          // Check for level up
          if (response.message.includes("nivel")) {
            addFloatingEffect("levelup", heroId)
          }
        } else {
          addFloatingEffect("error", heroId)
          showToast(response.message, "error")
        }
      } catch (error) {
        addFloatingEffect("error", heroId)
        showToast("¡Algo salió mal! Inténtalo de nuevo.", "error")
      } finally {
        setActionStates((prev) => ({ ...prev, [actionKey]: false }))
        setTimeout(() => {
          setAnimatingHeroes((prev) => {
            const newSet = new Set(prev)
            newSet.delete(heroId)
            return newSet
          })
        }, 600)
      }
    },
    [actionStates, updateHero, addFloatingEffect],
  )

  // Pet action handler
  const handlePetAction = useCallback(
    async (heroId: string, actionKey: string, apiCall: () => Promise<any>) => {
      if (actionStates[actionKey]) return

      setActionStates((prev) => ({ ...prev, [actionKey]: true }))
      setAnimatingPets((prev) => new Set([...prev, heroId]))

      try {
        const response = await apiCall()

        if (response.success && response.data) {
          updateHero(response.data)
          addFloatingEffect("heart", heroId)
          showToast(response.message, "success")
        } else {
          addFloatingEffect("error", heroId)
          showToast(response.message, "error")
        }
      } catch (error) {
        addFloatingEffect("error", heroId)
        showToast("¡Algo salió mal! Inténtalo de nuevo.", "error")
      } finally {
        setActionStates((prev) => ({ ...prev, [actionKey]: false }))
        setTimeout(() => {
          setAnimatingPets((prev) => {
            const newSet = new Set(prev)
            newSet.delete(heroId)
            return newSet
          })
        }, 500)
      }
    },
    [actionStates, updateHero, addFloatingEffect],
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto mb-4" />
          <p className="text-lg text-gray-600">Cargando Academia de Superhéroes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-blue-100 p-6">
      {/* Header */}
      <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">🦸‍♂️ Academia de Superhéroes 🦸‍♀️</h1>
        <p className="text-lg text-gray-600">¡Entrena, cuida y haz crecer a tus héroes y sus mascotas!</p>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8"
      >
        <Card className="p-4 bg-gradient-to-r from-blue-400 to-blue-500 text-white border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Héroes Activos</p>
              <p className="text-2xl font-bold">{heroes.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-green-400 to-green-500 text-white border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Nivel Promedio</p>
              <p className="text-2xl font-bold">
                {heroes.length > 0 ? Math.round(heroes.reduce((acc, hero) => acc + hero.level, 0) / heroes.length) : 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-purple-400 to-purple-500 text-white border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Felicidad Total</p>
              <p className="text-2xl font-bold">
                {heroes.length > 0
                  ? Math.round(heroes.reduce((acc, hero) => acc + hero.happiness, 0) / heroes.length)
                  : 0}
                %
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8" />
            <div>
              <p className="text-sm opacity-90">Logros</p>
              <p className="text-2xl font-bold">{heroes.reduce((acc, hero) => acc + hero.achievements.length, 0)}</p>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Heroes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {heroes.map((hero, index) => (
          <motion.div
            key={hero.id}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 * index }}
          >
            <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              {/* Hero Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <HeroAvatar
                    hero={hero}
                    isAnimating={animatingHeroes.has(hero.id)}
                    onClick={() => setSelectedHero(hero)}
                  />
                  <div>
                    <h3
                      className="text-xl font-bold text-gray-800 cursor-pointer hover:text-purple-600 transition-colors"
                      onClick={() => setSelectedHero(hero)}
                    >
                      {hero.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-0">
                        Nivel {hero.level}
                      </Badge>
                      <span className="text-sm text-gray-500">{hero.lastActive}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Experience Bar */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Star className="w-3 h-3 text-yellow-500" />
                  <span className="text-xs text-gray-600">Experiencia</span>
                </div>
                <Progress
                  value={(hero.experience / hero.maxExperience) * 100}
                  className="h-2 bg-yellow-100"
                  indicatorClassName="bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-1000"
                />
                <span className="text-xs text-gray-500">
                  {hero.experience}/{hero.maxExperience} XP
                </span>
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600 w-16">Salud</span>
                  <Progress
                    value={hero.health}
                    className="flex-1 h-2 bg-red-100"
                    indicatorClassName="bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">{hero.health}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm text-gray-600 w-16">Energía</span>
                  <Progress
                    value={hero.energy}
                    className="flex-1 h-2 bg-yellow-100"
                    indicatorClassName="bg-gradient-to-r from-yellow-400 to-yellow-500 transition-all duration-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">{hero.energy}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600 w-16">Fuerza</span>
                  <Progress
                    value={hero.strength}
                    className="flex-1 h-2 bg-blue-100"
                    indicatorClassName="bg-gradient-to-r from-blue-400 to-blue-500 transition-all duration-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">{hero.strength}%</span>
                </div>

                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  <span className="text-sm text-gray-600 w-16">Felicidad</span>
                  <Progress
                    value={hero.happiness}
                    className="flex-1 h-2 bg-purple-100"
                    indicatorClassName="bg-gradient-to-r from-purple-400 to-purple-500 transition-all duration-500"
                  />
                  <span className="text-sm font-semibold text-gray-700">{hero.happiness}%</span>
                </div>
              </div>

              {/* Hero Action Buttons */}
              <div className="grid grid-cols-4 gap-1 mb-4">
                <ActionButton
                  icon={Apple}
                  label="Alimentar"
                  onClick={() => handleAction(hero.id, `${hero.id}-feed`, () => heroAPI.feedHero(hero.id), "success")}
                  loading={actionStates[`${hero.id}-feed`]}
                  variant="success"
                  size="xs"
                />
                <ActionButton
                  icon={Dumbbell}
                  label="Entrenar"
                  onClick={() => handleAction(hero.id, `${hero.id}-train`, () => heroAPI.trainHero(hero.id), "star")}
                  loading={actionStates[`${hero.id}-train`]}
                  disabled={hero.energy < 20}
                  variant="primary"
                  size="xs"
                />
                <ActionButton
                  icon={Heart}
                  label="Curar"
                  onClick={() => handleAction(hero.id, `${hero.id}-heal`, () => heroAPI.healHero(hero.id), "sparkle")}
                  loading={actionStates[`${hero.id}-heal`]}
                  disabled={hero.health > 90}
                  variant="warning"
                  size="xs"
                />
                <ActionButton
                  icon={Gamepad2}
                  label="Jugar"
                  onClick={() => handleAction(hero.id, `${hero.id}-play`, () => heroAPI.playWithHero(hero.id), "heart")}
                  loading={actionStates[`${hero.id}-play`]}
                  disabled={hero.energy < 15}
                  variant="secondary"
                  size="xs"
                />
              </div>

              {/* Pet Section */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <PetAvatar
                      pet={hero.pet}
                      size="medium"
                      isAnimating={animatingPets.has(hero.id)}
                      onClick={() => setSelectedHero(hero)}
                    />
                    <div>
                      <p className="font-semibold text-gray-800">{hero.pet.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{hero.pet.type}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Heart className="w-3 h-3 text-pink-500" />
                        <span className="text-xs text-gray-600">{hero.pet.happiness}%</span>
                        <Shield className="w-3 h-3 text-blue-500" />
                        <span className="text-xs text-gray-600">{hero.pet.health}%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Pet Action Buttons */}
                <div className="grid grid-cols-3 gap-1">
                  <ActionButton
                    icon={Apple}
                    label="Alimentar"
                    onClick={() => handlePetAction(hero.id, `${hero.id}-pet-feed`, () => petAPI.feedPet(hero.id))}
                    loading={actionStates[`${hero.id}-pet-feed`]}
                    variant="success"
                    size="xs"
                  />
                  <ActionButton
                    icon={Gamepad2}
                    label="Jugar"
                    onClick={() => handlePetAction(hero.id, `${hero.id}-pet-play`, () => petAPI.playWithPet(hero.id))}
                    loading={actionStates[`${hero.id}-pet-play`]}
                    disabled={hero.energy < 10}
                    variant="primary"
                    size="xs"
                  />
                  <ActionButton
                    icon={Heart}
                    label="Curar"
                    onClick={() => handlePetAction(hero.id, `${hero.id}-pet-heal`, () => petAPI.healPet(hero.id))}
                    loading={actionStates[`${hero.id}-pet-heal`]}
                    disabled={hero.pet.health > 90}
                    variant="warning"
                    size="xs"
                  />
                </div>
              </div>

              {/* Main Action Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() =>
                    handleAction(hero.id, `${hero.id}-customize`, () =>
                      heroAPI.customizeHero(hero.id, {
                        bodyColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                        capeColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                      }),
                    )
                  }
                  variant="outline"
                  className="flex-1 border-2 border-purple-200 hover:border-purple-300 rounded-xl text-purple-600 hover:text-purple-700"
                  disabled={actionStates[`${hero.id}-customize`]}
                >
                  {actionStates[`${hero.id}-customize`] ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Palette className="w-4 h-4 mr-2" />
                  )}
                  Personalizar
                </Button>

                <Button
                  onClick={() => setSelectedHero(hero)}
                  variant="outline"
                  className="flex-1 border-2 border-gray-200 hover:border-gray-300 rounded-xl"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Detalles
                </Button>
              </div>

              {/* Achievements Preview */}
              {hero.achievements.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1">
                  {hero.achievements.slice(0, 2).map((achievement, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="text-xs bg-gradient-to-r from-green-100 to-green-200 text-green-700 border-0"
                    >
                      🏆 {achievement}
                    </Badge>
                  ))}
                  {hero.achievements.length > 2 && (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                      +{hero.achievements.length - 2} más
                    </Badge>
                  )}
                </div>
              )}
            </Card>
          </motion.div>
        ))}

        {/* Add New Hero Card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 * heroes.length }}
        >
          <Card className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300 rounded-3xl hover:border-gray-400 transition-all duration-300 hover:-translate-y-2 cursor-pointer min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-16 h-16 bg-gradient-to-r from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Plus className="w-8 h-8 text-white" />
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Nuevo Héroe</h3>
              <p className="text-sm text-gray-500">¡Crea tu próximo superhéroe!</p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Floating Effects */}
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
              y: `${effect.y - 20}%`,
              opacity: 0,
              scale: 1.5,
            }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          >
            {effect.type === "heart" && <Heart className="w-6 h-6 text-red-500" />}
            {effect.type === "star" && <Star className="w-6 h-6 text-yellow-500" />}
            {effect.type === "energy" && <Zap className="w-6 h-6 text-blue-500" />}
            {effect.type === "sparkle" && <Sparkles className="w-6 h-6 text-purple-500" />}
            {effect.type === "success" && <CheckCircle className="w-6 h-6 text-green-500" />}
            {effect.type === "error" && <AlertCircle className="w-6 h-6 text-red-500" />}
            {effect.type === "levelup" && <Trophy className="w-8 h-8 text-gold-500" />}
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Hero Details Modal */}
      <AnimatePresence>
        {selectedHero && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedHero(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <HeroAvatar hero={selectedHero} />
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">{selectedHero.name}</h2>
                    <p className="text-lg text-gray-600">{selectedHero.superpower}</p>
                    <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white border-0 mt-2">
                      Nivel {selectedHero.level}
                    </Badge>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setSelectedHero(null)} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <Tabs defaultValue="stats" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="stats">Estadísticas</TabsTrigger>
                  <TabsTrigger value="pet">Mascota</TabsTrigger>
                  <TabsTrigger value="history">Historial</TabsTrigger>
                  <TabsTrigger value="items">Objetos</TabsTrigger>
                </TabsList>

                <TabsContent value="stats" className="space-y-6">
                  {/* Experience Progress */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      <span className="text-lg font-semibold text-gray-800">Progreso de Experiencia</span>
                    </div>
                    <Progress
                      value={(selectedHero.experience / selectedHero.maxExperience) * 100}
                      className="h-4 bg-yellow-100"
                      indicatorClassName="bg-gradient-to-r from-yellow-400 to-yellow-500"
                    />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>{selectedHero.experience} XP</span>
                      <span>{selectedHero.maxExperience} XP</span>
                    </div>
                  </div>

                  {/* Detailed Stats */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-800">Estadísticas Detalladas</h3>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Heart className="w-5 h-5 text-red-500" />
                          <span className="text-gray-600 w-20">Salud</span>
                          <Progress
                            value={selectedHero.health}
                            className="flex-1 h-3 bg-red-100"
                            indicatorClassName="bg-red-500"
                          />
                          <span className="font-semibold text-gray-700">{selectedHero.health}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-yellow-500" />
                          <span className="text-gray-600 w-20">Energía</span>
                          <Progress
                            value={selectedHero.energy}
                            className="flex-1 h-3 bg-yellow-100"
                            indicatorClassName="bg-yellow-500"
                          />
                          <span className="font-semibold text-gray-700">{selectedHero.energy}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Shield className="w-5 h-5 text-blue-500" />
                          <span className="text-gray-600 w-20">Fuerza</span>
                          <Progress
                            value={selectedHero.strength}
                            className="flex-1 h-3 bg-blue-100"
                            indicatorClassName="bg-blue-500"
                          />
                          <span className="font-semibold text-gray-700">{selectedHero.strength}%</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-5 h-5 text-purple-500" />
                          <span className="text-gray-600 w-20">Felicidad</span>
                          <Progress
                            value={selectedHero.happiness}
                            className="flex-1 h-3 bg-purple-100"
                            indicatorClassName="bg-purple-500"
                          />
                          <span className="font-semibold text-gray-700">{selectedHero.happiness}%</span>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="space-y-3">
                        <h4 className="text-lg font-semibold text-gray-800">Acciones Rápidas</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <ActionButton
                            icon={Apple}
                            label="Alimentar"
                            onClick={() =>
                              handleAction(selectedHero.id, `${selectedHero.id}-feed`, () =>
                                heroAPI.feedHero(selectedHero.id),
                              )
                            }
                            loading={actionStates[`${selectedHero.id}-feed`]}
                            variant="success"
                          />
                          <ActionButton
                            icon={Dumbbell}
                            label="Entrenar"
                            onClick={() =>
                              handleAction(selectedHero.id, `${selectedHero.id}-train`, () =>
                                heroAPI.trainHero(selectedHero.id),
                              )
                            }
                            loading={actionStates[`${selectedHero.id}-train`]}
                            disabled={selectedHero.energy < 20}
                            variant="primary"
                          />
                          <ActionButton
                            icon={Heart}
                            label="Curar"
                            onClick={() =>
                              handleAction(selectedHero.id, `${selectedHero.id}-heal`, () =>
                                heroAPI.healHero(selectedHero.id),
                              )
                            }
                            loading={actionStates[`${selectedHero.id}-heal`]}
                            disabled={selectedHero.health > 90}
                            variant="warning"
                          />
                          <ActionButton
                            icon={Gamepad2}
                            label="Jugar"
                            onClick={() =>
                              handleAction(selectedHero.id, `${selectedHero.id}-play`, () =>
                                heroAPI.playWithHero(selectedHero.id),
                              )
                            }
                            loading={actionStates[`${selectedHero.id}-play`]}
                            disabled={selectedHero.energy < 15}
                            variant="secondary"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-gray-800">Logros Desbloqueados</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedHero.achievements.map((achievement, idx) => (
                          <Badge
                            key={idx}
                            className="bg-gradient-to-r from-green-400 to-green-500 text-white border-0 px-3 py-1"
                          >
                            🏆 {achievement}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="pet" className="space-y-6">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <PetAvatar
                        pet={selectedHero.pet}
                        size="medium"
                        isAnimating={animatingPets.has(selectedHero.id)}
                      />
                      <div>
                        <p className="text-xl font-semibold text-gray-800">{selectedHero.pet.name}</p>
                        <p className="text-gray-600 capitalize text-lg">{selectedHero.pet.type}</p>
                        <Badge className="bg-gradient-to-r from-blue-400 to-blue-500 text-white border-0 mt-2">
                          Nivel {selectedHero.pet.level}
                        </Badge>
                      </div>
                    </div>

                    {/* Pet Stats */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2">
                        <Heart className="w-4 h-4 text-pink-500" />
                        <span className="text-sm text-gray-600 w-20">Felicidad</span>
                        <Progress
                          value={selectedHero.pet.happiness}
                          className="flex-1 h-2 bg-pink-100"
                          indicatorClassName="bg-pink-500"
                        />
                        <span className="text-sm font-semibold text-gray-700">{selectedHero.pet.happiness}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600 w-20">Salud</span>
                        <Progress
                          value={selectedHero.pet.health}
                          className="flex-1 h-2 bg-blue-100"
                          indicatorClassName="bg-blue-500"
                        />
                        <span className="text-sm font-semibold text-gray-700">{selectedHero.pet.health}%</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm text-gray-600 w-20">Energía</span>
                        <Progress
                          value={selectedHero.pet.energy}
                          className="flex-1 h-2 bg-yellow-100"
                          indicatorClassName="bg-yellow-500"
                        />
                        <span className="text-sm font-semibold text-gray-700">{selectedHero.pet.energy}%</span>
                      </div>
                    </div>

                    {/* Pet Actions */}
                    <div className="grid grid-cols-3 gap-2">
                      <ActionButton
                        icon={Apple}
                        label="Alimentar"
                        onClick={() =>
                          handlePetAction(selectedHero.id, `${selectedHero.id}-pet-feed`, () =>
                            petAPI.feedPet(selectedHero.id),
                          )
                        }
                        loading={actionStates[`${selectedHero.id}-pet-feed`]}
                        variant="success"
                      />
                      <ActionButton
                        icon={Gamepad2}
                        label="Jugar"
                        onClick={() =>
                          handlePetAction(selectedHero.id, `${selectedHero.id}-pet-play`, () =>
                            petAPI.playWithPet(selectedHero.id),
                          )
                        }
                        loading={actionStates[`${selectedHero.id}-pet-play`]}
                        disabled={selectedHero.energy < 10}
                        variant="primary"
                      />
                      <ActionButton
                        icon={Heart}
                        label="Curar"
                        onClick={() =>
                          handlePetAction(selectedHero.id, `${selectedHero.id}-pet-heal`, () =>
                            petAPI.healPet(selectedHero.id),
                          )
                        }
                        loading={actionStates[`${selectedHero.id}-pet-heal`]}
                        disabled={selectedHero.pet.health > 90}
                        variant="warning"
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Historial de Actividades</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {selectedHero.history.map((entry) => (
                      <div key={entry.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-500">{entry.timestamp}</span>
                        </div>
                        <p className="font-semibold text-gray-800">{entry.action}</p>
                        <p className="text-sm text-gray-600">{entry.result}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="items" className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-800">Inventario</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedHero.items.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-4 text-center">
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                        <div className="mt-2">
                          {Object.entries(item.effect).map(([stat, value]) => (
                            <span key={stat} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded mr-1">
                              {stat} +{value}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                    {selectedHero.items.length === 0 && (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No hay objetos en el inventario</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              {/* Advanced Actions */}
              <div className="flex gap-3 mt-6">
                <Button
                  className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 rounded-xl"
                  onClick={() =>
                    handleAction(selectedHero.id, `${selectedHero.id}-customize`, () =>
                      heroAPI.customizeHero(selectedHero.id, {
                        bodyColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                        capeColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
                      }),
                    )
                  }
                  disabled={actionStates[`${selectedHero.id}-customize`]}
                >
                  {actionStates[`${selectedHero.id}-customize`] ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Palette className="w-4 h-4 mr-2" />
                  )}
                  Personalizar Héroe
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 rounded-xl">
                  <Coffee className="w-4 h-4 mr-2" />
                  Descanso Completo
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
