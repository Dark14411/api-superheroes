"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Gamepad2,
  Target,
  Zap,
  Star,
  Coins,
  Trophy,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Filter,
  Search,
  TrendingUp,
  Users,
  Award,
  ChevronRight,
  Sparkles,
  Brain,
  Puzzle,
  Calculator,
  Type,
  Swords,
  BookOpen,
  Gem
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"

import { gameAPI, Game, GameSession, UserStats, Leaderboard } from "@/lib/api"

// Iconos para tipos de juegos
const gameTypeIcons = {
  memoria: Brain,
  matematicas: Calculator,
  palabras: Type,
  velocidad: Zap,
  coordinacion: Target,
  logica: Puzzle,
  arcade: Gamepad2,
  estrategia: Swords,
  adivinanza: BookOpen,
  puzzle: Sparkles
}

// Colores para dificultades
const difficultyColors = {
  facil: "bg-green-500",
  medio: "bg-yellow-500", 
  dificil: "bg-orange-500",
  experto: "bg-red-500"
}

interface ProfessionalGamingSystemProps {
  onAuthRequired: () => void;
}

export default function ProfessionalGamingSystem({ onAuthRequired }: ProfessionalGamingSystemProps) {
  const [games, setGames] = useState<Game[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null)
  const [leaderboard, setLeaderboard] = useState<Leaderboard | null>(null)
  const [loading, setLoading] = useState(true)
  const [gameLoading, setGameLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [difficultyFilter, setDifficultyFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("games")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Estados del juego activo
  const [gameState, setGameState] = useState({
    isPlaying: false,
    score: 0,
    timeLeft: 0,
    level: 1,
    progress: 0
  })

  // Verificar autenticación
  useEffect(() => {
    const checkAuth = () => {
      const authenticated = gameAPI.isAuthenticated()
      setIsAuthenticated(authenticated)
      if (!authenticated && activeTab !== "games") {
        setActiveTab("games")
      }
    }
    
    checkAuth()
    window.addEventListener('storage', checkAuth)
    return () => window.removeEventListener('storage', checkAuth)
  }, [activeTab])

  // Cargar datos iniciales
  useEffect(() => {
    loadGames()
    if (isAuthenticated) {
      loadUserStats()
    }
  }, [isAuthenticated])

  const loadGames = async () => {
    try {
      setLoading(true)
      const response = await gameAPI.getGames({
        ...(typeFilter !== "all" && { tipo: typeFilter }),
        ...(difficultyFilter !== "all" && { dificultad: difficultyFilter }),
        ...(searchTerm && { search: searchTerm })
      })
      
      if (response.success && response.data) {
        setGames(response.data)
      } else {
        toast.error(response.message || "Error al cargar juegos")
      }
    } catch (error) {
      toast.error("Error de conexión")
    } finally {
      setLoading(false)
    }
  }

  const loadUserStats = async () => {
    if (!isAuthenticated) return
    
    try {
      const response = await gameAPI.getUserStats()
      if (response.success && response.data) {
        setUserStats(response.data)
      }
    } catch (error) {
      console.error("Error al cargar estadísticas:", error)
    }
  }

  const loadLeaderboard = async (gameId: string, tipo: 'global' | 'semanal' | 'mensual' = 'global') => {
    try {
      const response = await gameAPI.getLeaderboard(gameId, tipo)
      if (response.success && response.data) {
        setLeaderboard(response.data)
      }
    } catch (error) {
      console.error("Error al cargar leaderboard:", error)
    }
  }

  // Filtrar juegos
  const filteredGames = games.filter(game => {
    const matchesSearch = !searchTerm || 
      game.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesType = typeFilter === "all" || game.tipo === typeFilter
    const matchesDifficulty = difficultyFilter === "all" || game.dificultad === difficultyFilter
    
    return matchesSearch && matchesType && matchesDifficulty
  })

  // Iniciar juego
  const startGame = async (game: Game) => {
    if (!isAuthenticated) {
      onAuthRequired()
      return
    }

    try {
      setGameLoading(true)
      const response = await gameAPI.startGame(game._id)
      
      if (response.success && response.data) {
        setCurrentSession(response.data)
        setSelectedGame(game)
        setGameState({
          isPlaying: true,
          score: 0,
          timeLeft: game.configuracion.tiempoLimite,
          level: 1,
          progress: 0
        })
        setActiveTab("playing")
        toast.success(`¡${game.nombre} iniciado!`)
      } else {
        toast.error(response.message || "Error al iniciar juego")
      }
    } catch (error) {
      toast.error("Error de conexión")
    } finally {
      setGameLoading(false)
    }
  }

  // Actualizar progreso del juego
  const updateGameProgress = useCallback(async (updates: {
    score?: number;
    progress?: number;
    level?: number;
  }) => {
    if (!currentSession) return

    try {
      const response = await gameAPI.updateGameSession(currentSession._id, {
        puntuacion: updates.score,
        nivel: updates.level,
        progreso: updates.progress !== undefined ? {
          porcentaje: updates.progress,
          pasosCompletados: Math.floor((updates.progress / 100) * (selectedGame?.configuracion.niveles || 1)),
          pasosTotales: selectedGame?.configuracion.niveles || 1
        } : undefined
      })

      if (response.success) {
        setGameState(prev => ({
          ...prev,
          score: updates.score ?? prev.score,
          progress: updates.progress ?? prev.progress,
          level: updates.level ?? prev.level
        }))
      }
    } catch (error) {
      console.error("Error al actualizar progreso:", error)
    }
  }, [currentSession, selectedGame])

  // Finalizar juego
  const finishGame = async (finalScore: number, estado: 'completado' | 'fallido' | 'abandonado' = 'completado') => {
    if (!currentSession || !selectedGame) return

    try {
      const timeElapsed = selectedGame.configuracion.tiempoLimite - gameState.timeLeft
      
      const response = await gameAPI.finishGameSession(currentSession._id, {
        puntuacion: finalScore,
        tiempoJugado: timeElapsed,
        estado
      })

      if (response.success) {
        toast.success(`¡Juego ${estado}!`)
        if (response.recompensas) {
          toast.success(`Recompensas: ${response.recompensas.experiencia} XP, ${response.recompensas.monedas} monedas`)
        }
        
        // Resetear estado
        setCurrentSession(null)
        setSelectedGame(null)
        setGameState({
          isPlaying: false,
          score: 0,
          timeLeft: 0,
          level: 1,
          progress: 0
        })
        setActiveTab("games")
        
        // Recargar estadísticas
        await loadUserStats()
      }
    } catch (error) {
      toast.error("Error al finalizar juego")
    }
  }

  // Componente de filtros
  const FiltersSection = () => (
    <div className="flex flex-wrap gap-4 mb-6">
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar juegos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>
      
      <Select value={typeFilter} onValueChange={setTypeFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Tipo de juego" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los tipos</SelectItem>
          <SelectItem value="memoria">🧠 Memoria</SelectItem>
          <SelectItem value="matematicas">🔢 Matemáticas</SelectItem>
          <SelectItem value="palabras">📝 Palabras</SelectItem>
          <SelectItem value="velocidad">⚡ Velocidad</SelectItem>
          <SelectItem value="coordinacion">🎯 Coordinación</SelectItem>
          <SelectItem value="logica">🧩 Lógica</SelectItem>
          <SelectItem value="arcade">🕹️ Arcade</SelectItem>
          <SelectItem value="estrategia">⚔️ Estrategia</SelectItem>
          <SelectItem value="adivinanza">🔍 Adivinanza</SelectItem>
          <SelectItem value="puzzle">🌀 Puzzle</SelectItem>
        </SelectContent>
      </Select>

      <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Dificultad" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las dificultades</SelectItem>
          <SelectItem value="facil">🟢 Fácil</SelectItem>
          <SelectItem value="medio">🟡 Medio</SelectItem>
          <SelectItem value="dificil">🟠 Difícil</SelectItem>
          <SelectItem value="experto">🔴 Experto</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )

  // Componente de carta de juego
  const GameCard = ({ game }: { game: Game }) => {
    const IconComponent = gameTypeIcons[game.tipo] || Gamepad2
    
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.02, y: -5 }}
        className="h-full"
      >
        <Card className="h-full hover:shadow-lg transition-all duration-300 border-2 hover:border-blue-300 bg-gradient-to-br from-white to-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100">
                  <IconComponent className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{game.nombre}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {game.tipo}
                    </Badge>
                    <div className={`w-2 h-2 rounded-full ${difficultyColors[game.dificultad]}`} />
                    <span className="text-xs text-gray-600 capitalize">{game.dificultad}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <CardDescription className="text-sm leading-relaxed">
              {game.descripcion}
            </CardDescription>
            
            {/* Estadísticas del juego */}
            {game.estadisticas && (
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-600">Sesiones</div>
                  <div className="font-semibold">{game.estadisticas.sesionesTotales}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-600">Tasa completado</div>
                  <div className="font-semibold">{game.estadisticas.completionRate}%</div>
                </div>
              </div>
            )}
            
            {/* Información del juego */}
            <div className="space-y-2 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Tiempo límite:</span>
                <span className="font-medium">{Math.floor(game.configuracion.tiempoLimite / 60)}min</span>
              </div>
              <div className="flex justify-between">
                <span>Niveles:</span>
                <span className="font-medium">{game.configuracion.niveles}</span>
              </div>
              <div className="flex justify-between">
                <span>Puntuación máxima:</span>
                <span className="font-medium">{game.configuracion.puntuacionMaxima}</span>
              </div>
            </div>
            
            {/* Recompensas */}
            <div className="bg-yellow-50 p-3 rounded-lg">
              <div className="text-xs font-medium text-yellow-800 mb-1">Recompensas</div>
              <div className="flex justify-between text-xs text-yellow-700">
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  {game.recompensas.experiencia} XP
                </span>
                <span className="flex items-center gap-1">
                  <Coins className="h-3 w-3" />
                  {game.recompensas.monedas}
                </span>
              </div>
            </div>
            
            <Button
              onClick={() => startGame(game)}
              disabled={gameLoading}
              className="w-full"
              size="sm"
            >
              {gameLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Iniciando...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Play className="h-4 w-4" />
                  Jugar
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Componente del juego activo (placeholder - aquí irían los juegos específicos)
  const ActiveGameComponent = () => {
    if (!selectedGame || !currentSession) return null

    return (
      <div className="space-y-6">
        {/* Header del juego activo */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-100">
                    {(() => {
                      const IconComponent = gameTypeIcons[selectedGame.tipo] || Gamepad2
                      return <IconComponent className="h-6 w-6 text-blue-600" />
                    })()}
                  </div>
                  {selectedGame.nombre}
                </CardTitle>
                <CardDescription>{selectedGame.descripcion}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{gameState.score}</div>
                <div className="text-sm text-gray-600">Puntuación</div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <div className="text-lg font-semibold">{Math.floor(gameState.timeLeft / 60)}:{(gameState.timeLeft % 60).toString().padStart(2, '0')}</div>
                <div className="text-xs text-gray-600">Tiempo</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{gameState.level}</div>
                <div className="text-xs text-gray-600">Nivel</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{Math.round(gameState.progress)}%</div>
                <div className="text-xs text-gray-600">Progreso</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold">{selectedGame.configuracion.intentosMaximos}</div>
                <div className="text-xs text-gray-600">Intentos</div>
              </div>
            </div>
            
            <Progress value={gameState.progress} className="mb-4" />
            
            <div className="flex gap-2">
              <Button onClick={() => finishGame(gameState.score, 'abandonado')} variant="outline" size="sm">
                Abandonar
              </Button>
              <Button onClick={() => finishGame(gameState.score, 'completado')} className="ml-auto" size="sm">
                Finalizar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Área de juego - placeholder */}
        <Card>
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                <Gamepad2 className="h-16 w-16 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold">Área de Juego</h3>
              <p className="text-gray-600">
                Aquí se renderizaría el juego específico: {selectedGame.tipo}
              </p>
              <p className="text-sm text-gray-500">
                Esta es una implementación de demostración. Los juegos específicos se implementarían aquí.
              </p>
              
              {/* Botones de demostración */}
              <div className="flex gap-2 justify-center mt-6">
                <Button 
                  onClick={() => updateGameProgress({ score: gameState.score + 100, progress: Math.min(100, gameState.progress + 25) })}
                  variant="outline"
                >
                  +100 Puntos
                </Button>
                <Button 
                  onClick={() => updateGameProgress({ level: gameState.level + 1, progress: Math.min(100, gameState.progress + 10) })}
                  variant="outline"
                >
                  Subir Nivel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600">
              <Gamepad2 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Sistema de Juegos Profesional
              </h1>
              <p className="text-gray-600">20 juegos únicos con sistema de progresión y recompensas</p>
            </div>
          </div>
          
          {/* Stats rápidas */}
          {isAuthenticated && userStats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{userStats.general.completedGames}</div>
                  <div className="text-xs text-gray-600">Juegos Completados</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{userStats.general.highestScore}</div>
                  <div className="text-xs text-gray-600">Mejor Puntuación</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{userStats.nivel.actual}</div>
                  <div className="text-xs text-gray-600">Nivel</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{Math.floor(userStats.general.totalPlayTime / 3600)}h</div>
                  <div className="text-xs text-gray-600">Tiempo Jugado</div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{userStats.general.averageScore}</div>
                  <div className="text-xs text-gray-600">Promedio</div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="games">Juegos</TabsTrigger>
            <TabsTrigger value="stats" disabled={!isAuthenticated}>Estadísticas</TabsTrigger>
            <TabsTrigger value="leaderboards">Rankings</TabsTrigger>
            <TabsTrigger value="playing" disabled={!currentSession}>Jugando</TabsTrigger>
          </TabsList>

          {/* Tab de Juegos */}
          <TabsContent value="games" className="space-y-6">
            <FiltersSection />
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <Card key={i} className="h-80">
                    <CardContent className="p-6">
                      <div className="animate-pulse space-y-4">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-20 bg-gray-200 rounded"></div>
                        <div className="h-8 bg-gray-200 rounded"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                layout
              >
                <AnimatePresence>
                  {filteredGames.map((game) => (
                    <GameCard key={game._id} game={game} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
            
            {filteredGames.length === 0 && !loading && (
              <Card className="p-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold">No se encontraron juegos</h3>
                  <p className="text-gray-600">Intenta cambiar los filtros de búsqueda</p>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Tab de Estadísticas */}
          <TabsContent value="stats" className="space-y-6">
            {!isAuthenticated ? (
              <Alert>
                <AlertDescription>
                  Inicia sesión para ver tus estadísticas de juego
                </AlertDescription>
              </Alert>
            ) : userStats ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Estadísticas generales */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Estadísticas Generales
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{userStats.general.totalSessions}</div>
                        <div className="text-sm text-gray-600">Sesiones Totales</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{userStats.general.completedGames}</div>
                        <div className="text-sm text-gray-600">Juegos Completados</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">{userStats.general.totalScore}</div>
                        <div className="text-sm text-gray-600">Puntuación Total</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{userStats.general.averageScore}</div>
                        <div className="text-sm text-gray-600">Promedio</div>
                      </div>
                    </div>
                    
                    {/* Progreso de nivel */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Nivel {userStats.nivel.actual}</span>
                        <span>{userStats.nivel.experiencia} / {userStats.nivel.siguienteNivel} XP</span>
                      </div>
                      <Progress value={parseFloat(userStats.nivel.progreso)} />
                    </div>
                  </CardContent>
                </Card>

                {/* Estadísticas por tipo */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Por Tipo de Juego
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {userStats.porTipoJuego.map((stat) => {
                        const IconComponent = gameTypeIcons[stat._id as keyof typeof gameTypeIcons] || Gamepad2
                        return (
                          <div key={stat._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <IconComponent className="h-5 w-5 text-gray-600" />
                              <span className="font-medium capitalize">{stat._id}</span>
                            </div>
                            <div className="text-right text-sm">
                              <div className="font-bold">{stat.completed}/{stat.count}</div>
                              <div className="text-gray-600">Max: {stat.maxScore}</div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Sesiones recientes */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Sesiones Recientes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {userStats.sesionesRecientes.slice(0, 5).map((session) => (
                        <div key={session._id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge variant={session.estado === 'completado' ? 'default' : 'secondary'}>
                              {session.estado}
                            </Badge>
                            <span className="font-medium">Nivel {session.nivel}</span>
                          </div>
                          <div className="text-right text-sm">
                            <div className="font-bold">{session.puntuacion} pts</div>
                            <div className="text-gray-600">{Math.floor(session.tiempoJugado / 60)}:{(session.tiempoJugado % 60).toString().padStart(2, '0')}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Cargando estadísticas...</p>
              </div>
            )}
          </TabsContent>

          {/* Tab de Rankings */}
          <TabsContent value="leaderboards" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Tabla de Clasificación
                </CardTitle>
                <CardDescription>
                  Selecciona un juego para ver su ranking
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {games.slice(0, 6).map((game) => (
                    <Button
                      key={game._id}
                      variant="outline"
                      className="h-auto p-4 justify-start"
                      onClick={() => loadLeaderboard(game._id)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        {(() => {
                          const IconComponent = gameTypeIcons[game.tipo] || Gamepad2
                          return <IconComponent className="h-5 w-5" />
                        })()}
                        <div className="text-left">
                          <div className="font-medium">{game.nombre}</div>
                          <div className="text-xs text-gray-600">{game.tipo}</div>
                        </div>
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      </div>
                    </Button>
                  ))}
                </div>

                {leaderboard && (
                  <div className="mt-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <Trophy className="h-6 w-6 text-yellow-500" />
                      <h3 className="text-lg font-semibold">{leaderboard.juego.nombre}</h3>
                      <Badge>{leaderboard.tipo}</Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {leaderboard.clasificaciones.slice(0, 10).map((entry, index) => (
                        <div key={entry.usuario.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                              index === 0 ? 'bg-yellow-100 text-yellow-700' :
                              index === 1 ? 'bg-gray-100 text-gray-700' :
                              index === 2 ? 'bg-orange-100 text-orange-700' :
                              'bg-blue-50 text-blue-600'
                            }`}>
                              {entry.posicion}
                            </div>
                            <Avatar>
                              <AvatarFallback>{entry.usuario.username[0].toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{entry.usuario.username}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">{entry.puntuacion} pts</div>
                            <div className="text-sm text-gray-600">{entry.partidasJugadas} partidas</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Juego Activo */}
          <TabsContent value="playing">
            {currentSession ? (
              <ActiveGameComponent />
            ) : (
              <Card className="p-8">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                    <Gamepad2 className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold">No hay juego activo</h3>
                  <p className="text-gray-600">Selecciona un juego para comenzar a jugar</p>
                  <Button onClick={() => setActiveTab("games")}>
                    Ver Juegos
                  </Button>
                </div>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 