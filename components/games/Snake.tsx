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
  ArrowLeft, 
  ArrowRight,
  Trophy,
  Target,
  Zap,
  X,
  Home
} from 'lucide-react'

interface Position {
  x: number
  y: number
}

interface GameState {
  snake: Position[]
  food: Position
  direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
  isPlaying: boolean
  score: number
  highScore: number
  gameOver: boolean
  level: number
  speed: number
  gameStarted: boolean
}

interface SnakeGameProps {
  onGameEnd: (score: number, rewards: any) => void
  onClose: () => void
}

const GRID_SIZE = 20
const INITIAL_SPEED = 200

export default function SnakeGame({ onGameEnd, onClose }: SnakeGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    direction: 'RIGHT',
    isPlaying: false,
    score: 0,
    highScore: 0,
    gameOver: false,
    level: 1,
    speed: INITIAL_SPEED,
    gameStarted: false
  })

  const gameLoopRef = useRef<NodeJS.Timeout>()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const lastDirectionRef = useRef<string>('RIGHT')

  // 🎮 INICIALIZAR JUEGO
  const initializeGame = useCallback(() => {
    const newSnake = [{ x: 10, y: 10 }]
    const newFood = generateFood(newSnake)
    
    setGameState(prev => ({
      ...prev,
      snake: newSnake,
      food: newFood,
      direction: 'RIGHT',
      isPlaying: false,
      score: 0,
      gameOver: false,
      level: 1,
      speed: INITIAL_SPEED,
      gameStarted: false
    }))
    lastDirectionRef.current = 'RIGHT'
  }, [])

  // 🎮 GENERAR COMIDA
  const generateFood = useCallback((snake: Position[]): Position => {
    let newFood: Position
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      }
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y))
    
    return newFood
  }, [])

  // 🎮 MOVER SERPIENTE
  const moveSnake = useCallback(() => {
    setGameState(prev => {
      if (!prev.isPlaying || prev.gameOver) return prev

      const newSnake = [...prev.snake]
      const head = { ...newSnake[0] }

      // Calcular nueva posición de la cabeza
      switch (prev.direction) {
        case 'UP':
          head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE
          break
        case 'DOWN':
          head.y = (head.y + 1) % GRID_SIZE
          break
        case 'LEFT':
          head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE
          break
        case 'RIGHT':
          head.x = (head.x + 1) % GRID_SIZE
          break
      }

      // Verificar colisión con el cuerpo (excluyendo la cabeza)
      if (newSnake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)) {
        return { ...prev, gameOver: true, isPlaying: false }
      }

      newSnake.unshift(head)

      // Verificar si come la comida
      if (head.x === prev.food.x && head.y === prev.food.y) {
        const newFood = generateFood(newSnake)
        const newScore = prev.score + 10
        const newLevel = Math.floor(newScore / 50) + 1
        const newSpeed = Math.max(50, INITIAL_SPEED - (newLevel - 1) * 15)

        return {
          ...prev,
          snake: newSnake,
          food: newFood,
          score: newScore,
          level: newLevel,
          speed: newSpeed,
          highScore: Math.max(prev.highScore, newScore)
        }
      } else {
        newSnake.pop()
        return { ...prev, snake: newSnake }
      }
    })
  }, [generateFood])

  // 🎮 MANEJAR TECLAS MEJORADO
  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (gameState.gameOver) return

    event.preventDefault()
    
    setGameState(prev => {
      if (!prev.gameStarted && !prev.isPlaying) {
        // Iniciar juego con primera tecla
        return { ...prev, isPlaying: true, gameStarted: true }
      }

      let newDirection = prev.direction
      
      switch (event.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (lastDirectionRef.current !== 'DOWN') {
            newDirection = 'UP'
            lastDirectionRef.current = 'UP'
          }
          break
        case 'ArrowDown':
        case 's':
        case 'S':
          if (lastDirectionRef.current !== 'UP') {
            newDirection = 'DOWN'
            lastDirectionRef.current = 'DOWN'
          }
          break
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (lastDirectionRef.current !== 'RIGHT') {
            newDirection = 'LEFT'
            lastDirectionRef.current = 'LEFT'
          }
          break
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (lastDirectionRef.current !== 'LEFT') {
            newDirection = 'RIGHT'
            lastDirectionRef.current = 'RIGHT'
          }
          break
        case ' ':
          return { ...prev, isPlaying: !prev.isPlaying }
        default:
          return prev
      }

      return { ...prev, direction: newDirection }
    })
  }, [gameState.gameOver, gameState.gameStarted, gameState.isPlaying])

  // 🎮 INICIAR JUEGO
  const startGame = () => {
    setGameState(prev => ({ 
      ...prev, 
      isPlaying: true, 
      gameStarted: true,
      gameOver: false 
    }))
    lastDirectionRef.current = 'RIGHT'
    toast.success('¡Snake iniciado! Usa las flechas para moverte')
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

  // 🎮 TERMINAR JUEGO
  const endGame = () => {
    const rewards = {
      coins: Math.floor(gameState.score / 10),
      experience: gameState.score,
      happiness: Math.min(25, Math.floor(gameState.score / 5))
    }
    
    onGameEnd(gameState.score, rewards)
  }

  // 🎮 GAME LOOP MEJORADO
  useEffect(() => {
    if (gameState.isPlaying && !gameState.gameOver) {
      gameLoopRef.current = setTimeout(moveSnake, gameState.speed)
    }

    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current)
      }
    }
  }, [gameState.isPlaying, gameState.gameOver, gameState.speed, moveSnake])

  // 🎮 EVENT LISTENERS
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleKeyPress])

  // 🎮 GAME OVER EFFECT
  useEffect(() => {
    if (gameState.gameOver) {
      toast.error(`¡Game Over! Puntuación: ${gameState.score}`)
      endGame()
    }
  }, [gameState.gameOver, gameState.score])

  // 🎮 DIBUJAR CANVAS MEJORADO
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cellSize = canvas.width / GRID_SIZE

    // Limpiar canvas
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Dibujar grid
    ctx.strokeStyle = '#16213e'
    ctx.lineWidth = 0.5
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath()
      ctx.moveTo(i * cellSize, 0)
      ctx.lineTo(i * cellSize, canvas.height)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(0, i * cellSize)
      ctx.lineTo(canvas.width, i * cellSize)
      ctx.stroke()
    }

    // Dibujar serpiente
    gameState.snake.forEach((segment, index) => {
      if (index === 0) {
        // Cabeza
        ctx.fillStyle = '#4ade80'
        ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2)
        
        // Ojos
        ctx.fillStyle = '#000'
        ctx.fillRect(segment.x * cellSize + 4, segment.y * cellSize + 4, 2, 2)
        ctx.fillRect(segment.x * cellSize + 10, segment.y * cellSize + 4, 2, 2)
      } else {
        // Cuerpo
        ctx.fillStyle = '#22c55e'
        ctx.fillRect(segment.x * cellSize + 1, segment.y * cellSize + 1, cellSize - 2, cellSize - 2)
      }
    })

    // Dibujar comida
    ctx.fillStyle = '#ef4444'
    ctx.beginPath()
    ctx.arc(
      gameState.food.x * cellSize + cellSize / 2,
      gameState.food.y * cellSize + cellSize / 2,
      cellSize / 2 - 2,
      0,
      2 * Math.PI
    )
    ctx.fill()

    // Efecto de brillo en la comida
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(
      gameState.food.x * cellSize + cellSize / 2 - 2,
      gameState.food.y * cellSize + cellSize / 2 - 2,
      2,
      0,
      2 * Math.PI
    )
    ctx.fill()
  }, [gameState])

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
      <Card className="w-full max-w-4xl bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 text-white border-0 shadow-2xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold">
              <span className="text-4xl">🐍</span>
              Snake Épico
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
              <div className="text-2xl font-bold text-green-400">{gameState.score}</div>
              <div className="text-sm opacity-80">Puntuación</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">{gameState.highScore}</div>
              <div className="text-sm opacity-80">Mejor</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-purple-400">{gameState.level}</div>
              <div className="text-sm opacity-80">Nivel</div>
            </div>
            <div className="bg-black/30 rounded-lg p-3 text-center">
              <div className="text-2xl font-bold text-yellow-400">{gameState.snake.length}</div>
              <div className="text-sm opacity-80">Longitud</div>
            </div>
          </div>

          {/* 🎮 CANVAS DEL JUEGO */}
          <div className="flex justify-center">
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="border-4 border-green-500 rounded-lg shadow-2xl"
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
                    <div className="text-6xl mb-4">💀</div>
                    <div className="text-2xl font-bold mb-2">¡GAME OVER!</div>
                    <div className="text-lg mb-4">Puntuación: {gameState.score}</div>
                    <Button onClick={resetGame} className="bg-red-500 hover:bg-red-600">
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
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold"
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
              className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold"
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
                value={((INITIAL_SPEED - gameState.speed) / (INITIAL_SPEED - 50)) * 100} 
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
                  <div>• Flechas o WASD para mover</div>
                  <div>• Espacio para pausar</div>
                  <div>• Come las manzanas rojas</div>
                </div>
              </div>
              <div>
                <div className="font-semibold mb-1">Objetivo:</div>
                <div className="space-y-1 opacity-80">
                  <div>• Crece lo más posible</div>
                  <div>• Evita chocar contigo mismo</div>
                  <div>• Sube de nivel cada 50 puntos</div>
                </div>
              </div>
            </div>
          </div>

          {/* 🎮 PROGRESO DE NIVEL */}
          <div className="bg-black/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold">Progreso del Nivel</span>
              <span className="text-sm opacity-80">
                {gameState.score % 50}/50 puntos
              </span>
            </div>
            <Progress 
              value={(gameState.score % 50) / 50 * 100} 
              className="h-3 bg-white/20"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 