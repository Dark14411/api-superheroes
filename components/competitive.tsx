"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { 
  Trophy, 
  Users, 
  TrendingUp, 
  Target, 
  Star, 
  Crown,
  Medal,
  Award,
  Calendar,
  Clock,
  User,
  Activity,
  Zap,
  Heart,
  Coins,
  Gamepad2,
  Palette,
  Gift
} from "lucide-react"
import { useCompetitive } from "@/hooks/use-competitive"
import { useTranslations } from "@/hooks/use-translations"

export default function Competitive() {
  const [activeTab, setActiveTab] = useState("leaderboard")
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null)
  const [showPlayerDetails, setShowPlayerDetails] = useState(false)
  const { 
    profiles, 
    leaderboard, 
    tournaments, 
    currentPlayer,
    getTopPlayers,
    getActiveTournaments,
    getGlobalStats,
    joinTournament,
    simulatePlayerActivity
  } = useCompetitive()
  const { t } = useTranslations()

  const topPlayers = getTopPlayers(10)
  const activeTournaments = getActiveTournaments()
  const globalStats = getGlobalStats()

  // Simular actividad cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      simulatePlayerActivity()
    }, 30000)

    return () => clearInterval(interval)
  }, [simulatePlayerActivity])

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Maestro': return 'text-yellow-500'
      case 'Diamante': return 'text-blue-500'
      case 'Platino': return 'text-purple-500'
      case 'Oro': return 'text-yellow-600'
      case 'Plata': return 'text-gray-500'
      case 'Bronce': return 'text-orange-600'
      default: return 'text-gray-600'
    }
  }

  const getRankIcon = (rank: string) => {
    switch (rank) {
      case 'Maestro': return '👑'
      case 'Diamante': return '💎'
      case 'Platino': return '🥇'
      case 'Oro': return '🥈'
      case 'Plata': return '🥉'
      case 'Bronce': return '🏅'
      default: return '⭐'
    }
  }

  const getChangeIcon = (change: string) => {
    switch (change) {
      case 'up': return '↗️'
      case 'down': return '↘️'
      case 'new': return '🆕'
      default: return '➡️'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  const PlayerCard = ({ player, rank }: { player: any; rank: number }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={() => {
        setSelectedPlayer(player)
        setShowPlayerDetails(true)
      }}
    >
      <Card className="p-4 hover:shadow-lg transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="text-2xl">{player.avatar}</div>
              <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${player.isOnline ? 'bg-green-500' : 'bg-gray-400'}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-800">{player.username}</h3>
                <Badge className={getRankColor(player.rank)}>
                  {getRankIcon(player.rank)} {player.rank}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">Nivel {player.level} • {player.achievements} logros</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-blue-600">{player.rankPoints} pts</div>
            <div className="text-sm text-gray-500">#{rank}</div>
          </div>
        </div>
      </Card>
    </motion.div>
  )

  const TournamentCard = ({ tournament }: { tournament: any }) => (
    <Card className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {tournament.type === 'daily' ? '📅' : tournament.type === 'weekly' ? '📊' : '🏆'}
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{tournament.name}</h3>
            <p className="text-sm text-gray-600">{tournament.description}</p>
          </div>
        </div>
        <Badge variant="outline" className="border-purple-300 text-purple-600">
          {tournament.participants.length} participantes
        </Badge>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Inicio:</span>
          <span className="font-medium">{formatDate(tournament.startDate)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Fin:</span>
          <span className="font-medium">{formatDate(tournament.endDate)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-gray-700">Recompensas:</h4>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="text-center p-2 bg-yellow-100 rounded">
            <div className="font-bold">🥇 1er</div>
            <div>{tournament.rewards.first.coins} 🪙</div>
          </div>
          <div className="text-center p-2 bg-gray-100 rounded">
            <div className="font-bold">🥈 2do</div>
            <div>{tournament.rewards.second.coins} 🪙</div>
          </div>
          <div className="text-center p-2 bg-orange-100 rounded">
            <div className="font-bold">🥉 3er</div>
            <div>{tournament.rewards.third.coins} 🪙</div>
          </div>
        </div>
      </div>

      <Button 
        className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
        onClick={() => joinTournament(tournament.id, currentPlayer?.id || 'player-1')}
      >
        Participar
      </Button>
    </Card>
  )

  const PlayerDetailsModal = () => (
    <AnimatePresence>
      {showPlayerDetails && selectedPlayer && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowPlayerDetails(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="text-4xl">{selectedPlayer.avatar}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedPlayer.username}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge className={getRankColor(selectedPlayer.rank)}>
                      {getRankIcon(selectedPlayer.rank)} {selectedPlayer.rank}
                    </Badge>
                    <Badge variant={selectedPlayer.isOnline ? "default" : "secondary"}>
                      {selectedPlayer.isOnline ? '🟢 En línea' : '⚫ Desconectado'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{selectedPlayer.level}</div>
                <div className="text-sm text-gray-600">Nivel</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{selectedPlayer.rankPoints}</div>
                <div className="text-sm text-gray-600">Puntos</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{selectedPlayer.achievements}</div>
                <div className="text-sm text-gray-600">Logros</div>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{selectedPlayer.winRate}%</div>
                <div className="text-sm text-gray-600">Victoria</div>
              </div>
            </div>

            <Tabs value="stats" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="stats">Estadísticas</TabsTrigger>
                <TabsTrigger value="badges">Insignias</TabsTrigger>
                <TabsTrigger value="activity">Actividad</TabsTrigger>
              </TabsList>

              <TabsContent value="stats" className="space-y-4">
                <h3 className="text-lg font-semibold">Estadísticas Detalladas</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span>Interacciones con Pou</span>
                    </div>
                    <span className="font-semibold">{selectedPlayer.stats.pouClicks.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-5 w-5 text-green-500" />
                      <span>Items Comprados</span>
                    </div>
                    <span className="font-semibold">{selectedPlayer.stats.itemsPurchased}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Palette className="h-5 w-5 text-purple-500" />
                      <span>Cambios de Personalización</span>
                    </div>
                    <span className="font-semibold">{selectedPlayer.stats.customizationChanges}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Gift className="h-5 w-5 text-yellow-500" />
                      <span>Eventos Participados</span>
                    </div>
                    <span className="font-semibold">{selectedPlayer.stats.eventsParticipated}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue-500" />
                      <span>Tiempo Total Jugado</span>
                    </div>
                    <span className="font-semibold">{formatTime(selectedPlayer.stats.totalPlayTime)}</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="badges" className="space-y-4">
                <h3 className="text-lg font-semibold">Insignias Obtenidas</h3>
                <div className="grid grid-cols-2 gap-3">
                  {selectedPlayer.badges.map((badge: string, index: number) => (
                    <Card key={index} className="p-3 text-center">
                      <div className="text-2xl mb-2">🏅</div>
                      <div className="text-sm font-medium">{badge.replace(/-/g, ' ')}</div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <h3 className="text-lg font-semibold">Actividad Reciente</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Se unió al juego</span>
                    <span className="text-sm text-gray-600">{formatDate(selectedPlayer.joinDate)}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <span className="text-sm">Última actividad</span>
                    <span className="text-sm text-gray-600">{formatDate(selectedPlayer.lastActive)}</span>
                  </div>
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
          🏆 Sistema Competitivo
        </h1>
        <p className="text-gray-600">
          Compite con otros jugadores y alcanza la cima del ranking
        </p>
      </div>

      {/* Estadísticas Globales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{globalStats.totalPlayers}</div>
          <div className="text-sm text-gray-600">Jugadores Totales</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{globalStats.onlinePlayers}</div>
          <div className="text-sm text-gray-600">En Línea</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{globalStats.averageLevel}</div>
          <div className="text-sm text-gray-600">Nivel Promedio</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{globalStats.totalGames}</div>
          <div className="text-sm text-gray-600">Juegos Jugados</div>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="leaderboard">Ranking</TabsTrigger>
          <TabsTrigger value="tournaments">Torneos</TabsTrigger>
          <TabsTrigger value="profiles">Perfiles</TabsTrigger>
        </TabsList>

        <TabsContent value="leaderboard" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Top 10 Jugadores</h3>
            <Badge variant="outline">Actualizado en tiempo real</Badge>
          </div>
          
          <div className="space-y-3">
            {topPlayers.map((entry, index) => (
              <div key={entry.player.id} className="relative">
                {index < 3 && (
                  <div className="absolute -left-2 top-1/2 transform -translate-y-1/2">
                    {index === 0 && <span className="text-2xl">🥇</span>}
                    {index === 1 && <span className="text-2xl">🥈</span>}
                    {index === 2 && <span className="text-2xl">🥉</span>}
                  </div>
                )}
                <PlayerCard player={entry.player} rank={entry.rank} />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tournaments" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Torneos Activos</h3>
            <Badge variant="outline">{activeTournaments.length} activos</Badge>
          </div>
          
          {activeTournaments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeTournaments.map((tournament) => (
                <TournamentCard key={tournament.id} tournament={tournament} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                No hay torneos activos
              </h3>
              <p className="text-gray-500">
                Los torneos se anunciarán próximamente
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="profiles" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Todos los Jugadores</h3>
            <Badge variant="outline">{profiles.length} jugadores</Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profiles.map((player) => (
              <PlayerCard key={player.id} player={player} rank={leaderboard.find(e => e.player.id === player.id)?.rank || 0} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal de detalles del jugador */}
      <PlayerDetailsModal />
    </div>
  )
} 