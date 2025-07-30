'use client'

import { useState } from 'react'
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
  BarChart3
} from 'lucide-react'

// Importar componentes simples
import AIPoweredPou from './ai-powered-pou'
import MultiplayerSocialHub from './multiplayer-social-hub'
import MarioStyleMiniGames from './mario-style-mini-games'
import AdvancedEconomyMarketplace from './advanced-economy-marketplace'
import EnhancedPetHeroCollection from './enhanced-pet-hero-collection'
import SimpleScenarioGames from './simple-scenario-games'

// 🎮 INTERFACES SIMPLIFICADAS
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

interface SimpleEconomy {
  totalWealth: number
  dailyIncome: number
  weeklySpending: number
  currencies: {
    coins: number
    premiumCoins: number
    gems: number
  }
}

interface SimplePlayer {
  id: string
  username: string
  level: number
  avatar: string
  status: string
  currentGame: string
}

export default function UltimateGamingDashboard() {
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

  const [economy, setEconomy] = useState<SimpleEconomy>({
    totalWealth: 45000,
    dailyIncome: 500,
    weeklySpending: 1200,
    currencies: {
      coins: 12500,
      premiumCoins: 250,
      gems: 75
    }
  })

  const [pouStats, setPouStats] = useState({
    health: 85,
    happiness: 92,
    energy: 78,
    hunger: 65,
    cleanliness: 90,
    level: 6,
    experience: 75,
    coins: 340
  })

  const [currentPlayer] = useState<SimplePlayer>({
    id: 'player_1',
    username: playerProfile.username,
    level: playerProfile.level,
    avatar: playerProfile.avatar,
    status: 'online',
    currentGame: 'Gaming Hub Ultimate'
  })

  const [quickStats, setQuickStats] = useState({
    todayScore: 850,
    weeklyRank: 3,
    activeChallenges: 2,
    friendsOnline: 8
  })

  // 🎯 FUNCIONES DE ACTIVIDADES
  const handleActivityComplete = (rewards: any) => {
    setPlayerProfile(prev => ({
      ...prev,
      experience: prev.experience + (rewards.experience || 0),
      coins: prev.coins + (rewards.coins || 0),
      gems: prev.gems + (rewards.gems || 0)
    }))
    
    setQuickStats(prev => ({
      ...prev,
      todayScore: prev.todayScore + (rewards.score || 0)
    }))
    
    toast.success(`¡Recompensas obtenidas! +${rewards.experience || 0} XP, +${rewards.coins || 0} monedas`)
  }

  // Función simplificada para marketplace
  const handleEconomyUpdate = (updateFn: (prev: SimpleEconomy) => SimpleEconomy) => {
    setEconomy(updateFn)
  }

  // 🎮 NAVEGACIÓN SIMPLIFICADA
  const navigationItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'pou-ai', label: 'Pou IA', icon: Brain },
    { id: 'pet-collection', label: 'Mascotas', icon: Heart },
    { id: 'escenarios', label: 'Juegos', icon: Gamepad2 }, // CAMBIO: Escenarios como juegos principales
    { id: 'mario-games', label: 'Mario Bros', icon: Target },
    { id: 'multiplayer', label: 'Multijugador', icon: Users },
    { id: 'marketplace', label: 'Mercado', icon: ShoppingCart },
    { id: 'achievements', label: 'Logros', icon: Trophy },
    { id: 'profile', label: 'Perfil', icon: Star }
  ]

  // 🖼️ RENDERIZAR CONTENIDO ACTIVO
  const renderActiveContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardHome />
      case 'pou-ai':
        return <AIPoweredPou pouStats={pouStats} setPouStats={setPouStats} />
      case 'pet-collection':
        return <EnhancedPetHeroCollection 
          onActivityComplete={handleActivityComplete} 
          playerCoins={playerProfile.coins} 
          playerLevel={playerProfile.level}
          playerGems={economy.currencies.gems}
        />
      case 'escenarios': // CAMBIO: Escenarios como juegos principales
        return <SimpleScenarioGames 
          onGameComplete={handleActivityComplete} 
          playerLevel={playerProfile.level} 
          playerCoins={playerProfile.coins} 
        />
      case 'mario-games':
        return <MarioStyleMiniGames 
          onScoreUpdate={handleActivityComplete} 
          playerLevel={playerProfile.level} 
        />
      case 'multiplayer':
        return <MultiplayerSocialHub currentPlayer={currentPlayer as any} />
      case 'marketplace':
        return <AdvancedEconomyMarketplace economy={economy as any} setEconomy={handleEconomyUpdate as any} />
      case 'achievements':
        return <AchievementsPanel />
      case 'profile':
        return <ProfilePanel />
      default:
        return <DashboardHome />
    }
  }

  // 🏠 COMPONENTE HOME SIMPLIFICADO
  const DashboardHome = () => (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-8">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
                ¡Bienvenido, {playerProfile.username}!
              </h1>
              <p className="text-xl text-white/80 mb-6">
                Tu universo gaming con escenarios épicos te espera
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Badge className="bg-purple-600 text-white px-4 py-2">
                  <Crown className="w-4 h-4 mr-2" />
                  {playerProfile.rank}
                </Badge>
                <Badge className="bg-blue-600 text-white px-4 py-2">
                  <Star className="w-4 h-4 mr-2" />
                  Nivel {playerProfile.level}
                </Badge>
                <Badge className="bg-green-600 text-white px-4 py-2">
                  <Trophy className="w-4 h-4 mr-2" />
                  {playerProfile.achievements} Logros
                </Badge>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-4">🎮</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-400">{quickStats.todayScore.toLocaleString()}</div>
                  <div className="text-white/70">Score Hoy</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl font-bold text-purple-400">#{quickStats.weeklyRank}</div>
                  <div className="text-white/70">Rank Semanal</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl font-bold text-blue-400">{quickStats.activeChallenges}</div>
                  <div className="text-white/70">Desafíos</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <div className="text-2xl font-bold text-green-400">{quickStats.friendsOnline}</div>
                  <div className="text-white/70">Amigos Online</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="gaming-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Experiencia</p>
                <p className="text-2xl font-bold">{playerProfile.experience.toLocaleString()}</p>
              </div>
              <div className="text-3xl">⭐</div>
            </div>
            <Progress value={(playerProfile.experience / playerProfile.experienceToNext) * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="gaming-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monedas</p>
                <p className="text-2xl font-bold">{playerProfile.coins.toLocaleString()}</p>
              </div>
              <div className="text-3xl">💰</div>
            </div>
            <div className="mt-3 text-sm text-green-600">+{economy.dailyIncome} hoy</div>
          </CardContent>
        </Card>

        <Card className="gaming-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gemas</p>
                <p className="text-2xl font-bold">{playerProfile.gems}</p>
              </div>
              <div className="text-3xl">💎</div>
            </div>
            <div className="mt-3 text-sm text-purple-600">Premium</div>
          </CardContent>
        </Card>

        <Card className="gaming-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold">
                  {Math.round((playerProfile.statistics.gamesWon / playerProfile.statistics.gamesPlayed) * 100)}%
                </p>
              </div>
              <div className="text-3xl">🏆</div>
            </div>
            <div className="mt-3 text-sm text-blue-600">
              {playerProfile.statistics.gamesWon}/{playerProfile.statistics.gamesPlayed} partidas
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accesos Rápidos Simplificados */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Juegos Principales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                className="gaming-button h-20 flex flex-col gap-2"
                onClick={() => setActiveTab('escenarios')}
              >
                <Gamepad2 className="w-8 h-8" />
                <span>Escenarios</span>
              </Button>
              <Button 
                className="gaming-button h-20 flex flex-col gap-2"
                onClick={() => setActiveTab('mario-games')}
              >
                <Target className="w-8 h-8" />
                <span>Mario Bros</span>
              </Button>
              <Button 
                className="gaming-button h-20 flex flex-col gap-2"
                onClick={() => setActiveTab('pou-ai')}
              >
                <Brain className="w-8 h-8" />
                <span>Pou IA</span>
              </Button>
              <Button 
                className="gaming-button h-20 flex flex-col gap-2"
                onClick={() => setActiveTab('pet-collection')}
              >
                <Heart className="w-8 h-8" />
                <span>Mascotas</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Estadísticas Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Tiempo jugado:</span>
                <span className="font-semibold">{playerProfile.totalPlayTime}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Score promedio:</span>
                <span className="font-semibold">{playerProfile.statistics.averageScore.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Días consecutivos:</span>
                <span className="font-semibold">{playerProfile.statistics.consecutiveDays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Mascota favorita:</span>
                <span className="font-semibold text-purple-600">{playerProfile.statistics.favoritePet}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Héroe favorito:</span>
                <span className="font-semibold text-orange-600">{playerProfile.statistics.favoriteHero}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // 🏆 COMPONENTE LOGROS SIMPLIFICADO
  const AchievementsPanel = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">🏆 Logros Épicos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Primera Victoria', description: 'Gana tu primer juego', icon: '🥇', completed: true },
          { name: 'Explorador', description: 'Completa 3 escenarios diferentes', icon: '🗺️', completed: true },
          { name: 'Coleccionista', description: 'Obtén 5 mascotas diferentes', icon: '🐾', completed: false },
          { name: 'Vinculador', description: 'Crea 3 vínculos mascota-héroe', icon: '🔗', completed: true },
          { name: 'Maestro Gaming', description: 'Juega todos los escenarios', icon: '🎮', completed: false },
          { name: 'Economista', description: 'Acumula 50,000 monedas', icon: '💰', completed: false }
        ].map((achievement, index) => (
          <Card key={index} className={`gaming-card ${achievement.completed ? 'border-yellow-500' : 'opacity-60'}`}>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4">{achievement.icon}</div>
              <h3 className="font-bold mb-2">{achievement.name}</h3>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
              {achievement.completed && (
                <Badge className="mt-3 bg-yellow-600">Completado</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  // 👤 COMPONENTE PERFIL SIMPLIFICADO
  const ProfilePanel = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">👤 Perfil de Jugador</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl">
                🎮
              </div>
              <div>
                <h3 className="text-xl font-bold">{playerProfile.username}</h3>
                <p className="text-muted-foreground">{playerProfile.rank}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Nivel:</span>
                <div className="font-semibold">{playerProfile.level}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Experiencia:</span>
                <div className="font-semibold">{playerProfile.experience.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Logros:</span>
                <div className="font-semibold">{playerProfile.achievements}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Tiempo:</span>
                <div className="font-semibold">{playerProfile.totalPlayTime}h</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Estadísticas de Juego</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Partidas jugadas:</span>
                <span className="font-semibold">{playerProfile.statistics.gamesPlayed}</span>
              </div>
              <div className="flex justify-between">
                <span>Partidas ganadas:</span>
                <span className="font-semibold text-green-600">{playerProfile.statistics.gamesWon}</span>
              </div>
              <div className="flex justify-between">
                <span>Score total:</span>
                <span className="font-semibold">{playerProfile.statistics.totalScore.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Score promedio:</span>
                <span className="font-semibold">{playerProfile.statistics.averageScore.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-950 via-blue-950 to-indigo-950">
      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-black/20 backdrop-blur-lg border-r border-white/10 min-h-screen`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-8">
              {sidebarOpen && (
                <div className="flex items-center gap-2">
                  <div className="text-2xl">🎮</div>
                  <span className="font-bold text-white">Gaming Hub</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white hover:bg-white/10"
              >
                {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>

            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'secondary' : 'ghost'}
                  className={`w-full justify-start text-white hover:bg-white/10 ${
                    activeTab === item.id ? 'bg-purple-600 hover:bg-purple-700' : ''
                  }`}
                  onClick={() => setActiveTab(item.id)}
                >
                  <item.icon className="w-4 h-4" />
                  {sidebarOpen && <span className="ml-2">{item.label}</span>}
                </Button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {renderActiveContent()}
        </div>
      </div>
    </div>
  )
}