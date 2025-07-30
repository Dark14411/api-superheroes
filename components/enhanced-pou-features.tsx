"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  Sparkles,
  Trophy,
  Gift,
  Calendar,
  Camera,
  Volume2,
  VolumeX,
  MessageCircle,
  Share2,
  Download,
  Medal,
  Crown,
  Gem,
  Star,
  Coins,
  Clock,
  Target,
  Flame,
  Zap
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "sonner"

interface PouMood {
  id: string
  name: string
  emoji: string
  condition: (stats: any) => boolean
  effects: string[]
  duration: number
}

interface PouEvent {
  id: string
  name: string
  description: string
  icon: any
  rarity: 'common' | 'rare' | 'legendary'
  reward: {
    coins?: number
    experience?: number
    special_item?: string
  }
  probability: number
}

interface PouPhotoMemory {
  id: string
  photo: string
  timestamp: Date
  mood: string
  level: number
  description: string
  likes: number
}

export default function EnhancedPouFeatures({ pouStats, setPouStats, pouCustomization }: {
  pouStats: any
  setPouStats: (fn: any) => void
  pouCustomization: any
}) {
  const [currentMood, setCurrentMood] = useState<PouMood | null>(null)
  const [dailyEvents, setDailyEvents] = useState<PouEvent[]>([])
  const [photoMemories, setPhotoMemories] = useState<PouPhotoMemory[]>([])
  const [showPhotoDialog, setShowPhotoDialog] = useState(false)
  const [showEventsDialog, setShowEventsDialog] = useState(false)
  const [socialStats, setSocialStats] = useState({
    friends: 12,
    photos_shared: 23,
    likes_received: 156,
    daily_streak: 7
  })
  const [achievements, setAchievements] = useState([
    { id: 'first_feed', name: 'Primera Comida', description: 'Alimenta a Pou por primera vez', unlocked: true, icon: '🍎' },
    { id: 'level_5', name: 'Crecimiento', description: 'Alcanza el nivel 5', unlocked: pouStats.level >= 5, icon: '⭐' },
    { id: 'happy_pou', name: 'Pou Feliz', description: 'Mantén a Pou 100% feliz por 5 minutos', unlocked: false, icon: '😄' },
    { id: 'photo_lover', name: 'Fotógrafo', description: 'Toma 10 fotos de Pou', unlocked: photoMemories.length >= 10, icon: '📸' },
    { id: 'social_butterfly', name: 'Mariposa Social', description: 'Recibe 100 likes en fotos', unlocked: socialStats.likes_received >= 100, icon: '🦋' },
    { id: 'master_trainer', name: 'Entrenador Maestro', description: 'Completa 50 mini-juegos', unlocked: false, icon: '🏆' }
  ])

  // Estados de ánimo de Pou
  const pouMoods: PouMood[] = [
    {
      id: 'happy',
      name: 'Súper Feliz',
      emoji: '😄',
      condition: (stats) => stats.happiness > 90 && stats.health > 80,
      effects: ['XP doble', 'Monedas extra', 'Efectos especiales'],
      duration: 300
    },
    {
      id: 'playful',
      name: 'Juguetón',
      emoji: '😆',
      condition: (stats) => stats.energy > 80 && stats.happiness > 70,
      effects: ['Mini-juegos más fáciles', 'Recompensas de juego +50%'],
      duration: 180
    },
    {
      id: 'sleepy',
      name: 'Somnoliento',
      emoji: '😴',
      condition: (stats) => stats.energy < 30,
      effects: ['Regeneración lenta', 'Necesita dormir'],
      duration: 120
    },
    {
      id: 'sick',
      name: 'Enfermo',
      emoji: '🤒',
      condition: (stats) => stats.health < 20,
      effects: ['Estadísticas bajan más rápido', 'Necesita medicina'],
      duration: 240
    },
    {
      id: 'excited',
      name: 'Emocionado',
      emoji: '🤩',
      condition: (stats) => stats.level > pouStats.level, // Cuando sube de nivel
      effects: ['Todas las acciones dan XP extra', 'Animaciones especiales'],
      duration: 600
    }
  ]

  // Eventos diarios
  const pouEvents: PouEvent[] = [
    {
      id: 'lucky_coins',
      name: 'Lluvia de Monedas',
      description: '¡Pou encontró monedas escondidas!',
      icon: Coins,
      rarity: 'common',
      reward: { coins: 50 },
      probability: 0.3
    },
    {
      id: 'xp_boost',
      name: 'Día de Aprendizaje',
      description: 'Pou está extra motivado hoy',
      icon: Star,
      rarity: 'common',
      reward: { experience: 25 },
      probability: 0.25
    },
    {
      id: 'rare_visit',
      name: 'Visita Especial',
      description: 'Un amigo misterioso visitó a Pou',
      icon: Gift,
      rarity: 'rare',
      reward: { coins: 100, experience: 50 },
      probability: 0.1
    },
    {
      id: 'legendary_moment',
      name: 'Momento Legendario',
      description: '¡Algo mágico ha ocurrido!',
      icon: Crown,
      rarity: 'legendary',
      reward: { coins: 500, experience: 200, special_item: 'golden_crown' },
      probability: 0.02
    }
  ]

  // Detectar estado de ánimo
  useEffect(() => {
    const detectMood = () => {
      const mood = pouMoods.find(m => m.condition(pouStats))
      if (mood && (!currentMood || currentMood.id !== mood.id)) {
        setCurrentMood(mood)
        toast.info(`¡Pou está ${mood.name}! ${mood.emoji}`)
      }
    }

    detectMood()
  }, [pouStats])

  // Generar eventos diarios
  useEffect(() => {
    const generateDailyEvents = () => {
      const events: PouEvent[] = []
      pouEvents.forEach(event => {
        if (Math.random() < event.probability) {
          events.push(event)
        }
      })
      setDailyEvents(events)
    }

    // Generar eventos al cargar y cada 24 horas
    const lastEventDate = localStorage.getItem('lastPouEventDate')
    const today = new Date().toDateString()
    
    if (lastEventDate !== today) {
      generateDailyEvents()
      localStorage.setItem('lastPouEventDate', today)
    }
  }, [])

  // Tomar foto de Pou
  const takePhoto = () => {
    const newPhoto: PouPhotoMemory = {
      id: Date.now().toString(),
      photo: `pou_${pouStats.level}_${currentMood?.id || 'normal'}`,
      timestamp: new Date(),
      mood: currentMood?.name || 'Normal',
      level: pouStats.level,
      description: `Pou nivel ${pouStats.level} sintiéndose ${currentMood?.name || 'normal'}`,
      likes: 0
    }

    setPhotoMemories(prev => [newPhoto, ...prev.slice(0, 19)]) // Mantener últimas 20 fotos
    
    // Recompensa por foto
    setPouStats((prev: any) => ({
      ...prev,
      experience: prev.experience + 5,
      happiness: Math.min(100, prev.happiness + 3)
    }))

    toast.success('¡Foto guardada! +5 XP')
  }

  // Procesar evento diario
  const processEvent = (event: PouEvent) => {
    setPouStats((prev: any) => ({
      ...prev,
      coins: prev.coins + (event.reward.coins || 0),
      experience: prev.experience + (event.reward.experience || 0)
    }))

    if (event.reward.special_item) {
      toast.success(`¡Item especial obtenido: ${event.reward.special_item}!`)
    }

    // Remover evento procesado
    setDailyEvents(prev => prev.filter(e => e.id !== event.id))
    
    let rewardText = ''
    if (event.reward.coins) rewardText += `+${event.reward.coins} 🪙 `
    if (event.reward.experience) rewardText += `+${event.reward.experience} XP`
    
    toast.success(`${event.name}: ${rewardText}`)
  }

  // Dar like a una foto
  const likePhoto = (photoId: string) => {
    setPhotoMemories(prev => prev.map(photo => 
      photo.id === photoId 
        ? { ...photo, likes: photo.likes + 1 }
        : photo
    ))
    
    setSocialStats(prev => ({
      ...prev,
      likes_received: prev.likes_received + 1
    }))
  }

  // Compartir foto
  const sharePhoto = (photo: PouPhotoMemory) => {
    if (navigator.share) {
      navigator.share({
        title: `Mi Pou - ${photo.description}`,
        text: `¡Mira mi Pou nivel ${photo.level}! Está ${photo.mood.toLowerCase()}`,
        url: window.location.href
      })
    } else {
      // Fallback para navegadores sin Web Share API
      navigator.clipboard.writeText(`¡Mira mi Pou nivel ${photo.level}! ${window.location.href}`)
      toast.success('¡Enlace copiado al portapapeles!')
    }
    
    setSocialStats(prev => ({
      ...prev,
      photos_shared: prev.photos_shared + 1
    }))
  }

  return (
    <div className="space-y-6">
      {/* Estado de Ánimo Actual */}
      {currentMood && (
        <Card className="border-l-4 border-l-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentMood.emoji}</span>
              <div>
                <h3 className="font-bold text-yellow-800">Pou está {currentMood.name}</h3>
                <div className="flex flex-wrap gap-2 mt-1">
                  {currentMood.effects.map((effect, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {effect}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="ml-auto text-right">
                <div className="text-sm text-gray-600">Duración</div>
                <div className="font-semibold">{Math.floor(currentMood.duration / 60)}min</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Eventos Diarios */}
      {dailyEvents.length > 0 && (
        <Card className="border-l-4 border-l-purple-400">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Eventos Diarios
              <Badge className="ml-auto">{dailyEvents.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dailyEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-3 bg-purple-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <event.icon className="h-6 w-6 text-purple-600" />
                  <div>
                    <h4 className="font-semibold">{event.name}</h4>
                    <p className="text-sm text-gray-600">{event.description}</p>
                  </div>
                  <Badge variant={event.rarity === 'legendary' ? 'destructive' : event.rarity === 'rare' ? 'secondary' : 'default'}>
                    {event.rarity}
                  </Badge>
                </div>
                <Button onClick={() => processEvent(event)} size="sm">
                  Reclamar
                </Button>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Panel de Funciones Sociales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button onClick={takePhoto} className="h-20 flex flex-col gap-1">
          <Camera className="h-6 w-6" />
          <span className="text-xs">Tomar Foto</span>
        </Button>
        
        <Button onClick={() => setShowPhotoDialog(true)} variant="outline" className="h-20 flex flex-col gap-1">
          <Heart className="h-6 w-6" />
          <span className="text-xs">Memorias</span>
          <Badge variant="secondary" className="text-xs">{photoMemories.length}</Badge>
        </Button>
        
        <Button onClick={() => setShowEventsDialog(true)} variant="outline" className="h-20 flex flex-col gap-1">
          <Trophy className="h-6 w-6" />
          <span className="text-xs">Logros</span>
          <Badge variant="secondary" className="text-xs">{achievements.filter(a => a.unlocked).length}/{achievements.length}</Badge>
        </Button>
        
        <Button variant="outline" className="h-20 flex flex-col gap-1">
          <MessageCircle className="h-6 w-6" />
          <span className="text-xs">Social</span>
          <Badge variant="secondary" className="text-xs">{socialStats.friends}</Badge>
        </Button>
      </div>

      {/* Estadísticas Sociales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Estadísticas Sociales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{socialStats.friends}</div>
              <div className="text-sm text-gray-600">Amigos</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{socialStats.photos_shared}</div>
              <div className="text-sm text-gray-600">Fotos Compartidas</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{socialStats.likes_received}</div>
              <div className="text-sm text-gray-600">Likes Recibidos</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{socialStats.daily_streak}</div>
              <div className="text-sm text-gray-600">Racha Diaria</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal de Fotos */}
      <Dialog open={showPhotoDialog} onOpenChange={setShowPhotoDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5" />
              Memorias de Pou
            </DialogTitle>
            <DialogDescription>
              Tus mejores momentos con Pou
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photoMemories.map((photo) => (
              <Card key={photo.id} className="overflow-hidden">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📸</div>
                    <div className="text-sm font-medium">Nivel {photo.level}</div>
                    <div className="text-xs text-gray-600">{photo.mood}</div>
                  </div>
                </div>
                <CardContent className="p-3">
                  <p className="text-xs text-gray-600 mb-2">{photo.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {photo.timestamp.toLocaleDateString()}
                    </span>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => likePhoto(photo.id)}>
                        <Heart className="h-3 w-3" />
                        <span className="ml-1 text-xs">{photo.likes}</span>
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => sharePhoto(photo)}>
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {photoMemories.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Camera className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>¡Toma tu primera foto de Pou!</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Logros */}
      <Dialog open={showEventsDialog} onOpenChange={setShowEventsDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Logros de Pou
            </DialogTitle>
            <DialogDescription>
              Desbloquea logros cuidando bien a tu Pou
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className={`${achievement.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${achievement.unlocked ? 'text-green-800' : 'text-gray-600'}`}>
                        {achievement.name}
                      </h3>
                      <p className={`text-sm ${achievement.unlocked ? 'text-green-600' : 'text-gray-500'}`}>
                        {achievement.description}
                      </p>
                    </div>
                    {achievement.unlocked && (
                      <Badge className="bg-green-100 text-green-800">
                        ¡Desbloqueado!
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 