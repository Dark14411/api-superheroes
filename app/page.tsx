"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { 
  Home, 
  ShoppingBag, 
  Gamepad2, 
  Users, 
  Settings, 
  LogOut,
  Coins,
  Heart,
  Zap,
  Star,
  Menu,
  X,
  Volume2,
  VolumeX
} from "lucide-react"
import EnhancedPouGame from "@/components/enhanced-pou-game"
import unifiedApiClient from "@/lib/unified-api-client"
import AuthForm from "@/components/auth/auth-form"
import WelcomeScreen from "@/components/welcome-screen"

// Helper for safe localStorage usage (SSR compatible)
const safeLocalStorage = {
  getItem: (key: string) => typeof window !== 'undefined' ? localStorage.getItem(key) : null,
  setItem: (key: string, value: string) => typeof window !== 'undefined' && localStorage.setItem(key, value),
  removeItem: (key: string) => typeof window !== 'undefined' && localStorage.removeItem(key)
}

// Tipos para el estado global
interface GameState {
  isAuthenticated: boolean
  user: any
  coins: number
  pouStats: {
    health: number
    happiness: number
    energy: number
    hunger: number
    cleanliness: number
    level: number
  }
  settings: {
    soundEnabled: boolean
    musicEnabled: boolean
    notifications: boolean
  }
}

// Componente del personaje Pou principal
const MainPouCharacter = ({
  stats,
  isAnimating = false,
  onClick,
}: {
  stats: any
  isAnimating?: boolean
  onClick?: () => void
}) => {
  const getMoodFromStats = () => {
    const avgStats = (stats.health + stats.happiness + stats.energy) / 3
    if (avgStats >= 80) return "happy"
    if (avgStats >= 60) return "content"
    if (avgStats >= 40) return "neutral"
    return "sad"
  }

  const mood = getMoodFromStats()

  return (
    <motion.div
      className="relative w-32 h-32 cursor-pointer"
      animate={isAnimating ? { 
        scale: [1, 1.1, 1], 
        rotate: [0, 5, -5, 0],
        y: [0, -10, 0]
      } : {}}
      transition={{ duration: 0.8 }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Cuerpo de Pou */}
      <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-400 rounded-full relative flex items-center justify-center shadow-2xl border-4 border-yellow-300">
        {/* Brillo */}
        <div className="absolute top-4 left-6 w-4 h-4 bg-yellow-200 rounded-full opacity-60" />
        
        {/* Ojos */}
        <div className="absolute top-8 flex gap-4">
          <motion.div
            className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm"
            animate={mood === "happy" ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          >
            <div className="w-2 h-2 bg-black rounded-full" />
          </motion.div>
          <motion.div
            className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-sm"
            animate={mood === "happy" ? { scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.1 }}
          >
            <div className="w-2 h-2 bg-black rounded-full" />
          </motion.div>
        </div>

        {/* Boca */}
        <motion.div
          className={`absolute bottom-8 w-8 h-4 border-b-4 border-black rounded-b-full ${
            mood === "happy" ? "border-pink-600" : "border-gray-600"
          }`}
          animate={mood === "happy" ? { scaleX: [1, 1.2, 1] } : {}}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
        />

        {/* Mejillas rosadas cuando está feliz */}
        {mood === "happy" && (
          <>
            <motion.div
              className="absolute left-2 top-12 w-3 h-3 bg-pink-300 rounded-full opacity-60"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            />
            <motion.div
              className="absolute right-2 top-12 w-3 h-3 bg-pink-300 rounded-full opacity-60"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.2 }}
            />
          </>
        )}

        {/* Partículas de felicidad */}
        {mood === "happy" && isAnimating && (
          <div className="absolute -top-4 -right-4">
            <motion.div
              className="text-yellow-400 text-2xl"
              animate={{ 
                y: [0, -20, 0],
                opacity: [1, 0.5, 1],
                rotate: [0, 360]
              }}
              transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            >
              ✨
            </motion.div>
          </div>
        )}
      </div>

      {/* Indicador de nivel */}
      <div className="absolute -bottom-2 -left-2 bg-purple-500 text-white text-xs rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg">
        {stats.level}
      </div>

      {/* Sombra */}
      <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-black opacity-20 rounded-full blur-sm" />
    </motion.div>
  )
}

