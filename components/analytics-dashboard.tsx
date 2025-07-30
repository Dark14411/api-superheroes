"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  BarChart3, 
  Clock, 
  Coins, 
  Gamepad2, 
  Trophy, 
  ShoppingBag,
  Palette,
  Activity,
  TrendingUp,
  Calendar,
  RefreshCw,
  Download
} from "lucide-react"
import { useAnalytics } from "@/hooks/use-analytics"
import { useTranslations } from "@/hooks/use-translations"

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const { getStats, getRecentActions, resetMetrics } = useAnalytics()
  const { t } = useTranslations()

  const stats = getStats()
  const recentActions = getRecentActions(20)

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'pou_click': return '🐾'
      case 'purchase': return '🛒'
      case 'coin_earned': return '💰'
      case 'game_played': return '🎮'
      case 'achievement_unlocked': return '🏆'
      case 'customization_change': return '🎨'
      case 'store_visit': return '🏪'
      default: return '📊'
    }
  }

  const getActionName = (action: string) => {
    switch (action) {
      case 'pou_click': return t('analytics.pouClick')
      case 'purchase': return t('analytics.purchase')
      case 'coin_earned': return t('analytics.coinEarned')
      case 'game_played': return t('analytics.gamePlayed')
      case 'achievement_unlocked': return t('analytics.achievementUnlocked')
      case 'customization_change': return t('analytics.customizationChange')
      case 'store_visit': return t('analytics.storeVisit')
      default: return action
    }
  }

  const exportData = () => {
    const data = {
      stats,
      recentActions,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `pou-analytics-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-6xl mx-auto p-3 sm:p-6">
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 flex items-center justify-center gap-2">
          <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8" />
          {t('analytics.title')}
        </h2>
        <p className="text-gray-600 mb-4 sm:mb-6 px-4">{t('analytics.subtitle')}</p>
        
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={exportData}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {t('analytics.export')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={resetMetrics}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <RefreshCw className="w-4 h-4" />
            {t('analytics.reset')}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">{t('analytics.overview')}</span>
            <span className="sm:hidden">{t('analytics.overview').slice(0, 4)}</span>
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">{t('analytics.details')}</span>
            <span className="sm:hidden">{t('analytics.details').slice(0, 4)}</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">{t('analytics.activity')}</span>
            <span className="sm:hidden">{t('analytics.activity').slice(0, 4)}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <Card className="p-3 sm:p-4 text-center bg-gradient-to-br from-blue-50 to-cyan-50">
              <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-blue-600">
                {formatTime(stats.timePlayed)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">{t('analytics.totalTime')}</div>
            </Card>

            <Card className="p-3 sm:p-4 text-center bg-gradient-to-br from-green-50 to-emerald-50">
              <Coins className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-green-600">
                {formatNumber(stats.coinsEarned)}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">{t('analytics.coinsEarned')}</div>
            </Card>

            <Card className="p-3 sm:p-4 text-center bg-gradient-to-br from-purple-50 to-pink-50">
              <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-purple-600">
                {stats.gamesPlayed}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">{t('analytics.gamesPlayed')}</div>
            </Card>

            <Card className="p-3 sm:p-4 text-center bg-gradient-to-br from-yellow-50 to-orange-50">
              <Trophy className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 mx-auto mb-2" />
              <div className="text-lg sm:text-2xl font-bold text-yellow-600">
                {stats.achievementsUnlocked}
              </div>
              <div className="text-xs sm:text-sm text-gray-600">{t('analytics.achievements')}</div>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                {t('analytics.sessionStats')}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('analytics.sessionDuration')}:</span>
                  <span className="font-medium">{formatTime(stats.sessionDuration)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('analytics.actionsPerMinute')}:</span>
                  <span className="font-medium">{stats.actionsPerMinute.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('analytics.coinsPerHour')}:</span>
                  <span className="font-medium">{stats.coinsPerHour.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('analytics.totalSessions')}:</span>
                  <span className="font-medium">{stats.totalSessions}</span>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                {t('analytics.activitySummary')}
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('analytics.pouInteractions')}:</span>
                  <span className="font-medium">{stats.pouInteractions}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('analytics.storeVisits')}:</span>
                  <span className="font-medium">{stats.storeVisits}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('analytics.itemsPurchased')}:</span>
                  <span className="font-medium">{stats.itemsPurchased}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('analytics.customizationChanges')}:</span>
                  <span className="font-medium">{stats.customizationChanges}</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Coins className="w-5 h-5" />
                {t('analytics.economy')}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium">{t('analytics.coinsEarned')}</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    +{formatNumber(stats.coinsEarned)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                  <span className="text-sm font-medium">{t('analytics.coinsSpent')}</span>
                  <Badge variant="secondary" className="bg-red-100 text-red-800">
                    -{formatNumber(stats.coinsSpent)}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">{t('analytics.netCoins')}</span>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    {formatNumber(stats.coinsEarned - stats.coinsSpent)}
                  </Badge>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Gamepad2 className="w-5 h-5" />
                {t('analytics.gaming')}
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">{t('analytics.gamesPlayed')}</span>
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                    {stats.gamesPlayed}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium">{t('analytics.achievements')}</span>
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    {stats.achievementsUnlocked}
                  </Badge>
                </div>
                <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                  <span className="text-sm font-medium">{t('analytics.pouInteractions')}</span>
                  <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                    {stats.pouInteractions}
                  </Badge>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card className="p-4 sm:p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              {t('analytics.recentActivity')}
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {recentActions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {t('analytics.noActivity')}
                </div>
              ) : (
                recentActions.map((action) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    <span className="text-2xl">{getActionIcon(action.action)}</span>
                    <div className="flex-1">
                      <div className="font-medium text-sm">{getActionName(action.action)}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(action.timestamp).toLocaleString()}
                      </div>
                    </div>
                    {action.details && (
                      <Badge variant="outline" className="text-xs">
                        {JSON.stringify(action.details)}
                      </Badge>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 