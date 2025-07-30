'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import Image from 'next/image'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Trophy, 
  Star, 
  Gamepad2, 
  Zap,
  Heart,
  Coins,
  Timer,
  Target,
  Flame,
  Snowflake,
  Sparkles,
  Shield
} from 'lucide-react'

// 🎮 INTERFACES PARA JUEGOS MARIO BROS
interface MarioGame {
  id: string
  name: string
  description: string
  backgroundGif: string
  difficulty: 1 | 2 | 3 | 4 | 5
  gameType: 'platformer' | 'runner' | 'puzzle' | 'adventure'
  theme: 'crystal' | 'ethereal' | 'mystical' | 'ancient'
  bestScore: number
  highestLevel: number
  completed: boolean
  unlocked: boolean
  rewards: {
    coins: number
    experience: number
    lives: number
  }
}

interface GameState {
  isPlaying: boolean
  isPaused: boolean
  score: number
  lives: number
  level: number
  time: number
  coins: number
  powerUp: string | null
  invulnerable: boolean
}

interface Player {
  x: number
  y: number
  width: number
  height: number
  velocityX: number
  velocityY: number
  onGround: boolean
  direction: 'left' | 'right'
  isJumping: boolean
  isRunning: boolean
  health: number
  powerUpTimer: number
}

interface Obstacle {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: 'spike' | 'enemy' | 'pit' | 'moving_platform' | 'fire' | 'ice'
  imageUrl: string
  damage: number
  moving?: boolean
  speed?: number
  direction?: number
  active: boolean
}

interface Collectible {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: 'coin' | 'gem' | 'star' | 'heart' | 'power_up'
  value: number
  collected: boolean
  animated: boolean
}

interface Platform {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: 'solid' | 'moving' | 'breakable' | 'invisible'
  moving?: boolean
  speed?: number
  direction?: number
}

