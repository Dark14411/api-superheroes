"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Calendar, 
  Gift, 
  Trophy, 
  Clock, 
  Star, 
  Bell, 
  X, 
  CheckCircle,
  Play,
  ShoppingBag,
  Target,
  Zap,
  Heart,
  Coins
} from "lucide-react"
import { useEvents } from "@/hooks/use-events"
import { useTranslations } from "@/hooks/use-translations"

export default function Events() {
  const [activeTab, setActiveTab] = useState("current")
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [showEventDetails, setShowEventDetails] = useState(false)
  const { 
    currentEvents, 
    eventProgress, 
    notifications, 
    clearNotifications, 
    claimReward,
    getUpcomingEvents,
    predefinedEvents
  } = useEvents()
  const { t } = useTranslations()

  const upcomingEvents = getUpcomingEvents()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getTimeRemaining = (endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    const diff = end.getTime() - now.getTime()
    
    if (diff <= 0) return 'Finalizado'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500'
      case 'rare': return 'bg-blue-500'
      case 'epic': return 'bg-purple-500'
      case 'legendary': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Común'
      case 'rare': return 'Raro'
      case 'epic': return 'Épico'
      case 'legendary': return 'Legendario'
      default: return 'Común'
    }
  }

  const handleClaimReward = (eventId: string, rewardId: string) => {
    const reward = claimReward(eventId, rewardId)
    if (reward) {
      // Aquí se podría integrar con el sistema de monedas del juego
      console.log('Recompensa reclamada:', reward)
    }
  }

  const EventCard = ({ event }: { event: any }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={() => {
        setSelectedEvent(event)
        setShowEventDetails(true)
      }}
    >
      <Card className="p-4 bg-gradient-to-br from-white to-gray-50 border-2 hover:border-blue-300 transition-all duration-300">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{event.icon}</div>
            <div>
              <h3 className="font-bold text-lg text-gray-800">{event.name}</h3>
              <p className="text-sm text-gray-600">{event.description}</p>
            </div>
          </div>
          <Badge 
            variant={event.isActive ? "default" : "secondary"}
            className={event.isActive ? "bg-green-500" : "bg-gray-400"}
          >
            {event.isActive ? 'Activo' : 'Próximo'}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Duración:</span>
            <span className="font-medium">
              {formatDate(event.startDate)} - {formatDate(event.endDate)}
            </span>
          </div>
          
          {event.isActive && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Tiempo restante:</span>
              <span className="font-medium text-red-600">
                {getTimeRemaining(event.endDate)}
              </span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Items exclusivos:</span>
            <span className="font-medium">{event.items.length}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Desafíos:</span>
            <span className="font-medium">{event.challenges.length}</span>
          </div>
        </div>
      </Card>
    </motion.div>
  )

  const EventDetailsModal = () => (
    <AnimatePresence>
      {showEventDetails && selectedEvent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowEventDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl">{selectedEvent.icon}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedEvent.name}</h2>
                  <p className="text-gray-600">{selectedEvent.description}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowEventDetails(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <Tabs value="items" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="challenges">Desafíos</TabsTrigger>
                <TabsTrigger value="rewards">Recompensas</TabsTrigger>
              </TabsList>

              <TabsContent value="items" className="space-y-4">
                <h3 className="text-lg font-semibold">Items Exclusivos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {selectedEvent.items.map((item: any) => (
                    <Card key={item.id} className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{item.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <Badge className={getRarityColor(item.rarity)}>
                              {getRarityText(item.rarity)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-green-600">
                                {item.price} 🪙
                              </span>
                              <span className="text-sm text-gray-400 line-through">
                                {item.originalPrice} 🪙
                              </span>
                            </div>
                            <Badge variant="outline" className="text-orange-600 border-orange-600">
                              -{item.discount}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="challenges" className="space-y-4">
                <h3 className="text-lg font-semibold">Desafíos del Evento</h3>
                <div className="space-y-3">
                  {selectedEvent.challenges.map((challenge: any) => (
                    <Card key={challenge.id} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-blue-500" />
                          <h4 className="font-medium">{challenge.name}</h4>
                        </div>
                        {challenge.completed && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{challenge.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progreso: {challenge.progress}/{challenge.requirement.target}</span>
                          <span className="font-medium">
                            {Math.round((challenge.progress / challenge.requirement.target) * 100)}%
                          </span>
                        </div>
                        <Progress 
                          value={(challenge.progress / challenge.requirement.target) * 100} 
                          className="h-2"
                        />
                        <div className="flex items-center gap-2 text-sm text-green-600">
                          <Gift className="h-4 w-4" />
                          <span>Recompensa: {challenge.reward.coins} 🪙</span>
                          {challenge.reward.items && (
                            <span>+ {challenge.reward.items.length} items</span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="rewards" className="space-y-4">
                <h3 className="text-lg font-semibold">Recompensas Especiales</h3>
                <div className="space-y-3">
                  {selectedEvent.rewards.map((reward: any) => (
                    <Card key={reward.id} className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">{reward.icon}</div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{reward.name}</h4>
                              <Badge className={getRarityColor(reward.rarity)}>
                                {getRarityText(reward.rarity)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{reward.description}</p>
                          </div>
                        </div>
                        <Button
                          variant={reward.claimed ? "outline" : "default"}
                          disabled={reward.claimed}
                          onClick={() => handleClaimReward(selectedEvent.id, reward.id)}
                        >
                          {reward.claimed ? 'Reclamado' : 'Reclamar'}
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🎉 Eventos Temáticos
        </h1>
        <p className="text-gray-600">
          Participa en eventos especiales y obtén items exclusivos
        </p>
      </div>

      {/* Notificaciones */}
      {notifications.length > 0 && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              <h3 className="font-semibold text-blue-800">Notificaciones</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={clearNotifications}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {notifications.slice(-3).map((notification, index) => (
              <p key={index} className="text-sm text-blue-700">{notification}</p>
            ))}
          </div>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Eventos Activos</TabsTrigger>
          <TabsTrigger value="upcoming">Próximos</TabsTrigger>
          <TabsTrigger value="all">Todos</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="space-y-4">
          {currentEvents.filter(e => e.isActive).length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentEvents.filter(e => e.isActive).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No hay eventos activos
              </h3>
              <p className="text-gray-500">
                Revisa la pestaña "Próximos" para ver los eventos que están por venir
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No hay eventos próximos
              </h3>
              <p className="text-gray-500">
                Los eventos se anunciarán con anticipación
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {predefinedEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de detalles */}
      <EventDetailsModal />
    </div>
  )
} 