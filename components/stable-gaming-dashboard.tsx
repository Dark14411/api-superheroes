'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  Home, 
  Brain, 
  Heart, 
  Gamepad2, 
  Users, 
  ShoppingCart, 
  Trophy, 
  Star,
  Menu,
  X,
  Target,
  Zap,
  Crown,
  BarChart3,
  Plus,
  Minus,
  Gift,
  Sword,
  Shield,
  Magic,
  Coins,
  Gem
} from 'lucide-react'

// 🎮 INTERFACES SIMPLES
interface PlayerProfile {
  username: string
  level: number
  experience: number
  experienceToNext: number
  coins: number
  gems: number
  achievements: number
  totalPlayTime: number
  avatar: string
  rank: string
  health: number
  energy: number
  happiness: number
  statistics: {
    gamesPlayed: number
    gamesWon: number
    totalScore: number
    averageScore: number
    consecutiveDays: number
    favoritePet: string
    favoriteHero: string
  }
}

interface Game {
  id: string
  name: string
  description: string
  difficulty: number
  rewards: {
    experience: number
    coins: number
    gems: number
  }
  isUnlocked: boolean
  isCompleted: boolean
}

interface Pet {
  id: string
  name: string
  type: string
  rarity: string
  health: number
  happiness: number
  energy: number
  level: number
  isAdopted: boolean
  image: string
}

interface Hero {
  id: string
  name: string
  power: number
  defense: number
  speed: number
  special: string
  level: number
  isUnlocked: boolean
  image: string
}

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  isCompleted: boolean
  progress: number
  maxProgress: number
  rewards: {
    experience: number
    coins: number
    gems: number
  }
}