export default function MarioStyleMiniGames({ 
  onScoreUpdate, 
  playerLevel = 5 
}: {
  onScoreUpdate?: (score: number) => void
  playerLevel?: number
}) {
  // 🎮 ESTADOS PRINCIPALES
  const [games, setGames] = useState<MarioGame[]>([])
  const [selectedGame, setSelectedGame] = useState<MarioGame | null>(null)
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    score: 0,
    lives: 3,
    level: 1,
    time: 300,
    coins: 0,
    powerUp: null,
    invulnerable: false
  })
  const [player, setPlayer] = useState<Player>({
    x: 100,
    y: 400,
    width: 32,
    height: 48,
    velocityX: 0,
    velocityY: 0,
    onGround: false,
    direction: 'right',
    isJumping: false,
    isRunning: false,
    health: 100,
    powerUpTimer: 0
  })
  const [obstacles, setObstacles] = useState<Obstacle[]>([])
  const [collectibles, setCollectibles] = useState<Collectible[]>([])
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [cameraX, setCameraX] = useState(0)
  
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number>()
  const keysPressed = useRef<Set<string>>(new Set())

  // 🎮 DATOS DE JUEGOS MARIO BROS
  useEffect(() => {
    const marioGames: MarioGame[] = [
      {
        id: 'crystal_kingdom_runner',
        name: 'Corredor del Reino de Cristales',
        description: 'Corre y salta por cristales animados evitando peligros mortales',
        backgroundGif: '/escenarios/a98a1fe05019c395040c7872f7a26be4.gif',
        difficulty: 3,
        gameType: 'runner',
        theme: 'crystal',
        bestScore: 0,
        highestLevel: 1,
        completed: false,
        unlocked: true,
        rewards: { coins: 100, experience: 50, lives: 1 }
      },
      {
        id: 'ethereal_dimension_adventure',
        name: 'Aventura en Dimensión Etérea',
        description: 'Navega por ondas de energía en un mundo que baila constantemente',
        backgroundGif: '/escenarios/46ac9e282d3c303934a72d941845785b.gif',
        difficulty: 4,
        gameType: 'adventure',
        theme: 'ethereal',
        bestScore: 0,
        highestLevel: 1,
        completed: false,
        unlocked: playerLevel >= 3,
        rewards: { coins: 150, experience: 75, lives: 2 }
      },
      {
        id: 'mystical_forest_platformer',
        name: 'Plataformas del Bosque Místico',
        description: 'Salta entre plataformas mágicas en un bosque encantado',
        backgroundGif: '/escenarios/download.jpg',
        difficulty: 2,
        gameType: 'platformer',
        theme: 'mystical',
        bestScore: 0,
        highestLevel: 1,
        completed: false,
        unlocked: true,
        rewards: { coins: 80, experience: 40, lives: 1 }
      },
      {
        id: 'ancient_ruins_challenge',
        name: 'Desafío de Ruinas Ancestrales',
        description: 'Explora ruinas llenas de trampas y tesoros ocultos',
        backgroundGif: '/escenarios/PruebaEscenario 2022-10-02 16-01-40-original.webp',
        difficulty: 5,
        gameType: 'puzzle',
        theme: 'ancient',
        bestScore: 0,
        highestLevel: 1,
        completed: false,
        unlocked: playerLevel >= 5,
        rewards: { coins: 200, experience: 100, lives: 3 }
      }
    ]

    setGames(marioGames)
  }, [playerLevel])

  // 🏗️ GENERAR OBSTÁCULOS Y COLLECTIBLES
  const generateLevel = useCallback((game: MarioGame, level: number) => {
    const newObstacles: Obstacle[] = []
    const newCollectibles: Collectible[] = []
    const newPlatforms: Platform[] = []

    // Plataformas base
    newPlatforms.push(
      { id: 'ground', x: 0, y: 550, width: 2000, height: 50, type: 'solid' },
      { id: 'platform1', x: 300, y: 450, width: 120, height: 20, type: 'solid' },
      { id: 'platform2', x: 500, y: 350, width: 120, height: 20, type: 'solid' },
      { id: 'platform3', x: 750, y: 280, width: 150, height: 20, type: 'moving', moving: true, speed: 2, direction: 1 },
      { id: 'platform4', x: 1000, y: 400, width: 100, height: 20, type: 'breakable' },
      { id: 'platform5', x: 1200, y: 300, width: 120, height: 20, type: 'solid' },
      { id: 'platform6', x: 1400, y: 200, width: 100, height: 20, type: 'solid' }
    )

    // Obstáculos usando las imágenes reales
    const obstacleImages = [
      '/obstaculos/pngtree-obstacle-spike-2-png-image_12351260.png',
      '/obstaculos/d5b7c2083bbcdb832237132ded3028a7.jpg',
      '/obstaculos/obstaculos2.jpg',
      '/obstaculos/Obstaculo1.jpg'
    ]

    // Pinchos y obstáculos
    for (let i = 0; i < 8; i++) {
      newObstacles.push({
        id: `obstacle_${i}`,
        x: 400 + i * 180,
        y: 520,
        width: 40,
        height: 30,
        type: 'spike',
        imageUrl: obstacleImages[i % obstacleImages.length],
        damage: 25,
        active: true
      })
    }

    // Enemigos móviles
    for (let i = 0; i < 5; i++) {
      newObstacles.push({
        id: `enemy_${i}`,
        x: 600 + i * 250,
        y: 500,
        width: 35,
        height: 35,
        type: 'enemy',
        imageUrl: obstacleImages[1],
        damage: 20,
        moving: true,
        speed: 1.5,
        direction: Math.random() > 0.5 ? 1 : -1,
        active: true
      })
    }

    // Collectibles
    for (let i = 0; i < 15; i++) {
      const type = i % 4 === 0 ? 'gem' : i % 8 === 0 ? 'star' : 'coin'
      newCollectibles.push({
        id: `coin_${i}`,
        x: 250 + i * 100,
        y: type === 'star' ? 200 : 450,
        width: 20,
        height: 20,
        type: type as any,
        value: type === 'star' ? 100 : type === 'gem' ? 50 : 10,
        collected: false,
        animated: true
      })
    }

    // Power-ups especiales
    newCollectibles.push(
      {
        id: 'powerup_1',
        x: 800,
        y: 250,
        width: 25,
        height: 25,
        type: 'power_up',
        value: 0,
        collected: false,
        animated: true
      },
      {
        id: 'heart_1',
        x: 1100,
        y: 370,
        width: 20,
        height: 20,
        type: 'heart',
        value: 25,
        collected: false,
        animated: true
      }
    )

    setObstacles(newObstacles)
    setCollectibles(newCollectibles)
    setPlatforms(newPlatforms)
  }, [])

  // 🎮 INICIAR JUEGO
  const startGame = (game: MarioGame) => {
    setSelectedGame(game)
    setGameState({
      isPlaying: true,
      isPaused: false,
      score: 0,
      lives: 3,
      level: 1,
      time: 300,
      coins: 0,
      powerUp: null,
      invulnerable: false
    })
    
    setPlayer({
      x: 100,
      y: 400,
      width: 32,
      height: 48,
      velocityX: 0,
      velocityY: 0,
      onGround: false,
      direction: 'right',
      isJumping: false,
      isRunning: false,
      health: 100,
      powerUpTimer: 0
    })

    setCameraX(0)
    generateLevel(game, 1)
    
    toast.success(`¡${game.name} iniciado! ¡A saltar!`)
    startGameLoop()
  }

  // 🔄 LOOP PRINCIPAL DEL JUEGO
  const startGameLoop = () => {
    const gameLoop = () => {
      updateGame()
      renderGame()
      gameLoopRef.current = requestAnimationFrame(gameLoop)
    }
    gameLoop()
  }

  const stopGameLoop = () => {
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current)
    }
  }

  // ⚡ ACTUALIZAR LÓGICA DEL JUEGO
  const updateGame = () => {
    if (!gameState.isPlaying || gameState.isPaused) return

    // Actualizar tiempo
    setGameState(prev => ({
      ...prev,
      time: Math.max(0, prev.time - 1/60)
    }))

    // Actualizar jugador
    setPlayer(prev => {
      let newPlayer = { ...prev }
      
      // Input handling
      if (keysPressed.current.has('ArrowLeft') || keysPressed.current.has('a')) {
        newPlayer.velocityX = Math.max(newPlayer.velocityX - 0.8, -6)
        newPlayer.direction = 'left'
        newPlayer.isRunning = true
      } else if (keysPressed.current.has('ArrowRight') || keysPressed.current.has('d')) {
        newPlayer.velocityX = Math.min(newPlayer.velocityX + 0.8, 6)
        newPlayer.direction = 'right'
        newPlayer.isRunning = true
      } else {
        newPlayer.velocityX *= 0.85 // Fricción
        newPlayer.isRunning = false
      }

      // Salto
      if ((keysPressed.current.has('ArrowUp') || keysPressed.current.has('w') || keysPressed.current.has(' ')) && newPlayer.onGround) {
        newPlayer.velocityY = -18
        newPlayer.onGround = false
        newPlayer.isJumping = true
      }

      // Gravedad
      if (!newPlayer.onGround) {
        newPlayer.velocityY += 0.8
      }

      // Actualizar posición
      newPlayer.x += newPlayer.velocityX
      newPlayer.y += newPlayer.velocityY

      // Colisiones con plataformas
      newPlayer.onGround = false
      platforms.forEach(platform => {
        if (newPlayer.x < platform.x + platform.width &&
            newPlayer.x + newPlayer.width > platform.x &&
            newPlayer.y < platform.y + platform.height &&
            newPlayer.y + newPlayer.height > platform.y) {
          
          // Colisión desde arriba
          if (prev.y + prev.height <= platform.y + 5) {
            newPlayer.y = platform.y - newPlayer.height
            newPlayer.velocityY = 0
            newPlayer.onGround = true
            newPlayer.isJumping = false
          }
        }
      })

      // Límites del mundo
      if (newPlayer.x < 0) newPlayer.x = 0
      if (newPlayer.y > 600) {
        // Game over por caída
        setGameState(prev => ({ ...prev, lives: prev.lives - 1 }))
        newPlayer.x = 100
        newPlayer.y = 400
        newPlayer.velocityY = 0
        toast.error('¡Cuidado con los precipicios!')
      }

      // Actualizar timer de power-up
      if (newPlayer.powerUpTimer > 0) {
        newPlayer.powerUpTimer--
      }

      return newPlayer
    })

    // Actualizar obstáculos móviles
    setObstacles(prev => prev.map(obstacle => {
      if (obstacle.moving && obstacle.active) {
        obstacle.x += (obstacle.speed || 1) * (obstacle.direction || 1)
        
        // Cambiar dirección en los límites
        if (obstacle.x <= 0 || obstacle.x >= 1800) {
          obstacle.direction = -(obstacle.direction || 1)
        }
      }
      return obstacle
    }))

    // Colisiones con obstáculos
    obstacles.forEach(obstacle => {
      if (obstacle.active &&
          player.x < obstacle.x + obstacle.width &&
          player.x + player.width > obstacle.x &&
          player.y < obstacle.y + obstacle.height &&
          player.y + player.height > obstacle.y) {
        
        if (!gameState.invulnerable) {
          setGameState(prev => ({ ...prev, invulnerable: true }))
          setPlayer(prev => ({ ...prev, health: Math.max(0, prev.health - obstacle.damage) }))
          
          if (player.health - obstacle.damage <= 0) {
            setGameState(prev => ({ ...prev, lives: prev.lives - 1 }))
            toast.error('¡Perdiste una vida!')
          } else {
            toast.error(`-${obstacle.damage} HP`)
          }
          
          // Período de invulnerabilidad
          setTimeout(() => {
            setGameState(prev => ({ ...prev, invulnerable: false }))
          }, 1000)
        }
      }
    })

    // Colisiones con collectibles
    setCollectibles(prev => prev.map(item => {
      if (!item.collected &&
          player.x < item.x + item.width &&
          player.x + player.width > item.x &&
          player.y < item.y + item.height &&
          player.y + player.height > item.y) {
        
        setGameState(prevState => ({
          ...prevState,
          score: prevState.score + item.value,
          coins: prevState.coins + (item.type === 'coin' ? 1 : 0)
        }))
        
        if (item.type === 'heart') {
          setPlayer(prev => ({ ...prev, health: Math.min(100, prev.health + item.value) }))
          toast.success(`+${item.value} HP`)
        } else if (item.type === 'power_up') {
          setGameState(prev => ({ ...prev, powerUp: 'invincible' }))
          setPlayer(prev => ({ ...prev, powerUpTimer: 300 }))
          toast.success('¡Invencible por 5 segundos!')
        } else {
          toast.success(`+${item.value} puntos`)
        }
        
        return { ...item, collected: true }
      }
      return item
    }))

    // Actualizar cámara para seguir al jugador
    setCameraX(prev => {
      const targetX = player.x - 400
      return prev + (targetX - prev) * 0.1
    })
  }

  // 🎨 RENDERIZAR JUEGO
  const renderGame = () => {
    const canvas = canvasRef.current
    if (!canvas || !selectedGame) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Guardar contexto para cámara
    ctx.save()
    ctx.translate(-cameraX, 0)

    // Renderizar fondo animado
    renderAnimatedBackground(ctx, selectedGame)

    // Renderizar plataformas
    platforms.forEach(platform => {
      ctx.fillStyle = platform.type === 'moving' ? '#4ECDC4' : 
                     platform.type === 'breakable' ? '#E74C3C' : '#8E44AD'
      ctx.fillRect(platform.x, platform.y, platform.width, platform.height)
      
      // Borde
      ctx.strokeStyle = '#2C3E50'
      ctx.lineWidth = 2
      ctx.strokeRect(platform.x, platform.y, platform.width, platform.height)
    })

    // Renderizar obstáculos
    obstacles.forEach(obstacle => {
      if (obstacle.active) {
        // Dibujar obstáculo con color según tipo
        ctx.fillStyle = obstacle.type === 'spike' ? '#E74C3C' : '#F39C12'
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
        
        // Efectos especiales para diferentes tipos
        if (obstacle.type === 'spike') {
          // Dibujar pinchos triangulares
          ctx.fillStyle = '#C0392B'
          for (let i = 0; i < obstacle.width; i += 8) {
            ctx.beginPath()
            ctx.moveTo(obstacle.x + i, obstacle.y + obstacle.height)
            ctx.lineTo(obstacle.x + i + 4, obstacle.y)
            ctx.lineTo(obstacle.x + i + 8, obstacle.y + obstacle.height)
            ctx.closePath()
            ctx.fill()
          }
        }
      }
    })

    // Renderizar collectibles
    collectibles.forEach(item => {
      if (!item.collected) {
        const time = Date.now() * 0.005
        const bounce = Math.sin(time + item.x * 0.01) * 3
        
        ctx.fillStyle = item.type === 'coin' ? '#F1C40F' :
                       item.type === 'gem' ? '#9B59B6' :
                       item.type === 'star' ? '#E67E22' :
                       item.type === 'heart' ? '#E74C3C' : '#2ECC71'
        
        ctx.fillRect(item.x, item.y + bounce, item.width, item.height)
        
        // Efecto brillante
        ctx.shadowColor = ctx.fillStyle
        ctx.shadowBlur = 10
        ctx.fillRect(item.x + 2, item.y + bounce + 2, item.width - 4, item.height - 4)
        ctx.shadowBlur = 0
      }
    })

    // Renderizar jugador
    const playerColor = gameState.invulnerable ? '#FF6B6B' : player.powerUpTimer > 0 ? '#FFD93D' : '#4ECDC4'
    ctx.fillStyle = playerColor
    ctx.fillRect(player.x, player.y, player.width, player.height)
    
    // Cara del jugador
    ctx.fillStyle = '#2C3E50'
    ctx.fillRect(player.x + 8, player.y + 10, 4, 4) // Ojo izquierdo
    ctx.fillRect(player.x + 20, player.y + 10, 4, 4) // Ojo derecho
    ctx.fillRect(player.x + 12, player.y + 25, 8, 3) // Sonrisa

    // Efecto de poder
    if (player.powerUpTimer > 0) {
      ctx.strokeStyle = '#FFD93D'
      ctx.lineWidth = 3
      ctx.strokeRect(player.x - 5, player.y - 5, player.width + 10, player.height + 10)
    }

    ctx.restore()

    // UI del juego (no afectada por la cámara)
    renderGameUI(ctx, canvas)
  }

  // 🖼️ RENDERIZAR FONDO ANIMADO
  const renderAnimatedBackground = (ctx: CanvasRenderingContext2D, game: MarioGame) => {
    const time = Date.now() * 0.001

    // Gradiente base según el tema
    const gradient = ctx.createLinearGradient(0, 0, 0, 600)
    
    switch (game.theme) {
      case 'crystal':
        gradient.addColorStop(0, '#667eea')
        gradient.addColorStop(1, '#764ba2')
        break
      case 'ethereal':
        gradient.addColorStop(0, '#ffecd2')
        gradient.addColorStop(1, '#fcb69f')
        break
      case 'mystical':
        gradient.addColorStop(0, '#4facfe')
        gradient.addColorStop(1, '#00f2fe')
        break
      case 'ancient':
        gradient.addColorStop(0, '#43cea2')
        gradient.addColorStop(1, '#185a9d')
        break
    }

    ctx.fillStyle = gradient
    ctx.fillRect(-1000, 0, 3000, 600)

    // Efectos de partículas animadas
    for (let i = 0; i < 30; i++) {
      const x = (time * 50 + i * 60 + cameraX * 0.5) % 2000
      const y = 50 + Math.sin(time + i) * 100
      
      ctx.save()
      ctx.globalAlpha = 0.7
      ctx.fillStyle = game.theme === 'crystal' ? '#FFFFFF' : 
                     game.theme === 'ethereal' ? '#FFE0B2' :
                     game.theme === 'mystical' ? '#B2DFDB' : '#FFF9C4'
      
      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }
  }

  // 📊 RENDERIZAR UI DEL JUEGO
  const renderGameUI = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Fondo semi-transparente para UI
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'
    ctx.fillRect(0, 0, canvas.width, 80)

    // Estadísticas del juego
    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 18px Arial'
    ctx.fillText(`Score: ${gameState.score}`, 20, 30)
    ctx.fillText(`Lives: ${'❤️'.repeat(gameState.lives)}`, 20, 55)
    ctx.fillText(`Coins: ${gameState.coins}`, 200, 30)
    ctx.fillText(`Time: ${Math.ceil(gameState.time)}`, 200, 55)
    ctx.fillText(`Level: ${gameState.level}`, 350, 30)
    
    // Barra de salud
    const healthBarWidth = 200
    const healthPercentage = player.health / 100
    
    ctx.fillStyle = '#2C3E50'
    ctx.fillRect(canvas.width - healthBarWidth - 20, 20, healthBarWidth, 20)
    ctx.fillStyle = healthPercentage > 0.6 ? '#2ECC71' : healthPercentage > 0.3 ? '#F39C12' : '#E74C3C'
    ctx.fillRect(canvas.width - healthBarWidth - 20, 20, healthBarWidth * healthPercentage, 20)
    
    ctx.strokeStyle = '#ECF0F1'
    ctx.lineWidth = 2
    ctx.strokeRect(canvas.width - healthBarWidth - 20, 20, healthBarWidth, 20)
    
    ctx.fillStyle = '#FFFFFF'
    ctx.font = '14px Arial'
    ctx.fillText(`HP: ${player.health}/100`, canvas.width - healthBarWidth - 15, 55)

    // Power-up indicator
    if (player.powerUpTimer > 0) {
      ctx.fillStyle = '#FFD93D'
      ctx.font = 'bold 16px Arial'
      ctx.fillText(`INVINCIBLE: ${Math.ceil(player.powerUpTimer / 60)}s`, canvas.width - 150, 70)
    }
  }

  // 🎹 CONTROLES DEL JUEGO
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keysPressed.current.add(e.key)
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current.delete(e.key)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // 🏁 FINALIZAR JUEGO
  const finishGame = (won: boolean = false) => {
    stopGameLoop()
    setGameState(prev => ({ ...prev, isPlaying: false }))
    
    if (selectedGame) {
      const finalScore = gameState.score + gameState.coins * 10 + gameState.lives * 100
      
      // Actualizar mejor puntuación
      setGames(prev => prev.map(game => 
        game.id === selectedGame.id 
          ? { ...game, bestScore: Math.max(game.bestScore, finalScore) }
          : game
      ))
      
      onScoreUpdate?.(finalScore)
      toast.success(`¡Juego terminado! Puntuación final: ${finalScore}`)
    }
    
    setSelectedGame(null)
    keysPressed.current.clear()
  }

  // 🎮 RENDERIZADO PRINCIPAL
  const GameCard = ({ game }: { game: MarioGame }) => (
    <Card className="gaming-card group overflow-hidden">
      <div className="relative h-48">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-blue-600" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        
        <div className="absolute top-4 left-4">
          <Badge variant={game.unlocked ? 'default' : 'secondary'}>
            {game.gameType.toUpperCase()}
          </Badge>
        </div>
        
        <div className="absolute top-4 right-4">
          <div className="flex gap-1">
            {Array.from({ length: game.difficulty }, (_, i) => (
              <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>
        
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold mb-1">{game.name}</h3>
          <p className="text-sm opacity-90">{game.description}</p>
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="text-sm">Best: {game.bestScore.toLocaleString()}</span>
            </div>
            {game.completed && (
              <Badge variant="default" className="bg-green-600">
                ✓ Completado
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <Coins className="w-4 h-4 mx-auto text-yellow-500 mb-1" />
              <div>{game.rewards.coins}</div>
            </div>
            <div className="text-center">
              <Star className="w-4 h-4 mx-auto text-purple-500 mb-1" />
              <div>{game.rewards.experience} XP</div>
            </div>
            <div className="text-center">
              <Heart className="w-4 h-4 mx-auto text-red-500 mb-1" />
              <div>+{game.rewards.lives} Vidas</div>
            </div>
          </div>
          
          <Button 
            className="w-full gaming-button"
            onClick={() => game.unlocked ? startGame(game) : null}
            disabled={!game.unlocked}
          >
            {game.unlocked ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                ¡Jugar Ahora!
              </>
            ) : (
              <>
                <span className="mr-2">🔒</span>
                Nivel {Math.ceil(game.difficulty * 1.5)} requerido
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-7xl mx-auto">
        {!selectedGame ? (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
                🎮 Mini-Juegos Estilo Mario Bros
              </h1>
              <p className="text-xl text-white/80">
                Aventuras de plataformas con tus escenarios GIF animados
              </p>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Gamepad2 className="w-5 h-5" />
                  <span className="font-bold">{games.filter(g => g.unlocked).length} Juegos Disponibles</span>
                </div>
              </div>
            </div>

            {/* Grid de juegos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {games.map(game => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Juego activo */}
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-white mb-2">{selectedGame.name}</h2>
              <div className="flex justify-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }))}
                >
                  {gameState.isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                </Button>
                <Button variant="outline" onClick={() => finishGame(false)}>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reiniciar
                </Button>
                <Button variant="destructive" onClick={() => finishGame(false)}>
                  Salir
                </Button>
              </div>
            </div>
            
            {/* Canvas del juego */}
            <div className="flex justify-center">
              <canvas
                ref={canvasRef}
                width={800}
                height={600}
                className="border-4 border-purple-500 rounded-lg bg-black"
              />
            </div>
            
            {/* Controles */}
            <div className="mt-4 text-center text-white space-y-2">
              <p className="text-lg font-semibold">🎮 Controles:</p>
              <div className="flex justify-center gap-8 text-sm">
                <span>← → A D (Mover)</span>
                <span>↑ W Espacio (Saltar)</span>
                <span>Evita obstáculos rojos</span>
                <span>Recoge monedas doradas</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 