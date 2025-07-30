'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { toast } from 'sonner'
import Image from 'next/image'
import { 
  Play, 
  Pause, 
  Trophy, 
  Star, 
  Timer, 
  Target, 
  Gamepad2, 
  Map,
  Camera,
  Zap,
  Heart,
  Coins,
  Award,
  ChevronRight
} from 'lucide-react'

// 🎮 INTERFACES PARA ESCENARIOS ÉPICOS
interface ScenarioGame {
  id: string
  name: string
  description: string
  backgroundImage: string
  backgroundType: 'static' | 'animated' | 'webp'
  gameType: 'platformer' | 'puzzle' | 'rpg' | 'hidden_objects' | 'racing' | 'exploration'
  difficulty: 1 | 2 | 3 | 4 | 5
  theme: 'mystical' | 'nature' | 'underwater' | 'cosmic' | 'ethereal' | 'ancient'
  rewards: {
    coins: number
    experience: number
    items: string[]
  }
  unlockCondition: string
  isUnlocked: boolean
  bestScore: number
  completed: boolean
}

interface GameState {
  isPlaying: boolean
  isPaused: boolean
  score: number
  lives: number
  time: number
  level: number
  collectibles: number
  enemies_defeated: number
  objectives_completed: string[]
}

interface Player {
  x: number
  y: number
  width: number
  height: number
  velocityX: number
  velocityY: number
  onGround: boolean
  facing: 'left' | 'right'
  health: number
  maxHealth: number
}

interface GameObject {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: 'platform' | 'collectible' | 'enemy' | 'portal' | 'puzzle_piece' | 'hidden_object'
  color: string
  collected?: boolean
  defeated?: boolean
  properties?: Record<string, any>
}