// Menú lateral
const SideMenu = ({ 
  isOpen, 
  onClose, 
  activeSection, 
  onSectionChange,
  gameState,
  onLogout 
}: {
  isOpen: boolean
  onClose: () => void
  activeSection: string
  onSectionChange: (section: string) => void
  gameState: GameState
  onLogout: () => void
}) => {
  const menuItems = [
    { id: "home", label: "Inicio", icon: Home, color: "text-blue-500" },
    { id: "store", label: "Tienda", icon: ShoppingBag, color: "text-green-500" },
    { id: "game", label: "Jugar con Pou", icon: Gamepad2, color: "text-purple-500" },
    { id: "heroes", label: "Superhéroes", icon: Users, color: "text-red-500" },
    { id: "settings", label: "Configuración", icon: Settings, color: "text-gray-500" },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Menú */}
          <motion.div
            className="fixed left-0 top-0 h-full w-80 bg-gradient-to-b from-yellow-400 via-orange-400 to-red-400 shadow-2xl z-50"
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="p-6 h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-white">Mi Pou</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Stats rápidas */}
              <div className="bg-white/20 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Coins className="w-5 h-5 text-yellow-200" />
                  <span className="text-white font-bold">{gameState.coins} monedas</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center gap-1">
                    <Heart className="w-4 h-4 text-red-300" />
                    <span className="text-white text-sm">{gameState.pouStats.health}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-blue-300" />
                    <span className="text-white text-sm">{gameState.pouStats.energy}%</span>
                  </div>
                </div>
              </div>

              {/* Navegación */}
              <nav className="flex-1">
                {menuItems.map((item) => (
                  <motion.button
                    key={item.id}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl mb-2 transition-all ${
                      activeSection === item.id
                        ? "bg-white text-gray-800 shadow-lg"
                        : "text-white hover:bg-white/20"
                    }`}
                    onClick={() => {
                      onSectionChange(item.id)
                      onClose()
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <item.icon className={`w-5 h-5 ${activeSection === item.id ? item.color : "text-white"}`} />
                    <span className="font-medium">{item.label}</span>
                  </motion.button>
                ))}
              </nav>

              {/* Footer */}
              <div className="border-t border-white/20 pt-4">
                <Button
                  variant="ghost"
                  className="w-full text-white hover:bg-white/20"
                  onClick={onLogout}
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Cerrar Sesión
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Componente principal
export default function PouGameApp() {
  const [gameState, setGameState] = useState<GameState>({
    isAuthenticated: false,
    user: null,
    coins: 10000,
    pouStats: {
      health: 85,
      happiness: 90,
      energy: 75,
      hunger: 60,
      cleanliness: 80,
      level: 5,
    },
    settings: {
      soundEnabled: true,
      musicEnabled: true,
      notifications: true,
    },
  })

  const [activeSection, setActiveSection] = useState("home")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isPouAnimating, setIsPouAnimating] = useState(false)
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)

  // Verificar autenticación al cargar
  useEffect(() => {
    const token = safeLocalStorage.getItem("auth_token")
    const userData = safeLocalStorage.getItem("user_data")
    
    if (token && userData) {
      setGameState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: JSON.parse(userData)
      }))
      setShowWelcome(false)
    } else {
      // Mostrar pantalla de bienvenida primero
      setShowWelcome(true)
    }
  }, [])

  // Animación automática de Pou cada 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPouAnimating(true)
      setTimeout(() => setIsPouAnimating(false), 2000)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const handlePouClick = () => {
    setIsPouAnimating(true)
    setTimeout(() => setIsPouAnimating(false), 1000)
    
    // Ganar monedas por interactuar
    setGameState(prev => ({
      ...prev,
      coins: prev.coins + 10,
      pouStats: {
        ...prev.pouStats,
        happiness: Math.min(100, prev.pouStats.happiness + 5)
      }
    }))
  }

  const handleLogin = (userData: any, token: string) => {
    safeLocalStorage.setItem("auth_token", token)
    safeLocalStorage.setItem("user_data", JSON.stringify(userData))
    
    setGameState(prev => ({
      ...prev,
      isAuthenticated: true,
      user: userData
    }))
    setShowAuthDialog(false)
    setShowWelcome(false)
  }

  const handleLogout = () => {
    safeLocalStorage.removeItem("auth_token")
    safeLocalStorage.removeItem("user_data")
    
    setGameState(prev => ({
      ...prev,
      isAuthenticated: false,
      user: null
    }))
    setShowAuthDialog(true)
  }

  const renderContent = () => {
    switch (activeSection) {
      case "store":
        return (
          <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">🛒 Tienda</h2>
            <Card className="p-6">
              <p className="text-gray-600">La tienda estará disponible próximamente...</p>
            </Card>
          </div>
        )
      case "game":
        return <EnhancedPouGame />
      case "heroes":
        return (
          <div className="max-w-4xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">🦸‍♂️ Superhéroes</h2>
            <Card className="p-6">
              <p className="text-gray-600">La gestión de superhéroes estará disponible próximamente...</p>
            </Card>
          </div>
        )
      case "settings":
        return (
          <div className="max-w-2xl mx-auto p-6">
            <h2 className="text-2xl font-bold mb-6">Configuración</h2>
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Sonidos</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setGameState(prev => ({
                      ...prev,
                      settings: { ...prev.settings, soundEnabled: !prev.settings.soundEnabled }
                    }))}
                  >
                    {gameState.settings.soundEnabled ? (
                      <Volume2 className="w-5 h-5" />
                    ) : (
                      <VolumeX className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        )
      default:
        return (
          <div className="max-w-4xl mx-auto p-6">
            {/* Home - Dashboard principal */}
            <div className="text-center mb-8">
              <motion.div
                className="mb-6 flex justify-center"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <MainPouCharacter
                  stats={gameState.pouStats}
                  isAnimating={isPouAnimating}
                  onClick={handlePouClick}
                />
              </motion.div>
              
              <motion.h1 
                className="text-3xl font-bold text-gray-800 mb-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                ¡Hola, {gameState.user?.username || "Entrenador"}!
              </motion.h1>
              <motion.p 
                className="text-gray-600 text-lg"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                Tu Pou está {gameState.pouStats.happiness > 80 ? "🥰 muy feliz" : 
                            gameState.pouStats.happiness > 60 ? "😊 contento" : "😢 triste"}
              </motion.p>
            </div>

            {/* Stats principales */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <Card className="p-4 text-center bg-gradient-to-br from-red-50 to-pink-50">
                <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-red-600">{gameState.pouStats.health}%</div>
                <div className="text-sm text-gray-600">Salud</div>
              </Card>
              
              <Card className="p-4 text-center bg-gradient-to-br from-blue-50 to-cyan-50">
                <Zap className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-blue-600">{gameState.pouStats.energy}%</div>
                <div className="text-sm text-gray-600">Energía</div>
              </Card>
              
              <Card className="p-4 text-center bg-gradient-to-br from-yellow-50 to-orange-50">
                <Star className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-600">{gameState.pouStats.happiness}%</div>
                <div className="text-sm text-gray-600">Felicidad</div>
              </Card>
              
              <Card className="p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50">
                <Coins className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-green-600">{gameState.coins}</div>
                <div className="text-sm text-gray-600">Monedas</div>
              </Card>
            </div>

            {/* Acciones rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                className="h-20 bg-gradient-to-br from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                onClick={() => setActiveSection("store")}
              >
                <div className="text-center">
                  <ShoppingBag className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-sm">Tienda</div>
                </div>
              </Button>
              
              <Button
                className="h-20 bg-gradient-to-br from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                onClick={() => setActiveSection("game")}
              >
                <div className="text-center">
                  <Gamepad2 className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-sm">Jugar</div>
                </div>
              </Button>
              
              <Button
                className="h-20 bg-gradient-to-br from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
                onClick={() => setActiveSection("heroes")}
              >
                <div className="text-center">
                  <Users className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-sm">Héroes</div>
                </div>
              </Button>
              
              <Button
                className="h-20 bg-gradient-to-br from-gray-500 to-slate-600 hover:from-gray-600 hover:to-slate-700"
                onClick={() => setActiveSection("settings")}
              >
                <div className="text-center">
                  <Settings className="w-6 h-6 mx-auto mb-1" />
                  <div className="text-sm">Opciones</div>
                </div>
              </Button>
            </div>
          </div>
        )
    }
  }

  // Mostrar pantalla de bienvenida si no está autenticado
  if (showWelcome && !gameState.isAuthenticated) {
    return <WelcomeScreen onShowAuth={() => {
      setShowWelcome(false)
      setTimeout(() => setShowAuthDialog(true), 300)
    }} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-orange-100 to-red-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-yellow-400 to-orange-400 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(true)}
                className="text-white hover:bg-white/20"
              >
                <Menu className="w-6 h-6" />
              </Button>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-300 rounded-full flex items-center justify-center text-2xl">
                  🐾
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">Mi Pou</h1>
                  <p className="text-yellow-100 text-sm">
                    {gameState.user?.username || "Invitado"}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="bg-yellow-500 rounded-full px-3 py-1 flex items-center gap-2">
                <Coins className="w-4 h-4 text-yellow-900" />
                <span className="font-bold text-yellow-900">{gameState.coins}</span>
              </div>
              
              <div className="bg-red-500 rounded-full px-3 py-1 flex items-center gap-2">
                <Heart className="w-4 h-4 text-white" />
                <span className="font-bold text-white">{gameState.pouStats.health}%</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="min-h-[calc(100vh-80px)]">
        {renderContent()}
      </main>

      {/* Menú lateral */}
      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        gameState={gameState}
        onLogout={handleLogout}
      />

      {/* Dialog de autenticación */}
      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Iniciar Sesión</DialogTitle>
          </DialogHeader>
          <AuthForm onLoginSuccess={handleLogin} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
