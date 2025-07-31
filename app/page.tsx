'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  Heart, 
  Utensils, 
  Bath, 
  Bed, 
  Gamepad2, 
  Star,
  ShoppingCart,
  Trophy,
  User,
  Home,
  Menu,
  X,
  Plus,
  Minus,
  Zap,
  Droplets,
  Sun,
  Moon,
  Crown,
  Target,
  Coins,
  Gem,
  Sparkles,
  Palette,
  Settings,
  Play,
  Award,
  Gift
} from 'lucide-react'

// 🎮 IMPORTAR MINIJUEGOS
import SnakeGame from '@/components/games/Snake'
import MemoryGame from '@/components/games/Memory'
import PongGame from '@/components/games/Pong'
import SimonGame from '@/components/games/Simon'

// 🎮 IMPORTAR HOOKS SEGUROS
import { useLocalStorage } from '@/hooks/use-hydration-safe'

// 🎮 INTERFACES DEL JUEGO
interface PetStats {
  hunger: number
  happiness: number
  energy: number
  cleanliness: number
  health: number
}

interface Pet {
  name: string
  color: string
  level: number
  experience: number
  experienceToNext: number
  coins: number
  gems: number
  accessories: string[]
  background: string
  stats: PetStats
  mood: 'ecstatic' | 'happy' | 'content' | 'neutral' | 'sad' | 'tired' | 'sick'
  personality: string
  lastPlayed: string
  achievements: string[]
}

interface GameScore {
  game: string
  score: number
  date: string
  rewards: {
    coins: number
    experience: number
    happiness: number
  }
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  isCompleted: boolean
  progress: number
  maxProgress: number
  reward: number
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
}