export default function StableGamingDashboard() {
  // 🎮 ESTADOS PRINCIPALES
  const [activeTab, setActiveTab] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [playerProfile, setPlayerProfile] = useState<PlayerProfile>({
    username: 'GamerLegend',
    level: 8,
    experience: 2400,
    experienceToNext: 3000,
    coins: 15500,
    gems: 125,
    achievements: 28,
    totalPlayTime: 156,
    avatar: '/avatars/1.png',
    rank: 'Elite Gamer',
    health: 85,
    energy: 70,
    happiness: 90,
    statistics: {
      gamesPlayed: 45,
      gamesWon: 32,
      totalScore: 125000,
      averageScore: 2777,
      consecutiveDays: 12,
      favoritePet: 'Rex (Perro Cósmico)',
      favoriteHero: 'Fénix de Fuego'
    }
  })

  const [quickStats, setQuickStats] = useState({
    todayScore: 850,
    weeklyRank: 3,
    activeChallenges: 2,
    friendsOnline: 8
  })

  const [economy, setEconomy] = useState({
    dailyIncome: 150,
    weeklySpending: 75,
    totalWealth: 25000,
    currencies: {
      coins: 15500,
      premiumCoins: 125,
      gems: 125
    }
  })

  // 🎮 ESTADOS DINÁMICOS
  const [games, setGames] = useState<Game[]>([
    {
      id: '1',
      name: 'Aventura Espacial',
      description: 'Explora el cosmos en esta épica aventura',
      difficulty: 1,
      rewards: { experience: 100, coins: 50, gems: 2 },
      isUnlocked: true,
      isCompleted: false
    },
    {
      id: '2',
      name: 'Batalla Épica',
      description: 'Enfréntate a enemigos poderosos',
      difficulty: 2,
      rewards: { experience: 150, coins: 75, gems: 3 },
      isUnlocked: true,
      isCompleted: false
    },
    {
      id: '3',
      name: 'Misión Secreta',
      description: 'Completa objetivos ocultos',
      difficulty: 3,
      rewards: { experience: 200, coins: 100, gems: 5 },
      isUnlocked: false,
      isCompleted: false
    }
  ])

  const [pets, setPets] = useState<Pet[]>([
    {
      id: '1',
      name: 'Rex',
      type: 'Perro Cósmico',
      rarity: 'Legendario',
      health: 100,
      happiness: 85,
      energy: 90,
      level: 5,
      isAdopted: true,
      image: '/pet/mascota_perro.png'
    },
    {
      id: '2',
      name: 'Luna',
      type: 'Gato Estelar',
      rarity: 'Épico',
      health: 95,
      happiness: 90,
      energy: 85,
      level: 3,
      isAdopted: false,
      image: '/pet/mascota_gato.png'
    },
    {
      id: '3',
      name: 'Spark',
      type: 'Conejo Eléctrico',
      rarity: 'Raro',
      health: 80,
      happiness: 75,
      energy: 95,
      level: 2,
      isAdopted: false,
      image: '/pet/mascota_conejo.png'
    }
  ])

  const [heroes, setHeroes] = useState<Hero[]>([
    {
      id: '1',
      name: 'Fénix de Fuego',
      power: 95,
      defense: 80,
      speed: 90,
      special: 'Resurrección',
      level: 8,
      isUnlocked: true,
      image: '/heroe/superheroe_fire_phoenix.png'
    },
    {
      id: '2',
      name: 'Guardián de Hielo',
      power: 85,
      defense: 95,
      speed: 75,
      special: 'Escudo de Hielo',
      level: 6,
      isUnlocked: true,
      image: '/heroe/superheroe_ice_guardian.png'
    },
    {
      id: '3',
      name: 'Rayo de Trueno',
      power: 90,
      defense: 70,
      speed: 100,
      special: 'Velocidad Suprema',
      level: 4,
      isUnlocked: false,
      image: '/heroe/superheroe_thunder_bolt.png'
    }
  ])

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: '1',
      name: 'Primer Paso',
      description: 'Completa tu primer juego',
      icon: '🎮',
      isCompleted: false,
      progress: 0,
      maxProgress: 1,
      rewards: { experience: 50, coins: 25, gems: 1 }
    },
    {
      id: '2',
      name: 'Coleccionista',
      description: 'Adopta 3 mascotas',
      icon: '🐾',
      isCompleted: false,
      progress: 1,
      maxProgress: 3,
      rewards: { experience: 100, coins: 50, gems: 2 }
    },
    {
      id: '3',
      name: 'Héroe Legendario',
      description: 'Desbloquea 5 héroes',
      icon: '🦸',
      isCompleted: false,
      progress: 2,
      maxProgress: 5,
      rewards: { experience: 200, coins: 100, gems: 5 }
    }
  ])

  // 🎯 FUNCIONES DINÁMICAS
  const addExperience = (amount: number) => {
    setPlayerProfile(prev => {
      const newExp = prev.experience + amount
      const newLevel = Math.floor(newExp / 1000) + 1
      const expToNext = newLevel * 1000
      
      if (newLevel > prev.level) {
        toast.success(`¡Nivel ${newLevel} alcanzado! +${amount} XP`)
        return {
          ...prev,
          level: newLevel,
          experience: newExp,
          experienceToNext: expToNext
        }
      }
      
      return {
        ...prev,
        experience: newExp
      }
    })
  }

  const addCoins = (amount: number) => {
    setPlayerProfile(prev => ({
      ...prev,
      coins: prev.coins + amount
    }))
    setEconomy(prev => ({
      ...prev,
      currencies: {
        ...prev.currencies,
        coins: prev.currencies.coins + amount
      }
    }))
  }

  const addGems = (amount: number) => {
    setPlayerProfile(prev => ({
      ...prev,
      gems: prev.gems + amount
    }))
    setEconomy(prev => ({
      ...prev,
      currencies: {
        ...prev.currencies,
        gems: prev.currencies.gems + amount
      }
    }))
  }

  const handleGamePlay = (gameId: string) => {
    const game = games.find(g => g.id === gameId)
    if (!game) return

    // Simular juego
    const success = Math.random() > 0.3 // 70% de éxito
    
    if (success) {
      addExperience(game.rewards.experience)
      addCoins(game.rewards.coins)
      addGems(game.rewards.gems)
      
      setGames(prev => prev.map(g => 
        g.id === gameId ? { ...g, isCompleted: true } : g
      ))
      
      toast.success(`¡${game.name} completado! +${game.rewards.experience} XP, +${game.rewards.coins} monedas`)
    } else {
      toast.error(`¡Fallaste en ${game.name}! Inténtalo de nuevo`)
    }
  }

  const handlePetAdopt = (petId: string) => {
    setPets(prev => prev.map(pet => 
      pet.id === petId ? { ...pet, isAdopted: true } : pet
    ))
    
    const pet = pets.find(p => p.id === petId)
    if (pet) {
      addExperience(50)
      addCoins(25)
      toast.success(`¡${pet.name} adoptado! +50 XP, +25 monedas`)
    }
  }

  const handlePetCare = (petId: string, action: 'feed' | 'play' | 'heal') => {
    setPets(prev => prev.map(pet => {
      if (pet.id !== petId) return pet
      
      let newPet = { ...pet }
      
      switch (action) {
        case 'feed':
          newPet.health = Math.min(100, pet.health + 20)
          newPet.happiness = Math.min(100, pet.happiness + 10)
          addExperience(10)
          toast.success(`¡${pet.name} alimentado! +10 XP`)
          break
        case 'play':
          newPet.happiness = Math.min(100, pet.happiness + 25)
          newPet.energy = Math.max(0, pet.energy - 10)
          addExperience(15)
          toast.success(`¡Jugaste con ${pet.name}! +15 XP`)
          break
        case 'heal':
          newPet.health = 100
          addExperience(20)
          addCoins(10)
          toast.success(`¡${pet.name} curado! +20 XP, +10 monedas`)
          break
      }
      
      return newPet
    }))
  }

  const handleHeroUnlock = (heroId: string) => {
    const hero = heroes.find(h => h.id === heroId)
    if (!hero || hero.isUnlocked) return
    
    if (playerProfile.coins >= 1000) {
      setHeroes(prev => prev.map(h => 
        h.id === heroId ? { ...h, isUnlocked: true } : h
      ))
      
      addCoins(-1000)
      addExperience(100)
      toast.success(`¡${hero.name} desbloqueado! -1000 monedas, +100 XP`)
    } else {
      toast.error('No tienes suficientes monedas (necesitas 1000)')
    }
  }

  const handleAchievementCheck = () => {
    setAchievements(prev => prev.map(achievement => {
      let newAchievement = { ...achievement }
      
      // Verificar logros
      if (achievement.id === '1' && games.some(g => g.isCompleted)) {
        newAchievement.progress = 1
        if (newAchievement.progress >= newAchievement.maxProgress && !newAchievement.isCompleted) {
          newAchievement.isCompleted = true
          addExperience(newAchievement.rewards.experience)
          addCoins(newAchievement.rewards.coins)
          addGems(newAchievement.rewards.gems)
          toast.success(`¡Logro desbloqueado: ${achievement.name}!`)
        }
      }
      
      if (achievement.id === '2') {
        const adoptedPets = pets.filter(p => p.isAdopted).length
        newAchievement.progress = adoptedPets
        if (newAchievement.progress >= newAchievement.maxProgress && !newAchievement.isCompleted) {
          newAchievement.isCompleted = true
          addExperience(newAchievement.rewards.experience)
          addCoins(newAchievement.rewards.coins)
          addGems(newAchievement.rewards.gems)
          toast.success(`¡Logro desbloqueado: ${achievement.name}!`)
        }
      }
      
      if (achievement.id === '3') {
        const unlockedHeroes = heroes.filter(h => h.isUnlocked).length
        newAchievement.progress = unlockedHeroes
        if (newAchievement.progress >= newAchievement.maxProgress && !newAchievement.isCompleted) {
          newAchievement.isCompleted = true
          addExperience(newAchievement.rewards.experience)
          addCoins(newAchievement.rewards.coins)
          addGems(newAchievement.rewards.gems)
          toast.success(`¡Logro desbloqueado: ${achievement.name}!`)
        }
      }
      
      return newAchievement
    }))
  }

  // 🎮 EFECTO PARA VERIFICAR LOGROS
  useEffect(() => {
    handleAchievementCheck()
  }, [games, pets, heroes])

  // 🎮 NAVEGACIÓN SIMPLIFICADA
  const navigationItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'games', label: 'Juegos', icon: Gamepad2 },
    { id: 'pets', label: 'Mascotas', icon: Heart },
    { id: 'multiplayer', label: 'Multijugador', icon: Users },
    { id: 'marketplace', label: 'Tienda', icon: ShoppingCart },
    { id: 'achievements', label: 'Logros', icon: Trophy },
    { id: 'profile', label: 'Perfil', icon: Star }
  ]

  const renderActiveContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome />
      case 'games':
        return <GamesPanel />
      case 'pets':
        return <PetsPanel />
      case 'multiplayer':
        return <MultiplayerPanel />
      case 'marketplace':
        return <MarketplacePanel />
      case 'achievements':
        return <AchievementsPanel />
      case 'profile':
        return <ProfilePanel />
      default:
        return <DashboardHome />
    }
  }

  const DashboardHome = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-8 rgb-card">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 rgb-text">
                ¡Bienvenido, {playerProfile.username}!
              </h1>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-6">
                <Badge className="rgb-glow" variant="secondary">
                  <Crown className="w-4 h-4 mr-2" />
                  {playerProfile.rank}
                </Badge>
                <Badge className="rgb-glow" variant="secondary">
                  <Target className="w-4 h-4 mr-2" />
                  Nivel {playerProfile.level}
                </Badge>
                <Badge className="rgb-glow" variant="secondary">
                  <Trophy className="w-4 h-4 mr-2" />
                  {playerProfile.achievements} Logros
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-center rgb-pulse">
                <div className="text-4xl">🎮</div>
                <div className="text-sm text-white/80">Jugando</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rgb-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rgb-pulse">
                <BarChart3 className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold rgb-text">{playerProfile.experience}</p>
                <p className="text-sm text-gray-500">Experiencia</p>
              </div>
            </div>
            <Progress value={(playerProfile.experience / playerProfile.experienceToNext) * 100} className="mt-4" />
          </CardContent>
        </Card>

        <Card className="rgb-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rgb-pulse">
                <Coins className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold rgb-text">{playerProfile.coins}</p>
                <p className="text-sm text-gray-500">Monedas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rgb-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rgb-pulse">
                <Gem className="w-8 h-8 text-purple-400" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold rgb-text">{playerProfile.gems}</p>
                <p className="text-sm text-gray-500">Gemas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rgb-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="rgb-pulse">
                <Heart className="w-8 h-8 text-red-400" />
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold rgb-text">{playerProfile.health}%</p>
                <p className="text-sm text-gray-500">Salud</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rgb-card">
          <CardHeader>
            <CardTitle className="rgb-text flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full rgb-button" 
              onClick={() => {
                addExperience(50)
                addCoins(25)
                toast.success('¡Actividad completada! +50 XP, +25 monedas')
              }}
            >
              <Target className="w-4 h-4 mr-2" />
              Actividad Diaria
            </Button>
            <Button 
              className="w-full rgb-button" 
              onClick={() => {
                addGems(5)
                toast.success('¡Recompensa especial! +5 gemas')
              }}
            >
              <Gift className="w-4 h-4 mr-2" />
              Recompensa Especial
            </Button>
          </CardContent>
        </Card>

        <Card className="rgb-card">
          <CardHeader>
            <CardTitle className="rgb-text flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Estadísticas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Juegos Jugados:</span>
              <span className="rgb-text font-semibold">{playerProfile.statistics.gamesPlayed}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Victorias:</span>
              <span className="rgb-text font-semibold">{playerProfile.statistics.gamesWon}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Puntuación Total:</span>
              <span className="rgb-text font-semibold">{playerProfile.statistics.totalScore.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Días Consecutivos:</span>
              <span className="rgb-text font-semibold">{playerProfile.statistics.consecutiveDays}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const GamesPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold rgb-text">🎮 Juegos Disponibles</h2>
        <Badge className="rgb-glow" variant="secondary">
          {games.filter(g => g.isUnlocked).length}/{games.length} Desbloqueados
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map(game => (
          <Card key={game.id} className="rgb-card group cursor-pointer hover:scale-105 transition-all duration-300">
            <CardHeader>
              <CardTitle className="rgb-text">{game.name}</CardTitle>
              <p className="text-sm text-gray-500">{game.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className="rgb-glow" variant="secondary">
                  Nivel {game.difficulty}
                </Badge>
                {game.isCompleted && (
                  <Badge className="rgb-glow bg-green-600">Completado</Badge>
                )}
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Recompensas:</span>
                </div>
                <div className="flex gap-2 text-xs">
                  <span className="rgb-text">+{game.rewards.experience} XP</span>
                  <span className="rgb-text">+{game.rewards.coins} 💰</span>
                  <span className="rgb-text">+{game.rewards.gems} 💎</span>
                </div>
              </div>
              
              <Button 
                className="w-full rgb-button"
                disabled={!game.isUnlocked}
                onClick={() => handleGamePlay(game.id)}
              >
                {game.isCompleted ? 'Jugar de Nuevo' : 'Jugar Ahora'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const PetsPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold rgb-text">🐾 Mis Mascotas</h2>
        <Badge className="rgb-glow" variant="secondary">
          {pets.filter(p => p.isAdopted).length}/{pets.length} Adoptadas
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map(pet => (
          <Card key={pet.id} className="rgb-card">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden rgb-pulse">
                  <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <CardTitle className="rgb-text">{pet.name}</CardTitle>
                  <p className="text-sm text-gray-500">{pet.type}</p>
                  <Badge className="rgb-glow mt-1" variant="secondary">
                    {pet.rarity}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Salud:</span>
                  <span className="rgb-text">{pet.health}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Felicidad:</span>
                  <span className="rgb-text">{pet.happiness}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Energía:</span>
                  <span className="rgb-text">{pet.energy}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Nivel:</span>
                  <span className="rgb-text">{pet.level}</span>
                </div>
              </div>
              
              {pet.isAdopted ? (
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    size="sm" 
                    className="rgb-button"
                    onClick={() => handlePetCare(pet.id, 'feed')}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="rgb-button"
                    onClick={() => handlePetCare(pet.id, 'play')}
                  >
                    <Heart className="w-3 h-3" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="rgb-button"
                    onClick={() => handlePetCare(pet.id, 'heal')}
                  >
                    <Shield className="w-3 h-3" />
                  </Button>
                </div>
              ) : (
                <Button 
                  className="w-full rgb-button"
                  onClick={() => handlePetAdopt(pet.id)}
                >
                  Adoptar por 100 monedas
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const MultiplayerPanel = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold rgb-text">👥 Multijugador</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rgb-card">
          <CardHeader>
            <CardTitle className="rgb-text">Jugadores Online</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-green-900/20 rounded">
                <span>GamerPro123</span>
                <Badge className="rgb-glow" variant="secondary">Online</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-900/20 rounded">
                <span>ElitePlayer</span>
                <Badge className="rgb-glow" variant="secondary">Jugando</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-purple-900/20 rounded">
                <span>LegendGamer</span>
                <Badge className="rgb-glow" variant="secondary">Online</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rgb-card">
          <CardHeader>
            <CardTitle className="rgb-text">Salas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-yellow-900/20 rounded">
                <span>Batalla Épica</span>
                <Badge className="rgb-glow" variant="secondary">2/4</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-red-900/20 rounded">
                <span>Torneo Legendario</span>
                <Badge className="rgb-glow" variant="secondary">8/16</Badge>
              </div>
              <div className="flex items-center justify-between p-2 bg-green-900/20 rounded">
                <span>Misión Cooperativa</span>
                <Badge className="rgb-glow" variant="secondary">3/6</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const MarketplacePanel = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold rgb-text">💰 Tienda</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="rgb-card">
          <CardHeader>
            <CardTitle className="rgb-text">Poción de Salud</CardTitle>
            <p className="text-sm text-gray-500">Restaura 50% de salud</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="rgb-text font-bold">50 monedas</span>
              <Badge className="rgb-glow" variant="secondary">Consumible</Badge>
            </div>
            <Button className="w-full rgb-button">Comprar</Button>
          </CardContent>
        </Card>

        <Card className="rgb-card">
          <CardHeader>
            <CardTitle className="rgb-text">Espada Legendaria</CardTitle>
            <p className="text-sm text-gray-500">+25 de poder</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="rgb-text font-bold">500 monedas</span>
              <Badge className="rgb-glow" variant="secondary">Equipamiento</Badge>
            </div>
            <Button className="w-full rgb-button">Comprar</Button>
          </CardContent>
        </Card>

        <Card className="rgb-card">
          <CardHeader>
            <CardTitle className="rgb-text">Gema de Poder</CardTitle>
            <p className="text-sm text-gray-500">Mejora habilidades</p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <span className="rgb-text font-bold">10 gemas</span>
              <Badge className="rgb-glow" variant="secondary">Especial</Badge>
            </div>
            <Button className="w-full rgb-button">Comprar</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const AchievementsPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold rgb-text">🏆 Logros</h2>
        <Badge className="rgb-glow" variant="secondary">
          {achievements.filter(a => a.isCompleted).length}/{achievements.length} Completados
        </Badge>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map(achievement => (
          <Card key={achievement.id} className="rgb-card">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="text-3xl">{achievement.icon}</div>
                <div>
                  <CardTitle className="rgb-text">{achievement.name}</CardTitle>
                  <p className="text-sm text-gray-500">{achievement.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso:</span>
                  <span className="rgb-text">{achievement.progress}/{achievement.maxProgress}</span>
                </div>
                <Progress value={(achievement.progress / achievement.maxProgress) * 100} />
              </div>
              
              {achievement.isCompleted ? (
                <Badge className="rgb-glow bg-green-600 w-full justify-center">Completado</Badge>
              ) : (
                <div className="space-y-2">
                  <div className="text-xs text-gray-500">Recompensas:</div>
                  <div className="flex gap-2 text-xs">
                    <span className="rgb-text">+{achievement.rewards.experience} XP</span>
                    <span className="rgb-text">+{achievement.rewards.coins} 💰</span>
                    <span className="rgb-text">+{achievement.rewards.gems} 💎</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const ProfilePanel = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold rgb-text">👤 Perfil</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rgb-card">
          <CardHeader>
            <CardTitle className="rgb-text">Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full overflow-hidden rgb-pulse">
                <img src={playerProfile.avatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="rgb-text font-bold">{playerProfile.username}</h3>
                <p className="text-sm text-gray-500">{playerProfile.rank}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Nivel:</span>
                <span className="rgb-text font-semibold">{playerProfile.level}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Experiencia:</span>
                <span className="rgb-text font-semibold">{playerProfile.experience}/{playerProfile.experienceToNext}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Tiempo Total:</span>
                <span className="rgb-text font-semibold">{playerProfile.totalPlayTime}h</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rgb-card">
          <CardHeader>
            <CardTitle className="rgb-text">Estadísticas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Juegos Jugados:</span>
                <span className="rgb-text font-semibold">{playerProfile.statistics.gamesPlayed}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Victorias:</span>
                <span className="rgb-text font-semibold">{playerProfile.statistics.gamesWon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Puntuación Total:</span>
                <span className="rgb-text font-semibold">{playerProfile.statistics.totalScore.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Promedio:</span>
                <span className="rgb-text font-semibold">{playerProfile.statistics.averageScore}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900/95 backdrop-blur-sm border-r border-gray-700 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} rgb-border`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-3 p-6 border-b border-gray-700">
            <div className="text-2xl rgb-pulse">🎮</div>
            <span className="text-xl font-bold rgb-text">Gaming Hub</span>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'default' : 'ghost'}
                className={`w-full justify-start rgb-button ${activeTab === item.id ? 'bg-purple-600' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <item.icon className="w-4 h-4 mr-3" />
                {item.label}
              </Button>
            ))}
          </nav>
          
          {/* Toggle Button */}
          <div className="p-4 border-t border-gray-700">
            <Button
              variant="outline"
              size="sm"
              className="w-full rgb-button"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-4 h-4 mr-2" />
              Cerrar
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* Header */}
        <header className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="rgb-button"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Coins className="w-5 h-5 text-yellow-400" />
                <span className="rgb-text font-semibold">{playerProfile.coins}</span>
              </div>
              <div className="flex items-center gap-2">
                <Gem className="w-5 h-5 text-purple-400" />
                <span className="rgb-text font-semibold">{playerProfile.gems}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-6">
          {renderActiveContent()}
        </main>
      </div>
    </div>
  )
} 