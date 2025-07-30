"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Gamepad2,
  Trophy,
  Star,
  Zap,
  Target,
  Brain,
  Music,
  Puzzle,
  Car,
  Swords,
  Drum,
  Eye,
  Timer,
  Medal,
  Crown,
  Flame,
  Sparkles,
  Coins,
  Heart,
  Shield,
  Rocket,
  Gem,
  Fish,
  Camera,
  Palette,
  Calculator,
  Compass,
  Headphones
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"

interface MiniGame {
  id: string
  name: string
  description: string
  icon: any
  category: 'arcade' | 'puzzle' | 'memory' | 'reaction' | 'rhythm' | 'strategy' | 'creative'
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme'
  rewards: {
    coins: number
    xp: number
    special?: string
  }
  highScore: number
  timesPlayed: number
  avgScore: number
  unlocked: boolean
  premium: boolean
}

interface GameSession {
  gameId: string
  score: number
  timeStarted: Date
  timeElapsed: number
  completed: boolean
}

export default function UltimateMiniGamesCollection({ onScoreUpdate }: {
  onScoreUpdate: (coins: number, xp: number) => void
}) {
  const [games] = useState<MiniGame[]>([
    // ARCADE GAMES
    {
      id: 'pou-jump',
      name: 'Pou Jump Adventure',
      description: 'Ayuda a Pou a saltar entre plataformas y recoger monedas',
      icon: Rocket,
      category: 'arcade',
      difficulty: 'easy',
      rewards: { coins: 50, xp: 25 },
      highScore: 0,
      timesPlayed: 0,
      avgScore: 0,
      unlocked: true,
      premium: false
    },
    {
      id: 'endless-runner',
      name: 'Pou Runner Infinito',
      description: 'Corre sin parar y evita obstáculos en este runner infinito',
      icon: Zap,
      category: 'arcade',
      difficulty: 'medium',
      rewards: { coins: 75, xp: 40 },
      highScore: 0,
      timesPlayed: 0,
      avgScore: 0,
      unlocked: true,
      premium: false
    },
    {
      id: 'space-invaders',
      name: 'Pou vs Aliens',
      description: 'Defiende el planeta de la invasión alienígena',
      icon: Shield,
      category: 'arcade',
      difficulty: 'hard',
      rewards: { coins: 100, xp: 60, special: 'laser_weapon' },
      highScore: 0,
      timesPlayed: 0,
      avgScore: 0,
      unlocked: true,
      premium: false
    },

    // PUZZLE GAMES
    {
      id: 'match-three',
      name: 'Pou Candy Match',
      description: 'Conecta 3 o más dulces del mismo color',
      icon: Gem,
      category: 'puzzle',
      difficulty: 'easy',
      rewards: { coins: 40, xp: 20 },
      highScore: 0,
      timesPlayed: 0,
      avgScore: 0,
      unlocked: true,
      premium: false
    },
    {
      id: 'sliding-puzzle',
      name: 'Puzzle Deslizante',
      description: 'Reorganiza las piezas para formar la imagen de Pou',
      icon: Puzzle,
      category: 'puzzle',
      difficulty: 'medium',
      rewards: { coins: 60, xp: 35 },
      highScore: 0,
      timesPlayed: 0,
      avgScore: 0,
      unlocked: true,
      premium: false
    },
    {
      id: 'block-tetris',
      name: 'Pou Tetris',
      description: 'Versión clásica de Tetris con temática Pou',
      icon: Calculator,
      category: 'puzzle',
      difficulty: 'hard',
      rewards: { coins: 90, xp: 55 },
      highScore: 0,
      timesPlayed: 0,
      avgScore: 0,
      unlocked: false,
      premium: false
    },

    // MEMORY GAMES
    {
      id: 'memory-cards',
      name: 'Memoria Pou',
      description: 'Encuentra las parejas de cartas iguales',
      icon: Eye,
      category: 'memory',
      difficulty: 'easy',
      rewards: { coins: 35, xp: 30 },
      highScore: 0,
      timesPlayed: 0,
      avgScore: 0,
      unlocked: true,
      premium: false
    },
    {
      id: 'sequence-memory',
      name: 'Secuencia Mágica',
      description: 'Memoriza y repite la secuencia de colores',
      icon: Brain,
      category: 'memory',
      difficulty: 'medium',
      rewards: { coins: 55, xp: 40 },
      highScore: 0,
      timesPlayed: 0,
      avgScore: 0,
      unlocked: true,
      premium: false
    },
    {
      id: 'visual-memory',
      name: 'Memoria Visual Extrema',
      description: 'Memoriza patrones complejos en tiempo limitado',
      icon: Camera,
      category: 'memory',
      difficulty: 'extreme',
      rewards: { coins: 150, xp: 100, special: 'memory_boost' },
      highScore: 0,
      timesPlayed: 0,
      avgScore: 0,
      unlocked: false,
      premium: true
    },

    // REACTION GAMES
    {
      id: 'whack-a-pou',
      name: 'Golpea al Pou Travieso',
      description: 'Golpea a los Pous traviesos que aparezcan',
      icon: Target,
      category: 'reaction',
      difficulty: 'easy',
      rewards: { coins: 45, xp: 25 },
      highScore: 0,
      timesPlayed: 0,
      avgScore: 0,
      unlocked: true,
      premium: false
    },
    {
      id: 'reflex-test',
      name: 'Test de Reflejos',
      description: 'Presiona cuando la luz se ponga verde',
      icon: Timer,
      category: 'reaction',
      difficulty: 'medium',
      rewards: { coins: 65, xp: 35 },
      highScore: 0,
      timesPlayed: 0,
      avgScore: 0,
      unlocked: true,
      premium: false
    },
    {
      id: 'ninja-reflexes',
      name: 'Reflejos Ninja',
      description: 'Esquiva proyectiles con reflejos ultrarrápidos',
      icon: Swords,
      category: 'reaction',
      difficulty: 'extreme',
      rewards: { coins: 120, xp: 80, special: 'ninja_suit' },
      highScore: 0,
      timesPlayed: 0,
      avgScore: 0,
      unlocked: false,
      premium: false
    },

    // RHYTHM GAMES
    {
      id: 'dance-revolution',
      name: 'Pou Dance Revolution',
      description: 'Sigue el ritmo y haz que Pou baile',
      icon: Music,
      category: 'rhythm',
      difficulty: 'medium',
      rewards: { coins: 70, xp: 45 },
      highScore: 0,
      timesPlayed: 0,
      avgScore: 0,
      unlocked: true,
      premium: false
    },
    {
      id: 'drum-master',
      name: 'Maestro de Batería',
      description: 'Toca la batería siguiendo el ritmo perfecto',
      icon: Drum,
      category: 'rhythm',
      difficulty: 'hard',
      rewards: { coins: 95, xp: 60 },
      highScore: 0,
      timesPlayed: 0,
      avgScore: 0,
      unlocked: false,
      premium: false
    },
    {
      id: 'orchestra-conductor',
      name: 'Director de Orquesta',
      description: 'Dirige una orquesta de Pous musicales',
      icon: Headphones,
      category: 'rhythm',
      difficulty: 'extreme',
      rewards: { coins: 140, xp: 90, special: 'conductor_baton' },
      highScore: 0,
      timesPlayed: 0,
      avgScore: 0,
      unlocked: false,
      premium: true
    },

    // CREATIVE GAMES
    {
      id: 'color-pou',
      name: 'Colorea a Pou',
      description: 'Usa tu creatividad para colorear diferentes Pous',
      icon: Palette,
      category: 'creative',
      difficulty: 'easy',
      rewards: { coins: 30, xp: 35 },
      highScore: 0,
      timesPlayed: 0,
      avgScore: 0,
      unlocked: true,
      premium: false
    },
    {
      id: 'build-world',
      name: 'Construye el Mundo de Pou',
      description: 'Crea y diseña el mundo perfecto para Pou',
      icon: Compass,
      category: 'creative',
      difficulty: 'medium',
      rewards: { coins: 80, xp: 50 },
      highScore: 0,
      timesPlayed: 0,
      avgScore: 0,
      unlocked: false,
      premium: false
    }
  ])

  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null)
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null)
  const [gameState, setGameState] = useState<any>({})
  const [filter, setFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('name')
  const [showGameplay, setShowGameplay] = useState(false)

  // Filtrar y ordenar juegos
  const filteredGames = games
    .filter(game => filter === 'all' || game.category === filter)
    .filter(game => game.unlocked || game.premium)
    .sort((a, b) => {
      switch (sortBy) {
        case 'difficulty':
          const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3, 'extreme': 4 }
          return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        case 'rewards':
          return b.rewards.coins - a.rewards.coins
        case 'highScore':
          return b.highScore - a.highScore
        default:
          return a.name.localeCompare(b.name)
      }
    })

  // Iniciar juego
  const startGame = (game: MiniGame) => {
    if (!game.unlocked && game.premium) {
      toast.error("Juego premium - Desbloquea con monedas")
      return
    }

    setSelectedGame(game)
    setCurrentSession({
      gameId: game.id,
      score: 0,
      timeStarted: new Date(),
      timeElapsed: 0,
      completed: false
    })
    setShowGameplay(true)
    
    // Inicializar estado específico del juego
    initializeGameState(game.id)
    toast.success(`¡Iniciando ${game.name}!`)
  }

  // Inicializar estado del juego
  const initializeGameState = (gameId: string) => {
    switch (gameId) {
      case 'pou-jump':
        setGameState({
          pouPosition: { x: 50, y: 50 },
          platforms: generatePlatforms(),
          coins: generateCoins(),
          score: 0,
          lives: 3,
          jumpVelocity: 0,
          gravity: 0.5
        })
        break
      case 'memory-cards':
        setGameState({
          cards: generateMemoryCards(),
          flippedCards: [],
          matchedCards: [],
          moves: 0,
          timeLeft: 60
        })
        break
      case 'whack-a-pou':
        setGameState({
          holes: Array(9).fill(false),
          score: 0,
          timeLeft: 30,
          pouAppearance: null
        })
        break
      case 'dance-revolution':
        setGameState({
          arrows: generateDanceArrows(),
          currentBeat: 0,
          score: 0,
          combo: 0,
          timeLeft: 120
        })
        break
      default:
        setGameState({
          score: 0,
          timeLeft: 60,
          completed: false
        })
    }
  }

  // Generar elementos del juego
  const generatePlatforms = () => {
    return Array(10).fill(0).map((_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: i * 15 + 20,
      width: 20,
      type: Math.random() > 0.8 ? 'moving' : 'static'
    }))
  }

  const generateCoins = () => {
    return Array(15).fill(0).map((_, i) => ({
      id: i,
      x: Math.random() * 90 + 5,
      y: Math.random() * 80 + 10,
      collected: false,
      value: Math.random() > 0.9 ? 10 : 1
    }))
  }

  const generateMemoryCards = () => {
    const symbols = ['🍎', '🍌', '🍇', '🍓', '🥝', '🍑', '🍒', '🥭']
    const cards = [...symbols, ...symbols]
    return cards
      .sort(() => Math.random() - 0.5)
      .map((symbol, i) => ({ id: i, symbol, flipped: false, matched: false }))
  }

  const generateDanceArrows = () => {
    const directions = ['up', 'down', 'left', 'right']
    return Array(50).fill(0).map((_, i) => ({
      id: i,
      direction: directions[Math.floor(Math.random() * directions.length)],
      timing: i * 1000,
      hit: false
    }))
  }

  // Finalizar juego
  const endGame = (finalScore: number) => {
    if (!selectedGame || !currentSession) return

    const timeElapsed = Date.now() - currentSession.timeStarted.getTime()
    const updatedSession = {
      ...currentSession,
      score: finalScore,
      timeElapsed,
      completed: true
    }

    // Calcular recompensas basadas en rendimiento
    const baseRewards = selectedGame.rewards
    const performanceMultiplier = Math.min(2, finalScore / 1000 + 0.5)
    const timeBonus = timeElapsed < 30000 ? 1.2 : 1.0

    const finalCoins = Math.floor(baseRewards.coins * performanceMultiplier * timeBonus)
    const finalXP = Math.floor(baseRewards.xp * performanceMultiplier)

    // Actualizar estadísticas del juego
    const gameIndex = games.findIndex(g => g.id === selectedGame.id)
    if (gameIndex !== -1) {
      games[gameIndex].highScore = Math.max(games[gameIndex].highScore, finalScore)
      games[gameIndex].timesPlayed += 1
      games[gameIndex].avgScore = (games[gameIndex].avgScore * (games[gameIndex].timesPlayed - 1) + finalScore) / games[gameIndex].timesPlayed
    }

    // Entregar recompensas
    onScoreUpdate(finalCoins, finalXP)
    
    setShowGameplay(false)
    setCurrentSession(null)
    setSelectedGame(null)

    toast.success(`¡Juego completado! +${finalCoins} 🪙 +${finalXP} XP`)

    // Desbloquear juegos basado en rendimiento
    if (finalScore > 500 && selectedGame.difficulty === 'easy') {
      unlockGames(['block-tetris', 'drum-master'])
    }
    if (finalScore > 1000 && selectedGame.difficulty === 'medium') {
      unlockGames(['ninja-reflexes', 'build-world'])
    }
  }

  // Desbloquear juegos
  const unlockGames = (gameIds: string[]) => {
    gameIds.forEach(gameId => {
      const gameIndex = games.findIndex(g => g.id === gameId)
      if (gameIndex !== -1 && !games[gameIndex].unlocked) {
        games[gameIndex].unlocked = true
        toast.success(`¡Nuevo juego desbloqueado: ${games[gameIndex].name}!`)
      }
    })
  }

  // Renderizar juego específico
  const renderGameplay = () => {
    if (!selectedGame || !showGameplay) return null

    switch (selectedGame.id) {
      case 'pou-jump':
        return <PouJumpGame gameState={gameState} setGameState={setGameState} onEnd={endGame} />
      case 'memory-cards':
        return <MemoryCardsGame gameState={gameState} setGameState={setGameState} onEnd={endGame} />
      case 'whack-a-pou':
        return <WhackAPouGame gameState={gameState} setGameState={setGameState} onEnd={endGame} />
      case 'dance-revolution':
        return <DanceRevolutionGame gameState={gameState} setGameState={setGameState} onEnd={endGame} />
      default:
        return <GenericGame game={selectedGame} onEnd={endGame} />
    }
  }

  if (showGameplay) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <div className="relative w-full h-full max-w-4xl max-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
          <Button
            onClick={() => {
              setShowGameplay(false)
              setCurrentSession(null)
              setSelectedGame(null)
            }}
            className="absolute top-4 right-4 z-10"
            variant="destructive"
          >
            Salir
          </Button>
          {renderGameplay()}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">🎮 Colección Ultimate de Mini-Juegos</h1>
              <p className="opacity-90">15+ juegos únicos con motor de física y recompensas épicas</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{filteredGames.length} Juegos Disponibles</div>
              <div className="text-sm opacity-90">🏆 Sistema de Progresión Avanzado</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros y Estadísticas */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Todos
          </Button>
          {['arcade', 'puzzle', 'memory', 'reaction', 'rhythm', 'creative'].map(category => (
            <Button
              key={category}
              size="sm"
              variant={filter === category ? 'default' : 'outline'}
              onClick={() => setFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-3 py-1 border rounded text-sm"
        >
          <option value="name">Ordenar por Nombre</option>
          <option value="difficulty">Ordenar por Dificultad</option>
          <option value="rewards">Ordenar por Recompensas</option>
          <option value="highScore">Ordenar por Puntaje</option>
        </select>
      </div>

      {/* Grid de Juegos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredGames.map((game) => (
          <motion.div
            key={game.id}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              game.premium ? 'border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-orange-50' : ''
            } ${!game.unlocked ? 'opacity-60' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    game.category === 'arcade' ? 'bg-red-100 text-red-600' :
                    game.category === 'puzzle' ? 'bg-blue-100 text-blue-600' :
                    game.category === 'memory' ? 'bg-green-100 text-green-600' :
                    game.category === 'reaction' ? 'bg-yellow-100 text-yellow-600' :
                    game.category === 'rhythm' ? 'bg-purple-100 text-purple-600' :
                    'bg-pink-100 text-pink-600'
                  }`}>
                    <game.icon className="h-6 w-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{game.name}</h3>
                      {game.premium && <Crown className="h-4 w-4 text-yellow-500" />}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{game.description}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <Badge variant={
                      game.difficulty === 'easy' ? 'secondary' :
                      game.difficulty === 'medium' ? 'default' :
                      game.difficulty === 'hard' ? 'destructive' : 'destructive'
                    }>
                      {game.difficulty}
                    </Badge>
                    <span className="text-gray-500">{game.category}</span>
                  </div>

                  <div className="flex justify-between text-xs">
                    <span>🪙 {game.rewards.coins}</span>
                    <span>⭐ {game.rewards.xp} XP</span>
                    <span>🏆 {game.highScore}</span>
                  </div>

                  {game.timesPlayed > 0 && (
                    <div className="text-xs text-gray-600">
                      Jugado {game.timesPlayed} veces • Promedio: {Math.floor(game.avgScore)}
                    </div>
                  )}

                  <Button
                    onClick={() => startGame(game)}
                    className="w-full mt-2"
                    size="sm"
                    disabled={!game.unlocked && !game.premium}
                  >
                    {!game.unlocked ? '🔒 Bloqueado' : 
                     game.premium ? '👑 Premium' : 
                     '🎮 Jugar'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Estadísticas Globales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Estadísticas de Juegos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {games.reduce((sum, game) => sum + game.timesPlayed, 0)}
              </div>
              <div className="text-sm text-gray-600">Partidas Jugadas</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.max(...games.map(g => g.highScore))}
              </div>
              <div className="text-sm text-gray-600">Puntaje Máximo</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {games.filter(g => g.unlocked).length}/{games.length}
              </div>
              <div className="text-sm text-gray-600">Juegos Desbloqueados</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {games.reduce((sum, game) => sum + game.rewards.coins, 0)}
              </div>
              <div className="text-sm text-gray-600">Recompensas Totales</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Componentes de juegos específicos (simplificados para demostración)
function PouJumpGame({ gameState, setGameState, onEnd }: any) {
  const [gameRunning, setGameRunning] = useState(true)

  useEffect(() => {
    if (!gameRunning) return

    const gameLoop = setInterval(() => {
      setGameState((prev: any) => {
        const newScore = prev.score + 1
        if (newScore >= 1000) {
          setGameRunning(false)
          onEnd(newScore)
        }
        return { ...prev, score: newScore }
      })
    }, 100)

    return () => clearInterval(gameLoop)
  }, [gameRunning])

  return (
    <div className="w-full h-full flex items-center justify-center text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">🦘 Pou Jump Adventure</h2>
        <div className="text-xl mb-4">Puntuación: {gameState.score}</div>
        <div className="text-sm">¡Pou está saltando automáticamente!</div>
        <div className="mt-8">
          <div className="relative w-64 h-64 bg-sky-200 rounded-lg mx-auto">
            <motion.div
              className="absolute w-8 h-8 bg-purple-500 rounded-full"
              animate={{
                x: [0, 200, 0],
                y: [200, 50, 200]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              🐾
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MemoryCardsGame({ gameState, setGameState, onEnd }: any) {
  const [selectedCards, setSelectedCards] = useState<number[]>([])

  const flipCard = (cardId: number) => {
    if (selectedCards.length >= 2) return
    
    setSelectedCards(prev => [...prev, cardId])
    
    if (selectedCards.length === 1) {
      setTimeout(() => {
        setSelectedCards([])
        setGameState((prev: any) => ({
          ...prev,
          moves: prev.moves + 1,
          score: prev.score + 10
        }))
      }, 1000)
    }
  }

  useEffect(() => {
    if (gameState.moves >= 20) {
      onEnd(gameState.score)
    }
  }, [gameState.moves])

  return (
    <div className="w-full h-full flex items-center justify-center text-white p-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">🧠 Memoria Pou</h2>
        <div className="text-xl mb-4">Puntuación: {gameState.score} | Movimientos: {gameState.moves}/20</div>
        
        <div className="grid grid-cols-4 gap-2 max-w-md mx-auto">
          {gameState.cards?.map((card: any, index: number) => (
            <button
              key={index}
              onClick={() => flipCard(index)}
              className={`w-16 h-16 rounded-lg text-2xl transition-all duration-300 ${
                selectedCards.includes(index) 
                  ? 'bg-white text-black' 
                  : 'bg-blue-500 hover:bg-blue-400'
              }`}
            >
              {selectedCards.includes(index) ? card.symbol : '?'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function WhackAPouGame({ gameState, setGameState, onEnd }: any) {
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState((prev: any) => {
        const newTimeLeft = prev.timeLeft - 1
        if (newTimeLeft <= 0) {
          onEnd(prev.score)
        }
        return { ...prev, timeLeft: newTimeLeft }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const whackPou = (holeIndex: number) => {
    setGameState((prev: any) => ({
      ...prev,
      score: prev.score + 100
    }))
  }

  return (
    <div className="w-full h-full flex items-center justify-center text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">🔨 Golpea al Pou Travieso</h2>
        <div className="text-xl mb-4">
          Puntuación: {gameState.score} | Tiempo: {gameState.timeLeft}s
        </div>
        
        <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
          {Array(9).fill(0).map((_, index) => (
            <button
              key={index}
              onClick={() => whackPou(index)}
              className="w-20 h-20 bg-brown-600 rounded-full border-4 border-brown-800 hover:scale-110 transition-transform"
            >
              {Math.random() > 0.7 ? '🐾' : '🕳️'}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function DanceRevolutionGame({ gameState, setGameState, onEnd }: any) {
  useEffect(() => {
    const timer = setInterval(() => {
      setGameState((prev: any) => {
        const newTimeLeft = prev.timeLeft - 1
        if (newTimeLeft <= 0) {
          onEnd(prev.score)
        }
        return { ...prev, timeLeft: newTimeLeft, score: prev.score + 5 }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">💃 Pou Dance Revolution</h2>
        <div className="text-xl mb-4">
          Puntuación: {gameState.score} | Tiempo: {gameState.timeLeft}s
        </div>
        
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {['⬆️', '⬇️', '⬅️', '➡️'].map((arrow, index) => (
            <button
              key={index}
              className="w-20 h-20 bg-pink-500 rounded-lg text-3xl hover:bg-pink-400 transition-colors"
              onClick={() => setGameState((prev: any) => ({ ...prev, score: prev.score + 50 }))}
            >
              {arrow}
            </button>
          ))}
        </div>
        
        <div className="mt-8">
          <motion.div
            className="text-6xl"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🕺
          </motion.div>
        </div>
      </div>
    </div>
  )
}

function GenericGame({ game, onEnd }: { game: MiniGame, onEnd: (score: number) => void }) {
  const [score, setScore] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setScore(prev => prev + 10)
    }, 200)

    const endTimer = setTimeout(() => {
      onEnd(score)
    }, 10000)

    return () => {
      clearInterval(timer)
      clearTimeout(endTimer)
    }
  }, [])

  return (
    <div className="w-full h-full flex items-center justify-center text-white">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">🎮 {game.name}</h2>
        <div className="text-xl mb-4">Puntuación: {score}</div>
        <div className="text-lg mb-8">{game.description}</div>
        
        <motion.div
          className="text-8xl"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <game.icon />
        </motion.div>
        
        <div className="mt-8 text-sm opacity-75">
          ¡El juego terminará automáticamente en unos segundos!
        </div>
      </div>
    </div>
  )
}