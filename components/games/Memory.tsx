'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Brain,
  Target,
  Zap,
  X,
  Home,
  Clock,
  Star,
  Trophy,
  Sparkles
} from 'lucide-react'

interface Card {
  id: number
  emoji: string
  isFlipped: boolean
  isMatched: boolean
  isSelected: boolean
}

interface GameState {
  cards: Card[]
  flippedCards: number[]
  matchedPairs: number
  moves: number
  time: number
  isPlaying: boolean
  gameOver: boolean
  score: number
  level: number
  bestTime: number
  bestMoves: number
  gameStarted: boolean
}

interface MemoryGameProps {
  onGameEnd: (score: number, rewards: any) => void
  onClose: () => void
}

const EMOJIS = ['🐾', '🌟', '🎮', '🏆', '💎', '🎯', '⚡', '🎨', '🌈', '🎪', '🎭', '🎪']
const GRID_SIZES = {
  1: { rows: 4, cols: 3, pairs: 6 },
  2: { rows: 4, cols: 4, pairs: 8 },
  3: { rows: 5, cols: 4, pairs: 10 }
}

export default function MemoryGame({ onGameEnd, onClose }: MemoryGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    time: 0,
    isPlaying: false,
    gameOver: false,
    score: 0,
    level: 1,
    bestTime: 0,
    bestMoves: 0,
    gameStarted: false
  })

  const timerRef = useRef<NodeJS.Timeout>()
  const matchTimeoutRef = useRef<NodeJS.Timeout>()

  // 🎮 INICIALIZAR JUEGO
  const initializeGame = useCallback(() => {
    const { pairs } = GRID_SIZES[gameState.level as keyof typeof GRID_SIZES]
    const selectedEmojis = EMOJIS.slice(0, pairs)
    const cardPairs = [...selectedEmojis, ...selectedEmojis]
    
    // Mezclar las cartas
    const shuffledCards = cardPairs
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
        isSelected: false
      }))
      .sort(() => Math.random() - 0.5)

    setGameState(prev => ({
      ...prev,
      cards: shuffledCards,
      flippedCards: [],
      matchedPairs: 0,
      moves: 0,
      time: 0,
      isPlaying: false,
      gameOver: false,
      score: 0,
      gameStarted: false
    }))
  }, [gameState.level])

  // 🎮 INICIAR JUEGO
  const startGame = () => {
    setGameState(prev => ({ 
      ...prev, 
      isPlaying: true, 
      gameStarted: true,
      gameOver: false 
    }))
    toast.success('¡Memorama iniciado! Encuentra las parejas')
  }

  // 🎮 PAUSAR JUEGO
  const pauseGame = () => {
    setGameState(prev => ({ ...prev, isPlaying: false }))
  }

  // 🎮 REINICIAR JUEGO
  const resetGame = () => {
    initializeGame()
    toast.info('Juego reiniciado')
  }

  // 🎮 MANEJAR CLICK EN CARTA MEJORADO
  const handleCardClick = useCallback((cardId: number) => {
    if (!gameState.isPlaying || gameState.gameOver) return

    setGameState(prev => {
      const card = prev.cards.find(c => c.id === cardId)
      if (!card || card.isFlipped || card.isMatched || prev.flippedCards.length >= 2) {
        return prev
      }

      const newCards = prev.cards.map(c => 
        c.id === cardId ? { ...c, isFlipped: true, isSelected: true } : c
      )

      const newFlippedCards = [...prev.flippedCards, cardId]

      // Si es la segunda carta volteada
      if (newFlippedCards.length === 2) {
        const [firstId, secondId] = newFlippedCards
        const firstCard = newCards.find(c => c.id === firstId)
        const secondCard = newCards.find(c => c.id === secondId)

        if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
          // Pareja encontrada
          const updatedCards = newCards.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true, isSelected: false }
              : c
          )

          const newMatchedPairs = prev.matchedPairs + 1
          const newMoves = prev.moves + 1
          const newScore = prev.score + 20

          // Verificar si el juego terminó
          const { pairs } = GRID_SIZES[prev.level as keyof typeof GRID_SIZES]
          if (newMatchedPairs === pairs) {
            const finalScore = calculateScore(newMoves, prev.time, prev.level)
            return {
              ...prev,
              cards: updatedCards,
              flippedCards: [],
              matchedPairs: newMatchedPairs,
              moves: newMoves,
              score: finalScore,
              gameOver: true,
              isPlaying: false
            }
          }

          return {
            ...prev,
            cards: updatedCards,
            flippedCards: [],
            matchedPairs: newMatchedPairs,
            moves: newMoves,
            score: newScore
          }
        } else {
          // No es pareja, voltear de vuelta después de un delay
          if (matchTimeoutRef.current) {
            clearTimeout(matchTimeoutRef.current)
          }
          
          matchTimeoutRef.current = setTimeout(() => {
            setGameState(current => ({
              ...current,
              cards: current.cards.map(c => 
                c.id === firstId || c.id === secondId 
                  ? { ...c, isFlipped: false, isSelected: false }
                  : c
              ),
              flippedCards: [],
              moves: current.moves + 1
            }))
          }, 1000)

          return {
            ...prev,
            cards: newCards,
            flippedCards: newFlippedCards,
            moves: prev.moves + 1
          }
        }
      }

      return {
        ...prev,
        cards: newCards,
        flippedCards: newFlippedCards
      }
    })
  }, [gameState.isPlaying, gameState.gameOver])

  // 🎮 CALCULAR PUNTUACIÓN
  const calculateScore = (moves: number, time: number, level: number) => {
    const baseScore = 100 * level
    const movePenalty = moves * 2
    const timeBonus = Math.max(0, 60 - time) * 2
    return Math.max(0, baseScore - movePenalty + timeBonus)
  }

  // 🎮 TERMINAR JUEGO
  const endGame = () => {
    const rewards = {
      coins: Math.floor(gameState.score / 20),
      experience: gameState.score,
      happiness: Math.min(30, Math.floor(gameState.score / 10))
    }
    
    onGameEnd(gameState.score, rewards)
  }

  // 🎮 TIMER
  useEffect(() => {
    if (gameState.isPlaying && !gameState.gameOver) {
      timerRef.current = setInterval(() => {
        setGameState(prev => ({ ...prev, time: prev.time + 1 }))
      }, 1000)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [gameState.isPlaying, gameState.gameOver])

  // 🎮 GAME OVER EFFECT
  useEffect(() => {
    if (gameState.gameOver) {
      const { pairs } = GRID_SIZES[gameState.level as keyof typeof GRID_SIZES]
      if (gameState.matchedPairs === pairs) {
        toast.success(`¡Felicidades! Completaste el nivel ${gameState.level} en ${gameState.time}s`)
        endGame()
      }
    }
  }, [gameState.gameOver, gameState.matchedPairs, gameState.level, gameState.time])

  // 🎮 INICIALIZAR AL MOUNT
  useEffect(() => {
    initializeGame()
  }, [initializeGame])

  // 🎮 CLEANUP TIMEOUTS
  useEffect(() => {
    return () => {
      if (matchTimeoutRef.current) {
        clearTimeout(matchTimeoutRef.current)
      }
    }
  }, [])

  // 🎮 FORMATO DE TIEMPO
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // 🎮 OBTENER TAMAÑO DE GRID
  const getGridSize = () => {
    const { rows, cols } = GRID_SIZES[gameState.level as keyof typeof GRID_SIZES]
    return { rows, cols }
  }

  const { rows, cols } = getGridSize()

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-6xl bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white border-0 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <span className="text-4xl">🧠</span>
              Memorama Épico
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* 🎮 ESTADÍSTICAS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">{gameState.moves}</div>
              <div className="text-sm opacity-80">Movimientos</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-green-400">{formatTime(gameState.time)}</div>
              <div className="text-sm opacity-80">Tiempo</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-400">{gameState.matchedPairs}</div>
              <div className="text-sm opacity-80">Parejas</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-400">{gameState.level}</div>
              <div className="text-sm opacity-80">Nivel</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-pink-400">{gameState.score}</div>
              <div className="text-sm opacity-80">Puntuación</div>
            </div>
          </div>

          {/* 🎮 PROGRESO */}
          <div className="bg-black/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Progreso</span>
              <span className="text-sm opacity-80">
                {gameState.matchedPairs}/{GRID_SIZES[gameState.level as keyof typeof GRID_SIZES].pairs} parejas
              </span>
            </div>
            <Progress 
              value={(gameState.matchedPairs / GRID_SIZES[gameState.level as keyof typeof GRID_SIZES].pairs) * 100} 
              className="h-3 bg-white/20"
            />
          </div>

          {/* 🎮 GRID DE CARTAS */}
          <div className="flex justify-center">
            <div 
              className="grid gap-2 p-4 bg-black/20 rounded-lg"
              style={{
                gridTemplateColumns: `repeat(${cols}, 1fr)`,
                gridTemplateRows: `repeat(${rows}, 1fr)`
              }}
            >
              {gameState.cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  disabled={!gameState.isPlaying || card.isMatched}
                  className={`
                    w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24
                    rounded-lg border-2 font-bold text-2xl md:text-3xl lg:text-4xl
                    transition-all duration-300 transform hover:scale-105
                    ${card.isFlipped || card.isMatched
                      ? 'bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400 shadow-lg'
                      : 'bg-gradient-to-br from-gray-600 to-gray-800 border-gray-500 hover:border-gray-400'
                    }
                    ${card.isMatched 
                      ? 'animate-pulse bg-gradient-to-br from-green-500 to-emerald-600 border-green-400' 
                      : ''
                    }
                    ${card.isSelected 
                      ? 'ring-4 ring-yellow-400 ring-opacity-50' 
                      : ''
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {card.isFlipped || card.isMatched ? card.emoji : '❓'}
                </button>
              ))}
            </div>
          </div>

          {/* 🎮 CONTROLES */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={gameState.isPlaying ? pauseGame : startGame}
              disabled={gameState.gameOver}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold"
            >
              {gameState.isPlaying ? (
                <>
                  <Pause className="w-4 h-4" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  Jugar
                </>
              )}
            </Button>

            <Button
              onClick={resetGame}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold"
            >
              <RotateCcw className="w-4 h-4" />
              Reiniciar
            </Button>

            <Button
              onClick={onClose}
              className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-bold"
            >
              <Home className="w-4 h-4" />
              Salir
            </Button>

            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-sm font-semibold mb-1">Nivel {gameState.level}</div>
              <div className="text-xs opacity-80">{rows}x{cols} Grid</div>
            </div>
          </div>

          {/* 🎮 INSTRUCCIONES */}
          <div className="bg-black/30 rounded-lg p-4">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Instrucciones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold mb-1">Objetivo:</div>
                <div className="space-y-1 opacity-80">
                  <div>• Encuentra todas las parejas</div>
                  <div>• Menos movimientos = más puntos</div>
                  <div>• Tiempo rápido = bonus extra</div>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-1">Consejos:</div>
                <div className="space-y-1 opacity-80">
                  <div>• Memoriza las posiciones</div>
                  <div>• Planifica tus movimientos</div>
                  <div>• ¡Concentración es clave!</div>
                </div>
              </div>
            </div>
          </div>

          {/* 🎮 GAME OVER OVERLAY */}
          {gameState.gameOver && gameState.matchedPairs === GRID_SIZES[gameState.level as keyof typeof GRID_SIZES].pairs && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
              <div className="text-center bg-gradient-to-br from-green-600 to-emerald-700 p-8 rounded-2xl shadow-2xl">
                <div className="text-6xl mb-4">🎉</div>
                <div className="text-3xl font-bold mb-2">¡NIVEL COMPLETADO!</div>
                <div className="text-lg mb-4">
                  Tiempo: {formatTime(gameState.time)} | Movimientos: {gameState.moves}
                </div>
                <div className="text-2xl font-bold text-yellow-400 mb-4">
                  Puntuación: {gameState.score}
                </div>
                <div className="flex gap-2 justify-center">
                  <Button onClick={resetGame} className="bg-blue-500 hover:bg-blue-600">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Jugar de nuevo
                  </Button>
                  <Button onClick={onClose} className="bg-green-500 hover:bg-green-600">
                    <Home className="w-4 h-4 mr-2" />
                    Salir
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 🎮 PAUSA OVERLAY */}
          {!gameState.isPlaying && !gameState.gameOver && gameState.gameStarted && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="text-4xl mb-4">⏸️</div>
                <div className="text-xl font-bold mb-2">Juego Pausado</div>
                <div className="text-sm opacity-80">Presiona JUGAR para continuar</div>
              </div>
            </div>
          )}

          {/* 🎮 INICIO OVERLAY */}
          {!gameState.gameStarted && !gameState.gameOver && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="text-4xl mb-4">🎮</div>
                <div className="text-xl font-bold mb-2">Presiona JUGAR para comenzar</div>
                <div className="text-sm opacity-80">Encuentra las parejas de emojis</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 