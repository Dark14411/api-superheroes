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

export default function StableGamingDashboard() {
  // 🎮 ESTADOS PRINCIPALES
  const [activeTab, setActiveTab] = useState('home')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [playerProfile] = useState<PlayerProfile>({
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

  const [quickStats] = useState({
    todayScore: 850,
    weeklyRank: 3,
    activeChallenges: 2,
    friendsOnline: 8
  })

  const [economy] = useState({
    dailyIncome: 150,
    weeklySpending: 75,
    totalWealth: 25000,
    currencies: {
      coins: 15500,
      premiumCoins: 125,
      gems: 125
    }
  })

  // 🎯 FUNCIONES SIMPLES
  const handleActivityComplete = (rewards: any) => {
    toast.success(`¡Recompensas obtenidas! +${rewards.experience || 0} XP, +${rewards.coins || 0} monedas`)
  }

  // 🎮 NAVEGACIÓN SIMPLIFICADA
  const navigationItems = [
    { id: 'home', label: 'Inicio', icon: Home },
    { id: 'games', label: 'Juegos', icon: Gamepad2 },
    { id: 'pets', label: 'Mascotas', icon: Heart },
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

  // 🏠 COMPONENTE HOME SIMPLIFICADO
  const DashboardHome = () => (
    <div className="space-y-8">
      {/* Hero Section con RGB */}
      <div className="relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl p-8 rgb-card">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 rgb-text">
                ¡Bienvenido, {playerProfile.username}!
              </h1>
              <p className="text-xl text-white/80 mb-6">
                Tu universo gaming con escenarios épicos te espera
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <Badge className="bg-purple-600 text-white px-4 py-2 rgb-glow">
                  <Crown className="w-4 h-4 mr-2" />
                  {playerProfile.rank}
                </Badge>
                <Badge className="bg-blue-600 text-white px-4 py-2 rgb-glow">
                  <Star className="w-4 h-4 mr-2" />
                  Nivel {playerProfile.level}
                </Badge>
                <Badge className="bg-green-600 text-white px-4 py-2 rgb-glow">
                  <Trophy className="w-4 h-4 mr-2" />
                  {playerProfile.achievements} Logros
                </Badge>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-6xl mb-4 rgb-pulse">🎮</div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/10 rounded-lg p-3 rgb-border">
                  <div className="text-2xl font-bold text-yellow-400">{quickStats.todayScore.toLocaleString()}</div>
                  <div className="text-white/70">Score Hoy</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 rgb-border">
                  <div className="text-2xl font-bold text-purple-400">#{quickStats.weeklyRank}</div>
                  <div className="text-white/70">Rank Semanal</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 rgb-border">
                  <div className="text-2xl font-bold text-blue-400">{quickStats.activeChallenges}</div>
                  <div className="text-white/70">Desafíos</div>
                </div>
                <div className="bg-white/10 rounded-lg p-3 rgb-border">
                  <div className="text-2xl font-bold text-green-400">{quickStats.friendsOnline}</div>
                  <div className="text-white/70">Amigos Online</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats con RGB */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="gaming-card rgb-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Experiencia</p>
                <p className="text-2xl font-bold rgb-text">{playerProfile.experience.toLocaleString()}</p>
              </div>
              <div className="text-3xl rgb-pulse">⭐</div>
            </div>
            <Progress value={(playerProfile.experience / playerProfile.experienceToNext) * 100} className="mt-3" />
          </CardContent>
        </Card>

        <Card className="gaming-card rgb-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monedas</p>
                <p className="text-2xl font-bold rgb-text">{playerProfile.coins.toLocaleString()}</p>
              </div>
              <div className="text-3xl rgb-pulse">💰</div>
            </div>
            <div className="mt-3 text-sm text-green-600">+{economy.dailyIncome} hoy</div>
          </CardContent>
        </Card>

        <Card className="gaming-card rgb-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Gemas</p>
                <p className="text-2xl font-bold rgb-text">{playerProfile.gems}</p>
              </div>
              <div className="text-3xl rgb-pulse">💎</div>
            </div>
            <div className="mt-3 text-sm text-purple-600">Premium</div>
          </CardContent>
        </Card>

        <Card className="gaming-card rgb-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Win Rate</p>
                <p className="text-2xl font-bold rgb-text">
                  {Math.round((playerProfile.statistics.gamesWon / playerProfile.statistics.gamesPlayed) * 100)}%
                </p>
              </div>
              <div className="text-3xl rgb-pulse">🏆</div>
            </div>
            <div className="mt-3 text-sm text-blue-600">
              {playerProfile.statistics.gamesWon}/{playerProfile.statistics.gamesPlayed} partidas
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Accesos Rápidos con RGB */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rgb-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 rgb-text">
              <Zap className="w-5 h-5 text-yellow-500 rgb-pulse" />
              Accesos Rápidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button 
                className="gaming-button rgb-button h-20 flex flex-col gap-2"
                onClick={() => setActiveTab('games')}
              >
                <Gamepad2 className="w-8 h-8" />
                <span>Juegos</span>
              </Button>
              <Button 
                className="gaming-button rgb-button h-20 flex flex-col gap-2"
                onClick={() => setActiveTab('pets')}
              >
                <Heart className="w-8 h-8" />
                <span>Mascotas</span>
              </Button>
              <Button 
                className="gaming-button rgb-button h-20 flex flex-col gap-2"
                onClick={() => setActiveTab('multiplayer')}
              >
                <Users className="w-8 h-8" />
                <span>Multijugador</span>
              </Button>
              <Button 
                className="gaming-button rgb-button h-20 flex flex-col gap-2"
                onClick={() => setActiveTab('marketplace')}
              >
                <ShoppingCart className="w-8 h-8" />
                <span>Mercado</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rgb-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 rgb-text">
              <BarChart3 className="w-5 h-5 text-blue-500 rgb-pulse" />
              Estadísticas Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Tiempo jugado:</span>
                <span className="font-semibold rgb-text">{playerProfile.totalPlayTime}h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Score promedio:</span>
                <span className="font-semibold rgb-text">{playerProfile.statistics.averageScore.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Días consecutivos:</span>
                <span className="font-semibold rgb-text">{playerProfile.statistics.consecutiveDays}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Mascota favorita:</span>
                <span className="font-semibold text-purple-600 rgb-text">{playerProfile.statistics.favoritePet}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Héroe favorito:</span>
                <span className="font-semibold text-orange-600 rgb-text">{playerProfile.statistics.favoriteHero}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  // 🎮 PANELES SIMPLES CON RGB
  const GamesPanel = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white rgb-text">🎮 Juegos Disponibles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Escenarios', description: 'Juegos basados en tus GIFs', icon: '🗺️', color: 'from-purple-500 to-pink-500' },
          { name: 'Mario Bros', description: 'Plataformas avanzadas', icon: '🍄', color: 'from-red-500 to-yellow-500' },
          { name: 'Pou IA', description: 'Mascota virtual inteligente', icon: '🧠', color: 'from-blue-500 to-cyan-500' },
          { name: 'Multijugador', description: 'Juega con amigos', icon: '👥', color: 'from-green-500 to-emerald-500' },
          { name: 'Mini-Juegos', description: 'Colección de juegos rápidos', icon: '🎯', color: 'from-orange-500 to-red-500' },
          { name: 'Aventuras', description: 'Misiones épicas', icon: '⚔️', color: 'from-indigo-500 to-purple-500' }
        ].map((game, index) => (
          <Card key={index} className="gaming-card rgb-card group overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className={`h-32 bg-gradient-to-br ${game.color} relative rgb-bg`}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-xl font-bold">{game.name}</h3>
                <p className="text-sm opacity-90">{game.description}</p>
              </div>
              <div className="absolute top-4 right-4 text-4xl rgb-pulse">{game.icon}</div>
            </div>
            <CardContent className="p-6">
              <Button className="w-full gaming-button rgb-button">
                <Gamepad2 className="w-4 h-4 mr-2" />
                Jugar Ahora
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const PetsPanel = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white rgb-text">🐾 Sistema de Mascotas</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Perro', type: 'mascota_perro.png', rarity: 'Común' },
          { name: 'Gato', type: 'mascota_gato.png', rarity: 'Común' },
          { name: 'Conejo', type: 'mascota_conejo.png', rarity: 'Raro' },
          { name: 'Pájaro', type: 'mascota_pajaro.png', rarity: 'Raro' },
          { name: 'Hamster', type: 'mascota_hamster.png', rarity: 'Épico' },
          { name: 'Pez', type: 'mascota_pez.png', rarity: 'Épico' }
        ].map((pet, index) => (
          <Card key={index} className="gaming-card rgb-card">
            <CardContent className="p-6 text-center">
              <div className="text-6xl mb-4 rgb-pulse">🐾</div>
              <h3 className="text-xl font-bold mb-2 rgb-text">{pet.name}</h3>
              <Badge className="mb-4 rgb-glow">{pet.rarity}</Badge>
              <Button className="w-full rgb-button" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Adoptar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const MultiplayerPanel = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white rgb-text">👥 Multijugador</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rgb-card">
          <CardHeader>
            <CardTitle className="rgb-text">Jugadores Online</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-green-100 rounded rgb-border">
                <div className="w-3 h-3 bg-green-500 rounded-full rgb-pulse"></div>
                <span>GamerPro123 - Nivel 15</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-blue-100 rounded rgb-border">
                <div className="w-3 h-3 bg-blue-500 rounded-full rgb-pulse"></div>
                <span>PouMaster - Nivel 12</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-100 rounded rgb-border">
                <div className="w-3 h-3 bg-purple-500 rounded-full rgb-pulse"></div>
                <span>EliteGamer - Nivel 20</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rgb-card">
          <CardHeader>
            <CardTitle className="rgb-text">Salas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-3 border rounded rgb-border">
                <div className="font-semibold rgb-text">🏆 Torneo Elite</div>
                <div className="text-sm text-gray-600">8/16 jugadores</div>
              </div>
              <div className="p-3 border rounded rgb-border">
                <div className="font-semibold rgb-text">🎮 Casual Gaming</div>
                <div className="text-sm text-gray-600">12/20 jugadores</div>
              </div>
              <div className="p-3 border rounded rgb-border">
                <div className="font-semibold rgb-text">⚔️ Batalla Real</div>
                <div className="text-sm text-gray-600">4/8 jugadores</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const MarketplacePanel = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white rgb-text">💰 Marketplace</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { name: 'Corona de Diamante', price: 1000, icon: '👑', rarity: 'Legendario' },
          { name: 'Espada Mágica', price: 500, icon: '⚔️', rarity: 'Épico' },
          { name: 'Poción de XP', price: 100, icon: '🧪', rarity: 'Común' },
          { name: 'Armadura Cósmica', price: 2000, icon: '🛡️', rarity: 'Legendario' },
          { name: 'Gema de Poder', price: 300, icon: '💎', rarity: 'Raro' },
          { name: 'Scroll de Habilidad', price: 150, icon: '📜', rarity: 'Común' }
        ].map((item, index) => (
          <Card key={index} className="gaming-card rgb-card">
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4 rgb-pulse">{item.icon}</div>
              <h3 className="font-bold mb-2 rgb-text">{item.name}</h3>
              <Badge className="mb-2 rgb-glow">{item.rarity}</Badge>
              <div className="text-lg font-bold text-green-600 mb-4 rgb-text">{item.price} 💰</div>
              <Button className="w-full rgb-button" size="sm">
                <ShoppingCart className="w-4 h-4 mr-2" />
                Comprar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const AchievementsPanel = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white rgb-text">🏆 Logros Épicos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: 'Primera Victoria', description: 'Gana tu primer juego', icon: '🥇', completed: true },
          { name: 'Explorador', description: 'Completa 3 escenarios diferentes', icon: '🗺️', completed: true },
          { name: 'Coleccionista', description: 'Obtén 5 mascotas diferentes', icon: '🐾', completed: false },
          { name: 'Vinculador', description: 'Crea 3 vínculos mascota-héroe', icon: '🔗', completed: true },
          { name: 'Maestro Gaming', description: 'Juega todos los escenarios', icon: '🎮', completed: false },
          { name: 'Economista', description: 'Acumula 50,000 monedas', icon: '💰', completed: false }
        ].map((achievement, index) => (
          <Card key={index} className={`gaming-card rgb-card ${achievement.completed ? 'border-yellow-500' : 'opacity-60'}`}>
            <CardContent className="p-6 text-center">
              <div className="text-4xl mb-4 rgb-pulse">{achievement.icon}</div>
              <h3 className="font-bold mb-2 rgb-text">{achievement.name}</h3>
              <p className="text-sm text-muted-foreground">{achievement.description}</p>
              {achievement.completed && (
                <Badge className="mt-3 bg-yellow-600 rgb-glow">Completado</Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )

  const ProfilePanel = () => (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold text-white rgb-text">👤 Perfil de Jugador</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="rgb-card">
          <CardHeader>
            <CardTitle className="rgb-text">Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-2xl rgb-pulse">
                🎮
              </div>
              <div>
                <h3 className="text-xl font-bold rgb-text">{playerProfile.username}</h3>
                <p className="text-muted-foreground">{playerProfile.rank}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Nivel:</span>
                <div className="font-semibold rgb-text">{playerProfile.level}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Experiencia:</span>
                <div className="font-semibold rgb-text">{playerProfile.experience.toLocaleString()}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Logros:</span>
                <div className="font-semibold rgb-text">{playerProfile.achievements}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Tiempo:</span>
                <div className="font-semibold rgb-text">{playerProfile.totalPlayTime}h</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rgb-card">
          <CardHeader>
            <CardTitle className="rgb-text">Estadísticas de Juego</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Partidas jugadas:</span>
                <span className="font-semibold rgb-text">{playerProfile.statistics.gamesPlayed}</span>
              </div>
              <div className="flex justify-between">
                <span>Partidas ganadas:</span>
                <span className="font-semibold text-green-600 rgb-text">{playerProfile.statistics.gamesWon}</span>
              </div>
              <div className="flex justify-between">
                <span>Score total:</span>
                <span className="font-semibold rgb-text">{playerProfile.statistics.totalScore.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Score promedio:</span>
                <span className="font-semibold rgb-text">{playerProfile.statistics.averageScore.toLocaleString()}</span>
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
        {/* Sidebar con RGB */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 bg-black/20 backdrop-blur-lg border-r border-white/10 min-h-screen rgb-border`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-8">
              {sidebarOpen && (
                <div className="flex items-center gap-2">
                  <div className="text-2xl rgb-pulse">🎮</div>
                  <span className="font-bold text-white rgb-text">Gaming Hub</span>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-white hover:bg-white/10 rgb-button"
              >
                {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>

            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? 'secondary' : 'ghost'}
                  className={`w-full justify-start text-white hover:bg-white/10 rgb-button ${
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