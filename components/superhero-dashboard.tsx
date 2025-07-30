"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { 
  Heart, 
  Zap, 
  Smile, 
  Dumbbell, 
  Star, 
  Crown, 
  Coins, 
  Gem, 
  Plus, 
  Settings, 
  Apple, 
  Gamepad2, 
  Sparkles, 
  User, 
  Swords, 
  BookOpen, 
  Shield,
  LogOut,
  RefreshCw,
  AlertCircle,
  BarChart3,
  Info,
  Bell,
  Trophy,
  Target,
  Users as UsersIcon,
  Home,
  PawPrint,
  Sword,
  Store,
  Award,
  Calendar,
  MessageCircle
} from "lucide-react"
import { HeroCard } from "./hero-card"
import { FiltersBar } from "./filters-bar"
import { Notifications } from "./notifications"
import { AuthForm } from "./auth/auth-form"
import EnhancedPouGame from "./enhanced-pou-game"
import { HeroPetGameUnified } from "./hero-pet-game-unified"
import GameStore from "./game-store"
import ProfessionalGamingSystem from "./professional-gaming-system"
import GameAuthModal from "./game-auth-modal"
import PouGameComplete from "./pou-game-complete"

interface Hero {
  id: number
  nombre: string
  clase: string
  poder: string
  elemento: string
  nivel: number
  experiencia: number
  salud: number
  energia: number
  felicidad: number
  fuerza: number
  magia: number
  agilidad: number
  mascotaId?: number
  logros: string[]
  habilidades: string[]
  ultimaActividad: string
}

interface Mascota {
  id: number
  nombre: string
  tipo: string
  elemento: string
  poder: number
  felicidad: number
  energia: number
  salud: number
  hambre: number
  adoptada: boolean
  propietarioId?: number
  nivel: number
  experiencia: number
  habilidades: string[]
  ultimaAlimentacion: string
  ultimoJuego: string
  estado: 'saludable' | 'enferma' | 'hambrienta' | 'cansada'
}

interface User {
  id: number
  username: string
  email: string
  level: number
  coins: number
  gems: number
  avatar: string
}

