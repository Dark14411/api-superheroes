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
  ArrowUp, 
  ArrowDown,
  Target,
  Zap,
  X,
  Home,
  Trophy,
  Star,
  Sparkles
} from 'lucide-react'

interface Paddle {
  x: number
  y: number
  width: number
  height: number
  speed: number
  score: number
}

interface Ball {
  x: number
  y: number
  radius: number
  dx: number
  dy: number
  speed: number
}

interface GameState {
  playerPaddle: Paddle
  aiPaddle: Paddle
  ball: Ball
  isPlaying: boolean
  gameOver: boolean
  winner: 'player' | 'ai' | null
  level: number
  maxScore: number
  time: number
  powerUps: PowerUp[]
  gameStarted: boolean
}

interface PowerUp {
  id: string
  x: number
  y: number
  type: 'speed' | 'size' | 'multiBall'
  active: boolean
  collected: boolean
}

interface PongGameProps {
  onGameEnd: (score: number, rewards: any) => void
  onClose: () => void
}

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 400
const PADDLE_WIDTH = 15
const PADDLE_HEIGHT = 80
const BALL_RADIUS = 8
const INITIAL_BALL_SPEED = 4

export default function PongGame({ onGameEnd, onClose }: PongGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    playerPaddle: {
      x: 50,
      y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      speed: 8,
      score: 0
    },
    aiPaddle: {
      x: CANVAS_WIDTH - 50 - PADDLE_WIDTH,
      y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
      width: PADDLE_WIDTH,
      height: PADDLE_HEIGHT,
      speed: 6,
      score: 0
    },
    ball: {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      radius: BALL_RADIUS,
      dx: INITIAL_BALL_SPEED,
      dy: INITIAL_BALL_SPEED,
      speed: INITIAL_BALL_SPEED
    },
    isPlaying: false,
    gameOver: false,
    winner: null,
    level: 1,
    maxScore: 5,
    time: 0,
    powerUps: [],
    gameStarted: false
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<NodeJS.Timeout>()
  const timerRef = useRef<NodeJS.Timeout>()
  const keysPressed = useRef<Set<string>>(new Set())

  // 🎮 INICIALIZAR JUEGO
  const initializeGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      playerPaddle: {
        x: 50,
        y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        speed: 8,
        score: 0
      },
      aiPaddle: {
        x: CANVAS_WIDTH - 50 - PADDLE_WIDTH,
        y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        width: PADDLE_WIDTH,
        height: PADDLE_HEIGHT,
        speed: 6 + prev.level,
        score: 0
      },
      ball: {
        x: CANVAS_WIDTH / 2,
        y: CANVAS_HEIGHT / 2,
        radius: BALL_RADIUS,
        dx: INITIAL_BALL_SPEED + prev.level,
        dy: INITIAL_BALL_SPEED + prev.level,
        speed: INITIAL_BALL_SPEED + prev.level
      },
      isPlaying: false,
      gameOver: false,
      winner: null,
      time: 0,
      powerUps: [],
      gameStarted: false
    }))
    keysPressed.current.clear()
  }, [])

  // 🎮 INICIAR JUEGO
  const startGame = () => {
    setGameState(prev => ({ 
      ...prev, 
      isPlaying: true, 
      gameStarted: true,
      gameOver: false 
    }))
    toast.success('¡Pong iniciado! Usa las flechas para moverte')
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

  // 🎮 MANEJAR TECLAS MEJORADO
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (gameState.gameOver) return

    event.preventDefault()
    keysPressed.current.add(event.key)
    
    if (!gameState.gameStarted && !gameState.isPlaying) {
      setGameState(prev => ({ 
        ...prev, 
        isPlaying: true, 
        gameStarted: true 
      }))
    }
  }, [gameState.gameOver, gameState.gameStarted, gameState.isPlaying])

  const handleKeyUp = useCallback((event: KeyboardEvent) => {
    keysPressed.current.delete(event.key)
  }, [])

  // 🎮 ACTUALIZAR JUEGO MEJORADO
  const updateGame = useCallback(() => {
    setGameState(prev => {
      if (!prev.isPlaying || prev.gameOver) return prev

      // Mover pelota
      const newBall = { ...prev.ball }
      newBall.x += newBall.dx
      newBall.y += newBall.dy

      // Colisión con paredes superior e inferior
      if (newBall.y <= newBall.radius || newBall.y >= CANVAS_HEIGHT - newBall.radius) {
        newBall.dy = -newBall.dy
      }

      // Colisión con paletas
      const playerPaddle = prev.playerPaddle
      const aiPaddle = prev.aiPaddle

      // Colisión con paleta del jugador
      if (newBall.x <= playerPaddle.x + playerPaddle.width &&
          newBall.y >= playerPaddle.y &&
          newBall.y <= playerPaddle.y + playerPaddle.height &&
          newBall.dx < 0) {
        newBall.dx = -newBall.dx
        newBall.x = playerPaddle.x + playerPaddle.width + newBall.radius
        
        // Ajustar dirección basada en dónde golpea la paleta
        const hitPoint = (newBall.y - playerPaddle.y) / playerPaddle.height
        newBall.dy = (hitPoint - 0.5) * 2 * newBall.speed
      }

      // Colisión con paleta de la IA
      if (newBall.x >= aiPaddle.x - newBall.radius &&
          newBall.y >= aiPaddle.y &&
          newBall.y <= aiPaddle.y + aiPaddle.height &&
          newBall.dx > 0) {
        newBall.dx = -newBall.dx
        newBall.x = aiPaddle.x - newBall.radius
        
        // Ajustar dirección basada en dónde golpea la paleta
        const hitPoint = (newBall.y - aiPaddle.y) / aiPaddle.height
        newBall.dy = (hitPoint - 0.5) * 2 * newBall.speed
      }

      // Punto anotado
      let newPlayerScore = prev.playerPaddle.score
      let newAiScore = prev.aiPaddle.score
      let gameOver: boolean = prev.gameOver
      let winner: 'player' | 'ai' | null = prev.winner

      if (newBall.x <= 0) {
        newAiScore++
        if (newAiScore >= prev.maxScore) {
          gameOver = true
          winner = 'ai'
        } else {
          // Resetear pelota
          newBall.x = CANVAS_WIDTH / 2
          newBall.y = CANVAS_HEIGHT / 2
          newBall.dx = Math.random() > 0.5 ? newBall.speed : -newBall.speed
          newBall.dy = (Math.random() - 0.5) * newBall.speed
        }
      } else if (newBall.x >= CANVAS_WIDTH) {
        newPlayerScore++
        if (newPlayerScore >= prev.maxScore) {
          gameOver = true
          winner = 'player'
        } else {
          // Resetear pelota
          newBall.x = CANVAS_WIDTH / 2
          newBall.y = CANVAS_HEIGHT / 2
          newBall.dx = Math.random() > 0.5 ? newBall.speed : -newBall.speed
          newBall.dy = (Math.random() - 0.5) * newBall.speed
        }
      }

      // IA mejorada
      const newAiPaddle = { ...prev.aiPaddle }
      const aiCenter = newAiPaddle.y + newAiPaddle.height / 2
      const ballCenter = newBall.y

      if (aiCenter < ballCenter - 10) {
        newAiPaddle.y = Math.min(CANVAS_HEIGHT - newAiPaddle.height, newAiPaddle.y + newAiPaddle.speed)
      } else if (aiCenter > ballCenter + 10) {
        newAiPaddle.y = Math.max(0, newAiPaddle.y - newAiPaddle.speed)
      }

      // Mover paleta del jugador basado en teclas presionadas
      const newPlayerPaddle = { ...prev.playerPaddle }
      if (keysPressed.current.has('ArrowUp') || keysPressed.current.has('w') || keysPressed.current.has('W')) {
        newPlayerPaddle.y = Math.max(0, newPlayerPaddle.y - newPlayerPaddle.speed)
      }
      if (keysPressed.current.has('ArrowDown') || keysPressed.current.has('s') || keysPressed.current.has('S')) {
        newPlayerPaddle.y = Math.min(CANVAS_HEIGHT - newPlayerPaddle.height, newPlayerPaddle.y + newPlayerPaddle.speed)
      }

      return {
        ...prev,
        ball: newBall,
        playerPaddle: { ...newPlayerPaddle, score: newPlayerScore },
        aiPaddle: newAiPaddle,
        gameOver,
        winner
      }
    })
  }, [])

  // 🎮 DIBUJAR JUEGO
  const drawGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Limpiar canvas
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Dibujar línea central
    ctx.strokeStyle = '#475569'
    ctx.setLineDash([10, 10])
    ctx.beginPath()
    ctx.moveTo(CANVAS_WIDTH / 2, 0)
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT)
    ctx.stroke()
    ctx.setLineDash([])

    // Dibujar paleta del jugador
    ctx.fillStyle = '#3b82f6'
    ctx.fillRect(
      gameState.playerPaddle.x,
      gameState.playerPaddle.y,
      gameState.playerPaddle.width,
      gameState.playerPaddle.height
    )

    // Dibujar paleta de la IA
    ctx.fillStyle = '#ef4444'
    ctx.fillRect(
      gameState.aiPaddle.x,
      gameState.aiPaddle.y,
      gameState.aiPaddle.width,
      gameState.aiPaddle.height
    )

    // Dibujar pelota
    ctx.fillStyle = '#fbbf24'
    ctx.beginPath()
    ctx.arc(gameState.ball.x, gameState.ball.y, gameState.ball.radius, 0, 2 * Math.PI)
    ctx.fill()

    // Efecto de brillo en la pelota
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(gameState.ball.x - 2, gameState.ball.y - 2, 2, 0, 2 * Math.PI)
    ctx.fill()

    // Dibujar puntuaciones
    ctx.fillStyle = '#ffffff'
    ctx.font = 'bold 48px Arial'
    ctx.textAlign = 'center'
    ctx.fillText(gameState.playerPaddle.score.toString(), CANVAS_WIDTH / 4, 60)
    ctx.fillText(gameState.aiPaddle.score.toString(), (CANVAS_WIDTH / 4) * 3, 60)

    // Dibujar nivel
    ctx.font = 'bold 24px Arial'
    ctx.fillText(`Nivel ${gameState.level}`, CANVAS_WIDTH / 2, 30)
  }, [gameState])

  // 🎮 CALCULAR PUNTUACIÓN
  const calculateScore = (playerScore: number, aiScore: number, time: number, level: number) => {
    const baseScore = playerScore * 50
    const timeBonus = Math.max(0, 300 - time) * 2
    const levelBonus = level * 25
    return baseScore + timeBonus + levelBonus
  }

  // 🎮 TERMINAR JUEGO
  const endGame = () => {
    const score = calculateScore(
      gameState.playerPaddle.score,
      gameState.aiPaddle.score,
      gameState.time,
      gameState.level
    )
    
    const rewards = {
      coins: Math.floor(score / 30),
      experience: score,
      happiness: Math.min(35, Math.floor(score / 15))
    }
    
    onGameEnd(score, rewards)
  }

  // 🎮 GAME LOOP
  useEffect(() => {
    if (gameState.isPlaying && !gameState.gameOver) {
      gameLoopRef.current = setInterval(() => {
        updateGame()
      }, 1000 / 60) // 60 FPS
    }

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current)
      }
    }
  }, [gameState.isPlaying, gameState.gameOver, updateGame])

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

  // 🎮 EVENT LISTENERS
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [handleKeyDown, handleKeyUp])

  // 🎮 DRAW LOOP
  useEffect(() => {
    const drawInterval = setInterval(drawGame, 1000 / 60)
    return () => clearInterval(drawInterval)
  }, [drawGame])

  // 🎮 GAME OVER EFFECT
  useEffect(() => {
    if (gameState.gameOver) {
      if (gameState.winner === 'player') {
        toast.success(`¡Victoria! Ganaste ${gameState.playerPaddle.score} a ${gameState.aiPaddle.score}`)
      } else {
        toast.error(`¡Derrota! Perdiste ${gameState.playerPaddle.score} a ${gameState.aiPaddle.score}`)
      }
      endGame()
    }
  }, [gameState.gameOver, gameState.winner, gameState.playerPaddle.score, gameState.aiPaddle.score])

  // 🎮 FORMATO DE TIEMPO
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-5xl bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 text-white border-0 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <span className="text-4xl">🏓</span>
              Pong Épico
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">{gameState.playerPaddle.score}</div>
              <div className="text-sm opacity-80">Tu Puntuación</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-red-400">{gameState.aiPaddle.score}</div>
              <div className="text-sm opacity-80">IA Puntuación</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-400">{formatTime(gameState.time)}</div>
              <div className="text-sm opacity-80">Tiempo</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-400">{gameState.level}</div>
              <div className="text-sm opacity-80">Nivel</div>
            </div>
          </div>

          {/* 🎮 CANVAS DEL JUEGO */}
          <div className="flex justify-center">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                className="border-4 border-blue-500 rounded-lg shadow-2xl"
              />
              
              {/* 🎮 CONTROLES SUPERPUESTOS */}
              {!gameState.gameStarted && !gameState.gameOver && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl mb-4">🎮</div>
                    <div className="text-xl font-bold mb-2">Presiona JUGAR para comenzar</div>
                    <div className="text-sm opacity-80">Usa las flechas para moverte</div>
                  </div>
                </div>
              )}

              {gameState.gameOver && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg">
                  <div className="text-center">
                    <div className={`text-6xl mb-4 ${gameState.winner === 'player' ? 'text-green-400' : 'text-red-400'}`}>
                      {gameState.winner === 'player' ? '🏆' : '💀'}
                    </div>
                    <div className="text-2xl font-bold mb-2">
                      {gameState.winner === 'player' ? '¡VICTORIA!' : '¡DERROTA!'}
                    </div>
                    <div className="text-lg mb-4">
                      {gameState.playerPaddle.score} - {gameState.aiPaddle.score}
                    </div>
                    <Button onClick={resetGame} className="bg-blue-500 hover:bg-blue-600">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Jugar de nuevo
                    </Button>
                  </div>
                </div>
              )}
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
              <div className="text-sm font-semibold mb-1">Velocidad</div>
              <Progress 
                value={(gameState.ball.speed / (INITIAL_BALL_SPEED + 5)) * 100} 
                className="h-2 bg-white/20"
              />
            </div>
          </div>

          {/* 🎮 INSTRUCCIONES */}
          <div className="bg-black/30 rounded-lg p-4">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Instrucciones
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-semibold mb-1">Controles:</div>
                <div className="space-y-1 opacity-80">
                  <div>• Flechas arriba/abajo para mover</div>
                  <div>• WASD también funciona</div>
                  <div>• Evita que la pelota pase</div>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-1">Objetivo:</div>
                <div className="space-y-1 opacity-80">
                  <div>• Llega a {gameState.maxScore} puntos</div>
                  <div>• La IA se vuelve más difícil</div>
                  <div>• ¡Reflejos rápidos!</div>
                </div>
              </div>
            </div>
          </div>

          {/* 🎮 PROGRESO */}
          <div className="bg-black/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Progreso del Juego</span>
              <span className="text-sm opacity-80">
                {Math.max(gameState.playerPaddle.score, gameState.aiPaddle.score)}/{gameState.maxScore} puntos
              </span>
            </div>
            <Progress 
              value={(Math.max(gameState.playerPaddle.score, gameState.aiPaddle.score) / gameState.maxScore) * 100} 
              className="h-3 bg-white/20"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 