export default function EpicPouGame() {
  // 🎮 ESTADO PRINCIPAL
  const [activeTab, setActiveTab] = useState('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showNameModal, setShowNameModal] = useState(false)
  const [petName, setPetName] = useState('')
  const [showCustomization, setShowCustomization] = useState(false)
  const [currentGame, setCurrentGame] = useState<string | null>(null)
  const [showGame, setShowGame] = useState<string | null>(null)

  // 🎮 ESTADO DE LA MASCOTA CON LOCALSTORAGE SEGURO
  const [pet, setPet] = useLocalStorage<Pet>('epic-pou-pet', {
    name: 'Mi Pou Épico',
    color: '#FF6B9D',
    level: 1,
    experience: 0,
    experienceToNext: 100,
    coins: 1000,
    gems: 50,
    accessories: ['crown'],
    background: 'gradient-1',
    stats: {
      hunger: 100,
      happiness: 100,
      energy: 100,
      cleanliness: 100,
      health: 100
    },
    mood: 'happy',
    personality: 'playful',
    lastPlayed: new Date().toISOString(),
    achievements: []
  })

  // 🎮 ESTADO DE PUNTUACIONES CON LOCALSTORAGE SEGURO
  const [gameScores, setGameScores] = useLocalStorage<GameScore[]>('epic-pou-scores', [])

  // 🎮 ESTADO DE LOGROS
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      name: 'Primer Cuidado',
      description: 'Alimenta a tu mascota por primera vez',
      icon: '🍽️',
      isCompleted: true,
      progress: 1,
      maxProgress: 1,
      reward: 10,
      rarity: 'common'
    },
    {
      id: '2',
      name: 'Limpieza Perfecta',
      description: 'Mantén la limpieza al 100% por 1 día',
      icon: '🧼',
      isCompleted: false,
      progress: 0,
      maxProgress: 1,
      reward: 15,
      rarity: 'rare'
    },
    {
      id: '3',
      name: 'Jugador Experto',
      description: 'Juega 10 veces con tu mascota',
      icon: '🎮',
      isCompleted: false,
      progress: 2,
      maxProgress: 10,
      reward: 25,
      rarity: 'epic'
    },
    {
      id: '4',
      name: 'Coleccionista',
      description: 'Adquiere 5 accesorios diferentes',
      icon: '👑',
      isCompleted: false,
      progress: 1,
      maxProgress: 5,
      reward: 50,
      rarity: 'legendary'
    },
    {
      id: '5',
      name: 'Gamer Pro',
      description: 'Consigue 1000 puntos en cualquier minijuego',
      icon: '🏆',
      isCompleted: false,
      progress: 0,
      maxProgress: 1000,
      reward: 100,
      rarity: 'epic'
    }
  ])



  // 🎮 FUNCIONES DE ACCIÓN
  const handleFeed = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setPet(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          hunger: Math.min(100, prev.stats.hunger + 30),
          happiness: Math.min(100, prev.stats.happiness + 10),
          health: Math.min(100, prev.stats.health + 5)
        },
        experience: prev.experience + 5,
        coins: prev.coins + 2,
        mood: 'happy'
      }))
      
      toast.success('¡Tu mascota está más feliz! +5 XP, +2 monedas')
    } catch (error) {
      toast.error('Error al alimentar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClean = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 600))
      
      setPet(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          cleanliness: 100,
          happiness: Math.min(100, prev.stats.happiness + 15),
          health: Math.min(100, prev.stats.health + 10)
        },
        experience: prev.experience + 8,
        coins: prev.coins + 3,
        mood: 'content'
      }))
      
      toast.success('¡Tu mascota está limpia! +8 XP, +3 monedas')
    } catch (error) {
      toast.error('Error al limpiar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSleep = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setPet(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          energy: 100,
          hunger: Math.max(0, prev.stats.hunger - 10),
          health: Math.min(100, prev.stats.health + 15)
        },
        experience: prev.experience + 10,
        coins: prev.coins + 5,
        mood: 'content'
      }))
      
      toast.success('¡Tu mascota descansó bien! +10 XP, +5 monedas')
    } catch (error) {
      toast.error('Error al dormir')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlay = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1200))
      
      setPet(prev => ({
        ...prev,
        stats: {
          ...prev.stats,
          happiness: Math.min(100, prev.stats.happiness + 25),
          energy: Math.max(0, prev.stats.energy - 15),
          hunger: Math.max(0, prev.stats.hunger - 5)
        },
        experience: prev.experience + 15,
        coins: prev.coins + 8,
        mood: 'ecstatic'
      }))
      
      toast.success('¡Jugaste con tu mascota! +15 XP, +8 monedas')
    } catch (error) {
      toast.error('Error al jugar')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGameReward = (gameName: string, score: number, rewards: any) => {
    setPet(prev => ({
      ...prev,
      experience: prev.experience + rewards.experience,
      coins: prev.coins + rewards.coins,
      stats: {
        ...prev.stats,
        happiness: Math.min(100, prev.stats.happiness + rewards.happiness)
      },
      lastPlayed: new Date().toISOString()
    }))

    setGameScores(prev => [...prev, {
      game: gameName,
      score,
      date: new Date().toISOString(),
      rewards
    }])

    setShowGame(null)
    toast.success(`¡${gameName} completado! +${rewards.experience} XP, +${rewards.coins} monedas`)
  }

  // 🎮 MANEJAR INICIO DE JUEGO
  const handleStartGame = (gameId: string) => {
    setShowGame(gameId)
    toast.info(`Iniciando ${gameId}...`)
  }

  // 🎮 MANEJAR CIERRE DE JUEGO
  const handleCloseGame = () => {
    setShowGame(null)
  }

  const handleChangeName = () => {
    if (petName.trim()) {
      setPet(prev => ({ ...prev, name: petName.trim() }))
      setShowNameModal(false)
      setPetName('')
      toast.success('¡Nombre cambiado!')
    }
  }

  // 🎮 DECREMENTAR STATS AUTOMÁTICAMENTE
  useEffect(() => {
    const interval = setInterval(() => {
      setPet(prev => {
        const newStats = {
          hunger: Math.max(0, prev.stats.hunger - 0.5),
          happiness: Math.max(0, prev.stats.happiness - 0.3),
          energy: Math.max(0, prev.stats.energy - 0.2),
          cleanliness: Math.max(0, prev.stats.cleanliness - 0.4),
          health: Math.max(0, prev.stats.health - 0.1)
        }
        
        // Determinar mood basado en stats
        let newMood: Pet['mood'] = 'neutral'
        const avgHappiness = (newStats.happiness + newStats.energy) / 2
        
        if (avgHappiness >= 80) newMood = 'ecstatic'
        else if (avgHappiness >= 60) newMood = 'happy'
        else if (avgHappiness >= 40) newMood = 'content'
        else if (avgHappiness >= 20) newMood = 'sad'
        else newMood = 'sick'
        
        return {
          ...prev,
          stats: newStats,
          mood: newMood
        }
      })
    }, 30000) // Cada 30 segundos

    return () => clearInterval(interval)
  }, [])

  // 🎮 VERIFICAR NIVEL
  useEffect(() => {
    if (pet.experience >= pet.experienceToNext) {
      setPet(prev => ({
        ...prev,
        level: prev.level + 1,
        experience: prev.experience - prev.experienceToNext,
        experienceToNext: prev.experienceToNext * 1.5,
        coins: prev.coins + 20,
        gems: prev.gems + 2
      }))
      toast.success(`¡Nivel ${pet.level + 1} alcanzado! +20 monedas, +2 gemas`)
    }
  }, [pet.experience, pet.experienceToNext])

  // 🎮 NAVEGACIÓN
  const navigationItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'games', label: 'Minijuegos', icon: Gamepad2 },
    { id: 'customize', label: 'Personalizar', icon: Palette },
    { id: 'achievements', label: 'Logros', icon: Trophy },
    { id: 'profile', label: 'Perfil', icon: User }
  ]

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomePanel />
      case 'games':
        return <GamesPanel />
      case 'customize':
        return <CustomizePanel />
      case 'achievements':
        return <AchievementsPanel />
      case 'profile':
        return <ProfilePanel />
      default:
        return <HomePanel />
    }
  }

  // 🎮 FUNCIONES AUXILIARES
  const getBackgroundClass = (background: string) => {
    switch (background) {
      case 'gradient-1':
        return 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500'
      case 'gradient-2':
        return 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500'
      case 'gradient-3':
        return 'bg-gradient-to-br from-green-500 via-yellow-500 to-orange-500'
      default:
        return 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500'
    }
  }

  const getAccessoryIcon = (accessory: string) => {
    switch (accessory) {
      case 'Corona Real':
        return '👑'
      case 'Sombrero de Chef':
        return '👨‍🍳'
      case 'Traje de Superhéroe':
        return '🦸'
      default:
        return '🎩'
    }
  }

  const getMoodIcon = (mood: Pet['mood']) => {
    switch (mood) {
      case 'ecstatic':
        return '🤩'
      case 'happy':
        return '😊'
      case 'content':
        return '🙂'
      case 'neutral':
        return '😐'
      case 'sad':
        return '😕'
      case 'sick':
        return '🤒'
      default:
        return '😊'
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return 'bg-gray-500'
      case 'rare':
        return 'bg-blue-500'
      case 'epic':
        return 'bg-purple-500'
      case 'legendary':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  // 🎮 PANEL PRINCIPAL
  const HomePanel = () => (
    <div className="space-y-6">
      {/* 🎯 MASCOTA PRINCIPAL */}
      <Card className="bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white border-0 shadow-2xl">
        <CardHeader className="text-center pb-4">
          <CardTitle className="flex items-center justify-center gap-3 text-3xl font-bold">
            <span className="text-5xl">🐾</span>
            {pet.name}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNameModal(true)}
              className="ml-2 text-white hover:bg-white/20"
            >
              ✏️
            </Button>
          </CardTitle>
          <div className="flex items-center justify-center gap-3">
            <Badge variant="secondary" className="bg-white/20 text-white">
              <Crown className="w-4 h-4 mr-1" />
              Nivel {pet.level}
            </Badge>
            <Badge variant="outline" className="border-white/30 text-white">
              <Coins className="w-4 h-4 mr-1" />
              {pet.coins}
            </Badge>
            <Badge variant="outline" className="border-white/30 text-white">
              <Gem className="w-4 h-4 mr-1" />
              {pet.gems}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* 🎮 MASCOTA VISUAL */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* FONDO */}
              <div className={`w-40 h-40 rounded-full ${getBackgroundClass(pet.background)} flex items-center justify-center shadow-2xl`}>
                {/* CUERPO PRINCIPAL */}
                <div 
                  className="w-32 h-32 rounded-full flex items-center justify-center relative shadow-inner"
                  style={{ backgroundColor: pet.color }}
                >
                  {/* OJOS */}
                  <div className="absolute top-6 left-6 w-4 h-4 bg-white rounded-full shadow-lg"></div>
                  <div className="absolute top-6 right-6 w-4 h-4 bg-white rounded-full shadow-lg"></div>
                  <div className="absolute top-7 left-6 w-2 h-2 bg-black rounded-full"></div>
                  <div className="absolute top-7 right-6 w-2 h-2 bg-black rounded-full"></div>
                  
                  {/* BOCA */}
                  <div className="absolute bottom-8 w-6 h-1 bg-black rounded-full"></div>
                  
                  {/* ACCESORIOS */}
                  {pet.accessories.map((accessory, index) => (
                    <div key={index} className="absolute text-2xl">
                      {getAccessoryIcon(accessory)}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* ESTADO EMOCIONAL */}
              <div className="absolute -top-4 -right-4 text-4xl animate-bounce">
                {getMoodIcon(pet.mood)}
              </div>
            </div>
          </div>

          {/* 📊 ESTADÍSTICAS */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <Utensils className="w-4 h-4" />
                  Hambre
                </span>
                <span>{Math.round(pet.stats.hunger)}%</span>
              </div>
              <Progress value={pet.stats.hunger} className="h-3 bg-white/20" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Felicidad
                </span>
                <span>{Math.round(pet.stats.happiness)}%</span>
              </div>
              <Progress value={pet.stats.happiness} className="h-3 bg-white/20" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Energía
                </span>
                <span>{Math.round(pet.stats.energy)}%</span>
              </div>
              <Progress value={pet.stats.energy} className="h-3 bg-white/20" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <Droplets className="w-4 h-4" />
                  Limpieza
                </span>
                <span>{Math.round(pet.stats.cleanliness)}%</span>
              </div>
              <Progress value={pet.stats.cleanliness} className="h-3 bg-white/20" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-semibold">
                <span className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Salud
                </span>
                <span>{Math.round(pet.stats.health)}%</span>
              </div>
              <Progress value={pet.stats.health} className="h-3 bg-white/20" />
            </div>
          </div>

          {/* 🎮 BOTONES DE ACCIÓN */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <Button
              onClick={handleFeed}
              disabled={isLoading}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 shadow-lg transform hover:scale-105 transition-all"
            >
              <Utensils className="w-5 h-5" />
              {isLoading ? 'Alimentando...' : 'Alimentar'}
            </Button>
            
            <Button
              onClick={handleClean}
              disabled={isLoading}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 shadow-lg transform hover:scale-105 transition-all"
            >
              <Bath className="w-5 h-5" />
              {isLoading ? 'Limpiando...' : 'Limpiar'}
            </Button>
            
            <Button
              onClick={handleSleep}
              disabled={isLoading}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 shadow-lg transform hover:scale-105 transition-all"
            >
              <Bed className="w-5 h-5" />
              {isLoading ? 'Durmiendo...' : 'Dormir'}
            </Button>
            
            <Button
              onClick={handlePlay}
              disabled={isLoading}
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 shadow-lg transform hover:scale-105 transition-all"
            >
              <Gamepad2 className="w-5 h-5" />
              {isLoading ? 'Jugando...' : 'Jugar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 🎯 PROGRESO DE NIVEL */}
      <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-bold">
            <Star className="w-6 h-6" />
            Progreso de Nivel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm font-semibold">
              <span>Experiencia</span>
              <span>{pet.experience}/{Math.round(pet.experienceToNext)} XP</span>
            </div>
            <Progress value={(pet.experience / pet.experienceToNext) * 100} className="h-4 bg-white/20" />
            <div className="text-center text-sm opacity-90">
              ¡Sigue cuidando a tu mascota para subir de nivel!
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // 🎮 PANEL DE MINIJUEGOS
  const GamesPanel = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <Gamepad2 className="w-6 h-6" />
            Minijuegos Épicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: 'snake', name: 'Snake', icon: '🐍', description: 'Come manzanas y crece', color: 'from-green-500 to-emerald-600' },
              { id: 'memory', name: 'Memorama', icon: '🧠', description: 'Encuentra las parejas', color: 'from-blue-500 to-cyan-600' },
              { id: 'pong', name: 'Pong', icon: '🏓', description: 'Juego clásico de ping pong', color: 'from-red-500 to-pink-600' },
              { id: 'simon', name: 'Simon Dice', icon: '🎯', description: 'Repite la secuencia', color: 'from-purple-500 to-indigo-600' }
            ].map((game) => (
              <Card key={game.id} className={`bg-gradient-to-br ${game.color} text-white hover:shadow-xl transition-all transform hover:scale-105 border-0`}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-3xl">{game.icon}</span>
                    {game.name}
                  </CardTitle>
                  <p className="text-sm opacity-90">{game.description}</p>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => handleStartGame(game.id)}
                    className="w-full bg-white/20 hover:bg-white/30 text-white font-bold"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Jugar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // 🎨 PANEL DE PERSONALIZACIÓN
  const CustomizePanel = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-pink-500 to-purple-600 text-white border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <Palette className="w-6 h-6" />
            Personalizar Mascota
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* COLORES */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Color de la Mascota</h3>
            <div className="grid grid-cols-6 gap-3">
              {['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'].map((color) => (
                <button
                  key={color}
                  onClick={() => setPet(prev => ({ ...prev, color }))}
                  className={`w-12 h-12 rounded-full border-4 transition-all ${
                    pet.color === color ? 'border-white shadow-lg scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* ACCESORIOS */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Accesorios</h3>
            <div className="grid grid-cols-4 gap-3">
              {pet.accessories.map((accessory, index) => (
                <div key={index} className="text-center p-3 bg-white/20 rounded-lg">
                  <div className="text-2xl mb-2">{getAccessoryIcon(accessory)}</div>
                  <div className="text-sm font-medium">{accessory}</div>
                </div>
              ))}
            </div>
          </div>

          {/* FONDOS */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Fondos</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'gradient-1', name: 'Arcoíris', class: 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500' },
                { id: 'gradient-2', name: 'Océano', class: 'bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500' },
                { id: 'gradient-3', name: 'Bosque', class: 'bg-gradient-to-br from-green-500 via-yellow-500 to-orange-500' }
              ].map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setPet(prev => ({ ...prev, background: bg.id }))}
                  className={`h-16 rounded-lg transition-all ${
                    pet.background === bg.id ? 'ring-4 ring-white scale-105' : ''
                  } ${bg.class}`}
                >
                  <span className="text-white font-semibold">{bg.name}</span>
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // 🏆 PANEL DE LOGROS
  const AchievementsPanel = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-yellow-500 to-orange-600 text-white border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <Trophy className="w-6 h-6" />
            Logros Épicos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="hover:shadow-xl transition-all transform hover:scale-105 bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-3xl">{achievement.icon}</span>
                    {achievement.name}
                    <Badge className={`${getRarityColor(achievement.rarity)} text-white`}>
                      {achievement.rarity}
                    </Badge>
                  </CardTitle>
                  <p className="text-sm opacity-90">{achievement.description}</p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso:</span>
                      <span>{achievement.progress}/{achievement.maxProgress}</span>
                    </div>
                    <Progress value={(achievement.progress / achievement.maxProgress) * 100} className="h-3 bg-white/20" />
                  </div>
                  
                  {achievement.isCompleted && (
                    <Badge className="w-full justify-center bg-green-500 text-white">
                      ✅ Completado
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // 👤 PANEL DE PERFIL
  const ProfilePanel = () => (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-500 to-purple-600 text-white border-0 shadow-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold">
            <User className="w-6 h-6" />
            Perfil de la Mascota
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-lg">Información Básica</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Nombre:</span>
                    <span className="font-medium">{pet.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nivel:</span>
                    <span className="font-medium">{pet.level}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Personalidad:</span>
                    <span className="font-medium capitalize">{pet.personality}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estado de ánimo:</span>
                    <span className="font-medium">{getMoodIcon(pet.mood)} {pet.mood}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-lg">Recursos</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Monedas:</span>
                    <span className="font-medium">{pet.coins}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gemas:</span>
                    <span className="font-medium">{pet.gems}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 text-lg">Estadísticas</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Experiencia Total:</span>
                    <span className="font-medium">{pet.experience} XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Próximo Nivel:</span>
                    <span className="font-medium">{Math.round(pet.experienceToNext)} XP</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2 text-lg">Estado Actual</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Hambre:</span>
                    <span className="font-medium">{Math.round(pet.stats.hunger)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Felicidad:</span>
                    <span className="font-medium">{Math.round(pet.stats.happiness)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Energía:</span>
                    <span className="font-medium">{Math.round(pet.stats.energy)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Limpieza:</span>
                    <span className="font-medium">{Math.round(pet.stats.cleanliness)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Salud:</span>
                    <span className="font-medium">{Math.round(pet.stats.health)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // 🎮 RENDERIZAR MINIJUEGOS
  const renderGame = () => {
    switch (showGame) {
      case 'snake':
        return (
          <SnakeGame
            onGameEnd={(score, rewards) => handleGameReward('Snake', score, rewards)}
            onClose={handleCloseGame}
          />
        )
      case 'memory':
        return (
          <MemoryGame
            onGameEnd={(score, rewards) => handleGameReward('Memorama', score, rewards)}
            onClose={handleCloseGame}
          />
        )
      case 'pong':
        return (
          <PongGame
            onGameEnd={(score, rewards) => handleGameReward('Pong', score, rewards)}
            onClose={handleCloseGame}
          />
        )
      case 'simon':
        return (
          <SimonGame
            onGameEnd={(score, rewards) => handleGameReward('Simon Dice', score, rewards)}
            onClose={handleCloseGame}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-900 to-red-900">
      {/* 🎮 HEADER */}
      <header className="bg-black/30 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-4xl animate-pulse">🐾</div>
              <div>
                <h1 className="text-2xl font-bold text-white">Pou Épico</h1>
                <p className="text-sm text-white/80">Tu mascota digital épica</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:bg-white/20"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* 🎮 NAVEGACIÓN LATERAL */}
          <nav className={`
            lg:w-64 bg-black/30 backdrop-blur-md rounded-xl p-4 border border-white/20
            ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}
          `}>
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? 'default' : 'ghost'}
                    className={`w-full justify-start text-white font-semibold ${
                      activeTab === item.id 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                        : 'hover:bg-white/20'
                    }`}
                    onClick={() => {
                      setActiveTab(item.id)
                      setIsMobileMenuOpen(false)
                    }}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {item.label}
                  </Button>
                )
              })}
            </div>
          </nav>

          {/* 🎮 CONTENIDO PRINCIPAL */}
          <main className="flex-1">
            {renderActiveContent()}
          </main>
        </div>
      </div>

      {/* 🎮 MODAL DE NOMBRE */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-96 bg-gradient-to-br from-purple-600 to-pink-600 text-white border-0 shadow-2xl">
            <CardHeader>
              <CardTitle>Cambiar Nombre</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input
                type="text"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                placeholder="Nuevo nombre"
                className="w-full p-3 border rounded-lg bg-white/20 text-white placeholder-white/70"
                onKeyPress={(e) => e.key === 'Enter' && handleChangeName()}
              />
              <div className="flex gap-2">
                <Button onClick={handleChangeName} className="flex-1 bg-green-500 hover:bg-green-600">
                  Cambiar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setShowNameModal(false)
                    setPetName('')
                  }}
                  className="flex-1 border-white/30 text-white hover:bg-white/20"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 🎮 RENDERIZAR MINIJUEGOS */}
      {renderGame()}
    </div>
  )
}
