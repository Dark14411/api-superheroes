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
  Sparkles,
  Volume2,
  VolumeX
} from 'lucide-react'

interface ButtonState {
  id: number
  color: string
  isActive: boolean
  isPressed: boolean
}

interface GameState {
  buttons: ButtonState[]
  sequence: number[]
  playerSequence: number[]
  currentIndex: number
  isPlaying: boolean
  isShowingSequence: boolean
  gameOver: boolean
  score: number
  level: number
  lives: number
  bestScore: number
  gameStarted: boolean
  soundEnabled: boolean
}

interface SimonGameProps {
  onGameEnd: (score: number, rewards: any) => void
  onClose: () => void
}

const BUTTONS = [
  { id: 0, color: '#ef4444', name: 'Red' },
  { id: 1, color: '#22c55e', name: 'Green' },
  { id: 2, color: '#3b82f6', name: 'Blue' },
  { id: 3, color: '#fbbf24', name: 'Yellow' }
]

const SEQUENCE_SPEED = 800
const BUTTON_ACTIVE_TIME = 300

export default function SimonGame({ onGameEnd, onClose }: SimonGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    buttons: BUTTONS.map(btn => ({
      id: btn.id,
      color: btn.color,
      isActive: false,
      isPressed: false
    })),
    sequence: [],
    playerSequence: [],
    currentIndex: 0,
    isPlaying: false,
    isShowingSequence: false,
    gameOver: false,
    score: 0,
    level: 1,
    lives: 3,
    bestScore: 0,
    gameStarted: false,
    soundEnabled: true
  })

  const sequenceTimeoutRef = useRef<NodeJS.Timeout>()
  const buttonTimeoutRef = useRef<NodeJS.Timeout>()
  const gameLoopRef = useRef<NodeJS.Timeout>()

  // 🎮 INICIALIZAR JUEGO
  const initializeGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      buttons: BUTTONS.map(btn => ({
        id: btn.id,
        color: btn.color,
        isActive: false,
        isPressed: false
      })),
      sequence: [],
      playerSequence: [],
      currentIndex: 0,
      isPlaying: false,
      isShowingSequence: false,
      gameOver: false,
      score: 0,
      level: 1,
      lives: 3,
      gameStarted: false
    }))
  }, [])

  // 🎮 INICIAR JUEGO
  const startGame = () => {
    setGameState(prev => ({ 
      ...prev, 
      isPlaying: true, 
      gameStarted: true,
      gameOver: false 
    }))
    generateNewSequence()
    toast.success('¡Simon Dice iniciado! Repite la secuencia')
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

  // 🎮 GENERAR NUEVA SECUENCIA
  const generateNewSequence = useCallback(() => {
    const newSequence: number[] = []
    for (let i = 0; i < gameState.level + 2; i++) {
      newSequence.push(Math.floor(Math.random() * 4))
    }

    setGameState(prev => ({
      ...prev,
      sequence: newSequence,
      playerSequence: [],
      currentIndex: 0,
      isShowingSequence: true
    }))

    showSequence(newSequence, 0)
  }, [gameState.level])

  // 🎮 MOSTRAR SECUENCIA
  const showSequence = useCallback((sequence: number[], index: number) => {
    if (index >= sequence.length) {
      setGameState(prev => ({ ...prev, isShowingSequence: false }))
      return
    }

    const buttonId = sequence[index]
    
    // Activar botón
    setGameState(prev => ({
      ...prev,
      buttons: prev.buttons.map(btn => 
        btn.id === buttonId 
          ? { ...btn, isActive: true }
          : btn
      )
    }))

    // Desactivar botón después de un tiempo
    buttonTimeoutRef.current = setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        buttons: prev.buttons.map(btn => ({ ...btn, isActive: false }))
      }))

      // Mostrar siguiente botón
      sequenceTimeoutRef.current = setTimeout(() => {
        showSequence(sequence, index + 1)
      }, 200)
    }, BUTTON_ACTIVE_TIME)
  }, [])

  // 🎮 MANEJAR CLICK EN BOTÓN MEJORADO
  const handleButtonClick = useCallback((buttonId: number) => {
    if (!gameState.isPlaying || gameState.isShowingSequence || gameState.gameOver) return

    // Activar botón visualmente
    setGameState(prev => ({
      ...prev,
      buttons: prev.buttons.map(btn => 
        btn.id === buttonId 
          ? { ...btn, isPressed: true }
          : btn
      )
    }))

    // Desactivar botón después de un tiempo
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        buttons: prev.buttons.map(btn => ({ ...btn, isPressed: false }))
      }))
    }, BUTTON_ACTIVE_TIME)

    // Verificar si es correcto
    const expectedButton = gameState.sequence[gameState.currentIndex]
    
    if (buttonId === expectedButton) {
      // Correcto
      setGameState(prev => ({
        ...prev,
        playerSequence: [...prev.playerSequence, buttonId],
        currentIndex: prev.currentIndex + 1
      }))

      // Verificar si completó la secuencia
      if (gameState.currentIndex + 1 >= gameState.sequence.length) {
        // Secuencia completada
        const newScore = gameState.score + (gameState.level * 10)
        const newLevel = gameState.level + 1
        
        setGameState(prev => ({
          ...prev,
          score: newScore,
          level: newLevel,
          bestScore: Math.max(prev.bestScore, newScore)
        }))

        toast.success(`¡Nivel ${gameState.level} completado! +${gameState.level * 10} puntos`)
        
        // Generar nueva secuencia
        setTimeout(() => {
          generateNewSequence()
        }, 1000)
      }
    } else {
      // Incorrecto
      const newLives = gameState.lives - 1
      
      setGameState(prev => ({
        ...prev,
        lives: newLives,
        gameOver: newLives <= 0
      }))

      if (newLives > 0) {
        toast.error(`¡Incorrecto! Te quedan ${newLives} vidas`)
        // Reintentar la secuencia actual
        setTimeout(() => {
          setGameState(prev => ({
            ...prev,
            playerSequence: [],
            currentIndex: 0,
            isShowingSequence: true
          }))
          showSequence(gameState.sequence, 0)
        }, 1000)
      } else {
        toast.error('¡Game Over! Se acabaron las vidas')
      }
    }
  }, [gameState.isPlaying, gameState.isShowingSequence, gameState.gameOver, gameState.sequence, gameState.currentIndex, gameState.score, gameState.level, gameState.lives, generateNewSequence, showSequence])

  // 🎮 CALCULAR PUNTUACIÓN
  const calculateScore = (score: number, level: number) => {
    return score + (level * 50)
  }

  // 🎮 TERMINAR JUEGO
  const endGame = () => {
    const finalScore = calculateScore(gameState.score, gameState.level)
    
    const rewards = {
      coins: Math.floor(finalScore / 25),
      experience: finalScore,
      happiness: Math.min(40, Math.floor(finalScore / 20))
    }
    
    onGameEnd(finalScore, rewards)
  }

  // 🎮 TOGGLE SONIDO
  const toggleSound = () => {
    setGameState(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }))
  }

  // 🎮 GAME OVER EFFECT
  useEffect(() => {
    if (gameState.gameOver) {
      toast.error(`¡Game Over! Puntuación final: ${gameState.score}`)
      endGame()
    }
  }, [gameState.gameOver, gameState.score])

  // 🎮 CLEANUP TIMEOUTS
  useEffect(() => {
    return () => {
      if (sequenceTimeoutRef.current) {
        clearTimeout(sequenceTimeoutRef.current)
      }
      if (buttonTimeoutRef.current) {
        clearTimeout(buttonTimeoutRef.current)
      }
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl bg-gradient-to-br from-purple-900 via-pink-800 to-red-900 text-white border-0 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <span className="text-4xl">🎯</span>
              Simon Dice Épico
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
              <div className="text-2xl font-bold text-purple-400">{gameState.score}</div>
              <div className="text-sm opacity-80">Puntuación</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-pink-400">{gameState.level}</div>
              <div className="text-sm opacity-80">Nivel</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-400">{gameState.lives}</div>
              <div className="text-sm opacity-80">Vidas</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-400">{gameState.bestScore}</div>
              <div className="text-sm opacity-80">Mejor</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">{gameState.sequence.length}</div>
              <div className="text-sm opacity-80">Secuencia</div>
            </div>
          </div>

          {/* 🎮 SIMON CIRCULAR */}
          <div className="flex justify-center">
            <div className="relative w-80 h-80">
              {/* Botón Rojo (Superior) */}
              <button
                onClick={() => handleButtonClick(0)}
                disabled={!gameState.isPlaying || gameState.isShowingSequence || gameState.gameOver}
                className={`
                  absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                  w-32 h-32 rounded-full border-4 border-red-600
                  transition-all duration-200 transform hover:scale-105
                  ${gameState.buttons[0].isActive || gameState.buttons[0].isPressed
                    ? 'bg-red-500 shadow-lg shadow-red-500/50 scale-110'
                    : 'bg-red-700 hover:bg-red-600'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />

              {/* Botón Verde (Derecha) */}
              <button
                onClick={() => handleButtonClick(1)}
                disabled={!gameState.isPlaying || gameState.isShowingSequence || gameState.gameOver}
                className={`
                  absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2
                  w-32 h-32 rounded-full border-4 border-green-600
                  transition-all duration-200 transform hover:scale-105
                  ${gameState.buttons[1].isActive || gameState.buttons[1].isPressed
                    ? 'bg-green-500 shadow-lg shadow-green-500/50 scale-110'
                    : 'bg-green-700 hover:bg-green-600'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />

              {/* Botón Azul (Inferior) */}
              <button
                onClick={() => handleButtonClick(2)}
                disabled={!gameState.isPlaying || gameState.isShowingSequence || gameState.gameOver}
                className={`
                  absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2
                  w-32 h-32 rounded-full border-4 border-blue-600
                  transition-all duration-200 transform hover:scale-105
                  ${gameState.buttons[2].isActive || gameState.buttons[2].isPressed
                    ? 'bg-blue-500 shadow-lg shadow-blue-500/50 scale-110'
                    : 'bg-blue-700 hover:bg-blue-600'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />

              {/* Botón Amarillo (Izquierda) */}
              <button
                onClick={() => handleButtonClick(3)}
                disabled={!gameState.isPlaying || gameState.isShowingSequence || gameState.gameOver}
                className={`
                  absolute top-1/2 left-0 transform -translate-x-1/2 -translate-y-1/2
                  w-32 h-32 rounded-full border-4 border-yellow-600
                  transition-all duration-200 transform hover:scale-105
                  ${gameState.buttons[3].isActive || gameState.buttons[3].isPressed
                    ? 'bg-yellow-500 shadow-lg shadow-yellow-500/50 scale-110'
                    : 'bg-yellow-700 hover:bg-yellow-600'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              />

              {/* Centro */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-black/50 rounded-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold">{gameState.level}</div>
                  <div className="text-xs opacity-80">Nivel</div>
                </div>
              </div>

              {/* 🎮 OVERLAY DE ESTADO */}
              {gameState.isShowingSequence && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">👁️</div>
                    <div className="text-lg font-bold">Observa</div>
                  </div>
                </div>
              )}

              {!gameState.isPlaying && !gameState.gameOver && gameState.gameStarted && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">⏸️</div>
                    <div className="text-lg font-bold">Pausado</div>
                  </div>
                </div>
              )}

              {gameState.gameOver && (
                <div className="absolute inset-0 bg-black/70 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">💀</div>
                    <div className="text-lg font-bold">Game Over</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 🎮 CONTROLES */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <Button
              onClick={gameState.isPlaying ? pauseGame : startGame}
              disabled={gameState.gameOver}
              className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white font-bold"
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

            <Button
              onClick={toggleSound}
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold"
            >
              {gameState.soundEnabled ? (
                <>
                  <Volume2 className="w-4 h-4" />
                  Sonido
                </>
              ) : (
                <>
                  <VolumeX className="w-4 h-4" />
                  Mudo
                </>
              )}
            </Button>

            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-sm font-semibold mb-1">Progreso</div>
              <Progress 
                value={(gameState.currentIndex / Math.max(1, gameState.sequence.length)) * 100} 
                className="h-2 bg-white/20"
              />
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
                  <div>• Repite la secuencia mostrada</div>
                  <div>• La secuencia se hace más larga</div>
                  <div>• ¡Memoria y reflejos!</div>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-1">Controles:</div>
                <div className="space-y-1 opacity-80">
                  <div>• Haz clic en los botones</div>
                  <div>• Observa la secuencia primero</div>
                  <div>• ¡No te equivoques!</div>
                </div>
              </div>
            </div>
          </div>

          {/* 🎮 INICIO OVERLAY */}
          {!gameState.gameStarted && !gameState.gameOver && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
              <div className="text-center">
                <div className="text-4xl mb-4">🎮</div>
                <div className="text-xl font-bold mb-2">Presiona JUGAR para comenzar</div>
                <div className="text-sm opacity-80">Repite la secuencia de colores</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 