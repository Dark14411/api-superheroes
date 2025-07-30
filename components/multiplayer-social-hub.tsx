"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  Sword,
  Gift,
  Crown,
  Trophy,
  MessageCircle,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Share2,
  Heart,
  ThumbsUp,
  Star,
  Zap,
  Target,
  Globe,
  MapPin,
  Calendar,
  Clock,
  Shield,
  Flame,
  Gem,
  Coins,
  Award,
  GamepadIcon,
  UserPlus,
  Settings,
  Bell,
  Search,
  Plus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

interface Player {
  id: string
  username: string
  level: number
  avatar: string
  status: 'online' | 'offline' | 'playing' | 'away'
  location: string
  pouLevel: number
  winRate: number
  achievements: number
  coins: number
  lastSeen: Date
}

interface BattleRoom {
  id: string
  name: string
  type: 'pvp' | 'tournament' | 'casual' | 'ranked'
  players: Player[]
  maxPlayers: number
  gameMode: string
  prize: number
  status: 'waiting' | 'active' | 'finished'
  createdAt: Date
}

interface TradeOffer {
  id: string
  fromPlayer: Player
  toPlayer: Player
  offeredItems: any[]
  requestedItems: any[]
  status: 'pending' | 'accepted' | 'rejected' | 'expired'
  createdAt: Date
}

interface Guild {
  id: string
  name: string
  description: string
  members: Player[]
  level: number
  experience: number
  perks: string[]
  requirements: {
    minLevel: number
    minPouLevel: number
  }
  events: any[]
}

