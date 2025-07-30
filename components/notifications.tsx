"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Star, 
  Trophy, 
  Heart, 
  Zap, 
  Coins,
  Gem,
  Users,
  Target,
  Clock,
  Settings
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'achievement' | 'level_up' | 'pet_action' | 'social'
  title: string
  message: string
  timestamp: Date
  read: boolean
  icon?: string
  data?: any
}

interface NotificationsProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
}

export function Notifications({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onDelete 
}: NotificationsProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'unread' | 'achievements' | 'social'>('all')

  const unreadCount = notifications.filter(n => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />
      case 'info':
        return <Info className="w-5 h-5 text-blue-500" />
      case 'achievement':
        return <Trophy className="w-5 h-5 text-yellow-500" />
      case 'level_up':
        return <Star className="w-5 h-5 text-purple-500" />
      case 'pet_action':
        return <Heart className="w-5 h-5 text-pink-500" />
      case 'social':
        return <Users className="w-5 h-5 text-blue-500" />
      default:
        return <Bell className="w-5 h-5 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500 bg-green-50'
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'info':
        return 'border-l-blue-500 bg-blue-50'
      case 'achievement':
        return 'border-l-yellow-500 bg-yellow-50'
      case 'level_up':
        return 'border-l-purple-500 bg-purple-50'
      case 'pet_action':
        return 'border-l-pink-500 bg-pink-50'
      case 'social':
        return 'border-l-blue-500 bg-blue-50'
      default:
        return 'border-l-gray-500 bg-gray-50'
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read
    if (filter === 'achievements') return notification.type === 'achievement'
    if (filter === 'social') return notification.type === 'social'
    return true
  })

  return (
    <div className="relative">
      {/* Botón de notificaciones */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs bg-red-500"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Panel de notificaciones */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 top-12 w-96 max-h-96 bg-white rounded-lg shadow-xl border z-50"
          >
            <Card className="border-0 shadow-none">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Notificaciones</CardTitle>
                  <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={onMarkAllAsRead}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        Marcar todas como leídas
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Filtros */}
                <div className="flex gap-1">
                  <Button
                    variant={filter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('all')}
                    className="text-xs"
                  >
                    Todas
                  </Button>
                  <Button
                    variant={filter === 'unread' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('unread')}
                    className="text-xs"
                  >
                    No leídas ({unreadCount})
                  </Button>
                  <Button
                    variant={filter === 'achievements' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('achievements')}
                    className="text-xs"
                  >
                    Logros
                  </Button>
                  <Button
                    variant={filter === 'social' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter('social')}
                    className="text-xs"
                  >
                    Social
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No hay notificaciones</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-3 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md ${
                          getNotificationColor(notification.type)
                        } ${!notification.read ? 'ring-2 ring-blue-200' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                  <Clock className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(notification.timestamp, { 
                                      addSuffix: true, 
                                      locale: es 
                                    })}
                                  </span>
                                  {!notification.read && (
                                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-800">
                                      Nuevo
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-1 ml-2">
                                {!notification.read && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => onMarkAsRead(notification.id)}
                                    className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700"
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => onDelete(notification.id)}
                                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                                >
                                  <X className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {filteredNotifications.length > 0 && (
                  <div className="pt-3 border-t mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{filteredNotifications.length} notificaciones</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFilter('all')}
                        className="text-xs text-blue-600 hover:text-blue-700"
                      >
                        Ver todas
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 