export default function EnhancedScenarioGames({ 
  onGameComplete, 
  playerLevel = 8, 
  playerCoins = 3000 
}: {
  onGameComplete?: (rewards: any) => void
  playerLevel?: number
  playerCoins?: number
}) {
  // 🎮 ESTADOS PRINCIPALES
  const [games, setGames] = useState<ScenarioGame[]>([])
  const [selectedGame, setSelectedGame] = useState<ScenarioGame | null>(null)
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    isPaused: false,
    score: 0,
    lives: 3,
    time: 0,
    level: 1,
    collectibles: 0,
    enemies_defeated: 0,
    objectives_completed: []
  })
  const [player, setPlayer] = useState<Player>({
    x: 100,
    y: 300,
    width: 40,
    height: 40,
    velocityX: 0,
    velocityY: 0,
    onGround: false,
    facing: 'right',
    health: 100,
    maxHealth: 100
  })
  const [gameObjects, setGameObjects] = useState<GameObject[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const gameLoopRef = useRef<number>()

  // 🗺️ DATOS DE JUEGOS CON ESCENARIOS REALES
  useEffect(() => {
    const scenarioGames: ScenarioGame[] = [
      {
        id: 'mystical_forest_adventure',
        name: 'Aventura del Bosque Místico',
        description: 'Explora un bosque encantado lleno de secretos y criaturas mágicas',
        backgroundImage: '/escenarios/download.jpg',
        backgroundType: 'static',
        gameType: 'platformer',
        difficulty: 3,
        theme: 'mystical',
        rewards: {
          coins: 150,
          experience: 75,
          items: ['pocion_bosque', 'amuleto_naturaleza']
        },
        unlockCondition: 'Disponible desde el inicio',
        isUnlocked: true,
        bestScore: 0,
        completed: false
      },
      {
        id: 'animated_crystal_realm',
        name: 'Reino de Cristales Animados',
        description: 'Navega por un mundo de cristales en constante movimiento y energía pura',
        backgroundImage: '/escenarios/a98a1fe05019c395040c7872f7a26be4.gif',
        backgroundType: 'animated',
        gameType: 'puzzle',
        difficulty: 4,
        theme: 'cosmic',
        rewards: {
          coins: 200,
          experience: 100,
          items: ['cristal_poder', 'fragmento_energia']
        },
        unlockCondition: 'Completa Bosque Místico',
        isUnlocked: playerLevel >= 3,
        bestScore: 0,
        completed: false
      },
      {
        id: 'ethereal_dance_dimension',
        name: 'Dimensión de Danza Etérea',
        description: 'Sumérgete en un mundo donde las ondas de energía bailan en armonía',
        backgroundImage: '/escenarios/46ac9e282d3c303934a72d941845785b.gif',
        backgroundType: 'animated',
        gameType: 'rpg',
        difficulty: 4,
        theme: 'ethereal',
        rewards: {
          coins: 250,
          experience: 125,
          items: ['orbe_danza', 'vara_armonia']
        },
        unlockCondition: 'Nivel 5 requerido',
        isUnlocked: playerLevel >= 5,
        bestScore: 0,
        completed: false
      },
      {
        id: 'ancient_scenario_exploration',
        name: 'Exploración del Escenario Ancestral',
        description: 'Descubre los secretos de una civilización perdida en este paisaje épico',
        backgroundImage: '/escenarios/PruebaEscenario 2022-10-02 16-01-40-original.webp',
        backgroundType: 'webp',
        gameType: 'exploration',
        difficulty: 5,
        theme: 'ancient',
        rewards: {
          coins: 300,
          experience: 150,
          items: ['reliquia_ancestral', 'mapa_secreto', 'gema_tiempo']
        },
        unlockCondition: 'Completa los 3 escenarios anteriores',
        isUnlocked: playerLevel >= 7,
        bestScore: 0,
        completed: false
      },
      {
        id: 'underwater_palace_quest',
        name: 'Palacio Submarino Legendario',
        description: 'Sumérgete en las profundidades para encontrar el palacio perdido',
        backgroundImage: '/escenarios/download.jpg', // Reutilizada con filtro azul
        backgroundType: 'static',
        gameType: 'hidden_objects',
        difficulty: 3,
        theme: 'underwater',
        rewards: {
          coins: 175,
          experience: 90,
          items: ['perla_oceano', 'tridente_agua']
        },
        unlockCondition: 'Nivel 4 requerido',
        isUnlocked: playerLevel >= 4,
        bestScore: 0,
        completed: false
      },
      {
        id: 'sky_fortress_racing',
        name: 'Carrera en la Fortaleza Celeste',
        description: 'Corre a través de plataformas flotantes en el cielo infinito',
        backgroundImage: '/escenarios/a98a1fe05019c395040c7872f7a26be4.gif', // Reutilizada con filtro
        backgroundType: 'animated',
        gameType: 'racing',
        difficulty: 5,
        theme: 'cosmic',
        rewards: {
          coins: 400,
          experience: 200,
          items: ['botas_viento', 'alas_cristal', 'corona_cielo']
        },
        unlockCondition: 'Maestro de todos los escenarios',
        isUnlocked: playerLevel >= 10,
        bestScore: 0,
        completed: false
      }
    ]

    setGames(scenarioGames)
  }, [playerLevel])

  // 🎮 INICIALIZAR JUEGO
  const startGame = (game: ScenarioGame) => {
    setSelectedGame(game)
    setGameState({
      isPlaying: true,
      isPaused: false,
      score: 0,
      lives: 3,
      time: 0,
      level: 1,
      collectibles: 0,
      enemies_defeated: 0,
      objectives_completed: []
    })
    
    setPlayer({
      x: 100,
      y: 300,
      width: 40,
      height: 40,
      velocityX: 0,
      velocityY: 0,
      onGround: false,
      facing: 'right',
      health: 100,
      maxHealth: 100
    })

    // Generar objetos del juego según el tipo
    generateGameObjects(game)
    
    toast.success(`¡${game.name} iniciado! Buena suerte aventurero!`)
    startGameLoop()
  }

  // 🏗️ GENERAR OBJETOS DEL JUEGO
  const generateGameObjects = (game: ScenarioGame) => {
    const objects: GameObject[] = []
    
    // Plataformas base
    objects.push(
      { id: 'ground', x: 0, y: 550, width: 800, height: 50, type: 'platform', color: '#8B4513' },
      { id: 'platform1', x: 200, y: 450, width: 150, height: 20, type: 'platform', color: '#654321' },
      { id: 'platform2', x: 400, y: 350, width: 150, height: 20, type: 'platform', color: '#654321' },
      { id: 'platform3', x: 600, y: 250, width: 150, height: 20, type: 'platform', color: '#654321' }
    )

    // Objetos específicos por tipo de juego
    switch (game.gameType) {
      case 'platformer':
        // Collectibles y enemigos para plataformas
        objects.push(
          { id: 'coin1', x: 250, y: 400, width: 20, height: 20, type: 'collectible', color: '#FFD700' },
          { id: 'coin2', x: 450, y: 300, width: 20, height: 20, type: 'collectible', color: '#FFD700' },
          { id: 'coin3', x: 650, y: 200, width: 20, height: 20, type: 'collectible', color: '#FFD700' },
          { id: 'enemy1', x: 300, y: 430, width: 30, height: 30, type: 'enemy', color: '#FF4444' },
          { id: 'portal', x: 700, y: 200, width: 40, height: 60, type: 'portal', color: '#8A2BE2' }
        )
        break
        
      case 'puzzle':
        // Piezas de puzzle
        for (let i = 0; i < 5; i++) {
          objects.push({
            id: `puzzle_${i}`,
            x: 150 + i * 120,
            y: 400 - i * 50,
            width: 25,
            height: 25,
            type: 'puzzle_piece',
            color: `hsl(${i * 72}, 70%, 50%)`
          })
        }
        break
        
      case 'hidden_objects':
        // Objetos ocultos
        for (let i = 0; i < 8; i++) {
          objects.push({
            id: `hidden_${i}`,
            x: Math.random() * 700 + 50,
            y: Math.random() * 400 + 100,
            width: 15,
            height: 15,
            type: 'hidden_object',
            color: '#32CD32',
            properties: { hidden: true, alpha: 0.3 }
          })
        }
        break
        
      case 'exploration':
        // Puntos de interés para explorar
        objects.push(
          { id: 'artifact1', x: 150, y: 500, width: 30, height: 30, type: 'collectible', color: '#DAA520' },
          { id: 'artifact2', x: 350, y: 400, width: 30, height: 30, type: 'collectible', color: '#DAA520' },
          { id: 'artifact3', x: 550, y: 300, width: 30, height: 30, type: 'collectible', color: '#DAA520' },
          { id: 'rune1', x: 200, y: 200, width: 25, height: 25, type: 'puzzle_piece', color: '#9932CC' },
          { id: 'rune2', x: 500, y: 150, width: 25, height: 25, type: 'puzzle_piece', color: '#9932CC' }
        )
        break
    }

    setGameObjects(objects)
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

    setGameState(prev => ({
      ...prev,
      time: prev.time + 1
    }))

    // Actualizar jugador
    setPlayer(prev => {
      let newPlayer = { ...prev }
      
      // Gravedad
      if (!newPlayer.onGround) {
        newPlayer.velocityY += 0.8
      }
      
      // Actualizar posición
      newPlayer.x += newPlayer.velocityX
      newPlayer.y += newPlayer.velocityY
      
      // Fricción
      newPlayer.velocityX *= 0.9
      
      // Colisiones con plataformas
      newPlayer.onGround = false
      gameObjects.forEach(obj => {
        if (obj.type === 'platform') {
          if (newPlayer.x < obj.x + obj.width &&
              newPlayer.x + newPlayer.width > obj.x &&
              newPlayer.y < obj.y + obj.height &&
              newPlayer.y + newPlayer.height > obj.y) {
            
            // Colisión desde arriba
            if (prev.y + prev.height <= obj.y) {
              newPlayer.y = obj.y - newPlayer.height
              newPlayer.velocityY = 0
              newPlayer.onGround = true
            }
          }
        }
      })
      
      // Límites del canvas
      if (newPlayer.x < 0) newPlayer.x = 0
      if (newPlayer.x + newPlayer.width > 800) newPlayer.x = 800 - newPlayer.width
      if (newPlayer.y > 600) {
        // Resetear posición si cae
        newPlayer.x = 100
        newPlayer.y = 300
        newPlayer.velocityY = 0
        setGameState(prev => ({ ...prev, lives: prev.lives - 1 }))
      }
      
      return newPlayer
    })

    // Colisiones con collectibles
    setGameObjects(prev => prev.map(obj => {
      if ((obj.type === 'collectible' || obj.type === 'puzzle_piece' || obj.type === 'hidden_object') && !obj.collected) {
        if (player.x < obj.x + obj.width &&
            player.x + player.width > obj.x &&
            player.y < obj.y + obj.height &&
            player.y + player.height > obj.y) {
          
          setGameState(prev => ({
            ...prev,
            score: prev.score + 100,
            collectibles: prev.collectibles + 1
          }))
          
          toast.success('+100 puntos!')
          return { ...obj, collected: true }
        }
      }
      return obj
    }))
  }

  // 🎨 RENDERIZAR JUEGO
  const renderGame = () => {
    const canvas = canvasRef.current
    if (!canvas || !selectedGame) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Limpiar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Renderizar fondo del escenario
    renderBackground(ctx, selectedGame, canvas)

    // Renderizar plataformas
    gameObjects.forEach(obj => {
      if (obj.type === 'platform') {
        ctx.fillStyle = obj.color
        ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
        
        // Borde para mejor visibilidad
        ctx.strokeStyle = '#000'
        ctx.lineWidth = 2
        ctx.strokeRect(obj.x, obj.y, obj.width, obj.height)
      }
    })

    // Renderizar collectibles y otros objetos
    gameObjects.forEach(obj => {
      if (obj.type !== 'platform' && !obj.collected && !obj.defeated) {
        ctx.save()
        
        if (obj.properties?.alpha) {
          ctx.globalAlpha = obj.properties.alpha
        }
        
        ctx.fillStyle = obj.color
        
        // Formas especiales según tipo
        switch (obj.type) {
          case 'collectible':
            // Moneda circular
            ctx.beginPath()
            ctx.arc(obj.x + obj.width/2, obj.y + obj.height/2, obj.width/2, 0, Math.PI * 2)
            ctx.fill()
            ctx.strokeStyle = '#FFB000'
            ctx.lineWidth = 2
            ctx.stroke()
            break
            
          case 'enemy':
            // Enemigo triangular
            ctx.beginPath()
            ctx.moveTo(obj.x + obj.width/2, obj.y)
            ctx.lineTo(obj.x, obj.y + obj.height)
            ctx.lineTo(obj.x + obj.width, obj.y + obj.height)
            ctx.closePath()
            ctx.fill()
            break
            
          case 'portal':
            // Portal con efecto
            ctx.fillStyle = `hsl(${(gameState.time * 2) % 360}, 70%, 50%)`
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
            break
            
          case 'puzzle_piece':
            // Pieza de puzzle
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
            ctx.strokeStyle = '#000'
            ctx.lineWidth = 2
            ctx.strokeRect(obj.x, obj.y, obj.width, obj.height)
            break
            
          default:
            ctx.fillRect(obj.x, obj.y, obj.width, obj.height)
        }
        
        ctx.restore()
      }
    })

    // Renderizar jugador
    ctx.fillStyle = '#4169E1'
    ctx.fillRect(player.x, player.y, player.width, player.height)
    
    // Cara del jugador
    ctx.fillStyle = '#FFF'
    ctx.fillRect(player.x + 10, player.y + 10, 6, 6)
    ctx.fillRect(player.x + 24, player.y + 10, 6, 6)
    ctx.fillRect(player.x + 15, player.y + 20, 10, 4)

    // UI del juego
    renderGameUI(ctx, canvas)
  }

  // 🖼️ RENDERIZAR FONDO CON FILTROS POR TEMA
  const renderBackground = (ctx: CanvasRenderingContext2D, game: ScenarioGame, canvas: HTMLCanvasElement) => {
    // Aplicar filtros según el tema
    const filters = {
      mystical: 'saturate(1.2) hue-rotate(30deg) brightness(0.9)',
      underwater: 'saturate(1.3) hue-rotate(180deg) brightness(0.8)',
      cosmic: 'saturate(1.5) hue-rotate(280deg) brightness(1.1)',
      ethereal: 'saturate(1.4) hue-rotate(120deg) brightness(1.0)',
      ancient: 'sepia(0.3) saturate(1.1) brightness(0.95)',
      nature: 'saturate(1.3) hue-rotate(90deg)'
    }

    // Gradiente base según el tema
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
    
    switch (game.theme) {
      case 'mystical':
        gradient.addColorStop(0, '#4A0E4E')
        gradient.addColorStop(1, '#81007F')
        break
      case 'underwater':
        gradient.addColorStop(0, '#006494')
        gradient.addColorStop(1, '#0077BE')
        break
      case 'cosmic':
        gradient.addColorStop(0, '#1a1a2e')
        gradient.addColorStop(1, '#16213e')
        break
      case 'ethereal':
        gradient.addColorStop(0, '#667eea')
        gradient.addColorStop(1, '#764ba2')
        break
      case 'ancient':
        gradient.addColorStop(0, '#8B4513')
        gradient.addColorStop(1, '#DEB887')
        break
      default:
        gradient.addColorStop(0, '#87CEEB')
        gradient.addColorStop(1, '#98FB98')
    }

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Efectos de partículas según el tema
    renderThemeEffects(ctx, game.theme)
  }

  // ✨ EFECTOS TEMÁTICOS
  const renderThemeEffects = (ctx: CanvasRenderingContext2D, theme: string) => {
    const particleCount = 20
    
    for (let i = 0; i < particleCount; i++) {
      const x = (gameState.time * 0.5 + i * 40) % 850
      const y = 50 + Math.sin(gameState.time * 0.01 + i) * 30
      
      ctx.save()
      ctx.globalAlpha = 0.6
      
      switch (theme) {
        case 'mystical':
          ctx.fillStyle = '#FF69B4'
          ctx.beginPath()
          ctx.arc(x, y, 3, 0, Math.PI * 2)
          ctx.fill()
          break
          
        case 'underwater':
          ctx.fillStyle = '#40E0D0'
          ctx.beginPath()
          ctx.arc(x, y + Math.sin(gameState.time * 0.02 + i) * 20, 4, 0, Math.PI * 2)
          ctx.fill()
          break
          
        case 'cosmic':
          ctx.fillStyle = '#FFF'
          ctx.fillRect(x, y, 2, 2)
          break
          
        case 'ethereal':
          ctx.fillStyle = `hsl(${(gameState.time + i * 30) % 360}, 70%, 70%)`
          ctx.beginPath()
          ctx.arc(x, y, 2, 0, Math.PI * 2)
          ctx.fill()
          break
      }
      
      ctx.restore()
    }
  }

  // 📊 RENDERIZAR UI DEL JUEGO
  const renderGameUI = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Fondo semi-transparente para UI
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
    ctx.fillRect(0, 0, canvas.width, 60)

    // Texto de estadísticas
    ctx.fillStyle = '#FFF'
    ctx.font = '16px Arial'
    ctx.fillText(`Puntuación: ${gameState.score}`, 10, 25)
    ctx.fillText(`Vidas: ${'❤️'.repeat(gameState.lives)}`, 10, 45)
    ctx.fillText(`Tiempo: ${Math.floor(gameState.time / 60)}`, 200, 25)
    ctx.fillText(`Objetos: ${gameState.collectibles}`, 200, 45)
    
    // Barra de salud del jugador
    const healthBarWidth = 150
    const healthPercentage = player.health / player.maxHealth
    
    ctx.fillStyle = '#333'
    ctx.fillRect(canvas.width - healthBarWidth - 20, 10, healthBarWidth, 20)
    ctx.fillStyle = healthPercentage > 0.5 ? '#4CAF50' : healthPercentage > 0.25 ? '#FF9800' : '#F44336'
    ctx.fillRect(canvas.width - healthBarWidth - 20, 10, healthBarWidth * healthPercentage, 20)
    
    ctx.strokeStyle = '#FFF'
    ctx.lineWidth = 2
    ctx.strokeRect(canvas.width - healthBarWidth - 20, 10, healthBarWidth, 20)
    
    ctx.fillStyle = '#FFF'
    ctx.font = '12px Arial'
    ctx.fillText('Salud', canvas.width - healthBarWidth - 15, 45)
  }

  // 🎹 CONTROLES DEL JUEGO
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!gameState.isPlaying || gameState.isPaused) return

      setPlayer(prev => {
        let newPlayer = { ...prev }
        
        switch (e.key) {
          case 'ArrowLeft':
          case 'a':
            newPlayer.velocityX = -5
            newPlayer.facing = 'left'
            break
          case 'ArrowRight':
          case 'd':
            newPlayer.velocityX = 5
            newPlayer.facing = 'right'
            break
          case 'ArrowUp':
          case 'w':
          case ' ':
            if (newPlayer.onGround) {
              newPlayer.velocityY = -15
              newPlayer.onGround = false
            }
            break
        }
        
        return newPlayer
      })
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameState.isPlaying, gameState.isPaused])

  // 🏁 FINALIZAR JUEGO
  const finishGame = (won: boolean) => {
    stopGameLoop()
    
    setGameState(prev => ({ ...prev, isPlaying: false }))
    
    if (selectedGame && won) {
      const finalScore = gameState.score + (gameState.lives * 50) + Math.max(0, 1000 - gameState.time)
      
      // Actualizar mejor puntuación
      setGames(prev => prev.map(game => 
        game.id === selectedGame.id 
          ? { ...game, bestScore: Math.max(game.bestScore, finalScore), completed: true }
          : game
      ))
      
      // Recompensas
      const rewards = {
        coins: selectedGame.rewards.coins,
        experience: selectedGame.rewards.experience,
        items: selectedGame.rewards.items,
        score: finalScore
      }
      
      onGameComplete?.(rewards)
      toast.success(`¡Escenario completado! +${rewards.coins} monedas, +${rewards.experience} XP`)
    }
    
    setSelectedGame(null)
  }

  // 🎮 RENDER PRINCIPAL
  const GameCard = ({ game }: { game: ScenarioGame }) => (
    <Card className="gaming-card group overflow-hidden">
      <div className="relative h-48">
        <Image
          src={game.backgroundImage}
          alt={game.name}
          fill
          className="object-cover transition-all duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute top-4 left-4">
          <Badge variant={game.isUnlocked ? 'default' : 'secondary'}>
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
              <span className="text-sm">Mejor: {game.bestScore.toLocaleString()}</span>
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
              <Award className="w-4 h-4 mx-auto text-blue-500 mb-1" />
              <div>{game.rewards.items.length} Items</div>
            </div>
          </div>
          
          <Button 
            className="w-full gaming-button"
            onClick={() => game.isUnlocked ? startGame(game) : null}
            disabled={!game.isUnlocked}
          >
            {game.isUnlocked ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Jugar Escenario
              </>
            ) : (
              <>
                <span className="mr-2">🔒</span>
                {game.unlockCondition}
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
                🗺️ Escenarios Épicos Personalizados
              </h1>
              <p className="text-xl text-white/80">
                Explora mundos creados desde tus imágenes reales
              </p>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Coins className="w-5 h-5" />
                  <span className="font-bold">{playerCoins.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-purple-400">
                  <Star className="w-5 h-5" />
                  <span className="font-bold">Nivel {playerLevel}</span>
                </div>
              </div>
            </div>

            {/* Grid de juegos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="border-4 border-purple-500 rounded-lg bg-gradient-to-b from-sky-400 to-green-400"
              />
            </div>
            
            {/* Controles */}
            <div className="mt-4 text-center text-white">
              <p>Controles: ← → (Mover) | ↑ Espacio (Saltar) | WASD también funciona</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
} 