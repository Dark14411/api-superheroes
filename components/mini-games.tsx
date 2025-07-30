"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Gamepad2,
  Target,
  Zap,
  Star,
  Coins,
  Trophy,
  Clock,
  Heart,
  Smile,
  Apple,
  Bath,
  RotateCcw,
  Play,
  Pause,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

interface MiniGame {
  id: string
  name: string
  description: string
  icon: string
  difficulty: "easy" | "medium" | "hard"
  duration: number // segundos
  rewards: {
    coins: number
    health?: number
    happiness?: number
    energy?: number
    hunger?: number
    cleanliness?: number
  }
  penalties: {
    health?: number
    happiness?: number
    energy?: number
    hunger?: number
    cleanliness?: number
  }
}

export default function MiniGames({ 
  onGameComplete, 
  onGameFail,
  coins 
}: {
  onGameComplete: (rewards: any) => void
  onGameFail: (penalties: any) => void
  coins: number
}) {
  const [selectedGame, setSelectedGame] = useState<MiniGame | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [gameState, setGameState] = useState<"menu" | "playing" | "complete" | "failed">("menu")

  // Mini-juegos disponibles
  const miniGames: MiniGame[] = [
    {
      id: "click_speed",
      name: "Velocidad de Clicks",
      description: "Haz clicks rápidos para ganar puntos",
      icon: "⚡",
      difficulty: "easy",
      duration: 10,
      rewards: {
        coins: 15,
        happiness: 10,
        energy: -5
      },
      penalties: {
        energy: -10,
        happiness: -5
      }
    },
    {
      id: "target_practice",
      name: "Práctica de Tiro",
      description: "Apunta y dispara a los objetivos",
      icon: "🎯",
      difficulty: "medium",
      duration: 15,
      rewards: {
        coins: 25,
        happiness: 15,
        energy: -8
      },
      penalties: {
        energy: -15,
        happiness: -8
      }
    },
    {
      id: "memory_game",
      name: "Juego de Memoria",
      description: "Encuentra las parejas de cartas",
      icon: "🧠",
      difficulty: "medium",
      duration: 20,
      rewards: {
        coins: 30,
        happiness: 20,
        energy: -10
      },
      penalties: {
        energy: -12,
        happiness: -10
      }
    },
    {
      id: "rhythm_game",
      name: "Juego de Ritmo",
      description: "Sigue el ritmo de la música",
      icon: "🎵",
      difficulty: "hard",
      duration: 25,
      rewards: {
        coins: 40,
        happiness: 25,
        energy: -15
      },
      penalties: {
        energy: -20,
        happiness: -15
      }
    },
    {
      id: "puzzle_solve",
      name: "Resolver Puzzle",
      description: "Completa el puzzle antes del tiempo",
      icon: "🧩",
      difficulty: "hard",
      duration: 30,
      rewards: {
        coins: 50,
        happiness: 30,
        energy: -20
      },
      penalties: {
        energy: -25,
        happiness: -20
      }
    }
  ]

  const startGame = (game: MiniGame) => {
    setSelectedGame(game)
    setScore(0)
    setTimeLeft(game.duration)
    setIsPlaying(true)
    setGameState("playing")
  }

  const endGame = (success: boolean) => {
    setIsPlaying(false)
    if (success && selectedGame) {
      setGameState("complete")
      onGameComplete(selectedGame.rewards)
    } else if (selectedGame) {
      setGameState("failed")
      onGameFail(selectedGame.penalties)
    }
  }

  // Timer del juego
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame(true) // Termina el juego cuando se acaba el tiempo
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isPlaying, timeLeft])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-green-500"
      case "medium": return "bg-yellow-500"
      case "hard": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "Fácil"
      case "medium": return "Medio"
      case "hard": return "Difícil"
      default: return "Fácil"
    }
  }

  // Renderizar juego específico
  const renderGame = () => {
    if (!selectedGame) return null

    switch (selectedGame.id) {
      case "click_speed":
        return (
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold">¡Haz clicks rápidos!</h3>
            <div className="text-6xl font-bold text-blue-600">{score}</div>
            <Button
              size="lg"
              onClick={() => setScore(prev => prev + 1)}
              className="h-20 w-20 rounded-full text-2xl"
            >
              ⚡
            </Button>
          </div>
        )

      case "target_practice":
        return (
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold">¡Dispara a los objetivos!</h3>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((target) => (
                <motion.div
                  key={target}
                  className="w-16 h-16 bg-red-500 rounded-full cursor-pointer flex items-center justify-center text-white font-bold"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setScore(prev => prev + 10)}
                >
                  🎯
                </motion.div>
              ))}
            </div>
            <div className="text-3xl font-bold text-red-600">Puntos: {score}</div>
          </div>
        )

      case "memory_game":
        return (
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold">¡Encuentra las parejas!</h3>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((card) => (
                <motion.div
                  key={card}
                  className="w-12 h-12 bg-blue-500 rounded cursor-pointer flex items-center justify-center text-white"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setScore(prev => prev + 5)}
                >
                  🃏
                </motion.div>
              ))}
            </div>
            <div className="text-2xl font-bold text-blue-600">Puntos: {score}</div>
          </div>
        )

      case "rhythm_game":
        return (
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold">¡Sigue el ritmo!</h3>
            <div className="flex justify-center gap-4">
              {[1, 2, 3, 4].map((beat) => (
                <motion.div
                  key={beat}
                  className="w-12 h-12 bg-purple-500 rounded-full cursor-pointer flex items-center justify-center text-white"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: beat * 0.2 }}
                  onClick={() => setScore(prev => prev + 15)}
                >
                  🎵
                </motion.div>
              ))}
            </div>
            <div className="text-2xl font-bold text-purple-600">Puntos: {score}</div>
          </div>
        )

      case "puzzle_solve":
        return (
          <div className="text-center space-y-6">
            <h3 className="text-2xl font-bold">¡Completa el puzzle!</h3>
            <div className="grid grid-cols-3 gap-2 max-w-xs mx-auto">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((piece) => (
                <motion.div
                  key={piece}
                  className="w-12 h-12 bg-green-500 rounded cursor-pointer flex items-center justify-center text-white font-bold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setScore(prev => prev + 8)}
                >
                  {piece}
                </motion.div>
              ))}
            </div>
            <div className="text-2xl font-bold text-green-600">Puntos: {score}</div>
          </div>
        )

      default:
        return <div>Juego no encontrado</div>
    }
  }

  if (gameState === "menu") {
    return (
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Gamepad2 className="w-8 h-8 text-purple-600" />
            Mini-Juegos
          </h1>
          <p className="text-gray-600 mb-4">Juega y gana monedas mientras cuidas a tu Pou</p>
          
          {/* Monedas */}
          <div className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 p-3 rounded-lg">
            <Coins className="w-6 h-6 text-yellow-600" />
            <span className="text-xl font-bold text-yellow-700">{coins}</span>
            <span className="text-gray-600">monedas</span>
          </div>
        </div>

        {/* Grid de juegos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {miniGames.map((game) => (
            <motion.div
              key={game.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card className="p-6 cursor-pointer hover:shadow-lg transition-shadow">
                <div className="text-center space-y-4">
                  {/* Icono y dificultad */}
                  <div className="relative">
                    <div className="text-5xl mb-3">{game.icon}</div>
                    <Badge 
                      className={`absolute -top-2 -right-2 ${getDifficultyColor(game.difficulty)}`}
                      variant="secondary"
                    >
                      {getDifficultyText(game.difficulty)}
                    </Badge>
                  </div>

                  {/* Información del juego */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{game.name}</h3>
                    <p className="text-gray-600 mb-3">{game.description}</p>
                    
                    {/* Duración */}
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">{game.duration}s</span>
                    </div>

                    {/* Recompensas */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-center gap-2">
                        <Coins className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm font-bold text-yellow-700">+{game.rewards.coins} monedas</span>
                      </div>
                      
                      {game.rewards.happiness && (
                        <div className="flex items-center justify-center gap-2">
                          <Smile className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">+{game.rewards.happiness} felicidad</span>
                        </div>
                      )}
                      
                      {game.rewards.energy && (
                        <div className="flex items-center justify-center gap-2">
                          <Zap className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">{game.rewards.energy > 0 ? '+' : ''}{game.rewards.energy} energía</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botón de jugar */}
                  <Button
                    onClick={() => startGame(game)}
                    className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Jugar
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (gameState === "playing" && selectedGame) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Header del juego */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">{selectedGame.name}</h2>
          
          {/* Timer y puntuación */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-red-500" />
              <span className="text-xl font-bold text-red-600">{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-xl font-bold text-yellow-600">{score} pts</span>
            </div>
          </div>

          {/* Barra de progreso del tiempo */}
          <Progress 
            value={(timeLeft / selectedGame.duration) * 100} 
            className="h-3 mb-6"
          />
        </div>

        {/* Área del juego */}
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50">
          {renderGame()}
        </Card>

        {/* Botones de control */}
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setIsPlaying(false)
              setGameState("menu")
            }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Salir
          </Button>
          <Button
            onClick={() => endGame(true)}
            className="bg-green-500 hover:bg-green-600"
          >
            <Trophy className="w-4 h-4 mr-2" />
            Completar
          </Button>
        </div>
      </div>
    )
  }

  if (gameState === "complete" && selectedGame) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-green-800 mb-4">¡Juego Completado!</h2>
            <p className="text-lg text-green-700 mb-6">Puntuación final: {score} puntos</p>
            
            {/* Recompensas */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-center gap-2">
                <Coins className="w-5 h-5 text-yellow-600" />
                <span className="text-lg font-bold text-yellow-700">+{selectedGame.rewards.coins} monedas</span>
              </div>
              
              {selectedGame.rewards.happiness && (
                <div className="flex items-center justify-center gap-2">
                  <Smile className="w-5 h-5 text-yellow-500" />
                  <span className="text-lg text-gray-700">+{selectedGame.rewards.happiness} felicidad</span>
                </div>
              )}
              
              {selectedGame.rewards.energy && (
                <div className="flex items-center justify-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <span className="text-lg text-gray-700">{selectedGame.rewards.energy > 0 ? '+' : ''}{selectedGame.rewards.energy} energía</span>
                </div>
              )}
            </div>

            <Button
              onClick={() => setGameState("menu")}
              className="bg-green-500 hover:bg-green-600"
            >
              <Play className="w-4 h-4 mr-2" />
              Jugar Otro
            </Button>
          </motion.div>
        </Card>
      </div>
    )
  }

  if (gameState === "failed" && selectedGame) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card className="p-8 bg-gradient-to-br from-red-50 to-pink-50 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="text-6xl mb-4">😢</div>
            <h2 className="text-3xl font-bold text-red-800 mb-4">¡Juego Fallido!</h2>
            <p className="text-lg text-red-700 mb-6">Puntuación final: {score} puntos</p>
            
            <Button
              onClick={() => setGameState("menu")}
              className="bg-red-500 hover:bg-red-600"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Intentar de Nuevo
            </Button>
          </motion.div>
        </Card>
      </div>
    )
  }

  return null
} 