export function SuperheroDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [showAuth, setShowAuth] = useState(false)
  const [heroes, setHeroes] = useState<Hero[]>([])
  const [mascotas, setMascotas] = useState<Mascota[]>([])
  const [selectedHero, setSelectedHero] = useState<Hero | null>(null)
  const [selectedMascota, setSelectedMascota] = useState<Mascota | null>(null)
  const [activeTab, setActiveTab] = useState("dashboard")
  const [filters, setFilters] = useState({})
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userCustomization, setUserCustomization] = useState({
    bodyColor: "default",
    eyeColor: "default", 
    accessory: null,
    crown: null,
    specialEffect: null
  })

  // Estados para el sistema de juegos
  const [showGameAuth, setShowGameAuth] = useState(false)

  // Mock data
  const mockHeroes: Hero[] = [
    {
      id: 1,
      nombre: "ThunderStrike",
      clase: "guerrero",
      poder: "Rayo eléctrico",
      elemento: "electricidad",
      nivel: 15,
      experiencia: 1250,
      salud: 85,
      energia: 70,
      felicidad: 90,
      fuerza: 80,
      magia: 30,
      agilidad: 60,
      logros: ["Primera victoria", "Maestro del rayo", "Protector de la ciudad"],
      habilidades: ["Rayo eléctrico", "Escudo de energía", "Velocidad supersónica"],
      ultimaActividad: new Date().toISOString()
    },
    {
      id: 2,
      nombre: "FrostMage",
      clase: "mago",
      poder: "Control del hielo",
      elemento: "hielo",
      nivel: 12,
      experiencia: 980,
      salud: 60,
      energia: 90,
      felicidad: 85,
      fuerza: 40,
      magia: 95,
      agilidad: 50,
      logros: ["Maestro del hielo", "Bibliotecario arcano"],
      habilidades: ["Tormenta de hielo", "Escudo de cristal", "Teletransporte"],
      ultimaActividad: new Date().toISOString()
    }
  ]

  const mockMascotas: Mascota[] = [
    {
      id: 1,
      nombre: "Sparky",
      tipo: "Dragón eléctrico",
      elemento: "electricidad",
      poder: 75,
      felicidad: 85,
      energia: 70,
      salud: 90,
      hambre: 30,
      adoptada: true,
      propietarioId: 1,
      nivel: 8,
      experiencia: 450,
      habilidades: ["Vuelo", "Rayo", "Escudo"],
      ultimaAlimentacion: new Date().toISOString(),
      ultimoJuego: new Date().toISOString(),
      estado: "saludable"
    }
  ]

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setHeroes(mockHeroes)
      setMascotas(mockMascotas)
      setLoading(false)
    }, 1000)
  }, [])

     const handleAuthSuccess = (userData: User) => {
     setUser(userData)
     setShowAuth(false)
   }

   // Simular usuario con monedas para testing
   useEffect(() => {
     if (!user) {
       setUser({
         id: 1,
         username: "Jugador1",
         email: "jugador1@example.com",
         level: 5,
         coins: 500,
         gems: 50,
         avatar: "J1"
       })
     }
   }, [])

  const handleLogout = () => {
    setUser(null)
    setSelectedHero(null)
    setSelectedMascota(null)
  }

  const handleMascotaAction = async (action: string, mascotaId: number) => {
    // Simular acción de mascota
    const updatedMascotas = mascotas.map(mascota => {
      if (mascota.id === mascotaId) {
        switch (action) {
          case 'alimentar':
            return { ...mascota, hambre: Math.max(0, mascota.hambre - 30), felicidad: Math.min(100, mascota.felicidad + 10) }
          case 'jugar':
            return { ...mascota, energia: Math.max(0, mascota.energia - 20), felicidad: Math.min(100, mascota.felicidad + 20) }
          default:
            return mascota
        }
      }
      return mascota
    })
    setMascotas(updatedMascotas)
  }

  const handleMarkNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const handleMarkAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center"
          >
            <Shield className="w-12 h-12 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Mi Pou Virtual + Superhéroes</h1>
          <p className="text-gray-600 mb-8">¡Combina el cuidado de mascotas con aventuras épicas!</p>
          <Button 
            onClick={() => setShowAuth(true)}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            size="lg"
          >
            <User className="w-5 h-5 mr-2" />
            Comenzar Aventura
          </Button>
        </div>
        {showAuth && <AuthForm onAuthSuccess={handleAuthSuccess} onClose={() => setShowAuth(false)} />}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Mi Pou Virtual + Superhéroes</h1>
                <p className="text-sm text-gray-600">Bienvenido, {user.username}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* User stats */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-yellow-100 px-3 py-1 rounded-full">
                  <Coins className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">{user.coins}</span>
                </div>
                <div className="flex items-center gap-1 bg-purple-100 px-3 py-1 rounded-full">
                  <Gem className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">{user.gems}</span>
                </div>
              </div>

              {/* Notifications */}
              <Notifications
                notifications={notifications}
                onMarkAsRead={handleMarkNotificationAsRead}
                onMarkAllAsRead={handleMarkAllNotificationsAsRead}
                onDelete={handleDeleteNotification}
              />

              {/* User menu */}
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                    {user.avatar}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-8">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Home className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="heroes" className="flex items-center gap-2">
              <Sword className="w-4 h-4" />
              Héroes
            </TabsTrigger>
            <TabsTrigger value="pets" className="flex items-center gap-2">
              <PawPrint className="w-4 h-4" />
              Mascotas
            </TabsTrigger>
            <TabsTrigger value="pou-game" className="flex items-center gap-2">
              <span className="text-base">🐾</span>
              Mi Pou
            </TabsTrigger>
            <TabsTrigger value="professional-games" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              🎮 Pro Games
            </TabsTrigger>
            <TabsTrigger value="store" className="flex items-center gap-2">
              <Store className="w-4 h-4" />
              Tienda
            </TabsTrigger>
            <TabsTrigger value="achievements" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Logros
            </TabsTrigger>
            <TabsTrigger value="game" className="flex items-center gap-2">
              <Gamepad2 className="w-4 h-4" />
              Game
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Stats cards */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Héroes</CardTitle>
                  <Sword className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{heroes.length}</div>
                  <p className="text-xs text-muted-foreground">
                    +{heroes.filter(h => h.nivel > 10).length} de alto nivel
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Mascotas</CardTitle>
                  <PawPrint className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{mascotas.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {mascotas.filter(m => m.estado === 'saludable').length} saludables
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Logros</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {heroes.reduce((acc, hero) => acc + hero.logros.length, 0)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Desbloqueados recientemente
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Nivel</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{user.level}</div>
                  <p className="text-xs text-muted-foreground">
                    +{Math.floor(user.level * 1.5)} XP para subir
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones Rápidas</CardTitle>
                <CardDescription>Gestiona tus héroes y mascotas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Plus className="w-6 h-6" />
                    <span className="text-sm">Crear Héroe</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <PawPrint className="w-6 h-6" />
                    <span className="text-sm">Adoptar Mascota</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Apple className="w-6 h-6" />
                    <span className="text-sm">Alimentar</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2">
                    <Gamepad2 className="w-6 h-6" />
                    <span className="text-sm">Jugar</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Heroes Tab */}
          <TabsContent value="heroes" className="space-y-6">
            <FiltersBar
              onFiltersChange={setFilters}
              totalHeroes={heroes.length}
              filteredCount={heroes.length}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {heroes.map((hero) => {
                const mascota = mascotas.find(m => m.propietarioId === hero.id)
                return (
                  <HeroCard
                    key={hero.id}
                    hero={hero}
                    mascota={mascota}
                    isSelected={selectedHero?.id === hero.id}
                    onSelect={setSelectedHero}
                    onMascotaAction={handleMascotaAction}
                  />
                )
              })}
            </div>
          </TabsContent>

          {/* Pets Tab */}
          <TabsContent value="pets" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Personaje Pou Principal */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Mi Mascota Virtual</CardTitle>
                  <CardDescription>Interactúa con tu mascota Pou</CardDescription>
                </CardHeader>
                <CardContent>
                  <EnhancedPouGame />
                </CardContent>
              </Card>

              {/* Lista de Mascotas */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Mis Mascotas</CardTitle>
                  <CardDescription>Cuida y entrena a tus mascotas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {mascotas.map((mascota) => (
                      <Card key={mascota.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{mascota.nombre}</CardTitle>
                            <Badge variant={mascota.estado === 'saludable' ? 'default' : 'destructive'}>
                              {mascota.estado}
                            </Badge>
                          </div>
                          <CardDescription>
                            {mascota.tipo} • Nivel {mascota.nivel}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-red-500" />
                              <Progress value={mascota.salud} className="flex-1" />
                              <span className="text-sm text-gray-600">{mascota.salud}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Zap className="w-4 h-4 text-yellow-500" />
                              <Progress value={mascota.energia} className="flex-1" />
                              <span className="text-sm text-gray-600">{mascota.energia}%</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Smile className="w-4 h-4 text-green-500" />
                              <Progress value={mascota.felicidad} className="flex-1" />
                              <span className="text-sm text-gray-600">{mascota.felicidad}%</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="flex-1">
                              <Apple className="w-4 h-4 mr-1" />
                              Alimentar
                            </Button>
                            <Button size="sm" variant="outline" className="flex-1">
                              <Gamepad2 className="w-4 h-4 mr-1" />
                              Jugar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Pou Game Tab */}
          <TabsContent value="pou-game" className="space-y-6">
            <PouGameComplete />
          </TabsContent>

          {/* Professional Gaming System Tab */}
          <TabsContent value="professional-games" className="space-y-6">
            <ProfessionalGamingSystem 
              onAuthRequired={() => setShowGameAuth(true)}
            />
          </TabsContent>

          {/* Game Tab */}
          <TabsContent value="game" className="space-y-6">
            <HeroPetGameUnified />
          </TabsContent>

          {/* Store Tab */}
          <TabsContent value="store" className="space-y-6">
            <GameStore
              coins={user.coins}
              onPurchase={(item) => {
                // Simular compra - reducir monedas
                if (user.coins >= item.price) {
                  setUser(prev => prev ? { ...prev, coins: prev.coins - item.price } : null)
                  console.log("¡Item comprado exitosamente!", item)
                } else {
                  console.log("No tienes suficientes monedas!")
                }
              }}
              onCustomize={(customization) => {
                // Aplicar personalización
                setUserCustomization(customization)
                console.log("Personalización aplicada:", customization)
              }}
              currentCustomization={userCustomization}
            />
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logros y Trophies</CardTitle>
                <CardDescription>Desbloquea logros especiales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <Trophy className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Sistema de logros en desarrollo</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Tab */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Red Social</CardTitle>
                <CardDescription>Conecta con otros jugadores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>Funciones sociales en desarrollo</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Game Authentication Modal */}
      <GameAuthModal
        isOpen={showGameAuth}
        onClose={() => setShowGameAuth(false)}
        onSuccess={() => {
          setShowGameAuth(false)
          // Refrescar la vista de juegos profesionales
          setActiveTab("professional-games")
        }}
      />
    </div>
  )
} 