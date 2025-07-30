"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Heart, 
  Zap, 
  Smile, 
  Dumbbell, 
  Star, 
  Crown, 
  Plus,
  Apple,
  Gamepad2,
  Sparkles,
  Swords, 
  BookOpen, 
  Shield,
  Settings,
  User,
  ChevronDown,
  ChevronUp,
  Trophy,
  Target,
  Clock,
  Coins,
  Gem
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface Hero {
  id: number
  nombre: string
  clase: string
  poder: string
  elemento: string
  nivel: number
  experiencia: number
  salud: number
  energia: number
  felicidad: number
  fuerza: number
  magia: number
  agilidad: number
  mascotaId?: number
  logros: string[]
  habilidades: string[]
  ultimaActividad: string
}

interface Mascota {
  id: number
  nombre: string
  tipo: string
  elemento: string
  poder: number
  felicidad: number
  energia: number
  salud: number
  hambre: number
  adoptada: boolean
  propietarioId?: number
  nivel: number
  experiencia: number
  habilidades: string[]
  ultimaAlimentacion: string
  ultimoJuego: string
  estado: 'saludable' | 'enferma' | 'hambrienta' | 'cansada'
}

interface HeroCardProps {
  hero: Hero
  mascota?: Mascota
  isSelected: boolean
  onSelect: (hero: Hero) => void
  onMascotaAction: (action: string, mascotaId: number) => Promise<void>
}

export function HeroCard({ hero, mascota, isSelected, onSelect, onMascotaAction }: HeroCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getClassIcon = (clase: string) => {
    switch (clase.toLowerCase()) {
      case "guerrero": return <Swords className="w-4 h-4" />
      case "mago": return <BookOpen className="w-4 h-4" />
      case "arquero": return <Shield className="w-4 h-4" />
      case "tecnólogo": return <Settings className="w-4 h-4" />
      case "espía": return <User className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  const getElementIcon = (elemento: string) => {
    switch (elemento.toLowerCase()) {
      case "fuego": return "🔥"
      case "agua": return "💧"
      case "tierra": return "🌍"
      case "aire": return "💨"
      case "electricidad": return "⚡"
      case "hielo": return "❄️"
      case "luz": return "✨"
      case "oscuridad": return "🌑"
      default: return "⭐"
    }
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case "saludable": return "text-green-600"
      case "enferma": return "text-red-600"
      case "hambrienta": return "text-orange-600"
      case "cansada": return "text-yellow-600"
      default: return "text-gray-600"
    }
  }

  const handleMascotaAction = async (action: string) => {
    if (!mascota) return
    setIsLoading(true)
    try {
      await onMascotaAction(action, mascota.id)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card 
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : 'hover:bg-gray-50'
        }`}
        onClick={() => onSelect(hero)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                  {hero.nombre.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg font-bold text-gray-800">
                  {hero.nombre}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {getClassIcon(hero.clase)}
                  <span>{hero.clase}</span>
                  <span>•</span>
                  <span>{getElementIcon(hero.elemento)} {hero.elemento}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                <Star className="w-3 h-3 mr-1" />
                Nivel {hero.nivel}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsExpanded(!isExpanded)
                }}
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Stats básicos */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              <div className="flex-1">
                <div className="text-xs text-gray-600">Salud</div>
                <Progress value={hero.salud} className="h-2" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-500" />
              <div className="flex-1">
                <div className="text-xs text-gray-600">Energía</div>
                <Progress value={hero.energia} className="h-2" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Smile className="w-4 h-4 text-green-500" />
              <div className="flex-1">
                <div className="text-xs text-gray-600">Felicidad</div>
                <Progress value={hero.felicidad} className="h-2" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-purple-500" />
              <div className="flex-1">
                <div className="text-xs text-gray-600">Fuerza</div>
                <Progress value={hero.fuerza} className="h-2" />
              </div>
            </div>
          </div>

          {/* Información expandida */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Experiencia */}
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Experiencia</span>
                    <span className="text-sm text-gray-600">{hero.experiencia} XP</span>
                  </div>
                  <Progress value={(hero.experiencia % 100)} className="h-2" />
                </div>

                {/* Habilidades */}
                {hero.habilidades.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Habilidades</h4>
                    <div className="flex flex-wrap gap-1">
                      {hero.habilidades.slice(0, 3).map((habilidad, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {habilidad}
                        </Badge>
                      ))}
                      {hero.habilidades.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{hero.habilidades.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Logros */}
                {hero.logros.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Logros</h4>
                    <div className="flex flex-wrap gap-1">
                      {hero.logros.slice(0, 3).map((logro, index) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                          <Trophy className="w-3 h-3 mr-1" />
                          {logro}
                        </Badge>
                      ))}
                      {hero.logros.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{hero.logros.length - 3} más
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Mascota */}
                {mascota && (
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Mascota</h4>
                      <Badge className={`text-xs ${getEstadoColor(mascota.estado)}`}>
                        {mascota.estado}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mb-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-green-500 to-blue-600 text-white text-xs">
                          {mascota.nombre.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{mascota.nombre}</div>
                        <div className="text-xs text-gray-600">
                          {getElementIcon(mascota.elemento)} {mascota.tipo} • Nivel {mascota.nivel}
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMascotaAction('alimentar')
                        }}
                        disabled={isLoading}
                        className="text-xs"
                      >
                        <Apple className="w-3 h-3 mr-1" />
                        Alimentar
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMascotaAction('jugar')
                        }}
                        disabled={isLoading}
                        className="text-xs"
                      >
                        <Gamepad2 className="w-3 h-3 mr-1" />
                        Jugar
                      </Button>
                    </div>
                  </div>
                )}

                {/* Última actividad */}
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  Última actividad: {formatDistanceToNow(new Date(hero.ultimaActividad), { 
                    addSuffix: true, 
                    locale: es 
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  )
} 