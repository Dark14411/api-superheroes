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

// 🎮 IMPORTAR NUEVOS COMPONENTES
import { useGamingState } from '@/hooks/use-gaming-state'
import { LoadingSpinner, CardSpinner } from '@/components/ui/loading-spinner'
import { 
  GameButton, 
  AdoptButton, 
  BuyButton, 
  UnlockButton,
  ActionButton 
} from '@/components/ui/action-button'

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
  // 🎮 USAR EL HOOK DE ESTADO GLOBAL
  const {
    playerProfile,
    games,
    pets,
    heroes,
    achievements,
    marketplace,
    multiplayerRooms,
    statistics,
    loading,
    errors,
    startGame,
    adoptPet,
    unlockHero,
    buyItem,
    loadGames,
    loadPets,
    loadHeroes,
    loadAchievements,
    loadMarketplace,
    loadMultiplayerRooms,
    handleSuccess,
    handleError
  } = useGamingState()

  // 🎮 ESTADO LOCAL PARA NAVEGACIÓN
  const [activeTab, setActiveTab] = useState('home')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // 🎮 FUNCIONES DE ACCIÓN CONECTADAS A APIS
  const handleGamePlay = async (gameId: string) => {
    try {
      const session = await startGame(gameId)
      if (session) {
        // Aquí podrías navegar al juego o mostrar un modal
        handleSuccess(`¡${games.find(g => g.id === gameId)?.name} iniciado!`)
      }
    } catch (error) {
      handleError('Error al iniciar juego')
    }
  }

  const handlePetAdopt = async (petId: string) => {
    try {
      const success = await adoptPet(petId)
      if (success) {
        // El estado se actualiza automáticamente
      }
    } catch (error) {
      handleError('Error al adoptar mascota')
    }
  }

  const handleHeroUnlock = async (heroId: string) => {
    try {
      const success = await unlockHero(heroId)
      if (success) {
        // El estado se actualiza automáticamente
      }
    } catch (error) {
      handleError('Error al desbloquear héroe')
    }
  }

  const handleItemBuy = async (itemId: string) => {
    try {
      const success = await buyItem(itemId)
      if (success) {
        // El estado se actualiza automáticamente
      }
    } catch (error) {
      handleError('Error al comprar item')
    }
  }

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

  // 🎮 PANEL DE INICIO
  const DashboardHome = () => {
    if (loading.profile) {
      return <CardSpinner />
    }

    if (!playerProfile) {
      return (
        <div className="text-center p-8">
          <p className="text-gray-500">No se pudo cargar el perfil</p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* 🎯 PERFIL PRINCIPAL */}
        <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-6 h-6" />
              Bienvenido, {playerProfile.username}!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{playerProfile.level}</div>
                <div className="text-sm opacity-80">Nivel</div>
                <Progress value={(playerProfile.experience / playerProfile.experienceToNext) * 100} className="mt-2" />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{playerProfile.coins}</div>
                <div className="text-sm opacity-80">Monedas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{playerProfile.gems}</div>
                <div className="text-sm opacity-80">Gemas</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 🎮 ESTADÍSTICAS RÁPIDAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Gamepad2 className="w-4 h-4" />
                Juegos Jugados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{playerProfile.statistics?.gamesPlayed || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Victorias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{playerProfile.statistics?.gamesWon || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Puntuación Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{playerProfile.statistics?.totalScore || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Star className="w-4 h-4" />
                Logros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{playerProfile.achievements}</div>
            </CardContent>
          </Card>
        </div>

        {/* 🎮 ACCIONES RÁPIDAS */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <ActionButton
                onClick={() => setActiveTab('games')}
                variant="outline"
                icon={<Gamepad2 className="w-4 h-4" />}
              >
                Jugar
              </ActionButton>
              
              <ActionButton
                onClick={() => setActiveTab('pets')}
                variant="outline"
                icon={<Heart className="w-4 h-4" />}
              >
                Mascotas
              </ActionButton>
              
              <ActionButton
                onClick={() => setActiveTab('marketplace')}
                variant="outline"
                icon={<ShoppingCart className="w-4 h-4" />}
              >
                Tienda
              </ActionButton>
              
              <ActionButton
                onClick={() => setActiveTab('achievements')}
                variant="outline"
                icon={<Trophy className="w-4 h-4" />}
              >
                Logros
              </ActionButton>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 🎮 PANEL DE JUEGOS
  const GamesPanel = () => {
    if (loading.games) {
      return <CardSpinner />
    }

    if (errors.games) {
      return (
        <div className="text-center p-8">
          <p className="text-red-500 mb-4">{errors.games}</p>
          <Button onClick={() => loadGames()}>Reintentar</Button>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gamepad2 className="w-6 h-6" />
              Juegos Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {games.map((game) => (
                <Card key={game.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{game.name}</CardTitle>
                    <p className="text-sm text-gray-600">{game.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Dificultad:</span>
                      <Badge variant={game.difficulty > 7 ? 'destructive' : game.difficulty > 4 ? 'default' : 'secondary'}>
                        {game.difficulty}/10
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Recompensas:</span>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">
                          +{game.rewards.experience} XP
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          +{game.rewards.coins} 🪙
                        </Badge>
                      </div>
                    </div>

                    <GameButton
                      gameId={game.id}
                      onPlay={handleGamePlay}
                      isUnlocked={game.isUnlocked}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 🐾 PANEL DE MASCOTAS
  const PetsPanel = () => {
    if (loading.pets) {
      return <CardSpinner />
    }

    if (errors.pets) {
      return (
        <div className="text-center p-8">
          <p className="text-red-500 mb-4">{errors.pets}</p>
          <Button onClick={() => loadPets()}>Reintentar</Button>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-6 h-6" />
              Mascotas Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pets.map((pet) => (
                <Card key={pet.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{pet.name}</CardTitle>
                    <p className="text-sm text-gray-600">{pet.type} - {pet.rarity}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="text-center">
                        <div className="font-semibold">{pet.health}</div>
                        <div className="text-xs text-gray-500">Salud</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{pet.happiness}</div>
                        <div className="text-xs text-gray-500">Felicidad</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold">{pet.energy}</div>
                        <div className="text-xs text-gray-500">Energía</div>
                      </div>
                    </div>

                    <AdoptButton
                      petId={pet.id}
                      onAdopt={handlePetAdopt}
                      isAdopted={pet.isAdopted}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 👥 PANEL MULTIJUGADOR
  const MultiplayerPanel = () => {
    if (loading.multiplayer) {
      return <CardSpinner />
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-6 h-6" />
              Salas Multijugador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {multiplayerRooms.map((room) => (
                <Card key={room.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{room.name}</CardTitle>
                    <p className="text-sm text-gray-600">{room.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Jugadores:</span>
                      <Badge>{room.players?.length || 0}/{room.maxPlayers}</Badge>
                    </div>
                    
                    <ActionButton
                      onClick={() => handleSuccess('Unirse a sala')}
                      className="w-full"
                    >
                      Unirse
                    </ActionButton>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 💰 PANEL DE MERCADO
  const MarketplacePanel = () => {
    if (loading.marketplace) {
      return <CardSpinner />
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="w-6 h-6" />
              Tienda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketplace.map((item) => (
                <Card key={item.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Precio:</span>
                      <Badge variant="outline">{item.price} 🪙</Badge>
                    </div>
                    
                    <BuyButton
                      itemId={item.id}
                      onBuy={handleItemBuy}
                      price={item.price}
                      canAfford={playerProfile?.coins >= item.price}
                      className="w-full"
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // 🏆 PANEL DE LOGROS
  const AchievementsPanel = () => {
    if (loading.achievements) {
      return <CardSpinner />
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              Logros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {achievements.map((achievement) => (
                <Card key={achievement.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {achievement.icon}
                      {achievement.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progreso:</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <Progress value={(achievement.progress / achievement.maxProgress) * 100} />
                    </div>
                    
                    {achievement.isCompleted && (
                      <Badge className="w-full justify-center" variant="default">
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
  }

  // 👤 PANEL DE PERFIL
  const ProfilePanel = () => {
    if (loading.profile) {
      return <CardSpinner />
    }

    if (!playerProfile) {
      return (
        <div className="text-center p-8">
          <p className="text-gray-500">No se pudo cargar el perfil</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-6 h-6" />
              Perfil del Jugador
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Información Básica</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Usuario:</span>
                      <span className="font-medium">{playerProfile.username}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Nivel:</span>
                      <span className="font-medium">{playerProfile.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Rango:</span>
                      <span className="font-medium">{playerProfile.rank}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Recursos</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monedas:</span>
                      <span className="font-medium">{playerProfile.coins}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Gemas:</span>
                      <span className="font-medium">{playerProfile.gems}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Logros:</span>
                      <span className="font-medium">{playerProfile.achievements}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Estadísticas</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Juegos Jugados:</span>
                      <span className="font-medium">{playerProfile.statistics?.gamesPlayed || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Victorias:</span>
                      <span className="font-medium">{playerProfile.statistics?.gamesWon || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Puntuación Total:</span>
                      <span className="font-medium">{playerProfile.statistics?.totalScore || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Días Consecutivos:</span>
                      <span className="font-medium">{playerProfile.statistics?.consecutiveDays || 0}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Estado</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Salud:</span>
                      <span className="font-medium">{playerProfile.health}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Energía:</span>
                      <span className="font-medium">{playerProfile.energy}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Felicidad:</span>
                      <span className="font-medium">{playerProfile.happiness}/100</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* 🎮 HEADER */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl">🎮</div>
              <div>
                <h1 className="text-xl font-bold text-white">Gaming Hub Ultimate</h1>
                <p className="text-sm text-gray-300">Tu universo gaming épico</p>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white"
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
            lg:w-64 bg-black/20 backdrop-blur-sm rounded-lg p-4 border border-white/10
            ${isMobileMenuOpen ? 'block' : 'hidden lg:block'}
          `}>
            <div className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? 'default' : 'ghost'}
                    className="w-full justify-start text-white hover:bg-white/10"
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
    </div>
  )
} 