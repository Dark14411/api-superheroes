"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import {
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Star,
  Zap,
  Target,
  Gamepad2,
  Map,
  Compass,
  Mountain,
  Trees,
  Waves,
  Sun,
  Moon,
  Cloud,
  Snowflake,
  Flame,
  Eye,
  Heart,
  Shield,
  Sword,
  Wand2,
  Clock,
  Timer,
  Award,
  Coins,
  Gem,
  Crown,
  Settings,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Sparkles
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { toast } from "sonner"

interface ScenarioGame {
  id: string
  name: string
  description: string
  backgroundImage: string
  backgroundType: 'static' | 'animated'
  category: 'adventure' | 'puzzle' | 'action' | 'exploration' | 'strategy'
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme'
  theme: 'nature' | 'mystical' | 'urban' | 'underwater' | 'space' | 'fantasy'
  gameType: 'platformer' | 'hidden_objects' | 'maze' | 'puzzle' | 'rpg' | 'racing'
  minLevel: number
  rewards: {
    coins: number
    xp: number
    items?: string[]
    achievements?: string[]
  }
  gameData: any
  unlocked: boolean
  bestScore: number
  timesPlayed: number
}

interface GameSession {
  gameId: string
  startTime: Date
  score: number
  level: number
  lives: number
  timeElapsed: number
  completed: boolean
  playerPosition: { x: number; y: number }
  gameState: any
}