export default function MultiplayerSocialHub({ currentPlayer }: { currentPlayer: Player }) {
  const [onlinePlayers, setOnlinePlayers] = useState<Player[]>([
    {
      id: '1',
      username: 'PouMaster',
      level: 25,
      avatar: '🏆',
      status: 'online',
      location: 'Mexico',
      pouLevel: 30,
      winRate: 87,
      achievements: 45,
      coins: 12500,
      lastSeen: new Date()
    },
    {
      id: '2',
      username: 'GamerQueen',
      level: 18,
      avatar: '👑',
      status: 'playing',
      location: 'España',
      pouLevel: 22,
      winRate: 72,
      achievements: 28,
      coins: 8900,
      lastSeen: new Date()
    },
    {
      id: '3',
      username: 'PetLover',
      level: 32,
      avatar: '🐾',
      status: 'online',
      location: 'Argentina',
      pouLevel: 35,
      winRate: 91,
      achievements: 67,
      coins: 18750,
      lastSeen: new Date()
    }
  ])

  const [battleRooms, setBattleRooms] = useState<BattleRoom[]>([
    {
      id: '1',
      name: 'Arena de Campeones',
      type: 'ranked',
      players: onlinePlayers.slice(0, 2),
      maxPlayers: 4,
      gameMode: 'Batalla Pou',
      prize: 500,
      status: 'waiting',
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Torneo Diario',
      type: 'tournament',
      players: onlinePlayers,
      maxPlayers: 8,
      gameMode: 'Eliminación',
      prize: 2000,
      status: 'active',
      createdAt: new Date()
    }
  ])

  const [tradeOffers, setTradeOffers] = useState<TradeOffer[]>([])
  const [guilds, setGuilds] = useState<Guild[]>([
    {
      id: '1',
      name: 'Maestros Pou',
      description: 'Los mejores entrenadores de Pou del mundo',
      members: onlinePlayers,
      level: 15,
      experience: 75,
      perks: ['XP +20%', 'Monedas +15%', 'Eventos exclusivos'],
      requirements: { minLevel: 20, minPouLevel: 25 },
      events: []
    }
  ])

  const [chatMessages, setChatMessages] = useState<any[]>([
    {
      id: '1',
      player: onlinePlayers[0],
      message: '¡Hola a todos! ¿Alguien quiere una batalla?',
      timestamp: new Date(),
      type: 'text'
    },
    {
      id: '2',
      player: onlinePlayers[1],
      message: '¡Yo acepto el desafío! 🔥',
      timestamp: new Date(),
      type: 'text'
    }
  ])

  const [newMessage, setNewMessage] = useState("")
  const [selectedRoom, setSelectedRoom] = useState<BattleRoom | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(false)

  // Simular jugadores en línea en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlinePlayers(prev => prev.map(player => ({
        ...player,
        status: Math.random() > 0.8 ? 
          ['online', 'playing', 'away'][Math.floor(Math.random() * 3)] as any : 
          player.status
      })))
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // Enviar mensaje al chat
  const sendMessage = () => {
    if (!newMessage.trim()) return

    const message = {
      id: Date.now().toString(),
      player: currentPlayer,
      message: newMessage,
      timestamp: new Date(),
      type: 'text'
    }

    setChatMessages(prev => [...prev, message])
    setNewMessage("")
    toast.success("Mensaje enviado")
  }

  // Crear sala de batalla
  const createBattleRoom = () => {
    const newRoom: BattleRoom = {
      id: Date.now().toString(),
      name: `Sala de ${currentPlayer.username}`,
      type: 'casual',
      players: [currentPlayer],
      maxPlayers: 4,
      gameMode: 'Batalla Rápida',
      prize: 100,
      status: 'waiting',
      createdAt: new Date()
    }

    setBattleRooms(prev => [newRoom, ...prev])
    setSelectedRoom(newRoom)
    toast.success("¡Sala de batalla creada!")
  }

  // Unirse a sala de batalla
  const joinBattleRoom = (room: BattleRoom) => {
    if (room.players.length >= room.maxPlayers) {
      toast.error("Sala llena")
      return
    }

    setBattleRooms(prev => prev.map(r => 
      r.id === room.id 
        ? { ...r, players: [...r.players, currentPlayer] }
        : r
    ))
    setSelectedRoom(room)
    toast.success(`Te uniste a ${room.name}`)
  }

  // Crear oferta de intercambio
  const createTradeOffer = (targetPlayer: Player) => {
    const offer: TradeOffer = {
      id: Date.now().toString(),
      fromPlayer: currentPlayer,
      toPlayer: targetPlayer,
      offeredItems: [],
      requestedItems: [],
      status: 'pending',
      createdAt: new Date()
    }

    setTradeOffers(prev => [offer, ...prev])
    toast.success(`Oferta de intercambio enviada a ${targetPlayer.username}`)
  }

  // Filtrar jugadores
  const filteredPlayers = onlinePlayers.filter(player =>
    player.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.location.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header Social */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Hub Social Multijugador</h1>
              <p className="opacity-90">Conecta, compite y diviértete con jugadores de todo el mundo</p>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold">{onlinePlayers.length} Jugadores Online</div>
              <div className="text-sm opacity-90">🌍 Conexión Global</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="players" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="players">👥 Jugadores</TabsTrigger>
          <TabsTrigger value="battles">⚔️ Batallas</TabsTrigger>
          <TabsTrigger value="chat">💬 Chat Global</TabsTrigger>
          <TabsTrigger value="trades">🔄 Intercambios</TabsTrigger>
          <TabsTrigger value="guilds">🏰 Guilds</TabsTrigger>
          <TabsTrigger value="events">🎉 Eventos</TabsTrigger>
        </TabsList>

        {/* Jugadores Online */}
        <TabsContent value="players">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Input
                placeholder="Buscar jugadores por nombre o país..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button>
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlayers.map((player) => (
                <Card key={player.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={`/avatars/${player.id}.png`} />
                        <AvatarFallback className="text-xl">{player.avatar}</AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{player.username}</h3>
                          <div className={`h-2 w-2 rounded-full ${
                            player.status === 'online' ? 'bg-green-500' :
                            player.status === 'playing' ? 'bg-yellow-500' :
                            player.status === 'away' ? 'bg-orange-500' : 'bg-gray-500'
                          }`} />
                        </div>
                        
                        <div className="text-sm text-gray-600 space-y-1">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {player.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">Lv. {player.level}</Badge>
                            <Badge variant="outline" className="text-xs">Pou Lv. {player.pouLevel}</Badge>
                          </div>
                          <div className="flex items-center gap-4 text-xs">
                            <span>🏆 {player.winRate}%</span>
                            <span>🎖️ {player.achievements}</span>
                            <span>🪙 {player.coins}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" onClick={() => createTradeOffer(player)}>
                        <Gift className="h-3 w-3 mr-1" />
                        Intercambiar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Sword className="h-3 w-3 mr-1" />
                        Desafiar
                      </Button>
                      <Button size="sm" variant="outline">
                        <UserPlus className="h-3 w-3 mr-1" />
                        Añadir
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Salas de Batalla */}
        <TabsContent value="battles">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Salas de Batalla Activas</h2>
              <Button onClick={createBattleRoom}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Sala
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {battleRooms.map((room) => (
                <Card key={room.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold">{room.name}</h3>
                        <p className="text-sm text-gray-600">{room.gameMode}</p>
                      </div>
                      <Badge variant={
                        room.type === 'ranked' ? 'destructive' :
                        room.type === 'tournament' ? 'default' : 'secondary'
                      }>
                        {room.type}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Jugadores:</span>
                        <span>{room.players.length}/{room.maxPlayers}</span>
                      </div>
                      <Progress value={(room.players.length / room.maxPlayers) * 100} />
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Coins className="h-4 w-4 text-yellow-500" />
                        <span>Premio: {room.prize} monedas</span>
                      </div>

                      <div className="flex -space-x-2">
                        {room.players.map((player, i) => (
                          <Avatar key={i} className="h-6 w-6 border-2 border-white">
                            <AvatarFallback className="text-xs">{player.avatar}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>

                    <Button 
                      className="w-full mt-3" 
                      size="sm"
                      onClick={() => joinBattleRoom(room)}
                      disabled={room.players.length >= room.maxPlayers}
                    >
                      {room.status === 'waiting' ? 'Unirse' : 'Espectador'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Chat Global */}
        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Chat Global
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant={voiceEnabled ? "default" : "outline"}
                    onClick={() => setVoiceEnabled(!voiceEnabled)}
                  >
                    {voiceEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    size="sm"
                    variant={videoEnabled ? "default" : "outline"}
                    onClick={() => setVideoEnabled(!videoEnabled)}
                  >
                    {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="h-96 overflow-y-auto space-y-3 p-3 bg-gray-50 rounded-lg">
                {chatMessages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-sm">{msg.player.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm">{msg.player.username}</span>
                        <Badge variant="outline" className="text-xs">Lv. {msg.player.level}</Badge>
                        <span className="text-xs text-gray-500">
                          {msg.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm mt-1">{msg.message}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Escribe un mensaje..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage}>
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Intercambios */}
        <TabsContent value="trades">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Sistema de Intercambios</h2>
              <Badge>{tradeOffers.length} Ofertas Activas</Badge>
            </div>

            {tradeOffers.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Gift className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-semibold mb-2">No hay intercambios activos</h3>
                  <p className="text-gray-600 mb-4">Busca jugadores para comenzar a intercambiar items</p>
                  <Button>Explorar Jugadores</Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {tradeOffers.map((offer) => (
                  <Card key={offer.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>{offer.fromPlayer.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">{offer.fromPlayer.username}</p>
                            <p className="text-sm text-gray-600">
                              Intercambio con {offer.toPlayer.username}
                            </p>
                          </div>
                        </div>
                        <Badge variant={
                          offer.status === 'pending' ? 'default' :
                          offer.status === 'accepted' ? 'secondary' : 'destructive'
                        }>
                          {offer.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* Guilds */}
        <TabsContent value="guilds">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Guilds Disponibles</h2>
              <Button>
                <Crown className="h-4 w-4 mr-2" />
                Crear Guild
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {guilds.map((guild) => (
                <Card key={guild.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{guild.name}</h3>
                        <p className="text-sm text-gray-600">{guild.description}</p>
                      </div>
                      <Badge>Nivel {guild.level}</Badge>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Experiencia del Guild</span>
                          <span>{guild.experience}/100</span>
                        </div>
                        <Progress value={guild.experience} />
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Beneficios:</p>
                        <div className="flex flex-wrap gap-1">
                          {guild.perks.map((perk, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {perk}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex justify-between text-sm">
                        <span>Miembros: {guild.members.length}/50</span>
                        <span>Req: Lv.{guild.requirements.minLevel}+</span>
                      </div>

                      <Button className="w-full">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Solicitar Unirse
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Eventos */}
        <TabsContent value="events">
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Eventos Multijugador</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Evento Semanal */}
              <Card className="border-l-4 border-l-purple-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="h-5 w-5 text-purple-500" />
                    <h3 className="font-semibold">Torneo Semanal</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Compite por el título de Maestro Pou de la semana
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Participantes:</span>
                      <span>156/200</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Premio:</span>
                      <span>5,000 🪙 + 🏆</span>
                    </div>
                    <Button size="sm" className="w-full">Participar</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Evento Diario */}
              <Card className="border-l-4 border-l-green-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-5 w-5 text-green-500" />
                    <h3 className="font-semibold">Desafío Diario</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Completa 5 batallas en equipo hoy
                  </p>
                  <div className="space-y-2">
                    <Progress value={40} />
                    <div className="flex justify-between text-sm">
                      <span>Progreso: 2/5</span>
                      <span>Expira en: 8h</span>
                    </div>
                    <Button size="sm" className="w-full">Continuar</Button>
                  </div>
                </CardContent>
              </Card>

              {/* Evento Especial */}
              <Card className="border-l-4 border-l-yellow-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-500" />
                    <h3 className="font-semibold">Evento Especial</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">
                    Celebración del Mes del Pou - Recompensas dobles
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tiempo restante:</span>
                      <span>15 días</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Bonus activo:</span>
                      <span>+100% XP</span>
                    </div>
                    <Button size="sm" className="w-full">Ver Detalles</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}