export default function ScenarioBasedGames({ 
  onGameComplete,
  playerLevel = 5,
  playerCoins = 1000 
}: {
  onGameComplete?: (rewards: any) => void
  playerLevel?: number
  playerCoins?: number
}) {
  const [games] = useState<ScenarioGame[]>([
    {
      id: 'mystical_forest_adventure',
      name: 'Aventura del Bosque Místico',
      description: 'Explora un bosque encantado lleno de secretos y criaturas mágicas',
      backgroundImage: '/escenarios/download.jpg',
      backgroundType: 'static',
      category: 'adventure',
      difficulty: 'medium',
      theme: 'nature',
      gameType: 'platformer',
      minLevel: 1,
      rewards: {
        coins: 150,
        xp: 75,
        items: ['poción_mágica', 'semilla_encantada'],
        achievements: ['explorador_novato']
      },
      gameData: {
        platforms: [
          { x: 100, y: 400, width: 200, height: 20 },
          { x: 350, y: 300, width: 150, height: 20 },
          { x: 550, y: 200, width: 100, height: 20 },
          { x: 700, y: 350, width: 180, height: 20 }
        ],
        collectibles: [
          { x: 150, y: 350, type: 'coin', value: 10 },
          { x: 400, y: 250, type: 'gem', value: 25 },
          { x: 600, y: 150, type: 'coin', value: 10 },
          { x: 750, y: 300, type: 'special', value: 100 }
        ],
        enemies: [
          { x: 300, y: 380, type: 'goblin', health: 2 },
          { x: 500, y: 180, type: 'sprite', health: 1 }
        ],
        goal: { x: 800, y: 300 }
      },
      unlocked: true,
      bestScore: 0,
      timesPlayed: 0
    },
    {
      id: 'animated_crystal_realm',
      name: 'Reino de Cristales Animados',
      description: 'Navega por un mundo en constante movimiento con cristales brillantes',
      backgroundImage: '/escenarios/a98a1fe05019c395040c7872f7a26be4.gif',
      backgroundType: 'animated',
      category: 'puzzle',
      difficulty: 'hard',
      theme: 'mystical',
      gameType: 'puzzle',
      minLevel: 5,
      rewards: {
        coins: 300,
        xp: 150,
        items: ['cristal_poder', 'varita_tiempo'],
        achievements: ['maestro_cristales']
      },
      gameData: {
        crystalGrid: Array(8).fill(0).map(() => Array(8).fill(0).map(() => Math.floor(Math.random() * 6))),
        targetPatterns: [
          [[1, 1, 1], [0, 1, 0], [0, 1, 0]],
          [[2, 0, 2], [0, 2, 0], [2, 0, 2]],
          [[3, 3, 3, 3], [3, 0, 0, 3], [3, 3, 3, 3]]
        ],
        moves: 0,
        maxMoves: 25
      },
      unlocked: false,
      bestScore: 0,
      timesPlayed: 0
    },
    {
      id: 'ethereal_dance_dimension',
      name: 'Dimensión de Danza Etérea',
      description: 'Sincroniza tus movimientos con las ondas energéticas en constante flujo',
      backgroundImage: '/escenarios/46ac9e282d3c303934a72d941845785b.gif',
      backgroundType: 'animated',
      category: 'action',
      difficulty: 'extreme',
      theme: 'mystical',
      gameType: 'rpg',
      minLevel: 10,
      rewards: {
        coins: 500,
        xp: 250,
        items: ['orbe_etéreo', 'danza_cósmica', 'energía_pura'],
        achievements: ['danzante_cósmico', 'maestro_energía']
      },
      gameData: {
        energyWaves: [],
        playerEnergy: 100,
        synchronization: 0,
        wavePatterns: [
          { frequency: 2, amplitude: 50, phase: 0 },
          { frequency: 3, amplitude: 30, phase: Math.PI/4 },
          { frequency: 1.5, amplitude: 70, phase: Math.PI/2 }
        ],
        danceSequence: []
      },
      unlocked: false,
      bestScore: 0,
      timesPlayed: 0
    },
    // Juegos adicionales basados en escenarios imaginarios
    {
      id: 'underwater_palace',
      name: 'Palacio Submarino',
      description: 'Descubre los secretos de un palacio perdido bajo las aguas',
      backgroundImage: '/escenarios/download.jpg', // Reutilizando con filtro azul
      backgroundType: 'static',
      category: 'exploration',
      difficulty: 'medium',
      theme: 'underwater',
      gameType: 'hidden_objects',
      minLevel: 3,
      rewards: {
        coins: 200,
        xp: 100,
        items: ['perla_antigua', 'tridente_neptuno'],
        achievements: ['explorador_submarino']
      },
      gameData: {
        hiddenObjects: [
          { x: 150, y: 200, type: 'pearl', found: false },
          { x: 400, y: 350, type: 'treasure', found: false },
          { x: 600, y: 150, type: 'artifact', found: false },
          { x: 300, y: 450, type: 'scroll', found: false }
        ],
        bubbles: [],
        currentOxygen: 100,
        maxOxygen: 100
      },
      unlocked: false,
      bestScore: 0,
      timesPlayed: 0
    },
    {
      id: 'sky_fortress_racing',
      name: 'Carrera en la Fortaleza Celeste',
      description: 'Vuela a toda velocidad entre las nubes y torres flotantes',
      backgroundImage: '/escenarios/download.jpg', // Con filtro celeste
      backgroundType: 'static',
      category: 'action',
      difficulty: 'hard',
      theme: 'space',
      gameType: 'racing',
      minLevel: 7,
      rewards: {
        coins: 350,
        xp: 175,
        items: ['alas_viento', 'propulsor_celeste'],
        achievements: ['piloto_experto']
      },
      gameData: {
        raceCourse: [
          { x: 100, y: 300, type: 'checkpoint' },
          { x: 300, y: 200, type: 'boost' },
          { x: 500, y: 350, type: 'checkpoint' },
          { x: 700, y: 150, type: 'obstacle' },
          { x: 900, y: 300, type: 'finish' }
        ],
        playerSpeed: 0,
        maxSpeed: 100,
        acceleration: 2,
        position: 0
      },
      unlocked: false,
      bestScore: 0,
      timesPlayed: 0
    }
  ])

  const [selectedGame, setSelectedGame] = useState<ScenarioGame | null>(null)
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null)
  const [gameRunning, setGameRunning] = useState(false)
  const [gamePaused, setGamePaused] = useState(false)
  const [gameSettings, setGameSettings] = useState({
    volume: 50,
    fullscreen: false,
    difficulty: 'normal'
  })
  const [filter, setFilter] = useState('all')
  const gameCanvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()

  // Filtrar juegos
  const filteredGames = games.filter(game => {
    if (filter === 'all') return true
    if (filter === 'unlocked') return game.unlocked
    if (filter === 'locked') return !game.unlocked
    return game.category === filter
  })

  // Iniciar juego
  const startGame = (game: ScenarioGame) => {
    if (!game.unlocked) {
      toast.error("Este juego aún no está desbloqueado")
      return
    }

    if (playerLevel < game.minLevel) {
      toast.error(`Necesitas nivel ${game.minLevel} para jugar`)
      return
    }

    setSelectedGame(game)
    setCurrentSession({
      gameId: game.id,
      startTime: new Date(),
      score: 0,
      level: 1,
      lives: 3,
      timeElapsed: 0,
      completed: false,
      playerPosition: { x: 50, y: 350 },
      gameState: initializeGameState(game)
    })
    setGameRunning(true)
    setGamePaused(false)
    
    startGameLoop(game)
    toast.success(`¡Iniciando ${game.name}!`)
  }

  // Inicializar estado del juego
  const initializeGameState = (game: ScenarioGame) => {
    switch (game.gameType) {
      case 'platformer':
        return {
          ...game.gameData,
          collectiblesCollected: 0,
          enemiesDefeated: 0,
          platformsReached: []
        }
      case 'puzzle':
        return {
          ...game.gameData,
          currentPattern: 0,
          matchedPatterns: []
        }
      case 'rpg':
        return {
          ...game.gameData,
          waveIndex: 0,
          perfectSyncs: 0
        }
      case 'hidden_objects':
        return {
          ...game.gameData,
          objectsFound: 0,
          timeBonus: 100
        }
      case 'racing':
        return {
          ...game.gameData,
          lapTime: 0,
          checkpointsReached: 0
        }
      default:
        return game.gameData
    }
  }

  // Loop principal del juego
  const startGameLoop = (game: ScenarioGame) => {
    const gameLoop = () => {
      if (!gamePaused && gameRunning && currentSession) {
        updateGame(game)
        renderGame(game)
        
        // Actualizar tiempo
        const elapsed = Date.now() - currentSession.startTime.getTime()
        setCurrentSession(prev => prev ? { ...prev, timeElapsed: elapsed } : null)
      }
      
      if (gameRunning) {
        animationFrameRef.current = requestAnimationFrame(gameLoop)
      }
    }
    
    gameLoop()
  }

  // Actualizar lógica del juego
  const updateGame = (game: ScenarioGame) => {
    if (!currentSession) return

    switch (game.gameType) {
      case 'platformer':
        updatePlatformerGame()
        break
      case 'puzzle':
        updatePuzzleGame()
        break
      case 'rpg':
        updateRPGGame()
        break
      case 'hidden_objects':
        updateHiddenObjectsGame()
        break
      case 'racing':
        updateRacingGame()
        break
    }

    // Verificar condiciones de victoria/derrota
    checkWinConditions(game)
  }

  // Actualizar juego de plataformas
  const updatePlatformerGame = () => {
    if (!currentSession) return

    // Física básica de gravedad
    const gravity = 0.5
    const newY = currentSession.playerPosition.y + gravity

    // Verificar colisiones con plataformas
    const platforms = currentSession.gameState.platforms || []
    let onPlatform = false

    platforms.forEach((platform: any) => {
      if (currentSession.playerPosition.x >= platform.x &&
          currentSession.playerPosition.x <= platform.x + platform.width &&
          newY >= platform.y - 20 &&
          newY <= platform.y + 10) {
        onPlatform = true
        setCurrentSession(prev => prev ? {
          ...prev,
          playerPosition: { ...prev.playerPosition, y: platform.y - 20 }
        } : null)
      }
    })

    if (!onPlatform && newY < 500) {
      setCurrentSession(prev => prev ? {
        ...prev,
        playerPosition: { ...prev.playerPosition, y: newY }
      } : null)
    }

    // Verificar colección de items
    const collectibles = currentSession.gameState.collectibles || []
    collectibles.forEach((item: any, index: number) => {
      const distance = Math.sqrt(
        Math.pow(currentSession.playerPosition.x - item.x, 2) +
        Math.pow(currentSession.playerPosition.y - item.y, 2)
      )

      if (distance < 30 && !item.collected) {
        item.collected = true
        setCurrentSession(prev => prev ? {
          ...prev,
          score: prev.score + item.value
        } : null)
        toast.success(`+${item.value} puntos!`)
      }
    })
  }

  // Actualizar juego de puzzle
  const updatePuzzleGame = () => {
    // Lógica específica para puzzles de cristales
    if (Math.random() < 0.02) { // 2% de probabilidad por frame
      // Rotar cristales aleatoriamente
      setCurrentSession(prev => {
        if (!prev) return null
        const newGrid = [...prev.gameState.crystalGrid]
        const row = Math.floor(Math.random() * 8)
        const col = Math.floor(Math.random() * 8)
        newGrid[row][col] = (newGrid[row][col] + 1) % 6
        
        return {
          ...prev,
          gameState: {
            ...prev.gameState,
            crystalGrid: newGrid
          }
        }
      })
    }
  }

  // Actualizar juego RPG
  const updateRPGGame = () => {
    if (!currentSession) return

    // Actualizar ondas de energía
    const time = currentSession.timeElapsed / 1000
    const waves = currentSession.gameState.wavePatterns.map((pattern: any, index: number) => ({
      ...pattern,
      currentValue: pattern.amplitude * Math.sin(pattern.frequency * time + pattern.phase)
    }))

    setCurrentSession(prev => prev ? {
      ...prev,
      gameState: {
        ...prev.gameState,
        energyWaves: waves
      }
    } : null)
  }

  // Actualizar objetos ocultos
  const updateHiddenObjectsGame = () => {
    if (!currentSession) return

    // Reducir oxígeno gradualmente
    setCurrentSession(prev => {
      if (!prev) return null
      const newOxygen = Math.max(0, prev.gameState.currentOxygen - 0.1)
      
      if (newOxygen === 0) {
        endGame(false)
      }
      
      return {
        ...prev,
        gameState: {
          ...prev.gameState,
          currentOxygen: newOxygen
        }
      }
    })

    // Generar burbujas
    if (Math.random() < 0.05) {
      setCurrentSession(prev => {
        if (!prev) return null
        const newBubbles = [...(prev.gameState.bubbles || []), {
          x: Math.random() * 800,
          y: 500,
          speed: Math.random() * 2 + 1
        }]
        
        return {
          ...prev,
          gameState: {
            ...prev.gameState,
            bubbles: newBubbles.slice(-10) // Mantener máximo 10 burbujas
          }
        }
      })
    }
  }

  // Actualizar carrera
  const updateRacingGame = () => {
    if (!currentSession) return

    // Acelerar automáticamente
    setCurrentSession(prev => {
      if (!prev) return null
      const newSpeed = Math.min(prev.gameState.maxSpeed, 
        prev.gameState.playerSpeed + prev.gameState.acceleration)
      const newPosition = prev.gameState.position + newSpeed / 10
      
      return {
        ...prev,
        gameState: {
          ...prev.gameState,
          playerSpeed: newSpeed,
          position: newPosition
        }
      }
    })
  }

  // Renderizar juego
  const renderGame = (game: ScenarioGame) => {
    const canvas = gameCanvasRef.current
    if (!canvas || !currentSession) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Renderizar fondo específico del juego
    renderBackground(ctx, game, canvas)

    // Renderizar elementos específicos del tipo de juego
    switch (game.gameType) {
      case 'platformer':
        renderPlatformerGame(ctx, canvas)
        break
      case 'puzzle':
        renderPuzzleGame(ctx, canvas)
        break
      case 'rpg':
        renderRPGGame(ctx, canvas)
        break
      case 'hidden_objects':
        renderHiddenObjectsGame(ctx, canvas)
        break
      case 'racing':
        renderRacingGame(ctx, canvas)
        break
    }

    // Renderizar UI del juego
    renderGameUI(ctx, canvas)
  }

  // Renderizar fondo
  const renderBackground = (ctx: CanvasRenderingContext2D, game: ScenarioGame, canvas: HTMLCanvasElement) => {
    // Aplicar filtros según el tema
    let filter = 'none'
    switch (game.theme) {
      case 'underwater':
        filter = 'hue-rotate(200deg) saturate(1.5)'
        break
      case 'space':
        filter = 'hue-rotate(240deg) brightness(0.8)'
        break
      case 'mystical':
        filter = 'hue-rotate(280deg) saturate(1.3)'
        break
    }

    ctx.filter = filter
    ctx.fillStyle = game.theme === 'underwater' ? '#0066cc' : 
                   game.theme === 'space' ? '#000033' : 
                   game.theme === 'mystical' ? '#330066' : '#228B22'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.filter = 'none'
  }

  // Renderizar juego de plataformas
  const renderPlatformerGame = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!currentSession) return

    // Renderizar plataformas
    ctx.fillStyle = '#8B4513'
    currentSession.gameState.platforms?.forEach((platform: any) => {
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
    })

    // Renderizar collectibles
    currentSession.gameState.collectibles?.forEach((item: any) => {
      if (item.collected) return
      
      ctx.fillStyle = item.type === 'coin' ? '#FFD700' : 
                     item.type === 'gem' ? '#FF69B4' : '#00FFFF'
      ctx.beginPath()
      ctx.arc(item.x, item.y, 10, 0, Math.PI * 2)
      ctx.fill()
    })

    // Renderizar enemigos
    ctx.fillStyle = '#FF0000'
    currentSession.gameState.enemies?.forEach((enemy: any) => {
      if (enemy.health > 0) {
        ctx.fillRect(enemy.x, enemy.y, 20, 20)
      }
    })

    // Renderizar jugador
    ctx.fillStyle = '#0000FF'
    ctx.fillRect(currentSession.playerPosition.x, currentSession.playerPosition.y, 20, 20)

    // Renderizar objetivo
    const goal = currentSession.gameState.goal
    if (goal) {
      ctx.fillStyle = '#00FF00'
      ctx.strokeStyle = '#FFFF00'
      ctx.lineWidth = 3
      ctx.fillRect(goal.x, goal.y, 30, 30)
      ctx.strokeRect(goal.x, goal.y, 30, 30)
    }
  }

  // Renderizar juego de puzzle
  const renderPuzzleGame = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!currentSession) return

    const cellSize = 40
    const grid = currentSession.gameState.crystalGrid

    grid?.forEach((row: number[], rowIndex: number) => {
      row.forEach((cell: number, colIndex: number) => {
        const x = colIndex * cellSize + 100
        const y = rowIndex * cellSize + 50
        
        // Colores de cristales
        const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF']
        ctx.fillStyle = colors[cell] || '#FFFFFF'
        
        ctx.fillRect(x, y, cellSize - 2, cellSize - 2)
        ctx.strokeStyle = '#FFFFFF'
        ctx.lineWidth = 1
        ctx.strokeRect(x, y, cellSize - 2, cellSize - 2)
      })
    })
  }

  // Renderizar juego RPG
  const renderRPGGame = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!currentSession) return

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    // Renderizar ondas de energía
    currentSession.gameState.energyWaves?.forEach((wave: any, index: number) => {
      ctx.strokeStyle = `hsl(${index * 120}, 70%, 50%)`
      ctx.lineWidth = 3
      ctx.beginPath()
      
      for (let x = 0; x < canvas.width; x += 5) {
        const y = centerY + wave.currentValue * Math.sin((x / canvas.width) * Math.PI * 4)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    })

    // Renderizar jugador como orbe de energía
    ctx.fillStyle = `rgba(255, 255, 255, 0.8)`
    ctx.shadowColor = '#FFFFFF'
    ctx.shadowBlur = 20
    ctx.beginPath()
    ctx.arc(currentSession.playerPosition.x, currentSession.playerPosition.y, 15, 0, Math.PI * 2)
    ctx.fill()
    ctx.shadowBlur = 0
  }

  // Renderizar objetos ocultos
  const renderHiddenObjectsGame = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!currentSession) return

    // Renderizar objetos ocultos
    currentSession.gameState.hiddenObjects?.forEach((obj: any) => {
      if (!obj.found) {
        ctx.fillStyle = 'rgba(255, 215, 0, 0.7)'
        ctx.fillRect(obj.x - 5, obj.y - 5, 10, 10)
      }
    })

    // Renderizar burbujas
    currentSession.gameState.bubbles?.forEach((bubble: any, index: number) => {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)'
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)'
      ctx.beginPath()
      ctx.arc(bubble.x, bubble.y, 5, 0, Math.PI * 2)
      ctx.fill()
      ctx.stroke()
      
      // Mover burbuja hacia arriba
      bubble.y -= bubble.speed
    })

    // Renderizar barra de oxígeno
    const oxygenWidth = (currentSession.gameState.currentOxygen / currentSession.gameState.maxOxygen) * 200
    ctx.fillStyle = currentSession.gameState.currentOxygen > 30 ? '#00FF00' : '#FF0000'
    ctx.fillRect(10, 10, oxygenWidth, 20)
    ctx.strokeStyle = '#FFFFFF'
    ctx.strokeRect(10, 10, 200, 20)
  }

  // Renderizar carrera
  const renderRacingGame = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!currentSession) return

    // Renderizar pista
    ctx.strokeStyle = '#FFFFFF'
    ctx.lineWidth = 3
    ctx.setLineDash([10, 5])
    ctx.beginPath()
    ctx.moveTo(canvas.width / 2, 0)
    ctx.lineTo(canvas.width / 2, canvas.height)
    ctx.stroke()
    ctx.setLineDash([])

    // Renderizar checkpoints
    currentSession.gameState.raceCourse?.forEach((point: any, index: number) => {
      const progress = currentSession.gameState.position / 1000
      const pointY = canvas.height - (progress * canvas.height) + (index * 100)
      
      if (pointY > -50 && pointY < canvas.height + 50) {
        ctx.fillStyle = point.type === 'finish' ? '#00FF00' : 
                       point.type === 'boost' ? '#FFFF00' : '#FF0000'
        ctx.fillRect(point.x, pointY, 30, 10)
      }
    })

    // Renderizar nave del jugador
    ctx.fillStyle = '#0000FF'
    ctx.fillRect(currentSession.playerPosition.x, canvas.height - 50, 20, 30)
  }

  // Renderizar UI del juego
  const renderGameUI = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (!currentSession) return

    // Renderizar información del jugador
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(10, canvas.height - 80, 200, 70)
    
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '14px Arial'
    ctx.fillText(`Puntuación: ${currentSession.score}`, 15, canvas.height - 55)
    ctx.fillText(`Vidas: ${currentSession.lives}`, 15, canvas.height - 35)
    ctx.fillText(`Tiempo: ${Math.floor(currentSession.timeElapsed / 1000)}s`, 15, canvas.height - 15)
  }

  // Verificar condiciones de victoria
  const checkWinConditions = (game: ScenarioGame) => {
    if (!currentSession) return

    let gameWon = false
    let gameLost = false

    switch (game.gameType) {
      case 'platformer':
        const goal = currentSession.gameState.goal
        if (goal) {
          const distance = Math.sqrt(
            Math.pow(currentSession.playerPosition.x - goal.x, 2) +
            Math.pow(currentSession.playerPosition.y - goal.y, 2)
          )
          gameWon = distance < 40
        }
        gameLost = currentSession.lives <= 0
        break
        
      case 'puzzle':
        gameWon = currentSession.gameState.matchedPatterns?.length >= 3
        gameLost = currentSession.gameState.moves >= currentSession.gameState.maxMoves
        break
        
      case 'hidden_objects':
        gameWon = currentSession.gameState.objectsFound >= 4
        gameLost = currentSession.gameState.currentOxygen <= 0
        break
        
      case 'racing':
        gameWon = currentSession.gameState.position >= 1000
        gameLost = currentSession.timeElapsed > 120000 // 2 minutos
        break
    }

    if (gameWon || gameLost) {
      endGame(gameWon)
    }
  }

  // Finalizar juego
  const endGame = (won: boolean) => {
    if (!currentSession || !selectedGame) return

    setGameRunning(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    const finalScore = currentSession.score
    const timeBonus = Math.max(0, 10000 - currentSession.timeElapsed)
    const totalScore = finalScore + (won ? timeBonus : 0)

    // Actualizar estadísticas del juego
    setSelectedGame(prev => {
      if (!prev) return null
      return {
        ...prev,
        bestScore: Math.max(prev.bestScore, totalScore),
        timesPlayed: prev.timesPlayed + 1
      }
    })

    if (won) {
      const rewards = selectedGame.rewards
      if (onGameComplete) {
        onGameComplete({
          coins: rewards.coins,
          xp: rewards.xp,
          items: rewards.items,
          achievements: rewards.achievements,
          score: totalScore
        })
      }
      toast.success(`¡Victoria! Puntuación final: ${totalScore}`)
    } else {
      toast.error("Juego terminado. ¡Inténtalo de nuevo!")
    }

    // Limpiar estado
    setTimeout(() => {
      setCurrentSession(null)
      setSelectedGame(null)
    }, 3000)
  }

  // Manejar input del teclado
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameRunning || !currentSession) return

      const speed = 5
      let newX = currentSession.playerPosition.x
      let newY = currentSession.playerPosition.y

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
          newX = Math.max(0, newX - speed)
          break
        case 'ArrowRight':
        case 'd':
          newX = Math.min(750, newX + speed)
          break
        case 'ArrowUp':
        case 'w':
          newY = Math.max(0, newY - speed * 2) // Salto
          break
        case 'ArrowDown':
        case 's':
          newY = Math.min(450, newY + speed)
          break
        case ' ':
          e.preventDefault()
          setGamePaused(!gamePaused)
          break
      }

      setCurrentSession(prev => prev ? {
        ...prev,
        playerPosition: { x: newX, y: newY }
      } : null)
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameRunning, currentSession, gamePaused])

  // Click en canvas para juegos interactivos
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!currentSession || !gameRunning) return

    const canvas = gameCanvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Lógica específica según el tipo de juego
    if (selectedGame?.gameType === 'hidden_objects') {
      // Verificar si se clickeó un objeto oculto
      currentSession.gameState.hiddenObjects?.forEach((obj: any) => {
        const distance = Math.sqrt(Math.pow(x - obj.x, 2) + Math.pow(y - obj.y, 2))
        if (distance < 20 && !obj.found) {
          obj.found = true
          setCurrentSession(prev => prev ? {
            ...prev,
            score: prev.score + 50,
            gameState: {
              ...prev.gameState,
              objectsFound: prev.gameState.objectsFound + 1
            }
          } : null)
          toast.success("¡Objeto encontrado! +50 puntos")
        }
      })
    } else if (selectedGame?.gameType === 'puzzle') {
      // Rotar cristal clickeado
      const cellSize = 40
      const gridX = Math.floor((x - 100) / cellSize)
      const gridY = Math.floor((y - 50) / cellSize)
      
      if (gridX >= 0 && gridX < 8 && gridY >= 0 && gridY < 8) {
        setCurrentSession(prev => {
          if (!prev) return null
          const newGrid = [...prev.gameState.crystalGrid]
          newGrid[gridY][gridX] = (newGrid[gridY][gridX] + 1) % 6
          
          return {
            ...prev,
            gameState: {
              ...prev.gameState,
              crystalGrid: newGrid,
              moves: prev.gameState.moves + 1
            }
          }
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">🗺️ Juegos de Escenarios Épicos</h1>
              <p className="opacity-90">Aventuras inmersivas en mundos visuales únicos</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">{filteredGames.filter(g => g.unlocked).length}</div>
              <div className="text-sm opacity-90">Mundos Desbloqueados</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Game Canvas (cuando hay juego activo) */}
      {gameRunning && selectedGame && (
        <Card className="relative">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Image
                src={selectedGame.backgroundImage}
                alt={selectedGame.name}
                width={40}
                height={40}
                className="rounded"
              />
              {selectedGame.name}
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setGamePaused(!gamePaused)}
              >
                {gamePaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => endGame(false)}
              >
                Salir
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <canvas
                ref={gameCanvasRef}
                width={800}
                height={500}
                className="border border-gray-300 rounded-lg cursor-crosshair"
                onClick={handleCanvasClick}
                style={{
                  backgroundImage: selectedGame.backgroundType === 'static' ? 
                    `url(${selectedGame.backgroundImage})` : 'none',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              
              {gamePaused && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
                  <div className="text-white text-center">
                    <Pause className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold">Juego Pausado</h3>
                    <p className="text-sm opacity-75 mt-2">Presiona ESPACIO o el botón de play para continuar</p>
                  </div>
                </div>
              )}
            </div>
            
            {/* Controles del juego */}
            <div className="mt-4 text-center text-sm text-gray-600">
              <p>Controles: WASD o Flechas para moverse • ESPACIO para pausar • Click para interactuar</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      {!gameRunning && (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            <Map className="h-4 w-4 mr-1" />
            Todos
          </Button>
          <Button
            size="sm"
            variant={filter === 'unlocked' ? 'default' : 'outline'}
            onClick={() => setFilter('unlocked')}
          >
            <Eye className="h-4 w-4 mr-1" />
            Desbloqueados
          </Button>
          <Button
            size="sm"
            variant={filter === 'locked' ? 'default' : 'outline'}
            onClick={() => setFilter('locked')}
          >
            <Shield className="h-4 w-4 mr-1" />
            Bloqueados
          </Button>
          {['adventure', 'puzzle', 'action', 'exploration', 'strategy'].map(category => (
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
      )}

      {/* Grid de Juegos */}
      {!gameRunning && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGames.map((game) => (
            <motion.div
              key={game.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                !game.unlocked ? 'opacity-60' : ''
              } ${
                game.difficulty === 'extreme' ? 'border-2 border-red-500 bg-gradient-to-br from-red-50 to-orange-50' :
                game.difficulty === 'hard' ? 'border-2 border-orange-500 bg-gradient-to-br from-orange-50 to-yellow-50' :
                game.backgroundType === 'animated' ? 'border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50' :
                ''
              }`}>
                <CardContent className="p-0">
                  {/* Imagen de fondo del juego */}
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <Image
                      src={game.backgroundImage}
                      alt={game.name}
                      fill
                      className="object-cover"
                      style={{
                        filter: game.theme === 'underwater' ? 'hue-rotate(200deg) saturate(1.5)' :
                               game.theme === 'space' ? 'hue-rotate(240deg) brightness(0.8)' :
                               game.theme === 'mystical' ? 'hue-rotate(280deg) saturate(1.3)' : 'none'
                      }}
                    />
                    
                    {/* Overlay con información */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={
                          game.difficulty === 'extreme' ? 'destructive' :
                          game.difficulty === 'hard' ? 'secondary' : 'default'
                        }>
                          {game.difficulty}
                        </Badge>
                        <Badge variant="outline" className="text-white border-white">
                          {game.category}
                        </Badge>
                        {game.backgroundType === 'animated' && (
                          <Badge variant="destructive">🎬 Animado</Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-bold">{game.name}</h3>
                      <p className="text-sm opacity-90">{game.description}</p>
                    </div>

                    {!game.unlocked && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="text-center text-white">
                          <Shield className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-sm">Nivel {game.minLevel} requerido</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Información del juego */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Gamepad2 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium">{game.gameType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {game.backgroundType === 'animated' && (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="h-4 w-4 text-purple-600" />
                          </motion.div>
                        )}
                        {game.theme === 'mystical' && <Wand2 className="h-4 w-4 text-purple-600" />}
                        {game.theme === 'underwater' && <Waves className="h-4 w-4 text-blue-600" />}
                        {game.theme === 'space' && <Star className="h-4 w-4 text-yellow-600" />}
                        {game.theme === 'nature' && <Trees className="h-4 w-4 text-green-600" />}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <Coins className="h-3 w-3 text-yellow-500" />
                        <span>{game.rewards.coins} monedas</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-blue-500" />
                        <span>{game.rewards.xp} XP</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Trophy className="h-3 w-3 text-purple-500" />
                        <span>Record: {game.bestScore}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-500" />
                        <span>{game.timesPlayed} veces</span>
                      </div>
                    </div>

                    {game.rewards.items && game.rewards.items.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-gray-600 mb-1">Recompensas especiales:</p>
                        <div className="flex flex-wrap gap-1">
                          {game.rewards.items.map((item, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={() => startGame(game)}
                      className="w-full"
                      disabled={!game.unlocked || playerLevel < game.minLevel}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      {!game.unlocked ? `Desbloquear (Lv.${game.minLevel})` : 'Jugar Ahora'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}